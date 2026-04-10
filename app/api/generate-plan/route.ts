import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { buildSkeleton, parseAthleteInputs } from "@/lib/plan-skeleton";
import type { PlanSkeleton, WeekSkeleton } from "@/lib/plan-skeleton";
import { calculateZones } from "@/lib/plan-zones";
import { buildPartialHtml } from "@/lib/plan-html";
import type { WeekContent, SessionContent } from "@/lib/plan-html";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export const maxDuration = 300;

const CHUNK_SIZE = 5;

/* ─── POST /api/generate-plan ─────────────────────────────────────
   Body: { submission_id: string }
   Pass 1: Calculate skeleton, generate static HTML + first chunk
   of week sessions via AI (JSON), assemble HTML, save to DB,
   trigger continue route.
   ────────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const { submission_id } = await req.json();

    if (!submission_id) {
      return NextResponse.json({ error: "Missing submission_id" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );

    const { data: sub, error: dbError } = await supabase
      .from("intake_submissions")
      .select("*")
      .eq("id", submission_id)
      .single();

    if (dbError || !sub) {
      return NextResponse.json({ error: "Submission not found", detail: dbError?.message }, { status: 404 });
    }

    if (sub.status !== "paid") {
      return NextResponse.json({ error: "Submission not paid" }, { status: 402 });
    }

    const d = sub.data as Record<string, unknown>;

    /* ── Calculate deterministic skeleton ───────────────────── */
    const inputs = parseAthleteInputs(d, sub);
    const skeleton = buildSkeleton(inputs);
    const zones = calculateZones(d);

    const totalWeeks = skeleton.totalWeeks;
    const endWeek = Math.min(CHUNK_SIZE, totalWeeks);

    console.log(`Plan: ${totalWeeks} weeks, chunk 1: weeks 1-${endWeek}`);

    /* ── Build athlete profile for AI prompt ────────────────── */
    const athleteProfile = buildAthleteProfile(d, sub);
    const age = d.age ? parseInt(String(d.age), 10) : undefined;
    const research = loadResearchContent(
      d.trainingFor as string,
      isNaN(age as number) ? undefined : age,
    );

    /* ── Call AI for session content (weeks 1-${endWeek}) ──── */
    const weeksToGenerate = skeleton.weeks.filter(w => w.weekNumber <= endWeek);
    const sessionPrompt = buildSessionPrompt(
      weeksToGenerate, athleteProfile, research, skeleton, false,
    );

    let weekContents: WeekContent[];
    try {
      const result = await callAiForSessions(sessionPrompt, research);
      weekContents = result.response.weeks;
    } catch (e) {
      console.error("Claude API error (pass 1):", e);
      return NextResponse.json({ error: "Failed to generate plan (pass 1)" }, { status: 500 });
    }

    /* ── Assemble HTML ─────────────────────────────────────── */
    const { html, lastPhase } = buildPartialHtml(
      skeleton, zones, weekContents, d, sub.plan || "premium",
      1, endWeek, true, null,
    );

    /* ── Save pass 1 to DB ─────────────────────────────────── */
    await supabase
      .from("intake_submissions")
      .update({ generated_plan_part1: html })
      .eq("id", submission_id);

    /* ── Cron will pick up from here and call continue ────── */
    return NextResponse.json({ ok: true, status: "generating", pass: 1, weeksGenerated: endWeek });
  } catch (e: unknown) {
    console.error("Unhandled error in generate-plan:", e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Unhandled error", detail: message }, { status: 500 });
  }
}

/* ─── AI Session Generation ──────────────────────────────────── */

function buildSessionPrompt(
  weeks: WeekSkeleton[],
  athleteProfile: string,
  research: string,
  skeleton: PlanSkeleton,
  includeFinalSections: boolean,
): string {
  const weekDescriptions = weeks.map(w => {
    const dayLines = w.sessions.map(s =>
      `  ${s.day} | ${s.sessionType} | ${s.discipline} | ${s.durationMinutes} min | ${s.zone}${s.includeStrength ? " | + 15-20 min strength supplement after run" : ""}`
    ).join("\n");
    return `Week ${w.weekNumber} — ${w.phase}${w.isRecovery ? " (Recovery)" : ""}
Volume: ${w.totalMinutes} min (${w.volumePercent}% of peak)
Date range: ${w.dateRange}
Sessions:
${dayLines}`;
  }).join("\n\n");

  let prompt = `You are an elite endurance coach writing detailed session content for a personalised training plan.

ATHLETE PROFILE:
${athleteProfile}

${research ? `COACHING RESEARCH — use these insights to inform session design and coaching notes:\n${research}\n` : ""}

TASK: Write session details for the weeks listed below. The structure (days, session types, durations, zones) is already decided. You write the creative coaching content.

FOR EACH SESSION, PROVIDE:
- sessionName: A descriptive name (e.g., "Easy Recovery Run", "Threshold Swim Set", "Long Endurance Ride")
- warmUp: Specific warm-up protocol (minimum 10-15 min for run/bike, 200-400m for swim, 5-10 min for strength)
- mainSet: Detailed main set with specific distances, paces, intervals, rest periods. Reference the athlete's zones.
- coolDown: Specific cool-down protocol (minimum 5-10 min for run/bike, 100-200m for swim)
- total: Total distance or time summary (e.g., "8-9km" or "45 min total")
- coachingNote: 3+ sentences of personalised coaching. Include hydration reminders for sessions over 60 min. Include fuelling guidance for sessions over 90 min.

RULES:
- All swim distances MUST be multiples of 50m (50, 100, 150, 200, 400, etc). NEVER use 75m, 125m, etc.
- Freestyle (front crawl) only for swimming — no backstroke, breaststroke, or butterfly
- Reference the athlete's specific pace/HR/power zones where relevant
- Progress difficulty within each phase (earlier weeks slightly easier than later weeks)
- Recovery weeks should have reduced intensity, not just reduced volume
- Sessions marked "+ strength supplement": in the coaching note, recommend 1-2 strength sessions per week to complement their running. Advise on timing (after easy runs or on separate days, never before quality sessions), focus areas (hip stability, glute activation, calf/ankle resilience, core — whatever reduces their injury risk), and intensity (moderate load, not to failure — it should support running, not create fatigue). Do NOT prescribe specific exercises or a strength workout — just coach them on how to approach it.
- Coaching notes should be encouraging, specific, and actionable
- LONG RUN DISTANCES: Calculate the "total" distance from the session duration and the athlete's easy pace. Marathon peak long runs should reach 30-35km (cap at 3-3.5 hours). Half marathon peak long runs: 18-21km. The distance in the "total" field must be realistic for the given duration and pace — do not underestimate.
- BRICK SESSIONS: The bike leg IS the warm-up for the run. Do NOT include a separate run warm-up — transition straight from bike to run. The warm-up field should cover the bike portion only.
- ATHLETE LEVEL AWARENESS: Match warm-up/cool-down and recovery to the athlete's experience. Experienced athletes with a strong training base do NOT need walk breaks or walk/jog recovery during easy runs. Only prescribe walk breaks for true beginners or athletes returning from injury.
- TRIATHLON WEAKEST DISCIPLINE: If the athlete has identified a weakest discipline, coaching notes for that discipline should emphasise technique improvement and progressive overload. Extra sessions in the weakest discipline are already scheduled — reinforce why this focus matters.

${weekDescriptions}`;

  if (includeFinalSections) {
    prompt += `

ALSO generate these one-time sections in your JSON response:

"raceDayProtocol": {
  "preRaceTimeline": "HTML content with <div class='timeline'> containing <div class='time-block'><strong>Time</strong><p>Details</p></div> elements for race morning",
  "raceStrategy": "HTML content with race pacing strategy, split targets, nutrition plan",
  "mentalStrategy": "HTML content with mental cues, mantras, course segment strategies"
},
"glossary": [{"term": "RPE", "definition": "Rate of Perceived Exertion..."}, ...] (10-15 terms),
"tips": [{"icon": "material_symbol_name", "title": "Tip Title", "description": "Tip details..."}, ...] (6-8 tips, icons from: track_changes, local_cafe, directions_run, psychology, bolt, celebration, health_and_safety, trending_up, pool, directions_bike, nutrition, bedtime, self_improvement),
"phaseDescriptions": {
  "BASE": "2-3 sentence coaching explanation of this phase...",
  "BUILD": "...",
  "PEAK": "...",
  "TAPER": "..."
}`;
  }

  prompt += `

Respond with ONLY valid JSON. No markdown, no explanation, no code fences. The JSON schema:
{
  "weeks": [
    {
      "weekNumber": 1,
      "weeklySummary": "2-3 sentence overview of this week's focus and goals",
      "sessions": [
        {
          "sessionName": "...",
          "warmUp": "...",
          "mainSet": "...",
          "coolDown": "...",
          "total": "...",
          "coachingNote": "..."
        }
      ]
    }
  ]${includeFinalSections ? `,
  "raceDayProtocol": { "preRaceTimeline": "...", "raceStrategy": "...", "mentalStrategy": "..." },
  "glossary": [...],
  "tips": [...],
  "phaseDescriptions": { "BASE": "...", "BUILD": "...", "PEAK": "...", "TAPER": "..." }` : ""}
}`;

  return prompt;
}

interface AiCallResult {
  response: AiResponse;
  usage: { input: number; output: number; cacheRead: number; cacheCreate: number };
}

async function callAiForSessions(prompt: string, research: string): Promise<AiCallResult> {
  const systemPrompt = `You are an elite endurance coach at Plan Metric. Return ONLY valid JSON — no markdown, no code fences, no explanation.${research ? `\n\nCOACHING RESEARCH:\n${research}` : ""}`;

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16000,
    system: [
      { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: prompt }],
  });

  const message = await stream.finalMessage();
  const textBlock = message.content.find(b => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const usage = {
    input: message.usage?.input_tokens || 0,
    output: message.usage?.output_tokens || 0,
    cacheRead: (message.usage as unknown as Record<string, number>)?.cache_read_input_tokens || 0,
    cacheCreate: (message.usage as unknown as Record<string, number>)?.cache_creation_input_tokens || 0,
  };

  console.log(`AI tokens — input: ${usage.input} (cache read: ${usage.cacheRead}, cache create: ${usage.cacheCreate}), output: ${usage.output}`);

  return { response: parseAiResponse(textBlock.text), usage };
}

interface AiResponse {
  weeks: WeekContent[];
  raceDayProtocol?: { preRaceTimeline: string; raceStrategy: string; mentalStrategy: string };
  glossary?: { term: string; definition: string }[];
  tips?: { icon: string; title: string; description: string }[];
  phaseDescriptions?: Record<string, string>;
}

function parseAiResponse(text: string): AiResponse {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract the outermost JSON object
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("Failed to parse AI response as JSON");
  }
}

/* ─── Helpers (kept from original for AI prompt building) ─────── */

function buildAthleteProfile(d: Record<string, unknown>, sub: Record<string, unknown>): string {
  const lines: string[] = [];
  const add = (label: string, value: unknown) => {
    if (value && value !== "" && value !== false) {
      const v = Array.isArray(value) ? value.join(", ") : String(value);
      lines.push(`${label}: ${v}`);
    }
  };

  lines.push("=== PLAN TYPE ===");
  add("Plan", sub.plan);
  add("Today's Date", new Date().toISOString().split("T")[0]);

  lines.push("\n=== PERSONAL ===");
  add("Name", d.fullName); add("Age", d.age); add("Gender", d.gender);
  add("Height", d.height ? `${d.height} cm` : "");
  add("Weight", d.weight ? `${d.weight} kg` : "");
  add("Location", d.location);

  lines.push("\n=== RACE & GOAL ===");
  add("Training For", d.trainingFor);
  add("Race Name", d.raceName); add("Race Date", d.raceDate);
  add("Main Goal", d.mainGoal); add("Target Time", d.targetTime);
  add("Completed Before", d.completedRaceBefore);
  add("Previous Finish Time", d.previousFinishTime);

  lines.push("\n=== CURRENT FITNESS ===");
  add("Training Consistency", d.trainingConsistency);
  add("Recent Race Result", d.recentRaceResult);
  add("Max HR", d.maxHRUnknown ? "Unknown" : d.maxHR ? `${d.maxHR} BPM` : "");
  add("Resting HR", d.restingHRUnknown ? "Unknown" : d.restingHR ? `${d.restingHR} BPM` : "");

  lines.push("\n=== SWIM ===");
  add("Easy Pace", d.swimPaceEasy ? `${d.swimPaceEasy}/100m` : "");
  add("Threshold Pace", d.swimPaceHard ? `${d.swimPaceHard}/100m` : "");
  add("Weekly Volume", d.weeklySwimVolume);
  add("Longest Swim", d.longestSwim ? `${d.longestSwim}m` : "");

  lines.push("\n=== BIKE ===");
  add("Avg Speed", d.avgBikeSpeed ? `${d.avgBikeSpeed} km/h` : "");
  add("FTP", d.ftpUnknown ? "Unknown" : d.ftp ? `${d.ftp}W` : "");
  add("Weekly Volume", d.weeklyBikeVolume);
  add("Longest Ride", d.longestRide);

  lines.push("\n=== RUN ===");
  add("Weekly Distance", d.weeklyRunDistance ? `${d.weeklyRunDistance} km` : "");
  add("Longest Run", d.longestRun ? `${d.longestRun} km` : "");
  add("Easy Pace", d.easyRunPace ? `${d.easyRunPace}/km` : "");
  add("Recent Race", d.recentRunRace);

  lines.push("\n=== HEALTH & RECOVERY ===");
  add("Current Injuries", d.currentInjuries);
  add("Injury Description", d.injuryDescription);
  add("Injury History", d.injuryHistory);
  add("Avg Sleep", d.avgSleep);
  add("Stress Level", d.stressLevel);

  lines.push("\n=== MOTIVATION ===");
  add("Training Preference", d.trainingPreference);
  add("Motivation", d.motivation);
  add("Athlete Notes", d.anythingElse);

  return lines.join("\n");
}

function loadResearchContent(trainingFor: string, athleteAge?: number): string {
  const researchDir = path.resolve(process.cwd(), "docs/research");
  const TRIATHLON = ["Sprint Triathlon", "Olympic Triathlon", "70.3 Ironman", "Full Ironman"];
  const CYCLING = ["Cycling Event"];

  const files = [
    "nutrition.md", "recovery.md", "general-triathlon.md",
    "periodisation.md", "strength-conditioning.md", "training-load.md", "race-psychology.md",
  ];

  if (TRIATHLON.includes(trainingFor)) {
    files.push("swim.md", "bike.md", "run.md");
  } else if (CYCLING.includes(trainingFor)) {
    files.push("bike.md");
  } else {
    files.push("run.md");
  }

  if (athleteAge && athleteAge >= 40) {
    files.push("masters-athletes.md");
  }

  const MAX_CHARS_PER_FILE = 2000;
  const sections: string[] = [];
  for (const file of files) {
    try {
      let content = fs.readFileSync(path.join(researchDir, file), "utf-8");
      if (content.length > MAX_CHARS_PER_FILE) {
        content = content.slice(0, MAX_CHARS_PER_FILE) + "\n[...truncated]";
      }
      const label = file.replace(".md", "").replace(/-/g, " ").toUpperCase();
      sections.push(`--- ${label} ---\n${content}`);
    } catch {
      // File doesn't exist — skip
    }
  }

  return sections.join("\n\n");
}

export { buildAthleteProfile, loadResearchContent, buildSessionPrompt, callAiForSessions, parseAiResponse };
export type { AiResponse };

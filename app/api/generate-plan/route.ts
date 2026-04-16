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
import { calculateRaceSplits, formatSplitsForPrompt } from "@/lib/plan-splits";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export const maxDuration = 300;

const CHUNK_SIZE = 5;
const TRIATHLON = ["Sprint Triathlon", "Olympic Triathlon", "70.3 Ironman", "Full Ironman"];
const RELAY = ["Triathlon Relay"];
const CYCLING = ["Cycling Event"];

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
      d.relayLeg ? String(d.relayLeg) : undefined,
    );

    /* ── Call AI for session content (weeks 1-${endWeek}) ──── */
    const weeksToGenerate = skeleton.weeks.filter(w => w.weekNumber <= endWeek);
    const sessionPrompt = buildSessionPrompt(
      weeksToGenerate, athleteProfile, research, skeleton, false, d,
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
  athleteData?: Record<string, unknown>,
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
- ATHLETE LEVEL AWARENESS: Match warm-up/cool-down and recovery to the athlete's experience. Experienced athletes (training consistency of 1+ years) must NEVER have walking prescribed anywhere — not in warm-ups, cool-downs, recovery, or main sets. Their warm-ups and cool-downs should be easy jogging, not walking. Only prescribe walking for true beginners (less than 6 months training) or athletes returning from injury.
- TRIATHLON WEAKEST DISCIPLINE: If the athlete has identified a weakest discipline, coaching notes for that discipline should emphasise technique improvement and progressive overload. Extra sessions in the weakest discipline are already scheduled — reinforce why this focus matters.
${athleteData ? buildConditionalRules(athleteData) : ""}
${weekDescriptions}`;

  if (includeFinalSections) {
    prompt += `

ALSO generate these one-time sections in your JSON response:

"raceDayProtocol": {
  "preRaceTimeline": "HTML content with <div class='timeline'> containing <div class='time-block'><strong>Time</strong><p>Details</p></div> elements for race morning",
  "raceStrategy": "HTML content with race pacing strategy, split targets, nutrition plan. CRITICAL: Use the pre-calculated TARGET RACE SPLITS from the athlete profile exactly as provided — do NOT invent your own split times or totals. These have been mathematically verified to add up correctly.",
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

/* ─── Conditional Rules (based on athlete equipment/schedule) ── */

function buildConditionalRules(d: Record<string, unknown>): string {
  const rules: string[] = [];
  const trainingFor = String(d.trainingFor || "");
  const isTri = TRIATHLON.includes(trainingFor);
  const isRelay = RELAY.includes(trainingFor);
  const relayLeg = String(d.relayLeg || "");
  const isCycling = CYCLING.includes(trainingFor);

  // GPS / HRM awareness
  const gps = String(d.gpsWatch || "");
  if (gps === "GPS watch + HRM") {
    rules.push("- METRICS: This athlete has a GPS watch AND heart rate monitor. Prescribe BOTH pace targets and HR zones for every run and bike session.");
  } else if (gps === "GPS watch only") {
    rules.push("- METRICS: This athlete has a GPS watch but no heart rate monitor. Use pace as the primary metric. Use RPE as secondary. Never prescribe HR-based targets.");
  } else if (gps === "HRM only") {
    rules.push("- METRICS: This athlete has a heart rate monitor but no GPS watch. Use HR zones as the primary metric. Use RPE as secondary. Never prescribe pace-based targets.");
  } else if (gps === "Neither") {
    rules.push("- METRICS: This athlete has NO GPS watch or heart rate monitor. Use RPE (Rate of Perceived Exertion) as the ONLY metric. Describe effort using feel and breathing — never prescribe specific pace or HR numbers in warm-up, main set, or cool-down.");
  }

  // Power meter (tri/cycling/relay bike only)
  if (isTri || isCycling || (isRelay && relayLeg === "Bike")) {
    const pm = String(d.powerMeter || "");
    if (pm === "Yes") {
      rules.push("- POWER METER: This athlete has a power meter. For ALL bike sessions, prescribe power targets in watts (referencing FTP zones) as the primary metric. HR is secondary.");
    } else {
      rules.push("- POWER METER: This athlete does NOT have a power meter. For bike sessions, use HR zones and RPE only. Never prescribe watt-based targets.");
    }
  }

  // Treadmill access (not relevant for relay swim/bike)
  const treadmill = String(d.treadmillAccess || "");
  if (treadmill === "Yes" && !(isRelay && relayLeg !== "Run")) {
    rules.push("- TREADMILL: This athlete has treadmill access. For tempo and interval run sessions, include a brief treadmill alternative in the coaching note (adjust pace: 5-10s/km slower, set 1% incline for road simulation).");
  } else if (treadmill === "No") {
    rules.push("- TREADMILL: This athlete has NO treadmill access. Never reference treadmill running as an option.");
  }

  // Pool / open water / wetsuit (tri or relay swim)
  if (isTri || (isRelay && relayLeg === "Swim")) {
    const pool = String(d.poolAccess || "");
    if (pool === "Seasonal" || pool === "No access") {
      rules.push(`- POOL ACCESS: This athlete has ${pool.toLowerCase()} pool access. When pool is unavailable, suggest dryland swim-specific alternatives (resistance bands, bench pull) in the coaching note.`);
    }
    const ow = String(d.openWaterAccess || "");
    if (ow.startsWith("Yes — easy")) {
      rules.push("- OPEN WATER: This athlete has easy open-water access. Include 1 open-water swim session per month during BUILD and PEAK phases. Coaching notes should cover sighting, drafting, and navigation.");
    } else if (ow === "No") {
      rules.push("- OPEN WATER: This athlete has NO open-water access. Never prescribe open-water sessions.");
    }
    const ws = String(d.wetsuit || "");
    if (ws === "Yes") {
      rules.push("- WETSUIT: This athlete has a wetsuit. In race-day protocol, note wetsuit pacing: expect 5-8% faster swim splits. Include wetsuit removal practice in BUILD phase coaching notes.");
    } else if (ws === "No") {
      rules.push("- WETSUIT: This athlete does NOT have a wetsuit. In race-day protocol, note non-wetsuit pacing and the importance of strong swim fitness for open water.");
    }
  }

  // Work shifts
  const shifts = String(d.workShifts || "");
  if (shifts.includes("rotating") || shifts.includes("night") || shifts.includes("FIFO")) {
    rules.push(`- SHIFT WORK: This athlete works ${shifts.replace("Yes — ", "")}. On EVERY hard session (tempo, interval, VO2max) coaching note, include: "If you're coming off a night shift or disrupted sleep, drop this to Zone 2 and halve the interval volume. A depleted session done smart beats a quality session done exhausted." Never assume a fixed daily schedule.`);
  }

  // Relay swim-specific rules
  if (isRelay && relayLeg === "Swim") {
    const techLevel = String(d.swimTechLevel || "");
    if (techLevel.startsWith("Beginner")) {
      rules.push("- SWIM TECHNIQUE LEVEL: Beginner. Focus 40% of sessions on technique drills (catch-up, fingertip drag, bilateral breathing). Keep main sets short (50-100m reps). Coaching notes should explain WHY each drill matters.");
    } else if (techLevel.startsWith("Intermediate")) {
      rules.push("- SWIM TECHNIQUE LEVEL: Intermediate. Include 1-2 technique-focused sessions per week with specific drill sets. Main sets can use 100-200m reps. Include pacing and stroke count awareness in coaching notes.");
    } else if (techLevel.startsWith("Advanced")) {
      rules.push("- SWIM TECHNIQUE LEVEL: Advanced. Prescribe race-pace sets, negative-split swims, and open water simulation (sighting every 6-8 strokes in BUILD/PEAK). Main sets can use 200-400m reps.");
    }
    const equipment = Array.isArray(d.swimEquipment) ? (d.swimEquipment as string[]) : [];
    if (equipment.length > 0 && !equipment.includes("None of these")) {
      rules.push(`- SWIM EQUIPMENT: This athlete has: ${equipment.join(", ")}. Use these in drill and main sets where appropriate. Pull buoy for catch work, fins for kick sets, paddles for power development.`);
    } else {
      rules.push("- SWIM EQUIPMENT: This athlete has no swim equipment. All drills and sets must be equipment-free.");
    }
    rules.push("- OPEN WATER RELAY: This is a triathlon relay swim leg — the race is in open water. Include sighting practice, mass start simulation, and open water pacing in BUILD and PEAK phases. Pool training should include sets that simulate open water conditions.");
  }

  // Strength training
  const strength = String(d.strengthTraining || "");
  if (strength.includes("regularly")) {
    const days = Array.isArray(d.strengthDays) ? (d.strengthDays as string[]).join(", ") : "";
    rules.push(`- STRENGTH TRAINING: This athlete does regular strength training${days ? ` on ${days}` : ""}. On strength training days, keep run sessions in Zone 1-2 only — the body is already under load. Add a coaching note: "You're doing strength work alongside this plan — on strength days, keep your run easy. Your body is already adapting."`);
  }

  // Training blockers
  const blockers = String(d.trainingBlockers || "").trim();
  if (blockers && !blockers.match(/^(none|nil|no|n\/a)$/i)) {
    const isInjuryBlocker = blockers.match(/injur|pain|physio|rehab/i);
    const isMotivationBlocker = blockers.match(/motiv|discipline|consistency|lazy|skip/i);
    rules.push(`- TRAINING BLOCKERS: The athlete's biggest blocker is: "${blockers}". Reference this in recovery and taper week coaching notes.${isInjuryBlocker ? " Since it's injury-related, reinforce warm-up and cool-down compliance in every hard session note." : ""}${isMotivationBlocker ? " Since it's motivation-related, coaching notes during taper should normalise the feeling of losing fitness and reinforce trust in the process." : ""}`);
  }

  // Success definition
  const success = String(d.successDefinition || "").trim();
  if (success && !success.match(/^(none|nil|no|n\/a)$/i)) {
    rules.push(`- SUCCESS DEFINITION: The athlete defines race-day success as: "${success}". Reference this verbatim in the first week's coaching note and in taper-week coaching notes. Every session subtly points toward this goal.`);
  }

  // Other sports
  if (d.otherSports === "Yes" && d.otherSport1Name) {
    const sport1 = `${d.otherSport1Name} on ${Array.isArray(d.otherSport1Days) ? (d.otherSport1Days as string[]).join(", ") : "multiple days"} (${d.otherSport1Intensity} intensity)`;
    let sportText = sport1;
    if (d.otherSport2Name) {
      sportText += ` and ${d.otherSport2Name} on ${Array.isArray(d.otherSport2Days) ? (d.otherSport2Days as string[]).join(", ") : "multiple days"} (${d.otherSport2Intensity} intensity)`;
    }
    rules.push(`- OTHER SPORTS: This athlete also does ${sportText}. Treat these as partial load days. Coaching notes for sessions the day before or after should acknowledge this load. If a hard session falls adjacent to a high-intensity other sport day, the coaching note must tell the athlete to scale intensity down if fatigued.`);
  }

  return rules.length > 0 ? "\n" + rules.join("\n") : "";
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
  if (d.trainingFor === "Triathlon Relay") {
    add("Relay Leg", d.relayLeg);
    add("Leg Distance", d.relayDistance);
    add("Leg Target Time", d.relayTargetTime);
  }
  add("Race Name", d.raceName); add("Race Date", d.raceDate);
  add("Main Goal", d.mainGoal); add("Target Time", d.targetTime);
  add("Completed Before", d.completedRaceBefore);
  add("Previous Finish Time", d.previousFinishTime);

  // Previous race splits (if triathlon and provided)
  if (d.splitSwim || d.splitBike || d.splitRun) {
    lines.push("\n=== PREVIOUS RACE SPLITS ===");
    add("Previous Swim Split", d.splitSwim);
    add("Previous T1", d.splitT1);
    add("Previous Bike Split", d.splitBike);
    add("Previous T2", d.splitT2);
    add("Previous Run Split", d.splitRun);
  }

  // Server-calculated target splits (mathematically verified)
  if (d.targetTime && d.trainingFor) {
    const splits = calculateRaceSplits(
      String(d.targetTime),
      String(d.trainingFor),
      d as Record<string, unknown>,
    );
    if (splits) {
      lines.push("\n" + formatSplitsForPrompt(splits, String(d.trainingFor)));
    }
  }

  lines.push("\n=== CURRENT FITNESS ===");
  add("Training Consistency", d.trainingConsistency);
  add("Recent Race Result", d.recentRaceResult);
  add("Max HR", d.maxHRUnknown ? "Unknown" : d.maxHR ? `${d.maxHR} BPM` : "");
  add("Resting HR", d.restingHRUnknown ? "Unknown" : d.restingHR ? `${d.restingHR} BPM` : "");

  const isRelay = d.trainingFor === "Triathlon Relay";
  const relayLeg = String(d.relayLeg || "");

  if (!isRelay || relayLeg === "Swim") {
    lines.push("\n=== SWIM ===");
    add("Easy Pace", d.swimPaceEasy ? `${d.swimPaceEasy}/100m` : "");
    add("Threshold Pace", d.swimPaceHard ? `${d.swimPaceHard}/100m` : "");
    add("Weekly Volume", d.weeklySwimVolume);
    add("Longest Swim", d.longestSwim ? `${d.longestSwim}m` : "");
    if (isRelay) {
      add("Technique Level", d.swimTechLevel);
      add("Swim Equipment", Array.isArray(d.swimEquipment) ? (d.swimEquipment as string[]).join(", ") : "");
    }
  }

  if (!isRelay || relayLeg === "Bike") {
    lines.push("\n=== BIKE ===");
    add("Avg Speed", d.avgBikeSpeed ? `${d.avgBikeSpeed} km/h` : "");
    add("FTP", d.ftpUnknown ? "Unknown" : d.ftp ? `${d.ftp}W` : "");
    add("Weekly Volume", d.weeklyBikeVolume);
    add("Longest Ride", d.longestRide);
  }

  if (!isRelay || relayLeg === "Run") {
    lines.push("\n=== RUN ===");
    add("Weekly Distance", d.weeklyRunDistance ? `${d.weeklyRunDistance} km` : "");
    add("Longest Run", d.longestRun ? `${d.longestRun} km` : "");
    add("Easy Pace", d.easyRunPace ? `${d.easyRunPace}/km` : "");
    add("Recent Race", d.recentRunRace);
  }

  lines.push("\n=== EQUIPMENT ===");
  add("GPS / HR Monitor", d.gpsWatch);
  add("Power Meter", d.powerMeter);
  add("Treadmill Access", d.treadmillAccess);

  const isTri2 = TRIATHLON.includes(String(d.trainingFor || ""));
  if (isTri2 || (isRelay && relayLeg === "Swim")) {
    lines.push("\n=== SWIM ACCESS ===");
    add("Pool Access", d.poolAccess);
    if (isRelay) {
      add("Open Water Access", "Yes — race is open water (triathlon relay)");
    } else {
      add("Open Water Access", d.openWaterAccess);
    }
    add("Wetsuit", d.wetsuit);
  }

  lines.push("\n=== HEALTH & RECOVERY ===");
  add("Current Injuries", d.currentInjuries);
  add("Injury Description", d.injuryDescription);
  add("Injury History", d.injuryHistory);
  add("Avg Sleep", d.avgSleep);
  add("Stress Level", d.stressLevel);

  lines.push("\n=== SCHEDULE & CONTEXT ===");
  add("Work Schedule", d.workShifts);
  add("Strength Training", d.strengthTraining);
  add("Strength Days", d.strengthDays);
  add("Training Blockers", d.trainingBlockers);
  add("Success Definition", d.successDefinition);

  // Other sports
  if (d.otherSports === "Yes" && d.otherSport1Name) {
    lines.push("\n=== OTHER SPORTS ===");
    lines.push(`Sport 1: ${d.otherSport1Name} — ${Array.isArray(d.otherSport1Days) ? (d.otherSport1Days as string[]).join(", ") : ""} — ${d.otherSport1Duration} — ${d.otherSport1Intensity} intensity`);
    if (d.otherSport2Name) {
      lines.push(`Sport 2: ${d.otherSport2Name} — ${Array.isArray(d.otherSport2Days) ? (d.otherSport2Days as string[]).join(", ") : ""} — ${d.otherSport2Duration} — ${d.otherSport2Intensity} intensity`);
    }
  }

  lines.push("\n=== MOTIVATION ===");
  add("Training Preference", d.trainingPreference);
  add("Motivation", d.motivation);
  add("Athlete Notes", d.anythingElse);

  return lines.join("\n");
}

function loadResearchContent(trainingFor: string, athleteAge?: number, relayLeg?: string): string {
  const researchDir = path.resolve(process.cwd(), "docs/research");

  const files = [
    "nutrition.md", "recovery.md", "general-triathlon.md",
    "periodisation.md", "strength-conditioning.md", "training-load.md", "race-psychology.md",
  ];

  if (TRIATHLON.includes(trainingFor)) {
    files.push("swim.md", "bike.md", "run.md");
  } else if (RELAY.includes(trainingFor)) {
    if (relayLeg === "Swim") files.push("swim.md");
    else if (relayLeg === "Bike") files.push("bike.md");
    else files.push("run.md");
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

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

/* ─── POST /api/generate-plan ──────────────────────────────────
   Body: { submission_id: string }
   1. Fetches athlete data from Supabase
   2. Generates personalised HTML training plan via Claude
   3. Emails the plan to the athlete + admin
   4. Updates submission status to "plan_sent"
   ────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const { submission_id } = await req.json();

  if (!submission_id) {
    return NextResponse.json({ error: "Missing submission_id" }, { status: 400 });
  }

  /* ── Fetch athlete data ──────────────────────────────────── */
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

  /* ── Build the athlete profile for the prompt ────────────── */
  const athleteProfile = buildAthleteProfile(d, sub);

  /* ── Generate plan via Claude ────────────────────────────── */
  const systemPrompt = buildSystemPrompt();
  const userPrompt = `Generate a complete personalised training plan for this athlete:\n\n${athleteProfile}`;

  let planHtml: string;
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find(b => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Extract HTML from response (Claude may wrap it in ```html blocks)
    planHtml = extractHtml(textBlock.text);
  } catch (e) {
    console.error("Claude API error:", e);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }

  /* ── Email the plan ──────────────────────────────────────── */
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    // Send to athlete
    await resend.emails.send({
      from: "Plan Metric <admin@planmetric.com.au>",
      to: sub.email,
      subject: `Your ${sub.training_for || "Training"} Plan is Ready — Plan Metric`,
      html: wrapPlanEmail(sub.full_name, planHtml),
    });

    // Send copy to admin
    await resend.emails.send({
      from: "Plan Metric <admin@planmetric.com.au>",
      to: "admin@planmetric.com.au",
      subject: `📋 Plan Sent: ${sub.full_name} — ${sub.plan?.toUpperCase()} — ${sub.training_for}`,
      html: wrapPlanEmail(sub.full_name, planHtml),
    });
  } catch (e) {
    console.error("Email error:", e);
    // Don't fail the whole request — plan was generated
  }

  /* ── Update status ───────────────────────────────────────── */
  await supabase
    .from("intake_submissions")
    .update({ status: "plan_sent" })
    .eq("id", submission_id);

  return NextResponse.json({
    ok: true,
    email: sub.email,
    planLength: planHtml.length,
  });
}

/* ─── Helpers ──────────────────────────────────────────────── */

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

  lines.push("\n=== PERSONAL ===");
  add("Name", d.fullName);
  add("Age", d.age);
  add("Gender", d.gender);
  add("Height", d.height ? `${d.height} cm` : "");
  add("Weight", d.weight ? `${d.weight} kg` : "");
  add("Location", d.location);

  lines.push("\n=== RACE & GOAL ===");
  add("Training For", d.trainingFor);
  add("Race Name", d.raceName);
  add("Race Date", d.raceDate);
  add("Main Goal", d.mainGoal);
  add("Target Time", d.targetTime);
  add("Completed Before", d.completedRaceBefore);
  add("Previous Finish Time", d.previousFinishTime);

  lines.push("\n=== CURRENT FITNESS ===");
  add("Training Consistency", d.trainingConsistency);
  add("Recent Race Result", d.recentRaceResult);
  add("Split Times", d.splitTimes);
  add("Max HR", d.maxHRUnknown ? "Unknown" : d.maxHR ? `${d.maxHR} BPM` : "");
  add("Resting HR", d.restingHRUnknown ? "Unknown" : d.restingHR ? `${d.restingHR} BPM` : "");

  lines.push("\n=== SWIM ===");
  add("Easy Pace", d.swimPaceEasy ? `${d.swimPaceEasy}/100m` : "");
  add("Threshold Pace", d.swimPaceHard ? `${d.swimPaceHard}/100m` : "");
  add("Weekly Volume", d.weeklySwimVolume);
  add("Longest Swim", d.longestSwim ? `${d.longestSwim}m` : "");
  add("Bilateral Breathing", d.bilateralBreathing);
  add("Pool Access", d.poolAccess);
  add("Open Water", d.openWaterAccess);
  add("Wetsuit", d.wetsuit);

  lines.push("\n=== BIKE ===");
  add("Avg Speed", d.avgBikeSpeed ? `${d.avgBikeSpeed} km/h` : "");
  add("Weekly Volume", d.weeklyBikeVolume);
  add("Longest Ride", d.longestRide);
  add("FTP", d.ftpUnknown ? "Unknown / no power meter" : d.ftp ? `${d.ftp}W` : "");
  add("Bike Type", d.bikeType);
  add("Power Meter", d.powerMeter);
  add("Indoor Trainer", d.indoorTrainer);

  lines.push("\n=== RUN ===");
  add("Weekly Distance", d.weeklyRunDistance ? `${d.weeklyRunDistance} km` : "");
  add("Longest Run", d.longestRun ? `${d.longestRun} km` : "");
  add("Easy Pace", d.easyRunPace ? `${d.easyRunPace}/km` : "");
  add("Recent Race", d.recentRunRace);
  add("Treadmill", d.treadmillAccess);

  lines.push("\n=== DISCIPLINE RANKING ===");
  add("Weakest", d.weakestDiscipline);
  add("Strongest", d.strongestDiscipline);

  lines.push("\n=== SCHEDULE ===");
  add("Training Days/Week", d.trainingDaysPerWeek);
  add("Rest Days/Week", d.restDaysPerWeek);
  add("Preferred Times", d.preferredTimes);
  add("Available Days", d.availableDays);
  add("Max Weekday Session", d.maxWeekdaySession);
  add("Max Weekend Session", d.maxWeekendSession);
  add("Double Days OK", d.doubleDays);
  add("Double Day Combos", d.doubleDayCombos);
  add("Long Session Day", d.preferredLongDay);
  add("Rest Day", d.preferredRestDay);
  add("Work Schedule", d.workShifts);
  add("Unavailable Weeks", d.unavailableWeeks);

  lines.push("\n=== EQUIPMENT ===");
  add("GPS/HRM Watch", d.gpsWatch);
  add("Gym Access", d.gymAccess);
  add("Equipment Budget", d.equipmentBudget);

  lines.push("\n=== HEALTH & RECOVERY ===");
  add("Current Injuries", d.currentInjuries);
  add("Injury Description", d.injuryDescription);
  add("Injury History", d.injuryHistory);
  add("Avg Sleep", d.avgSleep);
  add("Stress Level", d.stressLevel);
  add("Race Nutrition Experience", d.raceNutrition);
  add("Strength Training", d.strengthTraining);
  add("Dietary Restrictions", d.dietaryRestrictions);

  lines.push("\n=== MOTIVATION ===");
  add("Training Preference", d.trainingPreference);
  add("Intensity Feeling", d.intensityFeeling);
  add("Training Blockers", d.trainingBlockers);
  add("Motivation", d.motivation);
  add("Success Definition", d.successDefinition);

  return lines.join("\n");
}

function buildSystemPrompt(): string {
  return `You are an elite endurance coach at Plan Metric. You create personalised HTML training plans for triathletes, runners, and cyclists.

OUTPUT FORMAT:
Return ONLY valid HTML — a complete, self-contained training plan document. No markdown, no explanation, no wrapping. Just the HTML.

PLAN STRUCTURE:
1. **Header** — Athlete name, event, race date, plan overview, coach notes
2. **Training Zones** — Personalised HR zones, pace zones, and power zones (if applicable) in a clean table
3. **Week-by-week plan** — Each week as a collapsible section containing:
   - Week number, phase name (e.g. "Base 1", "Build 2", "Taper"), weekly focus
   - Daily sessions in a table: Day | Discipline | Session | Duration | Intensity | Notes
   - Weekly totals (hours, km by discipline)
4. **Race Execution Plan** — Pacing strategy, nutrition plan, transition notes, mental cues
5. **Key Workouts Glossary** — Definitions of session types used in the plan

DESIGN RULES:
- Use inline CSS only (email-safe, no external stylesheets)
- Background: #F0E6D4 (warm cream), text: #1C1614
- Accent colour: #A0522D (chestnut brown) for headers, borders, highlights
- Font: system-ui, -apple-system, sans-serif
- Clean, minimal, magazine-quality design
- Collapsible weeks using <details><summary> tags
- Responsive — works on mobile and desktop
- All units in KM, min/km pace, BPM, Celsius
- Include RPE (1-10) alongside HR zones where relevant

COACHING PRINCIPLES:
- Periodisation: base → build → peak → taper
- Progressive overload: increase volume ~10% per week max
- Recovery weeks every 3-4 weeks (reduce volume 30-40%)
- Brick sessions for triathletes (bike→run)
- Respect the athlete's schedule constraints — never exceed their stated availability
- If they have injuries, program around them with alternatives
- Taper 1-2 weeks before race day depending on distance
- Long sessions on their preferred long day
- Rest days on their preferred rest day
- Double days only if they said they're OK with doubles

Be specific. Use exact paces, HR ranges, distances. No vague "easy run" without a pace target.`;
}

function extractHtml(text: string): string {
  // If Claude wraps in ```html blocks, extract it
  const match = text.match(/```html\s*([\s\S]*?)```/);
  if (match) return match[1].trim();

  // If it starts with <!DOCTYPE or <html, use as-is
  if (text.trim().startsWith("<!") || text.trim().startsWith("<html")) {
    return text.trim();
  }

  // Otherwise wrap it
  return `<!DOCTYPE html><html><body style="background:#F0E6D4;color:#1C1614;font-family:system-ui,sans-serif;padding:32px;max-width:800px;margin:0 auto;">${text}</body></html>`;
}

function wrapPlanEmail(name: string, planHtml: string): string {
  return `<!DOCTYPE html>
<html>
<body style="background:#F0E6D4;color:#1C1614;font-family:system-ui,-apple-system,sans-serif;padding:0;margin:0;">
  <div style="background:#A0522D;color:#F0E6D4;padding:24px 32px;">
    <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Plan Metric</p>
    <h1 style="font-size:24px;margin:0;font-weight:700;">Your Training Plan is Ready</h1>
    <p style="margin:8px 0 0;font-size:14px;opacity:0.85;">Hi ${name}, here's your personalised plan.</p>
  </div>
  <div style="padding:32px;max-width:800px;margin:0 auto;">
    ${planHtml}
  </div>
  <div style="background:#1C1614;color:#F0E6D4;padding:24px 32px;font-size:11px;text-align:center;letter-spacing:0.1em;text-transform:uppercase;">
    Plan Metric · admin@planmetric.com.au · planmetric.com.au
  </div>
</body>
</html>`;
}

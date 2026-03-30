import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Allow up to 120 seconds for Claude to generate the full plan
export const maxDuration = 120;

/* ─── POST /api/generate-plan ──────────────────────────────────
   Body: { submission_id: string }
   1. Fetches athlete data from Supabase
   2. Generates personalised HTML training plan via Claude
   3. Emails the plan to the athlete + admin
   4. Updates submission status to "plan_sent"
   ────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
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

  /* ── Generate plan via Claude (with prompt caching) ───── */
  const systemPrompt = buildSystemPrompt();
  const userPrompt = `Generate a complete personalised training plan for this athlete:\n\n${athleteProfile}`;

  let planHtml: string;
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 64000,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
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

  /* ── Save plan to Supabase + update status ──────────────── */
  await supabase
    .from("intake_submissions")
    .update({ status: "plan_generated", generated_plan: planHtml })
    .eq("id", submission_id);

  /* ── Email admin with review link (NOT athlete) ─────────── */
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const reviewUrl = `${siteUrl}/admin/review/${submission_id}`;

    await resend.emails.send({
      from: "Plan Metric <admin@planmetric.com.au>",
      to: "admin@planmetric.com.au",
      subject: `🔍 Review Plan: ${sub.full_name} — ${sub.plan?.toUpperCase()} — ${sub.training_for}`,
      html: buildAdminReviewEmail(sub.full_name, sub.training_for, sub.plan, reviewUrl),
    });
  } catch (e) {
    console.error("Email error:", e);
    // Don't fail the whole request — plan was generated and saved
  }

  return NextResponse.json({
    ok: true,
    email: sub.email,
    planLength: planHtml.length,
  });
  } catch (e: unknown) {
    console.error("Unhandled error in generate-plan:", e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Unhandled error", detail: message }, { status: 500 });
  }
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
  add("Today's Date", new Date().toISOString().split("T")[0]);

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
  // Support both legacy single splitTimes and new individual fields
  if (d.splitSwim || d.splitT1 || d.splitBike || d.splitT2 || d.splitRun) {
    const splits = [d.splitSwim && `Swim ${d.splitSwim}`, d.splitT1 && `T1 ${d.splitT1}`, d.splitBike && `Bike ${d.splitBike}`, d.splitT2 && `T2 ${d.splitT2}`, d.splitRun && `Run ${d.splitRun}`].filter(Boolean).join(" / ");
    add("Split Times", splits);
  } else {
    add("Split Times", d.splitTimes);
  }
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

  lines.push("\n=== OTHER SPORTS & COMMITMENTS ===");
  add("Other Sports", d.otherSports);
  if (d.otherSport1Name) {
    add("Activity 1", d.otherSport1Name);
    add("  Days", Array.isArray(d.otherSport1Days) ? (d.otherSport1Days as string[]).join(", ") : d.otherSport1Days);
    add("  Time", d.otherSport1Time);
    add("  Duration", d.otherSport1Duration);
    add("  Intensity", d.otherSport1Intensity);
  }
  if (d.otherSport2Name) {
    add("Activity 2", d.otherSport2Name);
    add("  Days", Array.isArray(d.otherSport2Days) ? (d.otherSport2Days as string[]).join(", ") : d.otherSport2Days);
    add("  Time", d.otherSport2Time);
    add("  Duration", d.otherSport2Duration);
    add("  Intensity", d.otherSport2Intensity);
  }

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

  lines.push("\n=== ADDITIONAL NOTES ===");
  add("Athlete Notes", d.anythingElse);

  return lines.join("\n");
}

function buildSystemPrompt(): string {
  // Read the design template CSS from the reference plan
  const fs = require("fs");
  const path = require("path");
  let designCss = "";
  try {
    const refPath = path.resolve(process.cwd(), "public/plans/custom/pete-hamill-703-v2.html");
    const refHtml = fs.readFileSync(refPath, "utf-8");
    const cssMatch = refHtml.match(/<style>([\s\S]*?)<\/style>/);
    if (cssMatch) designCss = cssMatch[1];
  } catch {
    // Fallback handled below
  }

  return `You are an elite endurance coach at Plan Metric creating a personalised HTML training plan for a paying customer.

OUTPUT FORMAT:
Return ONLY valid HTML — a complete, self-contained training plan. No markdown, no explanation. Just the HTML starting with <!DOCTYPE html>.

CRITICAL — DESIGN TEMPLATE:
You MUST use the EXACT CSS and HTML class names from the design system below. Do NOT invent your own CSS. Copy the <style> block exactly and use the class names as shown in the HTML structure examples.

<style>
${designCss}
</style>

HTML STRUCTURE — follow this exactly:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Athlete Name] - [Race Name] Training Plan | Plan Metric</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <style>[PASTE THE EXACT CSS FROM ABOVE]</style>
</head>
<body>
  <!-- 1. HEADER -->
  <header class="header">
    <div class="header-content">
      <div class="logo">Plan Metric</div>
      <div class="premium-badge">[Premium Plan or Elite Plan]</div>
    </div>
  </header>

  <!-- 2. HERO -->
  <section class="hero">
    <div class="hero-content">
      <h1 class="athlete-name">[Name]</h1>
      <div class="race-info"><strong>[Race Name]</strong> • <span class="race-date">[Date]</span></div>
      <div class="goal-badge">[Goal]</div>
      <div class="stats-row">
        <div class="stat-card"><div class="stat-value">[value]</div><div class="stat-label">[label]</div></div>
        <!-- 4-5 stat cards -->
      </div>
    </div>
  </section>

  <div class="container">
    <!-- 3. TRAINING ZONES — use class="section", "zones-grid", "zone-discipline", "zone-item" -->
    <!-- 4. HOW TO USE — use class="section", "instructions-list" with Material icons -->
    <!-- 5. WEEK OVERVIEW — use class="section", "weeks-grid", "week-card" -->

    <!-- 6. PHASE BANNERS between phases — use class="phase-banner" -->

    <!-- 7. WEEKLY PLANS — use class="weekly-accordion" with <details><summary> -->
    <!-- Each week contains: -->
    <!--   .weekly-summary (italic paragraph) -->
    <!--   .days-grid with .day-card for each day -->
    <!--   Each .day-card has: .day-header (.day-title + .day-badges), .session-structure (.structure-item with .structure-label), .coaching-note (.note-title + text) -->
  </div>

  <!-- 8. RACE DAY PROTOCOL — use class="race-protocol", "protocol-section", "timeline", "time-block" -->
  <!-- 9. GLOSSARY — use class="glossary", "glossary-grid", "term" -->
  <!-- 10. COACH TIPS — use class="coach-tips", "tips-grid", "tip" with "tip-icon" + "tip-content" -->

  <!-- 11. FOOTER -->
  <footer class="plan-footer">
    <div class="footer-content">
      <div class="footer-brand"><h3>Plan Metric</h3><p>Precision Training Plans for Ambitious Athletes</p></div>
      <div class="footer-contact"><p>Ready to achieve your next goal?</p><a href="https://planmetric.com.au" target="_blank"><span class="material-symbols-outlined">open_in_new</span>planmetric.com.au</a></div>
    </div>
    <div class="footer-bottom"><p>&copy; 2026 Plan Metric. Tailored for [Name] - [Race] Journey.</p></div>
  </footer>
</div>
</body>
</html>

DAY CARD EXAMPLE — follow this structure exactly for every day:
<div class="day-card">
  <div class="day-header">
    <h4 class="day-title">Monday - Swim Technique</h4>
    <div class="day-badges">
      <span class="badge badge-swim">SWIM</span>
      <span class="badge">Z1-Z2</span>
      <span class="badge">60min</span>
    </div>
  </div>
  <div class="session-structure">
    <div class="structure-item"><span class="structure-label">Warm-up:</span> 400m easy FC (2:20/100m), 200m choice stroke</div>
    <div class="structure-item"><span class="structure-label">Main Set:</span> 4 x 200m FC @ 2:10/100m, rest 45s</div>
    <div class="structure-item"><span class="structure-label">Cool-down:</span> 200m easy choice stroke</div>
    <div class="structure-item"><span class="structure-label">Total:</span> 1600m</div>
  </div>
  <div class="coaching-note">
    <div class="note-title">Coach's Note:</div>
    [3+ sentences: WHAT to do, HOW to do it, WHY it matters for this athlete]
  </div>
</div>

BADGE CLASSES: badge-swim (blue), badge-bike (green), badge-run (orange), badge-brick (purple), badge-accent (brown), badge-red (key workout), badge-rest (grey)

SESSION DETAIL REQUIREMENTS — CRITICAL:
Every session must have specific numbers. NEVER write vague sessions.
- SWIM: total distance, warm-up distance, main set with intervals/distances/rest/zone, cool-down, coaching note
- BIKE: total duration, zone targets with HR/power, cadence 80-100 RPM, warm-up/main/cool-down, coaching note
- RUN: total distance or duration, pace/zone targets, warm-up/main/cool-down, coaching note
- BRICK: full bike + immediate run + transition notes + "brick legs" explanation
- REST days: still get a day-card with badge-rest badge and recovery guidance

COACHING KNOWLEDGE BASE:
INTENSITY: 80-90% Z1-Z2, 5-10% threshold, 5% VO2max. 2-3 quality sessions/week.
PERIODISATION: Base (aerobic/technique) → Build (threshold/bricks) → Peak (race-specific) → Taper (2-3 weeks, volume -20-50%, intensity maintained). Recovery week every 4th week at 50-60% volume. Max +10%/week overload.
SWIMMING: Technique > volume. CSS zones: Recovery CSS+15s, Aerobic CSS+8-14s, CSS ±3s, VO2max CSS-5-10s. Bilateral breathing. OW practice before race.
CYCLING: FTP zones: Z1<55%, Z2 56-75%, Z3 76-90%, Z4 91-105%, Z5 106-120%. Sweet spot 88-93% FTP. High cadence 90-100 RPM.
RUNNING: Conservative build +5min/week max. 80% easy pace. Max 2 quality/week. Long run 25-35% weekly volume.
BRICK: 2-4 sessions in final 6 weeks. 60-90min bike → 15-30min run, no break.
NUTRITION: <60min 0-30g carb/hr, 60-90min 30-60g/hr, 90min-2.5hr 60-80g/hr, >2.5hr 80-90g/hr. 2:1 glucose:fructose. Gut training essential.
ZONES: Karvonen for HR (Training HR = RHR + % × (MHR − RHR)). Cycling HR 5-10 BPM lower than running. Swimming HR 10-15 BPM lower.

PLAN DURATION — CRITICAL:
Calculate exact weeks from TODAY's date to race date. That is the plan length. Not 36. Not a round number. The EXACT number of weeks. Today's date is provided in the athlete profile.
- Taper always 2-3 weeks before race
- Recovery weeks every 3-4 weeks
- Distribute Base/Build/Peak proportionally

PERSONALISATION RULES:
- Sessions ONLY on athlete's available days
- Long session on preferred long day, rest on preferred rest day
- Double sessions only if explicitly allowed
- Work around injuries with safe alternatives
- Account for other sports as training load
- All units: KM, min/km, BPM, Celsius`;
}

function buildAdminReviewEmail(name: string, event: string, plan: string, reviewUrl: string): string {
  return `<!DOCTYPE html>
<html>
<body style="background:#0e0e0d;color:#e8e6e1;font-family:sans-serif;padding:32px;max-width:600px;margin:0 auto;">
  <div style="border-bottom:1px solid #D9C2B4;padding-bottom:20px;margin-bottom:24px;">
    <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#D9C2B4;margin:0 0 8px;">Plan Metric — Review Required</p>
    <h1 style="font-size:28px;margin:0;font-weight:800;letter-spacing:-0.03em;">Plan Generated</h1>
  </div>
  <p style="font-size:16px;line-height:1.7;margin:0 0 8px;">
    <strong>${name}</strong>'s ${plan?.toUpperCase()} ${event} plan is ready for review.
  </p>
  <p style="font-size:14px;color:#9b9b8a;margin:0 0 32px;">
    Review the plan, make any edits, then approve to send it to the athlete.
  </p>
  <a href="${reviewUrl}" style="display:inline-block;background:#A0522D;color:#F0E6D4;padding:16px 32px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:2px;">
    Review &amp; Approve Plan
  </a>
  <p style="font-size:11px;color:#9b9b8a;margin:32px 0 0;">
    Or open directly: <a href="${reviewUrl}" style="color:#D9C2B4;">${reviewUrl}</a>
  </p>
  <div style="margin-top:40px;padding-top:20px;border-top:1px solid #1f201e;font-size:10px;color:#9b9b8a;letter-spacing:0.1em;text-transform:uppercase;">
    Plan Metric · admin@planmetric.com.au
  </div>
</body>
</html>`;
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

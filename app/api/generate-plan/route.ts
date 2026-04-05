import { NextRequest, NextResponse, after } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export const maxDuration = 300;

/* ─── POST /api/generate-plan ─────────────────────────────────────
   Body: { submission_id: string }
   Pass 1 of 2: generates header + zones + first half of weeks.
   Saves partial HTML to DB, then fires off /api/generate-plan/continue.
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
    const athleteProfile = buildAthleteProfile(d, sub);

    /* ── Calculate weeks and chunks ─────────────────────────── */
    const today = new Date();
    const raceDate = d.raceDate ? new Date(d.raceDate as string) : null;
    const totalWeeks = raceDate
      ? Math.ceil((raceDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000))
      : (d.planWeeks ? parseInt(d.planWeeks as string) : 12);

    const CHUNK_SIZE = 6;
    const endWeek = Math.min(CHUNK_SIZE, totalWeeks);

    console.log(`Plan: ${totalWeeks} weeks, chunk 1: weeks 1-${endWeek}`);

    /* ── Pass 1: header + zones + overview + weeks 1-${endWeek} ── */
    const age = d.age ? parseInt(String(d.age), 10) : undefined;
    const systemPrompt = buildSystemPrompt(d.trainingFor as string, isNaN(age as number) ? undefined : age);

    const pass1Prompt = `Generate the FIRST PART of a personalised training plan for this athlete.

${athleteProfile}

This plan has ${totalWeeks} total weeks. In this response, generate:
1. The complete <!DOCTYPE html>, <head> with fonts (NO <style> block — CSS will be injected server-side), opening <body>
2. Header (sticky, with Plan Metric logo and plan badge)
3. Hero section (name, race, date, goal, stats)
4. Training Zones section
5. How To Use This Plan section
6. Disclaimer (disclaimer class — use the exact disclaimer text from the system prompt, do not alter it)
7. Training Phases Breakdown (phase-breakdown class — coach-style explanation of each phase, NOT a week-by-week grid)
8. Phase banners and DETAILED week-by-week content for Weeks 1 through ${endWeek}

Each week MUST have all 7 days with full day-cards (session structure + coaching notes).
Do NOT output any <style> block or CSS — only use the class names. CSS is injected server-side.
Do NOT close the </div>, </body> or </html> tags — the plan continues in a follow-up.
Do NOT include Race Day Protocol, Glossary, Coach Tips, or Footer yet.
End your output right after the last day-card of Week ${endWeek}.`;

    let pass1Html: string;
    try {
      const stream = anthropic.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 16000,
        system: [
          { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
        ],
        messages: [{ role: "user", content: pass1Prompt }],
      });

      const message = await stream.finalMessage();
      const textBlock = message.content.find(b => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text response from Claude");
      }
      pass1Html = extractHtml(textBlock.text);
    } catch (e) {
      console.error("Claude API error (pass 1):", e);
      return NextResponse.json({ error: "Failed to generate plan (pass 1)" }, { status: 500 });
    }

    /* ── Save pass 1 to DB ───────────────────────────────────── */
    await supabase
      .from("intake_submissions")
      .update({ generated_plan_part1: pass1Html })
      .eq("id", submission_id);

    /* ── Trigger next chunk (runs after response is sent) ───── */
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    after(async () => {
      try {
        await fetch(`${siteUrl}/api/generate-plan/continue`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submission_id, totalWeeks, startWeek: endWeek + 1 }),
        });
      } catch (e) {
        console.error("Failed to trigger next chunk:", e);
      }
    });

    return NextResponse.json({ ok: true, status: "generating", pass: 1, weeksGenerated: endWeek });
  } catch (e: unknown) {
    console.error("Unhandled error in generate-plan:", e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Unhandled error", detail: message }, { status: 500 });
  }
}

/* ─── Helpers ──────────────────────────────────────────────────── */

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
  add("Training For Race", d.hasRace); add("Training For", d.trainingFor);
  add("Race Name", d.raceName); add("Race Date", d.raceDate);
  add("Plan Duration", d.planWeeks ? `${d.planWeeks} weeks` : "");
  add("Main Goal", d.mainGoal); add("Target Time", d.targetTime);
  add("Completed Before", d.completedRaceBefore);
  add("Previous Finish Time", d.previousFinishTime);

  lines.push("\n=== CURRENT FITNESS ===");
  add("Training Consistency", d.trainingConsistency);
  add("Recent Race Result", d.recentRaceResult);
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
  add("Bike Type", d.bikeType); add("Power Meter", d.powerMeter);
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

function loadResearchContent(trainingFor: string, athleteAge?: number): string {
  const researchDir = path.resolve(process.cwd(), "docs/research");
  const TRIATHLON = ["Sprint Triathlon", "Olympic Triathlon", "70.3 Ironman", "Full Ironman"];
  const CYCLING = ["Cycling Event"];

  // Always include these
  const files = [
    "nutrition.md", "recovery.md", "general-triathlon.md",
    "periodisation.md", "strength-conditioning.md", "training-load.md", "race-psychology.md",
  ];

  // Add sport-specific files
  if (TRIATHLON.includes(trainingFor)) {
    files.push("swim.md", "bike.md", "run.md");
  } else if (CYCLING.includes(trainingFor)) {
    files.push("bike.md");
  } else {
    // Running events (marathon, 5K, 10K, half marathon, ultra, etc.)
    files.push("run.md");
  }

  // Masters athlete research for 40+
  if (athleteAge && athleteAge >= 40) {
    files.push("masters-athletes.md");
  }

  const sections: string[] = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(researchDir, file), "utf-8");
      const label = file.replace(".md", "").replace(/-/g, " ").toUpperCase();
      sections.push(`--- ${label} ---\n${content}`);
    } catch {
      // File doesn't exist yet — skip silently
    }
  }

  return sections.join("\n\n");
}

function buildSystemPrompt(trainingFor?: string, athleteAge?: number): string {
  const research = trainingFor ? loadResearchContent(trainingFor, athleteAge) : "";

  return `You are an elite endurance coach at Plan Metric creating a personalised HTML training plan for a paying customer.

OUTPUT: Return ONLY valid HTML. No markdown, no explanation, no \`\`\`html wrapper. Do NOT output any <style> block or CSS — the CSS will be injected server-side. Just use the correct class names.

REQUIRED HTML CLASSES AND STRUCTURE:

HEADER: <header class="header"><div class="header-content"><div class="logo">Plan Metric</div><div class="premium-badge">[tier]</div></div></header>

HERO: <section class="hero"><div class="hero-content"><h1 class="athlete-name">, <div class="race-info">, <div class="goal-badge">, <div class="stats-row"> with <div class="stat-card">

ZONES: <section class="section"> with <div class="zones-grid"> → <div class="zone-discipline"> → <div class="zone-item"><span class="zone-name"> + <div class="zone-values">

HOW TO USE: <section class="section"> with <ul class="instructions-list"> → <li> with <span class="material-symbols-outlined"> icon

DISCLAIMER: <div class="disclaimer"><span class="material-symbols-outlined">info</span><p>[exact text]</p></div>
— Always use this exact text: "This training plan is provided as a general guide only and does not constitute medical advice, professional coaching, or a substitute for consultation with qualified healthcare or fitness professionals. Plan Metric and its creators are not qualified coaches, medical practitioners, or dietitians. You should consult your doctor before starting any new exercise program. By using this plan, you acknowledge that you do so entirely at your own risk. Plan Metric accepts no liability for injury, illness, or loss arising from the use of this plan."

PHASE BREAKDOWN: <section class="section"> with <h2>Your Training Phases</h2> → <div class="phase-breakdown"> → <div class="phase-card"> with <div class="phase-card-header">(<span class="material-symbols-outlined"> + <h3>[Phase Name] <span class="phase-weeks">Weeks X-Y</span></h3>) + <p>2-3 sentence coaching explanation of what the phase does, why it matters, and what the athlete will gain</p>
— Cover every phase in the plan. Do NOT generate a week-by-week overview grid.

PHASE BANNER: <div class="phase-banner"><h2 class="phase-title"> + <p class="phase-subtitle">

WEEK: <div class="weekly-accordion"><details><summary><span>[title]</span><div class="week-meta"><span class="badge badge-accent">[hours]</span><span>[dates]</span></div></summary><div class="week-content"><div class="weekly-summary">[overview]</div><div class="days-grid">[day cards]</div></div></details></div>

DAY CARD:
<div class="day-card">
  <div class="day-header">
    <h4 class="day-title">[Day] - [Session Name]</h4>
    <div class="day-badges">
      <span class="badge badge-swim">SWIM</span>
      <span class="badge">Z1-Z2</span>
      <span class="badge">60min</span>
    </div>
  </div>
  <div class="session-structure">
    <div class="structure-item"><span class="structure-label">Warm-up:</span> [detail]</div>
    <div class="structure-item"><span class="structure-label">Main Set:</span> [detail]</div>
    <div class="structure-item"><span class="structure-label">Cool-down:</span> [detail]</div>
    <div class="structure-item"><span class="structure-label">Total:</span> [detail]</div>
  </div>
  <div class="coaching-note">
    <div class="note-title">Coach's Note:</div>
    [3+ sentences]
  </div>
</div>

BADGES: badge-swim, badge-bike, badge-run, badge-brick, badge-accent, badge-red, badge-rest

RACE DAY: <section class="race-protocol"> with <details class="protocol-section"><summary>[heading]</summary>[content]</details>
— Three collapsible sub-sections:
  1. <details class="protocol-section" open><summary>Pre-Race Timeline</summary> (open by default) — use .timeline and .time-block inside
  2. <details class="protocol-section"><summary>Your Race Strategy</summary>
  3. <details class="protocol-section"><summary>Mental Strategy</summary>

GLOSSARY: <section class="glossary"> with .glossary-grid → .term

COACH TIPS: <section class="coach-tips"> with .tips-grid → .tip (.tip-icon + .tip-content)
— .tip-icon MUST contain <span class="material-symbols-outlined">[icon_name]</span> — NEVER use emojis
— Use relevant icons: track_changes, local_cafe, directions_run, psychology, bolt, celebration, health_and_safety, trending_up, pool, directions_bike, etc.

FOOTER: <footer class="plan-footer"> with .footer-content (.footer-brand + .footer-contact) + .footer-bottom

HEAD TEMPLATE (use this exact <head>, no <style>):
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Athlete Name] - [Race Name] Training Plan | Plan Metric</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>

COACHING KNOWLEDGE:
- Intensity: 80-90% Z1-Z2, 5-10% threshold, 5% VO2max
- Periodisation: Base → Build → Peak → Taper (2-3 wks). Recovery every 4th week at 50-60%.
- Zones: Karvonen for HR. Cycling HR 5-10 BPM lower. Swimming HR 10-15 BPM lower.
- CSS zones: Recovery CSS+15s, Aerobic CSS+8-14s, CSS ±3s, VO2max CSS-5-10s
- FTP: Z1<55%, Z2 56-75%, Z3 76-90%, Z4 91-105%, Z5 106-120%
- Every swim needs drills. Every session needs specific numbers. No vague sessions.
- Running: Conservative build. 80% easy pace. Long run 25-35% weekly volume.
- Brick: 2-4 sessions in final 6 weeks. 60-90min bike → 15-30min run.
- Nutrition: <60min 0-30g/hr, 60-90min 30-60g/hr, >2.5hr 80-90g/hr
- All units: KM, min/km, BPM, Celsius

PERSONALISATION:
- Sessions ONLY on athlete's available days
- Long session on preferred long day, rest on preferred rest day
- Double sessions only if explicitly allowed
- Work around injuries with safe alternatives
- Account for other sports as training load

PLAN DURATION — CRITICAL:
Calculate exact weeks from TODAY's date to race date. Today's date is in the athlete profile.
- Taper always 2-3 weeks before race
- Recovery weeks every 3-4 weeks
- Distribute Base/Build/Peak proportionally${research ? `

COACHING RESEARCH LIBRARY — use the following curated research to inform your coaching decisions, session design, and coaching notes. Apply insights where relevant to the athlete's sport, level, and goals:

${research}` : ""}`;
}

function extractHtml(text: string): string {
  const match = text.match(/```html\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  if (text.trim().startsWith("<!") || text.trim().startsWith("<html")) return text.trim();
  return text.trim();
}

export { buildAthleteProfile, buildSystemPrompt, extractHtml };

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");
const Anthropic = require("@anthropic-ai/sdk");
const { Resend } = require("resend");
const fs = require("fs");
const path = require("path");

const SUBMISSION_ID = "6043f123-c14a-45ec-80e0-aa8033066a34";

async function streamGenerate(anthropic, system, messages) {
  let text = "";
  process.stdout.write("Generating");
  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 64000,
    system,
    messages,
  });
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      text += event.delta.text;
      process.stdout.write(".");
    }
  }
  console.log(" done! (" + text.length + " chars)");
  return text;
}

async function main() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const anthropic = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });

  // 1. Fetch submission
  const { data: sub, error: dbError } = await supabase
    .from("intake_submissions").select("*").eq("id", SUBMISSION_ID).single();
  if (dbError || !sub) { console.error("DB error:", dbError); return; }
  console.log("Fetched:", sub.full_name, "|", sub.training_for, "|", sub.plan);

  const d = sub.data;

  // 2. Build athlete profile
  const lines = [];
  const add = (label, value) => {
    if (value && value !== "" && value !== false) {
      const v = Array.isArray(value) ? value.join(", ") : String(value);
      lines.push(label + ": " + v);
    }
  };
  lines.push("=== PLAN TYPE ==="); add("Plan", sub.plan);
  add("Today's Date", new Date().toISOString().split("T")[0]);
  lines.push("\n=== PERSONAL ===");
  add("Name", d.fullName); add("Age", d.age); add("Gender", d.gender);
  add("Height", d.height ? d.height + " cm" : ""); add("Weight", d.weight ? d.weight + " kg" : "");
  add("Location", d.location);
  lines.push("\n=== RACE & GOAL ===");
  add("Training For", d.trainingFor); add("Race Name", d.raceName); add("Race Date", d.raceDate);
  add("Main Goal", d.mainGoal); add("Target Time", d.targetTime);
  add("Completed Before", d.completedRaceBefore); add("Previous Finish Time", d.previousFinishTime);
  lines.push("\n=== CURRENT FITNESS ===");
  add("Training Consistency", d.trainingConsistency); add("Recent Race Result", d.recentRaceResult);
  add("Max HR", d.maxHRUnknown ? "Unknown" : d.maxHR ? d.maxHR + " BPM" : "");
  add("Resting HR", d.restingHRUnknown ? "Unknown" : d.restingHR ? d.restingHR + " BPM" : "");
  lines.push("\n=== SWIM ===");
  add("Easy Pace", d.swimPaceEasy ? d.swimPaceEasy + "/100m" : "");
  add("Threshold Pace", d.swimPaceHard ? d.swimPaceHard + "/100m" : "");
  add("Weekly Volume", d.weeklySwimVolume); add("Longest Swim", d.longestSwim ? d.longestSwim + "m" : "");
  add("Bilateral Breathing", d.bilateralBreathing); add("Pool Access", d.poolAccess);
  add("Open Water", d.openWaterAccess); add("Wetsuit", d.wetsuit);
  lines.push("\n=== BIKE ===");
  add("Avg Speed", d.avgBikeSpeed ? d.avgBikeSpeed + " km/h" : "");
  add("Weekly Volume", d.weeklyBikeVolume); add("Longest Ride", d.longestRide);
  add("FTP", d.ftpUnknown ? "Unknown / no power meter" : d.ftp ? d.ftp + "W" : "");
  add("Bike Type", d.bikeType); add("Power Meter", d.powerMeter); add("Indoor Trainer", d.indoorTrainer);
  lines.push("\n=== RUN ===");
  add("Weekly Distance", d.weeklyRunDistance ? d.weeklyRunDistance + " km" : "");
  add("Longest Run", d.longestRun ? d.longestRun + " km" : "");
  add("Easy Pace", d.easyRunPace ? d.easyRunPace + "/km" : "");
  add("Recent Race", d.recentRunRace); add("Treadmill", d.treadmillAccess);
  lines.push("\n=== DISCIPLINE RANKING ===");
  add("Weakest", d.weakestDiscipline); add("Strongest", d.strongestDiscipline);
  lines.push("\n=== SCHEDULE ===");
  add("Training Days/Week", d.trainingDaysPerWeek); add("Rest Days/Week", d.restDaysPerWeek);
  add("Preferred Times", d.preferredTimes); add("Available Days", d.availableDays);
  add("Max Weekday Session", d.maxWeekdaySession); add("Max Weekend Session", d.maxWeekendSession);
  add("Double Days OK", d.doubleDays); add("Double Day Combos", d.doubleDayCombos);
  add("Long Session Day", d.preferredLongDay); add("Rest Day", d.preferredRestDay);
  add("Work Schedule", d.workShifts); add("Unavailable Weeks", d.unavailableWeeks);
  lines.push("\n=== OTHER SPORTS ===");
  add("Other Sports", d.otherSports);
  lines.push("\n=== EQUIPMENT ===");
  add("GPS/HRM Watch", d.gpsWatch); add("Gym Access", d.gymAccess);
  lines.push("\n=== HEALTH & RECOVERY ===");
  add("Current Injuries", d.currentInjuries); add("Injury Description", d.injuryDescription);
  add("Avg Sleep", d.avgSleep); add("Stress Level", d.stressLevel);
  add("Strength Training", d.strengthTraining);
  lines.push("\n=== MOTIVATION ===");
  add("Training Preference", d.trainingPreference); add("Intensity Feeling", d.intensityFeeling);
  add("Training Blockers", d.trainingBlockers); add("Motivation", d.motivation);
  add("Success Definition", d.successDefinition);
  add("Athlete Notes", d.anythingElse);
  const athleteProfile = lines.join("\n");

  // 3. Load design CSS
  const refPath = path.join(__dirname, "public/plans/custom/pete-hamill-703-v2.html");
  const refHtml = fs.readFileSync(refPath, "utf-8");
  const cssMatch = refHtml.match(/<style>([\s\S]*?)<\/style>/);
  const designCss = cssMatch ? cssMatch[1] : "";

  // 4. Calculate weeks
  const today = new Date();
  const raceDate = new Date(d.raceDate);
  const totalWeeks = Math.ceil((raceDate - today) / (7 * 24 * 60 * 60 * 1000));
  const halfWeek = Math.ceil(totalWeeks / 2);
  console.log("Plan duration:", totalWeeks, "weeks. Splitting at week", halfWeek);

  const systemMsg = [{ type: "text", text: buildSystemPrompt(designCss), cache_control: { type: "ephemeral" } }];

  // --- PASS 1: Header + Zones + Overview + first half of weeks ---
  console.log("\n--- PASS 1: Weeks 1-" + halfWeek + " ---");
  const pass1Prompt = `Generate the FIRST HALF of a personalised training plan for this athlete.

${athleteProfile}

This plan has ${totalWeeks} total weeks. In this response, generate:
1. The complete <!DOCTYPE html>, <head> with CSS and fonts, opening <body>
2. Header (sticky, with Plan Metric logo and plan badge)
3. Hero section (name, race, date, goal, stats)
4. Training Zones section
5. How To Use This Plan section
6. Week Overview Grid (ALL ${totalWeeks} weeks)
7. Phase banners and DETAILED week-by-week content for Weeks 1 through ${halfWeek}

Each week MUST have all 7 days with full day-cards (session structure + coaching notes).
Do NOT close the </div>, </body> or </html> tags — the plan continues in a follow-up.
Do NOT include Race Day Protocol, Glossary, Coach Tips, or Footer yet.
End your output right after the last day-card of Week ${halfWeek}.`;

  let pass1Html = await streamGenerate(anthropic, systemMsg, [{ role: "user", content: pass1Prompt }]);

  // Clean markdown wrapper if present
  let m = pass1Html.match(/```html\s*([\s\S]*?)```/);
  if (m) pass1Html = m[1].trim();
  else if (pass1Html.trim().startsWith("<!") || pass1Html.trim().startsWith("<html")) pass1Html = pass1Html.trim();

  // --- PASS 2: Second half of weeks + Race Day + Glossary + Tips + Footer ---
  console.log("\n--- PASS 2: Weeks " + (halfWeek + 1) + "-" + totalWeeks + " + Race Day + Glossary + Tips + Footer ---");
  const pass2Prompt = `Continue the training plan. You already generated Weeks 1-${halfWeek}.

Now generate:
1. Phase banners and DETAILED week-by-week content for Weeks ${halfWeek + 1} through ${totalWeeks} (the final week is race week)
2. Race Day Protocol section (race-protocol class)
3. Glossary section (glossary class)
4. Coach Tips section (coach-tips class, 6-8 tips)
5. Footer (plan-footer class)
6. Close all remaining tags: </div></body></html>

${athleteProfile}

Use the EXACT same CSS classes and HTML structure as the first half. Each week MUST have all 7 days with full day-cards. Do NOT output any CSS or <head> — just the HTML continuation starting from the next phase banner.`;

  let pass2Html = await streamGenerate(anthropic, systemMsg, [
    { role: "user", content: pass1Prompt },
    { role: "assistant", content: pass1Html },
    { role: "user", content: pass2Prompt },
  ]);

  // Clean markdown wrapper
  m = pass2Html.match(/```html\s*([\s\S]*?)```/);
  if (m) pass2Html = m[1].trim();

  // 5. Stitch together
  const planHtml = pass1Html + "\n\n" + pass2Html;
  console.log("\nTotal plan length:", planHtml.length, "chars");

  // 6. Save to Supabase
  await supabase.from("intake_submissions")
    .update({ status: "plan_generated", generated_plan: planHtml })
    .eq("id", SUBMISSION_ID);
  console.log("Saved to Supabase");

  // 7. Email admin
  const resend = new Resend(process.env.RESEND_API_KEY);
  const reviewUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://planmetric.com.au") + "/admin/review/" + SUBMISSION_ID;

  await resend.emails.send({
    from: "Plan Metric <admin@planmetric.com.au>",
    to: "admin@planmetric.com.au",
    subject: "Review Plan: " + sub.full_name + " - " + (sub.plan || "").toUpperCase() + " - " + sub.training_for,
    html: `<html><body style="background:#0e0e0d;color:#e8e6e1;font-family:sans-serif;padding:32px;max-width:600px;margin:0 auto;">
      <div style="border-bottom:1px solid #D9C2B4;padding-bottom:20px;margin-bottom:24px;">
        <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#D9C2B4;margin:0 0 8px;">Plan Metric — Review Required</p>
        <h1 style="font-size:28px;margin:0;font-weight:800;">Plan Generated</h1>
      </div>
      <p style="font-size:16px;line-height:1.7;">${sub.full_name}'s ${(sub.plan || "").toUpperCase()} ${sub.training_for} plan is ready for review.</p>
      <a href="${reviewUrl}" style="display:inline-block;background:#A0522D;color:#F0E6D4;padding:16px 32px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:2px;margin-top:16px;">Review &amp; Approve Plan</a>
      <p style="font-size:11px;color:#9b9b8a;margin:32px 0 0;">Or open: ${reviewUrl}</p>
    </body></html>`,
  });

  console.log("Admin review email sent!");
  console.log("Review URL:", reviewUrl);
  console.log("\nDone! Check admin@planmetric.com.au");
}

function buildSystemPrompt(designCss) {
  return `You are an elite endurance coach at Plan Metric creating a personalised HTML training plan for a paying customer.

OUTPUT: Return ONLY valid HTML. No markdown, no explanation, no \`\`\`html wrapper.

CRITICAL — USE THIS EXACT CSS (do not invent your own):
<style>
${designCss}
</style>

REQUIRED HTML CLASSES AND STRUCTURE:

HEADER: <header class="header"><div class="header-content"><div class="logo">Plan Metric</div><div class="premium-badge">[tier]</div></div></header>

HERO: <section class="hero"><div class="hero-content"><h1 class="athlete-name">, <div class="race-info">, <div class="goal-badge">, <div class="stats-row"> with <div class="stat-card">

ZONES: <section class="section"> with <div class="zones-grid"> → <div class="zone-discipline"> → <div class="zone-item"><span class="zone-name"> + <div class="zone-values">

HOW TO USE: <section class="section"> with <ul class="instructions-list"> → <li> with <span class="material-symbols-outlined"> icon

OVERVIEW: <section class="section"> with <div class="weeks-grid"> → <div class="week-card"> with .week-header (.week-number + .week-hours) + .phase-name

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

RACE DAY: <section class="race-protocol"> with .protocol-section, .timeline, .time-block

GLOSSARY: <section class="glossary"> with .glossary-grid → .term

COACH TIPS: <section class="coach-tips"> with .tips-grid → .tip (.tip-icon + .tip-content)

FOOTER: <footer class="plan-footer"> with .footer-content (.footer-brand + .footer-contact) + .footer-bottom

COACHING KNOWLEDGE:
- Intensity: 80-90% Z1-Z2, 5-10% threshold, 5% VO2max
- Periodisation: Base → Build → Peak → Taper (2-3 wks). Recovery every 4th week at 50-60%.
- Zones: Karvonen for HR. Cycling HR 5-10 BPM lower. Swimming HR 10-15 BPM lower.
- CSS zones: Recovery CSS+15s, Aerobic CSS+8-14s, CSS ±3s, VO2max CSS-5-10s
- FTP: Z1<55%, Z2 56-75%, Z3 76-90%, Z4 91-105%, Z5 106-120%
- Every swim needs drills. Every session needs specific numbers. No vague sessions.
- Brick: 2-4 sessions in final 6 weeks
- Nutrition: <60min 0-30g/hr, 60-90min 30-60g/hr, >2.5hr 80-90g/hr
- All units: KM, min/km, BPM, Celsius

PERSONALISATION:
- Sessions ONLY on athlete's available days
- Long session on preferred long day, rest on preferred rest day
- Account for other sports as training load
- Work around injuries`;
}

main().catch(e => { console.error("Error:", e.message || e); process.exit(1); });

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const errors: string[] = [];

  /* ── 1. Save to Supabase ─────────────────────────────────── */
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    const { error } = await supabase.from("intake_submissions").insert([{
      full_name:    data.fullName,
      email:        data.email,
      training_for: data.trainingFor,
      race_date:    data.raceDate || null,
      data,
    }]);
    if (error) errors.push("DB: " + error.message);
  } catch (e) {
    errors.push("DB connection failed");
  }

  /* ── 2. Send email via Nodemailer ─────────────────────────── */
  try {
    const { sendEmail } = await import("@/lib/email");
    await sendEmail({
      to:      "pete@planmetric.com.au",
      subject: `New Intake: ${data.fullName} — ${data.trainingFor || "Unknown event"}`,
      html:    buildEmail(data),
    });
  } catch (e) {
    errors.push("Email failed");
  }

  if (errors.length > 0) {
    console.error("Intake errors:", errors);
    // Still return 200 — partial failures shouldn't block the athlete
  }

  return NextResponse.json({ ok: true });
}

/* ─── Email formatter ────────────────────────────────────────── */
function row(label: string, value: string | boolean | string[] | undefined) {
  if (value === undefined || value === "" || value === false) return "";
  const display = Array.isArray(value) ? value.join(", ") : String(value);
  return `<tr><td style="padding:8px 12px;color:#9b9b8a;font-size:11px;font-family:monospace;white-space:nowrap;border-bottom:1px solid #1f201e;">${label}</td><td style="padding:8px 12px;font-size:13px;font-family:sans-serif;border-bottom:1px solid #1f201e;">${display}</td></tr>`;
}

function section(title: string, rows: string) {
  if (!rows.trim()) return "";
  return `
    <h3 style="font-family:sans-serif;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D9C2B4;margin:32px 0 8px;">${title}</h3>
    <table style="width:100%;border-collapse:collapse;background:#131312;">${rows}</table>
  `;
}

function buildEmail(d: Record<string, unknown>): string {
  return `
  <!DOCTYPE html>
  <html>
  <body style="background:#0e0e0d;color:#e8e6e1;font-family:sans-serif;padding:32px;max-width:720px;margin:0 auto;">
    <div style="border-bottom:1px solid #D9C2B4;padding-bottom:20px;margin-bottom:24px;">
      <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#D9C2B4;margin:0 0 8px;">Plan Metric</p>
      <h1 style="font-size:28px;margin:0;font-weight:800;letter-spacing:-0.03em;">New Intake Submission</h1>
      <p style="color:#9b9b8a;margin:8px 0 0;font-size:13px;">${new Date().toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
    </div>

    ${section("Personal Details", [
      row("Full Name",  d.fullName as string),
      row("Email",      d.email as string),
      row("Age",        d.age as string),
      row("Gender",     d.gender as string),
      row("Height",     d.height ? d.height + " cm" : ""),
      row("Weight",     d.weight ? d.weight + " kg" : ""),
      row("Location",   d.location as string),
    ].join(""))}

    ${section("Race & Goal", [
      row("Training For Race",  d.hasRace as string),
      row("Training For",       d.trainingFor as string),
      row("Race Name",          d.raceName as string),
      row("Race Date",          d.raceDate as string),
      row("Plan Duration",      d.planWeeks ? d.planWeeks + " weeks" : ""),
      row("Main Goal",          d.mainGoal as string),
      row("Target Time",        d.targetTime as string),
      row("Done Distance Before", d.completedRaceBefore as string),
      row("Previous Time",      d.previousFinishTime as string),
    ].join(""))}

    ${section("Current Fitness", [
      row("Training Consistency", d.trainingConsistency as string),
      row("Recent Race Result",   d.recentRaceResult as string),
      row("Split Times",          d.splitTimes as string),
      row("Max HR",               d.maxHRUnknown ? "Unknown" : d.maxHR ? d.maxHR + " BPM" : ""),
      row("Resting HR",           d.restingHRUnknown ? "Unknown" : d.restingHR ? d.restingHR + " BPM" : ""),
    ].join(""))}

    ${section("Swim", [
      row("Easy Pace",        d.swimPaceEasy ? d.swimPaceEasy + " /100m" : ""),
      row("Threshold Pace",   d.swimPaceHard ? d.swimPaceHard + " /100m" : ""),
      row("Weekly Volume",    d.weeklySwimVolume as string),
      row("Longest Swim",     d.longestSwim ? d.longestSwim + " m" : ""),
      row("Bilateral",        d.bilateralBreathing as string),
      row("Pool Access",      d.poolAccess as string),
      row("Open Water",       d.openWaterAccess as string),
      row("Wetsuit",          d.wetsuit as string),
    ].join(""))}

    ${section("Bike", [
      row("Avg Speed",        d.avgBikeSpeed ? d.avgBikeSpeed + " km/h" : ""),
      row("Weekly Volume",    d.weeklyBikeVolume as string),
      row("Longest Ride",     d.longestRide as string),
      row("FTP",              d.ftpUnknown ? "No power meter" : d.ftp ? d.ftp + " watts" : ""),
      row("Bike Type",        d.bikeType as string),
      row("Power Meter",      d.powerMeter as string),
      row("Indoor Trainer",   d.indoorTrainer as string),
    ].join(""))}

    ${section("Run", [
      row("Weekly Distance",  d.weeklyRunDistance ? d.weeklyRunDistance + " km" : ""),
      row("Longest Run",      d.longestRun ? d.longestRun + " km" : ""),
      row("Easy Pace",        d.easyRunPace ? d.easyRunPace + " /km" : ""),
      row("Recent Race",      d.recentRunRace as string),
      row("Treadmill",        d.treadmillAccess as string),
    ].join(""))}

    ${section("Discipline Ranking", [
      row("Weakest",   d.weakestDiscipline as string),
      row("Strongest", d.strongestDiscipline as string),
    ].join(""))}

    ${section("Schedule & Availability", [
      row("Training Days/Week",   d.trainingDaysPerWeek as string),
      row("Rest Days/Week",       d.restDaysPerWeek as string),
      row("Preferred Times",      d.preferredTimes as string[]),
      row("Available Days",       d.availableDays as string[]),
      row("Max Weekday Session",  d.maxWeekdaySession as string),
      row("Max Weekend Session",  d.maxWeekendSession as string),
      row("Double Days",          d.doubleDays as string),
      row("Double Day Combos",    d.doubleDayCombos as string[]),
      row("Long Session Day",     d.preferredLongDay as string),
      row("Rest Day",             d.preferredRestDay as string),
      row("Work Schedule",        d.workShifts as string),
      row("Unavailable Weeks",    d.unavailableWeeks as string),
    ].join(""))}

    ${section("Equipment", [
      row("GPS / HRM",    d.gpsWatch as string),
      row("Gym Access",   d.gymAccess as string),
      row("Budget",       d.equipmentBudget as string),
    ].join(""))}

    ${section("Health & Recovery", [
      row("Current Injuries",   d.currentInjuries as string),
      row("Injury Description", d.injuryDescription as string),
      row("Injury History",     d.injuryHistory as string),
      row("Avg Sleep",          d.avgSleep as string),
      row("Stress Level",       d.stressLevel as string),
      row("Race Nutrition",     d.raceNutrition as string),
      row("Strength Training",  d.strengthTraining as string),
      row("Dietary",            d.dietaryRestrictions as string),
    ].join(""))}

    ${section("Motivation & Preferences", [
      row("Training Preference", d.trainingPreference as string),
      row("Intensity Feeling",   d.intensityFeeling as string),
      row("Blockers",            d.trainingBlockers as string),
      row("Motivation",          d.motivation as string),
      row("Success Definition",  d.successDefinition as string),
    ].join(""))}

    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #1f201e;font-size:10px;color:#9b9b8a;letter-spacing:0.1em;text-transform:uppercase;">
      Plan Metric · admin@planmetric.com.au · planmetric.com.au
    </div>
  </body>
  </html>
  `;
}

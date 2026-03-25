import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  /* ── Verify Stripe payment ──────────────────────────────── */
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
  }

  const submissionId = session.metadata?.submission_id;
  if (!submissionId) {
    return NextResponse.json({ error: "Missing submission ID" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  /* ── Get full submission data ───────────────────────────── */
  const { data: submission } = await supabase
    .from("intake_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  /* ── Prevent double-processing ──────────────────────────── */
  if (submission.status === "paid") {
    return NextResponse.json({ ok: true, email: submission.email, alreadyProcessed: true });
  }

  /* ── Update status to paid ──────────────────────────────── */
  await supabase
    .from("intake_submissions")
    .update({ status: "paid", stripe_session_id: sessionId })
    .eq("id", submissionId);

  /* ── Send email ─────────────────────────────────────────── */
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const d = submission.data;
    await resend.emails.send({
      from:    "Plan Metric <admin@planmetric.com.au>",
      to:      "admin@planmetric.com.au",
      subject: `✅ Paid Intake: ${submission.full_name} — ${submission.plan?.toUpperCase()} — ${submission.training_for || ""}`,
      html:    buildEmail(d, submission.plan),
    });
  } catch (e) {
    console.error("Email error:", e);
  }

  return NextResponse.json({ ok: true, email: submission.email });
}

/* ─── Email formatter ────────────────────────────────────────── */
function row(label: string, value: unknown) {
  if (value === undefined || value === "" || value === false || value === null) return "";
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

function buildEmail(d: Record<string, unknown>, plan: string): string {
  const planLabels: Record<string, string> = { starter: "Starter — $49", premium: "Premium — $149", elite: "Elite — $99/month" };
  return `
  <!DOCTYPE html>
  <html>
  <body style="background:#0e0e0d;color:#e8e6e1;font-family:sans-serif;padding:32px;max-width:720px;margin:0 auto;">
    <div style="border-bottom:1px solid #D9C2B4;padding-bottom:20px;margin-bottom:24px;">
      <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#D9C2B4;margin:0 0 8px;">Plan Metric — Paid Intake</p>
      <h1 style="font-size:28px;margin:0;font-weight:800;letter-spacing:-0.03em;">New Submission</h1>
      <p style="color:#D9C2B4;margin:8px 0 0;font-size:14px;font-weight:bold;">Plan: ${planLabels[plan] || plan}</p>
      <p style="color:#9b9b8a;margin:4px 0 0;font-size:13px;">${new Date().toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
    </div>
    ${section("Personal Details", [
      row("Full Name", d.fullName), row("Email", d.email), row("Age", d.age),
      row("Gender", d.gender), row("Height", d.height ? d.height + " cm" : ""),
      row("Weight", d.weight ? d.weight + " kg" : ""), row("Location", d.location),
    ].join(""))}
    ${section("Race & Goal", [
      row("Training For", d.trainingFor), row("Race Name", d.raceName),
      row("Race Date", d.raceDate), row("Main Goal", d.mainGoal),
      row("Target Time", d.targetTime), row("Done Distance Before", d.completedRaceBefore),
      row("Previous Time", d.previousFinishTime),
    ].join(""))}
    ${section("Current Fitness", [
      row("Training Consistency", d.trainingConsistency),
      row("Recent Race Result", d.recentRaceResult), row("Split Times", d.splitTimes),
      row("Max HR", d.maxHRUnknown ? "Unknown" : d.maxHR ? d.maxHR + " BPM" : ""),
      row("Resting HR", d.restingHRUnknown ? "Unknown" : d.restingHR ? d.restingHR + " BPM" : ""),
    ].join(""))}
    ${section("Swim", [
      row("Easy Pace", d.swimPaceEasy ? d.swimPaceEasy + " /100m" : ""),
      row("Threshold Pace", d.swimPaceHard ? d.swimPaceHard + " /100m" : ""),
      row("Weekly Volume", d.weeklySwimVolume),
      row("Longest Swim", d.longestSwim ? d.longestSwim + " m" : ""),
      row("Bilateral", d.bilateralBreathing), row("Pool Access", d.poolAccess),
      row("Open Water", d.openWaterAccess), row("Wetsuit", d.wetsuit),
    ].join(""))}
    ${section("Bike", [
      row("Avg Speed", d.avgBikeSpeed ? d.avgBikeSpeed + " km/h" : ""),
      row("Weekly Volume", d.weeklyBikeVolume), row("Longest Ride", d.longestRide),
      row("FTP", d.ftpUnknown ? "No power meter" : d.ftp ? d.ftp + " watts" : ""),
      row("Bike Type", d.bikeType), row("Power Meter", d.powerMeter),
      row("Indoor Trainer", d.indoorTrainer),
    ].join(""))}
    ${section("Run", [
      row("Weekly Distance", d.weeklyRunDistance ? d.weeklyRunDistance + " km" : ""),
      row("Longest Run", d.longestRun ? d.longestRun + " km" : ""),
      row("Easy Pace", d.easyRunPace ? d.easyRunPace + " /km" : ""),
      row("Recent Race", d.recentRunRace), row("Treadmill", d.treadmillAccess),
    ].join(""))}
    ${section("Discipline Ranking", [
      row("Weakest", d.weakestDiscipline), row("Strongest", d.strongestDiscipline),
    ].join(""))}
    ${section("Schedule", [
      row("Training Days/Week", d.trainingDaysPerWeek), row("Rest Days/Week", d.restDaysPerWeek),
      row("Preferred Times", d.preferredTimes as string[]),
      row("Available Days", d.availableDays as string[]),
      row("Max Weekday Session", d.maxWeekdaySession),
      row("Max Weekend Session", d.maxWeekendSession),
      row("Double Days", d.doubleDays),
      row("Double Day Combos", d.doubleDayCombos as string[]),
      row("Long Session Day", d.preferredLongDay), row("Rest Day", d.preferredRestDay),
      row("Work Schedule", d.workShifts), row("Unavailable Weeks", d.unavailableWeeks),
    ].join(""))}
    ${section("Equipment", [
      row("GPS / HRM", d.gpsWatch), row("Gym Access", d.gymAccess),
      row("Budget", d.equipmentBudget),
    ].join(""))}
    ${section("Health & Recovery", [
      row("Current Injuries", d.currentInjuries),
      row("Injury Description", d.injuryDescription),
      row("Injury History", d.injuryHistory), row("Avg Sleep", d.avgSleep),
      row("Stress Level", d.stressLevel), row("Race Nutrition", d.raceNutrition),
      row("Strength Training", d.strengthTraining), row("Dietary", d.dietaryRestrictions),
    ].join(""))}
    ${section("Motivation", [
      row("Training Preference", d.trainingPreference),
      row("Intensity Feeling", d.intensityFeeling),
      row("Blockers", d.trainingBlockers), row("Motivation", d.motivation),
      row("Success Definition", d.successDefinition),
    ].join(""))}
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #1f201e;font-size:10px;color:#9b9b8a;letter-spacing:0.1em;text-transform:uppercase;">
      Plan Metric · admin@planmetric.com.au · planmetric.com.au
    </div>
  </body>
  </html>`;
}

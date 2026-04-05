import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  /* ── Verify Stripe payment ──────────────────────────────── */
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const isPaid = session.payment_status === "paid"
    || session.payment_status === "no_payment_required"
    || session.status === "complete";

  if (!isPaid) {
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

  /* ── Pull customer info from Stripe (starter plans bought
       from /plans don't have name/email in the submission) ── */
  const stripeEmail = session.customer_details?.email || session.customer_email;
  const stripeName = session.customer_details?.name;
  const needsEmail = stripeEmail && !submission.email;
  const needsName = stripeName && !submission.full_name;
  if (needsEmail) submission.email = stripeEmail;
  if (needsName) submission.full_name = stripeName;

  /* ── Update status to paid ──────────────────────────────── */
  await supabase
    .from("intake_submissions")
    .update({
      status: "paid",
      stripe_session_id: sessionId,
      ...(needsEmail ? { email: stripeEmail } : {}),
      ...(needsName ? { full_name: stripeName } : {}),
    })
    .eq("id", submissionId);

  /* ── Send admin email ────────────────────────────────────── */
  try {
    const d = submission.data;
    await sendEmail({
      to:      "pete@planmetric.com.au",
      subject: `New Plan Metric Intake — ${submission.full_name}`,
      html:    buildEmail(d, submission.plan),
    });

    /* ── Send customer confirmation email ──────────────────── */
    if (submission.email) {
      const firstName = submission.full_name?.split(" ")[0] || submission.full_name || "there";
      await sendEmail({
        to:      submission.email,
        subject: "Your Plan Metric order is confirmed",
        html: `<!DOCTYPE html>
<html>
<body style="background:#0F0F0F;color:#F5F5F0;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
  <div style="border-bottom:1px solid #2a2a2a;padding-bottom:24px;margin-bottom:32px;">
    <p style="font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#B85C2C;margin:0 0 12px;">Plan Metric</p>
    <h1 style="font-size:24px;margin:0;font-weight:800;">Order confirmed.</h1>
  </div>
  <p style="font-size:16px;line-height:1.7;color:#F5F5F0;">
    Thanks ${firstName} &mdash; we&rsquo;ve received your intake form and payment. Your personalised plan will be delivered to this email within 48 hours.
  </p>
  <p style="font-size:14px;color:rgba(245,245,240,0.45);margin-top:40px;">
    &mdash; Plan Metric
  </p>
  <div style="margin-top:48px;padding-top:20px;border-top:1px solid #2a2a2a;font-size:10px;color:rgba(245,245,240,0.3);letter-spacing:0.1em;text-transform:uppercase;">
    Plan Metric &middot; planmetric.com.au
  </div>
</body>
</html>`,
      });
    }
  } catch (e) {
    console.error("Email error:", e);
  }

  /* ── Auto-deliver/generate plan ─────────────────────────── */
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (submission.plan === "starter") {
    try {
      await fetch(`${siteUrl}/api/deliver-starter-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: submissionId }),
      });
    } catch (e) {
      console.error("Starter plan delivery error:", e);
    }
  } else if (submission.plan === "premium" || submission.plan === "elite") {
    try {
      await fetch(`${siteUrl}/api/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: submissionId }),
      });
    } catch (e) {
      console.error("Plan generation trigger error:", e);
    }
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
  const planLabels: Record<string, string> = { starter: "Starter — $29.99", premium: "Premium — $99.99", elite: "Elite — $99/month" };
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
      row("Training For Race", d.hasRace), row("Training For", d.trainingFor),
      row("Race Name", d.raceName), row("Race Date", d.raceDate),
      row("Plan Duration", d.planWeeks ? d.planWeeks + " weeks" : ""),
      row("Main Goal", d.mainGoal), row("Target Time", d.targetTime),
      row("Done Distance Before", d.completedRaceBefore),
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

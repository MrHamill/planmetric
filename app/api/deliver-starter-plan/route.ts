import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
/* ─── POST /api/deliver-starter-plan ───────────────────────────
   Body: { submission_id: string }
   Emails the customer a link to view their interactive plan at
   /plans/[id] and notifies admin.
   ────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
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
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  if (sub.status !== "paid") {
    return NextResponse.json({ error: "Submission not paid" }, { status: 402 });
  }

  const d = sub.data as Record<string, unknown>;
  const event = String(d.trainingFor || sub.training_for || "").trim();
  const level = String(d.level || "Beginner").trim();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://planmetric.com.au";
  const planUrl = `${siteUrl}/plan/${submission_id}`;

  /* ── Email the plan link ─────────────────────────────────── */
  try {
    const firstName = sub.full_name?.split(" ")[0] || sub.full_name || "there";

    await sendEmail({
      to: sub.email,
      subject: `Your ${event} ${level} Plan is Ready — Plan Metric`,
      html: buildPlanEmail(firstName, event, level, planUrl),
    });

    await sendEmail({
      to: "pete@planmetric.com.au",
      subject: `Starter Plan Sent: ${sub.full_name} — ${event} ${level}`,
      html: buildPlanEmail(sub.full_name, event, level, planUrl),
    });
  } catch (e) {
    console.error("Email error:", e);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  /* ── Update status ───────────────────────────────────────── */
  await supabase
    .from("intake_submissions")
    .update({ status: "plan_sent" })
    .eq("id", submission_id);

  return NextResponse.json({ ok: true, email: sub.email, planUrl });
}

function buildPlanEmail(name: string, event: string, level: string, planUrl: string): string {
  return `<!DOCTYPE html>
<html>
<body style="background:#F0E6D4;color:#1C1614;font-family:system-ui,-apple-system,sans-serif;padding:0;margin:0;">
  <div style="background:#A0522D;color:#F0E6D4;padding:32px;">
    <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 12px;">Plan Metric</p>
    <h1 style="font-size:28px;margin:0;font-weight:700;">Your ${event} Plan is Ready</h1>
  </div>
  <div style="padding:40px 32px;max-width:600px;">
    <p style="font-size:16px;line-height:1.7;color:#1C1614;margin:0 0 8px;">
      Hi ${name},
    </p>
    <p style="font-size:16px;line-height:1.7;color:#3A2E28;margin:0 0 32px;">
      Your <strong>${level} ${event}</strong> training plan is ready. Click below to view your full interactive plan — complete with weekly breakdowns, training zones, and session details.
    </p>
    <a href="${planUrl}" style="display:inline-block;background:#A0522D;color:#F0E6D4;padding:16px 32px;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;border-radius:6px;">
      View Your Plan
    </a>
    <p style="font-size:13px;color:#6B5E54;margin:32px 0 0;line-height:1.6;">
      You can also download your plan as an HTML file from the plan page. Bookmark the link above to access it anytime.
    </p>
  </div>
  <div style="background:#1C1614;color:#F0E6D4;padding:24px 32px;font-size:11px;text-align:center;letter-spacing:0.1em;text-transform:uppercase;">
    Plan Metric &middot; planmetric.com.au
  </div>
</body>
</html>`;
}

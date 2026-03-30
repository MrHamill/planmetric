import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

/* ─── POST /api/approve-plan ──────────────────────────────────
   Body: { submission_id: string }
   Sends the stored generated plan to the athlete + thank-you email.
   Updates status to "plan_sent".
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
    return NextResponse.json({ error: "Submission not found", detail: dbError?.message }, { status: 404 });
  }

  if (!sub.generated_plan) {
    return NextResponse.json({ error: "No generated plan found" }, { status: 404 });
  }

  if (sub.status === "plan_sent") {
    return NextResponse.json({ error: "Plan already sent to athlete" }, { status: 409 });
  }

  /* ── Email plan to athlete ──────────────────────────────── */
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const firstName = sub.full_name?.split(" ")[0] || sub.full_name || "there";

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://planmetric.com.au";
    const planUrl = `${siteUrl}/plan/${submission_id}`;

    // Send plan to athlete
    await resend.emails.send({
      from: "Plan Metric <admin@planmetric.com.au>",
      to: sub.email,
      subject: `Your ${sub.training_for || "Training"} Plan is Ready — Plan Metric`,
      html: wrapPlanEmail(firstName, planUrl),
    });

    // Send confirmation to admin
    await resend.emails.send({
      from: "Plan Metric <admin@planmetric.com.au>",
      to: "admin@planmetric.com.au",
      subject: `✅ Plan Delivered: ${sub.full_name} — ${sub.plan?.toUpperCase()} — ${sub.training_for}`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#0e0e0d;color:#e8e6e1;font-family:sans-serif;padding:32px;max-width:600px;margin:0 auto;">
  <div style="border-bottom:1px solid #2E7D32;padding-bottom:20px;margin-bottom:24px;">
    <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#2E7D32;margin:0 0 8px;">Plan Metric — Delivery Confirmed</p>
    <h1 style="font-size:28px;margin:0;font-weight:800;">Plan Sent to ${firstName}</h1>
  </div>
  <p style="font-size:14px;line-height:1.7;color:#9b9b8a;">
    ${sub.full_name}'s ${sub.plan?.toUpperCase()} ${sub.training_for} plan has been delivered to <strong style="color:#e8e6e1;">${sub.email}</strong>.
  </p>
  <div style="margin-top:40px;padding-top:20px;border-top:1px solid #1f201e;font-size:10px;color:#9b9b8a;letter-spacing:0.1em;text-transform:uppercase;">
    Plan Metric · admin@planmetric.com.au
  </div>
</body>
</html>`,
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

  return NextResponse.json({ ok: true, email: sub.email });
}

function wrapPlanEmail(firstName: string, planUrl: string): string {
  return `<!DOCTYPE html>
<html>
<body style="background:#F0E6D4;color:#1C1614;font-family:system-ui,-apple-system,sans-serif;padding:0;margin:0;">
  <div style="background:#A0522D;color:#F0E6D4;padding:24px 32px;">
    <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Plan Metric</p>
    <h1 style="font-size:24px;margin:0;font-weight:700;">Your Training Plan is Ready</h1>
  </div>
  <div style="padding:32px;max-width:600px;margin:0 auto;font-size:15px;line-height:1.8;color:#3A2E28;">
    <p style="margin:0 0 16px;">Hi ${firstName},</p>
    <p style="margin:0 0 16px;">Thank you for choosing to train with the Metric team &mdash; we're genuinely excited to be part of your journey to the start line.</p>
    <p style="margin:0 0 16px;">Your training plan is attached to this email. Everything you need is inside:</p>
    <ul style="margin:0 0 16px;padding-left:20px;color:#1C1614;">
      <li style="margin-bottom:8px;">Open the plan on any device &mdash; it's fully mobile friendly</li>
      <li style="margin-bottom:8px;">Expand each week using the dropdown to see your full session breakdown</li>
      <li style="margin-bottom:8px;">Read the Coach Tips section at the bottom &mdash; it's written specifically for you</li>
    </ul>
    <div style="text-align:center;margin:28px 0;">
      <a href="${planUrl}" style="display:inline-block;background:#A0522D;color:#F0E6D4;padding:14px 36px;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;border-radius:2px;">View Your Plan</a>
    </div>
    <p style="margin:0 0 16px;">If you have any questions about your plan, a session, or anything at all &mdash; please don't hesitate to reach out. We're here to help you get to that finish line.</p>
    <p style="margin:0 0 4px;font-weight:600;">Train smart. Race confident.</p>
    <p style="margin:0 0 4px;">The Plan Metric Team</p>
    <p style="margin:0 0 4px;"><a href="mailto:admin@planmetric.com.au" style="color:#A0522D;text-decoration:none;">admin@planmetric.com.au</a></p>
    <p style="margin:0;"><a href="https://planmetric.com.au" style="color:#A0522D;text-decoration:none;">planmetric.com.au</a></p>
  </div>
  <div style="background:#1C1614;color:#F0E6D4;padding:24px 32px;font-size:11px;text-align:center;letter-spacing:0.1em;text-transform:uppercase;">
    Plan Metric &middot; admin@planmetric.com.au &middot; planmetric.com.au
  </div>
</body>
</html>`;
}

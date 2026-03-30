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

    // Send plan to athlete
    await resend.emails.send({
      from: "Plan Metric <admin@planmetric.com.au>",
      to: sub.email,
      subject: `Your ${sub.training_for || "Training"} Plan is Ready — Plan Metric`,
      html: wrapPlanEmail(sub.full_name, sub.generated_plan),
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

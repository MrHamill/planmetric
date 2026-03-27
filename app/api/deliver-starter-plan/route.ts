import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

/* ─── POST /api/deliver-starter-plan ───────────────────────────
   Body: { submission_id: string }
   Reads the pre-built plan HTML from public/plans/ and emails it.
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

  /* ── Determine which plan file to send ───────────────────── */
  const d = sub.data as Record<string, unknown>;
  const event = String(d.trainingFor || sub.training_for || "").trim();
  const level = String(d.level || "Beginner").trim();

  const slug = `${event.toLowerCase().replace(/\s+/g, "-")}-${level.toLowerCase()}`;
  const planPath = resolve(process.cwd(), `public/plans/${slug}.html`);

  if (!existsSync(planPath)) {
    console.error(`Plan file not found: ${planPath}`);
    return NextResponse.json({ error: `Plan not found: ${slug}` }, { status: 404 });
  }

  const planHtml = readFileSync(planPath, "utf-8");

  /* ── Email the plan ──────────────────────────────────────── */
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
      from: "Plan Metric <admin@planmetric.com.au>",
      to: sub.email,
      subject: `Your ${event} ${level} Plan is Ready — Plan Metric`,
      html: wrapEmail(sub.full_name, event, level, planHtml),
    });

    await resend.emails.send({
      from: "Plan Metric <admin@planmetric.com.au>",
      to: "admin@planmetric.com.au",
      subject: `📋 Starter Plan Sent: ${sub.full_name} — ${event} ${level}`,
      html: wrapEmail(sub.full_name, event, level, planHtml),
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

  return NextResponse.json({ ok: true, email: sub.email, plan: slug });
}

function wrapEmail(name: string, event: string, level: string, planHtml: string): string {
  return `<!DOCTYPE html>
<html>
<body style="background:#F0E6D4;color:#1C1614;font-family:system-ui,-apple-system,sans-serif;padding:0;margin:0;">
  <div style="background:#A0522D;color:#F0E6D4;padding:24px 32px;">
    <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Plan Metric</p>
    <h1 style="font-size:24px;margin:0;font-weight:700;">Your ${event} Plan is Ready</h1>
    <p style="margin:8px 0 0;font-size:14px;opacity:0.85;">Hi ${name}, here's your ${level} ${event} training plan.</p>
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

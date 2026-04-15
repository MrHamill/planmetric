import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";

export const maxDuration = 30;

/* ─── GET /api/cron/check-stuck-orders ──────────────────────────
   Called by Vercel Cron every hour. Alerts admin if any orders
   have been stuck in an intermediate status for too long:
   - "paid" for > 1 hour (plan generation should have started)
   - "plan_generated" for > 24 hours (admin hasn't reviewed yet)
   ────────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Premium/Elite stuck in "paid" for over an hour (generation not completing)
  const { data: stuckPaid } = await supabase
    .from("intake_submissions")
    .select("id, full_name, email, plan, created_at")
    .eq("status", "paid")
    .in("plan", ["premium", "elite"])
    .lt("created_at", oneHourAgo);

  // Plans generated but not reviewed/sent for over 24 hours
  const { data: stuckGenerated } = await supabase
    .from("intake_submissions")
    .select("id, full_name, email, plan, created_at")
    .eq("status", "plan_generated")
    .lt("created_at", oneDayAgo);

  const alerts: string[] = [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (stuckPaid && stuckPaid.length > 0) {
    for (const s of stuckPaid) {
      alerts.push(
        `🔴 <strong>${s.full_name || "(no name)"}</strong> (${s.plan}) — paid but plan not generated. Order: ${s.created_at}<br/>` +
        `<a href="${siteUrl}/admin/review/${s.id}" style="color:#2196F3;">Review</a>`
      );
    }
  }

  if (stuckGenerated && stuckGenerated.length > 0) {
    for (const s of stuckGenerated) {
      alerts.push(
        `🟡 <strong>${s.full_name || "(no name)"}</strong> (${s.plan}) — plan ready but not sent for 24h+.<br/>` +
        `<a href="${siteUrl}/admin/review/${s.id}" style="color:#2196F3;">Review</a>`
      );
    }
  }

  if (alerts.length === 0) {
    return NextResponse.json({ ok: true, stuck: 0 });
  }

  // Send alert email to admin
  await sendEmail({
    to: "pete@planmetric.com.au",
    subject: `⚠️ ${alerts.length} stuck order${alerts.length > 1 ? "s" : ""} need attention`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="color: #d9534f;">Stuck Orders Alert</h2>
        <ul style="line-height: 1.8;">
          ${alerts.map(a => `<li>${a}</li>`).join("")}
        </ul>
        <p style="color: #888; font-size: 13px;">This check runs every hour from Vercel Cron.</p>
      </div>
    `,
  });

  console.log(`Stuck orders alert: ${alerts.length} orders flagged`);
  return NextResponse.json({ ok: true, stuck: alerts.length, alerts });
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/* ─── POST /api/webhooks/stripe ──────────────────────────────────
   Stripe sends checkout.session.completed here as a backup to the
   client-side verify flow. Ensures plans are delivered even if the
   customer closes the browser before the success page loads.
   ────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (e) {
    console.error("Webhook signature verification failed:", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const submissionId = session.metadata?.submission_id;

  if (!submissionId) {
    console.error("Webhook: checkout.session.completed missing submission_id metadata");
    return NextResponse.json({ error: "Missing submission_id" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { data: submission } = await supabase
    .from("intake_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (!submission) {
    console.error("Webhook: submission not found:", submissionId);
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  /* ── Already processed (verify endpoint got there first) ─── */
  if (submission.status !== "pending_payment") {
    return NextResponse.json({ ok: true, alreadyProcessed: true });
  }

  /* ── Mark as paid ──────────────────────────────────────────── */
  await supabase
    .from("intake_submissions")
    .update({ status: "paid", stripe_session_id: session.id })
    .eq("id", submissionId);

  /* ── Send admin + customer emails ──────────────────────────── */
  try {
    const d = submission.data;
    const planLabels: Record<string, string> = {
      starter: "Starter — $29.99",
      premium: "Premium — $99.99",
      elite: "Elite — $99/month",
    };

    await sendEmail({
      to: "pete@planmetric.com.au",
      subject: `New Plan Metric Intake — ${submission.full_name}`,
      html: `<p>New paid submission from <strong>${submission.full_name}</strong> (${submission.email})</p>
<p>Plan: ${planLabels[submission.plan] || submission.plan}</p>
<p>Event: ${submission.training_for}</p>
<p><em>Processed via Stripe webhook (backup).</em></p>`,
    });

    if (submission.email) {
      const firstName = submission.full_name?.split(" ")[0] || "there";
      await sendEmail({
        to: submission.email,
        subject: "Your Plan Metric order is confirmed",
        html: `<!DOCTYPE html>
<html>
<body style="background:#0F0F0F;color:#F5F5F0;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
  <div style="border-bottom:1px solid #2a2a2a;padding-bottom:24px;margin-bottom:32px;">
    <p style="font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#B85C2C;margin:0 0 12px;">Plan Metric</p>
    <h1 style="font-size:24px;margin:0;font-weight:800;">Order confirmed.</h1>
  </div>
  <p style="font-size:16px;line-height:1.7;color:#F5F5F0;">
    Thanks ${firstName} &mdash; we&rsquo;ve received your intake form and payment. Your plan will be delivered to this email shortly.
  </p>
  <p style="font-size:14px;color:rgba(245,245,240,0.45);margin-top:40px;">
    &mdash; Plan Metric
  </p>
</body>
</html>`,
      });
    }
  } catch (e) {
    console.error("Webhook email error:", e);
  }

  /* ── Trigger plan delivery ─────────────────────────────────── */
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (submission.plan === "starter") {
    fetch(`${siteUrl}/api/deliver-starter-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission_id: submissionId }),
    }).catch(e => console.error("Webhook: starter plan delivery error:", e));
  } else if (submission.plan === "premium" || submission.plan === "elite") {
    fetch(`${siteUrl}/api/generate-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission_id: submissionId }),
    }).catch(e => console.error("Webhook: plan generation trigger error:", e));
  }

  return NextResponse.json({ ok: true });
}

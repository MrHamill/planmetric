import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const EVENT_SLUGS: Record<string, string> = {
  "5K": "5k", "10K": "10k", "Half Marathon": "half-marathon",
  "Marathon": "marathon", "Olympic Tri": "olympic-tri",
  "70.3": "70-3", "Ironman": "ironman",
};

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 });
  }

  const event = session.metadata?.event || "";
  const level = session.metadata?.level || "Beginner";
  const email = session.customer_details?.email || session.customer_email || "";

  if (!email) {
    return NextResponse.json({ error: "No customer email found" }, { status: 400 });
  }

  const eventSlug = EVENT_SLUGS[event] || event.toLowerCase().replace(/[\s.]+/g, "-");
  const levelSlug = level.toLowerCase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://planmetric.com.au";
  const planUrl = `${siteUrl}/plans/${eventSlug}-${levelSlug}.html`;

  const firstName = email.split("@")[0];

  try {
    await sendEmail({
      to: email,
      subject: `Your ${event} ${level} Plan is Ready — Plan Metric`,
      html: buildPlanEmail(firstName, event, level, planUrl),
    });

    await sendEmail({
      to: "pete@planmetric.com.au",
      subject: `Starter Plan Sold: ${email} — ${event} ${level}`,
      html: `<p>Starter plan purchased and delivered.</p>
<p><strong>Customer:</strong> ${email}</p>
<p><strong>Plan:</strong> ${event} ${level}</p>
<p><strong>Link sent:</strong> <a href="${planUrl}">${planUrl}</a></p>`,
    });
  } catch (e) {
    console.error("Email error:", e);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, email });
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
      Bookmark the link above to access your plan anytime.
    </p>
  </div>
  <div style="background:#1C1614;color:#F0E6D4;padding:24px 32px;font-size:11px;text-align:center;letter-spacing:0.1em;text-transform:uppercase;">
    Plan Metric &middot; planmetric.com.au
  </div>
</body>
</html>`;
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const STARTER_PRICE_ID = "price_1THZszIvKrc1hDGjvr36p9bP";

export async function POST(req: NextRequest) {
  const { event, level } = await req.json();

  if (!event || !level) {
    return NextResponse.json({ error: "Missing event or level" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://planmetric.com.au";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: STARTER_PRICE_ID, quantity: 1 }],
    allow_promotion_codes: true,
    metadata: { event, level, plan: "starter" },
    success_url: `${baseUrl}/plans/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/plans`,
  });

  return NextResponse.json({ url: session.url });
}

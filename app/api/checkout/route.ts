import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string> = {
  starter: "price_1TFP7aEt0xoOVcMAjQJQHEfl",
  premium: "price_1TFP8eEt0xoOVcMAJWL3g0IF",
  elite:   "price_1TEQtrIvKrc1hDGjPQjhulVk",
};

export async function POST(req: NextRequest) {
  const { plan, formData } = await req.json();

  const priceId = PRICE_IDS[plan];
  if (!priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  /* ── Save draft to Supabase ─────────────────────────────── */
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data: submission, error: dbError } = await supabase
    .from("intake_submissions")
    .insert([{
      full_name:    formData.fullName,
      email:        formData.email,
      training_for: formData.trainingFor,
      race_date:    formData.raceDate || null,
      status:       "pending_payment",
      plan,
      data:         formData,
    }])
    .select("id")
    .single();

  if (dbError || !submission) {
    console.error("DB error:", JSON.stringify(dbError));
    return NextResponse.json({ error: "Failed to save submission", detail: dbError?.message }, { status: 500 });
  }

  /* ── Create Stripe Checkout session ─────────────────────── */
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://planmetric.com.au";

  const session = await stripe.checkout.sessions.create({
    mode:        plan === "elite" ? "subscription" : "payment",
    line_items:  [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    ...(formData.email ? { customer_email: formData.email } : {}),
    metadata:    { submission_id: submission.id },
    success_url: `${baseUrl}/intake/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${baseUrl}/intake`,
  });

  return NextResponse.json({ url: session.url });
}

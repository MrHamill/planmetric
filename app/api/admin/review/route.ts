import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ─── GET /api/admin/review?id=... ────────────────────────────
   Returns submission data + generated plan for admin review.
   ────────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { data: sub, error } = await supabase
    .from("intake_submissions")
    .select("id, full_name, email, training_for, race_date, plan, status, generated_plan, created_at")
    .eq("id", id)
    .single();

  if (error || !sub) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  return NextResponse.json(sub);
}

/* ─── PATCH /api/admin/review ─────────────────────────────────
   Body: { id: string, generated_plan: string }
   Saves edited plan HTML back to Supabase.
   ────────────────────────────────────────────────────────────── */
export async function PATCH(req: NextRequest) {
  const { id, generated_plan } = await req.json();

  if (!id || !generated_plan) {
    return NextResponse.json({ error: "Missing id or generated_plan" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { error } = await supabase
    .from("intake_submissions")
    .update({ generated_plan })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to save", detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/* ─── DELETE /api/admin/review ───────────────────────────────
   Body: { id: string }
   Dismisses an order — sets status to "dismissed" so the stuck
   order cron stops alerting about it.
   ────────────────────────────────────────────────────────────── */
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { error } = await supabase
    .from("intake_submissions")
    .update({ status: "dismissed" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to dismiss", detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

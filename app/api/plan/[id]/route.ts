import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ─── GET /api/plan/[id] ────────────────────────────────────
   Returns the generated_plan HTML for a given submission.
   ────────────────────────────────────────────────────────── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing plan ID" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { data: sub, error } = await supabase
    .from("intake_submissions")
    .select("full_name, training_for, generated_plan, status")
    .eq("id", id)
    .single();

  if (error || !sub) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  if (!sub.generated_plan) {
    return NextResponse.json({ error: "Plan not yet generated" }, { status: 404 });
  }

  return NextResponse.json({
    name: sub.full_name,
    training_for: sub.training_for,
    html: sub.generated_plan,
  });
}

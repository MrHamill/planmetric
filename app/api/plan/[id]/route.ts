import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

/* ─── GET /api/plan/[id] ────────────────────────────────────
   Returns the plan HTML for a given submission.
   - Starter plans: reads pre-built HTML from public/plans/
   - Premium/Elite: returns generated_plan from the database
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
    .select("full_name, training_for, plan, data, generated_plan, status")
    .eq("id", id)
    .single();

  if (error || !sub) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  /* ── Starter plans: read from public/plans/ ────────────── */
  if (sub.plan === "starter") {
    const d = sub.data as Record<string, unknown>;
    const event = String(d.trainingFor || sub.training_for || "").trim();
    const level = String(d.level || "Beginner").trim();
    const slug = `${event.toLowerCase().replace(/\s+/g, "-")}-${level.toLowerCase()}`;
    const planPath = resolve(process.cwd(), `public/plans/${slug}.html`);

    if (!existsSync(planPath)) {
      return NextResponse.json({ error: "Plan file not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: sub.full_name,
      training_for: sub.training_for,
      html: readFileSync(planPath, "utf-8"),
    });
  }

  /* ── Premium/Elite plans: read from database ───────────── */
  if (!sub.generated_plan) {
    return NextResponse.json({ error: "Plan not yet generated" }, { status: 404 });
  }

  return NextResponse.json({
    name: sub.full_name,
    training_for: sub.training_for,
    html: sub.generated_plan,
  });
}

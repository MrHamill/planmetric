import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseAthleteInputs, buildSkeleton } from "@/lib/plan-skeleton";

export const maxDuration = 300;

/* ─── GET /api/cron/resume-plans ─────────────────────────────────
   Called by Vercel Cron every 5 minutes. Handles two cases:
   1. Plans that need to START (paid, premium/elite, no part1 yet)
   2. Plans that stalled mid-generation (have part1, no final plan)
   Processes one plan per run to stay within the 300s timeout.
   ────────────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  // Verify this is a legitimate cron call
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  /* ── Case 1: Plans that need to START generation ────────── */
  const { data: needsStart } = await supabase
    .from("intake_submissions")
    .select("id, full_name, plan")
    .eq("status", "paid")
    .is("generated_plan_part1", null)
    .is("generated_plan", null)
    .in("plan", ["premium", "elite"])
    .order("created_at", { ascending: true })
    .limit(1);

  if (needsStart && needsStart.length > 0) {
    const sub = needsStart[0];
    console.log(`Cron: starting plan generation for ${sub.full_name}`);

    try {
      const res = await fetch(`${siteUrl}/api/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: sub.id }),
      });

      if (res.ok) {
        const body = await res.json();
        console.log(`Cron: ${sub.full_name} pass 1 done — ${body.weeksGenerated} weeks`);
        return NextResponse.json({ ok: true, action: "started", name: sub.full_name });
      } else {
        const text = await res.text();
        console.error(`Cron: ${sub.full_name} pass 1 failed (${res.status}): ${text.slice(0, 200)}`);
        return NextResponse.json({ ok: false, action: "start-failed", name: sub.full_name });
      }
    } catch (e) {
      console.error(`Cron: ${sub.full_name} pass 1 fetch error:`, e);
      return NextResponse.json({ ok: false, action: "start-error" }, { status: 500 });
    }
  }

  /* ── Case 2: Plans that stalled mid-generation ──────────── */
  const { data: stalled, error } = await supabase
    .from("intake_submissions")
    .select("id, full_name, training_for, race_date, plan, data, created_at, generated_plan_part1")
    .eq("status", "paid")
    .not("generated_plan_part1", "is", null)
    .is("generated_plan", null)
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) {
    console.error("Cron: DB error:", error.message);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!stalled || stalled.length === 0) {
    return NextResponse.json({ ok: true, action: "none" });
  }

  const sub = stalled[0];
  const part1 = sub.generated_plan_part1 as string;
  const weekMatches = part1.match(/Week\s+(\d+)/g) || [];
  const maxWeek = weekMatches.length > 0
    ? Math.max(...weekMatches.map((m: string) => parseInt(m.replace(/\D/g, ""), 10)))
    : 0;

  const inputs = parseAthleteInputs(sub.data as Record<string, unknown>, sub);
  const skeleton = buildSkeleton(inputs);
  const totalWeeks = skeleton.totalWeeks;
  const startWeek = Math.min(maxWeek + 1, totalWeeks);

  console.log(`Cron: resuming ${sub.full_name} from week ${startWeek} of ${totalWeeks}`);

  try {
    const res = await fetch(`${siteUrl}/api/generate-plan/continue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submission_id: sub.id,
        totalWeeks,
        startWeek,
        lastPhase: null,
      }),
    });

    if (res.ok) {
      const body = await res.json();
      console.log(`Cron: ${sub.full_name} — ${body.status}`);
      return NextResponse.json({ ok: true, action: "resumed", name: sub.full_name, status: body.status });
    } else {
      const text = await res.text();
      console.error(`Cron: ${sub.full_name} resume failed (${res.status}): ${text.slice(0, 200)}`);
      return NextResponse.json({ ok: false, action: "resume-failed", name: sub.full_name });
    }
  } catch (e) {
    console.error(`Cron: ${sub.full_name} resume fetch error:`, e);
    return NextResponse.json({ ok: false, action: "resume-error" }, { status: 500 });
  }
}

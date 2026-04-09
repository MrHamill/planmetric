/**
 * Retry failed plan generations by calling the continue endpoint.
 * Usage: node scripts/retry-failed-plans.mjs
 *
 * Reads submission data from Supabase to calculate correct totalWeeks,
 * then calls /api/generate-plan/continue for each failed plan.
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

// Submissions stuck at "paid" with generated_plan_part1 but no generated_plan
const { data: stalled, error } = await supabase
  .from("intake_submissions")
  .select("id, full_name, training_for, race_date, data, created_at")
  .eq("status", "paid")
  .not("generated_plan_part1", "is", null)
  .is("generated_plan", null);

if (error) {
  console.error("DB error:", error.message);
  process.exit(1);
}

if (!stalled || stalled.length === 0) {
  console.log("No stalled plans found.");
  process.exit(0);
}

console.log(`Found ${stalled.length} stalled plan(s):\n`);

for (const sub of stalled) {
  console.log(`─── ${sub.full_name} (${sub.training_for}) ───`);

  // Calculate totalWeeks from purchase date to race date
  const purchaseDate = new Date(sub.created_at);
  const raceDate = new Date(sub.race_date);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const totalWeeks = Math.ceil((raceDate - purchaseDate) / msPerWeek);

  // Find the highest week number already in part1 by calling the API
  // The continue route recalculates the skeleton, so we just need totalWeeks and startWeek
  // Query the DB to find what weeks exist
  const { data: partData } = await supabase
    .from("intake_submissions")
    .select("generated_plan_part1")
    .eq("id", sub.id)
    .single();

  const weekMatches = partData.generated_plan_part1.match(/Week\s+(\d+)/g) || [];
  const weekNumbers = weekMatches.map(m => parseInt(m.replace(/\D/g, "")));
  const maxWeek = Math.max(...weekNumbers);

  const startWeek = maxWeek + 1;

  console.log(`  Total weeks: ${totalWeeks}`);
  console.log(`  Weeks completed: 1-${maxWeek}`);
  console.log(`  Resuming from week: ${startWeek}`);
  console.log(`  Calling ${SITE_URL}/api/generate-plan/continue ...`);

  try {
    const res = await fetch(`${SITE_URL}/api/generate-plan/continue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submission_id: sub.id,
        totalWeeks,
        startWeek,
        lastPhase: null, // continue route recalculates from skeleton
      }),
    });

    const body = await res.json();

    if (res.ok) {
      console.log(`  ✓ ${body.status} — plan length: ${body.planLength?.toLocaleString()} chars`);
      if (body.validation) {
        console.log(`    QA: ${body.validation.criticals} critical, ${body.validation.warnings} warnings`);
      }
    } else {
      console.error(`  ✗ ${res.status}: ${body.error}`);
      if (body.weeksCompleted) {
        console.error(`    Completed up to week ${body.weeksCompleted} before failing`);
      }
    }
  } catch (e) {
    console.error(`  ✗ Fetch error: ${e.message}`);
  }

  console.log();
}

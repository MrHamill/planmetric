/**
 * Regenerate plans from scratch by calling the pass 1 endpoint.
 * Usage: node scripts/retry-failed-plans.mjs
 */

const SITE_URL = "https://planmetric.com.au";

const plans = [
  {
    name: "Nicholas Mathers (Cycling Event)",
    submission_id: "40a0293b-512e-42dc-b9ca-735cf603a637",
  },
  {
    name: "Luke O'Sullivan (Olympic Triathlon)",
    submission_id: "277a683a-1a12-40ce-8fa5-03c79558fe72",
  },
];

for (const plan of plans) {
  console.log(`─── ${plan.name} ───`);
  console.log(`  Calling ${SITE_URL}/api/generate-plan (pass 1) ...`);

  try {
    const res = await fetch(`${SITE_URL}/api/generate-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission_id: plan.submission_id }),
    });

    const body = await res.json();

    if (res.ok) {
      console.log(`  Pass 1 done — ${body.status}, weeks generated: ${body.weeksGenerated}`);
      console.log(`  Continue route will process remaining weeks automatically.`);
    } else {
      console.error(`  Failed ${res.status}: ${body.error}`);
      if (body.detail) console.error(`    Detail: ${body.detail}`);
    }
  } catch (e) {
    console.error(`  Fetch error: ${e.message}`);
  }

  console.log();
}

console.log("Pass 1 triggered for both plans. The continue route will complete them.");
console.log("Check your email for admin review notifications.");

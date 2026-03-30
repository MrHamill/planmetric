import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Allow up to 120 seconds for Claude to generate the full plan
export const maxDuration = 120;

/* ─── POST /api/generate-plan ──────────────────────────────────
   Body: { submission_id: string }
   1. Fetches athlete data from Supabase
   2. Generates personalised HTML training plan via Claude
   3. Emails the plan to the athlete + admin
   4. Updates submission status to "plan_sent"
   ────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
  const { submission_id } = await req.json();

  if (!submission_id) {
    return NextResponse.json({ error: "Missing submission_id" }, { status: 400 });
  }

  /* ── Fetch athlete data ──────────────────────────────────── */
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { data: sub, error: dbError } = await supabase
    .from("intake_submissions")
    .select("*")
    .eq("id", submission_id)
    .single();

  if (dbError || !sub) {
    return NextResponse.json({ error: "Submission not found", detail: dbError?.message }, { status: 404 });
  }

  if (sub.status !== "paid") {
    return NextResponse.json({ error: "Submission not paid" }, { status: 402 });
  }

  const d = sub.data as Record<string, unknown>;

  /* ── Build the athlete profile for the prompt ────────────── */
  const athleteProfile = buildAthleteProfile(d, sub);

  /* ── Generate plan via Claude (with prompt caching) ───── */
  const systemPrompt = buildSystemPrompt();
  const userPrompt = `Generate a complete personalised training plan for this athlete:\n\n${athleteProfile}`;

  let planHtml: string;
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 64000,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find(b => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Extract HTML from response (Claude may wrap it in ```html blocks)
    planHtml = extractHtml(textBlock.text);
  } catch (e) {
    console.error("Claude API error:", e);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }

  /* ── Save plan to Supabase + update status ──────────────── */
  await supabase
    .from("intake_submissions")
    .update({ status: "plan_generated", generated_plan: planHtml })
    .eq("id", submission_id);

  /* ── Email admin with review link (NOT athlete) ─────────── */
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const reviewUrl = `${siteUrl}/admin/review/${submission_id}`;

    await resend.emails.send({
      from: "Plan Metric <admin@planmetric.com.au>",
      to: "admin@planmetric.com.au",
      subject: `🔍 Review Plan: ${sub.full_name} — ${sub.plan?.toUpperCase()} — ${sub.training_for}`,
      html: buildAdminReviewEmail(sub.full_name, sub.training_for, sub.plan, reviewUrl),
    });
  } catch (e) {
    console.error("Email error:", e);
    // Don't fail the whole request — plan was generated and saved
  }

  return NextResponse.json({
    ok: true,
    email: sub.email,
    planLength: planHtml.length,
  });
  } catch (e: unknown) {
    console.error("Unhandled error in generate-plan:", e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Unhandled error", detail: message }, { status: 500 });
  }
}

/* ─── Helpers ──────────────────────────────────────────────── */

function buildAthleteProfile(d: Record<string, unknown>, sub: Record<string, unknown>): string {
  const lines: string[] = [];
  const add = (label: string, value: unknown) => {
    if (value && value !== "" && value !== false) {
      const v = Array.isArray(value) ? value.join(", ") : String(value);
      lines.push(`${label}: ${v}`);
    }
  };

  lines.push("=== PLAN TYPE ===");
  add("Plan", sub.plan);

  lines.push("\n=== PERSONAL ===");
  add("Name", d.fullName);
  add("Age", d.age);
  add("Gender", d.gender);
  add("Height", d.height ? `${d.height} cm` : "");
  add("Weight", d.weight ? `${d.weight} kg` : "");
  add("Location", d.location);

  lines.push("\n=== RACE & GOAL ===");
  add("Training For", d.trainingFor);
  add("Race Name", d.raceName);
  add("Race Date", d.raceDate);
  add("Main Goal", d.mainGoal);
  add("Target Time", d.targetTime);
  add("Completed Before", d.completedRaceBefore);
  add("Previous Finish Time", d.previousFinishTime);

  lines.push("\n=== CURRENT FITNESS ===");
  add("Training Consistency", d.trainingConsistency);
  add("Recent Race Result", d.recentRaceResult);
  // Support both legacy single splitTimes and new individual fields
  if (d.splitSwim || d.splitT1 || d.splitBike || d.splitT2 || d.splitRun) {
    const splits = [d.splitSwim && `Swim ${d.splitSwim}`, d.splitT1 && `T1 ${d.splitT1}`, d.splitBike && `Bike ${d.splitBike}`, d.splitT2 && `T2 ${d.splitT2}`, d.splitRun && `Run ${d.splitRun}`].filter(Boolean).join(" / ");
    add("Split Times", splits);
  } else {
    add("Split Times", d.splitTimes);
  }
  add("Max HR", d.maxHRUnknown ? "Unknown" : d.maxHR ? `${d.maxHR} BPM` : "");
  add("Resting HR", d.restingHRUnknown ? "Unknown" : d.restingHR ? `${d.restingHR} BPM` : "");

  lines.push("\n=== SWIM ===");
  add("Easy Pace", d.swimPaceEasy ? `${d.swimPaceEasy}/100m` : "");
  add("Threshold Pace", d.swimPaceHard ? `${d.swimPaceHard}/100m` : "");
  add("Weekly Volume", d.weeklySwimVolume);
  add("Longest Swim", d.longestSwim ? `${d.longestSwim}m` : "");
  add("Bilateral Breathing", d.bilateralBreathing);
  add("Pool Access", d.poolAccess);
  add("Open Water", d.openWaterAccess);
  add("Wetsuit", d.wetsuit);

  lines.push("\n=== BIKE ===");
  add("Avg Speed", d.avgBikeSpeed ? `${d.avgBikeSpeed} km/h` : "");
  add("Weekly Volume", d.weeklyBikeVolume);
  add("Longest Ride", d.longestRide);
  add("FTP", d.ftpUnknown ? "Unknown / no power meter" : d.ftp ? `${d.ftp}W` : "");
  add("Bike Type", d.bikeType);
  add("Power Meter", d.powerMeter);
  add("Indoor Trainer", d.indoorTrainer);

  lines.push("\n=== RUN ===");
  add("Weekly Distance", d.weeklyRunDistance ? `${d.weeklyRunDistance} km` : "");
  add("Longest Run", d.longestRun ? `${d.longestRun} km` : "");
  add("Easy Pace", d.easyRunPace ? `${d.easyRunPace}/km` : "");
  add("Recent Race", d.recentRunRace);
  add("Treadmill", d.treadmillAccess);

  lines.push("\n=== DISCIPLINE RANKING ===");
  add("Weakest", d.weakestDiscipline);
  add("Strongest", d.strongestDiscipline);

  lines.push("\n=== SCHEDULE ===");
  add("Training Days/Week", d.trainingDaysPerWeek);
  add("Rest Days/Week", d.restDaysPerWeek);
  add("Preferred Times", d.preferredTimes);
  add("Available Days", d.availableDays);
  add("Max Weekday Session", d.maxWeekdaySession);
  add("Max Weekend Session", d.maxWeekendSession);
  add("Double Days OK", d.doubleDays);
  add("Double Day Combos", d.doubleDayCombos);
  add("Long Session Day", d.preferredLongDay);
  add("Rest Day", d.preferredRestDay);
  add("Work Schedule", d.workShifts);
  add("Unavailable Weeks", d.unavailableWeeks);

  lines.push("\n=== OTHER SPORTS & COMMITMENTS ===");
  add("Other Sports", d.otherSports);
  if (d.otherSport1Name) {
    add("Activity 1", d.otherSport1Name);
    add("  Days", Array.isArray(d.otherSport1Days) ? (d.otherSport1Days as string[]).join(", ") : d.otherSport1Days);
    add("  Time", d.otherSport1Time);
    add("  Duration", d.otherSport1Duration);
    add("  Intensity", d.otherSport1Intensity);
  }
  if (d.otherSport2Name) {
    add("Activity 2", d.otherSport2Name);
    add("  Days", Array.isArray(d.otherSport2Days) ? (d.otherSport2Days as string[]).join(", ") : d.otherSport2Days);
    add("  Time", d.otherSport2Time);
    add("  Duration", d.otherSport2Duration);
    add("  Intensity", d.otherSport2Intensity);
  }

  lines.push("\n=== EQUIPMENT ===");
  add("GPS/HRM Watch", d.gpsWatch);
  add("Gym Access", d.gymAccess);
  add("Equipment Budget", d.equipmentBudget);

  lines.push("\n=== HEALTH & RECOVERY ===");
  add("Current Injuries", d.currentInjuries);
  add("Injury Description", d.injuryDescription);
  add("Injury History", d.injuryHistory);
  add("Avg Sleep", d.avgSleep);
  add("Stress Level", d.stressLevel);
  add("Race Nutrition Experience", d.raceNutrition);
  add("Strength Training", d.strengthTraining);
  add("Dietary Restrictions", d.dietaryRestrictions);

  lines.push("\n=== MOTIVATION ===");
  add("Training Preference", d.trainingPreference);
  add("Intensity Feeling", d.intensityFeeling);
  add("Training Blockers", d.trainingBlockers);
  add("Motivation", d.motivation);
  add("Success Definition", d.successDefinition);

  lines.push("\n=== ADDITIONAL NOTES ===");
  add("Athlete Notes", d.anythingElse);

  return lines.join("\n");
}

function buildSystemPrompt(): string {
  return `You are an elite endurance coach at Plan Metric creating a personalised HTML training plan for a paying customer. This plan must be significantly more detailed and personalised than the free Starter plans.

OUTPUT FORMAT:
Return ONLY valid HTML — a complete, self-contained training plan. No markdown, no explanation. Just the HTML starting with <!DOCTYPE html>.

PLAN STRUCTURE:
1. **Sticky Header** — "Plan Metric" logo on left, plan tier badge on right (Premium Plan or Elite Plan)
2. **Hero Section** — Athlete name, event + distance, race name + date, subtitle summarising the plan philosophy. Stats row: weeks, sessions/wk, race distance, primary training zones.
3. **Personalised Training Zones** — Calculated from the athlete's data:
   - If HR data provided: use Karvonen method (Training HR = Resting HR + (% × (Max HR − Resting HR))) for run/bike zones
   - If FTP provided: use FTP-based cycling zones (Z1 <55%, Z2 56-75%, Z3 76-90%, Z4 91-105%, Z5 106-120%)
   - If swim pace provided: calculate CSS zones (Recovery = CSS + 15s, Aerobic = CSS + 8-14s, CSS = ±3s, VO2max = CSS - 5-10s)
   - If data is unknown: use RPE-based zones with a note that testing is recommended
   - Running HR is baseline; cycling HR is 5-10 BPM lower; swimming HR is 10-15 BPM lower
4. **How To Use This Plan** — 4-6 personalised instructions referencing their schedule, constraints, and goals
5. **Week Overview Grid** — Clickable grid cells showing week number, phase name, and approximate hours
6. **Phase Banners** — Visual dividers between Base/Build/Peak/Taper phases
7. **Week-by-Week Plan** — Each week as a collapsible <details> accordion containing:
   - Progress dots (filled for past, current, empty for future)
   - Week overview paragraph
   - Day cards for EVERY day (Mon-Sun) with:
     - Day label, session name, discipline badge, RPE/zone badge, duration/distance badge
     - Session structure: specific warm-up → main set with exact intervals, distances, rest times, zones → cool-down
     - Coach's Note: minimum 3 sentences explaining WHAT to do, HOW to do it, and WHY it matters for this athlete
   - Key Workout Callout — highlights the most important session
   - Recovery Box — sleep, nutrition, stretching guidance
   - Weekly Check-In — reflective question for the athlete
8. **Race Day Protocol** — Day-by-day race week (7 days before), then discipline-by-discipline race execution with:
   - Pacing targets using their actual zones/paces
   - Nutrition protocol with carb/hr targets based on body weight and distance
   - Transition notes
   - Mental cues
9. **Glossary** — Definitions of all training terms used
10. **Coach Tips** — 6-8 tips specific to their race and level
11. **Footer** — Plan Metric branding with links to planmetric.com.au

SESSION DETAIL REQUIREMENTS — CRITICAL:
Every session must have specific numbers. NEVER write vague sessions.

SWIM sessions must include:
- Total distance
- Warm-up set with specific distances (e.g. 300m easy warm-up)
- Main set with intervals, distances, rest times, and zone (e.g. 8×100m at CSS pace with 15s rest — focus: high elbow catch)
- Cool-down distance
- Coaching note (3+ sentences)

BIKE sessions must include:
- Total duration
- Zone targets with the athlete's actual HR/power if available
- Cadence targets (80-100 RPM range)
- Structure: warm-up → main set → cool-down
- Coaching note (3+ sentences)

RUN sessions must include:
- Total distance or duration
- Pace/zone targets using athlete's actual paces if available
- Structure: warm-up → main set → cool-down
- Coaching note (3+ sentences)

BRICK sessions must include:
- Full bike component with detail
- Immediate run component with detail
- Transition practice notes
- Explanation of "brick legs" and what to expect

DESIGN:
- Background: #F0E6D4, cards: #E4DAC8, hover: #DBD0BC
- Text: #1C1614, secondary: #3A2E28, tertiary: #6B5E54
- Accent: #A0522D with dim variant rgba(160,82,45,0.12)
- Border: rgba(28,22,20,0.08)
- Green: #2E7D32, Orange: #E65100, Red: #C62828
- Triathlon discipline colours: Swim #0ea5e9, Bike #22c55e, Run #f97316, Brick #a855f7
- Fonts: Google Fonts — Inter (body) + Space Grotesk (headings) loaded via <link> tags
- Material Symbols Outlined for icons
- Collapsible weeks via <details><summary>
- Badge system: badge-accent, badge-swim, badge-bike, badge-run, badge-brick, badge-red (KEY), badge-rest
- Responsive (mobile-friendly)
- Print styles that open all accordions
- All units: KM, min/km, BPM, Celsius

COACHING KNOWLEDGE BASE:
Use these evidence-based principles in all coaching notes and session design:

INTENSITY DISTRIBUTION:
- 80-90% of training at low intensity (Zone 1-2, below VT1, conversational)
- 5-10% at threshold (Zone 3-4)
- 5% at high intensity (Zone 5, VO2max)
- 2-3 key quality sessions per week; remaining sessions are low-intensity aerobic
- Recovery days must be genuinely easy, not moderate

PERIODISATION:
- Base phase: aerobic volume, technique, Z1-Z2 only
- Build phase: introduce threshold, sport-specific work, brick sessions
- Peak phase: race-specific intensity, volume begins to reduce
- Taper: 2-3 weeks, volume drops 20-50%, intensity maintained
- Progressive overload: max ~10% increase per week
- Recovery week every 4th week at 50-60% normal volume

SWIMMING:
- Technique > volume — every session needs a drill component
- CSS (Critical Swim Speed) = sustainable threshold pace, calculated from 400m + 200m time trial
- CSS zones: Recovery (CSS+15s), Aerobic (CSS+8-14s), CSS (±3s), VO2max (CSS-5-10s)
- Varied sets beat continuous swimming (better velocity, technique, stimulus)
- Sight every 10 strokes in open water ("crocodile sighting" — eyes only, not head)
- Breathing: exhale underwater immediately, don't hold breath
- Open water requires 15-20% more energy than pool — minimum 2-3 OW swims before race
- Bilateral breathing prevents stroke imbalance and shoulder injury
- Wetsuit provides 2-4 sec/100m advantage from buoyancy

CYCLING:
- FTP zones: Z1 <55%, Z2 56-75%, Z3 76-90%, Z4 91-105%, Z5 106-120%, Z6 >121%
- Long ride is the anchor session for triathletes — builds aerobic engine
- Sweet spot (88-93% FTP): best adaptation-to-fatigue ratio
- Threshold intervals: 2×20min or 3×15min at 95-105% FTP
- VO2max: 5-8×3-5min at 110-120% FTP
- Over-unders: alternating above/below threshold to train lactate clearance
- Higher cadence (90-100 RPM) spares leg muscles for the run
- Indoor sessions produce similar training stress in less time (no coasting)
- Race bike specificity: train on the bike you'll race on

RUNNING:
- Highest injury risk discipline — conservative volume build, max +5 min/week
- 80% of runs at easy/conversational pace
- Max 2 quality sessions/week
- VO2max intervals: 6-10×400m at 5K pace, or 4-6×1km at 10K pace
- Tempo: 20-40min at threshold (T3), or 3×10min with 2min jog recovery
- Long run: 25-35% of weekly volume max, conversational pace
- Strides: 15-20s smooth accelerations, neuromuscular development
- Hill repeats: build power with less impact stress

BRICK SESSIONS:
- At least 2-4 brick sessions in the 6 weeks before race day
- Protocol: 60-90min bike at race effort → 15-30min run at race pace, no break
- "Brick legs" diminishes with repeated practice
- Vary brick run speeds: easy pace, strides, race-pace runs on different weeks

NUTRITION:
- <60min: 0-30g carbs/hr
- 60-90min: 30-60g/hr
- 90min-2.5hrs: 60-80g/hr
- >2.5hrs: 80-90g/hr (gut-trained: up to 120g/hr)
- Multiple transportable carbs (2:1 glucose:fructose) allow 80-90g/hr absorption
- Gut training: start at 40g/hr, increase by ~10g/hr every 1-2 weeks
- Hydration: 500-1000 mL/hr depending on conditions
- Sodium: 300-700 mg/hr for sessions >90min
- Pre-race: 1-2g carbs/kg body weight 3-4hrs before
- Recovery window: 0.3-0.5g/kg carbs + 20-30g protein within 60min
- Under-fuelling on the bike is the #1 cause of run blowups

RECOVERY:
- Sleep: 8-9 hrs/night is optimal, highest-ROI recovery tool
- Recovery week every 4th week at 50-60% volume
- Race recovery: Sprint 3-5 days, Olympic 5-7 days, 70.3 10-14 days, Ironman 3-4 weeks
- Cold water immersion: 10-15°C for 10-15min reduces acute soreness
- Anti-inflammatory diet: berries, greens, fatty fish, nuts, olive oil
- Account for life stress alongside training load

PLAN DURATION — CRITICAL RULE:
The plan must cover the FULL period from TODAY to the athlete's race date. There are NO preset plan lengths. Calculate the exact number of weeks from the current date to their race date, and build the complete periodised plan across that entire duration. This is a core differentiator of Plan Metric — every plan is custom-length.
- If the athlete has 24 weeks: longer base phase, gradual progression
- If the athlete has 12 weeks: compressed base, faster build
- If the athlete has 8 weeks: minimal base, rapid build, short taper
- Taper is always 2-3 weeks regardless of total plan length
- Recovery weeks every 3-4 weeks regardless of total plan length
- Distribute Base/Build/Peak phases proportionally across the remaining weeks

PERSONALISATION RULES:
- Sessions ONLY on the athlete's available days — respect their schedule exactly
- Long session on their preferred long day
- Rest day on their preferred rest day
- Double sessions only if they explicitly allow them
- Weekly volume must not exceed their stated max hours
- Work around all injuries with safe alternatives
- If HR/pace data is unknown, use RPE with a recommendation to test
- Taper must land precisely on their race date
- Account for other sports/commitments (e.g. soccer, gym) as training load — don't overload on those days
- Beginner tone: warm, supportive, confidence-building
- Intermediate tone: technical, motivating, progress-focused
- Elite tone: direct, data-driven, performance-focused`;
}

function buildAdminReviewEmail(name: string, event: string, plan: string, reviewUrl: string): string {
  return `<!DOCTYPE html>
<html>
<body style="background:#0e0e0d;color:#e8e6e1;font-family:sans-serif;padding:32px;max-width:600px;margin:0 auto;">
  <div style="border-bottom:1px solid #D9C2B4;padding-bottom:20px;margin-bottom:24px;">
    <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#D9C2B4;margin:0 0 8px;">Plan Metric — Review Required</p>
    <h1 style="font-size:28px;margin:0;font-weight:800;letter-spacing:-0.03em;">Plan Generated</h1>
  </div>
  <p style="font-size:16px;line-height:1.7;margin:0 0 8px;">
    <strong>${name}</strong>'s ${plan?.toUpperCase()} ${event} plan is ready for review.
  </p>
  <p style="font-size:14px;color:#9b9b8a;margin:0 0 32px;">
    Review the plan, make any edits, then approve to send it to the athlete.
  </p>
  <a href="${reviewUrl}" style="display:inline-block;background:#A0522D;color:#F0E6D4;padding:16px 32px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:2px;">
    Review &amp; Approve Plan
  </a>
  <p style="font-size:11px;color:#9b9b8a;margin:32px 0 0;">
    Or open directly: <a href="${reviewUrl}" style="color:#D9C2B4;">${reviewUrl}</a>
  </p>
  <div style="margin-top:40px;padding-top:20px;border-top:1px solid #1f201e;font-size:10px;color:#9b9b8a;letter-spacing:0.1em;text-transform:uppercase;">
    Plan Metric · admin@planmetric.com.au
  </div>
</body>
</html>`;
}

function extractHtml(text: string): string {
  // If Claude wraps in ```html blocks, extract it
  const match = text.match(/```html\s*([\s\S]*?)```/);
  if (match) return match[1].trim();

  // If it starts with <!DOCTYPE or <html, use as-is
  if (text.trim().startsWith("<!") || text.trim().startsWith("<html")) {
    return text.trim();
  }

  // Otherwise wrap it
  return `<!DOCTYPE html><html><body style="background:#F0E6D4;color:#1C1614;font-family:system-ui,sans-serif;padding:32px;max-width:800px;margin:0 auto;">${text}</body></html>`;
}

function wrapPlanEmail(name: string, planHtml: string): string {
  return `<!DOCTYPE html>
<html>
<body style="background:#F0E6D4;color:#1C1614;font-family:system-ui,-apple-system,sans-serif;padding:0;margin:0;">
  <div style="background:#A0522D;color:#F0E6D4;padding:24px 32px;">
    <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Plan Metric</p>
    <h1 style="font-size:24px;margin:0;font-weight:700;">Your Training Plan is Ready</h1>
    <p style="margin:8px 0 0;font-size:14px;opacity:0.85;">Hi ${name}, here's your personalised plan.</p>
  </div>
  <div style="padding:32px;max-width:800px;margin:0 auto;">
    ${planHtml}
  </div>
  <div style="background:#1C1614;color:#F0E6D4;padding:24px 32px;font-size:11px;text-align:center;letter-spacing:0.1em;text-transform:uppercase;">
    Plan Metric · admin@planmetric.com.au · planmetric.com.au
  </div>
</body>
</html>`;
}

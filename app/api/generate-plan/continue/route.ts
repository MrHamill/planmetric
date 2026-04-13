import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import {
  buildAthleteProfile, loadResearchContent,
  buildSessionPrompt, callAiForSessions,
} from "../route";
import type { AiResponse } from "../route";
import { buildSkeleton, parseAthleteInputs } from "@/lib/plan-skeleton";
import type { Phase } from "@/lib/plan-skeleton";
import { calculateZones } from "@/lib/plan-zones";
import { buildPartialHtml, buildClosingSections, injectCss, correctSwimDistances } from "@/lib/plan-html";
import type { WeekContent, FinalSections } from "@/lib/plan-html";
import { validatePlan } from "@/lib/validate-plan";
import type { ValidationResult } from "@/lib/validate-plan";

export const maxDuration = 300;

const CHUNK_SIZE = 5;
const MAX_RETRIES = 2;

/* ─── POST /api/generate-plan/continue ────────────────────────────
   Body: { submission_id, totalWeeks, startWeek, lastPhase }
   Loops through ALL remaining chunks in a single invocation.
   Saves progress after each chunk so work is never lost.
   On the final chunk, generates closing sections, stitches,
   validates, and emails admin.
   ────────────────────────────────────────────────────────────────── */
const TIMEOUT_BUFFER_MS = 240_000; // 240s — leave 60s buffer before the 300s Vercel limit

export async function POST(req: NextRequest) {
  try {
    const fnStart = Date.now();
    const { submission_id, totalWeeks, startWeek, lastPhase } = await req.json();

    if (!submission_id || !totalWeeks || !startWeek) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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

    if (!sub.generated_plan_part1) {
      return NextResponse.json({ error: "No partial plan found — generate-plan must run first" }, { status: 400 });
    }

    const d = sub.data as Record<string, unknown>;

    /* ── Recalculate skeleton (deterministic) ──────────────── */
    const inputs = parseAthleteInputs(d, sub);
    const skeleton = buildSkeleton(inputs);
    const zones = calculateZones(d);

    /* ── Build athlete profile + research (once) ──────────── */
    const athleteProfile = buildAthleteProfile(d, sub);
    const age = d.age ? parseInt(String(d.age), 10) : undefined;
    const research = loadResearchContent(
      d.trainingFor as string,
      isNaN(age as number) ? undefined : age,
    );

    /* ── Detect actual progress in part1 to prevent duplicate weeks ── */
    const part1Html = sub.generated_plan_part1 as string;
    const weekMatches = part1Html.match(/Week\s+(\d+)/g) || [];
    const maxWeekInPart1 = weekMatches.length > 0
      ? Math.max(...weekMatches.map(m => parseInt(m.replace(/\D/g, ""))))
      : 0;

    // If part1 already has weeks beyond startWeek, skip ahead to avoid duplicates
    let currentStart = startWeek;
    if (maxWeekInPart1 >= startWeek) {
      currentStart = maxWeekInPart1 + 1;
      console.log(`Part1 already has weeks up to ${maxWeekInPart1}. Skipping ahead to week ${currentStart}.`);
    }

    let currentPhase: Phase | null = (lastPhase as Phase) || null;
    let accumulatedHtml = part1Html;

    while (currentStart <= totalWeeks) {
      const currentEnd = Math.min(currentStart + CHUNK_SIZE - 1, totalWeeks);
      const isFinal = currentEnd >= totalWeeks;

      console.log(`Continue: weeks ${currentStart}-${currentEnd} of ${totalWeeks}${isFinal ? " (FINAL)" : ""}`);

      /* ── Check if approaching timeout — save progress, cron will resume ── */
      const elapsed = Date.now() - fnStart;
      if (elapsed > TIMEOUT_BUFFER_MS && currentStart > startWeek) {
        console.log(`Approaching timeout (${Math.round(elapsed / 1000)}s elapsed). Saving progress at week ${currentStart - 1}. Cron will resume.`);
        return NextResponse.json({ ok: true, status: "timeout-saved", weeksCompleted: currentStart - 1 });
      }

      const weeksToGenerate = skeleton.weeks.filter(
        w => w.weekNumber >= currentStart && w.weekNumber <= currentEnd,
      );
      const sessionPrompt = buildSessionPrompt(
        weeksToGenerate, athleteProfile, research, skeleton, isFinal, d,
      );

      /* ── Call AI with retry ─────────────────────────────── */
      let aiResponse: AiResponse;
      let succeeded = false;
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const result = await callAiForSessions(sessionPrompt, research);
          aiResponse = result.response;
          succeeded = true;
          break;
        } catch (e) {
          console.error(`Claude API error (weeks ${currentStart}-${currentEnd}, attempt ${attempt}/${MAX_RETRIES}):`, e);
          if (attempt === MAX_RETRIES) {
            return NextResponse.json({
              error: `Failed to generate weeks ${currentStart}-${currentEnd} after ${MAX_RETRIES} attempts`,
              weeksCompleted: currentStart - 1,
            }, { status: 500 });
          }
        }
      }

      if (!succeeded) break;

      const weekContents: WeekContent[] = aiResponse!.weeks;

      /* ── Assemble HTML for this chunk ────────────────────── */
      const { html: chunkHtml, lastPhase: newLastPhase } = buildPartialHtml(
        skeleton, zones, weekContents, d, sub.plan || "premium",
        currentStart, currentEnd, false, currentPhase,
      );

      currentPhase = newLastPhase;

      if (isFinal) {
        /* ── Build closing sections ────────────────────────── */
        const finalSections: FinalSections = {
          raceDayProtocol: aiResponse!.raceDayProtocol || {
            preRaceTimeline: "", raceStrategy: "", mentalStrategy: "",
          },
          glossary: aiResponse!.glossary || [],
          tips: aiResponse!.tips || [],
          phaseDescriptions: aiResponse!.phaseDescriptions || {
            BASE: "Building your aerobic foundation with easy, consistent training.",
            BUILD: "Introducing higher intensity work to build race-specific fitness.",
            PEAK: "Sharpening with race-pace sessions and maximum training load.",
            TAPER: "Reducing volume while maintaining intensity for fresh race-day legs.",
          },
        };

        const raceName = String(d.raceName || d.trainingFor || "Race");
        const closingHtml = buildClosingSections(skeleton, finalSections, raceName, sub.plan || "premium");

        /* ── Stitch everything together ────────────────────── */
        let fullPlan = accumulatedHtml + "\n\n" + chunkHtml + "\n\n" + closingHtml;
        fullPlan = await injectCss(fullPlan);
        fullPlan = correctSwimDistances(fullPlan);

        /* ── Validate final plan ───────────────────────────── */
        const validationResults = validatePlan(fullPlan, {
          totalWeeks,
          eventType: d.trainingFor as string || sub.training_for || "",
          athleteAge: isNaN(age as number) ? undefined : age,
          trainingDaysPerWeek: skeleton.trainingDays.length,
        });

        const criticals = validationResults.filter(r => r.severity === "critical");
        const warnings = validationResults.filter(r => r.severity === "warning");

        if (criticals.length > 0) {
          console.warn(`Plan QA CRITICAL for ${sub.full_name}:`, criticals.map(r => r.message));
        }
        if (warnings.length > 0) {
          console.warn(`Plan QA warnings for ${sub.full_name}:`, warnings.map(r => r.message));
        }
        if (validationResults.length === 0) {
          console.log(`Plan QA for ${sub.full_name}: ALL PASSED`);
        }

        /* ── Save to DB ────────────────────────────────────── */
        await supabase
          .from("intake_submissions")
          .update({
            status: "plan_generated",
            generated_plan: fullPlan,
            generated_plan_part1: null,
          })
          .eq("id", submission_id);

        /* ── Email admin ───────────────────────────────────── */
        try {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
          const reviewUrl = `${siteUrl}/admin/review/${submission_id}`;
          const qaStatus = criticals.length > 0
            ? ` !! ${criticals.length} CRITICAL`
            : warnings.length > 0
            ? ` ⚠ ${warnings.length} warnings`
            : " ✓ QA passed";

          await sendEmail({
            to: "pete@planmetric.com.au",
            subject: `Review Plan: ${sub.full_name} — ${sub.plan?.toUpperCase()} — ${sub.training_for}${qaStatus}`,
            html: buildAdminReviewEmail(sub.full_name, sub.training_for, sub.plan, reviewUrl, validationResults),
          });
        } catch (e) {
          console.error("Email error:", e);
        }

        return NextResponse.json({
          ok: true,
          status: "complete",
          planLength: fullPlan.length,
          validation: {
            passed: validationResults.length === 0,
            criticals: criticals.length,
            warnings: warnings.length,
            results: validationResults,
          },
        });
      } else {
        /* ── Save progress after each chunk ────────────────── */
        accumulatedHtml = accumulatedHtml + "\n\n" + chunkHtml;

        await supabase
          .from("intake_submissions")
          .update({ generated_plan_part1: accumulatedHtml })
          .eq("id", submission_id);

        console.log(`Saved progress: weeks 1-${currentEnd} of ${totalWeeks}`);
      }

      currentStart = currentEnd + 1;
    }

    return NextResponse.json({ error: "Unexpected loop exit" }, { status: 500 });
  } catch (e: unknown) {
    console.error("Unhandled error in generate-plan/continue:", e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Unhandled error", detail: message }, { status: 500 });
  }
}

/* ─── Admin Email ────────────────────────────────────────────── */

function buildAdminReviewEmail(name: string, event: string, plan: string, reviewUrl: string, results?: ValidationResult[]): string {
  const criticals = results?.filter(r => r.severity === "critical") || [];
  const warnings = results?.filter(r => r.severity === "warning") || [];

  let qaSection = "";
  if (!results || results.length === 0) {
    qaSection = `<div style="background:#1a1a18;border-radius:4px;padding:20px;margin:0 0 24px;">
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D9C2B4;margin:0 0 12px;">Plan QA Results</p>
      <p style="color:#4ade80;font-size:14px;font-weight:700;margin:0;">✓ All checks passed</p>
    </div>`;
  } else {
    let criticalHtml = "";
    if (criticals.length > 0) {
      criticalHtml = `<p style="color:#ef4444;font-size:13px;font-weight:700;margin:0 0 8px;">!! CRITICAL ISSUES (${criticals.length})</p>` +
        criticals.map(r => {
          const detailLines = r.details?.slice(0, 5).map(d => `<br/>&nbsp;&nbsp;- ${d}`).join("") || "";
          return `<p style="color:#fca5a5;font-size:12px;margin:0 0 6px;padding-left:12px;border-left:2px solid #ef4444;">${r.message}${detailLines}</p>`;
        }).join("");
    }

    let warningHtml = "";
    if (warnings.length > 0) {
      warningHtml = `<p style="color:#fbbf24;font-size:13px;font-weight:700;margin:${criticals.length > 0 ? "16px" : "0"} 0 8px;">⚠ Warnings (${warnings.length})</p>` +
        warnings.map(r => {
          const detailLines = r.details?.slice(0, 3).map(d => `<br/>&nbsp;&nbsp;- ${d}`).join("") || "";
          return `<p style="color:#fde68a;font-size:12px;margin:0 0 6px;padding-left:12px;border-left:2px solid #fbbf24;">${r.message}${detailLines}</p>`;
        }).join("");
    }

    qaSection = `<div style="background:#1a1a18;border-radius:4px;padding:20px;margin:0 0 24px;">
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D9C2B4;margin:0 0 12px;">Plan QA Results</p>
      ${criticalHtml}${warningHtml}
    </div>`;
  }

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
  <p style="font-size:14px;color:#9b9b8a;margin:0 0 24px;">
    Review the plan, make any edits, then approve to send it to the athlete.
  </p>
  ${qaSection}
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

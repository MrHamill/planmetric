import { NextRequest, NextResponse, after } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { buildAthleteProfile, buildSystemPrompt, extractHtml } from "../route";
import { validatePlan, ValidationResult } from "@/lib/validate-plan";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export const maxDuration = 300;

const CHUNK_SIZE = 5;

/* ─── POST /api/generate-plan/continue ────────────────────────────
   Body: { submission_id, totalWeeks, startWeek }
   Generates one chunk of weeks (up to CHUNK_SIZE). If more weeks
   remain, calls itself recursively. On the final chunk, also
   generates race day + footer, stitches everything, and finalizes.
   ────────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const { submission_id, totalWeeks, startWeek } = await req.json();

    if (!submission_id || !totalWeeks || !startWeek) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const endWeek = Math.min(startWeek + CHUNK_SIZE - 1, totalWeeks);
    const isFinal = endWeek >= totalWeeks;

    console.log(`Continue: weeks ${startWeek}-${endWeek} of ${totalWeeks}${isFinal ? " (FINAL)" : ""}`);

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
    const athleteProfile = buildAthleteProfile(d, sub);
    const age = d.age ? parseInt(String(d.age), 10) : undefined;
    const systemPrompt = buildSystemPrompt(d.trainingFor as string, isNaN(age as number) ? undefined : age);

    /* ── Build prompt for this chunk ─────────────────────────── */
    let chunkPrompt: string;

    if (isFinal) {
      chunkPrompt = `Generate the FINAL PART of a personalised training plan for this athlete. Weeks 1-${startWeek - 1} were already generated — you are continuing from where that left off.

${athleteProfile}

This plan has ${totalWeeks} total weeks. Generate ONLY:
1. Phase banners and DETAILED week-by-week content for Weeks ${startWeek} through ${totalWeeks} (the final week is race week)
2. Training Phases Breakdown section (phase-breakdown class — coach-style explanation of each phase). The week ranges in each phase card MUST exactly match the actual weeks in the plan. Use only four phases: BASE, BUILD, PEAK, TAPER.
3. Race Day Protocol section (race-protocol class) with THREE collapsible <details class="protocol-section"> sub-sections: <details class="protocol-section" open><summary>Pre-Race Timeline</summary> (open by default), <details class="protocol-section"><summary>Your Race Strategy</summary>, <details class="protocol-section"><summary>Mental Strategy</summary>
4. Glossary section (glossary class)
5. Coach Tips section (coach-tips class, 6-8 tips — use <span class="material-symbols-outlined"> icons in .tip-icon, NEVER emojis)
6. Footer (plan-footer class)
7. Close all remaining tags: </div></body></html>

MANDATORY CHECKLIST — every single week MUST have:
- Minimum 3 swim sessions, 3 bike sessions, 3 run sessions (for 70.3/Ironman)
- 1 long ride (title must include "Long")
- 1 long run (title must include "Long")
- All 7 days with full day-cards (session structure + coaching notes)
- All swim distances must be multiples of 50m — NEVER use 75m, 125m, etc.
- Freestyle only — no backstroke, breaststroke, or butterfly
- No same-discipline high intensity on consecutive days
- Coaching notes must be 3+ sentences per day

CRITICAL: You MUST complete ALL 7 days of every week before moving to the next. Do not cut off mid-week.
Do NOT output any CSS, <style>, <head>, <header>, hero, zones, overview, or weeks 1-${startWeek - 1}. Start directly from the phase banner for Week ${startWeek}.
Do NOT output \`\`\`html wrappers.`;
    } else {
      chunkPrompt = `Generate the NEXT PART of a personalised training plan for this athlete. Weeks 1-${startWeek - 1} were already generated — you are continuing from where that left off.

${athleteProfile}

This plan has ${totalWeeks} total weeks. Generate ONLY:
1. Phase banners (if a new phase starts in this range) and DETAILED week-by-week content for Weeks ${startWeek} through ${endWeek}

MANDATORY CHECKLIST — every single week MUST have:
- Minimum 3 swim sessions, 3 bike sessions, 3 run sessions (for 70.3/Ironman)
- 1 long ride (title must include "Long")
- 1 long run (title must include "Long")
- All 7 days with full day-cards (session structure + coaching notes)
- All swim distances must be multiples of 50m — NEVER use 75m, 125m, etc.
- Freestyle only — no backstroke, breaststroke, or butterfly
- No same-discipline high intensity on consecutive days
- Coaching notes must be 3+ sentences per day

CRITICAL: You MUST complete ALL 7 days of Week ${endWeek} before stopping. Do not cut off mid-week.
Do NOT output any CSS, <style>, <head>, <header>, hero, zones, overview, or weeks before ${startWeek}. Start directly from Week ${startWeek}.
Do NOT close the </div>, </body> or </html> tags — the plan continues in a follow-up.
Do NOT include Race Day Protocol, Glossary, Coach Tips, or Footer yet.
Do NOT output \`\`\`html wrappers.
End your output right after the last day-card of Week ${endWeek}.`;
    }

    /* ── Call Claude API ─────────────────────────────────────── */
    let chunkHtml: string;
    try {
      const stream = anthropic.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 16000,
        system: [
          { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
        ],
        messages: [{ role: "user", content: chunkPrompt }],
      });

      const message = await stream.finalMessage();
      const textBlock = message.content.find(b => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text response from Claude");
      }
      chunkHtml = extractHtml(textBlock.text);
    } catch (e) {
      console.error(`Claude API error (weeks ${startWeek}-${endWeek}):`, e);
      return NextResponse.json({ error: `Failed to generate weeks ${startWeek}-${endWeek}` }, { status: 500 });
    }

    if (isFinal) {
      /* ── Stitch all parts + finalize ──────────────────────── */
      const repairedPart1 = repairTrailingHtml(sub.generated_plan_part1);
      let stitched = stitchParts(repairedPart1, chunkHtml);
      stitched = await injectCss(stitched);

      /* ── Validate final plan ────────────────────────────────── */
      const age = d.age ? parseInt(String(d.age), 10) : undefined;
      const validationResults = validatePlan(stitched, {
        totalWeeks,
        eventType: d.trainingFor as string || sub.training_for || "",
        athleteAge: isNaN(age as number) ? undefined : age,
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

      await supabase
        .from("intake_submissions")
        .update({
          status: "plan_generated",
          generated_plan: stitched,
          generated_plan_part1: null,
        })
        .eq("id", submission_id);

      /* ── Email admin with review link ─────────────────────── */
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
        planLength: stitched.length,
        validation: {
          passed: validationResults.length === 0,
          criticals: criticals.length,
          warnings: warnings.length,
          results: validationResults,
        },
      });
    } else {
      /* ── Append chunk to part1 and trigger next chunk ─────── */
      const repairedPart1 = repairTrailingHtml(sub.generated_plan_part1);
      const updatedPart1 = repairedPart1 + "\n\n" + chunkHtml;

      await supabase
        .from("intake_submissions")
        .update({ generated_plan_part1: updatedPart1 })
        .eq("id", submission_id);

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      after(async () => {
        try {
          await fetch(`${siteUrl}/api/generate-plan/continue`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ submission_id, totalWeeks, startWeek: endWeek + 1 }),
          });
        } catch (e) {
          console.error("Failed to trigger next chunk:", e);
        }
      });

      return NextResponse.json({ ok: true, status: "generating", weeksGenerated: endWeek });
    }
  } catch (e: unknown) {
    console.error("Unhandled error in generate-plan/continue:", e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Unhandled error", detail: message }, { status: 500 });
  }
}

/* ─── Helpers ──────────────────────────────────────────────────── */

/** Close any orphaned HTML tags left when Claude gets cut off mid-week */
function repairTrailingHtml(html: string): string {
  // Track open tags (simplified — only cares about div, details, summary, section, span)
  const openTags: string[] = [];
  const tagRegex = /<\/?(\w+)[^>]*>/g;
  const selfClosing = new Set(["br", "hr", "img", "input", "meta", "link"]);
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const [full, tag] = match;
    const tagLower = tag.toLowerCase();
    if (selfClosing.has(tagLower)) continue;
    if (full.startsWith("</")) {
      // Closing tag — pop matching open tag
      const idx = openTags.lastIndexOf(tagLower);
      if (idx !== -1) openTags.splice(idx, 1);
    } else if (!full.endsWith("/>")) {
      openTags.push(tagLower);
    }
  }

  // Close orphaned tags in reverse order (skip html, body, head — those are structural)
  const structural = new Set(["html", "body", "head"]);
  const toClose = openTags.filter(t => !structural.has(t)).reverse();
  return html + toClose.map(t => `</${t}>`).join("\n");
}

function stitchParts(pass1: string, pass2: string): string {
  let p1 = pass1.replace(/<\/body>\s*<\/html>\s*$/i, "");
  let p2 = pass2
    .replace(/^<!DOCTYPE[^>]*>/i, "")
    .replace(/<html[^>]*>/i, "")
    .replace(/<head>[\s\S]*?<\/head>/i, "")
    .replace(/<body[^>]*>/i, "");

  return p1 + "\n\n" + p2;
}

async function injectCss(html: string): Promise<string> {
  let css = "";

  // Try filesystem first (works locally), then fetch from public URL (works on Vercel)
  try {
    const fs = require("fs");
    const path = require("path");
    const cssPath = path.resolve(process.cwd(), "public/assets/plan-styles.css");
    css = fs.readFileSync(cssPath, "utf-8");
  } catch {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const res = await fetch(`${siteUrl}/assets/plan-styles.css`);
      if (res.ok) css = await res.text();
    } catch {
      console.error("Could not load plan-styles.css from filesystem or URL");
    }
  }

  if (css && html.includes("</head>")) {
    return html.replace("</head>", `<style>${css}</style>\n</head>`);
  }
  if (css) {
    return html.replace(/<html[^>]*>/i, (match) => `${match}\n<head><style>${css}</style></head>`);
  }
  return html;
}


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

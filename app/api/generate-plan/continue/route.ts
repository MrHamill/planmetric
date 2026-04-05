import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { buildAthleteProfile, buildSystemPrompt, extractHtml } from "../route";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export const maxDuration = 300;

const CHUNK_SIZE = 6;

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
2. Race Day Protocol section (race-protocol class) with THREE collapsible <details class="protocol-section"> sub-sections: <details class="protocol-section" open><summary>Pre-Race Timeline</summary> (open by default), <details class="protocol-section"><summary>Your Race Strategy</summary>, <details class="protocol-section"><summary>Mental Strategy</summary>
3. Glossary section (glossary class)
4. Coach Tips section (coach-tips class, 6-8 tips — use <span class="material-symbols-outlined"> icons in .tip-icon, NEVER emojis)
5. Footer (plan-footer class)
6. Close all remaining tags: </div></body></html>

Each week MUST have all 7 days with full day-cards (session structure + coaching notes).
Do NOT output any CSS, <style>, <head>, <header>, hero, zones, overview, or weeks 1-${startWeek - 1}. Start directly from the phase banner for Week ${startWeek}.
Do NOT output \`\`\`html wrappers.`;
    } else {
      chunkPrompt = `Generate the NEXT PART of a personalised training plan for this athlete. Weeks 1-${startWeek - 1} were already generated — you are continuing from where that left off.

${athleteProfile}

This plan has ${totalWeeks} total weeks. Generate ONLY:
1. Phase banners (if a new phase starts in this range) and DETAILED week-by-week content for Weeks ${startWeek} through ${endWeek}

Each week MUST have all 7 days with full day-cards (session structure + coaching notes).
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
      let stitched = stitchParts(sub.generated_plan_part1, chunkHtml);
      stitched = injectCss(stitched);

      const missing = validateWeeks(stitched, totalWeeks);
      if (missing.length > 0) {
        console.warn(`Plan for ${sub.full_name}: missing weeks ${missing.join(", ")}`);
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

        await sendEmail({
          to: "pete@planmetric.com.au",
          subject: `Review Plan: ${sub.full_name} — ${sub.plan?.toUpperCase()} — ${sub.training_for}${missing.length > 0 ? ` Missing weeks: ${missing.join(",")}` : ""}`,
          html: buildAdminReviewEmail(sub.full_name, sub.training_for, sub.plan, reviewUrl),
        });
      } catch (e) {
        console.error("Email error:", e);
      }

      return NextResponse.json({
        ok: true,
        status: "complete",
        planLength: stitched.length,
        missingWeeks: missing,
      });
    } else {
      /* ── Append chunk to part1 and trigger next chunk ─────── */
      const updatedPart1 = sub.generated_plan_part1 + "\n\n" + chunkHtml;

      await supabase
        .from("intake_submissions")
        .update({ generated_plan_part1: updatedPart1 })
        .eq("id", submission_id);

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      fetch(`${siteUrl}/api/generate-plan/continue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id, totalWeeks, startWeek: endWeek + 1 }),
      }).catch(e => console.error("Failed to trigger next chunk:", e));

      return NextResponse.json({ ok: true, status: "generating", weeksGenerated: endWeek });
    }
  } catch (e: unknown) {
    console.error("Unhandled error in generate-plan/continue:", e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Unhandled error", detail: message }, { status: 500 });
  }
}

/* ─── Helpers ──────────────────────────────────────────────────── */

function stitchParts(pass1: string, pass2: string): string {
  let p1 = pass1.replace(/<\/body>\s*<\/html>\s*$/i, "");
  let p2 = pass2
    .replace(/^<!DOCTYPE[^>]*>/i, "")
    .replace(/<html[^>]*>/i, "")
    .replace(/<head>[\s\S]*?<\/head>/i, "")
    .replace(/<body[^>]*>/i, "");

  return p1 + "\n\n" + p2;
}

function injectCss(html: string): string {
  const fs = require("fs");
  const path = require("path");
  let css = "";
  try {
    const cssPath = path.resolve(process.cwd(), "public/plans/plan-styles.css");
    css = fs.readFileSync(cssPath, "utf-8");
  } catch {
    console.error("Could not read plan-styles.css");
  }

  if (css && html.includes("</head>")) {
    return html.replace("</head>", `<style>${css}</style>\n</head>`);
  }
  if (css) {
    return html.replace(/<html[^>]*>/i, (match) => `${match}\n<head><style>${css}</style></head>`);
  }
  return html;
}

function validateWeeks(html: string, expectedWeeks: number): number[] {
  const missing: number[] = [];
  for (let i = 1; i <= expectedWeeks; i++) {
    const pattern = new RegExp(`Week\\s+${i}\\b`);
    if (!pattern.test(html)) {
      missing.push(i);
    }
  }
  return missing;
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

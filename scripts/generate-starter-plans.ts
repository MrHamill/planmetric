/**
 * Generate all 21 pre-built Starter plans (7 events × 3 levels).
 *
 * Usage:
 *   npx tsx scripts/generate-starter-plans.ts
 *
 * Requires ANTHROPIC_API_KEY in .env.local or environment.
 * Writes HTML files to public/plans/<event>-<level>.html
 */

import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../.env.local") });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const EVENTS = [
  { name: "5K", weeks: { Beginner: 8, Intermediate: 8, Elite: 6 }, category: "Running" },
  { name: "10K", weeks: { Beginner: 10, Intermediate: 10, Elite: 8 }, category: "Running" },
  { name: "Half Marathon", weeks: { Beginner: 12, Intermediate: 12, Elite: 10 }, category: "Running" },
  { name: "Marathon", weeks: { Beginner: 16, Intermediate: 16, Elite: 14 }, category: "Running" },
  { name: "Olympic Tri", weeks: { Beginner: 12, Intermediate: 12, Elite: 10 }, category: "Triathlon" },
  { name: "70.3", weeks: { Beginner: 16, Intermediate: 16, Elite: 14 }, category: "Triathlon" },
  { name: "Ironman", weeks: { Beginner: 20, Intermediate: 20, Elite: 16 }, category: "Triathlon" },
] as const;

const LEVELS = ["Beginner", "Intermediate", "Elite"] as const;

function slug(event: string, level: string): string {
  return `${event.toLowerCase().replace(/\s+/g, "-")}-${level.toLowerCase()}`;
}

const SYSTEM = `You are an elite endurance coach at Plan Metric creating pre-built training plan templates.

OUTPUT FORMAT:
Return ONLY valid HTML — a complete, self-contained training plan. No markdown, no explanation. Just the HTML.

PLAN STRUCTURE:
1. **Header** — Event name, difficulty level, plan duration, overview paragraph
2. **Training Zones** — Generic HR zone table (Zone 1-5 with %MaxHR ranges), RPE scale, and pace guidance relative to goal pace
3. **Week-by-week plan** — Each week as a collapsible <details><summary> section:
   - Week number, phase name (Base/Build/Peak/Taper), weekly focus
   - Daily sessions in a table: Day | Session Type | Description | Duration | Intensity (RPE + Zone)
   - Weekly summary (total hours, total km)
4. **Race Week Protocol** — Final week breakdown, race morning checklist
5. **Race Execution Plan** — Pacing strategy, nutrition timing, mental cues
6. **Key Workouts Glossary** — Definitions of all session types used

DESIGN:
- Inline CSS only (email-safe)
- Background: #F0E6D4, text: #1C1614, accent: #A0522D
- Font: system-ui, -apple-system, sans-serif
- Collapsible weeks via <details><summary>
- Responsive, works on mobile
- All units: KM, min/km, BPM, Celsius
- Clean, minimal, magazine-quality

COACHING RULES:
- Periodisation: base → build → peak → taper
- Progressive overload ~10%/week max
- Recovery week every 3-4 weeks (reduce 30-40%)
- For triathlon: include brick sessions (bike→run)
- Taper 1-2 weeks before race
- Beginner: focus on completion, walk breaks OK, conservative pacing
- Intermediate: structured intervals, tempo work, race-pace sessions
- Elite: high-intensity periodisation, race-specific sharpening, advanced sessions
- Be specific with paces relative to goal (e.g. "Goal Pace +30s/km" for easy runs)`;

async function generatePlan(event: string, level: string, weeks: number, category: string): Promise<string> {
  const isTri = category === "Triathlon";
  const userPrompt = `Generate a complete ${weeks}-week ${level.toUpperCase()} training plan for ${event}.

Event: ${event}
Level: ${level}
Duration: ${weeks} weeks
Category: ${category}
${isTri ? "Disciplines: Swim, Bike, Run (include brick sessions and transition practice)" : `Discipline: Running only`}

${level === "Beginner" ? "This athlete is new to the distance. Focus on safe progression, walk-run intervals where appropriate, and building confidence. Assume 3-4 training days per week." : ""}
${level === "Intermediate" ? "This athlete has completed this distance before and wants to improve their time. Include structured intervals, tempo work, and race-pace sessions. Assume 4-5 training days per week." : ""}
${level === "Elite" ? "This athlete is competitive and targeting a strong performance. Include advanced sessions, race-specific sharpening, and detailed pacing. Assume 5-6 training days per week." : ""}

Generate the full HTML plan now.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16000,
    system: SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find(b => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("No text response");

  let html = textBlock.text;
  const match = html.match(/```html\s*([\s\S]*?)```/);
  if (match) html = match[1].trim();

  return html;
}

async function main() {
  const outDir = resolve(__dirname, "../public/plans");
  let generated = 0;
  let skipped = 0;

  for (const event of EVENTS) {
    for (const level of LEVELS) {
      const filename = `${slug(event.name, level)}.html`;
      const filepath = resolve(outDir, filename);

      // Skip if already generated
      if (existsSync(filepath)) {
        console.log(`⏭  Skipping ${filename} (already exists)`);
        skipped++;
        continue;
      }

      const weeks = event.weeks[level];
      console.log(`🏗  Generating ${event.name} — ${level} (${weeks} weeks)...`);

      try {
        const html = await generatePlan(event.name, level, weeks, event.category);
        writeFileSync(filepath, html, "utf-8");
        console.log(`✅  Saved ${filename} (${(html.length / 1024).toFixed(1)} KB)`);
        generated++;

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 2000));
      } catch (e) {
        console.error(`❌  Failed ${filename}:`, e);
      }
    }
  }

  console.log(`\nDone. Generated: ${generated}, Skipped: ${skipped}, Total: ${generated + skipped}/21`);
}

main();

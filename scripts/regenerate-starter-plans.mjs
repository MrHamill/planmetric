#!/usr/bin/env node
/**
 * Regenerate all 21 starter plans using the new code-driven skeleton + AI system.
 *
 * Usage:
 *   node scripts/regenerate-starter-plans.mjs                    # all 21 plans
 *   node scripts/regenerate-starter-plans.mjs marathon-beginner   # single plan
 *
 * Requires ANTHROPIC_API_KEY in .env.local
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Dynamic imports of our TS modules via tsx
const { buildSkeleton, parseAthleteInputs } = await import("../lib/plan-skeleton.ts");
const { calculateZones } = await import("../lib/plan-zones.ts");
const { buildFullPlanHtml, injectCss } = await import("../lib/plan-html.ts");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ─── Generic Athlete Profiles ───────────────────────────────── */

const PLAN_CONFIGS = [
  // Running
  { slug: "5k-beginner",              event: "5K",                level: "beginner",     weeks: 8,  days: 3, paceEasy: "7:30", maxHR: null, restHR: null },
  { slug: "5k-intermediate",          event: "5K",                level: "intermediate", weeks: 8,  days: 4, paceEasy: "6:15", maxHR: 185, restHR: 55 },
  { slug: "5k-elite",                 event: "5K",                level: "elite",        weeks: 8,  days: 5, paceEasy: "5:00", maxHR: 190, restHR: 48 },
  { slug: "10k-beginner",             event: "10K",               level: "beginner",     weeks: 10, days: 3, paceEasy: "7:30", maxHR: null, restHR: null },
  { slug: "10k-intermediate",         event: "10K",               level: "intermediate", weeks: 10, days: 4, paceEasy: "6:15", maxHR: 185, restHR: 55 },
  { slug: "10k-elite",                event: "10K",               level: "elite",        weeks: 10, days: 5, paceEasy: "5:00", maxHR: 190, restHR: 48 },
  { slug: "half-marathon-beginner",   event: "Half Marathon",     level: "beginner",     weeks: 12, days: 3, paceEasy: "7:30", maxHR: null, restHR: null },
  { slug: "half-marathon-intermediate", event: "Half Marathon",   level: "intermediate", weeks: 12, days: 4, paceEasy: "6:15", maxHR: 182, restHR: 55 },
  { slug: "half-marathon-elite",      event: "Half Marathon",     level: "elite",        weeks: 12, days: 5, paceEasy: "5:00", maxHR: 188, restHR: 48 },
  { slug: "marathon-beginner",        event: "Marathon",          level: "beginner",     weeks: 16, days: 4, paceEasy: "7:30", maxHR: null, restHR: null },
  { slug: "marathon-intermediate",    event: "Marathon",          level: "intermediate", weeks: 16, days: 4, paceEasy: "6:15", maxHR: 180, restHR: 55 },
  { slug: "marathon-elite",           event: "Marathon",          level: "elite",        weeks: 16, days: 5, paceEasy: "5:00", maxHR: 188, restHR: 45 },
  // Triathlon
  { slug: "olympic-tri-beginner",     event: "Olympic Triathlon", level: "beginner",     weeks: 12, days: 5, paceEasy: "7:00", maxHR: null, restHR: null, swimEasy: "2:30", swimHard: "2:00", ftp: null },
  { slug: "olympic-tri-intermediate", event: "Olympic Triathlon", level: "intermediate", weeks: 12, days: 5, paceEasy: "6:00", maxHR: 180, restHR: 55, swimEasy: "2:10", swimHard: "1:45", ftp: 180 },
  { slug: "olympic-tri-elite",        event: "Olympic Triathlon", level: "elite",        weeks: 12, days: 6, paceEasy: "5:00", maxHR: 188, restHR: 48, swimEasy: "1:45", swimHard: "1:25", ftp: 250 },
  { slug: "70-3-beginner",            event: "70.3 Ironman",      level: "beginner",     weeks: 16, days: 5, paceEasy: "7:00", maxHR: null, restHR: null, swimEasy: "2:30", swimHard: "2:05", ftp: null },
  { slug: "70-3-intermediate",        event: "70.3 Ironman",      level: "intermediate", weeks: 16, days: 6, paceEasy: "6:00", maxHR: 180, restHR: 55, swimEasy: "2:05", swimHard: "1:45", ftp: 190 },
  { slug: "70-3-elite",               event: "70.3 Ironman",      level: "elite",        weeks: 16, days: 6, paceEasy: "5:00", maxHR: 188, restHR: 48, swimEasy: "1:40", swimHard: "1:20", ftp: 260 },
  { slug: "ironman-beginner",         event: "Full Ironman",      level: "beginner",     weeks: 20, days: 5, paceEasy: "7:00", maxHR: null, restHR: null, swimEasy: "2:30", swimHard: "2:05", ftp: null },
  { slug: "ironman-intermediate",     event: "Full Ironman",      level: "intermediate", weeks: 20, days: 6, paceEasy: "6:00", maxHR: 180, restHR: 55, swimEasy: "2:05", swimHard: "1:45", ftp: 200 },
  { slug: "ironman-elite",            event: "Full Ironman",      level: "elite",        weeks: 20, days: 6, paceEasy: "5:00", maxHR: 190, restHR: 45, swimEasy: "1:40", swimHard: "1:20", ftp: 280 },
];

const LEVEL_PROFILES = {
  beginner: {
    name: "Starter Athlete",
    age: "32",
    gender: "Any",
    trainingConsistency: "New or returning to training",
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    preferredLongDay: "Saturday",
    preferredRestDay: "Monday",
    maxWeekdaySession: "75 min",
    maxWeekendSession: "No limit",
    preferredTimes: ["Morning"],
  },
  intermediate: {
    name: "Starter Athlete",
    age: "32",
    gender: "Any",
    trainingConsistency: "Regular training for 1-2 years",
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    preferredLongDay: "Saturday",
    preferredRestDay: "Monday",
    maxWeekdaySession: "90 min",
    maxWeekendSession: "No limit",
    preferredTimes: ["Morning"],
  },
  elite: {
    name: "Starter Athlete",
    age: "30",
    gender: "Any",
    trainingConsistency: "Consistent training for 3+ years",
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    preferredLongDay: "Saturday",
    preferredRestDay: "Monday",
    maxWeekdaySession: "2 hours",
    maxWeekendSession: "No limit",
    preferredTimes: ["Early morning"],
  },
};

/* ─── Research Loader ────────────────────────────────────────── */

function loadResearch(event) {
  const researchDir = path.resolve(ROOT, "docs/research");
  const TRI = ["Olympic Triathlon", "70.3 Ironman", "Full Ironman"];
  const files = ["nutrition.md", "recovery.md", "general-triathlon.md", "periodisation.md", "strength-conditioning.md", "training-load.md", "race-psychology.md"];

  if (TRI.includes(event)) files.push("swim.md", "bike.md", "run.md");
  else files.push("run.md");

  const MAX = 2000;
  const sections = [];
  for (const file of files) {
    try {
      let content = fs.readFileSync(path.join(researchDir, file), "utf-8");
      if (content.length > MAX) content = content.slice(0, MAX) + "\n[...truncated]";
      sections.push(`--- ${file.replace(".md", "").replace(/-/g, " ").toUpperCase()} ---\n${content}`);
    } catch { /* skip */ }
  }
  return sections.join("\n\n");
}

/* ─── AI Call ────────────────────────────────────────────────── */

const CHUNK_SIZE = 5;

async function generateSessionContent(weeks, athleteProfile, research, skeleton, isFinal) {
  const weekDescs = weeks.map(w => {
    const dayLines = w.sessions.map(s =>
      `  ${s.day} | ${s.sessionType} | ${s.discipline} | ${s.durationMinutes} min | ${s.zone}${s.includeStrength ? " | + strength supplement advice in coaching note" : ""}`
    ).join("\n");
    return `Week ${w.weekNumber} — ${w.phase}${w.isRecovery ? " (Recovery)" : ""}\nVolume: ${w.totalMinutes} min (${w.volumePercent}% of peak)\nSessions:\n${dayLines}`;
  }).join("\n\n");

  let prompt = `You are an elite endurance coach writing session content for a generic starter training plan.

ATHLETE PROFILE:
${athleteProfile}

${research ? `COACHING RESEARCH:\n${research}\n` : ""}

Write session details for the weeks below. Return ONLY valid JSON.

RULES:
- All swim distances MUST be multiples of 50m. NEVER use 75m, 125m, etc.
- Freestyle only — no backstroke, breaststroke, or butterfly
- Coaching notes: 3+ sentences, encouraging, actionable
- Include hydration reminders for sessions over 60 min
- Include fuelling guidance for sessions over 90 min
- Sessions marked "+ strength supplement": advise on timing, focus areas, intensity — don't prescribe specific exercises
- LONG RUN DISTANCES: Marathon peak 30-35km, Half marathon 18-21km. Calculate from duration and pace.

${weekDescs}`;

  if (isFinal) {
    prompt += `\n\nALSO generate:
"raceDayProtocol": { "preRaceTimeline": "HTML with .time-block elements", "raceStrategy": "HTML", "mentalStrategy": "HTML" },
"glossary": [{"term": "...", "definition": "..."}, ...] (10-15 terms),
"tips": [{"icon": "material_symbol_name", "title": "...", "description": "..."}, ...] (6-8 tips),
"phaseDescriptions": { "BASE": "...", "BUILD": "...", "PEAK": "...", "TAPER": "..." }`;
  }

  prompt += `\n\nJSON schema:
{
  "weeks": [{ "weekNumber": 1, "weeklySummary": "...", "sessions": [{ "sessionName": "...", "warmUp": "...", "mainSet": "...", "coolDown": "...", "total": "...", "coachingNote": "..." }] }]${isFinal ? `,\n  "raceDayProtocol": {...}, "glossary": [...], "tips": [...], "phaseDescriptions": {...}` : ""}
}`;

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16000,
    system: [{ type: "text", text: "You are an elite endurance coach. Return ONLY valid JSON.", cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg.content.find(b => b.type === "text")?.text || "";
  const input = msg.usage?.input_tokens || 0;
  const output = msg.usage?.output_tokens || 0;
  console.log(`    tokens: ${input} in / ${output} out`);

  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error("Failed to parse AI JSON");
  }
}

/* ─── Main ───────────────────────────────────────────────────── */

async function generatePlan(config) {
  const profile = LEVEL_PROFILES[config.level];

  // Build fake form data for skeleton
  const formData = {
    fullName: profile.name,
    age: profile.age,
    gender: profile.gender,
    trainingFor: config.event,
    planWeeks: String(config.weeks),
    trainingDaysPerWeek: String(config.days),
    availableDays: profile.availableDays,
    preferredLongDay: profile.preferredLongDay,
    preferredRestDay: profile.preferredRestDay,
    maxWeekdaySession: profile.maxWeekdaySession,
    maxWeekendSession: profile.maxWeekendSession,
    preferredTimes: profile.preferredTimes,
    trainingConsistency: profile.trainingConsistency,
    easyRunPace: config.paceEasy,
    maxHR: config.maxHR ? String(config.maxHR) : "",
    maxHRUnknown: !config.maxHR,
    restingHR: config.restHR ? String(config.restHR) : "",
    restingHRUnknown: !config.restHR,
    swimPaceEasy: config.swimEasy || "",
    swimPaceHard: config.swimHard || "",
    ftp: config.ftp ? String(config.ftp) : "",
    ftpUnknown: !config.ftp,
    mainGoal: `Complete ${config.event}`,
  };

  const sub = { plan: "starter", training_for: config.event };
  const inputs = parseAthleteInputs(formData, sub);
  const skeleton = buildSkeleton(inputs);
  const zones = calculateZones(formData);
  const research = loadResearch(config.event);

  // Build athlete profile text for AI
  const profileText = [
    `Plan: Starter (${config.level})`,
    `Event: ${config.event}`,
    `Level: ${config.level}`,
    `Training days/week: ${config.days}`,
    `Easy run pace: ${config.paceEasy}/km`,
    config.maxHR ? `Max HR: ${config.maxHR} BPM` : "Max HR: Unknown",
    config.restHR ? `Resting HR: ${config.restHR} BPM` : "Resting HR: Unknown",
    config.swimEasy ? `Swim easy pace: ${config.swimEasy}/100m` : "",
    config.swimHard ? `Swim threshold pace: ${config.swimHard}/100m` : "",
    config.ftp ? `FTP: ${config.ftp}W` : "",
    `This is a GENERIC starter plan for ${config.level}-level athletes. Keep advice general but actionable.`,
  ].filter(Boolean).join("\n");

  // Generate in chunks
  const allWeekContents = [];
  let finalSections = null;

  for (let start = 1; start <= skeleton.totalWeeks; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE - 1, skeleton.totalWeeks);
    const isFinal = end >= skeleton.totalWeeks;
    const weeksChunk = skeleton.weeks.filter(w => w.weekNumber >= start && w.weekNumber <= end);

    console.log(`  Generating weeks ${start}-${end}${isFinal ? " (FINAL)" : ""}...`);
    const result = await generateSessionContent(weeksChunk, profileText, research, skeleton, isFinal);

    allWeekContents.push(...result.weeks);
    if (isFinal) {
      finalSections = {
        raceDayProtocol: result.raceDayProtocol || { preRaceTimeline: "", raceStrategy: "", mentalStrategy: "" },
        glossary: result.glossary || [],
        tips: result.tips || [],
        phaseDescriptions: result.phaseDescriptions || {
          BASE: "Building your aerobic foundation with easy, consistent training.",
          BUILD: "Introducing higher intensity to build race-specific fitness.",
          PEAK: "Sharpening with race-pace sessions at maximum training load.",
          TAPER: "Reducing volume while maintaining intensity for fresh race-day legs.",
        },
      };
    }
  }

  // Assemble full HTML
  let html = buildFullPlanHtml(skeleton, zones, allWeekContents, finalSections, formData, "starter");
  html = await injectCss(html);

  return html;
}

async function main() {
  const filter = process.argv[2]; // optional: "marathon-beginner"
  const configs = filter ? PLAN_CONFIGS.filter(c => c.slug === filter) : PLAN_CONFIGS;

  if (configs.length === 0) {
    console.error(`No plan found for "${filter}". Available: ${PLAN_CONFIGS.map(c => c.slug).join(", ")}`);
    process.exit(1);
  }

  console.log(`Regenerating ${configs.length} starter plan(s)...\n`);

  let totalInput = 0;
  let totalOutput = 0;

  for (const config of configs) {
    console.log(`\n[${ configs.indexOf(config) + 1}/${configs.length}] ${config.slug} (${config.event} ${config.level}, ${config.weeks} weeks)`);

    try {
      const html = await generatePlan(config);
      const outPath = path.join(ROOT, "public/plans", `${config.slug}.html`);
      fs.writeFileSync(outPath, html, "utf-8");
      console.log(`  Saved: ${outPath} (${(html.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`  FAILED: ${e.message}`);
    }
  }

  console.log(`\nDone! All plans saved to public/plans/`);
}

main().catch(e => { console.error(e); process.exit(1); });

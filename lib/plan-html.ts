/* ─── HTML Template Assembly ──────────────────────────────────────
   Pure functions that build plan HTML from skeleton data + AI content.
   No AI calls here — just string templates using the correct CSS classes.
   ────────────────────────────────────────────────────────────────── */

import type { PlanSkeleton, WeekSkeleton, SessionSlot, Phase, PhaseRange, EventType } from "./plan-skeleton";
import type { TrainingZones, ZoneEntry } from "./plan-zones";

/* ─── AI Content Types ───────────────────────────────────────── */

export interface SessionContent {
  sessionName: string;
  warmUp: string;
  mainSet: string;
  coolDown: string;
  total: string;
  coachingNote: string;
}

export interface WeekContent {
  weekNumber: number;
  weeklySummary: string;
  sessions: SessionContent[];
}

export interface RaceDayContent {
  preRaceTimeline: string;
  raceStrategy: string;
  mentalStrategy: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface CoachTip {
  icon: string;
  title: string;
  description: string;
}

export interface FinalSections {
  raceDayProtocol: RaceDayContent;
  glossary: GlossaryTerm[];
  tips: CoachTip[];
  phaseDescriptions: Record<string, string>;
}

/* ─── Main Assembly ──────────────────────────────────────────── */

export function buildFullPlanHtml(
  skeleton: PlanSkeleton,
  zones: TrainingZones,
  weekContents: WeekContent[],
  finalSections: FinalSections,
  athleteData: Record<string, unknown>,
  planTier: string,
): string {
  const d = athleteData;
  const name = String(d.fullName || "Athlete");
  const raceName = String(d.raceName || d.trainingFor || "Race");
  const raceDate = d.raceDate ? formatRaceDate(new Date(d.raceDate as string)) : "";
  const goal = String(d.mainGoal || d.targetTime || "Complete the race");
  const targetTime = String(d.targetTime || "");

  const sections: string[] = [];

  sections.push(renderHead(name, raceName));
  sections.push("<body>");
  sections.push(renderHeader(planTier));
  sections.push(renderHero(name, raceName, raceDate, goal, targetTime, skeleton, d));
  sections.push('<div class="container">');
  sections.push(renderZonesSection(zones, skeleton.eventType));
  sections.push(renderHowToUse(skeleton.eventType, skeleton.trainingDays));
  sections.push(renderDisclaimer());
  sections.push(renderPhaseBreakdown(skeleton.phases, finalSections.phaseDescriptions));

  // Weeks with phase banners
  let currentPhase: Phase | null = null;
  const weekContentMap = new Map(weekContents.map(w => [w.weekNumber, w]));

  for (const week of skeleton.weeks) {
    if (week.phase !== currentPhase) {
      currentPhase = week.phase;
      const phaseRange = skeleton.phases.find(p => p.phase === currentPhase)!;
      sections.push(renderPhaseBanner(currentPhase, phaseRange));
    }
    const content = weekContentMap.get(week.weekNumber);
    sections.push(renderWeek(week, content));
  }

  sections.push("</div>"); // close container
  sections.push(renderRaceDayProtocol(finalSections.raceDayProtocol));
  sections.push(renderGlossary(finalSections.glossary));
  sections.push(renderCoachTips(finalSections.tips));
  sections.push(renderFooter());
  sections.push("</body></html>");

  return sections.join("\n");
}

/**
 * Build partial HTML for a chunk of weeks (used during incremental generation).
 * Pass 1: includes head + static sections + first chunk of weeks.
 * Continue: includes only week HTML (phase banners + weeks).
 */
export function buildPartialHtml(
  skeleton: PlanSkeleton,
  zones: TrainingZones,
  weekContents: WeekContent[],
  athleteData: Record<string, unknown>,
  planTier: string,
  startWeek: number,
  endWeek: number,
  isFirstChunk: boolean,
  currentPhaseState: Phase | null,
): { html: string; lastPhase: Phase } {
  const sections: string[] = [];

  if (isFirstChunk) {
    const d = athleteData;
    const name = String(d.fullName || "Athlete");
    const raceName = String(d.raceName || d.trainingFor || "Race");
    const raceDate = d.raceDate ? formatRaceDate(new Date(d.raceDate as string)) : "";
    const goal = String(d.mainGoal || d.targetTime || "Complete the race");
    const targetTime = String(d.targetTime || "");

    sections.push(renderHead(name, raceName));
    sections.push("<body>");
    sections.push(renderHeader(planTier));
    sections.push(renderHero(name, raceName, raceDate, goal, targetTime, skeleton, d));
    sections.push('<div class="container">');
    sections.push(renderZonesSection(zones, skeleton.eventType));
    sections.push(renderHowToUse(skeleton.eventType, skeleton.trainingDays));
    sections.push(renderDisclaimer());
  }

  // If no phase state provided but we're not starting from week 1,
  // infer the correct phase from the previous week to prevent duplicate banners
  let lastPhase = currentPhaseState;
  if (!lastPhase && startWeek > 1) {
    const prevWeek = skeleton.weeks.find(w => w.weekNumber === startWeek - 1);
    if (prevWeek) lastPhase = prevWeek.phase;
  }
  const weekContentMap = new Map(weekContents.map(w => [w.weekNumber, w]));

  for (const week of skeleton.weeks) {
    if (week.weekNumber < startWeek || week.weekNumber > endWeek) continue;

    if (week.phase !== lastPhase) {
      lastPhase = week.phase;
      const phaseRange = skeleton.phases.find(p => p.phase === lastPhase)!;
      sections.push(renderPhaseBanner(lastPhase, phaseRange));
    }

    const content = weekContentMap.get(week.weekNumber);
    sections.push(renderWeek(week, content));
  }

  return { html: sections.join("\n"), lastPhase: lastPhase || "BASE" };
}

/**
 * Build the closing sections (phase breakdown, race day, glossary, tips, footer).
 * Called after the final week chunk.
 */
export function buildClosingSections(
  skeleton: PlanSkeleton,
  finalSections: FinalSections,
): string {
  const sections: string[] = [];
  sections.push(renderPhaseBreakdown(skeleton.phases, finalSections.phaseDescriptions));
  sections.push("</div>"); // close container
  sections.push(renderRaceDayProtocol(finalSections.raceDayProtocol));
  sections.push(renderGlossary(finalSections.glossary));
  sections.push(renderCoachTips(finalSections.tips));
  sections.push(renderFooter());
  sections.push("</body></html>");
  return sections.join("\n");
}

/* ─── Section Renderers ──────────────────────────────────────── */

function renderHead(athleteName: string, raceName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(athleteName)} - ${esc(raceName)} Training Plan | Plan Metric</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>`;
}

function renderHeader(planTier: string): string {
  const badge = planTier.charAt(0).toUpperCase() + planTier.slice(1);
  return `<header class="header">
  <div class="header-content">
    <div class="logo">Plan Metric</div>
    <div class="premium-badge">${esc(badge)} Plan</div>
  </div>
</header>`;
}

function renderHero(
  name: string, raceName: string, raceDate: string,
  goal: string, targetTime: string,
  skeleton: PlanSkeleton, d: Record<string, unknown>,
): string {
  const stats: string[] = [];

  stats.push(renderStatCard(String(skeleton.totalWeeks), "Weeks"));
  stats.push(renderStatCard(String(skeleton.trainingDays.length), "Days/Week"));

  if (targetTime) {
    stats.push(renderStatCard(targetTime, "Target Time"));
  }

  const peakHours = (skeleton.peakVolumeMinutes / 60).toFixed(1);
  stats.push(renderStatCard(`${peakHours}h`, "Peak Volume"));

  return `<section class="hero">
  <div class="hero-content">
    <h1 class="athlete-name">${esc(name)}</h1>
    <div class="race-info">${esc(raceName)}${raceDate ? ` — <span class="race-date">${esc(raceDate)}</span>` : ""}</div>
    <div class="goal-badge">${esc(goal)}</div>
    <div class="stats-row">
      ${stats.join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderStatCard(value: string, label: string): string {
  return `<div class="stat-card"><div class="stat-value">${esc(value)}</div><div class="stat-label">${esc(label)}</div></div>`;
}

function renderZonesSection(zones: TrainingZones, eventType: EventType): string {
  const disciplines: string[] = [];

  if (zones.run && zones.run.length > 0 && isRunEvent(eventType)) {
    disciplines.push(renderZoneDiscipline("Running Zones", "directions_run", zones.run));
  }
  if (zones.bike && zones.bike.length > 0 && isCyclingEvent(eventType)) {
    disciplines.push(renderZoneDiscipline("Cycling Zones", "directions_bike", zones.bike));
  }
  if (zones.swim && zones.swim.length > 0 && isSwimEvent(eventType)) {
    disciplines.push(renderZoneDiscipline("Swimming Zones", "pool", zones.swim));
  }

  return `<section class="section">
  <h2 class="section-title"><span class="material-symbols-outlined">speed</span> Your Training Zones</h2>
  <div class="zones-grid">
    ${disciplines.join("\n    ")}
  </div>
</section>`;
}

function renderZoneDiscipline(title: string, icon: string, entries: ZoneEntry[]): string {
  const items = entries.map(z => {
    const values: string[] = [];
    if (z.hr) values.push(z.hr);
    if (z.pace) values.push(z.pace);
    if (z.power) values.push(z.power);
    values.push(z.rpe);

    return `<div class="zone-item"><span class="zone-name">${esc(z.name)}</span><div class="zone-values">${esc(values.join(" | "))}<br><small>${esc(z.description)}</small></div></div>`;
  }).join("\n      ");

  return `<div class="zone-discipline">
      <h3 class="discipline-title"><span class="material-symbols-outlined">${icon}</span> ${esc(title)}</h3>
      ${items}
    </div>`;
}

function renderHowToUse(eventType: EventType, trainingDays: string[]): string {
  const dayList = trainingDays.join(", ");
  const items = [
    { icon: "calendar_month", text: `Your training days are <strong>${dayList}</strong>. Each week follows the same day structure so you can build a consistent routine.` },
    { icon: "speed", text: "All sessions include target zones (HR, pace, or power) plus RPE so you can train by feel if needed. Stay in the prescribed zones — more is not better." },
    { icon: "trending_up", text: "Volume builds progressively with recovery weeks every 3-4 weeks. Trust the process — the easy weeks are when adaptation happens." },
    { icon: "expand_all", text: "Click any week to expand it and see your daily sessions. Each session includes warm-up, main set, cool-down, and a coaching note." },
    { icon: "health_and_safety", text: "Listen to your body. If something hurts beyond normal training fatigue, take an extra rest day. Consistency over heroics." },
  ];

  if (isTriEvent(eventType)) {
    items.push({ icon: "swap_horiz", text: "Brick sessions (bike-to-run) simulate race conditions. Practise your transition routine and nutrition strategy every time." });
  }

  const lis = items.map(i =>
    `<li><span class="material-symbols-outlined">${i.icon}</span> ${i.text}</li>`
  ).join("\n      ");

  return `<section class="section">
  <h2 class="section-title"><span class="material-symbols-outlined">menu_book</span> How To Use This Plan</h2>
  <ul class="instructions-list">
      ${lis}
  </ul>
</section>`;
}

function renderDisclaimer(): string {
  return `<div class="disclaimer">
  <span class="material-symbols-outlined">info</span>
  <p>This training plan is provided as a general guide only and does not constitute medical advice, professional coaching, or a substitute for consultation with qualified healthcare or fitness professionals. Plan Metric and its creators are not qualified coaches, medical practitioners, or dietitians. You should consult your doctor before starting any new exercise program. By using this plan, you acknowledge that you do so entirely at your own risk. Plan Metric accepts no liability for injury, illness, or loss arising from the use of this plan.</p>
</div>`;
}

function renderPhaseBreakdown(phases: PhaseRange[], descriptions: Record<string, string>): string {
  const PHASE_ICONS: Record<Phase, string> = {
    BASE: "foundation", BUILD: "trending_up", PEAK: "bolt", TAPER: "self_improvement",
  };
  const PHASE_NAMES: Record<Phase, string> = {
    BASE: "Base Building", BUILD: "Strength & Endurance", PEAK: "Peak Fitness", TAPER: "Taper & Race Prep",
  };

  const cards = phases.map(p => {
    const desc = descriptions[p.phase] || `Weeks ${p.startWeek}-${p.endWeek} of your training journey.`;
    return `<div class="phase-card">
      <div class="phase-card-header">
        <span class="material-symbols-outlined">${PHASE_ICONS[p.phase]}</span>
        <h3>${esc(PHASE_NAMES[p.phase])} <span class="phase-weeks">Weeks ${p.startWeek}–${p.endWeek}</span></h3>
      </div>
      <p>${esc(desc)}</p>
    </div>`;
  }).join("\n    ");

  return `<section class="section">
  <h2 class="section-title"><span class="material-symbols-outlined">timeline</span> Your Training Phases</h2>
  <div class="phase-breakdown">
    ${cards}
  </div>
</section>`;
}

/* ─── Phase Banner ───────────────────────────────────────────── */

const PHASE_BANNER_NAMES: Record<Phase, string> = {
  BASE: "Foundation Build",
  BUILD: "Aerobic Development",
  PEAK: "Strength Endurance",
  TAPER: "Taper and Race Preparation",
};

function renderPhaseBanner(phase: Phase, range: PhaseRange): string {
  const title = `Phase ${phaseNumber(phase)}: ${PHASE_BANNER_NAMES[phase]}`;
  const subtitle = `Weeks ${range.startWeek}–${range.endWeek}`;
  return `<div class="phase-banner">
  <h2 class="phase-title">${esc(title)}</h2>
  <p class="phase-subtitle">${esc(subtitle)}</p>
</div>`;
}

function phaseNumber(phase: Phase): number {
  return { BASE: 1, BUILD: 2, PEAK: 3, TAPER: 4 }[phase];
}

/* ─── Week Accordion ─────────────────────────────────────────── */

function renderWeek(week: WeekSkeleton, content?: WeekContent): string {
  const title = `Week ${week.weekNumber} — ${week.phase}${week.isRecovery ? " (Recovery)" : ""}`;
  const hours = (week.totalMinutes / 60).toFixed(1) + "h";
  const summary = content?.weeklySummary || "";
  const sessionMap = new Map<number, SessionContent>();
  if (content) {
    content.sessions.forEach((s, i) => sessionMap.set(i, s));
  }

  const dayCards = week.sessions.map((slot, i) => {
    const sc = sessionMap.get(i);
    return renderDayCard(slot, sc);
  }).join("\n        ");

  return `<div class="weekly-accordion">
  <details>
    <summary>
      <span>${esc(title)}</span>
      <div class="week-meta">
        <span class="badge badge-accent">${hours}</span>
        <span>${esc(week.dateRange)}</span>
      </div>
    </summary>
    <div class="week-content">
      <div class="weekly-summary">${esc(summary)}</div>
      <div class="days-grid">
        ${dayCards}
      </div>
    </div>
  </details>
</div>`;
}

/* ─── Day Card ───────────────────────────────────────────────── */

function renderDayCard(slot: SessionSlot, content?: SessionContent): string {
  const sessionName = content?.sessionName || formatSessionType(slot.sessionType);
  const titleText = `${slot.day} - ${sessionName}${slot.timeSlot ? ` (${slot.timeSlot})` : ""}`;
  const badgeClass = disciplineBadgeClass(slot.discipline);
  const disciplineLabel = slot.discipline.toUpperCase();
  const durLabel = `${slot.durationMinutes}min`;

  const warmUp = content?.warmUp || "";
  const mainSet = content?.mainSet || "";
  const coolDown = content?.coolDown || "";
  const total = content?.total || `${slot.durationMinutes} min`;
  const coachNote = content?.coachingNote || "";

  return `<div class="day-card">
  <div class="day-header">
    <h4 class="day-title">${esc(titleText)}</h4>
    <div class="day-badges">
      <span class="badge ${badgeClass}">${disciplineLabel}</span>
      <span class="badge">${esc(slot.zone)}</span>
      <span class="badge">${esc(durLabel)}</span>
    </div>
  </div>
  <div class="session-structure">
    <div class="structure-item"><span class="structure-label">Warm-up:</span> ${esc(warmUp)}</div>
    <div class="structure-item"><span class="structure-label">Main Set:</span> ${esc(mainSet)}</div>
    <div class="structure-item"><span class="structure-label">Cool-down:</span> ${esc(coolDown)}</div>
    <div class="structure-item"><span class="structure-label">Total:</span> ${esc(total)}</div>
  </div>
  <div class="coaching-note">
    <div class="note-title">Coach's Note:</div>
    ${esc(coachNote)}
  </div>
</div>`;
}

function disciplineBadgeClass(discipline: string): string {
  switch (discipline) {
    case "swim": return "badge-swim";
    case "bike": return "badge-bike";
    case "run": return "badge-run";
    case "brick": return "badge-brick";
    case "strength": return "badge-accent";
    default: return "badge-rest";
  }
}

function formatSessionType(st: string): string {
  return st.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

/* ─── Race Day Protocol ──────────────────────────────────────── */

function renderRaceDayProtocol(raceDayContent: RaceDayContent): string {
  if (!raceDayContent.preRaceTimeline && !raceDayContent.raceStrategy && !raceDayContent.mentalStrategy) {
    return "";
  }

  return `<section class="race-protocol">
  <h2><span class="material-symbols-outlined">flag</span> Race Day Protocol</h2>
  <details class="protocol-section" open>
    <summary>Pre-Race Timeline</summary>
    <div>${raceDayContent.preRaceTimeline}</div>
  </details>
  <details class="protocol-section">
    <summary>Your Race Strategy</summary>
    <div>${raceDayContent.raceStrategy}</div>
  </details>
  <details class="protocol-section">
    <summary>Mental Strategy</summary>
    <div>${raceDayContent.mentalStrategy}</div>
  </details>
</section>`;
}

/* ─── Glossary ───────────────────────────────────────────────── */

function renderGlossary(terms: GlossaryTerm[]): string {
  if (terms.length === 0) return "";

  const items = terms.map(t =>
    `<div class="term"><strong>${esc(t.term)}</strong><p>${esc(t.definition)}</p></div>`
  ).join("\n    ");

  return `<section class="glossary">
  <h2><span class="material-symbols-outlined">school</span> Glossary</h2>
  <div class="glossary-grid">
    ${items}
  </div>
</section>`;
}

/* ─── Coach Tips ─────────────────────────────────────────────── */

function renderCoachTips(tips: CoachTip[]): string {
  if (tips.length === 0) return "";

  const items = tips.map(t =>
    `<div class="tip">
      <div class="tip-icon"><span class="material-symbols-outlined">${esc(t.icon)}</span></div>
      <div class="tip-content"><h4>${esc(t.title)}</h4><p>${esc(t.description)}</p></div>
    </div>`
  ).join("\n    ");

  return `<section class="coach-tips">
  <h2><span class="material-symbols-outlined">psychology</span> Coach's Tips</h2>
  <div class="tips-grid">
    ${items}
  </div>
</section>`;
}

/* ─── Footer ─────────────────────────────────────────────────── */

function renderFooter(): string {
  return `<footer class="plan-footer">
  <div class="footer-content">
    <div class="footer-brand">
      <h3>Plan Metric</h3>
      <p>Personalised endurance training plans</p>
    </div>
    <div class="footer-contact">
      <p>Questions about your plan?</p>
      <a href="mailto:pete@planmetric.com.au"><span class="material-symbols-outlined">email</span> pete@planmetric.com.au</a>
    </div>
  </div>
  <div class="footer-bottom">
    &copy; ${new Date().getFullYear()} Plan Metric. All rights reserved.
  </div>
</footer>`;
}

/* ─── CSS Injection ──────────────────────────────────────────── */

export async function injectCss(html: string): Promise<string> {
  let css = "";

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
      console.error("Could not load plan-styles.css");
    }
  }

  if (css && html.includes("</head>")) {
    return html.replace("</head>", `<style>${css}</style>\n</head>`);
  }
  return html;
}

/* ─── Swim Distance Correction ─────────────────────────────── */

/**
 * Round all swim distances to the nearest 50m multiple.
 * The AI sometimes generates 25m, 75m, 125m etc. despite prompt rules.
 * This catches and fixes them in the final HTML.
 */
export function correctSwimDistances(html: string): string {
  // Match distances like "75m", "125 m", "225m" that aren't part of pace (e.g. 1:45/100m)
  return html.replace(/(?<![:/\d])(\d{2,4})\s*m\b/gi, (match, distStr) => {
    const dist = parseInt(distStr, 10);
    if (dist >= 25 && dist % 50 !== 0) {
      const corrected = Math.round(dist / 50) * 50;
      return match.replace(distStr, String(corrected));
    }
    return match;
  });
}

/* ─── Helpers ────────────────────────────────────────────────── */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatRaceDate(date: Date): string {
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function isTriEvent(eventType: EventType): boolean {
  return /triathlon|ironman/i.test(eventType);
}

function isCyclingEvent(eventType: EventType): boolean {
  return /cycling|ironman|triathlon/i.test(eventType);
}

function isSwimEvent(eventType: EventType): boolean {
  return /triathlon|ironman/i.test(eventType);
}

function isRunEvent(eventType: EventType): boolean {
  return !/cycling event/i.test(eventType);
}

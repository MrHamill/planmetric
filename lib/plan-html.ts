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
  sections.push(renderPlanOverview(name, raceName, raceDate, targetTime, skeleton, d));
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
    sections.push(renderPlanOverview(name, raceName, raceDate, targetTime, skeleton, d));
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
  // Detect which columns are present
  const hasHr = entries.some(z => z.hr);
  const hasPace = entries.some(z => z.pace);
  const hasPower = entries.some(z => z.power);

  let headerCols = "<th>Zone</th>";
  if (hasHr) headerCols += "<th>HR Range</th>";
  if (hasPace) headerCols += "<th>Pace</th>";
  if (hasPower) headerCols += "<th>Power</th>";
  headerCols += "<th>RPE</th><th>Description</th>";

  const rows = entries.map(z => {
    let cols = `<td class="zone-name-cell">${esc(z.name)}</td>`;
    if (hasHr) cols += `<td>${esc(z.hr || "—")}</td>`;
    if (hasPace) cols += `<td>${esc(z.pace || "—")}</td>`;
    if (hasPower) cols += `<td>${esc(z.power || "—")}</td>`;
    cols += `<td>${esc(z.rpe)}</td>`;
    cols += `<td class="zone-desc-cell">${esc(z.description)}</td>`;
    return `<tr>${cols}</tr>`;
  }).join("\n        ");

  return `<div class="zone-discipline">
      <h3 class="discipline-title"><span class="material-symbols-outlined">${icon}</span> ${esc(title)}</h3>
      <div class="zone-table-wrap">
        <table class="zone-table">
          <thead><tr>${headerCols}</tr></thead>
          <tbody>
        ${rows}
          </tbody>
        </table>
      </div>
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
  // Unavailable weeks get a simplified self-managed card
  if ((week as WeekSkeleton & { isUnavailable?: boolean }).isUnavailable) {
    return `<div class="weekly-accordion">
  <details>
    <summary>
      <span>Week ${week.weekNumber} — Unavailable</span>
      <div class="week-meta">
        <span class="badge badge-accent">Self-Managed</span>
        <span>${esc(week.dateRange)}</span>
      </div>
    </summary>
    <div class="week-content">
      <div class="weekly-summary">You've flagged this week as unavailable — keep moving if you can but don't stress the structure. A few easy sessions will maintain your base. Pick back up where the plan resumes.</div>
    </div>
  </details>
</div>`;
  }

  const title = `Week ${week.weekNumber} — ${week.phase}${week.isRecovery ? " (Recovery)" : ""}`;
  const hours = (week.totalMinutes / 60).toFixed(1) + "h";
  const summary = content?.weeklySummary || "";
  const sessionMap = new Map<number, SessionContent>();
  if (content) {
    content.sessions.forEach((s, i) => sessionMap.set(i, s));
  }

  // Unique discipline badges for the collapsed header
  const disciplines = [...new Set(week.sessions.map(s => s.discipline))].filter(d => d !== "rest" && d !== "strength");
  const disciplineBadges = disciplines.map(d =>
    `<span class="badge ${disciplineBadgeClass(d)}">${d.toUpperCase()}</span>`
  ).join(" ");

  const dayCards = week.sessions.map((slot, i) => {
    const sc = sessionMap.get(i);
    return renderDayCard(slot, sc);
  }).join("\n        ");

  return `<div class="weekly-accordion">
  <details>
    <summary>
      <span>${esc(title)}</span>
      <div class="week-meta">
        <span class="week-disciplines">${disciplineBadges}</span>
        <span class="badge badge-accent">${hours}</span>
        <span>${esc(week.dateRange)}</span>
      </div>
    </summary>
    <div class="week-content">
      ${renderMiniCalendar(week)}
      <div class="weekly-summary">${esc(summary)}</div>
      <div class="days-grid">
        ${dayCards}
      </div>
    </div>
  </details>
</div>`;
}

/* ─── Mini Calendar Strip ───────────────────────────────────── */

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function renderMiniCalendar(week: WeekSkeleton): string {
  const sessionsByDay = new Map<string, SessionSlot>();
  for (const s of week.sessions) {
    sessionsByDay.set(s.day, s);
  }

  const cells = ALL_DAYS.map(day => {
    const session = sessionsByDay.get(day);
    if (session) {
      const cls = disciplineBadgeClass(session.discipline);
      return `<div class="cal-day cal-active"><span class="cal-label">${day}</span><span class="badge ${cls} cal-badge">${session.discipline.toUpperCase()}</span></div>`;
    }
    return `<div class="cal-day cal-rest"><span class="cal-label">${day}</span><span class="cal-off">Rest</span></div>`;
  }).join("\n      ");

  return `<div class="mini-calendar">
      ${cells}
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

/* ─── Plan Overview ─────────────────────────────────────────── */

function parseTimeToSeconds(time: string): number | null {
  const parts = time.trim().split(":").map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
}

function formatSecondsDiff(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}

function renderPlanOverview(
  name: string, raceName: string, raceDate: string,
  targetTime: string, skeleton: PlanSkeleton, d: Record<string, unknown>,
): string {
  const totalWeeks = skeleton.totalWeeks;
  const daysPerWeek = skeleton.trainingDays.length;
  const dayList = skeleton.trainingDays.join(", ");
  const firstName = name.split(" ")[0];

  /* ── Paragraph 1: The goal ──────────────────────────────── */

  const recentResult = d.recentRaceResult ? String(d.recentRaceResult).trim() : "";
  const previousFinish = d.previousFinishTime ? String(d.previousFinishTime).trim() : "";
  const comparisonTime = recentResult || previousFinish;
  const comparisonSeconds = comparisonTime ? parseTimeToSeconds(comparisonTime) : null;
  const targetSeconds = targetTime ? parseTimeToSeconds(targetTime) : null;

  const successDef = d.successDefinition ? String(d.successDefinition).trim().replace(/\.+$/, "") : "";

  let p1 = "";
  if (successDef) {
    p1 = `Your definition of success: "${esc(successDef)}." Everything in this plan points at that. `;
  }
  p1 += `${esc(firstName)}, this is your ${totalWeeks}-week plan for ${esc(raceName)}${raceDate ? ` on ${esc(raceDate)}` : ""} — ${daysPerWeek} days a week across ${esc(dayList)}.`;

  if (targetTime && comparisonSeconds && targetSeconds && comparisonSeconds > targetSeconds) {
    const gapSeconds = comparisonSeconds - targetSeconds;
    const gapPercent = ((gapSeconds / comparisonSeconds) * 100).toFixed(1);
    const gapFormatted = formatSecondsDiff(gapSeconds);
    const isAmbitious = gapSeconds / comparisonSeconds > 0.15;

    p1 += ` Your most recent result at this distance is ${esc(comparisonTime)} and you're chasing ${esc(targetTime)} — that's a ${gapPercent}% improvement, ${gapFormatted} faster.`;
    if (isAmbitious) {
      p1 += ` That's ambitious, and this plan is built to get you there, but it will ask for patience on the days where the numbers don't feel easy.`;
    }
  } else if (targetTime && comparisonTime) {
    p1 += ` Your most recent result at this distance was ${esc(comparisonTime)} and you're targeting ${esc(targetTime)} — we'll build towards that systematically.`;
  } else if (targetTime) {
    p1 += ` You're targeting ${esc(targetTime)}, and every session in this plan works backwards from that number.`;
  }

  /* ── Paragraph 2: The reality ───────────────────────────── */

  const hasInjury = d.currentInjuries && String(d.currentInjuries).toLowerCase() === "yes";
  const avgSleep = d.avgSleep ? String(d.avgSleep) : "";
  const sleepMatch = avgSleep.match(/(\d+)/);
  const sleepHours = sleepMatch ? parseInt(sleepMatch[1], 10) : null;
  const lowSleep = sleepHours !== null && sleepHours < 7;
  const sleepDisplay = avgSleep.replace(/\s*h(ou)?rs?\s*$/i, "").trim();
  const stressLevel = d.stressLevel ? String(d.stressLevel) : "";
  const highStress = stressLevel.toLowerCase().startsWith("high");
  const blockers = d.trainingBlockers ? String(d.trainingBlockers).trim() : "";
  const hasBlockers = blockers !== "" && !/^(nil|none|no|n\/a)$/i.test(blockers);

  const recoveryFactors = [hasInjury, lowSleep, highStress].filter(Boolean).length;
  let p2 = "";

  if (recoveryFactors > 0) {
    // Lead with injury if present, otherwise lead with recovery context
    if (hasInjury && lowSleep && highStress) {
      p2 = `You're managing a significant injury history, averaging ${esc(sleepDisplay)} hours of sleep, and carrying high stress outside of training — that's a recovery picture that needs to be taken seriously.`;
    } else if (hasInjury && lowSleep) {
      p2 = `You're managing a significant injury history and averaging ${esc(sleepDisplay)} hours of sleep — both of those shape how your body recovers between sessions.`;
    } else if (hasInjury && highStress) {
      p2 = `You're managing a significant injury history alongside high stress outside of training — recovery matters as much as the sessions themselves.`;
    } else if (lowSleep && highStress) {
      p2 = `You're averaging ${esc(sleepDisplay)} hours of sleep and carrying high stress outside of training — that combination means your recovery window is narrower than most.`;
    } else if (hasInjury) {
      p2 = `You're managing a significant injury history, and that shapes how this plan should be followed.`;
    } else if (lowSleep) {
      p2 = `You're averaging ${esc(sleepDisplay)} hours of sleep, and that matters more than most athletes realise — adaptation happens during recovery, not during the session.`;
    } else if (highStress) {
      p2 = `You've flagged high stress outside of training, and that draws from the same recovery bank as your sessions.`;
    }

    p2 += ` None of that is a barrier, but it does mean warm-ups and cool-downs aren't optional, easy days need to stay easy, and on weeks where life is particularly demanding, dropping intensity is smarter than skipping sessions entirely.`;

    if (hasBlockers) {
      p2 += ` You've told us your biggest blocker is ${esc(blockers.toLowerCase())}. Every session in this plan has been structured with that in mind — rest days exist for exactly this reason. Use them without guilt.`;
    }
  } else if (hasBlockers) {
    p2 = `You've told us your biggest blocker is ${esc(blockers.toLowerCase())}. Every session in this plan has been structured with that in mind — rest days exist for exactly this reason. Use them without guilt. Coming back at 80% beats not coming back at all.`;
  }

  // Shift work alert
  const workShifts = d.workShifts ? String(d.workShifts) : "";
  const hasShiftWork = workShifts.includes("rotating") || workShifts.includes("night") || workShifts.includes("FIFO");
  if (hasShiftWork) {
    const shiftType = workShifts.replace("Yes — ", "");
    p2 += (p2 ? " " : "") + `Your schedule is a guide, not a contract. With ${esc(shiftType)}, treat the prescribed days as targets — if a shift disrupts your recovery, move the session forward or swap it for an easy day. The plan adapts to you, not the other way around.`;
  }

  /* ── Paragraph 3: The instruction ───────────────────────── */

  // Equipment context
  const gpsWatch = d.gpsWatch ? String(d.gpsWatch) : "";
  let p3 = "";
  if (gpsWatch === "Neither") {
    p3 = `Your sessions are prescribed by effort rather than pace — this is intentional and equally effective. RPE (Rate of Perceived Exertion) is your primary guide throughout this plan. Trust the effort descriptions — they're just as valid as any number on a screen. `;
  } else if (gpsWatch === "HRM only") {
    p3 = `Your heart rate monitor is your primary training tool — pace will come as fitness builds. Trust the zones. `;
  }

  p3 += `On hard days, your effort level matters more than the numbers — chasing pace when your body isn't ready is how small niggles become big setbacks. If something flares up, substitute or rest. Consistency across ${totalWeeks} weeks will always beat one heroic workout.`;

  if (raceDate) {
    p3 += ` ${esc(raceName)} on ${esc(raceDate)} is the finish line. Trust the structure and get there.`;
  } else {
    p3 += ` ${esc(raceName)} is the finish line. Trust the structure and get there.`;
  }

  const paras = [p1, p2, p3].filter(p => p !== "");

  // Stats row — key numbers at a glance
  const stats: string[] = [];
  stats.push(renderStatCard(String(totalWeeks), "Weeks"));
  stats.push(renderStatCard(String(daysPerWeek), "Days/Week"));
  if (targetTime) stats.push(renderStatCard(targetTime, "Target"));
  if (comparisonSeconds && targetSeconds && comparisonSeconds > targetSeconds) {
    const gapPct = ((comparisonSeconds - targetSeconds) / comparisonSeconds * 100).toFixed(1);
    stats.push(renderStatCard(`${gapPct}%`, "Improvement"));
  }
  const peakHours = (skeleton.peakVolumeMinutes / 60).toFixed(1);
  stats.push(renderStatCard(`${peakHours}h`, "Peak Volume"));

  return `<section class="plan-overview">
  <div class="overview-content">
    <h2 class="overview-title"><span class="material-symbols-outlined">description</span> Your Plan Overview</h2>
    ${paras.map(p => `<p>${p}</p>`).join("\n    ")}
    <div class="overview-stats">
      ${stats.join("\n      ")}
    </div>
  </div>
</section>`;
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

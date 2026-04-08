/* ─── Post-generation plan validation ─────────────────────────────
   Parses the stitched HTML plan and validates against training rules.
   Returns an array of violations with severity levels.

   Updated for code-driven skeleton architecture:
   - Structural rules (phases, day count, week titles) are now
     guaranteed by code, so they're downgraded to sanity checks.
   - AI content rules (swim distances, coaching notes) remain critical.
   ────────────────────────────────────────────────────────────────── */

export type Severity = "critical" | "warning";

export interface ValidationResult {
  rule: string;
  severity: Severity;
  message: string;
  details?: string[];
}

export interface PlanMetadata {
  totalWeeks: number;
  eventType: string;
  athleteAge?: number;
  trainingDaysPerWeek?: number;
}

/* ─── Data structures ─────────────────────────────────────────── */

interface DayCard {
  title: string;
  badges: string[];
  structureText: string;
  coachingNoteText: string;
}

interface WeekData {
  weekNumber: number;
  title: string;
  phase: string;
  dayCards: DayCard[];
}

/* ─── HTML extraction helpers ─────────────────────────────────── */

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractWeeks(html: string): WeekData[] {
  const weeks: WeekData[] = [];

  const weekBlocks = html.split(/(?=class="weekly-accordion")/);

  for (const block of weekBlocks) {
    if (!block.includes('class="weekly-accordion"')) continue;

    const summaryMatch = block.match(/<summary[\s\S]*?<\/summary>/i);
    const titleText = summaryMatch ? stripTags(summaryMatch[0]) : "";

    const weekNumMatch = titleText.match(/Week\s+(\d+)/i);
    const weekNumber = weekNumMatch ? parseInt(weekNumMatch[1], 10) : 0;

    const phaseMatch = titleText.match(/(?:—|–|-)\s*(BASE|BUILD|PEAK|TAPER)/i);
    const phase = phaseMatch ? phaseMatch[1].toUpperCase() : "";

    const dayCards = extractDayCards(block);

    weeks.push({ weekNumber, title: titleText, phase, dayCards });
  }

  return weeks.sort((a, b) => a.weekNumber - b.weekNumber);
}

function extractDayCards(weekHtml: string): DayCard[] {
  const cards: DayCard[] = [];
  const cardBlocks = weekHtml.split(/(?=class="day-card")/);

  for (const block of cardBlocks) {
    if (!block.includes('class="day-card"')) continue;

    const titleMatch = block.match(/class="day-title"[^>]*>([\s\S]*?)<\/h4>/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : "";

    const badges: string[] = [];
    const badgeMatches = block.matchAll(/badge-(swim|bike|run|brick|rest|strength|accent)/gi);
    for (const m of badgeMatches) badges.push(m[1].toLowerCase());

    const structMatch = block.match(/class="session-structure"[\s\S]*?(?=class="coaching-note"|class="day-card"|$)/i);
    const structureText = structMatch ? stripTags(structMatch[0]) : "";

    const noteMatch = block.match(/class="coaching-note"[\s\S]*?(?=class="day-card"|class="weekly-accordion"|<\/div>\s*<\/div>\s*<\/details>|$)/i);
    const coachingNoteText = noteMatch ? stripTags(noteMatch[0]) : "";

    cards.push({ title, badges, structureText, coachingNoteText });
  }

  return cards;
}

/* ─── Main validate function ──────────────────────────────────── */

export function validatePlan(html: string, meta: PlanMetadata): ValidationResult[] {
  const results: ValidationResult[] = [];
  const weeks = extractWeeks(html);
  const isLongCourse = /70\.3|ironman|half iron|full iron/i.test(meta.eventType);
  const isTriathlon = isLongCourse || /triathlon|olympic tri|sprint tri/i.test(meta.eventType);

  // Critical — AI content checks (still needed)
  results.push(...validateSwimDistances(weeks));
  results.push(...validateNoNonFreestyle(weeks));

  // Sanity checks — code guarantees these, but verify (downgraded to warning)
  results.push(...validateAllWeeksPresent(html, meta.totalWeeks));
  results.push(...validateDayCardsPerWeek(weeks, meta.trainingDaysPerWeek));
  results.push(...validatePhaseBannerCount(html));

  // Warning — AI content quality
  results.push(...validateCoachingNotes(weeks));
  results.push(...validateLongRunEveryWeek(weeks));
  if (isTriathlon) {
    results.push(...validateLongRideEveryWeek(weeks));
    results.push(...validateBrickSessions(weeks));
  }
  if (isLongCourse) {
    results.push(...validateSessionFrequency(weeks));
  }
  results.push(...validateRecoveryWeeks(weeks));
  results.push(...validateDisclaimer(html));

  // Masters
  if (meta.athleteAge && meta.athleteAge >= 40) {
    results.push(...validateMastersRestDays(weeks, meta.trainingDaysPerWeek));
  }

  return results;
}

/* ─── CRITICAL rules (AI content) ────────────────────────────── */

function validateSwimDistances(weeks: WeekData[]): ValidationResult[] {
  const badDistances: string[] = [];

  for (const week of weeks) {
    for (const day of week.dayCards) {
      if (!day.badges.includes("swim")) continue;

      const distanceMatches = day.structureText.matchAll(/(?<![:/\d])(\d{2,4})\s*m\b/gi);
      for (const m of distanceMatches) {
        const dist = parseInt(m[1], 10);
        if (dist >= 25 && dist % 50 !== 0) {
          badDistances.push(`Week ${week.weekNumber}, "${day.title}": ${dist}m`);
        }
      }
    }
  }

  if (badDistances.length === 0) return [];
  return [{
    rule: "swim-distances-50m",
    severity: "critical",
    message: `${badDistances.length} swim distance(s) not multiples of 50m`,
    details: badDistances,
  }];
}

function validateNoNonFreestyle(weeks: WeekData[]): ValidationResult[] {
  const violations: string[] = [];
  const banned = /backstroke|breaststroke|butterfly/i;

  for (const week of weeks) {
    for (const day of week.dayCards) {
      if (!day.badges.includes("swim")) continue;

      const fullText = day.title + " " + day.structureText + " " + day.coachingNoteText;
      const match = fullText.match(banned);
      if (match) {
        violations.push(`Week ${week.weekNumber}, "${day.title}": "${match[0]}"`);
      }
    }
  }

  if (violations.length === 0) return [];
  return [{
    rule: "freestyle-only",
    severity: "critical",
    message: `${violations.length} swim session(s) include non-freestyle strokes`,
    details: violations,
  }];
}

/* ─── SANITY CHECKS (code-guaranteed, but verify) ────────────── */

function validateAllWeeksPresent(html: string, totalWeeks: number): ValidationResult[] {
  const missing: number[] = [];
  for (let i = 1; i <= totalWeeks; i++) {
    if (!new RegExp(`Week\\s+${i}\\b`).test(html)) missing.push(i);
  }
  if (missing.length === 0) return [];
  return [{
    rule: "all-weeks-present",
    severity: "warning",
    message: `Missing weeks: ${missing.join(", ")}`,
    details: missing.map(w => `Week ${w} not found`),
  }];
}

function validateDayCardsPerWeek(weeks: WeekData[], trainingDaysPerWeek?: number): ValidationResult[] {
  const expected = trainingDaysPerWeek || 4;
  const failing = weeks.filter(w => w.dayCards.length !== expected);
  if (failing.length === 0) return [];
  return [{
    rule: "day-cards-per-week",
    severity: "warning",
    message: `${failing.length} week(s) don't have ${expected} day cards`,
    details: failing.map(w => `Week ${w.weekNumber}: ${w.dayCards.length} days (expected ${expected})`),
  }];
}

function validatePhaseBannerCount(html: string): ValidationResult[] {
  const count = (html.match(/class="phase-banner"/g) || []).length;
  if (count === 4) return [];
  return [{
    rule: "phase-banner-count",
    severity: "warning",
    message: `Found ${count} phase banners instead of 4`,
  }];
}

/* ─── WARNING rules (AI content quality) ─────────────────────── */

function validateCoachingNotes(weeks: WeekData[]): ValidationResult[] {
  const short: string[] = [];

  for (const week of weeks) {
    for (const day of week.dayCards) {
      if (!day.coachingNoteText || day.badges.includes("rest")) continue;

      const text = day.coachingNoteText.replace(/Coach'?s?\s*Note:?\s*/i, "");
      const sentences = text.split(/[.!?]+\s/).filter(s => s.trim().length > 10);

      if (sentences.length < 3) {
        short.push(`Week ${week.weekNumber}, "${day.title}": ${sentences.length} sentence(s)`);
      }
    }
  }

  if (short.length === 0) return [];
  return [{
    rule: "coaching-notes-length",
    severity: "warning",
    message: `${short.length} day(s) have coaching notes shorter than 3 sentences`,
    details: short.slice(0, 10),
  }];
}

function validateLongRunEveryWeek(weeks: WeekData[]): ValidationResult[] {
  const failing: number[] = [];

  for (const week of weeks) {
    if (week.weekNumber === weeks[weeks.length - 1]?.weekNumber && /taper/i.test(week.phase)) continue;

    const hasLongRun = week.dayCards.some(d =>
      (d.badges.includes("run") || d.badges.includes("brick")) &&
      /long/i.test(d.title)
    );

    if (!hasLongRun) failing.push(week.weekNumber);
  }

  if (failing.length === 0) return [];
  return [{
    rule: "long-run-every-week",
    severity: "warning",
    message: `${failing.length} week(s) missing a long run`,
    details: failing.map(w => `Week ${w}`),
  }];
}

function validateLongRideEveryWeek(weeks: WeekData[]): ValidationResult[] {
  const failing: number[] = [];

  for (const week of weeks) {
    if (week.weekNumber === weeks[weeks.length - 1]?.weekNumber && /taper/i.test(week.phase)) continue;

    const hasLongRide = week.dayCards.some(d =>
      (d.badges.includes("bike") || d.badges.includes("brick")) &&
      /long/i.test(d.title)
    );

    if (!hasLongRide) failing.push(week.weekNumber);
  }

  if (failing.length === 0) return [];
  return [{
    rule: "long-ride-every-week",
    severity: "warning",
    message: `${failing.length} week(s) missing a long ride`,
    details: failing.map(w => `Week ${w}`),
  }];
}

function validateSessionFrequency(weeks: WeekData[]): ValidationResult[] {
  const failing: string[] = [];

  for (const week of weeks) {
    if (/taper/i.test(week.phase) && week.weekNumber === weeks[weeks.length - 1]?.weekNumber) continue;

    let swim = 0, bike = 0, run = 0;
    for (const day of week.dayCards) {
      if (day.badges.includes("swim")) swim++;
      if (day.badges.includes("bike")) bike++;
      if (day.badges.includes("brick")) { bike++; run++; }
      if (day.badges.includes("run")) run++;
    }

    const issues: string[] = [];
    if (swim < 3) issues.push(`swim:${swim}`);
    if (bike < 3) issues.push(`bike:${bike}`);
    if (run < 3) issues.push(`run:${run}`);

    if (issues.length > 0) {
      failing.push(`Week ${week.weekNumber} — ${issues.join(", ")}`);
    }
  }

  if (failing.length === 0) return [];
  return [{
    rule: "session-frequency",
    severity: "warning",
    message: `${failing.length} week(s) below minimum 3/3/3 (swim/bike/run)`,
    details: failing,
  }];
}

function validateBrickSessions(weeks: WeekData[]): ValidationResult[] {
  const last6 = weeks.slice(-6);
  let brickCount = 0;

  for (const week of last6) {
    for (const day of week.dayCards) {
      if (day.badges.includes("brick") || /brick/i.test(day.title)) {
        brickCount++;
      }
    }
  }

  if (brickCount >= 2) return [];
  return [{
    rule: "brick-final-6-weeks",
    severity: "warning",
    message: `Only ${brickCount} brick session(s) in final 6 weeks (minimum 2)`,
  }];
}

function validateRecoveryWeeks(weeks: WeekData[]): ValidationResult[] {
  let lastRecovery = 0;
  const gaps: string[] = [];

  for (const week of weeks) {
    if (/recovery/i.test(week.title)) {
      if (lastRecovery > 0 && week.weekNumber - lastRecovery > 4) {
        gaps.push(`Weeks ${lastRecovery + 1}-${week.weekNumber - 1} (${week.weekNumber - lastRecovery - 1} weeks without recovery)`);
      }
      lastRecovery = week.weekNumber;
    }
  }

  if (lastRecovery === 0 && weeks.length > 8) {
    return [{
      rule: "recovery-week-frequency",
      severity: "warning",
      message: "No recovery weeks detected in the plan",
    }];
  }

  if (gaps.length === 0) return [];
  return [{
    rule: "recovery-week-frequency",
    severity: "warning",
    message: `${gaps.length} stretch(es) of more than 4 weeks without a recovery week`,
    details: gaps,
  }];
}

function validateDisclaimer(html: string): ValidationResult[] {
  if (/class="disclaimer"/i.test(html)) return [];
  return [{
    rule: "disclaimer-present",
    severity: "warning",
    message: "Disclaimer section not found in plan",
  }];
}

/* ─── MASTERS rules (age >= 40) ───────────────────────────────── */

function validateMastersRestDays(weeks: WeekData[], trainingDaysPerWeek?: number): ValidationResult[] {
  // With the new system, rest days = 7 - trainingDaysPerWeek
  // For masters, we need at least 2 rest days (i.e., max 5 training days)
  const daysPerWeek = trainingDaysPerWeek || 4;
  const restDays = 7 - daysPerWeek;

  if (restDays >= 2) return [];
  return [{
    rule: "masters-rest-days",
    severity: "warning",
    message: `Masters athlete has only ${restDays} rest day(s)/week (minimum 2 recommended for 40+)`,
  }];
}

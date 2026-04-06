/* ─── Post-generation plan validation ─────────────────────────────
   Parses the stitched HTML plan and validates against training rules.
   Returns an array of violations with severity levels.
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

  // Split on weekly-accordion boundaries
  const weekBlocks = html.split(/(?=class="weekly-accordion")/);

  for (const block of weekBlocks) {
    if (!block.includes('class="weekly-accordion"')) continue;

    // Extract week title from summary
    const summaryMatch = block.match(/<summary[\s\S]*?<\/summary>/i);
    const titleText = summaryMatch ? stripTags(summaryMatch[0]) : "";

    const weekNumMatch = titleText.match(/Week\s+(\d+)/i);
    const weekNumber = weekNumMatch ? parseInt(weekNumMatch[1], 10) : 0;

    // Detect phase from title (e.g. "Week 9 — BUILD")
    const phaseMatch = titleText.match(/(?:—|–|-)\s*(BASE|BUILD|PEAK|TAPER)/i);
    const phase = phaseMatch ? phaseMatch[1].toUpperCase() : "";

    // Extract day cards
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

    // Title
    const titleMatch = block.match(/class="day-title"[^>]*>([\s\S]*?)<\/h4>/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : "";

    // Badges
    const badges: string[] = [];
    const badgeMatches = block.matchAll(/badge-(swim|bike|run|brick|rest|strength)/gi);
    for (const m of badgeMatches) badges.push(m[1].toLowerCase());

    // Structure text
    const structMatch = block.match(/class="session-structure"[\s\S]*?(?=class="coaching-note"|class="day-card"|$)/i);
    const structureText = structMatch ? stripTags(structMatch[0]) : "";

    // Coaching note text
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

  // Critical
  results.push(...validateAllWeeksPresent(html, meta.totalWeeks));
  results.push(...validateDayCardsPerWeek(weeks));
  results.push(...validateExactlyFourPhases(html));
  results.push(...validateNoSubPhases(html));
  if (isLongCourse) {
    results.push(...validateSessionFrequency(weeks));
  }
  results.push(...validateLongRideEveryWeek(weeks));
  results.push(...validateLongRunEveryWeek(weeks));
  results.push(...validateSwimDistances(weeks));
  results.push(...validateNoNonFreestyle(weeks));

  // Warning
  if (isTriathlon) {
    results.push(...validateBrickSessions(weeks));
  }
  results.push(...validateNoConsecutiveHardSameDiscipline(weeks));
  results.push(...validateRecoveryWeeks(weeks));
  results.push(...validateCoachingNotes(weeks));
  results.push(...validateQualityRunSessions(weeks));
  results.push(...validateWeekTitles(html, meta.totalWeeks));
  results.push(...validateDisclaimer(html));

  // Masters
  if (meta.athleteAge && meta.athleteAge >= 40) {
    results.push(...validateMastersRestDays(weeks));
    results.push(...validateMastersStrength(weeks));
    results.push(...validateMastersVO2max(weeks));
  }

  return results;
}

/* ─── CRITICAL rules ──────────────────────────────────────────── */

function validateAllWeeksPresent(html: string, totalWeeks: number): ValidationResult[] {
  const missing: number[] = [];
  for (let i = 1; i <= totalWeeks; i++) {
    if (!new RegExp(`Week\\s+${i}\\b`).test(html)) missing.push(i);
  }
  if (missing.length === 0) return [];
  return [{
    rule: "all-weeks-present",
    severity: "critical",
    message: `Missing weeks: ${missing.join(", ")}`,
    details: missing.map(w => `Week ${w} not found`),
  }];
}

function validateDayCardsPerWeek(weeks: WeekData[]): ValidationResult[] {
  const failing = weeks.filter(w => w.dayCards.length !== 7);
  if (failing.length === 0) return [];
  return [{
    rule: "7-days-per-week",
    severity: "critical",
    message: `${failing.length} week(s) don't have 7 days`,
    details: failing.map(w => `Week ${w.weekNumber}: ${w.dayCards.length} days`),
  }];
}

function validateExactlyFourPhases(html: string): ValidationResult[] {
  const count = (html.match(/class="phase-banner"/g) || []).length;
  if (count === 4) return [];
  return [{
    rule: "exactly-4-phases",
    severity: "critical",
    message: `Found ${count} phases instead of 4 (BASE, BUILD, PEAK, TAPER)`,
  }];
}

function validateNoSubPhases(html: string): ValidationResult[] {
  const titles: string[] = [];
  const bannerMatches = html.matchAll(/class="phase-title"[^>]*>([\s\S]*?)<\/h2>/gi);
  for (const m of bannerMatches) titles.push(stripTags(m[1]));

  // Also check h2 inside phase-banner if phase-title class isn't used
  if (titles.length === 0) {
    const h2Matches = html.matchAll(/class="phase-banner"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/gi);
    for (const m of h2Matches) titles.push(stripTags(m[1]));
  }

  const validPhases = /^(BASE|BUILD|PEAK|TAPER)$/i;
  const invalid = titles.filter(t => !validPhases.test(t.trim()));
  if (invalid.length === 0) return [];
  return [{
    rule: "no-sub-phases",
    severity: "critical",
    message: `Invalid phase names found: ${invalid.join(", ")}`,
    details: invalid.map(t => `"${t}" should be BASE, BUILD, PEAK, or TAPER only`),
  }];
}

function validateSessionFrequency(weeks: WeekData[]): ValidationResult[] {
  const failing: string[] = [];

  for (const week of weeks) {
    // Skip race week (last week) and recovery weeks
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
    severity: "critical",
    message: `${failing.length} week(s) below minimum 3/3/3 (swim/bike/run)`,
    details: failing,
  }];
}

function validateLongRideEveryWeek(weeks: WeekData[]): ValidationResult[] {
  const failing: number[] = [];

  for (const week of weeks) {
    // Skip race week
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
    severity: "critical",
    message: `${failing.length} week(s) missing a long ride`,
    details: failing.map(w => `Week ${w}`),
  }];
}

function validateLongRunEveryWeek(weeks: WeekData[]): ValidationResult[] {
  const failing: number[] = [];

  for (const week of weeks) {
    // Skip race week
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
    severity: "critical",
    message: `${failing.length} week(s) missing a long run`,
    details: failing.map(w => `Week ${w}`),
  }];
}

function validateSwimDistances(weeks: WeekData[]): ValidationResult[] {
  const badDistances: string[] = [];

  for (const week of weeks) {
    for (const day of week.dayCards) {
      if (!day.badges.includes("swim")) continue;

      // Find all distances in metres — exclude pace references like /100m
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

/* ─── WARNING rules ───────────────────────────────────────────── */

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

const QUALITY_KEYWORDS = /tempo|interval|threshold|vo2max|vo2|fartlek|race.?pace|time.?trial|speed/i;

function validateNoConsecutiveHardSameDiscipline(weeks: WeekData[]): ValidationResult[] {
  const violations: string[] = [];

  for (const week of weeks) {
    for (let i = 1; i < week.dayCards.length; i++) {
      const prev = week.dayCards[i - 1];
      const curr = week.dayCards[i];

      const prevText = prev.title + " " + prev.structureText;
      const currText = curr.title + " " + curr.structureText;

      if (!QUALITY_KEYWORDS.test(prevText) || !QUALITY_KEYWORDS.test(currText)) continue;

      // Check if same discipline
      for (const discipline of ["swim", "bike", "run"]) {
        if (prev.badges.includes(discipline) && curr.badges.includes(discipline)) {
          violations.push(`Week ${week.weekNumber}: consecutive hard ${discipline} (${prev.title} → ${curr.title})`);
        }
      }
    }
  }

  if (violations.length === 0) return [];
  return [{
    rule: "no-consecutive-hard-same-discipline",
    severity: "warning",
    message: `${violations.length} case(s) of consecutive hard sessions in same discipline`,
    details: violations,
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

  // Check tail
  if (lastRecovery > 0 && weeks.length > 0) {
    const lastWeek = weeks[weeks.length - 1].weekNumber;
    // Don't flag if remaining weeks are taper
    const remainingNonTaper = weeks.filter(w => w.weekNumber > lastRecovery && !/taper/i.test(w.phase));
    if (remainingNonTaper.length > 4) {
      gaps.push(`Weeks ${lastRecovery + 1}-${lastWeek} (${lastWeek - lastRecovery} weeks without recovery)`);
    }
  }

  // If no recovery weeks found at all in a plan > 8 weeks
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

function validateCoachingNotes(weeks: WeekData[]): ValidationResult[] {
  const short: string[] = [];

  for (const week of weeks) {
    for (const day of week.dayCards) {
      if (!day.coachingNoteText || day.badges.includes("rest")) continue;

      // Count sentences (period followed by space/end, or exclamation/question mark)
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
    details: short.slice(0, 10), // Cap at 10 to avoid huge emails
  }];
}

function validateQualityRunSessions(weeks: WeekData[]): ValidationResult[] {
  const violations: string[] = [];

  for (const week of weeks) {
    let qualityRuns = 0;
    for (const day of week.dayCards) {
      if (!day.badges.includes("run")) continue;
      const text = day.title + " " + day.structureText;
      if (QUALITY_KEYWORDS.test(text)) qualityRuns++;
    }

    if (qualityRuns > 2) {
      violations.push(`Week ${week.weekNumber}: ${qualityRuns} quality run sessions`);
    }
  }

  if (violations.length === 0) return [];
  return [{
    rule: "max-quality-runs",
    severity: "warning",
    message: `${violations.length} week(s) have more than 2 quality run sessions`,
    details: violations,
  }];
}

function validateWeekTitles(html: string, totalWeeks: number): ValidationResult[] {
  const bad: string[] = [];
  const summaryMatches = html.matchAll(/<summary[\s\S]*?<\/summary>/gi);

  for (const m of summaryMatches) {
    const text = stripTags(m[0]);
    if (!text.match(/Week\s+\d+/i)) continue; // Not a week summary

    const valid = /Week\s+\d+\s+[—–-]\s*(BASE|BUILD|PEAK|TAPER)(\s*\(Recovery\))?/i;
    if (!valid.test(text)) {
      bad.push(text.substring(0, 60));
    }
  }

  if (bad.length === 0) return [];
  return [{
    rule: "week-title-format",
    severity: "warning",
    message: `${bad.length} week title(s) don't match "Week N — PHASE" format`,
    details: bad,
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

function validateMastersRestDays(weeks: WeekData[]): ValidationResult[] {
  const failing: string[] = [];

  for (const week of weeks) {
    const restDays = week.dayCards.filter(d =>
      d.badges.includes("rest") || /rest\s*day|complete\s*rest|off/i.test(d.title)
    ).length;

    if (restDays < 2) {
      failing.push(`Week ${week.weekNumber}: ${restDays} rest day(s)`);
    }
  }

  if (failing.length === 0) return [];
  return [{
    rule: "masters-rest-days",
    severity: "warning",
    message: `${failing.length} week(s) have fewer than 2 rest days (masters 40+ requirement)`,
    details: failing,
  }];
}

function validateMastersStrength(weeks: WeekData[]): ValidationResult[] {
  const failing: string[] = [];

  for (const week of weeks) {
    const strengthCount = week.dayCards.filter(d =>
      /strength/i.test(d.title) || d.badges.includes("strength")
    ).length;

    const minRequired = /base/i.test(week.phase) ? 2 : 1;

    if (strengthCount < minRequired) {
      failing.push(`Week ${week.weekNumber} (${week.phase}): ${strengthCount} strength session(s), need ${minRequired}+`);
    }
  }

  if (failing.length === 0) return [];
  return [{
    rule: "masters-strength",
    severity: "warning",
    message: `${failing.length} week(s) below masters strength minimum`,
    details: failing,
  }];
}

function validateMastersVO2max(weeks: WeekData[]): ValidationResult[] {
  const failing: number[] = [];

  for (const week of weeks) {
    // Skip taper weeks
    if (/taper/i.test(week.phase)) continue;

    const hasVO2 = week.dayCards.some(d => {
      const text = d.title + " " + d.structureText + " " + d.coachingNoteText;
      return /vo2\s*max|vo2/i.test(text);
    });

    if (!hasVO2) failing.push(week.weekNumber);
  }

  if (failing.length === 0) return [];
  return [{
    rule: "masters-vo2max",
    severity: "warning",
    message: `${failing.length} week(s) missing VO2max session (masters 40+ requirement)`,
    details: failing.map(w => `Week ${w}`),
  }];
}

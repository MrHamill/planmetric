/* ─── Deterministic Plan Skeleton Calculator ─────────────────────
   Calculates the complete structural skeleton of a training plan:
   phases, weeks, training days, session types, volume targets.
   The AI never touches any of this — it only fills in session content.
   ────────────────────────────────────────────────────────────────── */

/* ─── Types ──────────────────────────────────────────────────── */

export type EventType =
  | "Marathon" | "Half Marathon" | "10K" | "5K"
  | "Olympic Triathlon" | "70.3 Ironman" | "Full Ironman"
  | "Sprint Triathlon" | "Cycling Event";

export type Phase = "BASE" | "BUILD" | "PEAK" | "TAPER";

export type SessionType =
  | "easy-run" | "long-run" | "tempo-run" | "interval-run" | "recovery-run"
  | "swim-technique" | "swim-endurance" | "swim-threshold"
  | "bike-endurance" | "bike-quality" | "long-ride"
  | "brick"
  | "strength"
  | "rest";

export type Discipline = "swim" | "bike" | "run" | "brick" | "strength" | "rest";

export interface SessionSlot {
  day: string;                // "Mon" | "Tue" | ... | "Sun"
  sessionType: SessionType;
  discipline: Discipline;
  durationMinutes: number;
  zone: string;               // "Z1-Z2", "Z3-Z4", etc.
  isKeySession: boolean;      // long run, quality, brick
  timeSlot?: string;          // "6:00–6:45am"
  includeStrength?: boolean;  // add 15-20 min strength supplement after the run
}

export interface WeekSkeleton {
  weekNumber: number;
  phase: Phase;
  isRecovery: boolean;
  isUnavailable?: boolean;    // athlete flagged this week as unavailable
  volumePercent: number;      // percent of peak volume (0-100)
  totalMinutes: number;       // target total training minutes
  dateRange: string;          // "7–13 Apr 2026"
  sessions: SessionSlot[];
}

export interface PhaseRange {
  phase: Phase;
  startWeek: number;
  endWeek: number;
}

export interface PlanSkeleton {
  totalWeeks: number;
  eventType: EventType;
  weeks: WeekSkeleton[];
  phases: PhaseRange[];
  peakVolumeMinutes: number;
  trainingDays: string[];     // which days of week are training days
  restDays: string[];         // which days are rest
  longDay: string;            // day assigned for long sessions
}

export interface AthleteInputs {
  trainingFor: EventType;
  availableDays: string[];
  trainingDaysPerWeek: number;
  preferredLongDay: string;
  preferredRestDay: string;
  maxWeekdayMinutes: number;
  maxWeekendMinutes: number;
  raceDate: Date | null;
  planWeeks: number | null;
  age: number | null;
  weakestDiscipline?: string;
  preferredTimes: string[];
  doubleDays?: string;         // "Yes" | "No" | "Sometimes"
  // Current volume for scaling
  weeklyRunDistance?: number;
  easyRunPace?: string;        // "X:XX" min/km
  weeklyBikeVolume?: number;   // km per week
  avgBikeSpeed?: number;       // km/h
  weeklySwimVolume?: string;   // e.g. "5-7km" or "3km"
  longestRide?: number;        // km
  longestRun?: number;         // km
  longestSwim?: number;        // metres
  currentVolumeMinutes?: number; // calculated: athlete's current weekly training volume in minutes
  // Unavailable dates
  unavailableDates?: { start: string; end: string }[];
  // Load day constraints
  strengthDays?: string[];       // e.g. ["Monday", "Wednesday"]
  otherSports?: {
    name: string;
    days: string[];              // e.g. ["Tue", "Thu"]
    duration: string;
    intensity: string;           // "Light" | "Moderate" | "High"
  }[];
  // Double day combos
  doubleDayCombos?: string[];    // e.g. ["Swim + Run", "Bike + Run"]
}

/* ─── Constants ──────────────────────────────────────────────── */

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const FULL_TO_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu",
  Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

const WEEKEND = new Set(["Sat", "Sun"]);

const TRIATHLON_EVENTS = new Set([
  "Olympic Triathlon", "70.3 Ironman", "Full Ironman", "Sprint Triathlon",
]);

const LONG_COURSE = new Set(["70.3 Ironman", "Full Ironman"]);

/** Phase proportions by event type [BASE, BUILD, PEAK, TAPER] */
const PHASE_PROPORTIONS: Record<string, [number, number, number, number]> = {
  "Marathon":           [0.30, 0.35, 0.20, 0.15],
  "Half Marathon":      [0.30, 0.30, 0.25, 0.15],
  "10K":                [0.30, 0.35, 0.25, 0.10],
  "5K":                 [0.30, 0.35, 0.25, 0.10],
  "Olympic Triathlon":  [0.33, 0.33, 0.25, 0.09],
  "70.3 Ironman":       [0.40, 0.30, 0.20, 0.10],
  "Full Ironman":       [0.33, 0.33, 0.25, 0.09],
  "Sprint Triathlon":   [0.30, 0.35, 0.25, 0.10],
  "Cycling Event":      [0.30, 0.35, 0.20, 0.15],
};

/** Minimum taper weeks by event type */
const MIN_TAPER: Record<string, number> = {
  "Marathon": 2, "Half Marathon": 1, "10K": 1, "5K": 1,
  "Olympic Triathlon": 1, "70.3 Ironman": 2, "Full Ironman": 2,
  "Sprint Triathlon": 1, "Cycling Event": 1,
};

/* ─── Main entry point ───────────────────────────────────────── */

export function buildSkeleton(inputs: AthleteInputs): PlanSkeleton {
  const totalWeeks = calculateTotalWeeks(inputs.raceDate, inputs.planWeeks);
  const phases = calculatePhaseRanges(totalWeeks, inputs.trainingFor);
  const { trainingDays, restDays, longDay } = assignTrainingDays(inputs);
  const recoveryWeeks = assignRecoveryWeeks(totalWeeks, phases, inputs.age);
  const peakVolumeMinutes = estimatePeakVolume(inputs);
  const unavailableWeeks = inputs.unavailableDates
    ? getUnavailableWeeks(inputs.unavailableDates, inputs.raceDate, totalWeeks)
    : new Set<number>();
  const loadMap = buildLoadMap(inputs);

  const weeks: WeekSkeleton[] = [];

  for (let w = 1; w <= totalWeeks; w++) {
    const phase = getPhaseForWeek(w, phases);
    const isRecovery = recoveryWeeks.has(w);
    const isUnavailable = unavailableWeeks.has(w);
    const dateRange = calculateDateRange(w, inputs.raceDate, totalWeeks);

    // Unavailable weeks get minimal maintenance sessions
    if (isUnavailable) {
      const maintenanceMinutes = Math.round(peakVolumeMinutes * 0.3);
      weeks.push({
        weekNumber: w,
        phase,
        isRecovery: false,
        isUnavailable: true,
        volumePercent: 30,
        totalMinutes: maintenanceMinutes,
        dateRange,
        sessions: [
          { day: trainingDays[0] || "Mon", sessionType: "easy-run", discipline: "run", durationMinutes: 30, zone: "Z1-Z2", isKeySession: false },
          { day: trainingDays[Math.min(2, trainingDays.length - 1)] || "Wed", sessionType: "easy-run", discipline: "run", durationMinutes: 30, zone: "Z1-Z2", isKeySession: false },
        ],
      });
      continue;
    }

    const volumePercent = calculateWeekVolume(w, totalWeeks, phase, isRecovery, phases, inputs.currentVolumeMinutes, peakVolumeMinutes);
    const totalMinutes = Math.round(peakVolumeMinutes * volumePercent / 100);

    let sessions = assignSessionsForWeek({
      weekNumber: w,
      phase,
      isRecovery,
      totalMinutes,
      trainingDays,
      longDay,
      eventType: inputs.trainingFor,
      maxWeekdayMinutes: inputs.maxWeekdayMinutes,
      maxWeekendMinutes: inputs.maxWeekendMinutes,
      weakestDiscipline: inputs.weakestDiscipline,
      isLastWeek: w === totalWeeks,
      preferredTimes: inputs.preferredTimes,
    });

    // Apply load-day constraints (strength days + other sports)
    sessions = applyLoadDayConstraints(sessions, loadMap);

    // Add double-day sessions for triathlon when combos are specified
    if (inputs.doubleDayCombos && inputs.doubleDays !== "No"
        && !isRecovery && w !== totalWeeks
        && TRIATHLON_EVENTS.has(inputs.trainingFor)) {
      sessions = applyDoubleDaySessions(sessions, inputs, phase);
    }

    weeks.push({
      weekNumber: w,
      phase,
      isRecovery,
      volumePercent: Math.round(volumePercent),
      totalMinutes,
      dateRange,
      sessions,
    });
  }

  return {
    totalWeeks,
    eventType: inputs.trainingFor,
    weeks,
    phases,
    peakVolumeMinutes,
    trainingDays,
    restDays,
    longDay,
  };
}

/* ─── Parse athlete inputs from form data ────────────────────── */

export function parseAthleteInputs(d: Record<string, unknown>, sub: Record<string, unknown>): AthleteInputs {
  const availableDays = Array.isArray(d.availableDays)
    ? (d.availableDays as string[])
    : ALL_DAYS.slice();

  const parsed: AthleteInputs = {
    trainingFor: (d.trainingFor || sub.training_for || "Marathon") as EventType,
    availableDays,
    trainingDaysPerWeek: parseInt(String(d.trainingDaysPerWeek || "4"), 10),
    preferredLongDay: String(d.preferredLongDay || "Flexible"),
    preferredRestDay: String(d.preferredRestDay || "Flexible"),
    maxWeekdayMinutes: parseSessionDuration(String(d.maxWeekdaySession || "60 min")),
    maxWeekendMinutes: parseSessionDuration(String(d.maxWeekendSession || "2 hours")),
    raceDate: d.raceDate ? new Date(d.raceDate as string) : null,
    planWeeks: d.planWeeks ? parseInt(String(d.planWeeks), 10) : null,
    age: d.age ? parseInt(String(d.age), 10) : null,
    weakestDiscipline: d.weakestDiscipline ? String(d.weakestDiscipline) : undefined,
    preferredTimes: Array.isArray(d.preferredTimes) ? (d.preferredTimes as string[]) : [],
    doubleDays: d.doubleDays ? String(d.doubleDays) : undefined,
    weeklyRunDistance: d.weeklyRunDistance ? parseFloat(String(d.weeklyRunDistance)) : undefined,
    easyRunPace: d.easyRunPace ? String(d.easyRunPace) : undefined,
    weeklyBikeVolume: d.weeklyBikeVolume ? parseFloat(String(d.weeklyBikeVolume)) : undefined,
    avgBikeSpeed: d.avgBikeSpeed ? parseFloat(String(d.avgBikeSpeed)) : undefined,
    weeklySwimVolume: d.weeklySwimVolume ? String(d.weeklySwimVolume) : undefined,
    longestRide: d.longestRide ? parseFloat(String(d.longestRide)) : undefined,
    longestRun: d.longestRun ? parseFloat(String(d.longestRun)) : undefined,
    longestSwim: d.longestSwim ? parseFloat(String(d.longestSwim)) : undefined,
    // Unavailable dates
    unavailableDates: Array.isArray(d.unavailableDates)
      ? (d.unavailableDates as { start: string; end: string }[]).filter(r => r.start && r.end)
      : undefined,
    // Strength days
    strengthDays: Array.isArray(d.strengthDays) ? (d.strengthDays as string[]) : undefined,
    // Other sports
    otherSports: d.otherSports === "Yes" && d.otherSport1Name ? parseOtherSports(d) : undefined,
    // Double day combos
    doubleDayCombos: Array.isArray(d.doubleDayCombos) && (d.doubleDayCombos as string[]).length > 0
      ? (d.doubleDayCombos as string[]) : undefined,
  };

  // Calculate current weekly volume in minutes from available data
  parsed.currentVolumeMinutes = estimateCurrentVolume(parsed);

  return parsed;
}

function estimateCurrentVolume(inputs: AthleteInputs): number | undefined {
  let totalMinutes = 0;
  let hasData = false;

  // Running: distance / pace
  if (inputs.weeklyRunDistance && inputs.easyRunPace) {
    const parts = inputs.easyRunPace.split(":");
    const paceMinPerKm = parseInt(parts[0], 10) + (parseInt(parts[1] || "0", 10) / 60);
    totalMinutes += inputs.weeklyRunDistance * paceMinPerKm;
    hasData = true;
  }

  // Cycling: distance / speed
  if (inputs.weeklyBikeVolume && inputs.avgBikeSpeed) {
    totalMinutes += (inputs.weeklyBikeVolume / inputs.avgBikeSpeed) * 60;
    hasData = true;
  }

  // Swimming: parse volume string (e.g. "5-7km" → take midpoint)
  if (inputs.weeklySwimVolume) {
    const match = inputs.weeklySwimVolume.match(/(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?\s*km/i);
    if (match) {
      const low = parseFloat(match[1]);
      const high = match[2] ? parseFloat(match[2]) : low;
      const avgKm = (low + high) / 2;
      // ~2 min per 100m is a reasonable average swim pace
      totalMinutes += avgKm * 10 * 2;
      hasData = true;
    }
  }

  return hasData ? Math.round(totalMinutes) : undefined;
}

function parseSessionDuration(str: string): number {
  if (str === "No limit") return 240;
  const hourMatch = str.match(/^(\d+)\s*hours?$/i);
  if (hourMatch) return parseInt(hourMatch[1], 10) * 60;
  const minMatch = str.match(/^(\d+)\s*min$/i);
  if (minMatch) return parseInt(minMatch[1], 10);
  return 60; // default
}

/* ─── Other Sports Parser ───────────────────────────────────── */

function parseOtherSports(d: Record<string, unknown>): AthleteInputs["otherSports"] {
  const sports: NonNullable<AthleteInputs["otherSports"]> = [];
  if (d.otherSport1Name) {
    sports.push({
      name: String(d.otherSport1Name),
      days: Array.isArray(d.otherSport1Days) ? (d.otherSport1Days as string[]).map(normDay) : [],
      duration: String(d.otherSport1Duration || ""),
      intensity: String(d.otherSport1Intensity || "Moderate"),
    });
  }
  if (d.otherSport2Name) {
    sports.push({
      name: String(d.otherSport2Name),
      days: Array.isArray(d.otherSport2Days) ? (d.otherSport2Days as string[]).map(normDay) : [],
      duration: String(d.otherSport2Duration || ""),
      intensity: String(d.otherSport2Intensity || "Moderate"),
    });
  }
  return sports.length > 0 ? sports : undefined;
}

/** Normalise "Monday" → "Mon" etc. */
function normDay(d: string): string {
  return FULL_TO_SHORT[d] || d;
}

/* ─── Unavailable Weeks from Date Ranges ───────────────────── */

function getUnavailableWeeks(
  dates: { start: string; end: string }[],
  raceDate: Date | null,
  totalWeeks: number,
): Set<number> {
  const unavailable = new Set<number>();
  if (!dates.length) return unavailable;

  // Calculate week 1 start (same logic as calculateDateRange)
  let week1Start: Date;
  if (raceDate) {
    week1Start = new Date(raceDate);
    week1Start.setDate(week1Start.getDate() - (totalWeeks * 7) + 1);
    const dow = week1Start.getDay();
    if (dow !== 1) {
      week1Start.setDate(week1Start.getDate() - ((dow + 6) % 7));
    }
  } else {
    week1Start = new Date();
    const dayOfWeek = week1Start.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
    week1Start.setDate(week1Start.getDate() + daysUntilMonday);
  }
  week1Start.setHours(0, 0, 0, 0);

  for (const range of dates) {
    const rangeStart = new Date(range.start);
    const rangeEnd = new Date(range.end);
    if (isNaN(rangeStart.getTime()) || isNaN(rangeEnd.getTime())) continue;
    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd.setHours(23, 59, 59, 999);

    // Check each week for overlap
    for (let w = 1; w <= totalWeeks; w++) {
      const weekStart = new Date(week1Start);
      weekStart.setDate(weekStart.getDate() + (w - 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      // Overlap if range and week intersect
      if (rangeStart <= weekEnd && rangeEnd >= weekStart) {
        unavailable.add(w);
      }
    }
  }

  return unavailable;
}

/* ─── Unified Load Day Map ─────────────────────────────────── */

type LoadLevel = "high" | "moderate" | "low";

function buildLoadMap(inputs: AthleteInputs): Map<string, LoadLevel> {
  const map = new Map<string, LoadLevel>();

  const setIfHigher = (day: string, level: LoadLevel) => {
    const current = map.get(day);
    const rank = { high: 3, moderate: 2, low: 1 };
    if (!current || rank[level] > rank[current]) {
      map.set(day, level);
    }
  };

  // Strength days → moderate load
  if (inputs.strengthDays) {
    for (const day of inputs.strengthDays) {
      setIfHigher(normDay(day), "moderate");
    }
  }

  // Other sports → load level from intensity
  if (inputs.otherSports) {
    for (const sport of inputs.otherSports) {
      const level: LoadLevel = sport.intensity === "High" ? "high"
        : sport.intensity === "Moderate" ? "moderate" : "low";
      for (const day of sport.days) {
        setIfHigher(day, level);
      }
    }
  }

  return map;
}

/** Post-assignment: swap key sessions away from days before high/moderate load days */
function applyLoadDayConstraints(sessions: SessionSlot[], loadMap: Map<string, LoadLevel>): SessionSlot[] {
  if (loadMap.size === 0) return sessions;

  const dayOrder = ALL_DAYS as readonly string[];

  const nextDay = (day: string): string => {
    const idx = dayOrder.indexOf(day);
    return dayOrder[(idx + 1) % 7];
  };

  // Find key sessions that precede a load day
  for (let i = 0; i < sessions.length; i++) {
    const s = sessions[i];
    if (!s.isKeySession) continue;

    const next = nextDay(s.day);
    const loadLevel = loadMap.get(next);
    if (!loadLevel || loadLevel === "low") continue;

    // Try to swap with nearest non-key session
    let bestSwap = -1;
    let bestDist = Infinity;
    for (let j = 0; j < sessions.length; j++) {
      if (j === i || sessions[j].isKeySession) continue;
      const jNext = nextDay(sessions[j].day);
      const jLoad = loadMap.get(jNext);
      if (jLoad && jLoad !== "low") continue; // don't swap into another conflict

      const dist = Math.abs(i - j);
      if (dist < bestDist) {
        bestDist = dist;
        bestSwap = j;
      }
    }

    if (bestSwap >= 0) {
      // Swap the day assignments
      const tmpDay = sessions[i].day;
      const tmpTime = sessions[i].timeSlot;
      sessions[i].day = sessions[bestSwap].day;
      sessions[i].timeSlot = sessions[bestSwap].timeSlot;
      sessions[bestSwap].day = tmpDay;
      sessions[bestSwap].timeSlot = tmpTime;
    }
    // If no swap found (all key sessions), leave as-is — AI prompt handles it with softer guidance
  }

  return sessions;
}

/* ─── Double Day Sessions (triathlon) ──────────────────────── */

/** Parse combo strings like "Swim + Run" into discipline pairs */
function parseDoubleCombos(combos: string[]): Set<string> {
  const pairs = new Set<string>();
  for (const combo of combos) {
    const parts = combo.toLowerCase().split(/\s*[+&]\s*/);
    if (parts.length === 2) {
      pairs.add(`${parts[0].trim()}|${parts[1].trim()}`);
      pairs.add(`${parts[1].trim()}|${parts[0].trim()}`); // bidirectional
    }
  }
  return pairs;
}

/** Add bonus sessions on days where the existing discipline is compatible with a double */
function applyDoubleDaySessions(
  sessions: SessionSlot[],
  inputs: AthleteInputs,
  phase: Phase,
): SessionSlot[] {
  if (!inputs.doubleDayCombos || inputs.doubleDayCombos.length === 0) return sessions;

  const combos = parseDoubleCombos(inputs.doubleDayCombos);
  if (combos.size === 0) return sessions;

  // Determine weakest discipline — it gets the bonus session
  const weak = inputs.weakestDiscipline?.toLowerCase() || "swim";
  const weakDiscipline: Discipline = weak === "swim" ? "swim" : weak === "bike" ? "bike" : "run";

  // Only add doubles in BUILD/PEAK for extra volume
  if (phase !== "BUILD" && phase !== "PEAK") return sessions;

  // Find a day where the existing session's discipline is compatible with the weak discipline
  const usedDays = new Set(sessions.map(s => s.day));
  let added = false;

  for (const session of sessions) {
    if (added) break;
    if (session.isKeySession) continue; // don't stack on key session days
    if (session.discipline === weakDiscipline) continue; // already training weak discipline

    const pairKey = `${session.discipline}|${weakDiscipline}`;
    if (!combos.has(pairKey)) continue;

    // Add a 30-40 min easy session in the weak discipline
    const bonusDuration = phase === "PEAK" ? 40 : 30;
    const sessionType: SessionType = weakDiscipline === "swim" ? "swim-technique"
      : weakDiscipline === "bike" ? "bike-endurance" : "easy-run";

    sessions.push({
      day: session.day,
      sessionType,
      discipline: weakDiscipline,
      durationMinutes: bonusDuration,
      zone: "Z1-Z2",
      isKeySession: false,
      timeSlot: session.timeSlot?.includes("am") ? "5:30–6:00pm" : "6:00–6:30am",
    });
    added = true;
  }

  return sessions;
}

/* ─── Total Weeks ────────────────────────────────────────────── */

function calculateTotalWeeks(raceDate: Date | null, planWeeks: number | null): number {
  if (raceDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weeks = Math.ceil((raceDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(4, Math.min(weeks, 52)); // clamp 4-52
  }
  return planWeeks ? Math.max(4, Math.min(planWeeks, 52)) : 12;
}

/* ─── Phase Ranges ───────────────────────────────────────────── */

function calculatePhaseRanges(totalWeeks: number, eventType: EventType): PhaseRange[] {
  const props = PHASE_PROPORTIONS[eventType] || PHASE_PROPORTIONS["Marathon"];
  const minTaper = MIN_TAPER[eventType] || 2;

  // Calculate raw week counts
  let taperWeeks = Math.max(minTaper, Math.round(totalWeeks * props[3]));
  let peakWeeks = Math.max(1, Math.round(totalWeeks * props[2]));
  let buildWeeks = Math.max(1, Math.round(totalWeeks * props[1]));
  let baseWeeks = totalWeeks - taperWeeks - peakWeeks - buildWeeks;

  // Ensure base has at least 1 week
  if (baseWeeks < 1) {
    baseWeeks = 1;
    // Steal from build if needed
    const excess = (baseWeeks + buildWeeks + peakWeeks + taperWeeks) - totalWeeks;
    if (excess > 0) buildWeeks = Math.max(1, buildWeeks - excess);
  }

  // Final adjustment to exactly match totalWeeks
  const sum = baseWeeks + buildWeeks + peakWeeks + taperWeeks;
  if (sum < totalWeeks) buildWeeks += totalWeeks - sum;
  if (sum > totalWeeks) buildWeeks = Math.max(1, buildWeeks - (sum - totalWeeks));

  const phases: PhaseRange[] = [
    { phase: "BASE", startWeek: 1, endWeek: baseWeeks },
    { phase: "BUILD", startWeek: baseWeeks + 1, endWeek: baseWeeks + buildWeeks },
    { phase: "PEAK", startWeek: baseWeeks + buildWeeks + 1, endWeek: baseWeeks + buildWeeks + peakWeeks },
    { phase: "TAPER", startWeek: totalWeeks - taperWeeks + 1, endWeek: totalWeeks },
  ];

  return phases;
}

function getPhaseForWeek(week: number, phases: PhaseRange[]): Phase {
  for (const p of phases) {
    if (week >= p.startWeek && week <= p.endWeek) return p.phase;
  }
  return "BUILD"; // fallback
}

/* ─── Recovery Weeks ─────────────────────────────────────────── */

function assignRecoveryWeeks(totalWeeks: number, phases: PhaseRange[], age: number | null): Set<number> {
  const recovery = new Set<number>();
  const interval = age && age >= 45 ? 3 : 4; // 2-on/1-off for 45+, 3-on/1-off otherwise
  const taperStart = phases.find(p => p.phase === "TAPER")!.startWeek;

  let count = 0;
  for (let w = 1; w < taperStart; w++) {
    count++;
    if (count >= interval) {
      recovery.add(w);
      count = 0;
    }
  }

  return recovery;
}

/* ─── Volume Progression ─────────────────────────────────────── */

function calculateWeekVolume(
  week: number, totalWeeks: number, phase: Phase,
  isRecovery: boolean, phases: PhaseRange[],
  currentVolumeMinutes?: number, peakVolumeMinutes?: number,
): number {
  // Calculate the minimum volume percentage based on the athlete's current fitness
  // If they currently train at X min/week and peak is Y min/week, floor = X/Y * 100
  const currentFloorPercent = (currentVolumeMinutes && peakVolumeMinutes)
    ? Math.round((currentVolumeMinutes / peakVolumeMinutes) * 100)
    : 0;

  if (isRecovery) {
    // Recovery weeks: 50-60% of peak, but never below 70% of current volume
    return Math.max(55, Math.round(currentFloorPercent * 0.7));
  }

  const taperPhase = phases.find(p => p.phase === "TAPER")!;

  if (phase === "TAPER") {
    const taperWeek = week - taperPhase.startWeek + 1;
    const taperTotal = taperPhase.endWeek - taperPhase.startWeek + 1;
    // Progressive decrease: 65% → 45% → 30%
    if (taperTotal === 1) return 45;
    if (taperTotal === 2) return taperWeek === 1 ? 60 : 35;
    const step = (65 - 30) / (taperTotal - 1);
    return Math.round(65 - step * (taperWeek - 1));
  }

  if (phase === "BASE") {
    const basePhase = phases.find(p => p.phase === "BASE")!;
    const baseWeek = week - basePhase.startWeek;
    const baseTotal = basePhase.endWeek - basePhase.startWeek;
    // Default ramp from 55% to 80%
    const defaultPercent = baseTotal === 0 ? 70 : Math.round(55 + (80 - 55) * (baseWeek / baseTotal));
    // Floor: never go below athlete's current volume
    return Math.max(defaultPercent, currentFloorPercent);
  }

  if (phase === "BUILD") {
    const buildPhase = phases.find(p => p.phase === "BUILD")!;
    const buildWeek = week - buildPhase.startWeek;
    const buildTotal = buildPhase.endWeek - buildPhase.startWeek;
    const defaultPercent = buildTotal === 0 ? 88 : Math.round(80 + (95 - 80) * (buildWeek / buildTotal));
    return Math.max(defaultPercent, currentFloorPercent);
  }

  // PEAK: 95-100%
  const peakPhase = phases.find(p => p.phase === "PEAK")!;
  const peakWeek = week - peakPhase.startWeek;
  const peakTotal = peakPhase.endWeek - peakPhase.startWeek;
  return peakTotal === 0 ? 100 : Math.round(95 + 5 * (peakWeek / peakTotal));
}

/* ─── Peak Volume Estimation ─────────────────────────────────── */

function estimatePeakVolume(inputs: AthleteInputs): number {
  const { trainingDaysPerWeek, maxWeekdayMinutes, maxWeekendMinutes, trainingFor } = inputs;

  // Estimate based on event type base hours + available time
  const eventMinutes: Record<string, number> = {
    "5K": 240, "10K": 300, "Half Marathon": 360, "Marathon": 420,
    "Sprint Triathlon": 360, "Olympic Triathlon": 480,
    "70.3 Ironman": 600, "Full Ironman": 720,
    "Cycling Event": 360,
  };

  const baseTarget = eventMinutes[trainingFor] || 360;

  // Cap by available time: weekday sessions × count + weekend session
  const weekdayCount = Math.max(0, trainingDaysPerWeek - 1);
  const weekendCount = trainingDaysPerWeek - weekdayCount;
  const maxAvailable = (weekdayCount * maxWeekdayMinutes) + (weekendCount * maxWeekendMinutes);

  let peak = Math.min(baseTarget, maxAvailable);

  // If athlete's current volume is known, peak must be at least 15% above it
  // so the plan builds FROM their current fitness, not below it
  if (inputs.currentVolumeMinutes) {
    const minPeak = Math.round(inputs.currentVolumeMinutes * 1.15);
    peak = Math.max(peak, Math.min(minPeak, maxAvailable));
  }

  return peak;
}

/* ─── Training Day Assignment ────────────────────────────────── */

function assignTrainingDays(inputs: AthleteInputs): {
  trainingDays: string[];
  restDays: string[];
  longDay: string;
} {
  const available = inputs.availableDays.length > 0
    ? inputs.availableDays
    : ALL_DAYS.slice();
  const targetCount = Math.min(inputs.trainingDaysPerWeek, available.length);

  // Determine long day
  let longDay = available.includes("Sat") ? "Sat" : available[available.length - 1];
  if (inputs.preferredLongDay && inputs.preferredLongDay !== "Flexible") {
    const short = FULL_TO_SHORT[inputs.preferredLongDay] || inputs.preferredLongDay;
    if (available.includes(short)) longDay = short;
  }

  // Determine preferred rest day
  let preferredRest: string | null = null;
  if (inputs.preferredRestDay && inputs.preferredRestDay !== "Flexible") {
    const short = FULL_TO_SHORT[inputs.preferredRestDay] || inputs.preferredRestDay;
    if (available.includes(short)) preferredRest = short;
  }

  // Select training days: start with long day, then spread evenly
  const training = new Set<string>();
  training.add(longDay);

  // Add remaining days, avoiding preferred rest day, spreading evenly
  const candidates = available.filter(d => d !== longDay && d !== preferredRest);
  // Prioritize by spacing: spread training days across the week
  const dayIndex = (d: string) => ALL_DAYS.indexOf(d as typeof ALL_DAYS[number]);
  candidates.sort((a, b) => dayIndex(a) - dayIndex(b));

  // Greedy: pick days that maximize spacing
  while (training.size < targetCount && candidates.length > 0) {
    let bestDay = candidates[0];
    let bestScore = -1;

    for (const c of candidates) {
      if (training.has(c)) continue;
      // Score = minimum distance to any existing training day
      const ci = dayIndex(c);
      let minDist = 7;
      for (const t of training) {
        const ti = dayIndex(t);
        const dist = Math.min(Math.abs(ci - ti), 7 - Math.abs(ci - ti));
        minDist = Math.min(minDist, dist);
      }
      if (minDist > bestScore) {
        bestScore = minDist;
        bestDay = c;
      }
    }

    training.add(bestDay);
    candidates.splice(candidates.indexOf(bestDay), 1);
  }

  // If still need more, add preferred rest day
  if (training.size < targetCount && preferredRest && !training.has(preferredRest)) {
    training.add(preferredRest);
  }

  // Sort training and rest days into Mon–Sun calendar order
  const trainingDays = available.filter(d => training.has(d))
    .sort((a, b) => ALL_DAYS.indexOf(a as typeof ALL_DAYS[number]) - ALL_DAYS.indexOf(b as typeof ALL_DAYS[number]));
  const restDays = available.filter(d => !training.has(d))
    .sort((a, b) => ALL_DAYS.indexOf(a as typeof ALL_DAYS[number]) - ALL_DAYS.indexOf(b as typeof ALL_DAYS[number]));

  return { trainingDays, restDays, longDay };
}

/* ─── Session Assignment ─────────────────────────────────────── */

interface SessionAssignmentContext {
  weekNumber: number;
  phase: Phase;
  isRecovery: boolean;
  totalMinutes: number;
  trainingDays: string[];
  longDay: string;
  eventType: EventType;
  maxWeekdayMinutes: number;
  maxWeekendMinutes: number;
  weakestDiscipline?: string;
  isLastWeek: boolean;
  preferredTimes: string[];
}

function assignSessionsForWeek(ctx: SessionAssignmentContext): SessionSlot[] {
  const isTri = TRIATHLON_EVENTS.has(ctx.eventType);
  const isCycling = ctx.eventType === "Cycling Event";

  if (isTri) return assignTriathlonSessions(ctx);
  if (isCycling) return assignCyclingSessions(ctx);
  return assignRunningSessions(ctx);
}

/* ─── Running Session Templates ──────────────────────────────── */

function assignRunningSessions(ctx: SessionAssignmentContext): SessionSlot[] {
  const { trainingDays, longDay, phase, isRecovery, totalMinutes } = ctx;
  const n = trainingDays.length;
  const sessions: SessionSlot[] = [];

  // Define session roles based on training day count
  // Roles: L=long, Q1=quality1, Q2=quality2, E=easy, ES=easy+strength supplement
  // For running events, every training day is a run — strength is a 15-20 min
  // supplement after an easy run, never a standalone day that steals a run slot.
  type Role = "L" | "Q1" | "Q2" | "E" | "ES";
  let roles: Role[];

  if (n <= 3) {
    roles = ["E", "Q1", "L"];
  } else if (n === 4) {
    roles = ["E", "Q1", "ES", "L"];
  } else if (n === 5) {
    roles = ["E", "Q1", "ES", "Q2", "L"];
  } else {
    // 6-7 days
    roles = ["E", "Q1", "ES", "Q2", "E", "ES", "L"];
    while (roles.length > n) roles.splice(roles.indexOf("ES"), 1) || roles.pop();
    while (roles.length < n) roles.splice(roles.length - 1, 0, "E");
  }

  // In BASE phase, quality sessions become easy (except one tempo)
  if (phase === "BASE" || isRecovery) {
    roles = roles.map(r => {
      if (r === "Q2") return "E";
      if (r === "Q1" && !isRecovery) return "Q1"; // keep one quality
      if (r === "Q1" && isRecovery) return "E";
      return r;
    });
  }

  // Last week (race week): everything easy + short
  if (ctx.isLastWeek) {
    roles = roles.map(r => (r === "L" ? "E" : r === "Q1" || r === "Q2" ? "E" : r));
  }

  // Assign roles to specific days — long day gets "L" role
  const longIdx = trainingDays.indexOf(longDay);
  if (longIdx >= 0 && roles.includes("L")) {
    // Move L role to longDay position
    const lIdx = roles.indexOf("L");
    [roles[lIdx], roles[longIdx]] = [roles[longIdx], roles[lIdx]];
  }

  // Allocate time budgets
  const timeBudgets = allocateTime(roles.map(r => roleWeight(r)), totalMinutes, ctx);

  for (let i = 0; i < n; i++) {
    const day = trainingDays[i];
    const role = roles[i];
    const dur = timeBudgets[i];
    const isWeekend = WEEKEND.has(day);
    const maxDur = isWeekend ? ctx.maxWeekendMinutes : ctx.maxWeekdayMinutes;
    const clampedDur = Math.min(dur, maxDur);

    const slot = roleToRunSession(role, phase, clampedDur, day, ctx.preferredTimes);
    sessions.push(slot);
  }

  return sessions;
}

function roleToRunSession(role: string, phase: Phase, dur: number, day: string, preferredTimes: string[]): SessionSlot {
  const time = estimateTimeSlot(day, dur, preferredTimes);
  switch (role) {
    case "L":
      return { day, sessionType: "long-run", discipline: "run", durationMinutes: dur, zone: "Z1-Z2", isKeySession: true, timeSlot: time };
    case "Q1":
      return {
        day, discipline: "run", durationMinutes: dur, isKeySession: true, timeSlot: time,
        sessionType: phase === "BASE" ? "tempo-run" : phase === "BUILD" ? "tempo-run" : "interval-run",
        zone: phase === "BASE" ? "Z3" : phase === "BUILD" ? "Z3-Z4" : "Z4-Z5",
      };
    case "Q2":
      return {
        day, discipline: "run", durationMinutes: dur, isKeySession: true, timeSlot: time,
        sessionType: "interval-run", zone: "Z4-Z5",
      };
    case "ES":
      // Easy run + strength supplement (AI writes both in one session card)
      return { day, sessionType: "easy-run", discipline: "run", durationMinutes: dur, zone: "Z1-Z2", isKeySession: false, timeSlot: time, includeStrength: true };
    default: // "E"
      return { day, sessionType: "easy-run", discipline: "run", durationMinutes: dur, zone: "Z1-Z2", isKeySession: false, timeSlot: time };
  }
}

/* ─── Triathlon Session Templates ────────────────────────────── */

function assignTriathlonSessions(ctx: SessionAssignmentContext): SessionSlot[] {
  const { trainingDays, longDay, phase, isRecovery, totalMinutes } = ctx;
  const n = trainingDays.length;
  const isLong = LONG_COURSE.has(ctx.eventType);
  const sessions: SessionSlot[] = [];

  // Define multi-sport roles
  // S=swim, B=bike, R=run, LR=long run, LB=long ride, BK=brick, ST=strength
  type TriRole = "S" | "SQ" | "B" | "BQ" | "R" | "RQ" | "LR" | "LB" | "BK" | "ST";
  let roles: TriRole[];

  // Minimum: 2-3 swim, 2-3 bike, 2-3 run for Olympic; 3/3/3 for long course
  if (n <= 5) {
    if (isLong) {
      // 5 days, long course: swim, bike, run+swim(double?), long ride, long run
      // Can't hit 3/3/3=9 in 5 single sessions — use combo sessions
      roles = ["S", "B", "R", "LB", "LR"];
    } else {
      // Olympic: long ride is essential for the 40km bike leg
      roles = ["S", "B", "R", "LB", "LR"];
    }
    while (roles.length < n) roles.splice(2, 0, "S");
  } else if (n === 6) {
    if (isLong) {
      roles = ["S", "B", "R", "SQ", "LB", "LR"];
    } else {
      roles = ["S", "B", "R", "SQ", "LB", "LR"];
    }
  } else {
    // 7 days
    roles = ["S", "B", "R", "SQ", "BQ", "LB", "LR"];
  }

  // Add brick in BUILD/PEAK (replace a BQ or B with BK)
  if ((phase === "BUILD" || phase === "PEAK") && !isRecovery) {
    const bqIdx = roles.indexOf("BQ");
    const bIdx = bqIdx >= 0 ? bqIdx : roles.indexOf("B");
    if (bIdx >= 0) roles[bIdx] = "BK";
  }

  // Add strength in BASE/BUILD (replace last easy session)
  if ((phase === "BASE" || phase === "BUILD") && !isRecovery && n >= 6) {
    // Find a non-key session to swap
    const swapIdx = roles.lastIndexOf("R");
    if (swapIdx >= 0 && roles.filter(r => r === "R" || r === "RQ" || r === "LR").length > 2) {
      roles[swapIdx] = "ST";
    }
  }

  // Recovery weeks: all quality → easy
  if (isRecovery) {
    roles = roles.map(r => {
      if (r === "SQ") return "S";
      if (r === "BQ") return "B";
      if (r === "RQ") return "R";
      if (r === "BK") return "B";
      return r;
    }) as TriRole[];
  }

  // Race week: shorten everything
  if (ctx.isLastWeek) {
    roles = roles.map(r => {
      if (r === "LR") return "R";
      if (r === "LB") return "B";
      if (r === "BK") return "R";
      return r;
    }) as TriRole[];
  }

  // Assign long sessions to longDay
  const longIdx = trainingDays.indexOf(longDay);
  if (longIdx >= 0) {
    const lrIdx = roles.indexOf("LR");
    const lbIdx = roles.indexOf("LB");
    // Prefer long run on longDay
    if (lrIdx >= 0) {
      [roles[lrIdx], roles[longIdx]] = [roles[longIdx], roles[lrIdx]];
    } else if (lbIdx >= 0) {
      [roles[lbIdx], roles[longIdx]] = [roles[longIdx], roles[lbIdx]];
    }
  }

  const timeBudgets = allocateTime(roles.map(r => triRoleWeight(r)), totalMinutes, ctx);

  for (let i = 0; i < n; i++) {
    const day = trainingDays[i];
    const role = roles[i];
    const dur = timeBudgets[i];
    const isWeekend = WEEKEND.has(day);
    const maxDur = isWeekend ? ctx.maxWeekendMinutes : ctx.maxWeekdayMinutes;
    const clampedDur = Math.min(dur, maxDur);

    sessions.push(triRoleToSession(role, phase, clampedDur, day, ctx.preferredTimes));
  }

  return sessions;
}

function triRoleToSession(role: string, phase: Phase, dur: number, day: string, preferredTimes: string[]): SessionSlot {
  const time = estimateTimeSlot(day, dur, preferredTimes);
  switch (role) {
    case "S":
      return { day, sessionType: "swim-technique", discipline: "swim", durationMinutes: dur, zone: "Z1-Z2", isKeySession: false, timeSlot: time };
    case "SQ":
      return { day, sessionType: "swim-threshold", discipline: "swim", durationMinutes: dur, zone: "Z3-Z4", isKeySession: true, timeSlot: time };
    case "B":
      return { day, sessionType: "bike-endurance", discipline: "bike", durationMinutes: dur, zone: "Z1-Z2", isKeySession: false, timeSlot: time };
    case "BQ":
      return { day, sessionType: "bike-quality", discipline: "bike", durationMinutes: dur, zone: "Z3-Z4", isKeySession: true, timeSlot: time };
    case "LB":
      return { day, sessionType: "long-ride", discipline: "bike", durationMinutes: dur, zone: "Z1-Z2", isKeySession: true, timeSlot: time };
    case "R":
      return { day, sessionType: "easy-run", discipline: "run", durationMinutes: dur, zone: "Z1-Z2", isKeySession: false, timeSlot: time };
    case "RQ":
      return {
        day, discipline: "run", durationMinutes: dur, isKeySession: true, timeSlot: time,
        sessionType: phase === "PEAK" ? "interval-run" : "tempo-run",
        zone: phase === "PEAK" ? "Z4-Z5" : "Z3-Z4",
      };
    case "LR":
      return { day, sessionType: "long-run", discipline: "run", durationMinutes: dur, zone: "Z1-Z2", isKeySession: true, timeSlot: time };
    case "BK":
      return { day, sessionType: "brick", discipline: "brick", durationMinutes: dur, zone: "Z2-Z3", isKeySession: true, timeSlot: time };
    case "ST":
      return { day, sessionType: "strength", discipline: "strength", durationMinutes: Math.min(dur, 45), zone: "N/A", isKeySession: false, timeSlot: time };
    default:
      return { day, sessionType: "easy-run", discipline: "run", durationMinutes: dur, zone: "Z1-Z2", isKeySession: false, timeSlot: time };
  }
}

/* ─── Cycling Session Templates ──────────────────────────────── */

function assignCyclingSessions(ctx: SessionAssignmentContext): SessionSlot[] {
  const { trainingDays, longDay, phase, isRecovery, totalMinutes } = ctx;
  const n = trainingDays.length;

  type CycleRole = "E" | "Q1" | "Q2" | "L" | "S";
  let roles: CycleRole[];

  if (n <= 3) {
    roles = ["E", "Q1", "L"];
  } else if (n === 4) {
    roles = ["E", "Q1", "S", "L"];
  } else {
    roles = ["E", "Q1", "E", "Q2", "L"];
    while (roles.length < n) roles.splice(roles.length - 1, 0, "E");
  }

  if (phase === "BASE" || isRecovery) {
    roles = roles.map(r => (r === "Q2" ? "E" : r === "Q1" && isRecovery ? "E" : r));
  }

  if (ctx.isLastWeek) {
    roles = roles.map(r => (r === "L" || r === "Q1" || r === "Q2" ? "E" : r));
  }

  const longIdx = trainingDays.indexOf(longDay);
  if (longIdx >= 0 && roles.includes("L")) {
    const lIdx = roles.indexOf("L");
    [roles[lIdx], roles[longIdx]] = [roles[longIdx], roles[lIdx]];
  }

  const timeBudgets = allocateTime(roles.map(r => roleWeight(r)), totalMinutes, ctx);
  const sessions: SessionSlot[] = [];

  for (let i = 0; i < n; i++) {
    const day = trainingDays[i];
    const role = roles[i];
    const dur = timeBudgets[i];
    const isWeekend = WEEKEND.has(day);
    const maxDur = isWeekend ? ctx.maxWeekendMinutes : ctx.maxWeekdayMinutes;
    const clampedDur = Math.min(dur, maxDur);
    const time = estimateTimeSlot(day, clampedDur, ctx.preferredTimes);

    switch (role) {
      case "L":
        sessions.push({ day, sessionType: "long-ride", discipline: "bike", durationMinutes: clampedDur, zone: "Z1-Z2", isKeySession: true, timeSlot: time });
        break;
      case "Q1":
        sessions.push({ day, sessionType: "bike-quality", discipline: "bike", durationMinutes: clampedDur, zone: phase === "BASE" ? "Z3" : "Z3-Z4", isKeySession: true, timeSlot: time });
        break;
      case "Q2":
        sessions.push({ day, sessionType: "bike-quality", discipline: "bike", durationMinutes: clampedDur, zone: "Z4-Z5", isKeySession: true, timeSlot: time });
        break;
      case "S":
        sessions.push({ day, sessionType: "strength", discipline: "strength", durationMinutes: Math.min(clampedDur, 45), zone: "N/A", isKeySession: false, timeSlot: time });
        break;
      default:
        sessions.push({ day, sessionType: "bike-endurance", discipline: "bike", durationMinutes: clampedDur, zone: "Z1-Z2", isKeySession: false, timeSlot: time });
    }
  }

  return sessions;
}

/* ─── Time Allocation ────────────────────────────────────────── */

function roleWeight(role: string): number {
  switch (role) {
    case "L": return 2.5;
    case "Q1": case "Q2": return 1.2;
    case "ES": return 1.1; // easy run + strength supplement (slightly longer)
    default: return 1.0; // easy
  }
}

function triRoleWeight(role: string): number {
  switch (role) {
    case "LR": case "LB": return 2.5;
    case "BK": return 2.0;
    case "SQ": case "BQ": case "RQ": return 1.2;
    case "ST": return 0.7;
    default: return 1.0;
  }
}

function allocateTime(weights: number[], totalMinutes: number, ctx: SessionAssignmentContext): number[] {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  // Round to nearest 5 minutes
  return weights.map(w => Math.round((w / totalWeight) * totalMinutes / 5) * 5);
}

/* ─── Date Range Calculation ─────────────────────────────────── */

function calculateDateRange(weekNumber: number, raceDate: Date | null, totalWeeks: number): string {
  const baseDate = raceDate ? new Date(raceDate) : new Date();
  if (!raceDate) {
    // If no race date, start from next Monday
    const dayOfWeek = baseDate.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
    baseDate.setDate(baseDate.getDate() + daysUntilMonday);
  }

  // Calculate week 1 start (Monday)
  let week1Start: Date;
  if (raceDate) {
    // Count backwards: race is in the last week
    week1Start = new Date(raceDate);
    week1Start.setDate(week1Start.getDate() - (totalWeeks * 7) + 1);
    // Adjust to Monday
    const dow = week1Start.getDay();
    if (dow !== 1) {
      week1Start.setDate(week1Start.getDate() - ((dow + 6) % 7));
    }
  } else {
    week1Start = new Date(baseDate);
  }

  const weekStart = new Date(week1Start);
  weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const startStr = `${weekStart.getDate()} ${months[weekStart.getMonth()]}`;
  const endStr = weekStart.getMonth() === weekEnd.getMonth()
    ? `${weekEnd.getDate()}`
    : `${weekEnd.getDate()} ${months[weekEnd.getMonth()]}`;

  return `${startStr}–${endStr} ${weekEnd.getFullYear()}`;
}

/* ─── Time Slot Estimation ───────────────────────────────────── */

function estimateTimeSlot(day: string, durationMinutes: number, preferredTimes: string[]): string {
  const isWeekend = WEEKEND.has(day);

  // Default start times based on preferences
  let startHour = 6; // default: 6am
  let startMin = 0;

  if (preferredTimes.length > 0) {
    const pref = preferredTimes[0].toLowerCase();
    if (pref.includes("early morning") || pref.includes("before work")) {
      startHour = 5; startMin = 30;
    } else if (pref.includes("morning")) {
      startHour = isWeekend ? 7 : 6;
    } else if (pref.includes("lunch")) {
      startHour = 12;
    } else if (pref.includes("afternoon")) {
      startHour = 15;
    } else if (pref.includes("evening") || pref.includes("after work")) {
      startHour = 17; startMin = 30;
    }
  } else {
    startHour = isWeekend ? 7 : 6;
  }

  const endTotalMin = startHour * 60 + startMin + durationMinutes;
  const endHour = Math.floor(endTotalMin / 60);
  const endMin = endTotalMin % 60;

  const fmt = (h: number, m: number) => {
    const period = h >= 12 ? "pm" : "am";
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return m === 0 ? `${h12}:00${period}` : `${h12}:${m.toString().padStart(2, "0")}${period}`;
  };

  return `${fmt(startHour, startMin)}–${fmt(endHour, endMin)}`;
}

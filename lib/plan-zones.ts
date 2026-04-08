/* ─── Training Zone Calculations ──────────────────────────────────
   Deterministic zone calculation from athlete data.
   Used by plan-html.ts to render the zones section.
   ────────────────────────────────────────────────────────────────── */

export interface ZoneEntry {
  name: string;
  hr?: string;
  pace?: string;
  power?: string;
  rpe: string;
  description: string;
}

export interface TrainingZones {
  run?: ZoneEntry[];
  bike?: ZoneEntry[];
  swim?: ZoneEntry[];
}

/* ─── Helpers ──────────────────────────────────────────────────── */

/** Parse "X:XX" pace string to total seconds */
function parsePace(pace: string): number | null {
  const m = pace.match(/^(\d+):(\d{2})$/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

/** Format seconds to "X:XX" pace string */
function formatPace(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Karvonen formula: restHR + intensity * (maxHR - restHR) */
function karvonen(restHR: number, maxHR: number, intensity: number): number {
  return Math.round(restHR + intensity * (maxHR - restHR));
}

/* ─── Main entry point ───────────────────────────────────────── */

export function calculateZones(d: Record<string, unknown>): TrainingZones {
  const maxHR = d.maxHRUnknown ? null : d.maxHR ? parseInt(String(d.maxHR), 10) : null;
  const restHR = d.restingHRUnknown ? null : d.restingHR ? parseInt(String(d.restingHR), 10) : null;
  const hasHR = maxHR !== null && restHR !== null && !isNaN(maxHR) && !isNaN(restHR);

  const zones: TrainingZones = {};

  // Run zones
  const easyPace = d.easyRunPace ? String(d.easyRunPace) : null;
  zones.run = calculateRunZones(easyPace, hasHR ? maxHR : undefined, hasHR ? restHR : undefined);

  // Bike zones
  const ftp = d.ftpUnknown ? null : d.ftp ? parseInt(String(d.ftp), 10) : null;
  const hasFTP = ftp !== null && !isNaN(ftp);
  zones.bike = calculateBikeZones(hasFTP ? ftp : undefined, hasHR ? maxHR : undefined, hasHR ? restHR : undefined);

  // Swim zones
  const swimEasy = d.swimPaceEasy ? String(d.swimPaceEasy) : null;
  const swimHard = d.swimPaceHard ? String(d.swimPaceHard) : null;
  zones.swim = calculateSwimZones(swimEasy, swimHard, hasHR ? maxHR : undefined, hasHR ? restHR : undefined);

  return zones;
}

/* ─── Run Zones ──────────────────────────────────────────────── */

function calculateRunZones(
  easyPace: string | null,
  maxHR?: number,
  restHR?: number,
): ZoneEntry[] {
  const hasHR = maxHR !== undefined && restHR !== undefined;
  const easySec = easyPace ? parsePace(easyPace) : null;

  // Derive paces from easy pace if available
  // Easy pace ≈ Z2. Z1 is ~15-20s/km slower. Z3 is ~20-30s faster. Z4 is ~40-60s faster. Z5 is ~60-80s faster.
  const z1Pace = easySec ? formatPace(easySec + 20) : null;
  const z2Pace = easySec ? formatPace(easySec) : null;
  const z3Pace = easySec ? formatPace(easySec - 25) : null;
  const z4Pace = easySec ? formatPace(easySec - 50) : null;
  const z5Pace = easySec ? formatPace(easySec - 70) : null;

  return [
    {
      name: "Zone 1 — Recovery",
      hr: hasHR ? `${karvonen(restHR, maxHR, 0.50)}–${karvonen(restHR, maxHR, 0.60)} BPM` : undefined,
      pace: z1Pace ? `${z1Pace}+/km` : undefined,
      rpe: "RPE 1–2",
      description: "Very easy, conversational. Active recovery.",
    },
    {
      name: "Zone 2 — Aerobic",
      hr: hasHR ? `${karvonen(restHR, maxHR, 0.60)}–${karvonen(restHR, maxHR, 0.70)} BPM` : undefined,
      pace: z2Pace ? `${z2Pace}/km` : undefined,
      rpe: "RPE 3–4",
      description: "Easy, can hold a conversation. Base building.",
    },
    {
      name: "Zone 3 — Tempo",
      hr: hasHR ? `${karvonen(restHR, maxHR, 0.70)}–${karvonen(restHR, maxHR, 0.80)} BPM` : undefined,
      pace: z3Pace ? `${z3Pace}/km` : undefined,
      rpe: "RPE 5–6",
      description: "Comfortably hard. Can speak in short sentences.",
    },
    {
      name: "Zone 4 — Threshold",
      hr: hasHR ? `${karvonen(restHR, maxHR, 0.80)}–${karvonen(restHR, maxHR, 0.90)} BPM` : undefined,
      pace: z4Pace ? `${z4Pace}/km` : undefined,
      rpe: "RPE 7–8",
      description: "Hard effort. A few words at most.",
    },
    {
      name: "Zone 5 — VO2max",
      hr: hasHR ? `${karvonen(restHR, maxHR, 0.90)}–${karvonen(restHR, maxHR, 1.0)} BPM` : undefined,
      pace: z5Pace ? `${z5Pace}/km` : undefined,
      rpe: "RPE 9–10",
      description: "Maximum effort. Short intervals only.",
    },
  ];
}

/* ─── Bike Zones ─────────────────────────────────────────────── */

function calculateBikeZones(
  ftp?: number,
  maxHR?: number,
  restHR?: number,
): ZoneEntry[] {
  const hasHR = maxHR !== undefined && restHR !== undefined;
  const hasFTP = ftp !== undefined;

  // Bike HR is 5-10 BPM lower than running
  const bikeOffset = 7;
  const hrStr = (low: number, high: number) =>
    hasHR
      ? `${karvonen(restHR!, maxHR!, low) - bikeOffset}–${karvonen(restHR!, maxHR!, high) - bikeOffset} BPM`
      : undefined;

  const ftpStr = (low: number, high: number) =>
    hasFTP ? `${Math.round(ftp! * low)}–${Math.round(ftp! * high)}W` : undefined;

  return [
    {
      name: "Zone 1 — Active Recovery",
      hr: hrStr(0.50, 0.60),
      power: ftpStr(0, 0.55),
      rpe: "RPE 1–2",
      description: "Very easy spinning. Recovery rides.",
    },
    {
      name: "Zone 2 — Endurance",
      hr: hrStr(0.60, 0.70),
      power: ftpStr(0.56, 0.75),
      rpe: "RPE 3–4",
      description: "Steady endurance. Base building.",
    },
    {
      name: "Zone 3 — Tempo",
      hr: hrStr(0.70, 0.80),
      power: ftpStr(0.76, 0.90),
      rpe: "RPE 5–6",
      description: "Moderately hard. Sustained effort.",
    },
    {
      name: "Zone 4 — Threshold",
      hr: hrStr(0.80, 0.90),
      power: ftpStr(0.91, 1.05),
      rpe: "RPE 7–8",
      description: "Hard. Near FTP. Time trial effort.",
    },
    {
      name: "Zone 5 — VO2max",
      hr: hrStr(0.90, 1.0),
      power: ftpStr(1.06, 1.20),
      rpe: "RPE 9",
      description: "Very hard. Short intervals 3-8 min.",
    },
    {
      name: "Zone 6 — Anaerobic",
      power: hasFTP ? `>${Math.round(ftp! * 1.21)}W` : undefined,
      rpe: "RPE 10",
      description: "Max power. Sprints under 2 min.",
    },
  ];
}

/* ─── Swim Zones ─────────────────────────────────────────────── */

function calculateSwimZones(
  easyPace: string | null,
  hardPace: string | null,
  maxHR?: number,
  restHR?: number,
): ZoneEntry[] {
  const hasHR = maxHR !== undefined && restHR !== undefined;
  const easySec = easyPace ? parsePace(easyPace) : null;
  const hardSec = hardPace ? parsePace(hardPace) : null;

  // CSS ≈ midpoint between easy and hard pace (closer to hard)
  // If only one pace, estimate CSS from it
  let cssSec: number | null = null;
  if (easySec && hardSec) {
    cssSec = Math.round(hardSec + (easySec - hardSec) * 0.3);
  } else if (hardSec) {
    cssSec = hardSec + 5;
  } else if (easySec) {
    cssSec = easySec - 15;
  }

  // Swim HR is 10-15 BPM lower than running
  const swimOffset = 12;
  const hrStr = (low: number, high: number) =>
    hasHR
      ? `${karvonen(restHR!, maxHR!, low) - swimOffset}–${karvonen(restHR!, maxHR!, high) - swimOffset} BPM`
      : undefined;

  return [
    {
      name: "Recovery",
      pace: cssSec ? `${formatPace(cssSec + 15)}/100m` : undefined,
      hr: hrStr(0.50, 0.60),
      rpe: "RPE 1–2",
      description: "Very easy. Drill pace. Warm-up/cool-down.",
    },
    {
      name: "Aerobic",
      pace: cssSec ? `${formatPace(cssSec + 8)}–${formatPace(cssSec + 14)}/100m` : undefined,
      hr: hrStr(0.60, 0.70),
      rpe: "RPE 3–4",
      description: "Comfortable. Base endurance sets.",
    },
    {
      name: "Threshold (CSS)",
      pace: cssSec ? `${formatPace(cssSec - 3)}–${formatPace(cssSec + 3)}/100m` : undefined,
      hr: hrStr(0.75, 0.85),
      rpe: "RPE 5–7",
      description: "Steady-hard. Main set pace.",
    },
    {
      name: "VO2max",
      pace: cssSec ? `${formatPace(cssSec - 10)}–${formatPace(cssSec - 5)}/100m` : undefined,
      hr: hrStr(0.85, 0.95),
      rpe: "RPE 8–9",
      description: "Hard. Short fast repeats (50-200m).",
    },
    {
      name: "Anaerobic",
      pace: cssSec ? `<${formatPace(cssSec - 15)}/100m` : undefined,
      rpe: "RPE 10",
      description: "Max sprint. 25-50m efforts.",
    },
  ];
}

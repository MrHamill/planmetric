/* ─── Race Split Calculator ──────────────────────────────────────
   Calculates target race splits from an overall target time and
   event type, so Claude doesn't have to guess the arithmetic.
   ──────────────────────────────────────────────────────────────── */

interface RaceSplits {
  swim?: { time: string; pace: string };
  t1?: string;
  bike?: { time: string; speed: string };
  t2?: string;
  run: { time: string; pace: string };
  total: string;
}

/* Standard distances per event */
const DISTANCES: Record<string, { swim?: number; bike?: number; run: number }> = {
  "Sprint Triathlon":   { swim: 0.75, bike: 20, run: 5 },
  "Olympic Triathlon":  { swim: 1.5,  bike: 40, run: 10 },
  "70.3 Ironman":       { swim: 1.9,  bike: 90, run: 21.1 },
  "Full Ironman":       { swim: 3.8,  bike: 180, run: 42.2 },
  "Marathon":           { run: 42.195 },
  "Half Marathon":      { run: 21.0975 },
  "10K":                { run: 10 },
  "5K":                 { run: 5 },
};

/* Typical split distribution as % of total race time (excl. transitions).
   Ratios MUST sum to 1.0. Based on mid-pack age-group athlete averages. */
const TRI_RATIOS: Record<string, { swim: number; bike: number; run: number; t1: number; t2: number }> = {
  "Sprint Triathlon":  { swim: 0.17, bike: 0.50, run: 0.33, t1: 2, t2: 1.5 },
  "Olympic Triathlon": { swim: 0.17, bike: 0.50, run: 0.33, t1: 2.5, t2: 2 },
  "70.3 Ironman":      { swim: 0.13, bike: 0.54, run: 0.33, t1: 3, t2: 2 },
  "Full Ironman":      { swim: 0.10, bike: 0.55, run: 0.35, t1: 4, t2: 3 },
};

/** Parse race target time into total minutes.
 *  Three-part "H:MM:SS" is unambiguous.
 *  Two-part "X:YY" needs context: for short events (5K/10K) it's M:SS,
 *  for longer events it's H:MM. Pass the event type to disambiguate. */
function parseTime(t: string, trainingFor?: string): number | null {
  const clean = t.trim().replace(/^[^\d]+/, "");
  const parts = clean.split(":").map(Number);
  if (parts.some(isNaN)) return null;

  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) {
    const shortEvents = ["5K", "10K"];
    if (trainingFor && shortEvents.includes(trainingFor)) {
      // M:SS for short events (e.g., "22:00" = 22 min 0 sec)
      return parts[0] + parts[1] / 60;
    }
    // H:MM for longer events (e.g., "5:00" = 5 hours)
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1) return parts[0]; // raw minutes
  return null;
}

/** Parse pace "M:SS" (e.g., "5:30/km" or "2:15/100m") into decimal minutes */
function parsePace(t: string): number | null {
  const clean = t.trim().replace(/\/.*$/, "").replace(/^[^\d]+/, "");
  const parts = clean.split(":").map(Number);
  if (parts.some(isNaN)) return null;

  if (parts.length === 2) return parts[0] + parts[1] / 60; // M:SS → decimal minutes
  if (parts.length === 1) return parts[0];
  return null;
}

/** Format minutes back to H:MM:SS or M:SS */
function formatTime(mins: number): string {
  const totalSec = Math.round(mins * 60);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Format pace as M:SS per unit */
function formatPace(mins: number): string {
  const totalSec = Math.round(mins * 60);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function calculateRaceSplits(
  targetTime: string,
  trainingFor: string,
  athleteData?: Record<string, unknown>,
): RaceSplits | null {
  const totalMins = parseTime(targetTime, trainingFor);
  if (!totalMins || totalMins <= 0) return null;

  const dist = DISTANCES[trainingFor];
  if (!dist) return null;

  const ratios = TRI_RATIOS[trainingFor];

  // Running-only events
  if (!dist.swim && !dist.bike) {
    const pacePerKm = totalMins / dist.run;
    return {
      run: { time: formatTime(totalMins), pace: `${formatPace(pacePerKm)}/km` },
      total: formatTime(totalMins),
    };
  }

  // Triathlon events
  if (!ratios || !dist.swim || !dist.bike) return null;

  const t1Mins = ratios.t1;
  const t2Mins = ratios.t2;
  const racingMins = totalMins - t1Mins - t2Mins;

  if (racingMins <= 0) return null;

  // If we have athlete paces, use them to weight the split ratios
  let swimRatio = ratios.swim;
  let bikeRatio = ratios.bike;
  let runRatio = ratios.run;

  if (athleteData) {
    const swimPace = athleteData.swimPaceEasy as string | undefined;
    const bikeSpeed = athleteData.avgBikeSpeed as string | undefined;
    const runPace = athleteData.easyRunPace as string | undefined;

    // If we have all three, estimate relative times and adjust ratios
    if (swimPace && bikeSpeed && runPace && dist.swim && dist.bike) {
      const swimParsed = parsePace(swimPace); // min per 100m
      const bikeParsed = parseFloat(bikeSpeed as string); // km/h
      const runParsed = parsePace(runPace); // min per km

      if (swimParsed && bikeParsed && runParsed && bikeParsed > 0) {
        // Estimate how long each leg would take at easy pace
        const estSwim = swimParsed * (dist.swim * 10); // swim pace is per 100m
        const estBike = (dist.bike / bikeParsed) * 60; // convert hours to minutes
        const estRun = runParsed * dist.run;
        const estTotal = estSwim + estBike + estRun;

        if (estTotal > 0) {
          // Blend athlete-specific ratios with standard ratios (60% athlete, 40% standard)
          // This prevents extreme ratios from wonky input
          swimRatio = 0.6 * (estSwim / estTotal) + 0.4 * ratios.swim;
          bikeRatio = 0.6 * (estBike / estTotal) + 0.4 * ratios.bike;
          runRatio = 0.6 * (estRun / estTotal) + 0.4 * ratios.run;

          // Normalize to sum to 1
          const sum = swimRatio + bikeRatio + runRatio;
          swimRatio /= sum;
          bikeRatio /= sum;
          runRatio /= sum;
        }
      }
    }
  }

  const swimMins = racingMins * swimRatio;
  const bikeMins = racingMins * bikeRatio;
  const runMins = racingMins * runRatio;

  const swimPacePerHundred = swimMins / (dist.swim * 10);
  const bikeSpeedKmh = dist.bike / (bikeMins / 60);
  const runPacePerKm = runMins / dist.run;

  // Verify total adds up
  const verifyTotal = swimMins + t1Mins + bikeMins + t2Mins + runMins;

  return {
    swim: {
      time: formatTime(swimMins),
      pace: `${formatPace(swimPacePerHundred)}/100m`,
    },
    t1: formatTime(t1Mins),
    bike: {
      time: formatTime(bikeMins),
      speed: `${bikeSpeedKmh.toFixed(1)} km/h`,
    },
    t2: formatTime(t2Mins),
    run: {
      time: formatTime(runMins),
      pace: `${formatPace(runPacePerKm)}/km`,
    },
    total: formatTime(verifyTotal),
  };
}

/** Format splits into a readable string for the AI prompt */
export function formatSplitsForPrompt(
  splits: RaceSplits,
  trainingFor: string,
): string {
  const dist = DISTANCES[trainingFor];
  if (!dist) return "";

  const lines: string[] = ["=== TARGET RACE SPLITS (pre-calculated — use these exactly) ==="];

  if (splits.swim && dist.swim) {
    lines.push(`Swim (${dist.swim}km): ${splits.swim.time} (${splits.swim.pace})`);
  }
  if (splits.t1) {
    lines.push(`T1: ${splits.t1}`);
  }
  if (splits.bike && dist.bike) {
    lines.push(`Bike (${dist.bike}km): ${splits.bike.time} (${splits.bike.speed})`);
  }
  if (splits.t2) {
    lines.push(`T2: ${splits.t2}`);
  }
  if (dist.run) {
    lines.push(`Run (${dist.run}km): ${splits.run.time} (${splits.run.pace})`);
  }
  lines.push(`TOTAL: ${splits.total}`);
  lines.push("IMPORTANT: These splits are mathematically verified to add up. Use them in all race day content — do NOT recalculate or invent different splits.");

  return lines.join("\n");
}

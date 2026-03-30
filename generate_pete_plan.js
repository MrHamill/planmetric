require("dotenv").config({ path: ".env.local" });
const Anthropic = require("@anthropic-ai/sdk").default;
const fs = require("fs");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const athleteProfile = `=== PLAN TYPE ===
Plan: premium

=== PERSONAL ===
Name: Pete Hamill
Age: 21
Gender: Male
Height: 178 cm
Weight: 76 kg
Location: Sunshine Coast, Australia

=== RACE & GOAL ===
Training For: 70.3 Ironman
Race Name: Sunshine Coast 70.3
Race Date: 2026-09-14
Main Goal: Hit a target time
Target Time: Sub 5 hour
Completed Before: No

=== CURRENT FITNESS ===
Training Consistency: 3–6 months
Recent Race Result: Olympic triathlon 2:35, with 2 months training from zero cycling and swim experience
Split Times: 31/3/1:13/4/45 (swim ~31min / T1 ~3min / bike ~1:13 / T2 ~4min / run ~45min — Olympic distance)
Max HR: Unknown (estimated 193 BPM via Tanaka formula)
Resting HR: 42 BPM

=== SWIM ===
Easy Pace: 2:30/100m
Threshold Pace: 1:50-2:00/100m (estimated CSS ~1:55/100m)
Weekly Volume: 2–4 km
Longest Swim: 1500m
Bilateral Breathing: Yes
Pool Access: Year-round
Open Water: Yes — easy access
Wetsuit: No

=== BIKE ===
Avg Speed: 33 km/h
Weekly Volume: 150kms
Longest Ride: 3 hours
FTP: Unknown / no power meter
Bike Type: Road bike
Power Meter: No
Indoor Trainer: Yes

=== RUN ===
Longest Run: 16 km
Easy Pace: 5:15-30/km
Recent Race: 10km in 45 minutes (after swim and bike in Olympic tri)
Treadmill: Yes

=== DISCIPLINE RANKING ===
Weakest: Swim, Strongest: Run

=== SCHEDULE ===
Training Days/Week: 6
Rest Days/Week: 1
Preferred Times: Before 6am, 6–8am, Evening (5–8pm)
Available Days: Mon, Tue, Wed, Thu, Fri, Sat, Sun
Max Weekday Session: 2 hours
Max Weekend Session: No limit
Double Days OK: Yes (any combo)
Long Session Day: Sunday
Rest Day: Saturday (has soccer game — triathlon rest)
Work Schedule: Standard hours

=== SOCCER COMMITMENT (CRITICAL) ===
- Tuesday afternoon: 2-hour soccer training session
- Thursday afternoon: 2-hour soccer training session
- Saturday: soccer game day
- Soccer counts as significant running/cardio load (~high intensity)
- On Tue/Thu: schedule triathlon in the MORNING only (before 6am or 6-8am)
- Keep Tue/Thu triathlon sessions lighter (swim or easy bike preferred — avoid hard running)
- Saturday = triathlon rest day (soccer game is enough stimulus)

=== EQUIPMENT ===
GPS/HRM Watch: GPS watch + HRM
Gym Access: Bodyweight only
Equipment Budget: None

=== HEALTH & RECOVERY ===
Current Injuries: Rolled ankle (feeling strong now — monitor, ease into run volume)
Avg Sleep: 6–7 hrs
Stress Level: High
Race Nutrition Experience: Never used
Strength Training: No

=== MOTIVATION ===
Training Preference: Mix of all
Intensity Feeling: Love them — bring it on
Training Blockers: Lack of motivation, stress, cold weather, weak mentality, soccer commitment
Motivation: Hitting a goal, feeling happy, healthy, fit, morning coffee, pastries after a long ride
Success Definition: Finishing under 5 hours comfortably

=== CALCULATED TRAINING ZONES ===
Estimated Max HR: 193 BPM (Tanaka: 208 - 0.7 × 21)
Resting HR: 42 BPM | HR Reserve: 151 BPM

Running HR Zones (Karvonen):
- Z1 Recovery: 118-133 BPM | Pace: 6:00-6:30/km
- Z2 Aerobic: 133-148 BPM | Pace: 5:15-5:30/km
- Z3 Tempo: 148-163 BPM | Pace: 4:45-5:00/km
- Z4 Threshold: 163-178 BPM | Pace: 4:20-4:35/km
- Z5 VO2max: 178-193 BPM | Pace: 3:55-4:10/km

Cycling HR Zones (Running minus 5-10 BPM):
- Z1: 110-125 BPM | Z2: 125-140 BPM | Z3: 140-155 BPM | Z4: 155-170 BPM | Z5: 170-185 BPM

Swim CSS Zones (based on ~1:55/100m threshold):
- Recovery: 2:10/100m | Aerobic: 2:03-2:09/100m | CSS: 1:52-1:58/100m | VO2max: 1:45-1:50/100m

=== 70.3 RACE TARGETS (SUB-5) ===
Swim 1.9km: 38-40 min (2:00-2:06/100m) | T1: 3 min
Bike 90km: 2:45-2:50 (31.8-32.7 km/h, Z2-low Z3) | T2: 2 min
Run 21.1km: 1:45-1:50 (5:00-5:15/km, Z2-Z3)
Total: ~4:33-4:45 (comfortable buffer under 5hrs)

=== PLAN STRUCTURE (24 weeks: March 30 - Sept 14, 2026) ===
Base 1: Weeks 1-4 (March 30 - April 26) — aerobic foundation, technique focus
  Week 4: Recovery week
Build 1: Weeks 5-8 (April 27 - May 24) — introduce threshold work, first bricks
  Week 8: Recovery week
Build 2: Weeks 9-12 (May 25 - June 21) — race-specific intensity, longer bricks
  Week 12: Recovery week
Build 3: Weeks 13-16 (June 22 - July 19) — peak volume, race simulation
  Week 16: Recovery week
Peak: Weeks 17-20 (July 20 - Aug 16) — sharpen intensity, reduce volume
  Week 20: Recovery week
Race Prep: Weeks 21-22 (Aug 17 - Aug 30) — final race-specific work
Taper: Weeks 23-24 (Aug 31 - Sept 14) — volume drops, intensity maintained, RACE DAY Sept 14`;

const designInstructions = `
DESIGN SPECIFICATIONS:
- Background: #F0E6D4, cards: #E4DAC8, hover: #DBD0BC
- Text: #1C1614, secondary: #3A2E28, tertiary: #6B5E54
- Accent: #A0522D with dim variant rgba(160,82,45,0.12)
- Border: rgba(28,22,20,0.08)
- Green: #2E7D32, Orange: #E65100, Red: #C62828
- Triathlon discipline colours: Swim #0ea5e9, Bike #22c55e, Run #f97316, Brick #a855f7
- Fonts: Google Fonts — Inter (body) + Space Grotesk (headings) loaded via <link> tags
- Material Symbols Outlined for icons
- Collapsible weeks via <details><summary>
- Badge system: badge-accent, badge-swim, badge-bike, badge-run, badge-brick, badge-red (KEY), badge-rest
- Responsive (mobile-friendly)
- Print styles that open all accordions
- All units: KM, min/km, BPM, Celsius
- Fully self-contained HTML with all CSS in a <style> tag

SESSION DETAIL REQUIREMENTS — CRITICAL:
Every session must have specific numbers. NEVER write vague sessions.

SWIM sessions must include:
- Total distance, warm-up set, main set with intervals/distances/rest/zone, cool-down, coaching note (3+ sentences)

BIKE sessions must include:
- Total duration, zone/HR targets, cadence targets, warm-up → main → cool-down, coaching note (3+ sentences)

RUN sessions must include:
- Total distance/duration, pace/zone/HR targets, warm-up → main → cool-down, coaching note (3+ sentences)

BRICK sessions must include:
- Full bike component, immediate run component, transition notes, brick legs explanation

Every day card must have:
- Day label, session name, discipline badge, RPE/zone badge, duration/distance badge
- Session structure: warm-up → main set → cool-down with exact numbers
- Coach's Note: minimum 3 sentences (WHAT, HOW, WHY)

COACHING TONE: Intermediate — technical, motivating, progress-focused. Pete is 21, athletic, loves intensity but new to triathlon.

CRITICAL SCHEDULING RULES:
- Tuesday morning: swim or easy bike ONLY (soccer training in afternoon)
- Thursday morning: swim or easy bike ONLY (soccer training in afternoon)
- Saturday: REST from triathlon (soccer game day). Show as "Active Recovery / Soccer Game"
- Sunday: LONG session day (long ride or long run or brick)
- Monday, Wednesday, Friday: main triathlon training days (can be harder sessions)
- Double days allowed on any day except Saturday`;

const coachingKnowledge = `
COACHING KNOWLEDGE:
- 80/20 intensity distribution (80-90% Z1-Z2, 10-20% Z3+)
- Base: aerobic volume + technique, Z1-Z2 only
- Build: threshold work, bricks, sport-specific
- Peak: race-specific intensity, volume reducing
- Taper: 2-3 weeks, volume -20-50%, intensity maintained
- Progressive overload max ~10%/week
- Recovery week every 4th week at 50-60% volume
- Swim: technique > volume, drill every session, CSS-based sets, sight OW
- Bike: long ride is anchor, sweet spot 88-93% FTP, cadence 90-100 RPM for tri
- Run: conservative build (+5min/week max), 80% easy, max 2 quality sessions/week
- Bricks: 2-4 in last 6 weeks, 60-90min bike → 15-30min run
- Nutrition: gut training from 40g/hr carbs, build to 60-80g/hr for race
- Recovery: aim 8+ hrs sleep, account for soccer load as training stress`;

async function streamCall(system, userMsg) {
  let text = "";
  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 64000,
    system,
    messages: [{ role: "user", content: userMsg }],
  });
  stream.on("text", (t) => { text += t; process.stdout.write("."); });
  const msg = await stream.finalMessage();
  console.log(` (${msg.usage.output_tokens} tokens)`);
  return text;
}

async function main() {
  console.log("=== Generating Pete Hamill's 70.3 Training Plan (Multi-Part) ===\n");

  // PART 1: Header, zones, how-to-use, week grid, and Weeks 1-8
  console.log("Part 1: Header + Weeks 1-8...");
  const part1 = await streamCall(
    `You are an elite endurance coach at Plan Metric creating Part 1 of a personalised HTML training plan.

OUTPUT: Return ONLY valid HTML starting with <!DOCTYPE html>. Include ALL CSS in a <style> tag. Include the complete page header structure. This is Part 1 — it will be combined with later parts.

${designInstructions}
${coachingKnowledge}`,
    `Generate Part 1 of a 24-week personalised 70.3 training plan for this athlete. This part must include:

1. Full HTML document start (<!DOCTYPE html>, <head> with all CSS, fonts, icons)
2. Sticky header with "Plan Metric" logo + Premium Plan badge
3. Hero section: Pete Hamill, Sunshine Coast 70.3, Sept 14 2026, sub-5 goal, stats row
4. Personalised Training Zones section (use the calculated zones provided)
5. How To Use This Plan (4-6 personalised instructions referencing soccer, schedule, goals)
6. Week Overview Grid (all 24 weeks with phase names and approx hours)
7. Phase banner: BASE PHASE (Weeks 1-8)
8. Complete Week 1 through Week 8 (each as <details> accordion with all 7 days detailed)
   - Week 4 and Week 8 are RECOVERY weeks (50-60% volume)
   - Every day must have full session detail as specified

DO NOT close the </body> or </html> tags — more content follows.

ATHLETE DATA:
${athleteProfile}`
  );

  // PART 2: Weeks 9-16
  console.log("\nPart 2: Weeks 9-16...");
  const part2 = await streamCall(
    `You are an elite endurance coach at Plan Metric creating Part 2 (Weeks 9-16) of a personalised HTML training plan. You are continuing an already-started HTML document.

OUTPUT: Return ONLY the HTML for weeks 9-16. No <!DOCTYPE>, no <head>, no <style> — just the section content. Start with a phase banner and the week accordions.

${designInstructions}
${coachingKnowledge}`,
    `Generate Part 2 (Weeks 9-16) of Pete Hamill's 24-week 70.3 training plan. Continue the HTML from Part 1.

Include:
1. Phase banner: BUILD PHASE 2 (Weeks 9-12)
2. Complete Weeks 9-12 (each as <details> accordion with all 7 days)
   - Week 12 is a RECOVERY week
   - Introduce brick sessions, threshold intervals, race-specific work
   - Longer swims (building toward 2km+), longer rides (3+ hours)
3. Phase banner: BUILD PHASE 3 (Weeks 13-16)
4. Complete Weeks 13-16 (each as <details> accordion with all 7 days)
   - Week 16 is a RECOVERY week
   - Peak volume weeks, race simulation bricks, open water swims
   - Building toward: 2.5km swim, 4hr ride, 18km run

Every day must have full session detail. Use the same CSS classes and HTML structure as Part 1.

SCHEDULING REMINDER:
- Tue/Thu morning: swim or easy bike only (soccer afternoon)
- Saturday: REST/soccer game
- Sunday: long session
- Mon/Wed/Fri: main training days

ATHLETE DATA:
${athleteProfile}`
  );

  // PART 3: Weeks 17-24, Race Day Protocol, Glossary, Tips, Footer
  console.log("\nPart 3: Weeks 17-24 + Race Day + Closing...");
  const part3 = await streamCall(
    `You are an elite endurance coach at Plan Metric creating Part 3 (Weeks 17-24 + Race Day Protocol + Closing sections) of a personalised HTML training plan. You are finishing an HTML document.

OUTPUT: Return ONLY the HTML for weeks 17-24 plus closing sections. No <!DOCTYPE>, no <head>, no <style>. End with </div></body></html> to close the document.

${designInstructions}
${coachingKnowledge}`,
    `Generate Part 3 (final part) of Pete Hamill's 24-week 70.3 training plan.

Include:
1. Phase banner: PEAK PHASE (Weeks 17-20)
2. Complete Weeks 17-20 (each as <details> accordion with all 7 days)
   - Week 20 is a RECOVERY week
   - Sharpen intensity, reduce volume slightly, race-pace work
   - Key bricks at race effort, open water swims
3. Phase banner: RACE PREP & TAPER (Weeks 21-24)
4. Complete Weeks 21-24 (each as <details> accordion with all 7 days)
   - Weeks 21-22: final race-specific sessions, volume reducing
   - Weeks 23-24: taper — volume drops 30-50%, maintain some intensity, lots of rest
   - Week 24 ends on Sept 14 (RACE DAY Sunday)
5. Race Day Protocol section:
   - Day-by-day race week (7 days before)
   - Pre-race morning routine
   - Swim execution: pacing 2:00-2:06/100m, sighting, drafting
   - T1 plan
   - Bike execution: 31.8-32.7 km/h, Z2-low Z3, nutrition 60-70g carbs/hr, 500-750ml fluid/hr
   - T2 plan
   - Run execution: start 5:15/km, negative split to 5:00/km, fuel every 2.5km
   - Mental cues for each discipline
   - Nutrition timeline (pre-race through run)
6. Glossary of all training terms
7. Coach Tips (6-8 tips specific to Pete's race and level)
8. Footer with Plan Metric branding + planmetric.com.au link
9. Close all open tags: </div></body></html>

SCHEDULING REMINDER:
- Tue/Thu morning: swim or easy bike only (soccer afternoon)
- Saturday: REST/soccer game
- Sunday: long session
- Mon/Wed/Fri: main training days

ATHLETE DATA:
${athleteProfile}`
  );

  // Combine parts
  console.log("\nCombining parts...");

  // Part 1 should end before </body></html> (we asked it not to close)
  // Part 2 is just middle content
  // Part 3 ends with closing tags

  // Clean up part boundaries
  let p1 = part1.replace(/```html\s*/g, "").replace(/```\s*$/g, "").trim();
  let p2 = part2.replace(/```html\s*/g, "").replace(/```\s*$/g, "").trim();
  let p3 = part3.replace(/```html\s*/g, "").replace(/```\s*$/g, "").trim();

  // Remove any accidental closing tags from part 1
  p1 = p1.replace(/<\/body>\s*<\/html>\s*$/i, "");

  // Remove any accidental opening tags from parts 2 and 3
  p2 = p2.replace(/^<!DOCTYPE[^>]*>/i, "").replace(/<html[^>]*>/i, "").replace(/<head>[\s\S]*?<\/head>/i, "").replace(/<body[^>]*>/i, "");
  p3 = p3.replace(/^<!DOCTYPE[^>]*>/i, "").replace(/<html[^>]*>/i, "").replace(/<head>[\s\S]*?<\/head>/i, "").replace(/<body[^>]*>/i, "");

  const fullHtml = p1 + "\n\n" + p2 + "\n\n" + p3;

  const outPath = "public/plans/custom/pete-hamill-703-v2.html";
  fs.writeFileSync(outPath, fullHtml, "utf8");
  console.log(`\nPlan saved to ${outPath}`);
  console.log(`Total size: ${(fullHtml.length / 1024).toFixed(1)} KB`);
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});

import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Coast Marathon 2026: The Complete Training and Pacing Guide",
  description:
    "How to train for the Gold Coast Marathon 2026 — pacing strategy by goal time, 16–20 week training structure, fuelling plan, and race day checklist for the July 5 race.",
  openGraph: {
    title: "Gold Coast Marathon 2026: Training and Pacing Guide",
    description:
      "Pacing strategy, training structure, fuelling plan, and race day checklist for the July 5 Gold Coast Marathon.",
    type: "article",
  },
  alternates: { canonical: "/blog/gold-coast-marathon-2026-guide" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const CARD_BG = "rgba(245,245,240,0.03)";
const RULE = "rgba(245,245,240,0.15)";

const paceTable = [
  { goal: "Sub 3:00", kmPace: "4:15/km", firstHalf: "4:18–4:20/km", mid: "4:15/km, fuel every 30 min", final6: "4:10–4:05/km" },
  { goal: "3:00–3:30", kmPace: "4:16–4:58/km", firstHalf: "5 sec/km slower than goal", mid: "Settle to goal pace by 10 km", final6: "Push from 36 km if feeling strong" },
  { goal: "3:30–4:00", kmPace: "4:59–5:41/km", firstHalf: "5:45–5:50/km (bank nothing)", mid: "Even effort, gel every 30–35 min", final6: "Hold pace, pick off runners" },
  { goal: "4:00–4:30", kmPace: "5:42–6:24/km", firstHalf: "6:30/km (deliberately easy)", mid: "Walk aid stations if needed, keep moving", final6: "Whatever you have left — finish strong" },
  { goal: "4:30+", kmPace: "6:24+/km", firstHalf: "Comfortable run/walk from the start", mid: "Run/walk intervals (e.g. 4 min run, 1 min walk)", final6: "Enjoy the finish — Broadwater is beautiful" },
];

const faq = [
  {
    q: "When is the Gold Coast Marathon 2026?",
    a: "The Gold Coast Marathon 2026 is on Sunday, July 5. The marathon starts at 6:00am AEST. There is also a half marathon, 10km, and 5.7km event across the weekend.",
  },
  {
    q: "Is the Gold Coast Marathon a fast course?",
    a: "Yes. The Gold Coast Marathon is one of the fastest marathon courses in Australia. It is almost entirely flat with only 30 metres of total elevation gain, run along the beachfront and Broadwater. The early morning start and typically cool July conditions (12–18°C) make it ideal for PB attempts.",
  },
  {
    q: "How long should I train for the Gold Coast Marathon?",
    a: "For a first marathon, 16–20 weeks of structured training is ideal. If you start in mid-March, that gives you roughly 16 weeks to race day on July 5. Experienced runners with an existing base can prepare in 12–14 weeks. The key phases are base building (5–6 weeks), build (5–6 weeks), peak (3–4 weeks), and taper (2–3 weeks).",
  },
  {
    q: "How many kilometres per week should I run for a marathon?",
    a: "It depends on your goal time. For sub-3:00, aim for 88–97 km per week at peak. For 3:00–3:30, target 72–88 km. For 3:30–4:00, target 56–72 km. For 4:00+ or a first marathon, 40–56 km per week at peak is sufficient. Build to these volumes gradually using the 10% weekly increase rule.",
  },
  {
    q: "What should I eat during a marathon?",
    a: "For any marathon over 3 hours, target 60–80 grams of carbohydrate per hour using products with a 2:1 glucose-to-fructose ratio. Start fuelling within the first 30 minutes — do not wait until you feel depleted. Take a gel every 30–35 minutes alongside water. Practise your exact fuelling plan during long training runs. Sodium intake of 300–700 mg per hour prevents cramping.",
  },
  {
    q: "What is the best pacing strategy for a marathon?",
    a: "Run the first half conservatively — 5 seconds per kilometre slower than your goal pace. The Gold Coast course is flat and fast, which makes it tempting to start too quick. The marathon starts at km 21 — save energy for the second half. A negative split (running the second half faster than the first) is the optimal strategy for most runners.",
  },
  {
    q: "How should I taper for the Gold Coast Marathon?",
    a: "In the final three weeks before July 5, reduce volume by 20%, then 40%, then 50% in race week. Maintain intensity — keep short, sharp efforts in your schedule to maintain leg speed. Sleep 8–10 hours per night. A proper taper produces a 2–4% performance improvement versus arriving fatigued.",
  },
];

export default function GoldCoastMarathonGuide() {
  return (
    <>
      <ArticleJsonLd
        title="Gold Coast Marathon 2026: The Complete Training and Pacing Guide"
        description="How to train for the Gold Coast Marathon 2026 — pacing, training structure, fuelling, and race day checklist for July 5."
        slug="gold-coast-marathon-2026-guide"
        datePublished="2026-04-13"
      />
      <FaqJsonLd items={faq} />
      <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
        {/* Grain */}
        <div
          className="pointer-events-none fixed inset-0 z-50"
          style={{
            opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />

        <article className="pt-40 pb-32 px-8 md:px-24">
          <div className="max-w-2xl mx-auto">
            <FadeInHero>
              <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: "#f97316", background: "rgba(249,115,22,0.10)" }}>Run</span>
                <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>10 min read</span>
              </div>
              <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
                Gold Coast Marathon 2026: the complete training and <span style={{ color: ACCENT }}>pacing</span> guide
              </h1>
            </FadeInHero>

            <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
              <FadeIn delay={0.1}>
                <p>The Gold Coast Marathon is one of the fastest marathon courses in Australia &mdash; almost entirely flat, run along the beachfront and Broadwater, with a 6:00am start in cool July conditions. It is the race where PBs happen. But only if you arrive prepared.</p>
              </FadeIn>

              <FadeIn delay={0.12}>
                <p>This guide covers everything you need for July 5: how to structure your training from now, pacing strategy by goal time, fuelling protocol, taper, and a race day checklist. Whether this is your first marathon or your tenth, the principles are the same &mdash; respect the distance, pace conservatively, and trust the preparation.</p>
              </FadeIn>

              {/* The course */}
              <FadeIn delay={0.14}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The course: why Gold Coast is fast</h2>
                <p>The Gold Coast Marathon course has approximately 30 metres of total elevation gain across 42.2 km. It is as close to pan-flat as you will find in an Australian marathon. The route runs south along the beachfront from Southport to Burleigh Heads, turns, and returns north along the Broadwater.</p>
              </FadeIn>

              <FadeIn delay={0.16}>
                <ul className="list-none space-y-3 my-6">
                  {[
                    "Start: Southport Broadwater Parklands, 6:00am AEST",
                    "Surface: sealed road, entirely flat with minor undulations near Burleigh",
                    "Elevation: ~30m total gain — negligible by marathon standards",
                    "Conditions: typically 12–18°C at start, rising to 18–22°C by finish. Low humidity in July. Occasionally windy along the beachfront",
                    "Aid stations: approximately every 3 km with water and sports drink",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: ACCENT }}>&#9654;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={0.18}>
                <p>The flat profile is a double-edged sword. It removes the excuse of hills, but it also removes the variety. Km 25&ndash;35 along the Broadwater is where most runners struggle mentally &mdash; the scenery is beautiful but repetitive, and the legs are starting to fade. Prepare for this section specifically in training.</p>
              </FadeIn>

              {/* Pacing */}
              <FadeIn delay={0.2}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Pacing strategy by goal time</h2>
                <p>The single most important decision in a marathon is what you do in the first 10 kilometres. The flat Gold Coast course, cool conditions, and race-day adrenaline will tempt you to start too fast. Resist it. The marathon begins at km 21 &mdash; everything before that is just getting into position.</p>
              </FadeIn>

              <FadeIn delay={0.22}>
                <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(245,245,240,0.04)" }}>
                        {["Goal", "Target pace", "0–21 km (first half)", "21–36 km (middle)", "36–42 km (finish)"].map((h) => (
                          <th key={h} className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paceTable.map((row, i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <td className="p-3 font-bold whitespace-nowrap" style={{ color: ACCENT }}>{row.goal}</td>
                          <td className="p-3" style={{ color: TEXT }}>{row.kmPace}</td>
                          <td className="p-3" style={{ color: DIM }}>{row.firstHalf}</td>
                          <td className="p-3" style={{ color: DIM }}>{row.mid}</td>
                          <td className="p-3" style={{ color: DIM }}>{row.final6}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm" style={{ color: DIM }}>
                  A negative split &mdash; running the second half faster than the first &mdash; is the optimal strategy for most runners. It requires discipline in the first 21 km and rewards it in the final 6.
                </p>
              </FadeIn>

              {/* Training structure */}
              <FadeIn delay={0.24}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Training structure: 16 weeks to July 5</h2>
                <p>Starting your structured training in mid-March gives you 16 weeks &mdash; enough for a properly periodised plan. If you have an existing base, this is ideal. If you are starting from lower volume, begin now and add 4 weeks of base building before the plan below.</p>
              </FadeIn>

              <FadeIn delay={0.26}>
                <div className="my-8 space-y-4">
                  {[
                    { phase: "Phase 1 — Base (Weeks 1–5)", desc: "Build weekly volume gradually using the 10% rule. All runs at Zone 1–2 (conversational pace). Long run builds from 16 km to 24 km. Two quality sessions maximum per week — one tempo (20–30 min at threshold), one easy long run. Include 2 strength sessions per week (compound lifts + plyometrics)." },
                    { phase: "Phase 2 — Build (Weeks 6–10)", desc: "Introduce race-specific work. Long run extends to 28–32 km with the final 6–8 km at marathon pace. Add one interval session per week (6–10 × 800m at 10K pace). Weekly volume reaches peak: 56–97 km depending on goal time. Recovery week at week 8 (50% volume)." },
                    { phase: "Phase 3 — Peak (Weeks 11–13)", desc: "Highest quality, not highest volume. Long run of 30–35 km (cap at 3 hours regardless of pace). Race-simulation session: 16 km at marathon pace on a flat route. Begin practising race-day fuelling during every long run. Volume begins dropping in week 13." },
                    { phase: "Phase 4 — Taper (Weeks 14–16)", desc: "Volume drops: 80% → 60% → 50% of peak. Intensity stays — keep short, sharp sessions (strides, tempo intervals) to maintain leg speed. Sleep 8–10 hours per night. Last long run of 16 km in week 14. Race week: two easy runs and a few strides. Nothing new." },
                  ].map(({ phase, desc }, i) => (
                    <div key={i} className="p-6 rounded-sm" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                      <p className="font-headline font-bold mb-2" style={{ color: ACCENT }}>{phase}</p>
                      <p className="text-sm leading-relaxed" style={{ color: DIM }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Volume by goal */}
              <FadeIn delay={0.28}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Weekly volume by goal time</h2>
                <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <table className="w-full text-sm">
                    <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Goal time</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Avg weekly km</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Peak week km</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest hidden md:table-cell" style={{ color: DIM }}>Peak long run</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ["Sub 3:00", "88–97 km", "104–112 km", "32–35 km"],
                        ["3:00–3:30", "72–88 km", "88–104 km", "30–33 km"],
                        ["3:30–4:00", "56–72 km", "72–88 km", "28–32 km"],
                        ["4:00+ / First marathon", "40–56 km", "56–72 km", "30–32 km (cap at 3 hrs)"],
                      ].map(([goal, avg, peak, longRun], i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <td className="p-3 font-bold" style={{ color: ACCENT }}>{goal}</td>
                          <td className="p-3" style={{ color: TEXT }}>{avg}</td>
                          <td className="p-3" style={{ color: DIM }}>{peak}</td>
                          <td className="p-3 hidden md:table-cell" style={{ color: DIM }}>{longRun}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm" style={{ color: DIM }}>
                  The long run should represent 25&ndash;35% of weekly volume maximum. Build to peak volume 3&ndash;4 weeks before race day, then taper.
                </p>
              </FadeIn>

              {/* Fuelling */}
              <FadeIn delay={0.3}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Fuelling: what to eat before and during the race</h2>
                <p>Glycogen depletion &mdash; hitting the wall &mdash; is the most common reason marathon performances collapse after km 30. It is entirely preventable with proper fuelling.</p>
              </FadeIn>

              <FadeIn delay={0.32}>
                <div className="my-8 space-y-4">
                  {[
                    { label: "Night before", desc: "Carbohydrate-heavy dinner — pasta, rice, or bread. Nothing new. Nothing high-fibre. This is not the time to try the hotel restaurant's experimental menu." },
                    { label: "Race morning (3–4 hours before start)", desc: "High-carb, low-fibre breakfast: oats, toast with honey, banana. Aim for 2–3 g of carbohydrate per kg of body weight. For a 70 kg runner, that's 140–210 g — roughly a large bowl of oats with banana and honey plus toast. Hydrate with 500 mL of water." },
                    { label: "During the race", desc: "Start fuelling within 30 minutes. Gel every 30–35 minutes alongside water. Target 60–80 g of carbohydrate per hour using products with a 2:1 glucose-to-fructose ratio. Add 300–700 mg of sodium per hour through electrolyte tabs or salt capsules. Practise this exact protocol in training — never use a new product on race day." },
                  ].map(({ label, desc }, i) => (
                    <div key={i} className="p-6 rounded-sm" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                      <p className="font-headline font-bold mb-2" style={{ color: ACCENT }}>{label}</p>
                      <p className="text-sm leading-relaxed" style={{ color: DIM }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.34}>
                <p>Gut training is essential. Your gut can absorb approximately 60 g/hr of glucose through one intestinal transporter, and a further 30 g/hr of fructose through a separate one. But only if you have trained it. Build from 40 g/hr to your race target over 6&ndash;7 weeks, using the specific products you will race with.</p>
              </FadeIn>

              {/* Race day checklist */}
              <FadeIn delay={0.36}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Race day checklist</h2>
              </FadeIn>

              <FadeIn delay={0.38}>
                <div className="my-6 space-y-3">
                  {[
                    ["Night before", [
                      "Carb-heavy dinner — nothing new or experimental",
                      "Lay out all race kit: bib pinned, shoes double-knotted, timing chip attached, gels taped to shorts or belt",
                      "Set two alarms. Confirm transport to Southport Broadwater Parklands",
                    ]],
                    ["Race morning (aim to arrive 60 min before gun)", [
                      "Breakfast 3–4 hours before start (3:00am alarm for a 6:00am start — this is not optional)",
                      "Hydrate with 500 mL water in the two hours before. Stop 30 minutes before",
                      "Apply anti-chafe to inner thighs, armpits, and anywhere the singlet rubs",
                      "Warm up with 10 minutes easy jogging + 4 strides. Stay warm in the corral",
                    ]],
                    ["On course", [
                      "First 10 km: 5 sec/km slower than goal pace. Trust the plan, not the crowd",
                      "Fuel from km 5: first gel at 30 min, then every 30–35 min. Water at every aid station",
                      "Km 25–35 along the Broadwater: the mental grind. Break it into 5 km blocks. Count down, not up",
                      "Final 6 km: if you paced correctly, this is where you pass people. Push when they fade",
                    ]],
                    ["Post-race", [
                      "Keep walking for 10 minutes — do not sit down immediately",
                      "20–30 g protein + carbohydrates within 30 minutes (recovery shake or real food)",
                      "Expect DOMS for 3–5 days. No quality running for 3–4 weeks post-marathon",
                    ]],
                  ].map(([section, items], i) => (
                    <div key={i} className="rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                      <div className="px-4 py-2" style={{ background: "rgba(245,245,240,0.04)" }}>
                        <span className="font-label text-[10px] font-bold uppercase tracking-widest" style={{ color: ACCENT }}>{section as string}</span>
                      </div>
                      <ul className="p-4 space-y-2">
                        {(items as string[]).map((item, j) => (
                          <li key={j} className="flex gap-3 text-sm" style={{ color: DIM }}>
                            <span style={{ color: ACCENT, flexShrink: 0 }}>&#9654;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Closing */}
              <FadeIn delay={0.4}>
                <p>The Gold Coast Marathon rewards preparation and punishes impatience. The flat course, cool conditions, and beachside scenery make it one of the best marathon experiences in Australia. But the distance does not care about scenery. Train properly, pace conservatively, fuel early and often, and arrive at the start line knowing that every session you completed in the preceding months is ready to express itself over 42.2 kilometres.</p>
              </FadeIn>

              {/* FAQ */}
              <FadeIn delay={0.42}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Frequently asked questions</h2>
                <div className="space-y-6">
                  {faq.map(({ q, a }, i) => (
                    <div key={i}>
                      <p className="font-headline font-bold mb-2" style={{ color: TEXT }}>{q}</p>
                      <p className="text-sm leading-relaxed" style={{ color: DIM }}>{a}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Related articles */}
              <FadeIn delay={0.44}>
                <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                  <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                  <div className="space-y-3">
                    <Link href="/blog/how-to-taper" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Taper Without Losing Fitness &rarr;</Link>
                    <Link href="/blog/race-week-nutrition" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>Race Week Nutrition: What to Eat Before Race Day &rarr;</Link>
                    <Link href="/blog/zone-training-complete-guide" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>Heart Rate Zone Training: The Complete Guide &rarr;</Link>
                  </div>
                </div>
              </FadeIn>

              {/* CTA */}
              <FadeIn delay={0.46} className="mt-16 pt-12">
                <div style={{ borderTop: `1px solid ${RULE}` }} className="pt-12">
                  <p className="font-headline text-xl font-bold mb-2" style={{ color: TEXT }}>
                    Train for Gold Coast with a plan built around July 5.
                  </p>
                  <p className="font-body text-sm mb-8" style={{ color: DIM }}>
                    PlanMetric builds AI-personalised marathon plans from your current fitness to your race date. From $29.99.
                  </p>
                  <Link
                    href="/intake"
                    className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
                    style={{ background: ACCENT, color: TEXT }}
                  >
                    Build my marathon plan &rarr;
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer className="w-full py-10 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-6" style={{ background: BG, borderTop: `1px solid ${CARD_BORDER}` }}>
          <span className="font-label text-[11px] tracking-[0.3em] uppercase font-bold">Plan Metric</span>
          <div className="flex gap-8">
            {[["Terms", "/terms"], ["Privacy", "/privacy"], ["Instagram", "https://www.instagram.com/planmetric"]].map(([label, href]) => (
              <Link key={label} href={href} className="font-label text-[10px] tracking-widest uppercase transition-colors duration-200 hover:text-white" style={{ color: DIM }}>{label}</Link>
            ))}
          </div>
          <span className="font-label text-[10px] tracking-widest uppercase" style={{ color: DIM }}>&copy; 2026 Plan Metric. Precision Endurance.</span>
        </footer>
      </main>
    </>
  );
}

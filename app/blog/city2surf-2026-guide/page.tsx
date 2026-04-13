import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { FaqAccordion } from "@/components/FaqAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "City2Surf 2026: The Complete Pacing and Training Guide",
  description:
    "How to pace City2Surf, survive Heartbreak Hill, and build a 17-week training plan for the August 9 race. The complete guide for Australian runners.",
  openGraph: {
    title: "City2Surf 2026: The Complete Pacing and Training Guide",
    description:
      "How to pace City2Surf, survive Heartbreak Hill, and build a 17-week training plan for the August 9 race.",
    type: "article",
  },
  alternates: { canonical: "/blog/city2surf-2026-guide" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const CARD_BG = "rgba(245,245,240,0.03)";
const RULE = "rgba(245,245,240,0.15)";

const paceTable = [
  { goal: "Sub 60 min", kmPace: "4:17/km", earlyPace: "4:27–4:32/km", hillApproach: "Effort-based, expect 4:45–5:00/km", finalFive: "4:00–4:10/km" },
  { goal: "60–75 min",  kmPace: "4:17–5:22/km", earlyPace: "5:30–5:45/km", hillApproach: "Shorten stride, arms high, no surging", finalFive: "4:50–5:10/km" },
  { goal: "75–90 min",  kmPace: "5:22–6:26/km", earlyPace: "6:35–6:50/km", hillApproach: "Run/walk intervals on steep sections fine", finalFive: "5:40–6:00/km" },
  { goal: "90 min–2 hr", kmPace: "6:26–8:34/km", earlyPace: "8:45–9:00/km", hillApproach: "Walk the steepest 600m, run the crest", finalFive: "7:00–8:00/km" },
  { goal: "2 hr+",      kmPace: "8:34+/km", earlyPace: "Comfortable walk/jog", hillApproach: "Walk as needed — enjoy it", finalFive: "Finish strong, whatever that means to you" },
];

const faq = [
  {
    q: "How long is City2Surf?",
    a: "City2Surf is 14 kilometres, running from Hyde Park in Sydney CBD to Bondi Beach. The course is net downhill but includes significant rolling terrain and a 2km climb at Heartbreak Hill around the km 8 mark.",
  },
  {
    q: "What is Heartbreak Hill in City2Surf?",
    a: "Heartbreak Hill is the name given to the climb between Rose Bay and Bellevue Hill, approximately at the km 8–10 mark of the course. It involves around 60 metres of climbing over roughly 2 kilometres. Despite its reputation, it is not extremely steep — the challenge is arriving at it already fatigued from running the earlier downhill too fast.",
  },
  {
    q: "How should I pace City2Surf?",
    a: "Start 10–15 seconds per kilometre slower than your goal pace for the first 3 kilometres. The early downhill from Hyde Park encourages athletes to run faster than planned, which depletes glycogen before Heartbreak Hill. Hold back early, maintain steady effort through the climb, and then open up for the final descent to Bondi.",
  },
  {
    q: "Is City2Surf hard for beginners?",
    a: "City2Surf is achievable for beginners with appropriate preparation. The 14km distance is manageable with 12–17 weeks of structured training. Most beginners target a 90 minute to 2.5 hour finish, which involves a mix of running and walking. The finish line at Bondi Beach makes it well worth the effort.",
  },
  {
    q: "How many people run City2Surf?",
    a: "City2Surf consistently attracts over 80,000 participants, making it one of the largest road races in the world. First held in 1971, it has been an annual Sydney institution for over 50 years.",
  },
  {
    q: "What should I eat before City2Surf?",
    a: "Have a carbohydrate-rich meal the night before — pasta, rice, or bread. On race morning, eat 2–3 hours before the start: oats, toast with nut butter, or a banana. Avoid high-fibre or high-fat foods that could cause GI distress. For a race under 90 minutes you may not need mid-race nutrition; over 90 minutes, take a gel at km 7 before the Hill.",
  },
  {
    q: "Can I walk City2Surf?",
    a: "Yes. City2Surf has no minimum pace requirement and walking is completely accepted. Many participants walk the entire course or use a run/walk strategy. The event has a generous time limit and is designed to be inclusive for all fitness levels.",
  },
  {
    q: "How far in advance should I start training for City2Surf 2026?",
    a: "For City2Surf on August 9, starting your training in mid-April gives you 17 weeks — the ideal window for a properly periodised plan. This allows 6 weeks of base building, 6 weeks of aerobic extension and race-specific work, and a 2–3 week taper to arrive at the start line fresh.",
  },
];

export default function City2SurfGuide() {
  return (
    <>
      <ArticleJsonLd
        title="City2Surf 2026: The Complete Pacing and Training Guide"
        description="How to pace City2Surf, survive Heartbreak Hill, and build a 17-week training plan for the August 9 race."
        slug="city2surf-2026-guide"
        datePublished="2026-04-12"
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

            {/* Header */}
            <FadeInHero>
              <Link
                href="/blog"
                className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white"
                style={{ color: DIM }}
              >
                &larr; Back to Journal
              </Link>
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm"
                  style={{ color: "#f97316", background: "rgba(249,115,22,0.10)" }}
                >
                  Run
                </span>
                <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>
                  8 min read
                </span>
              </div>
              <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
                City2Surf 2026: the complete pacing and{" "}
                <span style={{ color: ACCENT }}>training guide</span>
              </h1>
            </FadeInHero>

            <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>

              {/* Lead — answers query directly for AI Overviews */}
              <FadeIn delay={0.1}>
                <p>
                  City2Surf 2026 is on August 9. The race is 14 kilometres from Hyde Park in Sydney CBD to Bondi Beach — net downhill, but with a 2km climb at Heartbreak Hill around km 8. Most runners go out too fast on the early descent, arrive at the Hill already spent, and spend the final 4 kilometres surviving rather than racing. The fix is simple: start 10–15 seconds per kilometre slower than goal pace, hold steady effort through the climb, and save your legs for the final descent to Bondi. That single adjustment is the difference between a strong finish and a walk.
                </p>
              </FadeIn>

              {/* What is City2Surf */}
              <FadeIn delay={0.12}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>
                  What is City2Surf?
                </h2>
                <p>
                  City2Surf has been run annually since 1971, making it one of Australia&rsquo;s most iconic sporting events. It draws over 80,000 participants across elite, competitive, and community divisions — the largest road race in the Southern Hemisphere by entry. The course runs from Hyde Park, through Edgecliff, Rose Bay, and Bellevue Hill, finishing on Campbell Parade at Bondi Beach.
                </p>
              </FadeIn>

              <FadeIn delay={0.14}>
                <p>
                  Despite the intimidating participant count, the event is genuinely accessible. There is no minimum pace, walking is accepted throughout, and the atmosphere on the course is a fixture of the Sydney winter social calendar. Elite athletes finish in under 40 minutes. The bulk of participants cross the line between 75 minutes and 2.5 hours.
                </p>
              </FadeIn>

              {/* Course breakdown */}
              <FadeIn delay={0.16}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>
                  The course: kilometre by kilometre
                </h2>
                <p>
                  Understanding what the course actually does is the single most useful thing you can do before race day. City2Surf has a reputation as a &lsquo;downhill race&rsquo;, but that framing misses the full picture.
                </p>
              </FadeIn>

              <FadeIn delay={0.18}>
                <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(245,245,240,0.04)" }}>
                        <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Section</th>
                        <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Terrain</th>
                        <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>What to expect</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Km 0–3", "Hyde Park to Edgecliff", "Slight but consistent descent. The crowd energy and downhill gradient combine to push you faster than planned. This is where most races are lost — before they've even begun."],
                        ["Km 3–7", "Edgecliff to Rose Bay", "Rolling terrain. Nothing dramatic, but the cumulative effort starts building. This section should feel controlled and conversational."],
                        ["Km 7–9", "Rose Bay to Heartbreak Hill", "Flat approach then the hill begins. The climb is sustained, not brutal. Approximately 60m of elevation gain over 2km."],
                        ["Km 9–10", "Crest of Heartbreak Hill", "The top. Effort peaks here. Once you crest, the course opens back up downhill — this is the psychological turning point."],
                        ["Km 10–14", "Bellevue Hill to Bondi Beach", "Net downhill to the finish. This is where a well-paced runner makes time. Everything you saved in the first 7km pays out here."],
                      ].map(([section, label, desc], i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <td className="p-3 align-top" style={{ color: ACCENT }}>
                            <span className="font-label text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{section}</span>
                          </td>
                          <td className="p-3 align-top whitespace-nowrap" style={{ color: TEXT }}>{label}</td>
                          <td className="p-3 align-top" style={{ color: DIM }}>{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>

              {/* Heartbreak Hill */}
              <FadeIn delay={0.20}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>
                  Heartbreak Hill: what it actually is
                </h2>
                <p>
                  The name does more psychological damage than the hill itself. Heartbreak Hill is a consistent 2km gradient between Rose Bay and Bellevue Hill, gaining approximately 60 metres in elevation. By comparison, the Bondi to Coogee coastal walk is harder. The problem is never the hill — it is the state you arrive at it in.
                </p>
              </FadeIn>

              <FadeIn delay={0.22}>
                <p>
                  Athletes who have burned through their glycogen reserves on the early downhill arrive at km 8 in oxygen debt. The hill then tips them over the edge. Athletes who have held back arrive at the same point with glycogen stores largely intact, and the hill becomes a manageable effort rather than a crisis.
                </p>
              </FadeIn>

              <FadeIn delay={0.24}>
                <p>How to run Heartbreak Hill well:</p>
                <ul className="list-none space-y-3 my-6">
                  {[
                    "Shorten your stride before the gradient increases — do not wait until you are on the steepest section",
                    "Drive your arms actively. The upper body contributes more than most runners realise on climbs",
                    "Maintain effort, not pace. Your pace will drop on the hill — that is expected and correct",
                    "Do not look at your watch. The pace number will alarm you; the effort level is the signal to trust",
                    "Do not surge at the crest. The instinct is to accelerate once the gradient eases — wait another 200m before picking up pace",
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: ACCENT }}>&#9654;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              {/* Pacing */}
              <FadeIn delay={0.26}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>
                  Pacing strategy by goal time
                </h2>
                <p>
                  The single most important pacing decision is what you do in the first 3 kilometres. That section is net downhill, the crowd is large, adrenaline is high, and every instinct says go faster. Resist it. The table below gives target paces by finish goal.
                </p>
              </FadeIn>

              <FadeIn delay={0.28}>
                <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(245,245,240,0.04)" }}>
                        {["Goal", "Target km pace", "Km 0–3 (hold back)", "Heartbreak Hill", "Km 10–14 (finish)"].map((h) => (
                          <th key={h} className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paceTable.map((row, i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <td className="p-3 font-bold whitespace-nowrap" style={{ color: ACCENT }}>{row.goal}</td>
                          <td className="p-3" style={{ color: TEXT }}>{row.kmPace}</td>
                          <td className="p-3" style={{ color: DIM }}>{row.earlyPace}</td>
                          <td className="p-3" style={{ color: DIM }}>{row.hillApproach}</td>
                          <td className="p-3" style={{ color: DIM }}>{row.finalFive}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm" style={{ color: DIM }}>
                  Paces calculated for 14km. &lsquo;Km 0–3&rsquo; recommendation is 10–15 sec/km slower than goal pace to account for downhill excitement and early fatigue management.
                </p>
              </FadeIn>

              {/* Training plan */}
              <FadeIn delay={0.30}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>
                  Your 17-week training plan
                </h2>
                <p>
                  City2Surf 2026 is on August 9. Starting your structured training in mid-April gives you 17 weeks — the ideal window for a properly periodised plan that builds fitness without arriving at the start line fatigued.
                </p>
              </FadeIn>

              <FadeIn delay={0.32}>
                <p>
                  A well-structured City2Surf training block follows four phases:
                </p>

                <div className="my-8 space-y-4">
                  {[
                    { phase: "Phase 1 — Base (Weeks 1–5)", desc: "Low intensity, building weekly volume gradually. The goal is establishing aerobic base and consistent habits without accumulating fatigue. Most sessions should feel almost embarrassingly easy — Zone 2, conversational pace. Long run builds from 8–12km." },
                    { phase: "Phase 2 — Build (Weeks 6–10)", desc: "Aerobic extension. Long run builds to 15–18km. One quality session per week introduced — tempo intervals, progression runs, or hill repeats. This is where race-specific fitness develops." },
                    { phase: "Phase 3 — Race-Specific (Weeks 11–14)", desc: "Simulate race conditions. Practice goal-pace running, include Heartbreak Hill-style climb sessions, and run the full 14km at least once. This phase builds confidence alongside fitness." },
                    { phase: "Phase 4 — Taper (Weeks 15–17)", desc: "Volume drops 30–40% while intensity stays. Legs freshen, glycogen stores refill, and the nervous system recovers. A proper taper produces a 2–4% performance improvement versus arriving fatigued." },
                  ].map(({ phase, desc }, i) => (
                    <div key={i} className="p-6 rounded-sm" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                      <p className="font-headline font-bold mb-2" style={{ color: ACCENT }}>{phase}</p>
                      <p className="text-sm leading-relaxed" style={{ color: DIM }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.34}>
                <p>
                  The single most common mistake in City2Surf preparation is the absence of a real taper. Runners train through to two weeks before the race, arrive tired, and underperform relative to their fitness. Trust the process: three weeks of reduced volume before August 9 is not lost fitness — it is the fitness expressing itself.
                </p>
              </FadeIn>

              {/* Race day checklist */}
              <FadeIn delay={0.36}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>
                  Race day checklist
                </h2>
              </FadeIn>

              <FadeIn delay={0.38}>
                <div className="my-6 space-y-3">
                  {[
                    ["Night before", [
                      "Carbohydrate-heavy dinner — pasta, rice, or bread. Nothing new or experimental.",
                      "Lay out all race kit. Bib pinned, shoes double-knotted, timing chip attached.",
                      "Set two alarms. Confirm transport to Hyde Park start area.",
                    ]],
                    ["Race morning (aim to be at start 45–60 min early)", [
                      "Breakfast 2–3 hours before gun: oats, toast, banana. Avoid high-fibre and high-fat.",
                      "Hydrate with 500ml water in the two hours before start. Stop 30 minutes before.",
                      "Warm up with 5–10 minutes of easy walking and dynamic stretching — do not stand still in the corral.",
                    ]],
                    ["On course", [
                      "Start 10–15 sec/km slower than goal pace for the first 3km. Trust the plan.",
                      "Drink at every water station (approximately every 3km) — small sips, not large volumes.",
                      "For runs over 90 minutes: take a gel at km 7, before Heartbreak Hill — not after.",
                      "On the Hill: maintain effort, not pace. Shorten stride, drive arms.",
                    ]],
                    ["Post-race", [
                      "Do not sit down immediately — keep walking for 5–10 minutes to clear lactate.",
                      "Consume 20–25g protein and carbohydrates within 30 minutes of finishing.",
                      "Ice legs or compression if available. Expect DOMS for 48–72 hours.",
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

              {/* FAQ — structured for AI Overviews */}
              <FadeIn delay={0.40}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>
                  Frequently asked questions
                </h2>
              </FadeIn>

              <FadeIn delay={0.42}>
                <FaqAccordion items={faq} />
              </FadeIn>

              {/* Closing */}
              <FadeIn delay={0.44}>
                <p>
                  City2Surf rewards preparation. Not extreme preparation &mdash; consistent, structured, specific preparation. The athletes who cross the Bondi finish line feeling strong are almost always the ones who started in April, followed a proper plan, and had the discipline to start slower than their instincts told them to on race day.
                </p>
              </FadeIn>

              {/* Related articles */}
              <FadeIn delay={0.45}>
                <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                  <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                  <div className="space-y-3">
                    <Link href="/blog/how-to-taper" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Taper Without Losing Fitness &rarr;</Link>
                    <Link href="/blog/race-week-nutrition" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>Race Week Nutrition: What to Eat Before Race Day &rarr;</Link>
                    <Link href="/blog/heart-rate-zones" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Read Your Heart Rate Zones &rarr;</Link>
                  </div>
                </div>
              </FadeIn>

              {/* CTA */}
              <FadeIn delay={0.46} className="mt-16 pt-12">
                <div style={{ borderTop: `1px solid ${RULE}` }} className="pt-12">
                  <p className="font-headline text-xl font-bold mb-2" style={{ color: TEXT }}>
                    Train for City2Surf with a plan built around August 9.
                  </p>
                  <p className="font-body text-sm mb-8" style={{ color: DIM }}>
                    PlanMetric builds AI-personalised training plans for Australian runners — from your current fitness to your race date. From $29.99.
                  </p>
                  <Link
                    href="/intake"
                    className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
                    style={{ background: ACCENT, color: TEXT }}
                  >
                    Build my City2Surf plan &rarr;
                  </Link>
                </div>
              </FadeIn>

            </div>
          </div>
        </article>

        {/* Footer */}
        <footer
          className="w-full py-10 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ background: BG, borderTop: `1px solid ${CARD_BORDER}` }}
        >
          <span className="font-label text-[11px] tracking-[0.3em] uppercase font-bold">Plan Metric</span>
          <div className="flex gap-8">
            {[
              ["Terms", "/terms"],
              ["Privacy", "/privacy"],
              ["Instagram", "https://www.instagram.com/planmetric"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="font-label text-[10px] tracking-widest uppercase transition-colors duration-200 hover:text-white"
                style={{ color: DIM }}
              >
                {label}
              </Link>
            ))}
          </div>
          <span className="font-label text-[10px] tracking-widest uppercase" style={{ color: DIM }}>
            &copy; 2026 Plan Metric. Precision Endurance.
          </span>
        </footer>
      </main>
    </>
  );
}

import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Many Weeks Does It Take to Train for a Marathon?",
  description:
    "Find out how many weeks you need to train for a marathon based on your experience level and goal time. Covers periodisation phases, weekly volume, and how to structure your build from base to race day.",
  openGraph: {
    title: "How Many Weeks Does It Take to Train for a Marathon?",
    description:
      "A research-backed guide to marathon training timelines — how long to train, what each phase looks like, and how to structure weekly volume by goal time.",
    type: "article",
  },
  alternates: { canonical: "/blog/marathon-training-weeks" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const CARD_BG = "rgba(245,245,240,0.03)";
const RULE = "rgba(245,245,240,0.15)";

const faq = [
  {
    q: "How many weeks does it take to train for a marathon?",
    a: "Most runners need 16 to 20 weeks of structured training to prepare for a marathon. First-time marathoners should aim for the longer end of that range. Experienced runners with a solid aerobic base can prepare in as few as 12 to 14 weeks.",
  },
  {
    q: "Can you train for a marathon in 12 weeks?",
    a: "Yes, if you already have a strong running base of at least 40 km per week. A 12-week plan compresses the base phase and moves quickly into build and peak work. It is not recommended for first-time marathon runners.",
  },
  {
    q: "How many km per week should I run for a marathon?",
    a: "Peak weekly volume depends on your goal time. First-time runners targeting 4:00 or slower should peak at 56 to 72 km per week. Sub-3:30 runners typically peak at 88 to 104 km. Sub-3:00 runners may reach 104 to 112 km in their highest week.",
  },
  {
    q: "What does a marathon training week look like?",
    a: "A typical marathon week includes one long run (25 to 35% of weekly volume), two quality sessions (intervals and tempo), and three to four easy runs in Zone 1 to Zone 2. About 80% of total volume should be at easy, conversational effort.",
  },
  {
    q: "How long should the taper be before a marathon?",
    a: "The standard marathon taper is three weeks. Volume reduces by roughly 20% in the first week, 40% in the second, and 50% in race week. Intensity stays the same throughout the taper to keep your legs sharp.",
  },
];

export default function MarathonTrainingWeeksArticle() {
  return (
    <>
    <ArticleJsonLd title="How Many Weeks Does It Take to Train for a Marathon?" description="Find out how many weeks you need to train for a marathon based on your experience level and goal time." slug="marathon-training-weeks" datePublished="2026-05-12" />
    <FaqJsonLd items={faq} />
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
      {/* Grain */}
      <div className="pointer-events-none fixed inset-0 z-50" style={{ opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

      <article className="pt-40 pb-32 px-8 md:px-24">
        <div className="max-w-2xl mx-auto">
          <FadeInHero>
            <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: "#f97316", background: "rgba(249,115,22,0.10)" }}>Run</span>
              <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>10 min read</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
              How many weeks does it take to train for a <span style={{ color: ACCENT }}>marathon</span>?
            </h1>
          </FadeInHero>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <FadeIn delay={0.1}>
              <p>The short answer is 16 to 20 weeks. The real answer depends on where you are starting from, how fast you want to run, and whether you have the aerobic base to support a compressed timeline. A first-time marathoner with three months of consistent running behind them needs a different plan to an experienced runner chasing a sub-3:00 personal best. The training duration stays roughly the same, but the structure, intensity, and weekly volume change significantly.</p>
              <p className="mt-4">This guide breaks down the four phases of marathon preparation, how long each one takes, what weekly volume looks like at different goal times, and how to structure the key sessions that actually build marathon fitness. If you are trying to figure out when to start training for your next race, this is the framework.</p>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The four phases of marathon training</h2>
              <p>Every well-structured marathon plan follows four distinct phases: base, build, peak, and taper. The proportion of time spent in each phase follows a consistent pattern regardless of whether your plan is 12 weeks or 24 weeks long.</p>

              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Phase</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>% of plan</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>16-wk plan</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>20-wk plan</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Focus</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Base", "30%", "5 weeks", "6 weeks", "Z1\u2013Z2 aerobic volume, technique drills"],
                      ["Build", "35%", "5\u20136 weeks", "7 weeks", "Threshold + race-specific sessions"],
                      ["Peak", "20%", "3 weeks", "4 weeks", "Race simulations, sharpening"],
                      ["Taper", "15%", "2\u20133 weeks", "3 weeks", "Volume down 20\u201350%, intensity maintained"],
                    ].map(([phase, pct, short, long, focus], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{phase}</td>
                        <td className="p-3" style={{ color: DIM }}>{pct}</td>
                        <td className="p-3" style={{ color: DIM }}>{short}</td>
                        <td className="p-3" style={{ color: DIM }}>{long}</td>
                        <td className="p-3" style={{ color: DIM }}>{focus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>For shorter plans of 8 to 12 weeks, the base phase compresses to 3 to 4 weeks, the build phase to 3 to 4 weeks, and the combined peak and taper window to 2 to 3 weeks. This only works if you already have a strong aerobic foundation &mdash; at least 6 months of consistent running at 40+ km per week.</p>
            </FadeIn>

            <FadeIn delay={0.14}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>What happens in each phase</h2>
              <p><strong style={{ color: TEXT }}>Base (weeks 1&ndash;6).</strong> The entire purpose of the base phase is building your aerobic engine. Every run sits in Zone 1 or Zone 2 &mdash; fully conversational, no racing. This is where you establish the weekly volume pattern, build connective tissue resilience, and develop the metabolic foundation that supports everything that comes later. Include technique drills (strides, cadence work) but no hard sessions. If you skip or rush the base phase, the build phase breaks you.</p>
              <p className="mt-4"><strong style={{ color: TEXT }}>Build (weeks 7&ndash;13).</strong> This is where the marathon-specific work begins. You introduce <Link href="/blog/zone-training-complete-guide" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>threshold sessions</Link> and race-pace efforts. The intensity split shifts to roughly 65% easy and 35% quality work, with a maximum of two quality sessions per week. Volume continues to climb, but now with purpose &mdash; the long run extends toward 30 to 35 km, and tempo runs at marathon goal pace become a weekly fixture. One or two lower-priority races (a parkrun or 10K) provide race simulation without disrupting the training block.</p>
              <p className="mt-4"><strong style={{ color: TEXT }}>Peak (weeks 14&ndash;17).</strong> Race simulations every 3 to 4 days. Sessions get progressively shorter but more intense. Your highest volume week falls 3 to 4 weeks before race day, and then volume starts to come down. This is the phase where you prove to yourself that you can hold marathon pace for extended periods. It is also the phase where overtraining risk is highest &mdash; recovery weeks are non-negotiable.</p>
              <p className="mt-4"><strong style={{ color: TEXT }}>Taper (final 2&ndash;3 weeks).</strong> Volume drops by 20% in the first taper week, 40% in the second, and 50% in race week. Intensity stays the same &mdash; you still run at threshold pace, you just do less of it. Short, fast strides in race week keep your legs responsive without adding fatigue. Read our full guide on <Link href="/blog/how-to-taper" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>how to taper before race day</Link> for the detailed protocol.</p>
            </FadeIn>

            <FadeIn delay={0.16}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Weekly volume by goal time</h2>
              <p>How many kilometres you run per week matters more than how many weeks you train. The table below shows peak weekly volume ranges for common marathon goal times, along with the peak week volume you should expect in the highest-volume week of your plan.</p>

              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Goal time</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Avg peak volume</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Peak week</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Long run cap</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Sub 3:00", "88\u201397 km/wk", "104\u2013112 km", "32\u201335 km"],
                      ["3:00\u20133:30", "72\u201388 km/wk", "88\u2013104 km", "30\u201333 km"],
                      ["3:30\u20134:00", "56\u201372 km/wk", "72\u201388 km", "28\u201332 km"],
                      ["4:00+ / First-timer", "40\u201356 km/wk", "56\u201372 km", "30\u201332 km"],
                    ].map(([goal, avg, peak, longRun], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{goal}</td>
                        <td className="p-3" style={{ color: DIM }}>{avg}</td>
                        <td className="p-3" style={{ color: DIM }}>{peak}</td>
                        <td className="p-3" style={{ color: DIM }}>{longRun}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>Your long run should never exceed 25 to 35% of your total weekly volume and should be capped at roughly 3 to 3.5 hours regardless of distance. Running longer than this in training adds disproportionate fatigue for diminishing returns.</p>
            </FadeIn>

            <FadeIn delay={0.18}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The 10% rule and recovery weeks</h2>
              <p>Volume should increase by no more than 10% per week. This is the most reliable guardrail against overuse injuries. Every third or fourth week is a cutback week at 60 to 70% of the previous week&rsquo;s volume. If you are over 45, take a cutback every third week rather than every fourth.</p>
              <p className="mt-4">Recovery weeks are not optional. They are where adaptation happens. Your body does not get stronger during hard training &mdash; it gets stronger during the recovery that follows. Skipping cutback weeks during the build and peak phases is the single most common reason <Link href="/blog/why-training-plans-fail" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>training plans fail</Link>.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The key sessions every marathon runner needs</h2>
              <p>Regardless of your goal time, a well-structured marathon week revolves around four session types. The remaining days are filled with easy Zone 1 to Zone 2 runs. About <Link href="/blog/heart-rate-zones" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>80% of your training</Link> should be at easy, conversational effort.</p>

              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Session</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Intensity</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Example</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Intervals (VO2max)", "5K race pace", "6\u201310 x 400m with 90s recovery"],
                      ["Tempo / hills", "Threshold (comfortably hard)", "20\u201340 min sustained tempo run"],
                      ["Race-effort run", "Controlled 5K effort", "Parkrun or time trial"],
                      ["Long run", "Z1\u2013Z2 (conversational)", "70 min to 3 hrs, building weekly"],
                    ].map(([session, intensity, example], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{session}</td>
                        <td className="p-3" style={{ color: DIM }}>{intensity}</td>
                        <td className="p-3" style={{ color: DIM }}>{example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>Limit yourself to two quality sessions per week. More than that and the cumulative fatigue compromises your long run and your easy days &mdash; which is where the majority of your aerobic development happens.</p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Training paces: how to set them</h2>
              <p>Your training paces should be derived from a recent 5K or 10K time, not from your marathon goal pace. Here is how the key paces relate to your marathon goal:</p>
              <ul className="mt-4 space-y-2">
                <li><strong style={{ color: TEXT }}>Easy run:</strong> 60 to 75 sec/km slower than marathon goal pace</li>
                <li><strong style={{ color: TEXT }}>Long run:</strong> 30 to 60 sec/km slower than marathon goal pace</li>
                <li><strong style={{ color: TEXT }}>Threshold:</strong> 10 to 15 sec/km slower than marathon goal pace</li>
                <li><strong style={{ color: TEXT }}>Interval:</strong> 5K race pace</li>
              </ul>
              <p className="mt-4">If you are targeting a 4:00 marathon (5:41/km pace), your easy runs should be at roughly 6:20 to 6:55/km. Most runners make the mistake of running their easy days too fast, which erodes recovery and undermines the quality of their hard sessions.</p>
            </FadeIn>

            <FadeIn delay={0.24}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Race day pacing strategy</h2>
              <p>The optimal marathon pacing strategy is the negative split: run the second half slightly faster than the first. The discipline required to hold back in the opening kilometres is what separates runners who finish strong from runners who hit the wall at 32 km.</p>
              <ul className="mt-4 space-y-2">
                <li><strong style={{ color: TEXT }}>0&ndash;21 km:</strong> Stick to the slower side of your target pace. Bank nothing.</li>
                <li><strong style={{ color: TEXT }}>21&ndash;36 km:</strong> If feeling good, pick up by 5 sec/km maximum.</li>
                <li><strong style={{ color: TEXT }}>Final 6 km:</strong> Push harder, tick off each kilometre marker.</li>
              </ul>
              <p className="mt-4">Fuelling during the race is equally critical. Take a gel every 30 to 35 minutes, targeting 60g of carbohydrates per hour. Practise this in your long runs during the build phase &mdash; race day is not the time to try a new fuelling strategy.</p>
            </FadeIn>

            <FadeIn delay={0.26}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>After the marathon: what comes next</h2>
              <p>Allow 3 to 4 weeks of recovery before returning to any structured training. The first two weeks should be walking and very easy jogging only. Your body needs time to repair the muscle damage from 42.2 km of sustained effort. Rushing back is the fastest path to injury and burnout.</p>
              <p className="mt-4">When you do return, start at 50% of your pre-marathon volume and rebuild gradually. The aerobic fitness you built does not disappear in a month. It is the connective tissue, joints, and immune system that need the recovery time.</p>
            </FadeIn>

            <FadeIn delay={0.28}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>How Plan Metric builds your timeline</h2>
              <p>Every Plan Metric marathon plan is built from your purchase date to your race date &mdash; not a preset 12 or 16-week block. The plan automatically calculates how many weeks you have, allocates the correct proportion to each phase, and scales weekly volume to your current fitness level and goal time. Recovery weeks, taper timing, and session progression are all individualised.</p>
              <p className="mt-4">Whether you have 10 weeks or 24 weeks until race day, the plan adapts. That is the difference between a generic training template and a <Link href="/plans" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>personalised training plan</Link>.</p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                <div className="space-y-3">
                  <Link href="/blog/how-to-taper" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Taper Before Race Day Without Losing Fitness &rarr;</Link>
                  <Link href="/blog/gold-coast-marathon-2026-guide" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>Gold Coast Marathon 2026: The Complete Training and Pacing Guide &rarr;</Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.32} className="mt-16 pt-12">
              <div style={{ borderTop: `1px solid ${RULE}` }} className="pt-12">
                <p className="font-headline text-xl font-bold mb-4">Ready to start your marathon build?</p>
                <p className="mb-6" style={{ color: DIM }}>Tell us your race date, goal time, and current fitness. We will build the plan.</p>
                <Link href="/plans" className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]" style={{ background: ACCENT, color: TEXT }}>
                  View our plans &rarr;
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </article>

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

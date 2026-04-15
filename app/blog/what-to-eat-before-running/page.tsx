import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Should I Eat Before a Run? Pre-Run Nutrition Guide",
  description: "Pre-run nutrition guide covering meal timing, what to eat before easy runs, hard sessions and long runs, hydration protocol, fasted running, and foods to avoid.",
  openGraph: {
    title: "What Should I Eat Before a Run? Pre-Run Nutrition Guide",
    description: "Pre-run nutrition guide: meal timing, foods by run type, hydration protocol, fasted running, and what to avoid.",
    type: "article",
  },
  alternates: { canonical: "/blog/what-to-eat-before-running" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

const faq = [
  {
    q: "Can I run on an empty stomach?",
    a: "Fasted running is safe for easy runs under 60 minutes and can improve fat adaptation over time. However, it is not suitable for high-intensity sessions like intervals or tempo runs, where glycogen is the primary fuel source. Limit fasted runs to one or two per week and always prioritise post-run nutrition to support recovery.",
  },
  {
    q: "What should I eat before a morning run?",
    a: "Aim for 30-50 g of carbohydrate from quick-digesting sources 15-30 minutes before you head out. A banana, a slice of toast with honey, or a rice cake with jam are all reliable options. If you have 60-90 minutes before your run, a small bowl of oatmeal gives more sustained energy. For easy runs under 60 minutes, running fasted is also an option.",
  },
  {
    q: "What foods should I avoid before running?",
    a: "High-fibre foods like beans, lentils, broccoli and bran cereals can cause bloating and cramping. High-fat foods such as fried items, bacon and heavy cream slow gastric emptying. Common GI triggers include dairy for lactose-sensitive runners, spicy foods, sugar alcohols, and carbonated drinks. As a rule, avoid anything you have not tested before a training run.",
  },
  {
    q: "How much water should I drink before a run?",
    a: "Drink 500-600 mL of water or an electrolyte drink 2-4 hours before your run, then 250-300 mL in the 30-60 minutes before you start. Aim for pale yellow urine as a hydration indicator. For long or intense sessions, consider an electrolyte preload of 500 mL with a strong electrolyte mix about 90 minutes before.",
  },
  {
    q: "How long before a run should I eat?",
    a: "The ideal window depends on the size of the meal. A full meal with carbs, protein and some fat needs 2-3 hours to digest. A lighter snack of simple carbs needs about 60 minutes. A very small snack like a banana or energy gel can be eaten 15-30 minutes before. The closer to your run, the simpler the food should be.",
  },
];

export default function WhatToEatBeforeRunningArticle() {
  return (
    <>
    <ArticleJsonLd title="What Should I Eat Before a Run? Pre-Run Nutrition Guide" description="Pre-run nutrition guide: meal timing, foods by run type, hydration protocol, fasted running, and what to avoid." slug="what-to-eat-before-running" datePublished="2026-05-12" />
    <FaqJsonLd items={faq} />
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
      <div className="pointer-events-none fixed inset-0 z-50" style={{ opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

      <article className="pt-40 pb-32 px-8 md:px-24">
        <div className="max-w-2xl mx-auto">
          <FadeInHero>
            <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: "#f97316", background: "rgba(249,115,22,0.10)" }}>Nutrition</span>
              <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>8 min read</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
              What should I eat before a <span style={{ color: ACCENT }}>run</span>?
            </h1>
          </FadeInHero>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <FadeIn delay={0.1}>
              <p>What you eat before a run has a direct effect on how you feel during it. Get it right and you have steady energy, a settled stomach, and enough fuel to finish strong. Get it wrong and you spend the session battling nausea, cramps, or that heavy-legged feeling that comes from either too much food or not enough.</p>
              <p className="mt-4">The challenge is that pre-run nutrition is not one-size-fits-all. What works before an easy 30-minute jog is different from what works before a two-hour long run. Timing matters. Food choice matters. And your individual gut tolerance matters most of all. This guide covers what the research says &mdash; and how to apply it to your own training.</p>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Meal timing: when to eat relative to your run</h2>
              <p>The single most important variable in pre-run nutrition is timing. Eat too close to your run and the food sits heavy. Eat too far out and the energy has come and gone. The general principle is simple: the closer you are to your run, the smaller and simpler the food should be.</p>

              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Window</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Goal</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>What to eat</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Examples</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["2-3 hrs", "Sustained energy", "High carbs, moderate protein, low fat/fibre", "Oatmeal with banana, toast with eggs, bagel with cream cheese"],
                      ["1 hr", "Top up glycogen", "Simple, quickly digestible carbs", "Toast with honey or jam, banana, applesauce"],
                      ["30 min", "Fast energy boost", "Light, liquid or simple carbs", "Banana, pretzels, sports drink, energy gel"],
                    ].map(([window, goal, what, examples], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{window}</td>
                        <td className="p-3" style={{ color: DIM }}>{goal}</td>
                        <td className="p-3" style={{ color: DIM }}>{what}</td>
                        <td className="p-3" style={{ color: DIM }}>{examples}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>The two-to-three-hour window is where most runners do best with their main pre-run meal. It gives enough time for gastric emptying while still providing usable energy. If you are a morning runner who cannot eat that far in advance, the 30-60 minute window with a smaller snack is the practical alternative.</p>
            </FadeIn>

            <FadeIn delay={0.14}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>What to eat by run type</h2>
              <p>Not every run demands the same fuelling strategy. An easy recovery jog needs far less preparation than a threshold session or a 25 km long run. Matching your pre-run nutrition to the intensity and duration of the session is the difference between feeling sharp and feeling flat.</p>

              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Run type</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Timing</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Best options</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Easy run (<60 min)", "15-30 min before", "Banana, toast with jam, or skip entirely"],
                      ["Hard session (intervals, tempo)", "60-90 min before", "White toast with jam, energy gel, oatmeal"],
                      ["Long run (>90 min)", "90-120 min before", "Oatmeal with fruit, bagel with peanut butter"],
                    ].map(([type, timing, options], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{type}</td>
                        <td className="p-3" style={{ color: DIM }}>{timing}</td>
                        <td className="p-3" style={{ color: DIM }}>{options}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>For hard sessions &mdash; intervals, tempo runs, threshold work &mdash; you need glycogen available from the start. These sessions rely heavily on carbohydrate as fuel, and starting under-fuelled means you cannot hit the paces that make the session effective. Eat 60&ndash;90 minutes beforehand and keep it carb-dominant with minimal fat and fibre.</p>
              <p className="mt-4">Long runs require the most deliberate fuelling. Your goal is to start with full glycogen stores, which means eating a more substantial meal further out. Oatmeal with banana or a bagel with peanut butter and honey gives a good blend of complex and simple carbohydrates. A personalised <Link href="/plans" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>training plan</Link> will specify the intensity of each session, making it easier to match your nutrition to the work.</p>
            </FadeIn>

            <FadeIn delay={0.16}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The morning runner&apos;s playbook</h2>
              <p>Morning runners face a specific challenge: limited time between waking and running. You cannot eat a full meal two hours before a 6 am run unless you are willing to set an alarm at 4 am. The solution is to work within the shorter windows.</p>
              <p className="mt-4">Target 30&ndash;50 g of carbohydrate from quick-digesting sources. A banana delivers roughly 25&ndash;30 g. A slice of toast with honey or jam adds another 20&ndash;25 g. A rice cake with a thin spread of jam is another lightweight option. These can be eaten 15&ndash;30 minutes before heading out without causing GI issues for most runners.</p>
              <p className="mt-4">If you have 60&ndash;90 minutes before your run &mdash; common on weekends or later morning starts &mdash; a small bowl of oatmeal provides more sustained energy. For hard sessions, adding raisins, dates, or a small serving of pretzels increases the carbohydrate load.</p>
              <p className="mt-4">Coffee is a natural pairing for many morning runners. Caffeine improves perceived effort and can enhance performance, particularly for harder sessions. If your stomach handles it, a coffee alongside your pre-run snack is a proven combination.</p>
            </FadeIn>

            <FadeIn delay={0.18}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Fasted running: when it works and when it does not</h2>
              <p>Running without eating first is safe for easy runs under 60 minutes. During low-intensity exercise, the body draws more heavily on fat as a fuel source, and fasted running can encourage this fat adaptation over time. Some runners also prefer it for the convenience and the absence of any GI risk.</p>
              <p className="mt-4">The benefits are real but modest: improved fat metabolism, reduced GI distress, and simplicity. The risks are also real: reduced performance at higher intensities, potential muscle breakdown if done too frequently, and elevated cortisol levels. Fasted running is not suitable for intervals, tempo runs, or any session where pace matters.</p>
              <p className="mt-4">If you include fasted runs in your programme, limit them to one or two per week. Always prioritise post-run nutrition &mdash; the window after a fasted run is when your body most needs fuel for recovery. Do not run fasted if you are prone to low blood sugar, are pregnant, or are recovering from injury.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Foods to avoid before running</h2>
              <p>Some foods are reliably problematic before a run, regardless of how well you tolerate them at rest. The issue is almost always one of three things: slow gastric emptying, gas production, or osmotic load in the gut.</p>

              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Category</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Why</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Examples</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["High fibre", "Gas, bloating, cramping", "Beans, lentils, broccoli, cauliflower, bran cereals, raw vegetables, dried fruit"],
                      ["High fat", "Slow gastric emptying", "Fried foods, bacon, sausage, heavy cream, large amounts of nuts"],
                      ["GI triggers", "Osmotic stress, irritation", "Dairy (if lactose-sensitive), spicy foods, sugar alcohols, carbonated drinks"],
                      ["Stimulants in excess", "Anxiety, urgency, dehydration", "Excessive caffeine, alcohol"],
                    ].map(([cat, why, examples], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{cat}</td>
                        <td className="p-3" style={{ color: DIM }}>{why}</td>
                        <td className="p-3" style={{ color: DIM }}>{examples}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>The most common mistake is eating foods that are healthy in a general sense &mdash; salads, whole grains, legumes &mdash; but poorly suited to the 60&ndash;90 minutes before a run. Pre-run nutrition is one of the few times when simple, low-fibre, low-fat foods are the better choice. Save the broccoli for dinner.</p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Pre-run hydration protocol</h2>
              <p>Hydration is at least as important as food. Starting a run even mildly dehydrated affects performance, thermoregulation, and perceived effort. But overhydration carries its own risk &mdash; hyponatraemia, or dangerously low blood sodium &mdash; so the goal is measured, not maximal.</p>

              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Window</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Volume</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Notes</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["2-4 hrs before", "500-600 mL", "Water or electrolyte drink"],
                      ["30-60 min before", "250-300 mL", "Small sips, not a large bolus"],
                      ["Long/intense (preload)", "500 mL strong electrolyte mix", "90 min before, supports sodium balance"],
                    ].map(([window, vol, notes], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{window}</td>
                        <td className="p-3" style={{ color: DIM }}>{vol}</td>
                        <td className="p-3" style={{ color: DIM }}>{notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>Use urine colour as your simplest hydration indicator: aim for pale yellow. Clear urine often indicates overhydration. Dark yellow suggests you need more fluid. For long runs and intense sessions in warm conditions, an electrolyte preload 90 minutes before the session helps maintain sodium balance and can reduce the risk of cramping.</p>
            </FadeIn>

            <FadeIn delay={0.24}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Putting it together: a practical framework</h2>
              <p>Pre-run nutrition does not need to be complicated. Start with three principles and refine from there.</p>
              <p className="mt-4"><strong style={{ color: TEXT }}>Match the fuel to the session.</strong> Easy runs need minimal preparation. Hard sessions need carbohydrate-dominant fuel with enough lead time. Long runs need the most deliberate approach &mdash; a proper meal 90&ndash;120 minutes out, plus hydration.</p>
              <p className="mt-4"><strong style={{ color: TEXT }}>Test everything in training.</strong> Never eat something new before a race or a key session. Your pre-run nutrition should be a rehearsed routine, not a guess. If toast with honey works for your Tuesday tempo, use it for your Saturday race.</p>
              <p className="mt-4"><strong style={{ color: TEXT }}>Listen to your gut &mdash; literally.</strong> General guidelines are a starting point. Some runners handle oatmeal 45 minutes before a run with no issues. Others need two full hours. Track what works and what does not, and build your own pre-run protocol over time.</p>
              <p className="mt-4">The goal is to arrive at every run &mdash; whether it is an easy 5 km or a <Link href="/blog/half-marathon-training-plan" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>half marathon</Link> &mdash; with enough energy to do the work, a settled stomach, and confidence in your routine. Nutrition is not a separate concern from training. It is part of the training.</p>
            </FadeIn>

            <FadeIn delay={0.26}>
              <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                <div className="space-y-3">
                  <Link href="/blog/race-week-nutrition" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>What to Eat the Week Before a Triathlon &rarr;</Link>
                  <Link href="/blog/avoid-running-injury" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Avoid Running Injuries &rarr;</Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.28} className="mt-16 pt-12">
              <div style={{ borderTop: `1px solid ${RULE}` }} className="pt-12">
                <p className="font-headline text-xl font-bold mb-4">Ready to train smarter?</p>
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

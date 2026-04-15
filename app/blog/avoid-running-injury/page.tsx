import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Do I Avoid Injury When Running? A Coach's Prevention Guide",
  description: "Learn evidence-based strategies to prevent running injuries: strength training, load management, footwear rotation, sleep, and when to push through pain safely.",
  openGraph: {
    title: "How Do I Avoid Injury When Running? A Coach's Prevention Guide",
    description: "Evidence-based injury prevention for runners of all levels: load management, strength training, recovery priorities, and return-to-running protocols.",
    type: "article",
  },
  alternates: { canonical: "/blog/avoid-running-injury" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

const faq = [
  {
    q: "What is the most common running injury?",
    a: "The most common running injuries are muscle strains, lower-limb tendinopathies (especially Achilles tendinopathy), and bone stress injuries. These are overwhelmingly caused by training load errors rather than biomechanical faults. Managing weekly volume increases, rotating training surfaces, and prioritising recovery are the most effective prevention strategies.",
  },
  {
    q: "How much should I increase my running each week?",
    a: "Follow the 10% rule: increase total weekly running volume by no more than 10% from one week to the next. For run duration specifically, add a maximum of 5 minutes per week. Bodies absorb load changes of roughly 10% per week, and exceeding this threshold significantly raises injury risk.",
  },
  {
    q: "Does stretching prevent running injuries?",
    a: "Research shows no evidence that stretching prevents running injuries. Recovery priorities should be ordered as sleep first, then nutrition, then stress management, then training consistency. Strength training twice per week has far more supporting evidence for injury prevention than any stretching routine.",
  },
  {
    q: "How often should runners do strength training?",
    a: "Runners should strength train twice per week during the base phase, focusing on heavy compound movements at 80% or more of one-rep max combined with plyometrics. Key exercises include single-leg squats, Romanian deadlifts, glute bridges, planks, dead bugs, and banded clamshells for hip stability. Hip stability work offers the highest injury prevention return on investment.",
  },
  {
    q: "Should I run through pain or stop?",
    a: "It depends on the type of pain. For tendon issues with no history of bone stress injury, you may continue training through stable pain rated 1 to 5 out of 10, provided symptoms settle by the next morning. For any suspected bone stress injury, the pain tolerance is extremely narrow: 0 to 1 out of 10 maximum. If in doubt, err on the side of caution and consult a sports physiotherapist.",
  },
];

export default function AvoidRunningInjuryArticle() {
  return (
    <>
    <ArticleJsonLd title="How Do I Avoid Injury When Running? A Coach's Prevention Guide" description="Evidence-based injury prevention for runners of all levels: load management, strength training, recovery priorities, and return-to-running protocols." slug="avoid-running-injury" datePublished="2026-05-06" />
    <FaqJsonLd items={faq} />
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
      <div className="pointer-events-none fixed inset-0 z-50" style={{ opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

      <article className="pt-40 pb-32 px-8 md:px-24">
        <div className="max-w-2xl mx-auto">
          <FadeInHero>
            <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: "#f97316", background: "rgba(249,115,22,0.10)" }}>Run</span>
              <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>9 min read</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
              How do I avoid <span style={{ color: ACCENT }}>injury</span> when running?
            </h1>
          </FadeInHero>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <FadeIn delay={0.1}>
              <p>Running injuries are not random. They follow patterns, and those patterns are overwhelmingly driven by training load errors rather than biomechanical faults. The most common injuries runners face &mdash; muscle strains, lower-limb tendinopathies (especially Achilles), and bone stress injuries &mdash; share a common thread: the body was asked to absorb more load than it was prepared for, at a time when it lacked the resources to adapt.</p>
              <p className="mt-4">The good news is that most running injuries are preventable. Not with a single magic exercise or the right pair of shoes, but with a systematic approach to how you build load, how you recover, and how you listen to the signals your body sends before things break down.</p>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Manage your training load</h2>
              <p>The single greatest predictor of running injury is training load error. This means doing too much, too soon, or doing high-intensity work when your body is not ready for it. The <strong>10% rule</strong> is the most widely validated guideline: never increase total weekly volume by more than 10% from one week to the next. For running specifically, that translates to adding a maximum of 5 minutes per week of total run time.</p>
              <p className="mt-4">But volume is only half the equation. High-intensity sessions &mdash; threshold runs, intervals, hill repeats &mdash; demand elevated physical readiness. If you are under-slept, under-fuelled, or carrying residual fatigue from the previous session, an intense workout becomes a risk multiplier rather than a training stimulus. Never schedule back-to-back hard sessions. Separate quality days with easy running or complete rest.</p>
            </FadeIn>

            <FadeIn delay={0.14}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Build in deload weeks</h2>
              <p>Planned volume reductions are not optional &mdash; they are where adaptation actually consolidates. Every fourth week should be a deload week at 50&ndash;60% of your normal training volume. If you are over 45, consider deloading every third week instead. During deload weeks, maintain your easy sessions but drop all hard or long efforts. These weeks are not lost fitness. They are where your body converts training stress into lasting physiological change.</p>
              <p className="mt-4">Many runners skip deload weeks because they feel good. That is precisely when deloads matter most &mdash; before accumulated fatigue catches up with you. A <Link href="/blog/why-training-plans-fail" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>well-structured training plan</Link> builds deloads into the schedule so you never have to decide whether to take one.</p>
            </FadeIn>

            <FadeIn delay={0.16}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Strength training: the minimum effective dose</h2>
              <p>Strength training is the single most effective intervention for running injury prevention, and most runners either skip it entirely or do it wrong. The evidence points to a specific combination: heavy compound movements at 80% or more of your one-rep max, combined with plyometric exercises for bone health and tendon resilience.</p>
              <p className="mt-4">Aim for two sessions per week during your base phase. You do not need to spend an hour in the gym. The key exercises are:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Single-leg squats</strong> and <strong>Romanian deadlifts</strong> &mdash; build unilateral strength that directly transfers to running</li>
                <li><strong>Glute bridges</strong> and <strong>banded clamshells</strong> &mdash; hip stability, which delivers the highest injury prevention return of any exercise category</li>
                <li><strong>Planks</strong> and <strong>dead bugs</strong> &mdash; core stability to maintain running posture under fatigue</li>
                <li><strong>Plyometrics</strong> (box jumps, single-leg hops) &mdash; bone loading that strengthens the skeletal system against stress fractures</li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.18}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Running form that reduces injury risk</h2>
              <p>You do not need a complete biomechanical overhaul to reduce injury risk. Focus on a few key principles: run tall with a slight forward lean from the ankles (roughly 8&ndash;10 degrees), aim for a midfoot strike, and land with your foot underneath your hips rather than out in front. Overstriding &mdash; landing with your foot well ahead of your centre of mass &mdash; increases braking forces and is strongly associated with tibial stress fractures and knee injuries.</p>
              <p className="mt-4"><strong>Cadence</strong> is a useful proxy for good mechanics. A cadence of 170&ndash;180 steps per minute reduces ground contact forces and vertical oscillation compared to lower cadences. You do not need to force a specific number, but if you are running at 150&ndash;160 spm, a gradual increase of 5% over several weeks can meaningfully reduce impact loading.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Rotate surfaces and footwear</h2>
              <p>Running on the same surface every day creates repetitive loading patterns that stress the same tissues in the same way, session after session. Rotate between treadmill, road, and soft terrain (grass, trails, gravel paths). Each surface loads your musculoskeletal system slightly differently, building more robust adaptation across a wider range of tissues.</p>
              <p className="mt-4">The same principle applies to shoes. Rotating between two or three different pairs of running shoes &mdash; varying in drop, cushioning, and support &mdash; encourages varied movement patterns and reduces the risk of overuse injuries tied to a single shoe geometry. Consistent treadmill-only running can develop muscular imbalances over time, so make sure outdoor sessions are a regular part of your week. Outdoor running also provides superior bone-loading stimulus compared to the treadmill.</p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Recovery priorities: what actually matters</h2>
              <p>There is a widespread belief that stretching prevents running injuries. The research does not support this. What the evidence does support, in order of importance, is:</p>

              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Priority</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Intervention</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Target</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["1", "Sleep", "8\u20139 hours per night. HRV is suppressed with poor sleep \u2014 reduce intensity on those days."],
                      ["2", "Nutrition", "Adequate energy availability. Under-fuelling is a critical pathway to bone stress injuries."],
                      ["3", "Stress management", "Life stress, work pressure, and hormonal disruptions all elevate injury risk."],
                      ["4", "Consistency", "Regular, moderate training beats sporadic high-volume blocks."],
                      ["5", "Strength training", "2x per week \u2014 compound lifts + plyometrics (see above)."],
                    ].map(([num, intervention, target], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{num}</td>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{intervention}</td>
                        <td className="p-3" style={{ color: DIM }}>{target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>Notice what is not on the list: stretching, foam rolling, compression garments, ice baths. None of these have robust evidence for injury prevention. They may feel good, and that has value, but they should not displace the interventions that actually move the needle.</p>
            </FadeIn>

            <FadeIn delay={0.24}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The readiness framework: know when to back off</h2>
              <p>Not every scheduled session should be executed as written. A readiness framework helps you make daily decisions about training intensity. If you are under-fuelled, sleep-deprived, or carrying unusual life stress, the appropriate response is to pivot to low-intensity work rather than pushing through a hard session that your body cannot absorb.</p>
              <p className="mt-4">Heart rate variability (HRV) is one objective measure of readiness. When HRV is suppressed compared to your baseline, it is a signal that your autonomic nervous system has not fully recovered. On those days, swap threshold work for an easy Zone 1&ndash;2 run. The session still counts &mdash; easy running builds aerobic capacity &mdash; but you avoid the compounding risk of high intensity on a compromised system. Understanding your <Link href="/blog/heart-rate-zones" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>heart rate zones</Link> makes this decision straightforward.</p>
            </FadeIn>

            <FadeIn delay={0.26}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>When pain appears: a decision framework</h2>
              <p>Pain during running is not automatically a signal to stop, but the type of pain matters enormously.</p>
              <p className="mt-4"><strong>Tendon issues</strong> (with no history of bone stress injury): you may continue training through stable pain rated 1&ndash;5 out of 10, provided symptoms settle by the next morning and are not progressively worsening week to week. Tendons often need controlled loading to recover &mdash; complete rest can actually delay healing.</p>
              <p className="mt-4"><strong>Suspected bone stress injury</strong>: the pain tolerance is extremely narrow. If pain exceeds 0&ndash;1 out of 10 during weight-bearing activity, stop and seek imaging. Bone stress injuries that are caught early heal in weeks. Those that are ignored can become full fractures requiring months of recovery.</p>
            </FadeIn>

            <FadeIn delay={0.28}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Returning to running after a bone stress injury</h2>
              <p>If you have experienced a bone stress injury, a structured return-to-running protocol prevents recurrence. Do not resume running until you can complete 45&ndash;60 minutes of brisk walking on rolling terrain with zero pain. Then follow this graduated progression:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Begin with 1 minute running, 4 minutes walking, repeated in cycles</li>
                <li>Repeat each level 2&ndash;3 times before advancing</li>
                <li>Schedule sessions non-consecutively &mdash; 3 days per week maximum</li>
                <li>Monitor pain at every session: any pain above 0&ndash;1 out of 10 means you drop back to the previous level</li>
              </ul>
              <p className="mt-4">This process is slow by design. The goal is to rebuild bone density and tissue tolerance without retriggering the injury. Patience at this stage saves months of frustration later.</p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Energy availability: the overlooked injury driver</h2>
              <p>Under-fuelling is one of the most common and most preventable causes of bone stress injury, particularly in female runners. When energy intake chronically falls below what training demands, the body down-regulates bone remodelling, hormonal function, and immune response. The result is an athlete who feels fine in training but whose skeletal system is quietly deteriorating.</p>
              <p className="mt-4">This is not about weight management. It is about matching energy intake to energy expenditure. Runners who increase volume need to increase fuelling in parallel. If you are experiencing recurring injuries, persistent fatigue, or disrupted menstrual cycles, inadequate energy availability should be the first thing you investigate.</p>
            </FadeIn>

            <FadeIn delay={0.32}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The injury prevention checklist</h2>

              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Category</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Action</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Load", "Max 10% weekly volume increase (5 min/week for running)"],
                      ["Load", "Never back-to-back hard sessions"],
                      ["Load", "Deload every 4th week (every 3rd if over 45)"],
                      ["Strength", "2x per week: compound lifts + plyometrics"],
                      ["Strength", "Prioritise hip stability (banded clamshells, single-leg work)"],
                      ["Form", "170\u2013180 spm cadence, midfoot strike, land under hips"],
                      ["Surface", "Rotate treadmill, road, and soft terrain"],
                      ["Footwear", "Rotate 2\u20133 pairs with different drop and cushioning"],
                      ["Recovery", "8\u20139 hours sleep per night"],
                      ["Nutrition", "Match energy intake to training expenditure"],
                      ["Readiness", "Reduce intensity when HRV is suppressed or sleep is poor"],
                    ].map(([cat, action], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{cat}</td>
                        <td className="p-3" style={{ color: DIM }}>{action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>

            <FadeIn delay={0.34}>
              <p>Running injuries are frustrating, but they are rarely mysterious. They follow predictable patterns driven by load errors, recovery deficits, and energy imbalances. Address these systematically and you remove the vast majority of injury risk before it materialises. The best injury is the one you never get &mdash; and a <Link href="/plans" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>personalised training plan</Link> that manages load, builds in deloads, and adapts to your readiness is the most reliable way to stay healthy and keep running.</p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                <div className="space-y-3">
                  <Link href="/blog/how-to-taper" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Taper Before Race Day Without Losing Fitness &rarr;</Link>
                  <Link href="/blog/why-training-plans-fail" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>Why Most Training Plans Fail &rarr;</Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.36} className="mt-16 pt-12">
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

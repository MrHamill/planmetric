import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Do I Train for a Half Marathon from Scratch? A 12-Week Plan",
  description:
    "A complete 12-week half marathon training plan for beginners. Learn how to build from zero to 21.1 km with weekly schedules, pacing strategy, and strength work.",
  openGraph: {
    title: "How Do I Train for a Half Marathon from Scratch?",
    description:
      "A complete 12-week half marathon training plan for beginners — weekly schedules, pacing strategy, key sessions, and strength work.",
    type: "article",
  },
  alternates: { canonical: "/blog/half-marathon-training-plan" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

const faq = [
  {
    q: "How many days a week should I run to train for a half marathon?",
    a: "Beginners should run 3 to 4 days per week. This allows enough stimulus to build endurance while giving your body adequate recovery time between sessions. As fitness improves, you can add a fourth or fifth day, but rest days are non-negotiable.",
  },
  {
    q: "How long does it take to train for a half marathon from scratch?",
    a: "Most beginner programs run for 12 weeks. If you have no running base at all, a 16-week build with a 4-week pre-training block of walk-run sessions is safer. Plan Metric personalises this timeline based on your current fitness and race date.",
  },
  {
    q: "What is the longest run before a half marathon?",
    a: "Your longest training run should reach 17 to 18 km, typically around weeks 9 to 11 of a 12-week program. You do not need to run the full 21.1 km in training. Race day adrenaline, tapering, and crowd support will carry you the remaining distance.",
  },
  {
    q: "Can I walk during a half marathon?",
    a: "Yes. Run-walk strategies are legitimate and widely used. Many first-time half marathon runners use intervals of 4 minutes running and 1 minute walking throughout the race. This reduces muscular fatigue and often results in a faster overall finish time than attempting to run continuously.",
  },
  {
    q: "Do I need to do strength training for a half marathon?",
    a: "Strength training significantly reduces injury risk and improves running economy. Two sessions per week focusing on single-leg squats, Romanian deadlifts, glute bridges, and planks is sufficient. Keep strength work in the base phase and reduce it as race day approaches.",
  },
];

export default function HalfMarathonTrainingPlanArticle() {
  return (
    <>
      <ArticleJsonLd
        title="How Do I Train for a Half Marathon from Scratch? A 12-Week Plan"
        description="A complete 12-week half marathon training plan for beginners — weekly schedules, pacing strategy, key sessions, and strength work."
        slug="half-marathon-training-plan"
        datePublished="2026-05-09"
      />
      <FaqJsonLd items={faq} />
      <main
        style={{ background: BG, color: TEXT }}
        className="-mt-[72px] relative"
      >
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
                  style={{
                    color: "#f97316",
                    background: "rgba(249,115,22,0.10)",
                  }}
                >
                  Run
                </span>
                <span
                  className="font-label text-[10px] uppercase tracking-widest"
                  style={{ color: DIM }}
                >
                  10 min read
                </span>
              </div>
              <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
                How do I train for a half marathon from{" "}
                <span style={{ color: ACCENT }}>scratch</span>?
              </h1>
            </FadeInHero>

            <div
              className="space-y-8 font-body text-base leading-relaxed"
              style={{ color: "rgba(245,245,240,0.8)" }}
            >
              <FadeIn delay={0.1}>
                <p>
                  The half marathon is the fastest-growing race distance in the
                  world, and for good reason. At 21.1 km it is long enough to
                  require genuine endurance preparation but short enough that a
                  complete beginner can reach the start line in 12 weeks. You do
                  not need a running background. You do not need expensive gear.
                  You need a structured plan, consistency, and the discipline to
                  run slowly most of the time.
                </p>
                <p className="mt-4">
                  This guide covers everything you need to go from zero to
                  21.1&nbsp;km &mdash; weekly structure, session types,
                  progression, pacing, strength work, and the taper. If you have
                  never run before, start here. If you have been running casually
                  and want to formalise your training, this will give you the
                  framework.
                </p>
              </FadeIn>

              <FadeIn delay={0.12}>
                <h2
                  className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12"
                  style={{ color: TEXT }}
                >
                  The 12-week structure
                </h2>
                <p>
                  A beginner half marathon plan breaks into four distinct phases.
                  Each phase has a specific purpose, and skipping one
                  compromises the next. The periodisation split for a half
                  marathon is roughly 30% base, 30% build, 25% peak, and 15%
                  taper.
                </p>

                <div
                  className="my-8 rounded-sm overflow-hidden"
                  style={{ border: `1px solid ${CARD_BORDER}` }}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(245,245,240,0.04)" }}>
                        <th
                          className="p-3 text-left font-label text-[10px] uppercase tracking-widest"
                          style={{ color: DIM }}
                        >
                          Phase
                        </th>
                        <th
                          className="p-3 text-left font-label text-[10px] uppercase tracking-widest"
                          style={{ color: DIM }}
                        >
                          Weeks
                        </th>
                        <th
                          className="p-3 text-left font-label text-[10px] uppercase tracking-widest"
                          style={{ color: DIM }}
                        >
                          Weekly Volume
                        </th>
                        <th
                          className="p-3 text-left font-label text-[10px] uppercase tracking-widest"
                          style={{ color: DIM }}
                        >
                          Focus
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "Base",
                          "1\u20134",
                          "15\u201325 km",
                          "Aerobic endurance, easy running, build long run from 8\u201310 km",
                        ],
                        [
                          "Build",
                          "5\u20138",
                          "25\u201335 km",
                          "Introduce tempo runs and short intervals, long run to 15 km",
                        ],
                        [
                          "Peak",
                          "9\u201311",
                          "30\u201340 km",
                          "Longest runs (17\u201318 km), race-pace segments, peak fitness",
                        ],
                        [
                          "Taper",
                          "12",
                          "15\u201320 km",
                          "Volume drops 50\u201360%, intensity maintained, race preparation",
                        ],
                      ].map(([phase, weeks, vol, focus], i) => (
                        <tr
                          key={i}
                          style={{ borderTop: `1px solid ${CARD_BORDER}` }}
                        >
                          <td
                            className="p-3 font-medium"
                            style={{ color: TEXT }}
                          >
                            {phase}
                          </td>
                          <td className="p-3" style={{ color: DIM }}>
                            {weeks}
                          </td>
                          <td className="p-3" style={{ color: DIM }}>
                            {vol}
                          </td>
                          <td className="p-3" style={{ color: DIM }}>
                            {focus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>

              <FadeIn delay={0.14}>
                <h2
                  className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12"
                  style={{ color: TEXT }}
                >
                  The 80/20 rule: run slow to race fast
                </h2>
                <p>
                  The single most important principle for beginner runners is
                  intensity distribution. Roughly 80% of your weekly running
                  should be at an easy, conversational pace &mdash; a pace where
                  you could hold a full sentence without gasping. The remaining
                  20% is where the faster, harder work lives. Most beginners
                  make the mistake of running every session at a moderate effort,
                  which is too hard to recover from and too slow to build speed.
                  The result is fatigue without meaningful adaptation.
                </p>
                <p className="mt-4">
                  Easy running builds your aerobic engine: capillary density,
                  mitochondrial function, fat oxidation, and cardiac stroke
                  volume. These adaptations happen at low intensity, not high.
                  If you want to understand how{" "}
                  <Link
                    href="/blog/heart-rate-zones"
                    className="transition-colors hover:text-white"
                    style={{ color: ACCENT }}
                  >
                    heart rate zones
                  </Link>{" "}
                  govern this process, Zone 2 is where you will spend most of
                  your time.
                </p>
              </FadeIn>

              <FadeIn delay={0.16}>
                <h2
                  className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12"
                  style={{ color: TEXT }}
                >
                  A sample beginner week
                </h2>
                <p>
                  Here is what a typical training week looks like during the
                  build phase (weeks 5&ndash;8) for a beginner running 4 days
                  per week. This structure keeps the long run on Sunday, spaces
                  hard efforts apart, and protects at least two full rest days.
                </p>

                <div
                  className="my-8 rounded-sm overflow-hidden"
                  style={{ border: `1px solid ${CARD_BORDER}` }}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(245,245,240,0.04)" }}>
                        <th
                          className="p-3 text-left font-label text-[10px] uppercase tracking-widest"
                          style={{ color: DIM }}
                        >
                          Day
                        </th>
                        <th
                          className="p-3 text-left font-label text-[10px] uppercase tracking-widest"
                          style={{ color: DIM }}
                        >
                          Session
                        </th>
                        <th
                          className="p-3 text-left font-label text-[10px] uppercase tracking-widest"
                          style={{ color: DIM }}
                        >
                          Duration / Distance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Monday", "Rest", "\u2014"],
                        ["Tuesday", "Easy run", "30\u201335 min"],
                        ["Wednesday", "Strength training", "40 min"],
                        ["Thursday", "Tempo run", "25\u201330 min (incl. warm-up/cool-down)"],
                        ["Friday", "Rest", "\u2014"],
                        ["Saturday", "Easy run", "25\u201330 min"],
                        ["Sunday", "Long slow run", "10\u201314 km"],
                      ].map(([day, session, dur], i) => (
                        <tr
                          key={i}
                          style={{ borderTop: `1px solid ${CARD_BORDER}` }}
                        >
                          <td
                            className="p-3 font-medium"
                            style={{ color: TEXT }}
                          >
                            {day}
                          </td>
                          <td className="p-3" style={{ color: DIM }}>
                            {session}
                          </td>
                          <td className="p-3" style={{ color: DIM }}>
                            {dur}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>

              <FadeIn delay={0.18}>
                <h2
                  className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12"
                  style={{ color: TEXT }}
                >
                  The long run: your most important session
                </h2>
                <p>
                  The long run is the cornerstone of half marathon training. It
                  teaches your body to burn fat efficiently, strengthens tendons
                  and ligaments, and builds the mental resilience needed to hold
                  pace when fatigue sets in. In the base phase, your long run
                  starts at 8&ndash;10 km. Each week, add 1&ndash;2 km. By
                  weeks 9&ndash;11 your longest run should reach 17&ndash;18 km.
                </p>
                <p className="mt-4">
                  You do not need to run 21.1 km before race day. Running the
                  full distance in training adds unnecessary fatigue and injury
                  risk without meaningful physiological benefit. The long run
                  should be run at a comfortable, conversational pace &mdash;
                  slower than your target race pace. If you cannot talk in full
                  sentences, you are running too fast.
                </p>
                <p className="mt-4">
                  Follow the 10% rule: never increase total weekly volume by
                  more than 10% from one week to the next. Every third or fourth
                  week, reduce volume by 20&ndash;30% for a recovery week. This
                  pattern &mdash; build, build, deload &mdash; prevents overuse
                  injuries and allows your body to consolidate the training
                  stimulus.
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h2
                  className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12"
                  style={{ color: TEXT }}
                >
                  Key sessions beyond the long run
                </h2>
                <p>
                  <strong style={{ color: TEXT }}>Tempo runs.</strong> Introduced
                  from week 5, a tempo run is 20&ndash;30 minutes at a
                  &ldquo;comfortably hard&rdquo; effort &mdash; roughly your
                  lactate threshold pace. You should be able to speak in short
                  phrases but not hold a conversation. For beginners who
                  cannot sustain threshold pace continuously, break it into
                  intervals: 6 x 5 minutes at threshold pace with 60&ndash;90
                  seconds easy jogging recovery. This delivers the same
                  physiological benefit with less psychological strain.
                </p>
                <p className="mt-4">
                  <strong style={{ color: TEXT }}>Short intervals.</strong> From
                  week 6 or 7, add one session of short repeats &mdash; 6&ndash;8
                  x 400 m at a hard but controlled effort with equal rest. These
                  improve running economy and neuromuscular coordination. Keep
                  the total volume of fast running modest: 2&ndash;3 km of
                  interval work per session is plenty for a beginner.
                </p>
                <p className="mt-4">
                  <strong style={{ color: TEXT }}>Hill repeats.</strong> An
                  alternative to flat threshold work that builds strength and
                  power. Find a moderate gradient and run 10 x 2 minutes uphill
                  at 7&ndash;8 out of 10 perceived effort, jogging back down for
                  recovery. Hill work reduces impact forces compared to flat
                  speed work, making it a safer option for newer runners.
                </p>
              </FadeIn>

              <FadeIn delay={0.22}>
                <h2
                  className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12"
                  style={{ color: TEXT }}
                >
                  Strength training for runners
                </h2>
                <p>
                  Two strength sessions per week during the base and build
                  phases reduce injury risk and improve running economy. You do
                  not need a gym &mdash; bodyweight and minimal equipment are
                  sufficient. Focus on four key exercises:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    <strong style={{ color: TEXT }}>Single-leg squats</strong>{" "}
                    &mdash; builds the unilateral leg strength that running
                    demands
                  </li>
                  <li>
                    <strong style={{ color: TEXT }}>
                      Romanian deadlifts
                    </strong>{" "}
                    &mdash; strengthens the posterior chain (hamstrings, glutes,
                    lower back)
                  </li>
                  <li>
                    <strong style={{ color: TEXT }}>Glute bridges</strong>{" "}
                    &mdash; activates the glutes, which are the primary power
                    source for running
                  </li>
                  <li>
                    <strong style={{ color: TEXT }}>Planks</strong> &mdash;
                    core stability prevents energy leaking through trunk
                    rotation
                  </li>
                </ul>
                <p className="mt-4">
                  As you enter the peak and taper phases, reduce strength work
                  to one session per week, then drop it entirely in race week.
                  The goal of strength training is injury prevention and
                  efficiency &mdash; not muscle building.
                </p>
              </FadeIn>

              <FadeIn delay={0.24}>
                <h2
                  className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12"
                  style={{ color: TEXT }}
                >
                  Race day pacing: the three-section strategy
                </h2>
                <p>
                  The biggest mistake first-time half marathon runners make is
                  starting too fast. The adrenaline of race day, the crowd, and
                  the fresh legs from your taper conspire to push you out 15&ndash;20
                  seconds per kilometre faster than your training pace. This
                  debt catches up around the 14 km mark, and the final 7 km
                  becomes a survival exercise.
                </p>
                <p className="mt-4">
                  Break the race into three 7 km sections. The first 7 km
                  should feel easy &mdash; deliberately hold back and run at
                  target pace or slightly slower. The second 7 km is where
                  fatigue begins to build &mdash; focus on maintaining pace and
                  staying relaxed. The final 7 km is where you race. If you have
                  managed the first two sections well, you will have energy to
                  increase pace across the entire final section, not just a
                  desperate sprint in the last kilometre.
                </p>
              </FadeIn>

              <FadeIn delay={0.26}>
                <h2
                  className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12"
                  style={{ color: TEXT }}
                >
                  The taper: less is more
                </h2>
                <p>
                  The final week of your plan is the{" "}
                  <Link
                    href="/blog/how-to-taper"
                    className="transition-colors hover:text-white"
                    style={{ color: ACCENT }}
                  >
                    taper
                  </Link>
                  . Reduce total volume by 50&ndash;60% compared to your peak
                  week. Your long run drops to 8&ndash;10 km. Easy runs shorten
                  to 20&ndash;25 minutes. You keep one short session with
                  strides at race pace to stay sharp, but overall training load
                  drops significantly.
                </p>
                <p className="mt-4">
                  This is where many runners lose discipline. The taper feels
                  wrong &mdash; you will feel sluggish, heavy, and anxious about
                  losing fitness. You are not losing fitness. Your body is
                  consolidating 11 weeks of adaptation, repairing micro-damage,
                  and topping up glycogen stores. Trust the process.
                </p>
              </FadeIn>

              <FadeIn delay={0.28}>
                <h2
                  className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12"
                  style={{ color: TEXT }}
                >
                  Common mistakes to avoid
                </h2>
                <p>
                  <strong style={{ color: TEXT }}>
                    Running every session at the same pace.
                  </strong>{" "}
                  Easy days should be genuinely easy. Hard days should be hard.
                  The moderate middle ground builds fatigue without building
                  fitness. This is why most{" "}
                  <Link
                    href="/blog/why-training-plans-fail"
                    className="transition-colors hover:text-white"
                    style={{ color: ACCENT }}
                  >
                    generic training plans fail
                  </Link>
                  .
                </p>
                <p className="mt-4">
                  <strong style={{ color: TEXT }}>
                    Skipping rest days.
                  </strong>{" "}
                  Beginners need at least two full rest days per week. Adaptation
                  happens during recovery, not during the run itself. More is
                  not better &mdash; more recovery is better.
                </p>
                <p className="mt-4">
                  <strong style={{ color: TEXT }}>
                    Ignoring the 10% rule.
                  </strong>{" "}
                  Jumping from 20 km to 30 km in a single week is how stress
                  fractures and tendon injuries happen. Patience in the early
                  weeks pays off in the later ones.
                </p>
                <p className="mt-4">
                  <strong style={{ color: TEXT }}>
                    New shoes on race day.
                  </strong>{" "}
                  Train in the shoes you will race in. Break them in over at
                  least 3&ndash;4 weeks of running before the race.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <h2
                  className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12"
                  style={{ color: TEXT }}
                >
                  When a generic plan is not enough
                </h2>
                <p>
                  A 12-week template gives you the structure. But every runner is
                  different &mdash; your training history, injury history,
                  available days, and race date all influence what the ideal plan
                  looks like. A plan that runs from your purchase date to your
                  exact race date, adapts to your current fitness level, and
                  accounts for your schedule will always outperform a static
                  template.
                </p>
                <p className="mt-4">
                  That is what{" "}
                  <Link
                    href="/plans"
                    className="transition-colors hover:text-white"
                    style={{ color: ACCENT }}
                  >
                    Plan Metric
                  </Link>{" "}
                  builds. Every plan is personalised to your exact timeline,
                  calibrated to your zones, and structured around the days you
                  can actually train. No two plans are the same.
                </p>
              </FadeIn>

              <FadeIn delay={0.32}>
                <div
                  className="mt-12 pt-8"
                  style={{ borderTop: `1px solid ${RULE}` }}
                >
                  <p
                    className="font-label text-[10px] font-bold uppercase tracking-widest mb-4"
                    style={{ color: DIM }}
                  >
                    Keep reading
                  </p>
                  <div className="space-y-3">
                    <Link
                      href="/blog/how-to-taper"
                      className="block font-body text-sm transition-colors hover:text-white"
                      style={{ color: ACCENT }}
                    >
                      How to Taper Before Race Day Without Losing Fitness
                      &rarr;
                    </Link>
                    <Link
                      href="/blog/heart-rate-zones"
                      className="block font-body text-sm transition-colors hover:text-white"
                      style={{ color: ACCENT }}
                    >
                      How to Read Your Heart Rate Zones &rarr;
                    </Link>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.34} className="mt-16 pt-12">
                <div
                  style={{ borderTop: `1px solid ${RULE}` }}
                  className="pt-12"
                >
                  <p className="font-headline text-xl font-bold mb-4">
                    Ready to train smarter?
                  </p>
                  <Link
                    href="/plans"
                    className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
                    style={{ background: ACCENT, color: TEXT }}
                  >
                    View our plans &rarr;
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </article>

        <footer
          className="w-full py-10 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ background: BG, borderTop: `1px solid ${CARD_BORDER}` }}
        >
          <span className="font-label text-[11px] tracking-[0.3em] uppercase font-bold">
            Plan Metric
          </span>
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
          <span
            className="font-label text-[10px] tracking-widest uppercase"
            style={{ color: DIM }}
          >
            &copy; 2026 Plan Metric. Precision Endurance.
          </span>
        </footer>
      </main>
    </>
  );
}

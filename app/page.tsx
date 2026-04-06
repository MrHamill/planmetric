"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ─── Palette ────────────────────────────────────────────────── */
const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BG = "rgba(245,245,240,0.03)";
const CARD_BORDER = "rgba(245,245,240,0.10)";

/* ─── B&W image style ────────────────────────────────────────── */
const bwImg: React.CSSProperties = {
  filter: "grayscale(100%)",
  objectFit: "cover" as const,
  width: "100%",
  height: "100%",
  position: "absolute" as const,
  inset: 0,
};

/* ─── Reusable animation presets ─────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const heroIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

/* ─── Hero headline data ─────────────────────────────────────── */
const HERO_LINES: { word: string; accent?: boolean }[][] = [
  [{ word: "Train" }, { word: "with" }],
  [{ word: "data.", accent: true }, { word: "Race" }, { word: "with" }],
  [{ word: "confidence." }],
];

/* ─── Steps data ──────────────────────────────────────────────── */
const STEPS = [
  {
    num: "01",
    title: "Pick Your Plan",
    body: "Choose your discipline and level \u2014 Running, Triathlon, or Cycling.",
  },
  {
    num: "02",
    title: "Complete Your Intake",
    body: "An 8\u201310 minute deep-dive into your fitness, goals, schedule, and injury history.",
  },
  {
    num: "03",
    title: "Receive Your Plan",
    body: "Within 48 hours, your personalised HTML plan lands in your inbox. No PDFs. No spreadsheets.",
  },
  {
    num: "04",
    title: "Execute the Race",
    body: "Show up to race day with a plan built for exactly you \u2014 and nothing left to chance.",
  },
];

/* ─── Plan cards data ─────────────────────────────────────────── */
const PLANS = [
  {
    name: "STARTER",
    price: "$29.99",
    freq: "one-time",
    body: "Pre-built plans for proven milestones.",
    cta: "Browse Plans",
    featured: false,
  },
  {
    name: "PREMIUM",
    price: "$99.99",
    freq: "one-time",
    body: "Fully personalised to your exact data and race.",
    cta: "Select Premium",
    featured: true,
  },
  {
    name: "ELITE",
    price: "$99",
    freq: "/month",
    body: "Dynamic monthly adjustments with 1:1 coaching.",
    cta: "Sold Out",
    featured: false,
    soldOut: true,
  },
];

/* ─── Differentiators data ───────────────────────────────────── */
const DIFFERENTIATORS = [
  {
    title: "vs. Training Platforms",
    body: "TrainingPeaks and Intervals.icu give you tools \u2014 not a plan. You still build it yourself. We do the building.",
  },
  {
    title: "vs. Algorithm Apps",
    body: "TrainerRoad and Zwift offer structured workouts, but they\u2019re one-size-fits-all. No adaptation to your life, injuries, or race date.",
  },
  {
    title: "vs. Hiring a Coach",
    body: "A coach costs $200\u2013400/month. We deliver the same personalised, race-specific plan \u2014 once \u2014 for $99.99.",
  },
];

/* ═══════════════════════════════════════════════════════════════ */
/*  PAGE                                                          */
/* ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  let wordIdx = 0;

  const scrollToProcess = () =>
    document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px]">

      {/* ───────────────── SECTION 1 — HERO ───────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* BG image */}
        <img
          src="/images/bike-motion-blur.jpeg"
          alt=""
          aria-hidden="true"
          style={bwImg}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.65)" }}
        />

        {/* Content */}
        <div className="relative z-10 px-8 md:px-24 max-w-4xl pt-28">
          {/* Eyebrow */}
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-8"
            style={{ color: ACCENT }}
            {...heroIn(0.1)}
          >
            Precision Endurance
          </motion.span>

          {/* Headline — word-by-word stagger */}
          <h1 className="font-headline text-[clamp(2.8rem,8vw,6rem)] font-extrabold leading-[1.05] tracking-tight mb-8">
            {HERO_LINES.map((line, li) => (
              <span key={li} style={{ display: "block" }}>
                {line.map(({ word, accent }) => {
                  const i = wordIdx++;
                  return (
                    <motion.span
                      key={i}
                      style={{
                        display: "inline-block",
                        marginRight: "0.25em",
                        ...(accent ? { color: ACCENT } : {}),
                      }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut" as const,
                        delay: 0.25 + i * 0.08,
                      }}
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <motion.p
            className="font-body text-lg md:text-xl leading-relaxed max-w-xl mb-5"
            style={{ color: "rgba(245,245,240,0.75)" }}
            {...heroIn(0.95)}
          >
            Personalised endurance training plans for triathletes, cyclists and
            runners. Built from your biology&nbsp;&mdash; not a template.
          </motion.p>

          {/* Small line */}
          <motion.p
            className="font-label text-xs tracking-wider mb-12"
            style={{ color: DIM }}
            {...heroIn(1.15)}
          >
            All levels. All disciplines. From $29.99.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" as const, delay: 1.3 }}
          >
            <Link
              href="/pricing"
              className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
              style={{ background: ACCENT, color: TEXT }}
            >
              Start Your Plan &rarr;
            </Link>
            <Link
              href="/plans"
              className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ border: `1px solid ${CARD_BORDER}`, color: TEXT }}
            >
              Try a Free 5K Plan
            </Link>
          </motion.div>
        </div>

        {/* Scroll arrow */}
        <motion.button
          onClick={scrollToProcess}
          aria-label="Scroll to next section"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
          style={{ color: DIM }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: 1.8 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.button>
      </section>

      {/* ───────────── SECTION 2 — HOW IT WORKS ───────────── */}
      <section id="process" className="relative py-32 md:py-44 overflow-hidden">
        {/* BG image */}
        <img
          src="/images/run-motion-blur.jpeg"
          alt=""
          aria-hidden="true"
          style={bwImg}
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.80)" }}
        />

        <div className="relative z-10 px-8 md:px-24 max-w-6xl mx-auto">
          {/* Label */}
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-16"
            style={{ color: ACCENT }}
            {...fadeUp()}
          >
            How It Works
          </motion.span>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-10">
            {STEPS.map((step, i) => (
              <motion.div key={step.num} {...fadeUp(i * 0.15)}>
                <span
                  className="font-headline text-5xl font-extrabold block mb-4"
                  style={{ color: "rgba(245,245,240,0.06)" }}
                >
                  {step.num}
                </span>
                <h3 className="font-headline text-lg font-bold mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: DIM }}>
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Brand statement */}
          <motion.p
            className="font-headline text-xl md:text-2xl font-bold mt-20 max-w-2xl mx-auto text-center leading-relaxed tracking-tight"
            style={{ color: "rgba(245,245,240,0.65)" }}
            {...fadeUp(0.3)}
          >
            Built from your data, your lifestyle, your schedule, your
            goals. This plan is made for you&nbsp;&mdash; not anyone else.
          </motion.p>
        </div>
      </section>

      {/* ──────────── SECTION 3 — METHODOLOGY TEASER ──────── */}
      <section className="relative py-32 md:py-44 overflow-hidden" style={{ background: BG }}>
        <div className="relative z-10 px-8 md:px-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">

          {/* Text — left */}
          <div className="flex-1 max-w-xl">
            <motion.span
              className="font-label text-[11px] tracking-[0.35em] uppercase block mb-10"
              style={{ color: DIM }}
              {...fadeUp()}
            >
              Our Methodology
            </motion.span>

            <motion.h2
              className="font-headline text-3xl md:text-4xl font-bold leading-snug mb-8"
              {...fadeUp(0.05)}
            >
              No templates.{"\n"}No guesswork.{"\n"}Built from your{" "}
              <span style={{ color: ACCENT }}>biology</span>.
            </motion.h2>

            <motion.p
              className="font-body text-base leading-relaxed mb-8"
              style={{ color: DIM }}
              {...fadeUp(0.1)}
            >
              We analyse your heart rate zones, training history, injury data,
              and race date to engineer a plan that adapts to your
              life&nbsp;&mdash; not the other way around. Every block is
              reviewed by a human coach before delivery.
            </motion.p>

            <motion.div {...fadeUp(0.15)}>
              <Link
                href="/methodology"
                className="font-label text-sm tracking-wider underline underline-offset-4 transition-colors duration-200"
                style={{ color: ACCENT }}
              >
                Read more &rarr;
              </Link>
            </motion.div>
          </div>

          {/* Image — right (desktop only) */}
          <motion.div
            className="hidden md:block flex-1 relative h-[500px] max-w-[45%]"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: "easeOut" as const }}
          >
            <img
              src="/images/ocean-exit.png"
              alt="Swimmer exiting the ocean"
              className="w-full h-full object-cover rounded-sm"
              style={{ filter: "grayscale(100%)" }}
            />
            {/* Gradient mask fading left edge into BG */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${BG} 0%, transparent 40%)`,
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* ──────────────── SECTION 3.5 — HOW WE'RE DIFFERENT ── */}
      <section className="py-32 md:py-44 px-8 md:px-24" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto">
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
            style={{ color: DIM }}
            {...fadeUp()}
          >
            Why Plan Metric
          </motion.span>
          <motion.h2
            className="font-headline text-3xl md:text-5xl font-bold mb-16"
            {...fadeUp(0.05)}
          >
            How we&rsquo;re{" "}
            <span style={{ color: ACCENT }}>different</span>.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIFFERENTIATORS.map((d, i) => (
              <motion.div
                key={d.title}
                className="p-10 rounded-sm flex flex-col"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                }}
                {...fadeUp(i * 0.15)}
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-headline text-lg font-bold tracking-wide mb-4">
                  {d.title}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: DIM }}
                >
                  {d.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── SECTION 4 — THE PLANS ───────────── */}
      <section className="relative overflow-hidden">
        {/* Top image band */}
        <div className="relative h-[300px] md:h-[400px]">
          <img
            src="/images/transition-overhead.png"
            alt=""
            aria-hidden="true"
            style={bwImg}
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.75)" }}
          />
          {/* Fade to dark at bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-40"
            style={{ background: `linear-gradient(to bottom, transparent, ${BG})` }}
          />

          {/* Label + headline overlaid on image */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end px-8 md:px-24 pb-16 max-w-6xl mx-auto w-full">
            <motion.span
              className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
              style={{ color: DIM }}
              {...fadeUp()}
            >
              The Plans
            </motion.span>
            <motion.h2
              className="font-headline text-3xl md:text-5xl font-bold"
              {...fadeUp(0.05)}
            >
              Three levels. One{" "}
              <span style={{ color: ACCENT }}>standard</span>.
            </motion.h2>
          </div>
        </div>

        {/* Cards on clean dark background */}
        <div className="px-8 md:px-24 pb-32 md:pb-44 pt-12" style={{ background: BG }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                className="relative p-10 rounded-sm flex flex-col"
                style={{
                  background: CARD_BG,
                  border: plan.featured
                    ? `1px solid ${ACCENT}`
                    : `1px solid ${CARD_BORDER}`,
                }}
                {...fadeUp(i * 0.2)}
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                }}
                transition={{ duration: 0.2 }}
              >
                {plan.featured && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 font-label text-[10px] tracking-widest uppercase px-4 py-1 rounded-sm"
                    style={{ background: ACCENT, color: TEXT }}
                  >
                    Most Selected
                  </span>
                )}

                <h3 className="font-headline text-xl font-bold tracking-wide mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="font-headline text-3xl font-bold">
                    {plan.price}
                  </span>
                  <span className="font-label text-xs ml-2" style={{ color: DIM }}>
                    {plan.freq}
                  </span>
                </div>
                <p
                  className="font-body text-sm leading-relaxed mb-10 flex-1"
                  style={{ color: DIM }}
                >
                  {plan.body}
                </p>
                {plan.soldOut ? (
                  <span
                    className="block w-full text-center font-label text-xs font-bold tracking-widest uppercase py-3 rounded-sm opacity-40 cursor-default"
                    style={{ border: `1px solid ${CARD_BORDER}`, color: TEXT }}
                  >
                    {plan.cta}
                  </span>
                ) : (
                  <Link
                    href="/pricing"
                    className="block w-full text-center font-label text-xs font-bold tracking-widest uppercase py-3 rounded-sm transition-all duration-200 hover:scale-[1.02]"
                    style={
                      plan.featured
                        ? { background: ACCENT, color: TEXT }
                        : { border: `1px solid ${CARD_BORDER}`, color: TEXT }
                    }
                  >
                    {plan.cta}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Compare button */}
          <motion.div className="text-center mt-14" {...fadeUp(0.3)}>
            <Link
              href="/pricing"
              className="inline-block font-label text-xs font-bold tracking-widest uppercase px-10 py-3 rounded-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ border: `1px solid ${CARD_BORDER}`, color: TEXT }}
            >
              Compare All Plans &rarr;
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ──────────────── SECTION 5 — FINAL CTA ──────────── */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        {/* BG image */}
        <img
          src="/images/swim-motion-blur.jpeg"
          alt=""
          aria-hidden="true"
          style={bwImg}
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.75)" }}
        />

        <div className="relative z-10 text-center px-8">
          <motion.h2
            className="font-headline text-4xl md:text-5xl font-bold mb-6"
            {...fadeUp()}
          >
            Ready to{" "}
            <span style={{ color: ACCENT }}>evolve</span>?
          </motion.h2>
          <motion.p
            className="font-body text-base mb-12"
            style={{ color: DIM }}
            {...fadeUp(0.1)}
          >
            Tell us about your goals, your schedule, and your race.
            It takes about 10 minutes &mdash; and it&rsquo;s where your plan starts.
          </motion.p>
          <motion.div {...fadeUp(0.2)}>
            <Link
              href="/pricing"
              className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
              style={{ background: ACCENT, color: TEXT }}
            >
              Start Your Assessment &rarr;
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ───────────────────── FOOTER ─────────────────────── */}
      <footer
        className="w-full py-10 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-6"
        style={{ background: BG, borderTop: `1px solid ${CARD_BORDER}` }}
      >
        <span className="font-label text-[11px] tracking-[0.3em] uppercase font-bold">
          Plan Metric
        </span>

        <div className="flex gap-8">
          {[
            ["About", "/about"],
            ["Plans", "/plans"],
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
  );
}

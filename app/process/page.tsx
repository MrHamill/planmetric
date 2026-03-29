"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ─── Palette (matches homepage) ─────────────────────────────── */
const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
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

/* ─── Animation presets ──────────────────────────────────────── */
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

/* ─── Steps data ─────────────────────────────────────────────── */
const STEPS = [
  {
    number: "01",
    phase: "Phase: Assessment",
    title: "Choose Your Path",
    body: "Select your discipline — Running, Triathlon, or Cycling — and choose the plan level that matches your goals. Complete our deep-dive questionnaire covering fitness, goals, schedule, and injury history. This isn\u2019t just a form; it\u2019s the architectural blueprint of your next season.",
  },
  {
    number: "02",
    phase: "Phase: Data Integration",
    title: "8\u201310 Min Intake",
    body: "Precision starts with data. We analyse your injury history, heart rate zones, and current weekly volume in KM. Your plan is engineered around your exact thresholds, availability, and race date.",
  },
  {
    number: "03",
    phase: "Phase: Deployment",
    title: "48H Delivery",
    body: "Within 48 hours, your personalised plan is built around everything about you — your fitness, your race, your schedule, your body. No generic templates. Your sessions are calibrated to your exact thresholds and delivered directly to your dashboard.",
  },
  {
    number: "04",
    phase: "Phase: Execution",
    title: "Execute Race Day",
    body: "Show up to race day with a plan built for exactly you \u2014 and nothing left to chance. Every session, every taper, every race-week detail has been mapped to your specific physiology and goals.",
  },
];

/* ═══════════════════════════════════════════════════════════════ */
/*  PAGE                                                          */
/* ═══════════════════════════════════════════════════════════════ */
export default function ProcessPage() {
  return (
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px]">

      {/* ───────────────── HERO ────────────────────────────── */}
      <section className="relative min-h-[75vh] flex flex-col justify-end overflow-hidden">
        {/* BG image */}
        <img
          src="/images/track-stretch.png"
          alt=""
          aria-hidden="true"
          style={bwImg}
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.70)" }}
        />
        {/* Fade to dark at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: `linear-gradient(to bottom, transparent, ${BG})` }}
        />

        {/* Ghost word */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-headline font-extrabold text-[22vw] leading-none whitespace-nowrap uppercase"
            style={{ WebkitTextStroke: "1px rgba(245,245,240,0.05)", color: "transparent" }}
          >
            PROCESS.
          </span>
        </div>

        {/* Push content well below nav */}
        <div className="relative z-10 px-8 md:px-24 pb-24 pt-40 max-w-5xl">
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
            style={{ color: ACCENT }}
            {...heroIn(0.1)}
          >
            Engineered Performance
          </motion.span>

          <motion.h1
            className="font-headline text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-tight mb-8"
            {...heroIn(0.25)}
          >
            A precise path to{" "}
            <br className="hidden md:block" />
            peak <span style={{ color: ACCENT }}>endurance</span>.
          </motion.h1>

          <motion.p
            className="font-body text-lg md:text-xl leading-relaxed max-w-xl"
            style={{ color: DIM }}
            {...heroIn(0.45)}
          >
            Our process is built on the philosophy of limited volume for
            maximum quality. We focus on the metric, so you can focus on the
            movement.
          </motion.p>
        </div>
      </section>

      {/* ───────────────── STEPS (one at a time reveal) ───── */}
      <section className="px-8 md:px-24">
        <div className="max-w-3xl mx-auto">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="min-h-screen flex flex-col justify-center py-20"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
            >
              {/* Giant ghost number */}
              <span
                className="font-headline text-[8rem] md:text-[12rem] font-extrabold leading-none block mb-6"
                style={{ color: "rgba(245,245,240,0.04)" }}
              >
                {step.number}
              </span>

              <span
                className="font-label text-[10px] tracking-[0.35em] uppercase block mb-4"
                style={{ color: ACCENT }}
              >
                {step.phase}
              </span>

              <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight mb-8">
                {step.title}
              </h2>

              <p
                className="font-body text-base md:text-lg leading-relaxed max-w-xl"
                style={{ color: DIM }}
              >
                {step.body}
              </p>

              {/* CTA on last step */}
              {i === STEPS.length - 1 && (
                <div className="mt-12">
                  <Link
                    href="/assessment"
                    className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
                    style={{ background: ACCENT, color: TEXT }}
                  >
                    Start Your Intake &rarr;
                  </Link>
                </div>
              )}

              {/* Subtle divider between steps */}
              {i < STEPS.length - 1 && (
                <div
                  className="mt-20 w-16 h-px"
                  style={{ background: CARD_BORDER }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────────────── FINAL CTA (no image) ──────────── */}
      <section className="py-32 md:py-44 text-center px-8">
        <motion.h2
          className="font-headline text-4xl md:text-5xl font-bold mb-6"
          {...fadeUp()}
        >
          Ready for{" "}
          <span style={{ color: ACCENT }}>precision</span>.
        </motion.h2>
        <motion.p
          className="font-body text-base mb-12 max-w-xl mx-auto"
          style={{ color: DIM }}
          {...fadeUp(0.1)}
        >
          Every athlete who crosses their finish line started with a plan built for them.
        </motion.p>
        <motion.div {...fadeUp(0.2)}>
          <Link
            href="/assessment"
            className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]"
            style={{ background: ACCENT, color: TEXT }}
          >
            Start Your Assessment &rarr;
          </Link>
        </motion.div>
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

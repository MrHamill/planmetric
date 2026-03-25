"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CountUp } from "@/components/CountUp";

/* ─── Stagger variants ────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function HomePage() {
  return (
    <main>

      {/* ══════════════════════════════════════════════════════
          HERO — vintage magazine cover
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col pt-24 overflow-hidden">

        {/* Athlete image — right column */}
        <motion.div
          className="absolute right-0 top-0 w-full md:w-[52%] h-full z-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <img
            src="/images/hero.jpg"
            alt="Endurance athlete"
            className="w-full h-full object-cover grayscale brightness-[0.65] opacity-50 md:opacity-90"
          />
          {/* Gradient fade to background on left + bottom */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        </motion.div>

        {/* Content — left column */}
        <div className="relative z-10 flex flex-col flex-1 px-8 md:px-16 pb-12 w-full md:w-[54%]">

          {/* ── Top edition bar ────────────────────────────── */}
          <motion.div
            className="flex items-center gap-3 pt-2 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="font-label text-[9px] tracking-[0.28em] text-on-surface-variant/50 uppercase">
              Est. 2024
            </span>
            <div className="flex-1 h-px bg-on-surface/8" />
            <span className="font-label text-[9px] tracking-[0.28em] text-on-surface-variant/50 uppercase">
              Vol. I · No. 1
            </span>
            <div className="flex-1 h-px bg-on-surface/8" />
            <span className="font-label text-[9px] tracking-[0.28em] text-on-surface-variant/50 uppercase">
              March 2026
            </span>
          </motion.div>

          {/* ── Eyebrow label with flanking rules ─────────── */}
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <div className="h-px bg-primary/60 w-10" />
            <span className="font-label text-[10px] tracking-[0.35em] text-primary uppercase">
              Precision Endurance
            </span>
            <div className="h-px bg-primary/60 w-10" />
          </motion.div>

          {/* ── Masthead ───────────────────────────────────── */}
          <div className="mb-0">
            {["PLAN", "METRIC"].map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.12, duration: 0.7, ease: "easeOut" }}
              >
                <h1
                  className="font-headline font-extrabold tracking-[-0.04em] leading-[0.87] uppercase text-on-surface"
                  style={{ fontSize: "clamp(4.5rem, 13vw, 10.5rem)" }}
                >
                  {word}
                </h1>
              </motion.div>
            ))}
          </div>

          {/* ── Caption rule ───────────────────────────────── */}
          <motion.div
            className="flex items-center justify-between border-t border-b border-primary/15 py-2.5 my-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.82, duration: 0.6 }}
          >
            <span className="font-label text-[9px] tracking-[0.22em] text-on-surface-variant/50 uppercase">
              Personalised endurance training plans
            </span>
            <span className="font-label text-[9px] tracking-[0.22em] text-primary/50 uppercase">
              Australia
            </span>
          </motion.div>

          {/* ── Editorial READ— listing ────────────────────── */}
          <motion.div
            className="mb-7"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <p className="font-label text-[9px] tracking-[0.28em] text-primary/60 uppercase mb-2">
              Read —
            </p>
            {[
              ["Triathlon", "Sprint · Olympic · 70.3 · Full Ironman"],
              ["Cycling",   "Power-Based Training Structures"],
              ["Running",   "Pace & Heart Rate Programmes"],
            ].map(([discipline, desc]) => (
              <div
                key={discipline}
                className="flex items-baseline gap-3 py-1.5 border-b border-outline-variant/10 last:border-0"
              >
                <span className="font-label text-[10px] font-bold tracking-widest text-on-surface uppercase w-20 shrink-0">
                  {discipline}
                </span>
                <span className="font-body text-[11px] text-on-surface-variant/60">
                  {desc}
                </span>
              </div>
            ))}
          </motion.div>

          {/* ── Price + CTA ────────────────────────────────── */}
          <motion.div
            className="flex items-center gap-6 mb-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.6 }}
          >
            <div>
              <p className="font-label text-[9px] tracking-[0.22em] text-on-surface-variant/40 uppercase mb-0.5">
                Plans from
              </p>
              <p className="font-headline text-2xl font-bold text-primary leading-none">
                $<CountUp end={49} decimals={0} duration={1500} />
                <span className="font-label text-[9px] text-on-surface-variant/40 ml-1 tracking-widest uppercase">
                  per plan
                </span>
              </p>
            </div>
            <div className="w-px h-8 bg-outline-variant/25" />
            <Link
              href="/assessment"
              className="bg-primary text-on-primary px-6 py-3 text-[11px] font-bold tracking-[0.2em] rounded-sm hover:opacity-90 active:scale-95 transition-all uppercase"
            >
              Take the Assessment
            </Link>
            <Link
              href="/pricing"
              className="font-label text-[10px] tracking-widest text-on-surface-variant/50 uppercase hover:text-on-surface transition-colors border-b border-transparent hover:border-on-surface/30 pb-px"
            >
              View Plans
            </Link>
          </motion.div>

          {/* ── Bottom colophon ────────────────────────────── */}
          <motion.div
            className="flex items-center justify-between border-t border-on-surface/8 pt-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.6 }}
          >
            <span className="font-label text-[8px] tracking-[0.22em] text-on-surface-variant/30 uppercase">
              Data-driven · Human-reviewed
            </span>
            <span className="font-label text-[8px] tracking-[0.22em] text-on-surface-variant/30 uppercase">
              planmetric.com.au
            </span>
          </motion.div>

        </div>
      </section>

      {/* ── Editorial divider ─────────────────────────────── */}
      <div className="px-8 md:px-16 py-6 border-t border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-outline-variant/15" />
          <span className="font-label text-[8px] tracking-[0.35em] text-on-surface-variant/25 uppercase">◆ Features ◆</span>
          <div className="h-px flex-1 bg-outline-variant/15" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          METRICS — editorial data section
      ══════════════════════════════════════════════════════ */}
      <motion.section
        className="py-32 px-8 md:px-16 bg-surface-container-low"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <div className="max-w-4xl">

          {/* Section header */}
          <motion.div variants={item} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px bg-primary/50 w-6" />
              <span className="font-label text-[9px] tracking-[0.3em] text-primary uppercase">
                The Data
              </span>
            </div>
            <h2 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter leading-none uppercase">
              Metrics<br />That Matter.
            </h2>
          </motion.div>

          <motion.p
            variants={item}
            className="font-body text-on-surface-variant mb-14 max-w-md border-l-2 border-primary/30 pl-4 text-sm leading-relaxed"
          >
            Every kilometre is calculated against your current physiological
            capacity. We don&apos;t guess; we measure.
          </motion.p>

          <motion.div
            variants={container}
            className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-outline-variant/10"
          >
            {[
              { label: "Distance Target", end: 180.4, decimals: 1, unit: "KM" },
              { label: "Training Temp",   end: 22,    decimals: 0, unit: "°C" },
            ].map(({ label, end, decimals, unit }) => (
              <motion.div key={label} variants={item} className="bg-surface-container-low p-10">
                <span className="font-label text-[9px] tracking-[0.3em] text-primary/70 uppercase block mb-5">
                  {label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-7xl font-extrabold tracking-tighter">
                    <CountUp end={end} decimals={decimals} duration={1500} />
                  </span>
                  <span className="font-label text-sm text-on-surface-variant uppercase tracking-widest">
                    {unit}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.section>

      {/* ── Editorial divider ─────────────────────────────── */}
      <div className="px-8 md:px-16 py-6 border-t border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-outline-variant/15" />
          <span className="font-label text-[8px] tracking-[0.35em] text-on-surface-variant/25 uppercase">◆ Plans ◆</span>
          <div className="h-px flex-1 bg-outline-variant/15" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          PRICING — editorial card layout
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 px-8 md:px-16">

        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-primary/50 w-6" />
            <span className="font-label text-[9px] tracking-[0.3em] text-primary uppercase">
              Select your intensity
            </span>
          </div>
          <h2 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter uppercase leading-none">
            Training<br />Structures.
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/10"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* STARTER */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-surface p-10 flex flex-col justify-between border border-transparent hover:border-primary/20 transition-colors duration-500"
          >
            <div>
              <div className="flex items-center gap-2 mb-8">
                <span className="font-label text-[9px] tracking-[0.3em] text-on-surface-variant/40 uppercase">Level 01</span>
                <div className="flex-1 h-px bg-outline-variant/15" />
              </div>
              <h3 className="font-headline text-4xl font-extrabold tracking-tighter uppercase leading-tight mb-5">
                Starter
              </h3>
              <p className="font-body text-on-surface-variant text-sm leading-relaxed mb-8">
                Pre-built plans optimised for common performance milestones. Built on verified data structures.
              </p>
              <ul className="space-y-2.5 mb-10">
                {["Pre-built goal paths", "Instant digital download", "Standard metric tracking"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[11px] text-on-surface/70">
                    <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="border-t border-outline-variant/15 pt-5 mb-5 flex items-baseline justify-between">
                <span className="font-headline text-3xl font-bold">$<CountUp end={49} decimals={0} duration={1500} /></span>
                <span className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-widest">One-Time</span>
              </div>
              <Link href="/assessment" className="block w-full bg-surface-container-high text-on-surface py-3.5 text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all text-center">
                Select Starter
              </Link>
            </div>
          </motion.div>

          {/* PREMIUM */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-surface-container-low p-10 flex flex-col justify-between border-x border-primary/20 relative"
          >
            {/* Top accent line */}
            <span className="absolute top-0 left-0 right-0 h-px bg-primary" />
            <div>
              <div className="flex items-center gap-2 mb-8">
                <span className="font-label text-[9px] tracking-[0.3em] text-primary uppercase">Level 02</span>
                <div className="flex-1 h-px bg-primary/20" />
                <span className="font-label text-[9px] tracking-[0.2em] text-primary uppercase">Most Selected</span>
              </div>
              <h3 className="font-headline text-4xl font-extrabold tracking-tighter uppercase leading-tight mb-5">
                Premium
              </h3>
              <p className="font-body text-on-surface-variant text-sm leading-relaxed mb-8">
                Tailored to your intake data. Audited by our head coach. A tactical roadmap for serious results.
              </p>
              <ul className="space-y-2.5 mb-10">
                {["Physiological Profiling", "Pace & HR zones (KM based)", "Weekly schedule & Coach notes", "Final Review by Lead Coach"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[11px] text-on-surface/80">
                    <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="border-t border-primary/20 pt-5 mb-5 flex items-baseline justify-between">
                <span className="font-headline text-3xl font-bold">$<CountUp end={149} decimals={0} duration={1500} /></span>
                <span className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-widest">One-Time</span>
              </div>
              <Link href="/assessment" className="block w-full bg-primary text-on-primary py-3.5 text-[10px] font-bold tracking-widest uppercase hover:opacity-90 transition-all text-center">
                Select Premium
              </Link>
            </div>
          </motion.div>

          {/* ELITE */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-surface p-10 flex flex-col justify-between border border-transparent hover:border-primary/20 transition-colors duration-500"
          >
            <div>
              <div className="flex items-center gap-2 mb-8">
                <span className="font-label text-[9px] tracking-[0.3em] text-on-surface-variant/40 uppercase">Level 03</span>
                <div className="flex-1 h-px bg-outline-variant/15" />
              </div>
              <h3 className="font-headline text-4xl font-extrabold tracking-tighter uppercase leading-tight mb-5">
                Elite
              </h3>
              <p className="font-body text-on-surface-variant text-sm leading-relaxed mb-8">
                Continuous performance adjustment. Monthly calls and weekly data deep-dives.
              </p>
              <ul className="space-y-2.5 mb-10">
                {["Dynamic plan adjustments", "Monthly 1:1 check-ins", "Unlimited email support"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[11px] text-on-surface/70">
                    <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="border-t border-outline-variant/15 pt-5 mb-5 flex items-baseline justify-between">
                <span className="font-headline text-3xl font-bold">$<CountUp end={99} decimals={0} duration={1500} /></span>
                <span className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-widest">Per Month</span>
              </div>
              <Link href="/assessment" className="block w-full bg-surface-container-high text-on-surface py-3.5 text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all text-center">
                Join Elite
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Editorial divider ─────────────────────────────── */}
      <div className="px-8 md:px-16 py-6 border-t border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-outline-variant/15" />
          <span className="font-label text-[8px] tracking-[0.35em] text-on-surface-variant/25 uppercase">◆ Begin ◆</span>
          <div className="h-px flex-1 bg-outline-variant/15" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          CTA — editorial back page
      ══════════════════════════════════════════════════════ */}
      <motion.section
        className="py-24 px-8 md:px-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="border border-outline-variant/20 p-14 md:p-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px bg-primary/50 w-6" />
              <span className="font-label text-[9px] tracking-[0.3em] text-primary uppercase">
                Begin
              </span>
            </div>
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter uppercase leading-none">
              Ready to<br />
              <span className="text-primary-dim">Evolve?</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <Link
              href="/assessment"
              className="inline-block bg-primary text-on-primary px-10 py-5 text-[11px] font-bold tracking-[0.22em] rounded-sm hover:scale-105 active:scale-95 transition-all uppercase"
            >
              Start Your Assessment
            </Link>
            <span className="font-label text-[9px] text-on-surface-variant/35 tracking-widest uppercase">
              Assessment takes 8–10 minutes
            </span>
          </div>
        </div>
      </motion.section>

    </main>
  );
}

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

/* ─── Metric card ─────────────────────────────────────────── */
function MetricCard({
  label,
  end,
  decimals,
  unit,
}: {
  label: string;
  end: number;
  decimals: number;
  unit: string;
}) {
  return (
    <div className="bg-surface p-8 rounded-sm">
      <span className="font-label text-[10px] tracking-widest text-primary uppercase block mb-2">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="font-headline text-5xl font-bold">
          <CountUp end={end} decimals={decimals} duration={1500} />
        </span>
        <span className="font-label text-sm text-on-surface-variant uppercase">
          {unit}
        </span>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function HomePage() {
  const heroLine1 = ["Not", "a", "template."];
  const heroLine2 = ["Your", "plan."];

  return (
    <main className="pt-24">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center px-8 md:px-24">
        {/* Right 60% image */}
        <motion.div
          className="absolute right-0 top-0 w-full md:w-[60%] h-full z-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img
            src="/images/hero.jpg"
            alt="Endurance athlete training"
            className="w-full h-full object-cover grayscale brightness-75 opacity-60 md:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </motion.div>

        {/* Text — left 40% */}
        <div className="relative z-10 max-w-2xl">
          <motion.span
            className="font-label text-primary tracking-[0.3em] text-[10px] uppercase mb-6 block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Precision Endurance
          </motion.span>

          <h1 className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter leading-none mb-8">
            {heroLine1.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.6, ease: "easeOut" }}
                className="inline-block mr-[0.22em]"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <span className="text-primary-dim">
              {heroLine2.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (heroLine1.length + i) * 0.2, duration: 0.6, ease: "easeOut" }}
                  className="inline-block mr-[0.22em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            className="font-body text-lg md:text-xl text-on-surface-variant max-w-lg mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
          >
            We strip away the digital noise. High-performance training
            methodologies for triathletes, cyclists, and runners who demand
            scientific accuracy.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" }}
          >
            <Link
              href="/intake"
              className="bg-primary text-on-primary px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:opacity-90 transition-all uppercase text-center"
            >
              Take the Assessment
            </Link>
            <Link
              href="/pricing"
              className="bg-surface-container-high text-on-surface px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:bg-surface-variant transition-all uppercase text-center"
            >
              View Plans
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Metrics ───────────────────────────────────────── */}
      <motion.section
        className="py-32 px-8 md:px-24 bg-surface-container-low"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end max-w-7xl mx-auto">
          <div className="md:col-span-7">
            <motion.h2
              variants={item}
              className="font-headline text-4xl font-bold tracking-tight mb-6"
            >
              Metrics that matter.
            </motion.h2>
            <motion.p
              variants={item}
              className="font-body text-on-surface-variant mb-12 max-w-xl"
            >
              Every kilometre is calculated against your current physiological
              capacity. We don&apos;t guess; we measure.
            </motion.p>
            <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div variants={item}>
                <MetricCard label="Distance Target" end={180.4} decimals={1} unit="KM" />
              </motion.div>
              <motion.div variants={item}>
                <MetricCard label="Training Temp" end={22} decimals={0} unit="CELSIUS" />
              </motion.div>
            </motion.div>
          </div>
          <motion.div variants={item} className="md:col-span-5 h-[400px] group">
            <img
              src="/images/cyclist2.jpg"
              alt="Cyclist in action"
              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700 rounded-sm"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* ── Pricing tiers ─────────────────────────────────── */}
      <section className="py-32">
        <motion.div
          className="text-center mb-20 px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="font-headline text-5xl font-bold tracking-tight mb-4">
            Select your intensity.
          </h2>
          <div className="w-12 h-px bg-primary mx-auto" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-px w-full max-w-7xl mx-auto px-8 md:px-24"
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
            className="bg-surface p-12 hover:bg-surface-container-low transition-colors duration-500 border border-transparent hover:border-primary/20"
          >
            <span className="font-label text-xs tracking-widest uppercase mb-2 block text-on-surface-variant">
              Level 01
            </span>
            <h3 className="font-headline text-3xl font-bold mb-8">STARTER</h3>
            <p className="font-body text-on-surface-variant mb-10 min-h-[80px]">
              Pre-built plans optimised for common performance milestones.
              Built on verified data structures.
            </p>
            <ul className="space-y-4 mb-12">
              {["Pre-built goal paths", "Instant digital download", "Standard metric tracking"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-lg">check</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="font-headline text-3xl font-bold mb-10">
              $<CountUp end={49} decimals={0} duration={1500} />{" "}
              <span className="text-sm font-label text-on-surface-variant">/ ONE-TIME</span>
            </div>
            <button className="w-full bg-surface-container-high text-on-surface py-4 text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all">
              SELECT STARTER
            </button>
          </motion.div>

          {/* PREMIUM — featured */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-surface-container-low p-12 border-x border-primary/20 relative"
          >
            <span className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-label tracking-widest uppercase px-3 py-1">
              MOST SELECTED
            </span>
            <span className="font-label text-xs tracking-widest uppercase mb-2 block text-primary">
              Level 02
            </span>
            <h3 className="font-headline text-3xl font-bold mb-8">PREMIUM</h3>
            <p className="font-body text-on-surface-variant mb-10 min-h-[80px]">
              Tailored architecture built from your specific intake form data.
              Audited by our head coach.
            </p>
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-primary text-lg">star</span>
                <span>Physiological Profiling</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-primary text-lg">check</span>
                <span>Pace &amp; HR zones (KM based)</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-primary text-lg">check</span>
                <span>Weekly schedule &amp; Coach notes</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-primary text-lg">check</span>
                <span>Final Review by Lead Coach</span>
              </li>
            </ul>
            <div className="font-headline text-3xl font-bold mb-10">
              $<CountUp end={149} decimals={0} duration={1500} />{" "}
              <span className="text-sm font-label text-on-surface-variant">/ ONE-TIME</span>
            </div>
            <button className="w-full bg-primary text-on-primary py-4 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all">
              SELECT PREMIUM
            </button>
          </motion.div>

          {/* ELITE */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-surface p-12 hover:bg-surface-container-low transition-colors duration-500 border border-transparent hover:border-primary/20"
          >
            <span className="font-label text-xs tracking-widest uppercase mb-2 block text-on-surface-variant">
              Level 03
            </span>
            <h3 className="font-headline text-3xl font-bold mb-8">ELITE</h3>
            <p className="font-body text-on-surface-variant mb-10 min-h-[80px]">
              Continuous performance adjustment. Monthly calls and weekly
              data deep-dives.
            </p>
            <ul className="space-y-4 mb-12">
              {["Dynamic plan adjustments", "Monthly 1:1 check-ins", "Unlimited Email support"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-lg">check</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="font-headline text-3xl font-bold mb-10">
              $<CountUp end={99} decimals={0} duration={1500} />{" "}
              <span className="text-sm font-label text-on-surface-variant">/ MONTH</span>
            </div>
            <button className="w-full bg-surface-container-high text-on-surface py-4 text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all">
              JOIN ELITE
            </button>
          </motion.div>

        </motion.div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <motion.section
        className="py-32 text-center px-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-12">
          Ready to evolve?
        </h2>
        <Link
          href="/pricing"
          className="inline-block bg-primary text-on-primary px-12 py-6 text-sm font-bold tracking-[0.2em] rounded-sm hover:scale-105 active:scale-95 transition-all uppercase"
        >
          Start Your Assessment
        </Link>
      </motion.section>

    </main>
  );
}

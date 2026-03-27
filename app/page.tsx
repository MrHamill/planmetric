"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ─── Stagger variants ────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* ─── Decorative divider ─────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center gap-4 justify-center my-2">
      <div className="h-px w-12 bg-primary/30" />
      <span className="text-primary text-xs">&#9830;</span>
      <div className="h-px w-12 bg-primary/30" />
    </div>
  );
}

/* ─── Section transition gradient ─────────────────────────── */
function SectionFade({ from, to }: { from: string; to: string }) {
  return (
    <div
      className="h-[60px] w-full"
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    />
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <main className="pt-0">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center px-8 md:px-24">
        {/* Full-viewport background image */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" as const }}
        >
          <img
            src="/images/start-line.png"
            alt="Triathlete standing on road at sunrise"
            className="w-full h-full object-cover object-center"
          />
          {/* Warm gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(240,230,212,0.92) 0%, rgba(240,230,212,0.6) 60%, rgba(240,230,212,0.2) 100%)",
            }}
          />
          {/* Warm radial tint overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(160,82,45,0.05) 0%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* Ambient glow behind headline */}
        <div
          className="absolute left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] z-[1] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(160,82,45,0.04) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* Text — left */}
        <div className="relative z-10 max-w-2xl">
          <motion.span
            className="font-label text-secondary tracking-[0.3em] text-[10px] uppercase mb-6 block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" as const, delay: 0.1 }}
          >
            Precision Endurance
          </motion.span>

          {/* Clip-path reveal headline */}
          <h1 className="font-serif text-5xl md:text-8xl font-extrabold tracking-tighter leading-tight mb-6 text-on-surface">
            <span className="block animate-reveal">
              Personalised
            </span>
            <span className="block animate-reveal">
              endurance
            </span>
            <span className="block animate-reveal-delay text-primary">
              training plans.
            </span>
          </h1>

          <motion.div
            className="flex flex-wrap gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" as const }}
          >
            <span className="font-label text-xs tracking-widest uppercase bg-primary text-on-primary px-4 py-2 rounded-sm font-bold">
              Affordable
            </span>
            <span className="font-label text-xs tracking-widest uppercase bg-primary text-on-primary px-4 py-2 rounded-sm font-bold">
              All Levels
            </span>
            <span className="font-label text-xs tracking-widest uppercase bg-surface-container text-on-surface px-4 py-2 rounded-sm font-bold border border-outline/18">
              From $29.99
            </span>
          </motion.div>

          <motion.p
            className="font-body text-lg md:text-xl text-on-surface-variant max-w-lg mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" as const }}
          >
            High-performance training methodologies for triathletes,
            cyclists, and runners who demand scientific accuracy.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6, ease: "easeOut" as const }}
          >
            <Link
              href="/assessment"
              className="bg-primary text-on-primary px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:bg-primary-dim transition-all uppercase text-center"
            >
              Start Your Plan
            </Link>
            <Link
              href="/pricing"
              className="bg-surface-container-high text-on-surface px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:bg-surface-container-highest transition-all uppercase text-center"
            >
              View Pricing
            </Link>
          </motion.div>
        </div>

        {/* Social links — bottom left */}
        <motion.div
          className="absolute bottom-8 left-8 z-10 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6, ease: "easeOut" as const }}
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant/40 hover:text-on-surface transition-colors"
            aria-label="Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://strava.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant/40 hover:text-on-surface transition-colors"
            aria-label="Strava"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116z" opacity="0.6" />
              <path d="M10.233 13.828L15.387 3 7.3 13.828h2.933zm0 0" />
            </svg>
          </a>
        </motion.div>

        {/* Scroll indicator — bottom center */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6, ease: "easeOut" as const }}
        >
          <div className="animate-bounce-scroll">
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none" className="text-on-surface-variant/40">
              <rect x="1" y="1" width="18" height="28" rx="9" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="9" r="2" fill="currentColor" />
            </svg>
          </div>
          <span className="font-label text-[10px] tracking-widest text-on-surface-variant/40 uppercase">
            Scroll to explore
          </span>
        </motion.div>
      </section>

      {/* ── Transition: hero → metrics ────────────────────── */}
      <SectionFade from="#F0E6D4" to="#F5EDE0" />

      {/* ── Metrics That Matter (full-bleed) ─────────────── */}
      <motion.section
        className="py-32 px-8 md:px-24 bg-surface-container-lowest"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <div className="max-w-5xl mx-auto">
          <Divider />
          <motion.h2
            variants={item}
            className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6 text-center text-on-surface"
          >
            Metrics that matter.
          </motion.h2>
          <Divider />

          <motion.p
            variants={item}
            className="font-body text-lg text-on-surface-variant mb-8 max-w-2xl mx-auto text-center leading-relaxed mt-8"
          >
            We take your current level, set your goal, and build the path &mdash;
            using your style, ability, preferences and availability.
          </motion.p>

          <motion.div
            variants={item}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            <div className="bg-surface-container-low p-8 rounded-sm text-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-4 block">query_stats</span>
              <h3 className="font-headline text-lg font-bold mb-2 text-on-surface">Assess</h3>
              <p className="font-body text-sm text-on-surface-variant">
                Deep-dive questionnaire covering fitness, goals, schedule, and injury history.
              </p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-sm text-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-4 block">architecture</span>
              <h3 className="font-headline text-lg font-bold mb-2 text-on-surface">Build</h3>
              <p className="font-body text-sm text-on-surface-variant">
                Your plan is engineered around your exact thresholds, availability, and race date.
              </p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-sm text-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-4 block">rocket_launch</span>
              <h3 className="font-headline text-lg font-bold mb-2 text-on-surface">Deliver</h3>
              <p className="font-body text-sm text-on-surface-variant">
                Receive a beautifully designed HTML plan within 48 hours. No PDFs, no spreadsheets.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
          >
            <Link
              href="/process"
              className="bg-primary text-on-primary px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:bg-primary-dim transition-all uppercase text-center"
            >
              See the Process
            </Link>
            <Link
              href="/plans"
              className="bg-surface-container-high text-on-surface px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:bg-surface-container-highest transition-all uppercase text-center"
            >
              View Plans
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Transition: metrics → pricing ─────────────────── */}
      <SectionFade from="#F5EDE0" to="#F0E6D4" />

      {/* ── Pricing tiers ─────────────────────────────────── */}
      <section className="py-32 bg-background">
        <motion.div
          className="text-center mb-20 px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <Divider />
          <h2 className="font-serif text-5xl font-bold tracking-tight mb-4 text-on-surface">
            Select your intensity.
          </h2>
          <Divider />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-8 md:px-24"
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
            className="bg-surface-container p-12 hover:bg-surface-container-high transition-colors duration-500 border border-outline/18 hover:border-primary/40 rounded-sm"
          >
            <span className="font-label text-xs tracking-widest uppercase mb-2 block text-secondary">
              Level 01
            </span>
            <h3 className="font-headline text-3xl font-bold mb-8 text-on-surface">STARTER</h3>
            <p className="font-body text-on-surface-variant mb-10 min-h-[80px]">
              Pre-built plans optimised for common performance milestones.
              Built on verified data structures.
            </p>
            <ul className="space-y-4 mb-12">
              {["Pre-built goal paths", "Instant digital download", "Standard metric tracking"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-lg">check</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="font-headline text-3xl font-bold mb-10 text-primary">
              $29.99{" "}
              <span className="text-sm font-label text-on-surface-variant">/ ONE-TIME</span>
            </div>
            <Link href="/plans" className="block w-full bg-surface-container-high text-on-surface py-4 text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all text-center rounded-sm">
              BROWSE PLANS
            </Link>
          </motion.div>

          {/* PREMIUM — featured */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-surface-container p-12 border border-primary/30 relative rounded-sm"
          >
            <span className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-label tracking-widest uppercase px-3 py-1">
              MOST SELECTED
            </span>
            <span className="font-label text-xs tracking-widest uppercase mb-2 block text-primary">
              Level 02
            </span>
            <h3 className="font-headline text-3xl font-bold mb-8 text-on-surface">PREMIUM</h3>
            <p className="font-body text-on-surface-variant mb-10 min-h-[80px]">
              Tailored architecture built from your specific intake form data.
              Audited by our head coach.
            </p>
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">star</span>
                <span>Physiological Profiling</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check</span>
                <span>Pace &amp; HR zones (KM based)</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check</span>
                <span>Weekly schedule &amp; Coach notes</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check</span>
                <span>Final Review by Lead Coach</span>
              </li>
            </ul>
            <div className="font-headline text-3xl font-bold mb-10 text-primary">
              $99.99{" "}
              <span className="text-sm font-label text-on-surface-variant">/ ONE-TIME</span>
            </div>
            <Link href="/assessment" className="block w-full bg-primary text-on-primary py-4 text-xs font-bold tracking-widest uppercase hover:bg-primary-dim transition-all text-center rounded-sm">
              SELECT PREMIUM
            </Link>
          </motion.div>

          {/* ELITE */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-surface-container p-12 hover:bg-surface-container-high transition-colors duration-500 border border-outline/18 hover:border-primary/40 rounded-sm"
          >
            <span className="font-label text-xs tracking-widest uppercase mb-2 block text-secondary">
              Level 03
            </span>
            <h3 className="font-headline text-3xl font-bold mb-8 text-on-surface">ELITE</h3>
            <p className="font-body text-on-surface-variant mb-10 min-h-[80px]">
              Continuous performance adjustment. Monthly calls and weekly
              data deep-dives.
            </p>
            <ul className="space-y-4 mb-12">
              {["Dynamic plan adjustments", "Monthly 1:1 check-ins", "Unlimited Email support"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-lg">check</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="font-headline text-3xl font-bold mb-10 text-primary">
              $99{" "}
              <span className="text-sm font-label text-on-surface-variant">/ MONTH</span>
            </div>
            <Link href="/assessment" className="block w-full bg-surface-container-high text-on-surface py-4 text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all text-center rounded-sm">
              JOIN ELITE
            </Link>
          </motion.div>

        </motion.div>
      </section>

      {/* ── Transition: pricing → CTA ─────────────────────── */}
      <SectionFade from="#F0E6D4" to="#E4DAC8" />

      {/* ── Final CTA (full-bleed) ────────────────────────── */}
      <motion.section
        className="relative py-32 text-center px-8 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
      >
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/transition-overhead.png"
            alt="Triathlon transition area overhead view"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "rgba(240,230,212,0.82)" }} />
        </div>
        {/* Ambient glow behind CTA headline */}
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(160,82,45,0.05) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div className="relative z-10">
          <Divider />
          <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-tighter mb-12 text-on-surface">
            Ready to evolve?
          </h2>
          <Link
            href="/pricing"
            className="inline-block bg-primary text-on-primary px-12 py-6 text-sm font-bold tracking-[0.2em] rounded-sm hover:bg-primary-dim hover:scale-105 active:scale-95 transition-all uppercase"
          >
            Start Your Assessment
          </Link>
        </div>
      </motion.section>

    </main>
  );
}

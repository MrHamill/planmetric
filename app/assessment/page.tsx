"use client";

import { motion } from "framer-motion";

export default function AssessmentPage() {
  return (
    <main className="pt-32 pb-20 px-8 md:px-24">

      {/* ── Header ────────────────────────────────────────── */}
      <motion.section
        className="max-w-3xl mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="font-label text-primary tracking-[0.3em] text-[10px] uppercase mb-6 block">
          Step 1 of 1
        </span>
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-none mb-6">
          Start Your
          <br />
          <span className="text-primary">Assessment.</span>
        </h1>
        <p className="font-body text-lg text-on-surface-variant max-w-xl leading-relaxed">
          Complete the intake form below to begin building your personalised plan.
          This takes 8–10 minutes and gives our coaches everything they need.
        </p>
      </motion.section>

      {/* ── Tally form placeholder ─────────────────────────── */}
      <motion.section
        className="max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-sm p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
          <span className="material-symbols-outlined text-primary text-4xl mb-6">assignment</span>
          <p className="font-label text-xs tracking-widest uppercase text-on-surface-variant mb-2">
            Tally Form
          </p>
          <p className="font-body text-on-surface-variant text-sm">
            Intake form will be embedded here.
          </p>
        </div>
      </motion.section>

    </main>
  );
}

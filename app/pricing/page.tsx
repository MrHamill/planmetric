"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CountUp } from "@/components/CountUp";

/* ─── Comparison table data ───────────────────────────────── */
const comparisonRows = [
  {
    feature: "Training Metrics",
    starter: "Standard (KM)",
    premium: "Advanced (KM/Watts)",
    elite: "Bio-Sync (KM/HRV)",
  },
  {
    feature: "Intake Form Analysis",
    starter: "—",
    premium: "check",
    elite: "check",
  },
  {
    feature: "Thermal Adaptation Tips",
    starter: "—",
    premium: "Basic (Celsius)",
    elite: "Dynamic (Celsius)",
  },
  {
    feature: "Coach Direct Support",
    starter: "—",
    premium: "—",
    elite: "Priority",
  },
  {
    feature: "Plan Revisions",
    starter: "—",
    premium: "Once",
    elite: "Monthly",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* ─── Page ────────────────────────────────────────────────── */
export default function PricingPage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.header
        className="mb-20 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="font-headline text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-none">
          Invest in <br />
          <span className="text-primary">Performance.</span>
        </h1>
        <p className="font-body text-xl text-on-surface-variant max-w-2xl font-light leading-relaxed">
          Precision-engineered training structures for the disciplined
          athlete. Every plan is calibrated to your physiological profile,
          focusing on KM benchmarks and thermal efficiency in Celsius.
        </p>
      </motion.header>

      {/* ── Pricing cards ─────────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="show"
      >

        {/* STARTER */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-surface p-10 flex flex-col justify-between hover:bg-surface-container-low transition-colors duration-500 border border-transparent hover:border-primary/20"
        >
          <div>
            <div className="mb-12">
              <span className="text-primary font-headline font-bold tracking-widest text-xs uppercase">
                Level 01
              </span>
            </div>
            <h2 className="font-headline text-4xl font-bold mb-4">STARTER</h2>
            <p className="text-on-surface-variant mb-12 text-sm leading-relaxed">
              Fundamental blueprints for common endurance goals. Immediate
              access to proven methodologies.
            </p>
            <ul className="space-y-4 mb-12">
              {[
                "Pre-built goal paths",
                "Instant digital download",
                "Standard metric tracking",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-on-surface/80">
                  <span className="material-symbols-outlined text-xs text-primary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-8">
              <span className="font-headline text-5xl font-bold">
                $<CountUp end={49} decimals={0} duration={1500} />
              </span>
              <span className="text-on-surface-variant text-xs font-label uppercase ml-2 tracking-widest">
                One-Time
              </span>
            </div>
            <Link href="/assessment" className="block w-full py-4 text-xs font-headline font-bold uppercase tracking-widest bg-surface-container-highest hover:bg-primary hover:text-on-primary transition-all duration-300 text-center">
              Pick Plan
            </Link>
          </div>
        </motion.div>

        {/* PREMIUM — featured */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-surface-container-low p-10 flex flex-col justify-between border border-primary/20 relative"
        >
          <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-label tracking-widest uppercase px-3 py-1 rounded-sm">
            MOST SELECTED
          </div>
          <div>
            <div className="flex justify-between items-start mb-12">
              <span className="text-primary font-headline font-bold tracking-widest text-xs uppercase">
                Level 02
              </span>
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
            <h2 className="font-headline text-4xl font-bold mb-4">PREMIUM</h2>
            <p className="text-on-surface-variant mb-12 text-sm leading-relaxed">
              Bespoke construction based on your physiological intake. A
              tactical roadmap for serious results.
            </p>
            <ul className="space-y-4 mb-12">
              {[
                "Data-driven intake analysis",
                "Pace & HR zones (KM based)",
                "Weekly schedule & Coach notes",
                "Final Review by Lead Coach",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-xs text-primary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-8">
              <span className="font-headline text-5xl font-bold">
                $<CountUp end={149} decimals={0} duration={1500} />
              </span>
              <span className="text-on-surface-variant text-xs font-label uppercase ml-2 tracking-widest">
                One-Time
              </span>
            </div>
            <Link href="/assessment" className="block w-full py-4 text-xs font-headline font-bold uppercase tracking-widest bg-primary text-on-primary hover:opacity-90 transition-all duration-300 text-center">
              Select Premium
            </Link>
          </div>
        </motion.div>

        {/* ELITE */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-surface p-10 flex flex-col justify-between hover:bg-surface-container-low transition-colors duration-500 border border-transparent hover:border-primary/20"
        >
          <div>
            <div className="mb-12">
              <span className="text-primary font-headline font-bold tracking-widest text-xs uppercase">
                Level 03
              </span>
            </div>
            <h2 className="font-headline text-4xl font-bold mb-4">ELITE</h2>
            <p className="text-on-surface-variant mb-12 text-sm leading-relaxed">
              Full concierge performance management. Adaptive training that
              evolves with your biometric data.
            </p>
            <ul className="space-y-4 mb-12">
              {[
                "Dynamic plan adjustments",
                "Monthly 1:1 check-ins",
                "Unlimited email support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-on-surface/80">
                  <span className="material-symbols-outlined text-xs text-primary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-8">
              <span className="font-headline text-5xl font-bold">
                $<CountUp end={99} decimals={0} duration={1500} />
              </span>
              <span className="text-on-surface-variant text-xs font-label uppercase ml-2 tracking-widest">
                / Month
              </span>
            </div>
            <Link href="/assessment" className="block w-full py-4 text-xs font-headline font-bold uppercase tracking-widest bg-surface-container-highest hover:bg-primary hover:text-on-primary transition-all duration-300 text-center">
              Join Elite
            </Link>
          </div>
        </motion.div>

      </motion.div>

      {/* ── Comparison table ──────────────────────────────── */}
      <motion.section
        className="mb-32"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h3 className="font-headline text-2xl font-bold mb-12 text-center">
          Compare Tiers
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="p-6 font-label text-xs uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">
                  Feature
                </th>
                <th className="p-6 font-label text-xs uppercase tracking-widest text-on-surface border-b border-outline-variant/10">
                  Starter
                </th>
                <th className="p-6 font-label text-xs uppercase tracking-widest text-primary border-b border-outline-variant/10">
                  Premium
                </th>
                <th className="p-6 font-label text-xs uppercase tracking-widest text-on-surface border-b border-outline-variant/10">
                  Elite
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <td className="p-6 border-b border-outline-variant/10 text-on-surface-variant">
                    {row.feature}
                  </td>
                  <td className="p-6 border-b border-outline-variant/10">
                    {row.starter === "check" ? (
                      <span className="material-symbols-outlined text-primary">check</span>
                    ) : row.starter}
                  </td>
                  <td className="p-6 border-b border-outline-variant/10">
                    {row.premium === "check" ? (
                      <span className="material-symbols-outlined text-primary">check</span>
                    ) : row.premium}
                  </td>
                  <td className="p-6 border-b border-outline-variant/10">
                    {row.elite === "check" ? (
                      <span className="material-symbols-outlined text-primary">check</span>
                    ) : row.elite}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ── Assessment CTA ────────────────────────────────── */}
      <motion.section
        className="relative bg-surface-container-low p-12 md:p-24 overflow-hidden group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-xl">
            <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Not sure where to start?
            </h2>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed">
              Our assessment engine analyses your current performance metrics,
              historical training volume, and physiological thresholds to
              recommend the ideal path.
            </p>
          </div>
          <Link
            href="/assessment"
            className="bg-primary text-on-primary px-10 py-5 text-sm font-headline font-bold uppercase tracking-widest hover:scale-105 transition-transform duration-300 whitespace-nowrap"
          >
            TAKE ASSESSMENT
          </Link>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors" />
      </motion.section>

    </main>
  );
}

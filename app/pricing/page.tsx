"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CountUp } from "@/components/CountUp";

/* ─── Full comparison table data ─────────────────────────── */
const comparisonRows = [
  { feature: "Plan Type", starter: "Template", premium: "Personalised", elite: "Personalised + Coached" },
  { feature: "Price", starter: "$29.99 one-time", premium: "$99.99 one-time", elite: "$99/month" },
  { feature: "Personalisation Level", starter: "Pre-built template", premium: "Fully customised from intake data", elite: "Fully customised + ongoing adjustments" },
  { feature: "Delivery Time", starter: "Instant download", premium: "Within 48 hours", elite: "Within 48 hours + monthly updates" },
  { feature: "Intake Form", starter: "\u2014", premium: "Yes \u2014 8\u201310 min detailed intake", elite: "Yes \u2014 8\u201310 min detailed intake" },
  { feature: "Strava Integration", starter: "\u2014", premium: "Yes \u2014 we analyse your last 30 days", elite: "Yes \u2014 ongoing data monitoring" },
  { feature: "Coach Review", starter: "\u2014", premium: "Yes \u2014 reviewed by head coach", elite: "Yes \u2014 reviewed by head coach" },
  { feature: "Monthly Check-ins", starter: "\u2014", premium: "\u2014", elite: "Yes \u2014 monthly video call" },
  { feature: "Plan Adjustments", starter: "\u2014", premium: "\u2014", elite: "Yes \u2014 unlimited adjustments" },
  { feature: "Race Execution Plan", starter: "Basic", premium: "Detailed with pacing strategy", elite: "Detailed + race week protocol" },
  { feature: "Direct Coach Support", starter: "\u2014", premium: "Email support", elite: "Priority email + monthly call" },
  { feature: "Brick Sessions", starter: "\u2014", premium: "check", elite: "Yes + race simulation sessions" },
  { feature: "Nutrition Guidance", starter: "\u2014", premium: "Basic guidelines", elite: "Personalised nutrition plan" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* ─── Page ────────────────────────────────────────────────── */
export default function PricingPage() {
  const [selected, setSelected] = useState<"premium" | "elite" | null>(null);
  const router = useRouter();

  const planNames: Record<string, string> = { premium: "Premium", elite: "Elite" };

  function handleCardClick(plan: "starter" | "premium" | "elite") {
    if (plan === "starter") {
      router.push("/plans");
      return;
    }
    setSelected(plan);
  }

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.header
        className="relative mb-20 max-w-3xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img src="/images/cyclist.png" alt="Cyclist on road bike in aero position" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "rgba(240,230,212,0.85)" }} />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-none text-on-surface">
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
      <div className="relative mb-8">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="show"
      >

        {/* STARTER */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleCardClick("starter")}
          className={`bg-surface-container p-10 flex flex-col justify-between border rounded-sm cursor-pointer transition-all duration-300 ${
            selected ? "opacity-70 border-outline/18" : "border-outline/18 hover:border-primary/40"
          }`}
        >
          <div>
            <div className="mb-12">
              <span className="text-secondary font-headline font-bold tracking-widest text-xs uppercase">
                Level 01
              </span>
            </div>
            <h2 className="font-headline text-4xl font-bold mb-4 text-on-surface">STARTER</h2>
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
                <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs text-primary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-8">
              <span className="font-headline text-5xl font-bold text-primary">
                $<CountUp end={29.99} decimals={2} duration={1500} />
              </span>
              <span className="text-on-surface-variant text-xs font-label uppercase ml-2 tracking-widest">
                One-Time
              </span>
            </div>
            <span className="block w-full py-4 text-xs font-headline font-bold uppercase tracking-widest bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all duration-300 text-center text-on-surface rounded-sm">
              Browse Plans
            </span>
          </div>
        </motion.div>

        {/* PREMIUM — featured */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleCardClick("premium")}
          className={`bg-surface-container p-10 flex flex-col justify-between relative rounded-sm cursor-pointer transition-all duration-300 ${
            selected === "premium"
              ? "border-2 border-primary scale-[1.02] shadow-[0_0_30px_rgba(160,82,45,0.12)]"
              : selected === "elite"
                ? "opacity-70 border border-primary/30"
                : "border border-primary/30"
          }`}
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
            <h2 className="font-headline text-4xl font-bold mb-4 text-on-surface">PREMIUM</h2>
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
                <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs text-primary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-8">
              <span className="font-headline text-5xl font-bold text-primary">
                $<CountUp end={99.99} decimals={2} duration={1500} />
              </span>
              <span className="text-on-surface-variant text-xs font-label uppercase ml-2 tracking-widest">
                One-Time
              </span>
            </div>
            <span className={`block w-full py-4 text-xs font-headline font-bold uppercase tracking-widest transition-all duration-300 text-center rounded-sm ${
              selected === "premium"
                ? "bg-primary text-on-primary"
                : "bg-primary text-on-primary hover:bg-primary-dim"
            }`}>
              {selected === "premium" ? "✓ Selected" : "Select Premium"}
            </span>
          </div>
        </motion.div>

        {/* ELITE */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleCardClick("elite")}
          className={`bg-surface-container p-10 flex flex-col justify-between rounded-sm cursor-pointer transition-all duration-300 ${
            selected === "elite"
              ? "border-2 border-primary scale-[1.02] shadow-[0_0_30px_rgba(160,82,45,0.12)]"
              : selected === "premium"
                ? "opacity-70 border border-outline/18"
                : "border border-outline/18 hover:border-primary/40"
          }`}
        >
          <div>
            <div className="mb-12">
              <span className="text-secondary font-headline font-bold tracking-widest text-xs uppercase">
                Level 03
              </span>
            </div>
            <h2 className="font-headline text-4xl font-bold mb-4 text-on-surface">ELITE</h2>
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
                <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs text-primary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-8">
              <span className="font-headline text-5xl font-bold text-primary">
                $<CountUp end={99} decimals={0} duration={1500} />
              </span>
              <span className="text-on-surface-variant text-xs font-label uppercase ml-2 tracking-widest">
                / Month
              </span>
            </div>
            <span className={`block w-full py-4 text-xs font-headline font-bold uppercase tracking-widest transition-all duration-300 text-center rounded-sm ${
              selected === "elite"
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface"
            }`}>
              {selected === "elite" ? "✓ Selected" : "Join Elite"}
            </span>
          </div>
        </motion.div>

      </motion.div>
      </div>

      {/* ── Confirm & Continue button ───────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="flex justify-center mb-32"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: "easeOut" as const }}
          >
            <Link
              href={`/assessment?plan=${selected}`}
              className="bg-primary text-on-primary px-12 py-5 text-sm font-headline font-bold uppercase tracking-widest hover:bg-primary-dim hover:scale-105 transition-all duration-300 rounded-sm"
            >
              Continue with {planNames[selected]} &rarr;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && <div className="mb-32" />}

      {/* ── Compare Tiers ────────────────────────────────── */}
      <motion.section
        className="mb-32"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h3 className="font-serif text-3xl font-bold mb-12 text-center text-on-surface">
          Compare Tiers
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container">
                <th className="p-3 sm:p-6 font-label text-xs uppercase tracking-widest text-on-surface-variant border-b border-outline/10">
                  Feature
                </th>
                <th className="p-3 sm:p-6 font-label text-xs uppercase tracking-widest text-on-surface border-b border-outline/10">
                  Starter
                </th>
                <th className="p-3 sm:p-6 font-label text-xs uppercase tracking-widest text-primary border-b border-outline/10 bg-primary/5">
                  Premium <span className="text-[9px] ml-1 bg-primary text-on-primary px-2 py-0.5 rounded-sm">MOST POPULAR</span>
                </th>
                <th className="p-3 sm:p-6 font-label text-xs uppercase tracking-widest text-on-surface border-b border-outline/10">
                  Elite
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 sm:p-6 border-b border-outline/10 text-on-surface-variant font-medium">
                    {row.feature}
                  </td>
                  <td className="p-3 sm:p-6 border-b border-outline/10 text-on-surface-variant">
                    {row.starter === "check" ? (
                      <span className="material-symbols-outlined text-primary">check</span>
                    ) : row.starter}
                  </td>
                  <td className="p-3 sm:p-6 border-b border-outline/10 text-on-surface-variant bg-primary/5">
                    {row.premium === "check" ? (
                      <span className="material-symbols-outlined text-primary">check</span>
                    ) : row.premium}
                  </td>
                  <td className="p-3 sm:p-6 border-b border-outline/10 text-on-surface-variant">
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
        className="relative bg-surface-container p-6 sm:p-12 md:p-24 overflow-hidden group rounded-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-xl">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 tracking-tight text-on-surface">
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
            className="bg-primary text-on-primary px-10 py-5 text-sm font-headline font-bold uppercase tracking-widest hover:bg-primary-dim hover:scale-105 transition-all duration-300 whitespace-nowrap rounded-sm"
          >
            TAKE ASSESSMENT
          </Link>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors" />
      </motion.section>

    </main>
  );
}

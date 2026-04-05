"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Palette ────────────────────────────────────────────────── */
const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BG = "rgba(245,245,240,0.03)";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";
const ACCENT_GLOW = "rgba(184,92,44,0.12)";
const ROW_ALT = "rgba(245,245,240,0.02)";

/* ─── Animations ─────────────────────────────────────────────── */
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

/* ─── Comparison table (Strava removed) ──────────────────────── */
const COMPARISON = [
  { feature: "Plan Type", starter: "Template", premium: "Personalised", elite: "Personalised + Coached" },
  { feature: "Price", starter: "$29.99 one-time", premium: "$99.99 one-time", elite: "$99/month" },
  { feature: "Personalisation", starter: "Pre-built template", premium: "Fully customised from intake data", elite: "Fully customised + ongoing adjustments" },
  { feature: "Delivery Time", starter: "Instant download", premium: "Within 48 hours", elite: "Within 48 hours + monthly updates" },
  { feature: "Intake Form", starter: "\u2014", premium: "8\u201310 min detailed intake", elite: "8\u201310 min detailed intake" },
  { feature: "Coach Review", starter: "\u2014", premium: "Reviewed by head coach", elite: "Reviewed by head coach" },
  { feature: "Monthly Check-ins", starter: "\u2014", premium: "\u2014", elite: "Monthly video call" },
  { feature: "Plan Adjustments", starter: "\u2014", premium: "\u2014", elite: "Unlimited adjustments" },
  { feature: "Race Execution", starter: "Basic", premium: "Detailed + pacing strategy", elite: "Detailed + race week protocol" },
  { feature: "Coach Support", starter: "\u2014", premium: "Email support", elite: "Priority email + monthly call" },
  { feature: "Brick Sessions", starter: "\u2014", premium: "\u2713", elite: "Race simulation sessions" },
  { feature: "Nutrition Guidance", starter: "\u2014", premium: "Basic guidelines", elite: "Personalised nutrition plan" },
];

/* ─── Plan cards ─────────────────────────────────────────────── */
const PLANS = [
  {
    key: "starter" as const,
    level: "01",
    name: "STARTER",
    line: "Proven templates for common goals.",
    features: ["Pre-built goal paths", "Instant digital download", "Standard metric tracking"],
    price: "$29.99",
    freq: "one-time",
    cta: "Browse Plans",
    featured: false,
  },
  {
    key: "premium" as const,
    level: "02",
    name: "PREMIUM",
    line: "Fully personalised to your exact data and race.",
    features: ["Data-driven intake analysis", "Pace & HR zones (KM based)", "Weekly schedule & Coach notes", "Final review by lead coach"],
    price: "$99.99",
    freq: "one-time",
    cta: "Select Premium",
    featured: true,
  },
  {
    key: "elite" as const,
    level: "03",
    name: "ELITE",
    line: "Dynamic monthly adjustments with 1:1 coaching.",
    features: ["Dynamic plan adjustments", "Monthly 1:1 check-ins", "Unlimited email support"],
    price: "$99",
    freq: "/month",
    cta: "Join Elite",
    featured: false,
  },
];

/* ═══════════════════════════════════════════════════════════════ */
export default function PricingPage() {
  const [showCompare, setShowCompare] = useState(false);
  const router = useRouter();

  function handleCardClick(plan: "starter" | "premium" | "elite") {
    if (plan === "starter") {
      router.push("/plans");
      return;
    }
    router.push(`/assessment?plan=${plan}`);
  }

  return (
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">

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

      {/* ═══════════════ HERO ═══════════════════════════════ */}
      <section className="min-h-[55vh] flex flex-col justify-end px-8 md:px-24 pt-40 pb-24 relative overflow-hidden">
        {/* Ghost word */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-headline font-extrabold text-[20vw] leading-none whitespace-nowrap uppercase"
            style={{ WebkitTextStroke: "1px rgba(245,245,240,0.05)", color: "transparent" }}
          >
            INVEST.
          </span>
        </div>

        <div className="relative z-10 max-w-3xl">
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
            style={{ color: ACCENT }}
            {...heroIn(0.1)}
          >
            Pricing
          </motion.span>

          <motion.h1
            className="font-headline text-[clamp(2.8rem,8vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight mb-6"
            {...heroIn(0.2)}
          >
            Choose your <span style={{ color: ACCENT }}>level</span>.
          </motion.h1>

          <motion.p
            className="font-body text-lg md:text-xl leading-relaxed max-w-lg"
            style={{ color: DIM }}
            {...heroIn(0.35)}
          >
            Choose your level. Every plan is built around you.
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="px-8 md:px-24"><div className="max-w-6xl mx-auto" style={{ height: 1, background: RULE }} /></div>

      {/* ═══════════════ CARDS ══════════════════════════════ */}
      <section className="py-24 md:py-32 px-8 md:px-24">
        <div className="max-w-6xl mx-auto">
          {/* 3-col grid — Premium card is taller via extra py */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan, i) => {
              return (
                <motion.div
                  key={plan.key}
                  id={plan.key}
                  className={`relative rounded-sm flex flex-col cursor-pointer group ${
                    plan.featured ? "p-10 md:p-12 md:-my-4 z-10" : "p-10"
                  }`}
                  style={{
                    background: CARD_BG,
                    border: plan.featured
                      ? `1.5px solid ${ACCENT}`
                      : `1px solid ${CARD_BORDER}`,
                    boxShadow: plan.featured
                      ? `0 0 40px ${ACCENT_GLOW}, 0 20px 60px rgba(0,0,0,0.4)`
                      : "none",
                  }}
                  onClick={() => handleCardClick(plan.key)}
                  {...fadeUp(i * 0.15)}
                  whileHover={{
                    y: -8,
                    boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 35px ${ACCENT_GLOW}`,
                    borderColor: ACCENT,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Hover glow layer */}
                  <div
                    className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 40%, ${ACCENT_GLOW} 0%, transparent 70%)` }}
                  />

                  {/* Orange hairline above Premium label */}
                  {plan.featured && (
                    <>
                      <div
                        className="absolute top-0 left-6 right-6 h-px"
                        style={{ background: ACCENT }}
                      />
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 font-label text-[10px] tracking-widest uppercase px-4 py-1 rounded-sm z-10"
                        style={{ background: ACCENT, color: TEXT }}
                      >
                        Most Selected
                      </span>
                    </>
                  )}

                  {/* Content */}
                  <div className="relative z-10 flex-1">
                    <span
                      className="font-label text-[10px] tracking-[0.35em] uppercase block mb-8"
                      style={{ color: plan.featured ? ACCENT : DIM }}
                    >
                      Level {plan.level}
                    </span>

                    <h2 className="font-headline text-2xl font-bold mb-2 tracking-wide">
                      {plan.name}
                    </h2>

                    <p className="font-body text-sm mb-8" style={{ color: DIM }}>
                      {plan.line}
                    </p>

                    {/* Price — biggest element */}
                    <div className="mb-8">
                      <span className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight">
                        {plan.price}
                      </span>
                      <span className="font-label text-xs ml-2 align-bottom" style={{ color: DIM }}>
                        {plan.freq}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-10">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm" style={{ color: DIM }}>
                          <span className="mt-0.5" style={{ color: ACCENT }}>&#10003;</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA button */}
                  <div className="relative z-10">
                    <span
                      className="block w-full py-4 text-xs font-label font-bold uppercase tracking-widest text-center rounded-sm transition-all duration-200 group-hover:scale-[1.01]"
                      style={
                        plan.featured
                          ? { background: ACCENT, color: TEXT }
                          : { border: `1px solid ${CARD_BORDER}`, color: TEXT }
                      }
                    >
                      {plan.cta}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Divider */}
      <div className="px-8 md:px-24"><div className="max-w-6xl mx-auto" style={{ height: 1, background: RULE }} /></div>

      {/* ═══════════════ COMPARISON TABLE ═══════════════════ */}
      <section className="py-24 md:py-32 px-8 md:px-24">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-4" {...fadeUp()}>
            <button
              onClick={() => setShowCompare((p) => !p)}
              className="inline-flex items-center gap-3 font-label text-xs font-bold tracking-widest uppercase px-10 py-3 rounded-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              style={{ border: `1px solid ${CARD_BORDER}`, color: TEXT }}
            >
              {showCompare ? "Hide Comparison" : "Compare All Plans"}
              <motion.svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                stroke="currentColor" strokeWidth="1.5"
                animate={{ rotate: showCompare ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path d="M2 4l4 4 4-4" />
              </motion.svg>
            </button>
          </motion.div>

          <AnimatePresence>
            {showCompare && (
              <motion.div
                className="overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
              >
                <p className="text-right mb-2 text-xs font-label sm:hidden" style={{ color: DIM }}>Scroll to compare →</p>
                <div className="mt-0 sm:mt-8 overflow-x-auto rounded-sm" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <table className="w-full text-left border-collapse" style={{ minWidth: 560 }}>
                    <thead>
                      <tr style={{ background: "rgba(245,245,240,0.04)" }}>
                        <th className="p-4 md:py-5 md:px-6 font-label text-[10px] uppercase tracking-[0.25em]" style={{ color: DIM, borderBottom: `1px solid ${CARD_BORDER}` }}>
                          Feature
                        </th>
                        <th className="p-4 md:py-5 md:px-6 font-label text-[10px] uppercase tracking-[0.25em]" style={{ color: TEXT, borderBottom: `1px solid ${CARD_BORDER}` }}>
                          Starter
                        </th>
                        <th
                          className="p-4 md:py-5 md:px-6 font-label text-[10px] uppercase tracking-[0.25em]"
                          style={{ color: ACCENT, borderBottom: `1px solid ${ACCENT}`, background: "rgba(184,92,44,0.06)" }}
                        >
                          Premium
                          <span className="ml-2 text-[9px] px-2 py-0.5 rounded-sm" style={{ background: ACCENT, color: TEXT }}>
                            POPULAR
                          </span>
                        </th>
                        <th className="p-4 md:py-5 md:px-6 font-label text-[10px] uppercase tracking-[0.25em]" style={{ color: TEXT, borderBottom: `1px solid ${CARD_BORDER}` }}>
                          Elite
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-body text-sm">
                      {COMPARISON.map((row, ri) => (
                        <tr
                          key={row.feature}
                          style={{
                            borderBottom: `1px solid ${CARD_BORDER}`,
                            background: ri % 2 === 1 ? ROW_ALT : "transparent",
                          }}
                        >
                          <td className="p-4 md:py-4 md:px-6 font-medium" style={{ color: TEXT }}>
                            {row.feature}
                          </td>
                          <td className="p-4 md:py-4 md:px-6" style={{ color: DIM }}>
                            {row.starter === "\u2713"
                              ? <span style={{ color: ACCENT, fontWeight: 700 }}>\u2713</span>
                              : row.starter === "\u2014"
                                ? <span style={{ opacity: 0.3 }}>\u2014</span>
                                : row.starter}
                          </td>
                          <td
                            className="p-4 md:py-4 md:px-6"
                            style={{ color: DIM, background: ri % 2 === 1 ? "rgba(184,92,44,0.04)" : "rgba(184,92,44,0.06)" }}
                          >
                            {row.premium === "\u2713"
                              ? <span style={{ color: ACCENT, fontWeight: 700 }}>\u2713</span>
                              : row.premium === "\u2014"
                                ? <span style={{ opacity: 0.3 }}>\u2014</span>
                                : row.premium}
                          </td>
                          <td className="p-4 md:py-4 md:px-6" style={{ color: DIM }}>
                            {row.elite === "\u2713"
                              ? <span style={{ color: ACCENT, fontWeight: 700 }}>\u2713</span>
                              : row.elite === "\u2014"
                                ? <span style={{ opacity: 0.3 }}>\u2014</span>
                                : row.elite}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Divider */}
      <div className="px-8 md:px-24"><div className="max-w-6xl mx-auto" style={{ height: 1, background: RULE }} /></div>

      {/* ═══════════════ DECISION HELPER ══════════════════ */}
      <section className="py-32 md:py-40 px-8 md:px-24 text-center">
        <motion.h2
          className="font-headline text-3xl md:text-4xl font-bold mb-12"
          {...fadeUp()}
        >
          Not sure which level is right for <span style={{ color: ACCENT }}>you</span>?
        </motion.h2>

        <div className="max-w-xl mx-auto space-y-4">
          {[
            { text: "This is my first structured plan", tier: "Starter", anchor: "starter" },
            { text: "I\u2019m training for a specific race with a specific goal", tier: "Premium", anchor: "premium" },
            { text: "I want a coach in my corner month to month", tier: "Elite", anchor: "elite" },
          ].map((item, i) => (
            <motion.button
              key={item.anchor}
              onClick={() => document.getElementById(item.anchor)?.scrollIntoView({ behavior: "smooth" })}
              className="w-full flex items-center justify-between py-5 px-6 rounded-sm cursor-pointer transition-all duration-200 hover:scale-[1.01] text-left group"
              style={{
                background: CARD_BG,
                border: `1px solid ${CARD_BORDER}`,
              }}
              {...fadeUp(i * 0.1)}
              whileHover={{ borderColor: ACCENT }}
            >
              <span className="font-body text-base" style={{ color: "rgba(245,245,240,0.75)" }}>
                {item.text}
              </span>
              <span className="font-label text-sm font-bold tracking-widest uppercase shrink-0 ml-4 transition-colors duration-200 group-hover:text-white" style={{ color: ACCENT }}>
                &rarr; {item.tier}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ═══════════════ FOOTER ═════════════════════════════ */}
      <footer
        className="w-full py-10 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-6"
        style={{ background: BG, borderTop: `1px solid ${CARD_BORDER}` }}
      >
        <span className="font-label text-[11px] tracking-[0.3em] uppercase font-bold">Plan Metric</span>
        <div className="flex gap-8">
          {[
            ["About", "/about"],
            ["Plans", "/plans"],
            ["Terms", "/terms"],
            ["Privacy", "/privacy"],
            ["Instagram", "https://www.instagram.com/planmetric"],
          ].map(([label, href]) => (
            <Link key={label} href={href} className="font-label text-[10px] tracking-widest uppercase transition-colors duration-200 hover:text-white" style={{ color: DIM }}>
              {label}
            </Link>
          ))}
        </div>
        <span className="font-label text-[10px] tracking-widest uppercase" style={{ color: DIM }}>&copy; 2026 Plan Metric. Precision Endurance.</span>
      </footer>
    </main>
  );
}

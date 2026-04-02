"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* ─── Palette ────────────────────────────────────────────────── */
const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BG = "rgba(245,245,240,0.03)";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

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

/* ─── Level badge colours ────────────────────────────────────── */
const LEVEL_COLORS: Record<string, { text: string; bg: string }> = {
  Beginner:     { text: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  Intermediate: { text: "#f97316", bg: "rgba(249,115,22,0.12)" },
  Elite:        { text: "#a855f7", bg: "rgba(168,85,247,0.12)" },
};

/* ─── Plan data ──────────────────────────────────────────────── */
const EVENTS = [
  { name: "5K", category: "Running" },
  { name: "10K", category: "Running" },
  { name: "Half Marathon", category: "Running" },
  { name: "Marathon", category: "Running" },
  { name: "Olympic Tri", category: "Triathlon" },
  { name: "70.3", category: "Triathlon" },
  { name: "Ironman", category: "Triathlon" },
] as const;

const LEVELS = ["Beginner", "Intermediate", "Elite"] as const;

const DURATIONS: Record<string, Record<string, string>> = {
  "5K":            { Beginner: "8 weeks",  Intermediate: "8 weeks",  Elite: "6 weeks" },
  "10K":           { Beginner: "10 weeks", Intermediate: "10 weeks", Elite: "8 weeks" },
  "Half Marathon": { Beginner: "12 weeks", Intermediate: "12 weeks", Elite: "10 weeks" },
  "Marathon":      { Beginner: "16 weeks", Intermediate: "16 weeks", Elite: "14 weeks" },
  "Olympic Tri":   { Beginner: "12 weeks", Intermediate: "12 weeks", Elite: "10 weeks" },
  "70.3":          { Beginner: "16 weeks", Intermediate: "16 weeks", Elite: "14 weeks" },
  "Ironman":       { Beginner: "20 weeks", Intermediate: "20 weeks", Elite: "16 weeks" },
};

const DESCRIPTIONS: Record<string, Record<string, string>> = {
  "5K": {
    Beginner: "Build from zero to your first 5K. Walk-run intervals progressing to continuous running.",
    Intermediate: "Improve your 5K time with structured tempo and interval sessions.",
    Elite: "Race-specific sharpening for competitive 5K performance.",
  },
  "10K": {
    Beginner: "A progressive plan to complete your first 10K with confidence.",
    Intermediate: "Structured training to break through your 10K plateau.",
    Elite: "High-intensity periodisation for competitive 10K racing.",
  },
  "Half Marathon": {
    Beginner: "Gradual long-run progression to complete 21.1km comfortably.",
    Intermediate: "Tempo-focused training for a strong half marathon performance.",
    Elite: "Advanced periodisation targeting sub-threshold half marathon pace.",
  },
  "Marathon": {
    Beginner: "A safe, progressive approach to conquering 42.2km.",
    Intermediate: "Structured mileage building with race-specific workouts.",
    Elite: "Peak performance plan with advanced marathon-pace sessions.",
  },
  "Olympic Tri": {
    Beginner: "Balanced swim-bike-run foundation for your first Olympic distance.",
    Intermediate: "Improve across all three disciplines with brick-specific training.",
    Elite: "Race-sharp Olympic distance plan with transition optimisation.",
  },
  "70.3": {
    Beginner: "Build endurance across all disciplines for your first 70.3.",
    Intermediate: "Structured 70.3 preparation with pacing strategy integration.",
    Elite: "Advanced half-iron plan with power and pace zone specificity.",
  },
  "Ironman": {
    Beginner: "A comprehensive plan to get you to the Ironman finish line.",
    Intermediate: "Volume and intensity management for a strong Ironman performance.",
    Elite: "Elite Ironman preparation with detailed race execution strategy.",
  },
};


const PREVIEW_WEEKS: Record<string, string[]> = {
  "5K": [
    "Mon: Rest",
    "Tue: Easy run 20min (walk breaks OK)",
    "Wed: Cross-training 30min",
    "Thu: Intervals \u2014 6x1min fast / 2min walk",
    "Fri: Rest",
    "Sat: Easy run 25min",
    "Sun: Long walk/run 35min",
  ],
  "10K": [
    "Mon: Rest",
    "Tue: Easy run 30min",
    "Wed: Tempo run 20min at moderate effort",
    "Thu: Easy run 25min + 4 strides",
    "Fri: Rest",
    "Sat: Intervals \u2014 5x3min at 10K effort",
    "Sun: Long run 45min easy",
  ],
  "Half Marathon": [
    "Mon: Rest",
    "Tue: Easy run 40min",
    "Wed: Tempo 25min at half marathon effort",
    "Thu: Easy run 35min",
    "Fri: Rest or cross-training",
    "Sat: Progression run 45min",
    "Sun: Long run 60min easy",
  ],
  "Marathon": [
    "Mon: Rest",
    "Tue: Easy run 45min",
    "Wed: Tempo 30min at marathon pace",
    "Thu: Easy run 40min + strides",
    "Fri: Rest",
    "Sat: Intervals 6x1km at 10K pace",
    "Sun: Long run 90min easy",
  ],
  "Olympic Tri": [
    "Mon: Swim 1500m technique focus",
    "Tue: Bike 45min easy + Run 20min easy (brick)",
    "Wed: Swim 2000m with intervals",
    "Thu: Run 40min with tempo block",
    "Fri: Rest or yoga",
    "Sat: Bike 60min with efforts",
    "Sun: Long run 50min easy",
  ],
  "70.3": [
    "Mon: Swim 2000m endurance",
    "Tue: Bike 60min steady + Run 25min (brick)",
    "Wed: Swim 2500m with threshold sets",
    "Thu: Run 50min with tempo",
    "Fri: Rest",
    "Sat: Bike 90min with race-pace efforts",
    "Sun: Long run 60min easy",
  ],
  "Ironman": [
    "Mon: Swim 3000m endurance",
    "Tue: Bike 75min steady + Run 30min (brick)",
    "Wed: Swim 3500m with threshold",
    "Thu: Run 60min with marathon pace block",
    "Fri: Rest or easy swim",
    "Sat: Bike 120min progressive",
    "Sun: Long run 90min easy",
  ],
};

/* ─── 5K download file paths ─────────────────────────────────── */
const FREE_PLAN_FILES: Record<string, string> = {
  Beginner:     "/plans/5k-beginner.html",
  Intermediate: "/plans/5k-intermediate.html",
  Elite:        "/plans/5k-elite.html",
};

/* ─── What's included in every starter plan ─────────────────── */
const PLAN_INCLUDES = [
  "Day by day session breakdown for every week",
  "Exact distances, paces and heart rate zones \u2014 nothing vague",
  "Weekly focus and volume targets",
  "Coach tips and race day strategy",
  "Glossary of all training terms",
  "Delivered as a beautifully designed HTML file",
  "Mobile friendly \u2014 use it anywhere",
  "Yours forever \u2014 instant download after purchase",
];

/* ─── Preview Modal ──────────────────────────────────────────── */
function PreviewModal({
  event,
  level,
  onClose,
}: {
  event: string;
  level: string;
  onClose: () => void;
}) {
  const week = PREVIEW_WEEKS[event] || PREVIEW_WEEKS["5K"];
  const isFree = event === "5K";

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.70)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="max-w-lg w-full p-8 md:p-12 rounded-sm relative overflow-y-auto max-h-[90vh]"
        style={{ background: "#161616", border: `1px solid ${CARD_BORDER}` }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors hover:text-white"
          style={{ color: DIM }}
        >
          &#10005;
        </button>

        <span className="font-label text-[10px] uppercase tracking-widest block mb-2" style={{ color: ACCENT }}>
          Plan Preview
        </span>
        <h3 className="font-headline text-2xl font-bold mb-2">
          {event} &mdash; {level}
        </h3>
        <p className="font-body text-sm mb-8" style={{ color: DIM }}>
          {DURATIONS[event]?.[level]} plan &middot;{" "}
          {isFree ? (
            <span style={{ color: ACCENT, fontWeight: 700 }}>FREE</span>
          ) : (
            "$29.99 one-time"
          )}
        </p>

        {/* What's included */}
        <p className="font-label text-[10px] uppercase tracking-widest mb-4" style={{ color: DIM }}>
          What&rsquo;s included
        </p>
        <ul className="space-y-3 mb-10">
          {PLAN_INCLUDES.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm">
              <span style={{ color: ACCENT }} className="mt-0.5">&#10003;</span>
              <span style={{ color: "rgba(245,245,240,0.7)" }}>{item}</span>
            </li>
          ))}
        </ul>

        {isFree ? (
          <Link
            href={FREE_PLAN_FILES[level] || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 text-xs font-label font-bold tracking-widest uppercase text-center rounded-sm transition-transform duration-200 hover:scale-[1.02]"
            style={{ background: ACCENT, color: TEXT }}
          >
            Download Free Plan
          </Link>
        ) : (
          <button
            onClick={() => {
              onClose();
              /* small delay so modal closes before redirect */
              setTimeout(() => {
                fetch("/api/checkout/starter", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ event, level }),
                })
                  .then(r => r.json())
                  .then(d => { if (d.url) window.location.href = d.url; });
              }, 150);
            }}
            className="block w-full py-4 text-xs font-label font-bold tracking-widest uppercase text-center rounded-sm transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
            style={{ background: ACCENT, color: TEXT }}
          >
            Purchase &mdash; $29.99
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function PlansPage() {
  const [preview, setPreview] = useState<{ event: string; level: string } | null>(null);
  const [filter, setFilter] = useState<"All" | "Running" | "Triathlon">("All");
  const [purchasing, setPurchasing] = useState<string | null>(null);

  async function handlePurchase(event: string, level: string) {
    const key = `${event}-${level}`;
    if (purchasing) return;
    setPurchasing(key);
    try {
      const res = await fetch("/api/checkout/starter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, level }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setPurchasing(null);
    } catch {
      setPurchasing(null);
    }
  }

  const filteredEvents = filter === "All"
    ? EVENTS
    : EVENTS.filter((e) => e.category === filter);

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
            className="font-headline font-extrabold text-[22vw] leading-none whitespace-nowrap uppercase"
            style={{ WebkitTextStroke: "1px rgba(245,245,240,0.05)", color: "transparent" }}
          >
            PLANS.
          </span>
        </div>

        <div className="relative z-10 max-w-3xl">
          <motion.span
            className="font-label text-[11px] tracking-[0.35em] uppercase block mb-6"
            style={{ color: ACCENT }}
            {...heroIn(0.1)}
          >
            Starter Plans
          </motion.span>

          <motion.h1
            className="font-headline text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-tight mb-6"
            {...heroIn(0.2)}
          >
            Pre-built plans.{" "}
            <br className="hidden md:block" />
            Proven <span style={{ color: ACCENT }}>results</span>.
          </motion.h1>

          <motion.p
            className="font-body text-lg md:text-xl leading-relaxed max-w-xl mb-4"
            style={{ color: DIM }}
            {...heroIn(0.35)}
          >
            Choose your event and difficulty level. Each plan is built on
            verified training methodologies &mdash; instant download.
          </motion.p>

          <motion.p
            className="font-label text-xs tracking-wider"
            style={{ color: DIM }}
            {...heroIn(0.45)}
          >
            5K plans are free. All other plans $29.99 one-time.
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="px-8 md:px-24"><div className="max-w-6xl mx-auto" style={{ height: 1, background: RULE }} /></div>

      {/* ═══════════════ FILTER + PLANS ═════════════════════ */}
      <section className="py-24 md:py-32 px-8 md:px-24">
        <div className="max-w-6xl mx-auto">

          {/* Filter pills */}
          <div className="flex gap-4 mb-20">
            {(["All", "Running", "Triathlon"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className="font-label text-sm tracking-widest uppercase px-7 py-2.5 rounded-full transition-all duration-200 cursor-pointer"
                style={
                  filter === tab
                    ? { background: ACCENT, color: TEXT, fontWeight: 700 }
                    : { border: `1px solid ${CARD_BORDER}`, color: DIM }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Event groups */}
          {filteredEvents.map((event) => {
            const isFree = event.name === "5K";
            return (
              <div key={event.name} className="mb-24">
                {/* Group header with orange hairline */}
                <motion.div className="mb-10" {...fadeUp()}>
                  <div className="flex items-center gap-4 mb-3">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">
                      {event.name}
                    </h2>
                    <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>
                      {event.category}
                    </span>
                    {isFree && (
                      <span
                        className="font-label text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                        style={{ background: ACCENT, color: TEXT }}
                      >
                        FREE
                      </span>
                    )}
                  </div>
                  <div className="w-16 h-px" style={{ background: ACCENT }} />
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {LEVELS.map((level, i) => {
                    const lc = LEVEL_COLORS[level];
                    return (
                      <motion.div
                        key={level}
                        className="relative rounded-sm flex flex-col group"
                        style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                        {...fadeUp(i * 0.1)}
                        whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(0,0,0,0.4)", borderColor: ACCENT }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* FREE badge */}
                        {isFree && (
                          <div
                            className="absolute top-3 right-3 font-label text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full z-10"
                            style={{ background: ACCENT, color: TEXT }}
                          >
                            FREE
                          </div>
                        )}

                        <div className="p-8 flex-1 flex flex-col">
                          {/* Distance — large at top */}
                          <span className="font-headline text-2xl font-bold tracking-tight mb-1">
                            {event.name}
                          </span>

                          {/* Level tag — small */}
                          <span
                            className="font-label text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full self-start mb-6"
                            style={{ color: lc.text, background: lc.bg }}
                          >
                            {level}
                          </span>

                          {/* Description — muted */}
                          <p className="font-body text-sm leading-relaxed mb-4 min-h-[48px]" style={{ color: DIM }}>
                            {DESCRIPTIONS[event.name]?.[level]}
                          </p>

                          {/* Duration */}
                          <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>
                            {DURATIONS[event.name]?.[level]}
                          </span>
                        </div>

                        <div className="px-8 pb-8">
                          {/* Price — bold and clear */}
                          <div className="font-headline text-3xl font-extrabold mb-6" style={{ color: isFree ? ACCENT : TEXT }}>
                            {isFree ? "FREE" : "$29.99"}
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => setPreview({ event: event.name, level })}
                              className="flex-1 py-3 text-xs font-label font-bold tracking-widest uppercase rounded-sm transition-all duration-200 hover:scale-[1.01] cursor-pointer text-center"
                              style={{ border: `1px solid ${CARD_BORDER}`, color: TEXT }}
                            >
                              Preview
                            </button>
                            {isFree ? (
                              <Link
                                href={FREE_PLAN_FILES[level] || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-3 text-xs font-label font-bold tracking-widest uppercase rounded-sm transition-all duration-200 hover:scale-[1.01] text-center"
                                style={{ background: ACCENT, color: TEXT }}
                              >
                                Download
                              </Link>
                            ) : (
                              <button
                                onClick={() => handlePurchase(event.name, level)}
                                disabled={purchasing === `${event.name}-${level}`}
                                className="flex-1 py-3 text-xs font-label font-bold tracking-widest uppercase rounded-sm transition-all duration-200 hover:scale-[1.01] text-center cursor-pointer disabled:opacity-50"
                                style={{ background: ACCENT, color: TEXT }}
                              >
                                {purchasing === `${event.name}-${level}` ? "Loading..." : "Purchase"}
                              </button>
                            )}
                          </div>

                          {isFree && (
                            <p className="font-label text-[10px] text-center mt-3 tracking-wide" style={{ color: DIM }}>
                              See what a Plan Metric plan looks like
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <PreviewModal
            event={preview.event}
            level={preview.level}
            onClose={() => setPreview(null)}
          />
        )}
      </AnimatePresence>

      {/* ═══════════════ FOOTER ═════════════════════════════ */}
      <footer
        className="w-full py-10 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-6"
        style={{ background: BG, borderTop: `1px solid ${CARD_BORDER}` }}
      >
        <span className="font-label text-[11px] tracking-[0.3em] uppercase font-bold">Plan Metric</span>
        <div className="flex gap-8">
          {[
            ["Terms", "/terms"],
            ["Privacy", "/privacy"],
            ["Instagram", "https://www.instagram.com/planmetric"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="font-label text-[10px] tracking-widest uppercase transition-colors duration-200 hover:text-white" style={{ color: DIM }}>
              {label}
            </a>
          ))}
        </div>
        <span className="font-label text-[10px] tracking-widest uppercase" style={{ color: DIM }}>&copy; 2026 Plan Metric. Precision Endurance.</span>
      </footer>
    </main>
  );
}

"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* ─── Plan data ──────────────────────────────────────────── */
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
    "Thu: Intervals — 6x1min fast / 2min walk",
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
    "Sat: Intervals — 5x3min at 10K effort",
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

/* ─── Card variants ──────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ─── Preview Modal ──────────────────────────────────────── */
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-surface-container-low p-8 md:p-12 max-w-lg w-full rounded-sm border border-outline/18 relative"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <span className="font-label text-[10px] text-secondary uppercase tracking-widest block mb-2">
          Week 1 Preview
        </span>
        <h3 className="font-serif text-2xl font-bold mb-2 text-on-surface">
          {event} &mdash; {level}
        </h3>
        <p className="font-body text-sm text-on-surface-variant mb-6">
          {DURATIONS[event]?.[level]} plan &middot;{" "}
          {isFree ? (
            <>
              <span className="line-through text-on-surface-variant/50">$29.99</span>{" "}
              <span className="text-primary font-bold">FREE</span>
            </>
          ) : (
            "$29.99 one-time"
          )}
        </p>
        <ul className="space-y-3 mb-8">
          {week.map((day) => (
            <li key={day} className="flex items-start gap-3 text-sm">
              <span className="material-symbols-outlined text-primary text-base mt-0.5">event</span>
              <span className="text-on-surface-variant">{day}</span>
            </li>
          ))}
        </ul>
        <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-6">
          {isFree ? "Full plan available for free download" : "Full plan unlocked after purchase"}
        </p>
        <Link
          href={isFree ? "#" : "/assessment"}
          className="block w-full bg-primary text-on-primary py-4 text-xs font-bold tracking-widest uppercase hover:bg-primary-dim transition-all text-center rounded-sm"
        >
          {isFree ? "Download Free Plan" : "Purchase \u2014 $29.99"}
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ─── Level badge colour ─────────────────────────────────── */
function levelBadgeClass(level: string) {
  switch (level) {
    case "Beginner":
      return "bg-bike/15 text-bike";
    case "Intermediate":
      return "bg-run/15 text-run";
    case "Elite":
      return "bg-brick/15 text-brick";
    default:
      return "bg-primary/15 text-primary";
  }
}

/* ─── Page ────────────────────────────────────────────────── */
export default function PlansPage() {
  const [preview, setPreview] = useState<{ event: string; level: string } | null>(null);
  const [filter, setFilter] = useState<"All" | "Running" | "Triathlon">("All");

  const filteredEvents = filter === "All"
    ? EVENTS
    : EVENTS.filter((e) => e.category === filter);

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.header
        className="relative mb-16 max-w-3xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img src="/images/cyclist.png" alt="Cyclist on road bike" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "rgba(240,230,212,0.85)" }} />
        </div>
        <span className="font-label text-secondary tracking-[0.3em] text-[10px] uppercase mb-4 block">
          Starter Plans
        </span>
        <h1 className="font-serif text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-none text-on-surface">
          Pre-built plans.
          <br />
          <span className="text-primary">Proven results.</span>
        </h1>
        <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Choose your event and difficulty level. Each plan is built on verified
          training methodologies &mdash; instant download, $29.99 one-time.
          <span className="text-primary font-bold"> 5K plans are free.</span>
        </p>
      </motion.header>

      {/* ── Filter tabs ───────────────────────────────────── */}
      <div className="flex gap-4 mb-12">
        {(["All", "Running", "Triathlon"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`font-label text-xs tracking-widest uppercase px-4 py-2 rounded-sm transition-all ${
              filter === tab
                ? "bg-primary text-on-primary font-bold"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Plan cards ────────────────────────────────────── */}
      {filteredEvents.map((event) => {
        const isFree = event.name === "5K";
        return (
          <div key={event.name} className="mb-16">
            <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface flex items-center gap-3">
              {event.name}
              <span className="font-label text-[10px] text-secondary uppercase tracking-widest">
                {event.category}
              </span>
              {isFree && (
                <span className="font-label text-[10px] font-bold uppercase tracking-widest bg-primary text-on-primary px-3 py-1 rounded-sm">
                  FREE
                </span>
              )}
            </h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              {LEVELS.map((level) => (
                <motion.div
                  key={level}
                  variants={cardItem}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-surface-container p-8 rounded-sm border border-outline/18 hover:border-primary/40 transition-colors flex flex-col justify-between overflow-hidden"
                >
                  {/* FREE ribbon for 5K */}
                  {isFree && (
                    <div className="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-label font-bold tracking-widest uppercase px-3 py-1 rounded-sm">
                      FREE
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`font-label text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm ${levelBadgeClass(level)}`}>
                        {level}
                      </span>
                      <span className="font-label text-xs text-on-surface-variant">
                        {DURATIONS[event.name]?.[level]}
                      </span>
                    </div>
                    <p className="font-body text-sm text-on-surface-variant mb-6 min-h-[60px]">
                      {DESCRIPTIONS[event.name]?.[level]}
                    </p>
                  </div>
                  <div>
                    <div className="font-headline text-2xl font-bold text-primary mb-6">
                      {isFree ? (
                        <span className="flex items-center gap-3">
                          <span className="line-through text-on-surface-variant/40 text-lg font-normal">$29.99</span>
                          <span className="text-primary">FREE</span>
                        </span>
                      ) : (
                        "$29.99"
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPreview({ event: event.name, level })}
                        className="flex-1 py-3 text-xs font-bold tracking-widest uppercase bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all text-center rounded-sm"
                      >
                        Preview
                      </button>
                      {isFree ? (
                        <Link
                          href="#"
                          className="flex-1 py-3 text-xs font-bold tracking-widest uppercase bg-primary text-on-primary hover:bg-primary-dim transition-all text-center rounded-sm"
                        >
                          Download Free
                        </Link>
                      ) : (
                        <Link
                          href="/assessment"
                          className="flex-1 py-3 text-xs font-bold tracking-widest uppercase bg-primary text-on-primary hover:bg-primary-dim transition-all text-center rounded-sm"
                        >
                          Purchase
                        </Link>
                      )}
                    </div>
                    {isFree && (
                      <p className="font-label text-[10px] text-on-surface-variant/60 text-center mt-3 tracking-wide">
                        See what a Plan Metric plan looks like
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      })}

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

    </main>
  );
}

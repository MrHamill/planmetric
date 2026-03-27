"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "CHOOSE YOUR PATH",
    body: "Select your discipline — Running, Triathlon, or Cycling — and choose the plan level that matches your goals. Complete our deep-dive questionnaire covering fitness, goals, schedule, and injury history. This isn't just a form; it's the architectural blueprint of your next season.",
    badge: null,
    image: "/images/swimmer.png",
    phase: "Phase: Assessment",
    cta: null,
  },
  {
    number: "02",
    title: "8\u201310 MIN INTAKE",
    body: "Precision starts with data. We analyse your Strava history, injury history, specific heart rate zones (BPM), and your current weekly volume in KM. Your plan is engineered around your exact thresholds, availability, and race date.",
    badge: null,
    image: "/images/intake-form.png",
    phase: "Phase: Data Integration",
    cta: null,
  },
  {
    number: "03",
    title: "48H DELIVERY",
    body: "Within 48 hours, your personalised plan is built around everything about you — your fitness, your race, your schedule, your body. No generic templates. Your sessions are calibrated to your exact thresholds and delivered directly to your dashboard.",
    badge: null,
    image: "/images/athlete-phone.png",
    phase: "Phase: Deployment",
    cta: "START YOUR INTAKE",
  },
];

/* ─── Animated step circle ────────────────────────────────── */
function StepCircle({ number }: { number: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-10 h-10 rounded-full border border-primary flex items-center justify-center bg-background z-10"
    >
      <span className="font-label text-primary text-xs font-bold">{number}</span>
    </motion.div>
  );
}

/* ─── Animated SVG timeline ───────────────────────────────── */
function TimelineLine() {
  const ref = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <div
      ref={containerRef}
      className="hidden md:block absolute left-[1.1rem] top-0 bottom-0 w-px"
      aria-hidden
    >
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 2 100"
      >
        <motion.path
          ref={ref}
          d="M1 0 V 100"
          stroke="rgba(160,82,45,0.2)"
          strokeWidth="0.6"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>
    </div>
  );
}

/* ─── Step row ────────────────────────────────────────────── */
function StepRow({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const delay = index * 0.15;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" as const, delay }}
      className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative"
    >
      {/* Step circle */}
      <div className="md:col-span-1 flex items-center justify-center md:justify-start">
        <StepCircle number={step.number} />
      </div>

      {/* Image — left on even rows (mobile: always first) */}
      <div className={`md:col-span-5 ${isEven ? "md:order-first" : "md:order-last"} order-first`}>
        <div className="overflow-hidden rounded-xl max-w-[400px] mx-auto md:mx-0">
          <img
            src={step.image}
            alt={step.title}
            className="w-full h-[240px] md:h-[300px] object-cover hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      </div>

      {/* Text */}
      <div className={`md:col-span-6 ${isEven ? "" : "md:order-first"}`}>
        <span className="font-label text-[10px] text-primary uppercase tracking-widest mb-3 block">
          {step.phase}
        </span>
        <h3 className="font-headline text-3xl font-bold mb-6 tracking-tight">
          {step.title}
        </h3>
        <p className="font-body text-on-surface-variant leading-relaxed mb-6">
          {step.body}
        </p>

        {step.badge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-sm">
            <span className="material-symbols-outlined text-primary text-sm">error</span>
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              {step.badge}
            </span>
          </div>
        )}

        {step.cta && (
          <Link
            href="/assessment"
            className="inline-block bg-primary text-on-primary px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:opacity-90 transition-all uppercase"
          >
            {step.cta}
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function ProcessPage() {
  return (
    <main className="pt-32 pb-20">

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.section
        className="px-8 max-w-7xl mx-auto mb-32"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-3/5">
            <span className="font-label text-primary tracking-[0.3em] uppercase text-[10px] mb-4 block">
              Engineered Performance
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
              A Precise Path to
              <br />
              <span className="text-primary-dim">Peak Endurance.</span>
            </h1>
          </div>
          <div className="w-full md:w-2/5 md:pl-12">
            <p className="font-body text-on-surface-variant text-lg leading-relaxed border-l border-outline-variant/30 pl-8">
              Our process is built on the philosophy of limited volume for
              maximum quality. We focus on the metric, so you can focus on the
              movement.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── Steps ─────────────────────────────────────────── */}
      <section className="px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 relative">
          <TimelineLine />
          {steps.map((step, index) => (
            <StepRow key={step.number} step={step} index={index} />
          ))}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <motion.section
        className="mt-40 px-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto p-12 md:p-24 text-center rounded-sm relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img
              src="/images/start-line.png"
              alt="Triathlete standing on road at sunrise"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "rgba(240,230,212,0.7)" }} />
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8 tracking-tighter">
            Ready for <br />
            <span className="text-primary">Precision.</span>
          </h2>
          <p className="font-body text-on-surface-variant max-w-xl mx-auto mb-12">
            Join a community of disciplined athletes who value data as much as
            effort.
          </p>
          <Link
            href="/assessment"
            className="px-10 py-5 bg-primary text-on-primary font-bold tracking-widest uppercase rounded-sm text-sm hover:bg-primary-dim hover:scale-105 transition-all duration-300"
          >
            START YOUR ASSESSMENT
          </Link>
        </div>
      </motion.section>

    </main>
  );
}

"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "CHOOSE YOUR PATH",
    body: "Select your discipline — Running, Triathlon, or Cycling — and choose the plan level that matches your goals. From pre-built templates to fully personalised coaching, every path starts with understanding where you are.",
    badge: null,
    image: "/images/process-step1.jpg",
    phase: "Phase: Initialization",
    cta: null,
  },
  {
    number: "02",
    title: "8–10 MIN INTAKE",
    body: "Precision starts with data. Connect your Strava history and complete our deep-dive questionnaire. We analyse your injury history, specific heart rate zones (BPM), and your current weekly volume in KM. This isn't just a form; it's the architectural blueprint of your next season.",
    badge: null,
    image: "/images/process-step2.jpg",
    phase: "Phase: Data Integration",
    cta: null,
  },
  {
    number: "03",
    title: "48H DELIVERY",
    body: "Within 48 hours, your personalised plan is built around everything about you — your fitness, your race, your schedule, your body. No generic templates. Your sessions are calibrated to your exact thresholds and delivered directly to your dashboard.",
    badge: null,
    image: "/images/process-step3.jpg",
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
          stroke="rgba(255,255,255,0.12)"
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative"
    >
      {/* Step circle */}
      <div className="md:col-span-1 flex items-center justify-center md:justify-start">
        <StepCircle number={step.number} />
      </div>

      {/* Text */}
      <div className="md:col-span-5">
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
            href="/pricing"
            className="inline-block bg-primary text-on-primary px-8 py-4 text-sm font-bold tracking-widest rounded-sm hover:opacity-90 transition-all uppercase"
          >
            {step.cta}
          </Link>
        )}
      </div>

      {/* Image */}
      <div className="md:col-span-6 md:pl-12">
        <div className="aspect-[16/9] bg-surface-container-low rounded-sm overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
          <img
            src={step.image}
            alt={step.title}
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700"
          />
          <div className="absolute bottom-6 left-6 z-20">
            <span className="font-label text-xs text-primary-dim uppercase tracking-widest">
              {step.phase}
            </span>
          </div>
        </div>
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
        <div className="flex flex-col md:flex-row items-baseline gap-8">
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
        <div className="max-w-4xl mx-auto bg-surface-container-low p-12 md:p-24 text-center rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <span className="material-symbols-outlined text-primary/10 text-9xl">
              architecture
            </span>
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8 tracking-tighter">
            Ready for <br />
            <span className="text-primary">Precision.</span>
          </h2>
          <p className="font-body text-on-surface-variant max-w-xl mx-auto mb-12">
            Join a community of disciplined athletes who value data as much as
            effort.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link
              href="/pricing"
              className="px-10 py-5 bg-primary text-on-primary font-bold tracking-widest uppercase rounded-sm text-sm hover:scale-105 transition-transform duration-300"
            >
              BEGIN ONBOARDING
            </Link>
            <Link
              href="/pricing"
              className="font-label text-xs tracking-widest uppercase border-b border-primary/30 pb-1 hover:border-primary transition-colors"
            >
              View Pricing Structure
            </Link>
          </div>
        </div>
      </motion.section>

    </main>
  );
}

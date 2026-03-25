"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const pillarsVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const pillarItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function MethodologyPage() {
  return (
    <main className="pt-32 pb-20">

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.section
        className="px-8 md:px-16 lg:px-24 mb-32"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="grid md:grid-cols-12 gap-12 items-end max-w-7xl mx-auto">
          <div className="md:col-span-8">
            <span className="font-label text-primary uppercase tracking-[0.3em] text-[10px] mb-6 block">
              Precision Engineering
            </span>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none mb-8">
              METHODOLOGY
              <span className="text-primary">.</span>
            </h1>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl font-light leading-relaxed">
              Moving beyond automated templates. We transform raw biological
              data into a structured path toward peak human performance.
            </p>
          </div>
          <div className="md:col-span-4 hidden md:block border-l border-outline-variant/30 pl-8 pb-4">
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-outline-variant/10 pb-2">
                <span className="font-label text-[10px] text-on-surface-variant uppercase">
                  Current Temp
                </span>
                <span className="font-label text-sm text-on-surface">
                  18.5{" "}
                  <span className="text-[10px] align-top text-primary">°C</span>
                </span>
              </div>
              <div className="flex justify-between items-baseline border-b border-outline-variant/10 pb-2">
                <span className="font-label text-[10px] text-on-surface-variant uppercase">
                  VO2 Max Goal
                </span>
                <span className="font-label text-sm text-on-surface">
                  64.2{" "}
                  <span className="text-[10px] align-top text-primary">METRIC</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Pillars ───────────────────────────────────────── */}
      <motion.section
        className="px-8 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-6 mb-32 max-w-7xl mx-auto"
        variants={pillarsVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* Pillar 1 */}
        <motion.div
          variants={pillarItem}
          className="bg-surface-container-low p-10 flex flex-col justify-between min-h-[400px]"
        >
          <div>
            <span className="material-symbols-outlined text-primary mb-8 text-3xl">monitoring</span>
            <h3 className="font-headline text-2xl font-bold mb-4">
              Your Metrics, Your Life
            </h3>
            <p className="font-body text-on-surface-variant leading-relaxed">
              Your data isn&apos;t just numbers; it&apos;s a physiological
              narrative. We integrate sleep, HRV, and stress levels to adjust
              load in real-time.
            </p>
          </div>
          <div className="mt-8">
            <div className="w-full bg-primary-container h-px mb-4 opacity-30" />
            <span className="font-label text-[10px] text-primary tracking-widest uppercase">
              Integration: Garmin, Whoop, Oura
            </span>
          </div>
        </motion.div>

        {/* Pillar 2 */}
        <motion.div
          variants={pillarItem}
          className="bg-surface-container-high p-10 flex flex-col justify-between min-h-[400px]"
        >
          <div>
            <span className="material-symbols-outlined text-primary mb-8 text-3xl">psychology</span>
            <h3 className="font-headline text-2xl font-bold mb-4">
              Human Review vs. Automated Templates
            </h3>
            <p className="font-body text-on-surface-variant leading-relaxed">
              Algorithms provide the base, but humans provide the nuance.
              Every block is vetted by an endurance specialist to ensure
              safety and logic.
            </p>
          </div>
          <div className="mt-8 flex gap-2">
            <div className="px-3 py-1 bg-background text-[10px] font-label tracking-tighter uppercase border border-outline-variant/20 text-on-surface-variant">
              No Black Boxes
            </div>
            <div className="px-3 py-1 bg-background text-[10px] font-label tracking-tighter uppercase border border-outline-variant/20 text-on-surface-variant">
              Total Transparency
            </div>
          </div>
        </motion.div>

        {/* Pillar 3 */}
        <motion.div
          variants={pillarItem}
          className="bg-surface-container-low p-10 flex flex-col justify-between min-h-[400px]"
        >
          <div>
            <span className="material-symbols-outlined text-primary mb-8 text-3xl">settings_input_component</span>
            <h3 className="font-headline text-2xl font-bold mb-4">
              Precision Engineering for Endurance
            </h3>
            <p className="font-body text-on-surface-variant leading-relaxed">
              We optimise for the long game. Micro-adjustments in volume and
              intensity based on specific race-day environmental data.
            </p>
          </div>
          <div className="mt-8">
            <div className="flex items-end gap-1">
              <span className="font-headline text-4xl font-bold">12.4</span>
              <span className="font-label text-xs text-primary pb-1 uppercase tracking-widest">
                KM Increment
              </span>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ── Physiological Mapping ─────────────────────────── */}
      <motion.section
        className="bg-surface-container-lowest py-32 px-8 md:px-16 lg:px-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20">
            <div className="md:w-1/2">
              <h2 className="font-headline text-4xl font-bold mb-12 tracking-tight">
                Physiological Mapping
              </h2>
              <motion.div
                className="space-y-16"
                variants={pillarsVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
              >
                {/* HR Zones */}
                <motion.div variants={pillarItem}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-primary">favorite</span>
                    <h4 className="font-headline text-lg font-bold uppercase tracking-tight">
                      Heart Rate Zones
                    </h4>
                  </div>
                  <p className="font-body text-on-surface-variant mb-6 text-sm">
                    Zone 2 isn&apos;t just &ldquo;easy.&rdquo; We calculate
                    your specific metabolic threshold to maximise fat
                    oxidation without inducing CNS fatigue.
                  </p>
                  <div className="space-y-3">
                    <div className="w-full bg-surface-container h-1 overflow-hidden">
                      <div className="bg-primary h-full w-[65%]" />
                    </div>
                    <div className="flex justify-between font-label text-[10px] text-on-surface-variant uppercase">
                      <span>AeT Threshold</span>
                      <span>142 BPM</span>
                    </div>
                  </div>
                </motion.div>

                {/* VO2 Max */}
                <motion.div variants={pillarItem}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-primary">air</span>
                    <h4 className="font-headline text-lg font-bold uppercase tracking-tight">
                      VO2 Max Metrics
                    </h4>
                  </div>
                  <p className="font-body text-on-surface-variant mb-6 text-sm">
                    Beyond the simple score. We track anaerobic capacity and
                    power at VO2 Max to ensure your engine is prepared for
                    varied terrain.
                  </p>
                  <div className="bg-surface-container p-6 border-l border-primary">
                    <span className="font-label text-[10px] text-primary uppercase tracking-[0.2em] block mb-2">
                      Current Efficiency
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline text-3xl font-bold">58.5</span>
                      <span className="font-label text-xs text-on-surface-variant">mL/kg/min</span>
                    </div>
                  </div>
                </motion.div>

                {/* Dynamic Constraints */}
                <motion.div variants={pillarItem}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-primary">event_busy</span>
                    <h4 className="font-headline text-lg font-bold uppercase tracking-tight">
                      Dynamic Constraints
                    </h4>
                  </div>
                  <p className="font-body text-on-surface-variant text-sm">
                    Work-life balance and past injuries are treated as hard
                    data points. If your schedule shifts, the plan
                    adapts—preserving the integrity of the block.
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Data transformation panel */}
            <motion.div
              className="md:w-1/2 relative min-h-[600px] flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-[120px]" />
              <div className="relative w-full aspect-square border border-outline-variant/20 p-12 overflow-hidden flex flex-col justify-center">
                <div className="mb-8">
                  <span className="font-label text-[10px] text-primary tracking-widest uppercase mb-2 block">
                    Data Transformation
                  </span>
                  <h3 className="font-headline text-5xl font-extrabold leading-tight">
                    FROM DATA
                    <br />
                    TO DESIGN.
                  </h3>
                </div>
                <div className="space-y-6">
                  {[
                    { n: "01", text: "Raw .FIT file ingestion and error scrubbing.", active: false },
                    { n: "02", text: "Correlation of HRV against historical workout load.", active: false },
                    { n: "03", text: "Human verification of metabolic thresholds.", active: false },
                    { n: "04", text: "Interactive HTML Plan delivery to your dashboard.", active: true },
                  ].map(({ n, text, active }) => (
                    <div key={n} className="flex items-center gap-4 text-on-surface-variant">
                      <span
                        className={`font-label text-xs border px-2 py-1 ${
                          active
                            ? "border-primary text-primary font-bold"
                            : "border-outline-variant/40"
                        }`}
                      >
                        {n}
                      </span>
                      <span className={`font-body text-sm ${active ? "text-on-surface" : ""}`}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── HTML Plan Interface ───────────────────────────── */}
      <motion.section
        className="px-8 md:px-16 lg:px-24 py-32 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-4xl">
          <span className="font-label text-primary uppercase tracking-[0.3em] text-[10px] mb-6 block">
            The Output
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8 tracking-tighter">
            THE HTML PLAN INTERFACE.
          </h2>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-12 max-w-2xl">
            No PDFs. No messy spreadsheets. Your training plan is delivered as
            a bespoke HTML interface—beautifully designed, fully collapsible,
            and accessible on any device.
          </p>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={pillarsVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              { icon: "unfold_less", label: "Collapsible Blocks" },
              { icon: "devices", label: "Fully Responsive" },
              { icon: "visibility", label: "High Legibility" },
              { icon: "sync", label: "Live Updates" },
            ].map(({ icon, label }) => (
              <motion.div key={label} variants={pillarItem} className="space-y-2">
                <span className="material-symbols-outlined text-primary">{icon}</span>
                <p className="font-label text-[10px] uppercase tracking-widest">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <motion.section
        className="px-8 md:px-16 lg:px-24 py-32 bg-surface-container-low mx-8 md:mx-16 lg:mx-24 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="font-headline text-4xl md:text-6xl font-extrabold mb-10 tracking-tight">
          READY TO BUILD YOUR PLAN?
        </h2>
        <Link
          href="/pricing"
          className="bg-primary text-on-primary px-12 py-5 font-headline font-bold text-lg hover:bg-primary-dim transition-colors active:scale-95 inline-flex items-center gap-4 group"
        >
          START THE ASSESSMENT
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Link>
        <p className="mt-8 font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
          Initial assessment takes 8–10 minutes.
        </p>
      </motion.section>

    </main>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export default function HeartRateZonesArticle() {
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

      <article className="pt-40 pb-32 px-8 md:px-24">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" as const }}>
            <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: ACCENT, background: "rgba(184,92,44,0.10)" }}>Training</span>
              <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>6 min read</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
              How to read your heart rate zones &mdash; and why most athletes <span style={{ color: ACCENT }}>ignore</span> them
            </h1>
          </motion.div>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <motion.p {...fadeUp(0.1)}>
              Heart rate zones are one of the most powerful tools in endurance training. They tell you exactly how hard your body is working, whether you are building aerobic fitness or burning through glycogen reserves you will need later. Yet the majority of amateur athletes either train without zones entirely or use numbers they have never calibrated.
            </motion.p>

            <motion.p {...fadeUp(0.12)}>
              The result is predictable. Most age-group athletes spend the majority of their training in a no-man&rsquo;s land &mdash; too hard to build aerobic base, too easy to develop threshold. Research from Norwegian coaching best-practice confirms that elite endurance athletes across cycling, running, rowing and triathlon spend 80&ndash;90% of their training at low intensity, below ventilatory threshold one. The remaining 10&ndash;20% is split between threshold and high-intensity work. Most amateurs invert this ratio.
            </motion.p>

            <motion.div {...fadeUp(0.14)}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The five-zone system explained</h2>
              <p>The T1&ndash;T5 zone model used in triathlon coaching maps directly to what your body is doing physiologically at each intensity level.</p>
            </motion.div>

            <motion.div {...fadeUp(0.16)}>
              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Zone</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>% Max HR</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Feel</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["T1 &mdash; Recovery", "<65%", "Effortless conversation"],
                      ["T2 &mdash; Aerobic Base", "65&ndash;75%", "Comfortable, sustainable for hours"],
                      ["T3 &mdash; Tempo", "75&ndash;85%", "Comfortably hard, short sentences"],
                      ["T4 &mdash; VO2max", "85&ndash;92%", "Hard, laboured breathing"],
                      ["T5 &mdash; Anaerobic", ">92%", "Unsustainable beyond 2 min"],
                    ].map(([zone, hr, feel], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3" style={{ color: TEXT }} dangerouslySetInnerHTML={{ __html: zone }} />
                        <td className="p-3" style={{ color: DIM }} dangerouslySetInnerHTML={{ __html: hr }} />
                        <td className="p-3" style={{ color: DIM }}>{feel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.p {...fadeUp(0.18)}>
              Zone 2 is the most underused zone in amateur training. This is where 80% of aerobic adaptation occurs &mdash; improved fat oxidation, mitochondrial density, capillary growth and cardiac output. Yet most athletes skip straight to Zone 3 because it feels more productive. It is not. Training in the grey zone between aerobic and threshold produces moderate fatigue without the specific adaptations of either end.
            </motion.p>

            <motion.div {...fadeUp(0.2)}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Your zones are not the same across disciplines</h2>
              <p>This is where most triathletes go wrong. Running produces the highest heart rate of the three disciplines because of total-body muscle recruitment and gravitational loading. Cycling heart rate sits 5&ndash;10 BPM lower at the same effort. Swimming runs 10&ndash;15 BPM below running due to the horizontal position, water cooling and the absence of gravitational load.</p>
            </motion.div>

            <motion.p {...fadeUp(0.22)}>
              A Zone 2 run at 145 BPM should correspond to roughly 135&ndash;140 BPM on the bike and 130&ndash;135 BPM in the pool. Using the same zone numbers across all three disciplines means you are either under-training one or over-training another. Each discipline needs its own zones, established through a field test.
            </motion.p>

            <motion.div {...fadeUp(0.24)}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>How to calibrate your zones properly</h2>
              <p>The Karvonen formula uses heart rate reserve rather than max heart rate alone, producing more accurate zones:</p>
              <div className="my-6 p-6 rounded-sm" style={{ background: "rgba(245,245,240,0.03)", border: `1px solid ${CARD_BORDER}` }}>
                <p className="font-label text-sm tracking-wide" style={{ color: ACCENT }}>Training HR = Resting HR + (% &times; (Max HR &minus; Resting HR))</p>
                <p className="mt-3 text-sm" style={{ color: DIM }}>Example: Resting HR 55, Max HR 185, targeting 70% &rarr; 55 + (0.70 &times; 130) = 146 BPM</p>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.26)}>
              <p>For field testing by discipline:</p>
              <ul className="list-none space-y-3 my-6">
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Run:</strong> 30-minute all-out time trial. Average HR of the final 20 minutes equals your functional threshold heart rate.</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Bike:</strong> 20-minute FTP test. 95% of average power gives your FTP. Average HR during the test equals your cycling threshold heart rate.</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Swim:</strong> 400m + 200m time trial using the Critical Swim Speed formula to establish pace zones.</span></li>
              </ul>
            </motion.div>

            <motion.div {...fadeUp(0.28)}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>When to retest</h2>
              <p>Zones are not permanent. As fitness improves, your thresholds shift upward. Zones based on stale data lead to undertrained athletes doing sessions that no longer produce adaptation. Retest every 6&ndash;8 weeks during your build phase, and after any significant illness or training break.</p>
            </motion.div>

            <motion.div {...fadeUp(0.3)}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The 80/20 rule is not optional</h2>
              <p>Norwegian coaching research is unambiguous. Across disciplines, the athletes who improve most consistently follow polarised or pyramidal intensity distributions &mdash; 80&ndash;90% of their training below threshold, with 2&ndash;3 quality sessions per week at or above it. Recovery days must be genuinely easy, not moderate. High-intensity work requires 48&ndash;72 hours of recovery before the next quality session. Ignoring this leads to accumulated fatigue, suppressed HRV, and plateau.</p>
            </motion.div>

            <motion.p {...fadeUp(0.32)}>
              The takeaway is simple. Establish your zones properly. Train in the right ones. Retest regularly. And spend the vast majority of your time in Zones 1 and 2, even when it feels counterintuitively slow. The aerobic base is the foundation &mdash; everything else is built on top of it.
            </motion.p>

            {/* CTA */}
            <motion.div className="mt-16 pt-12" style={{ borderTop: `1px solid ${RULE}` }} {...fadeUp(0.34)}>
              <p className="font-headline text-xl font-bold mb-4">Ready to train smarter?</p>
              <Link href="/plans" className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]" style={{ background: ACCENT, color: TEXT }}>
                View our plans &rarr;
              </Link>
            </motion.div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="w-full py-10 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-6" style={{ background: BG, borderTop: `1px solid ${CARD_BORDER}` }}>
        <span className="font-label text-[11px] tracking-[0.3em] uppercase font-bold">Plan Metric</span>
        <div className="flex gap-8">
          {[["Terms", "/terms"], ["Privacy", "/privacy"], ["Instagram", "https://www.instagram.com/planmetric"]].map(([label, href]) => (
            <Link key={label} href={href} className="font-label text-[10px] tracking-widest uppercase transition-colors duration-200 hover:text-white" style={{ color: DIM }}>{label}</Link>
          ))}
        </div>
        <span className="font-label text-[10px] tracking-widest uppercase" style={{ color: DIM }}>&copy; 2026 Plan Metric. Precision Endurance.</span>
      </footer>
    </main>
  );
}

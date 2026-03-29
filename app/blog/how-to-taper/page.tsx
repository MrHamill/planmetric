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

export default function HowToTaperArticle() {
  return (
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
      <div className="pointer-events-none fixed inset-0 z-50" style={{ opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

      <article className="pt-40 pb-32 px-8 md:px-24">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" as const }}>
            <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: "#ef4444", background: "rgba(239,68,68,0.10)" }}>Racing</span>
              <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>5 min read</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
              How to taper before race day without losing <span style={{ color: ACCENT }}>fitness</span>
            </h1>
          </motion.div>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <motion.p {...fadeUp(0.1)}>
              The taper is the part of training that makes athletes the most nervous. After months of building volume and intensity, deliberately doing less feels wrong. The fear is simple: if I stop training hard, I will lose what I have built. The research says the opposite. A well-executed taper does not reduce fitness &mdash; it allows accumulated fatigue to dissipate so that the fitness you have already built can express itself fully on race day.
            </motion.p>

            <motion.div {...fadeUp(0.12)}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>How long should you taper?</h2>
              <p>The optimal taper duration from triathlon coaching research is 8&ndash;14 days. For marathon runners, the standard protocol is a three-week progressive taper. The exact duration depends on your race distance and how much training load you have been carrying.</p>

              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Phase</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Duration</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Focus</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Peak", "4\u20136 weeks pre-race", "Race-specific intensity, volume reduction begins"],
                      ["Taper", "2\u20133 weeks pre-race", "Volume drops significantly, intensity maintained"],
                      ["Race week", "Final 7 days", "Sharpening, rest, race execution"],
                    ].map(([phase, dur, focus], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3 font-medium" style={{ color: TEXT }}>{phase}</td>
                        <td className="p-3" style={{ color: DIM }}>{dur}</td>
                        <td className="p-3" style={{ color: DIM }}>{focus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.14)}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The golden rule: reduce volume, maintain intensity</h2>
              <p>This is the single most important principle of tapering and the one most athletes get wrong. Volume drops by 20&ndash;50% across the taper period, but intensity stays the same. You still run at threshold pace, still hit race-power intervals on the bike, still swim at CSS pace. You simply do less of it.</p>
              <p className="mt-4">For marathon runners, the standard progression is: reduce volume by 20% in the first taper week, 40% in the second, and 50% in race week relative to your peak training week. The long run shortens significantly &mdash; your last truly long run should be 3&ndash;4 weeks before race day.</p>
            </motion.div>

            <motion.div {...fadeUp(0.16)}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Why cutting intensity kills performance</h2>
              <p>When athletes get nervous during taper, they tend to drop both volume and intensity. This is a mistake. Cutting intensity removes the neuromuscular stimulus that keeps your fast-twitch fibres sharp. The result is that you arrive at the start line feeling sluggish, flat and heavy &mdash; exactly what you were trying to avoid.</p>
              <p className="mt-4">Short, fast strides in race week keep your legs responsive. These are not hard sessions &mdash; 4&ndash;6 repetitions of 15&ndash;20 seconds at race pace or slightly faster, with full walking recovery. They maintain neural recruitment patterns without adding training stress.</p>
            </motion.div>

            <motion.div {...fadeUp(0.18)}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Managing taper anxiety</h2>
              <p>Phantom fatigue is real. During taper, many athletes feel worse before they feel better. Legs feel heavy, motivation drops, and there is a persistent worry that fitness is evaporating. This is normal. Your body is consolidating adaptations, repairing micro-damage and replenishing glycogen stores. The fitness is not disappearing &mdash; it is being unlocked.</p>
              <p className="mt-4">Norwegian coaching principles emphasise that athletes should train to improve, not to prove fitness in training. The taper is the ultimate expression of this philosophy. You have done the work. The taper is where you allow that work to pay off.</p>
            </motion.div>

            <motion.div {...fadeUp(0.2)}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Sleep and recovery during taper</h2>
              <p>The taper period is when sleep quality matters most. Target 8&ndash;9 hours per night. Sleep is the most powerful recovery intervention available and is routinely sacrificed during peak training blocks. The taper is your opportunity to rebuild the sleep debt you have been accumulating.</p>
              <p className="mt-4">Nutrition shifts during taper too. Your training volume is dropping, but carbohydrate intake should stay constant or increase slightly in the final 48 hours before race day. This is the carbohydrate loading window &mdash; 8&ndash;10 g/kg bodyweight per day of simple, low-fibre carbohydrates to maximise glycogen storage.</p>
            </motion.div>

            <motion.div {...fadeUp(0.22)}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Race-week sharpening</h2>
              <p>The final week before race day should include one or two short race-specific efforts. For triathletes, this means a short ride in your tri suit on your race bike with 10&ndash;15 minutes at race power, followed by a 10-minute run at race pace. For runners, a short session with strides at goal pace. These sessions should leave you feeling sharp, not tired.</p>
              <p className="mt-4">Active recovery sessions &mdash; Zone 1 swimming, easy spinning, walking &mdash; fill the remaining days. Total training time in race week should be roughly 50% of your peak week.</p>
            </motion.div>

            <motion.p {...fadeUp(0.24)}>
              The taper is not where fitness is built. It is where fitness is revealed. Trust the process, maintain intensity, reduce volume, sleep well, and arrive at the start line knowing that every session you completed in the preceding months is ready to express itself when it matters most.
            </motion.p>

            <motion.div className="mt-16 pt-12" style={{ borderTop: `1px solid ${RULE}` }} {...fadeUp(0.26)}>
              <p className="font-headline text-xl font-bold mb-4">Ready to train smarter?</p>
              <Link href="/plans" className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]" style={{ background: ACCENT, color: TEXT }}>
                View our plans &rarr;
              </Link>
            </motion.div>
          </div>
        </div>
      </article>

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

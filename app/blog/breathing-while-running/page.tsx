import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Do I Breathe Properly When Running?",
  description: "Learn evidence-based breathing techniques for running: nose vs mouth, rhythmic patterns by intensity zone, diaphragmatic breathing drills, side stitch prevention, and cold weather strategies.",
  openGraph: {
    title: "How Do I Breathe Properly When Running?",
    description: "Evidence-based breathing techniques for every running intensity: rhythmic patterns, diaphragmatic training, side stitch fixes, and cold weather strategies.",
    type: "article",
  },
  alternates: { canonical: "/blog/breathing-while-running" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

const faq = [
  {
    q: "Should I breathe through my nose or mouth when running?",
    a: "It depends on intensity. At easy effort (Zone 1-2), nasal breathing is more metabolically efficient and helps regulate pace. As intensity increases to Zone 3 and above, your air demand exceeds nasal capacity and mouth breathing becomes necessary. Research shows no significant performance difference between the two at matched intensities, so let effort dictate your breathing route.",
  },
  {
    q: "What causes a side stitch when running?",
    a: "Side stitches (exercise-related transient abdominal pain) affect around 70% of runners annually and are more common in younger or less experienced athletes. The primary causes are irritation of the abdominal cavity lining from torso movement and blood flow changes to the diaphragm. Eating large meals, sugary drinks, or high-fat foods within 1-3 hours of running significantly increases risk.",
  },
  {
    q: "What is rhythmic breathing and does it prevent injury?",
    a: "Rhythmic breathing synchronises your inhale and exhale cycles with your footstrikes. Using odd-count patterns like 3:2 (inhale for 3 steps, exhale for 2) alternates which foot absorbs the exhale impact, distributing stress more evenly across both sides of the body. This reduces asymmetric loading and may lower injury risk over time.",
  },
  {
    q: "How do I stop hyperventilating during hard runs?",
    a: "Hyperventilation during hard efforts usually stems from chest breathing rather than diaphragmatic breathing. Train your diaphragm by practising belly breathing lying down, then progress to seated, walking, and easy jogging. During hard intervals, focus on a controlled exhale rather than forcing the inhale. The inhale will happen naturally when you empty your lungs fully.",
  },
  {
    q: "Is it safe to run in cold weather if breathing hurts?",
    a: "Cold dry air can irritate airways and trigger bronchospasm, causing tightness, coughing, and wheezing. Use a buff or scarf over your mouth to warm and humidify incoming air, start with an indoor warm-up, and nose-breathe at easy pace. Below -15 degrees Celsius, genuine airway risk increases and indoor alternatives are recommended. Runners with asthma should carry an inhaler.",
  },
];

export default function BreathingWhileRunningArticle() {
  return (
    <>
    <ArticleJsonLd title="How Do I Breathe Properly When Running?" description="Evidence-based breathing techniques for every running intensity: rhythmic patterns, diaphragmatic training, side stitch fixes, and cold weather strategies." slug="breathing-while-running" datePublished="2026-05-06" />
    <FaqJsonLd items={faq} />
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
          <FadeInHero>
            <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: ACCENT, background: "rgba(184,92,44,0.10)" }}>Run</span>
              <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>9 min read</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
              How do I breathe properly when running &mdash; and why your <span style={{ color: ACCENT }}>lungs</span> deserve a training plan too
            </h1>
          </FadeInHero>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <FadeIn delay={0.1}>
              <p>Breathing is the one thing every runner does, every second of every session, yet almost nobody trains it deliberately. You will spend months building aerobic base, refining cadence, and dialling in nutrition &mdash; but let your breathing pattern default to whatever your body improvises under fatigue. The result is often shallow chest breathing, asymmetric impact loading, side stitches, and a metabolic cost that is higher than it needs to be.</p>
            </FadeIn>

            <FadeIn delay={0.12}>
              <p>The good news is that breathing is a trainable skill. Research shows that deliberate breathing strategies can reduce your resting heart rate, improve gas exchange efficiency, lower perceived exertion, and even reduce injury risk. This guide covers the evidence behind each technique and gives you a framework matched to your training intensity.</p>
            </FadeIn>

            <FadeIn delay={0.14}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Nose vs mouth: let intensity decide</h2>
              <p>The nose-versus-mouth debate has a simple answer: both are correct, at different intensities. A study published in the International Journal of Exercise Science (PMC5466403) found no significant performance difference between nasal and oral breathing at matched workloads. However, nasal breathing was more metabolically efficient, producing a lower ventilatory equivalent for oxygen (VeqO2). The trade-off is that nasal breathing alone produces a higher heart rate at maximal intensity, because your airways simply cannot move enough air.</p>
            </FadeIn>

            <FadeIn delay={0.16}>
              <p>The practical rule is straightforward. At easy effort &mdash; Zone 1 and Zone 2 &mdash; nasal breathing is ideal. If you cannot maintain a conversation while breathing through your nose, you are running too hard for an easy day. At moderate effort (Zone 3), transition to inhaling through your nose and exhaling through your mouth. At high intensity (Zone 4 and Zone 5), mouth breathing becomes necessary because air demand exceeds what your nasal passages can deliver.</p>
            </FadeIn>

            <FadeIn delay={0.18}>
              <p>This is also a useful self-regulating tool. If you set out for an easy run and find you cannot nose-breathe comfortably, your pace is too aggressive. The nose acts as a built-in governor for aerobic training.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Rhythmic breathing: match your lungs to your legs</h2>
              <p>Rhythmic breathing synchronises your inhale and exhale cycles with your footstrikes. The key insight is that the greatest impact stress on your body occurs at the moment you begin to exhale, because the diaphragm relaxes and your core loses stability. If you always exhale on the same foot, that side absorbs disproportionate impact load over thousands of strides.</p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <p>Odd-count breathing patterns solve this. A 3:2 pattern (inhale for 3 steps, exhale for 2 steps) alternates which foot receives the exhale impact, distributing stress more evenly between left and right sides. This reduces asymmetric loading and may lower the risk of overuse injuries over time.</p>
            </FadeIn>

            <FadeIn delay={0.24}>
              <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Intensity</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Zone</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Pattern</th>
                    <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Breathing route</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Easy / Recovery", "Z1-Z2", "3:3 or 3:2", "Nose only"],
                      ["Moderate / Tempo", "Z3", "2:2", "Nose in / mouth out"],
                      ["Hard / Threshold", "Z4", "2:1", "Mouth"],
                      ["Max / Intervals", "Z5", "1:1", "Mouth"],
                    ].map(([intensity, zone, pattern, route], i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <td className="p-3" style={{ color: TEXT }}>{intensity}</td>
                        <td className="p-3" style={{ color: DIM }}>{zone}</td>
                        <td className="p-3" style={{ color: ACCENT }}>{pattern}</td>
                        <td className="p-3" style={{ color: DIM }}>{route}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>

            <FadeIn delay={0.26}>
              <p>Learning rhythmic breathing takes practice. Start lying on your back, counting breaths against an imaginary footstrike cadence. Progress to walking with the pattern, then easy jogging, then running. Most runners internalise a 3:2 pattern within two to three weeks of deliberate practice.</p>
            </FadeIn>

            <FadeIn delay={0.28}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Diaphragmatic breathing: stop breathing with your chest</h2>
              <p>Most runners default to chest breathing, especially under fatigue. This is metabolically expensive. Chest breathing increases the work of breathing itself, promotes hyperventilation, and raises overall metabolic cost. Research published in Frontiers in Physiology (PMC8967998) demonstrates that diaphragmatic (belly) breathing reduces resting heart rate, improves gas exchange through better alveolar ventilation, and enhances postural stability.</p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p>The diaphragm is both a breathing muscle and a postural stabiliser. When you breathe diaphragmatically, it contracts downward, creating negative pressure that draws air deep into the lower lungs where gas exchange is most efficient. At the same time, it contributes to intra-abdominal pressure that stabilises your trunk. Chest breathing bypasses both of these advantages.</p>
            </FadeIn>

            <FadeIn delay={0.32}>
              <p>To train diaphragmatic breathing, follow this progression:</p>
              <ul className="list-none space-y-3 my-6">
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Step 1 &mdash; Supine:</strong> Lie on your back with one hand on your chest and one on your belly. Breathe so that only the belly hand rises. Practise for 5 minutes daily.</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Step 2 &mdash; Seated:</strong> Repeat the same belly-only breathing while sitting upright. This adds gravitational resistance to the diaphragm.</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Step 3 &mdash; Walking:</strong> Maintain diaphragmatic breathing during a 10-minute walk. Focus on a slow, controlled exhale.</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Step 4 &mdash; Easy running:</strong> Apply the technique during Zone 1-2 running. Target a 10-20% reduction in breathing rate compared to your usual pattern at the same pace.</span></li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.34}>
              <p>The goal is not to think about your diaphragm on every run forever. The goal is to retrain your default pattern so that belly breathing becomes automatic. Most runners notice a difference within four to six weeks of consistent practice.</p>
            </FadeIn>

            <FadeIn delay={0.36}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Side stitches: why they happen and how to stop them</h2>
              <p>Exercise-related transient abdominal pain (ETAP) &mdash; the side stitch &mdash; affects approximately 70% of runners in any given year. It is more common in younger and less experienced runners, and typically strikes the right side. The primary mechanism is irritation of the parietal peritoneum, the membrane lining your abdominal and pelvic cavities, caused by repetitive torso movement and changes in blood flow to the diaphragm.</p>
            </FadeIn>

            <FadeIn delay={0.38}>
              <p>The most reliable triggers are nutritional: eating a large meal within 1-3 hours of running, consuming sugary or hypertonic drinks, and high-fat or high-fibre foods before exercise. Poor upright posture and inadequate warm-up also contribute.</p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p>Prevention is more effective than treatment:</p>
              <ul className="list-none space-y-3 my-6">
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span>Avoid solid food 1-3 hours before running</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span>Avoid sugary, hypertonic, or high-fat drinks before and during runs</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span>Maintain upright running posture &mdash; avoid excessive forward lean</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span>Warm up progressively rather than launching into pace</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span>Practise diaphragmatic breathing to reduce diaphragm stress</span></li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.42}>
              <p>If a stitch strikes mid-run: slow down immediately, take deep slow breaths focusing on the exhale, stretch the affected side by reaching overhead and bending away from the pain, and apply gentle pressure with your hand. Most stitches resolve within 30-60 seconds using this approach.</p>
            </FadeIn>

            <FadeIn delay={0.44}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Cold weather breathing: protect your airways</h2>
              <p>Cold, dry air presents a unique challenge. Your body must warm and humidify incoming air before it reaches the lungs. When air temperature drops significantly, this process can irritate the airways and trigger exercise-induced bronchospasm &mdash; tightness, coughing, and wheezing that may persist after the session ends.</p>
            </FadeIn>

            <FadeIn delay={0.46}>
              <p>Practical cold-weather breathing strategies:</p>
              <ul className="list-none space-y-3 my-6">
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Nose-breathe at easy pace:</strong> The nasal passages warm and humidify air far more effectively than the mouth.</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Use a buff or scarf:</strong> A fabric layer over your mouth creates a warm microclimate that pre-heats incoming air.</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Warm up indoors first:</strong> Five minutes of dynamic stretching inside raises core temperature and opens airways before cold exposure.</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Start slow:</strong> Begin at a conversational pace for the first 10-15 minutes, allowing airways to adapt gradually.</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Exhale through pursed lips:</strong> This slows the exhale, retaining more warmth and moisture in the airways.</span></li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.48}>
              <p>Below -15 degrees Celsius, genuine airway damage becomes a risk even for healthy runners. At these temperatures, consider indoor alternatives. Runners with asthma should carry a reliever inhaler and discuss pre-exercise bronchodilator use with their doctor.</p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Putting it all together</h2>
              <p>Breathing is not a single technique &mdash; it is a system that adapts to intensity, environment, and your current level of training. At easy effort, breathe through your nose using a 3:2 or 3:3 rhythmic pattern. As intensity climbs, let your mouth open naturally, shift to a 2:2 or 2:1 pattern, and focus on a strong exhale rather than forcing the inhale. In all conditions, default to diaphragmatic breathing and adjust for cold weather when needed.</p>
            </FadeIn>

            <FadeIn delay={0.52}>
              <p>The most important shift is treating breathing as a trainable skill rather than an automatic process. Five minutes of diaphragmatic practice after your daily runs, combined with deliberate rhythmic breathing during easy sessions, will produce noticeable improvements within a month. Your lungs are part of the engine. Train them accordingly.</p>
            </FadeIn>

            {/* Related articles */}
            <FadeIn delay={0.53}>
              <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                <div className="space-y-3">
                  <Link href="/blog/heart-rate-zones" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Read Your Heart Rate Zones &rarr;</Link>
                  <Link href="/blog/start-running-beginner" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Start Running as a Complete Beginner &rarr;</Link>
                </div>
              </div>
            </FadeIn>

            {/* CTA */}
            <FadeIn delay={0.54} className="mt-16 pt-12" >
              <div style={{ borderTop: `1px solid ${RULE}` }} className="pt-12">
                <p className="font-headline text-xl font-bold mb-4">Ready to train smarter?</p>
                <Link href="/plans" className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]" style={{ background: ACCENT, color: TEXT }}>
                  View our plans &rarr;
                </Link>
              </div>
            </FadeIn>
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
    </>
  );
}

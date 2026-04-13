import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heart Rate Zone Training: The Complete Guide for Endurance Athletes",
  description:
    "Everything you need to know about heart rate zone training — the five-zone system, the 80/20 rule, how to calibrate zones per discipline, and how to structure your training week around intensity.",
  openGraph: {
    title: "Heart Rate Zone Training: The Complete Guide",
    description:
      "The five-zone system, the 80/20 rule, calibration by discipline, and how to structure your training week around intensity.",
    type: "article",
  },
  alternates: { canonical: "/blog/zone-training-complete-guide" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const CARD_BG = "rgba(245,245,240,0.03)";
const RULE = "rgba(245,245,240,0.15)";

const faq = [
  {
    q: "What are heart rate zones?",
    a: "Heart rate zones are ranges of heartbeats per minute that correspond to different exercise intensities. Most endurance coaching uses a five-zone model spanning from recovery (Zone 1) through to anaerobic capacity (Zone 5). Each zone produces specific physiological adaptations — training in the right zones at the right proportion is more effective than simply training hard.",
  },
  {
    q: "How do I calculate my heart rate zones?",
    a: "The most accurate method uses heart rate reserve (the Karvonen formula): Training HR = Resting HR + (% × (Max HR − Resting HR)). You need your true resting heart rate (measured first thing in the morning for several days) and your maximum heart rate (from a field test, not the 220-minus-age formula). A 30-minute all-out time trial gives reliable threshold data for running; a 20-minute FTP test works for cycling.",
  },
  {
    q: "What is the 80/20 rule in endurance training?",
    a: "The 80/20 rule means spending approximately 80% of your training time at low intensity (Zone 1–2, fully conversational) and 20% at high intensity (Zone 4–5, hard intervals). Research by Stephen Seiler across elite rowers, cyclists, runners, and cross-country skiers consistently shows this distribution produces better results than spending most time at moderate intensity.",
  },
  {
    q: "Are heart rate zones different for running and cycling?",
    a: "Yes. Running produces the highest heart rate due to full-body muscle recruitment and gravitational loading. Cycling heart rate runs 5–10 BPM lower at the same effort. Swimming runs 10–15 BPM below running due to the horizontal position and water cooling. Each discipline needs its own zones established through a discipline-specific field test.",
  },
  {
    q: "How often should I retest my heart rate zones?",
    a: "Retest every 6–8 weeks during your build phase, and after any significant illness or training break longer than two weeks. As fitness improves, your thresholds shift upward — zones based on stale data lead to sessions that no longer produce the intended training effect.",
  },
  {
    q: "Can I train with heart rate zones without a chest strap?",
    a: "Wrist-based optical heart rate monitors have improved significantly and are adequate for steady-state training. However, they can lag during intervals and be less accurate during swimming. For threshold testing and interval sessions, a chest strap gives more reliable data. If you have no heart rate monitor at all, rate of perceived exertion (RPE) on a 1–10 scale is a valid substitute — research shows experienced athletes can match RPE to zones with reasonable accuracy.",
  },
];

export default function ZoneTrainingGuide() {
  return (
    <>
      <ArticleJsonLd
        title="Heart Rate Zone Training: The Complete Guide for Endurance Athletes"
        description="The five-zone system, the 80/20 rule, calibration by discipline, and how to structure your training week."
        slug="zone-training-complete-guide"
        datePublished="2026-04-13"
      />
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
                <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: ACCENT, background: "rgba(184,92,44,0.10)" }}>Training</span>
                <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>12 min read</span>
              </div>
              <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
                Heart rate zone training: the <span style={{ color: ACCENT }}>complete</span> guide for endurance athletes
              </h1>
            </FadeInHero>

            <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
              <FadeIn delay={0.1}>
                <p>Heart rate zone training is the foundation of every well-structured endurance programme. It replaces guesswork with precision &mdash; telling you exactly how hard your body is working and whether that effort matches the purpose of the session. Yet the majority of amateur athletes either ignore zones entirely or use numbers they have never properly calibrated.</p>
              </FadeIn>

              <FadeIn delay={0.12}>
                <p>This guide covers everything: the five-zone system, how to calibrate zones for each discipline, the research behind the 80/20 intensity distribution, and how to structure your training week so that easy days are genuinely easy and hard days are genuinely hard.</p>
              </FadeIn>

              {/* The five-zone system */}
              <FadeIn delay={0.14}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The five-zone system</h2>
                <p>The T1&ndash;T5 zone model maps directly to what your body is doing physiologically at each intensity level. Each zone has a distinct purpose in your training.</p>
              </FadeIn>

              <FadeIn delay={0.16}>
                <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <table className="w-full text-sm">
                    <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Zone</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>% Max HR</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Blood lactate</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest hidden md:table-cell" style={{ color: DIM }}>Purpose</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ["T1 — Recovery", "<65%", "<2 mmol/L", "Active recovery, fat oxidation"],
                        ["T2 — Aerobic", "65–75%", "<2 mmol/L", "Base building, mitochondrial density"],
                        ["T3 — Tempo", "75–85%", "2–4 mmol/L", "Lactate threshold development"],
                        ["T4 — VO2max", "85–92%", ">4 mmol/L", "Aerobic ceiling, race-pace fitness"],
                        ["T5 — Anaerobic", ">92%", ">>4 mmol/L", "Sprint power, neuromuscular speed"],
                      ].map(([zone, hr, lactate, purpose], i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <td className="p-3" style={{ color: TEXT }}>{zone}</td>
                          <td className="p-3" style={{ color: DIM }}>{hr}</td>
                          <td className="p-3" style={{ color: DIM }}>{lactate}</td>
                          <td className="p-3 hidden md:table-cell" style={{ color: DIM }}>{purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>

              <FadeIn delay={0.18}>
                <p>Zones 1 and 2 are where 80% of aerobic adaptation occurs &mdash; improved fat oxidation, mitochondrial density, capillary growth and cardiac output. Most amateur athletes skip straight to Zone 3 because it feels more productive. It is not. Training in the grey zone between aerobic and threshold produces moderate fatigue without the specific adaptations of either end.</p>
              </FadeIn>

              {/* The 80/20 rule */}
              <FadeIn delay={0.2}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The 80/20 rule: why most athletes get it backwards</h2>
                <p>Research by Stephen Seiler across decades of studying elite endurance athletes is unambiguous. The athletes who improve most consistently follow a polarised intensity distribution:</p>
              </FadeIn>

              <FadeIn delay={0.22}>
                <div className="my-8 space-y-4">
                  {[
                    { label: "~80% of training", desc: "Zone 1–2 (low intensity, easy, fully conversational). This is where aerobic base is built with minimal fatigue cost." },
                    { label: "~20% of training", desc: "Zone 4–5 (high intensity, hard intervals at 90%+ max HR). These sessions produce the highest-value physiological adaptations — VO2max improvement, lactate clearance capacity." },
                    { label: "Minimise Zone 3", desc: "Moderate/tempo work generates high fatigue relative to the adaptation it produces. Athletes who spend too much time here are too hard on easy days and too easy on hard days." },
                  ].map(({ label, desc }, i) => (
                    <div key={i} className="p-6 rounded-sm" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                      <p className="font-headline font-bold mb-2" style={{ color: ACCENT }}>{label}</p>
                      <p className="text-sm leading-relaxed" style={{ color: DIM }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.24}>
                <p>In practical terms: in a 5-session week, 4 sessions should be easy and 1 should be hard. In a 7-session week, 5&ndash;6 easy and 1&ndash;2 hard. The 80/20 split is a guideline, not a rigid formula &mdash; some weeks will be 85/15, others 75/25. The principle is what matters: easy days must be genuinely easy, and hard days must be genuinely hard.</p>
              </FadeIn>

              {/* Why Zone 2 matters */}
              <FadeIn delay={0.26}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Why Zone 2 is the most underrated zone</h2>
                <p>Zone 2 is the single most productive zone in endurance training, yet it is the most neglected by amateur athletes because it feels too slow. Here is what happens physiologically when you train consistently in Zone 2:</p>
                <ul className="list-none space-y-3 my-6">
                  {[
                    "Mitochondrial density increases — your cells produce more energy aerobically, reducing reliance on glycogen",
                    "Capillary networks expand around muscle fibres — delivering more oxygen to working muscles",
                    "Fat oxidation rate improves — you burn fat more efficiently at higher intensities, preserving glycogen for the final kilometres",
                    "Cardiac output increases — stroke volume improves as the heart adapts to sustained low-intensity load",
                    "Musculoskeletal durability builds — tendons, ligaments and connective tissue strengthen without the injury risk of high-intensity work",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: ACCENT }}>&#9654;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={0.28}>
                <p>The common mistake is equating effort with progress. A Zone 2 run should feel almost embarrassingly easy &mdash; you should be able to hold a full conversation without pausing for breath. If you cannot, you are in Zone 3 and missing the point entirely.</p>
              </FadeIn>

              {/* Zones differ by discipline */}
              <FadeIn delay={0.3}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Your zones are not the same across disciplines</h2>
                <p>This is where most triathletes and multi-sport athletes go wrong. Each discipline produces a different heart rate response at the same perceived effort:</p>
              </FadeIn>

              <FadeIn delay={0.32}>
                <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <table className="w-full text-sm">
                    <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Discipline</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>HR offset vs running</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Why</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ["Running", "Baseline (highest)", "Full-body muscle recruitment, gravitational loading"],
                        ["Cycling", "5–10 BPM lower", "Seated position, less total muscle mass engaged"],
                        ["Swimming", "10–15 BPM lower", "Horizontal position, water cooling, no gravitational load"],
                      ].map(([disc, offset, why], i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <td className="p-3 font-bold" style={{ color: TEXT }}>{disc}</td>
                          <td className="p-3" style={{ color: DIM }}>{offset}</td>
                          <td className="p-3" style={{ color: DIM }}>{why}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>

              <FadeIn delay={0.34}>
                <p>A Zone 2 run at 145 BPM should correspond to roughly 135&ndash;140 BPM on the bike and 130&ndash;135 BPM in the pool. Using the same zone numbers across all three disciplines means you are either under-training one or over-training another. Each discipline needs its own zones, established through a discipline-specific field test.</p>
              </FadeIn>

              {/* How to calibrate */}
              <FadeIn delay={0.36}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>How to calibrate your zones properly</h2>
                <p>The 220-minus-age formula for max heart rate is a population average with a standard deviation of &plusmn;10&ndash;12 BPM. Using it means your zones could be off by two full zones in either direction. Use a field test instead.</p>
              </FadeIn>

              <FadeIn delay={0.38}>
                <p>The Karvonen formula uses heart rate reserve rather than max heart rate alone, producing more accurate zones:</p>
                <div className="my-6 p-6 rounded-sm" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                  <p className="font-label text-sm tracking-wide" style={{ color: ACCENT }}>Training HR = Resting HR + (% &times; (Max HR &minus; Resting HR))</p>
                  <p className="mt-3 text-sm" style={{ color: DIM }}>Example: Resting HR 55, Max HR 185, targeting 70% &rarr; 55 + (0.70 &times; 130) = 146 BPM</p>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <p>Field tests by discipline:</p>
                <ul className="list-none space-y-3 my-6">
                  {[
                    "Run: 30-minute all-out time trial. Average HR of the final 20 minutes equals your functional threshold heart rate.",
                    "Bike: 20-minute FTP test. 95% of average power gives your FTP. Average HR during the test equals your cycling threshold heart rate.",
                    "Swim: 400m + 200m time trial using the Critical Swim Speed formula to establish pace zones. Average HR during the 400m gives threshold heart rate.",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: ACCENT }}>&#9654;</span>
                      <span><strong>{item.split(":")[0]}:</strong>{item.substring(item.indexOf(":") + 1)}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              {/* Structuring a training week */}
              <FadeIn delay={0.42}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>How to structure a training week by zone</h2>
                <p>A well-structured running week includes four distinct session types, each targeting different zones:</p>
              </FadeIn>

              <FadeIn delay={0.44}>
                <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <table className="w-full text-sm">
                    <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Session</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Zone</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest hidden md:table-cell" style={{ color: DIM }}>Example</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ["Long run", "T1–T2", "70–90 min to 2.5 hrs, fully conversational"],
                        ["Easy runs", "T1–T2", "30–45 min recovery runs between quality sessions"],
                        ["Tempo/hills", "T3–T4", "20–40 min at threshold, or 6–10 × 60–90 sec hill repeats"],
                        ["Intervals", "T4–T5", "6–10 × 400m at 5K pace, equal jog recovery"],
                      ].map(([session, zone, example], i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <td className="p-3 font-bold" style={{ color: TEXT }}>{session}</td>
                          <td className="p-3" style={{ color: ACCENT }}>{zone}</td>
                          <td className="p-3 hidden md:table-cell" style={{ color: DIM }}>{example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>

              <FadeIn delay={0.46}>
                <p>The long run is the most important session of the week. It builds aerobic volume, fat oxidation capacity, musculoskeletal durability and mental resilience. Do not sacrifice it to compensate for a missed interval session. Run it on feel or heart rate only &mdash; ignore pace.</p>
              </FadeIn>

              <FadeIn delay={0.48}>
                <p>Never schedule back-to-back hard sessions. Hard means high intensity <em>or</em> high duration. A Tuesday interval session followed by a Wednesday tempo run leaves insufficient recovery for either session to produce its intended adaptation. Separate quality sessions by at least 48 hours of easy running or rest.</p>
              </FadeIn>

              {/* Monitoring and retesting */}
              <FadeIn delay={0.5}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>How to know your zones are working</h2>
                <p>The simplest signal is cardiac drift during easy runs. If your heart rate stays stable over a 60-minute Zone 2 run and your pace gradually improves over weeks and months, your aerobic base is building. If your heart rate drifts upward continuously or you cannot hold a conversation, you are running too fast.</p>
              </FadeIn>

              <FadeIn delay={0.52}>
                <p>For athletes with more data, heart rate variability (HRV) measured each morning provides a recovery signal. Track a 7-day rolling average rather than reacting to single-day readings. When HRV trends below your personal baseline, switch a planned hard session to easy. When HRV is normal or elevated, proceed with intensity. The gains from HRV-guided training come from better <em>timing</em> of hard work, not more of it.</p>
              </FadeIn>

              <FadeIn delay={0.54}>
                <p>Retest your zones every 6&ndash;8 weeks during build phase, and after any illness or training break longer than two weeks. As fitness improves, your thresholds shift upward. Zones based on stale data lead to undertrained athletes doing sessions that no longer produce adaptation.</p>
              </FadeIn>

              {/* Recovery weeks */}
              <FadeIn delay={0.56}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Recovery weeks: where adaptation actually happens</h2>
                <p>Every 3rd or 4th week should be a recovery week at roughly 50% of your peak training volume. This is not optional. Physiological adaptation &mdash; the actual fitness gain &mdash; occurs during rest, not during the loading block that preceded it.</p>
              </FadeIn>

              <FadeIn delay={0.58}>
                <p>During recovery weeks, maintain your easy running but drop all hard sessions. Sleep well. Eat well. If you feel sluggish on the first day back after a recovery week, that is normal &mdash; the body is still consolidating the gains from the previous block. By day two or three, you should feel noticeably stronger than before.</p>
              </FadeIn>

              {/* No devices section */}
              <FadeIn delay={0.6}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>What if you do not have a heart rate monitor?</h2>
                <p>The 80/20 framework requires no technology. Rate of perceived exertion (RPE) on a 1&ndash;10 scale is a valid substitute:</p>
                <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <table className="w-full text-sm">
                    <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>RPE</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Zone equivalent</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Talk test</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ["1–3", "T1 — Recovery", "Full conversation, no effort"],
                        ["3–5", "T2 — Aerobic", "Comfortable conversation"],
                        ["5–7", "T3 — Tempo", "Short sentences only"],
                        ["7–9", "T4 — VO2max", "A few words at most"],
                        ["9–10", "T5 — Anaerobic", "Cannot speak"],
                      ].map(([rpe, zone, talk], i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <td className="p-3 font-bold" style={{ color: ACCENT }}>{rpe}</td>
                          <td className="p-3" style={{ color: TEXT }}>{zone}</td>
                          <td className="p-3" style={{ color: DIM }}>{talk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>

              <FadeIn delay={0.62}>
                <p>For tracking weekly load without devices, multiply your session RPE (1&ndash;10) by duration in minutes. A 60-minute easy run at RPE 4 = 240 load units. A 45-minute interval session at RPE 8 = 360 load units. Track your weekly total and apply the 10% weekly increase rule &mdash; never increase total load by more than 10% from one week to the next.</p>
              </FadeIn>

              {/* Closing */}
              <FadeIn delay={0.64}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The takeaway</h2>
                <p>Heart rate zone training is not complicated. Establish your zones properly through a field test. Spend the vast majority of your time in Zones 1 and 2, even when it feels counterintuitively slow. Schedule 1&ndash;2 genuinely hard sessions per week with adequate recovery between them. Retest regularly. And trust that the aerobic base &mdash; built through months of patient, conversational-pace training &mdash; is the foundation on which every race performance is built.</p>
              </FadeIn>

              {/* FAQ */}
              <FadeIn delay={0.66}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Frequently asked questions</h2>
                <div className="space-y-6">
                  {faq.map(({ q, a }, i) => (
                    <div key={i}>
                      <p className="font-headline font-bold mb-2" style={{ color: TEXT }}>{q}</p>
                      <p className="text-sm leading-relaxed" style={{ color: DIM }}>{a}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Related articles */}
              <FadeIn delay={0.68}>
                <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                  <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                  <div className="space-y-3">
                    <Link href="/blog/heart-rate-zones" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Read Your Heart Rate Zones &rarr;</Link>
                    <Link href="/blog/how-to-taper" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Taper Without Losing Fitness &rarr;</Link>
                    <Link href="/blog/why-training-plans-fail" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>Why Training Plans Fail &rarr;</Link>
                  </div>
                </div>
              </FadeIn>

              {/* CTA */}
              <FadeIn delay={0.7} className="mt-16 pt-12">
                <div style={{ borderTop: `1px solid ${RULE}` }} className="pt-12">
                  <p className="font-headline text-xl font-bold mb-2" style={{ color: TEXT }}>
                    Train in the right zones, every session.
                  </p>
                  <p className="font-body text-sm mb-8" style={{ color: DIM }}>
                    PlanMetric builds AI-personalised training plans with zone-specific sessions calibrated to your fitness. From $29.99.
                  </p>
                  <Link href="/intake" className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]" style={{ background: ACCENT, color: TEXT }}>
                    Build my plan &rarr;
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

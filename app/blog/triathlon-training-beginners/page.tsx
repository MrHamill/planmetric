import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Triathlon Training for Beginners: Where to Start",
  description:
    "Everything a first-time triathlete needs to know — how much training is enough, which discipline to prioritise, how to structure your week, and the gear that actually matters.",
  openGraph: {
    title: "Triathlon Training for Beginners: Where to Start",
    description:
      "How much training is enough, which discipline to prioritise, weekly structure, and the gear that actually matters.",
    type: "article",
  },
  alternates: { canonical: "/blog/triathlon-training-beginners" },
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
    q: "How fit do I need to be to start triathlon training?",
    a: "You need to be able to swim 400 metres continuously (any stroke), ride a bike for 30 minutes, and run or jog for 20–30 minutes. You do not need to be fast — you need to be able to complete each discipline without stopping. If you cannot do one of these yet, spend 4–6 weeks building up to it before starting a structured triathlon plan.",
  },
  {
    q: "How many hours a week should a beginner triathlete train?",
    a: "For a sprint or Olympic distance triathlon, 5–7 hours per week is enough. This typically means 6–8 sessions: 2 swims, 2 rides, 2–3 runs, and one rest day. Quality matters more than quantity — every session should have a clear purpose.",
  },
  {
    q: "What is the cheapest triathlon distance to start with?",
    a: "A sprint triathlon (750m swim, 20km bike, 5km run) or supersprint (400m swim, 10km bike, 2.5km run) requires the least equipment and preparation. You can race a sprint tri on any road bike, basic running shoes, and a pair of goggles. Many beginner events do not require a wetsuit.",
  },
  {
    q: "Do I need a triathlon bike to do a triathlon?",
    a: "No. Any road bike, hybrid, or even a mountain bike with road tyres will work for your first triathlon. A triathlon-specific bike with aerobars is a performance upgrade, not a requirement. Most age-group triathletes at sprint and Olympic distance race on standard road bikes.",
  },
  {
    q: "What is a brick session in triathlon?",
    a: "A brick session combines two disciplines back-to-back, most commonly cycling followed immediately by running. The purpose is to train your body for the sensation of running on fatigued legs after the bike — a feeling unique to triathlon. You need at least 2–4 brick sessions in the 6 weeks before your race.",
  },
  {
    q: "Should I focus on my weakest discipline?",
    a: "Not necessarily. Most race time for age-groupers is lost on the run, regardless of which discipline feels weakest. A 30% improvement in swimming saves only about 2 minutes in an Olympic triathlon. Protect your run training and recovery above all, maintain bike volume as your primary aerobic engine, and focus swim sessions on technique rather than distance.",
  },
];

export default function TriathlonBeginnersGuide() {
  return (
    <>
      <ArticleJsonLd
        title="Triathlon Training for Beginners: Where to Start"
        description="Everything a first-time triathlete needs to know — training volume, discipline priority, weekly structure, and essential gear."
        slug="triathlon-training-beginners"
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
                <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: "#a855f7", background: "rgba(168,85,247,0.10)" }}>Triathlon</span>
                <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>10 min read</span>
              </div>
              <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
                Triathlon training for beginners: where to <span style={{ color: ACCENT }}>start</span>
              </h1>
            </FadeInHero>

            <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
              <FadeIn delay={0.1}>
                <p>Your first triathlon is not about being fast. It is about finishing &mdash; and the only way to guarantee that is to train all three disciplines consistently, manage your time honestly, and resist the urge to overcomplicate it. This guide covers everything a first-time triathlete in Australia needs to know, from how many hours to train to what gear actually matters.</p>
              </FadeIn>

              {/* Choose your distance */}
              <FadeIn delay={0.12}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Choose your distance first</h2>
                <p>Your race distance determines everything &mdash; how long you train, how many hours per week, and how much gear you need. For a first triathlon, start with the shortest distance you can find.</p>
              </FadeIn>

              <FadeIn delay={0.14}>
                <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <table className="w-full text-sm">
                    <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Distance</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Swim</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Bike</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Run</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ["Supersprint", "400m", "10km", "2.5km"],
                        ["Sprint", "750m", "20km", "5km"],
                        ["Olympic", "1.5km", "40km", "10km"],
                        ["70.3 (Half Ironman)", "1.9km", "90km", "21.1km"],
                        ["Ironman", "3.8km", "180km", "42.2km"],
                      ].map(([dist, swim, bike, run], i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <td className="p-3 font-bold" style={{ color: TEXT }}>{dist}</td>
                          <td className="p-3" style={{ color: "#0ea5e9" }}>{swim}</td>
                          <td className="p-3" style={{ color: "#22c55e" }}>{bike}</td>
                          <td className="p-3" style={{ color: "#f97316" }}>{run}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>

              <FadeIn delay={0.16}>
                <p>A sprint triathlon is the ideal first race. You can prepare for it in 8&ndash;12 weeks on 5&ndash;7 hours per week. An Olympic distance needs 12&ndash;16 weeks. Anything longer than Olympic requires a well-established training base &mdash; do not attempt a 70.3 or Ironman as your first triathlon.</p>
              </FadeIn>

              {/* Minimum fitness benchmarks */}
              <FadeIn delay={0.18}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Minimum fitness to start training</h2>
                <p>Before starting a structured triathlon plan, you should be able to:</p>
                <ul className="list-none space-y-3 my-6">
                  {[
                    "Swim 400 metres continuously without stopping (any stroke)",
                    "Ride a bike for 30 minutes at a comfortable effort",
                    "Run or jog for 20–30 minutes without walking",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: ACCENT }}>&#9654;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>If you cannot do one of these yet, that is fine &mdash; spend 4&ndash;6 weeks building up to it. There is no rush. Triathlon rewards patience.</p>
              </FadeIn>

              {/* How to structure your week */}
              <FadeIn delay={0.2}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>How to structure your training week</h2>
                <p>A beginner triathlon week typically includes 6&ndash;8 sessions across 5&ndash;7 hours. The most important principle: never do back-to-back hard sessions. Hard means high intensity <em>or</em> high duration.</p>
              </FadeIn>

              <FadeIn delay={0.22}>
                <div className="my-8 rounded-sm overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <table className="w-full text-sm">
                    <thead><tr style={{ background: "rgba(245,245,240,0.04)" }}>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Day</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>Session</th>
                      <th className="p-3 text-left font-label text-[10px] uppercase tracking-widest hidden md:table-cell" style={{ color: DIM }}>Intensity</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ["Monday", "Rest or light swim (drills + easy laps)", "Recovery"],
                        ["Tuesday", "Run — easy 30–40 min", "Low"],
                        ["Wednesday", "Swim — technique drills + intervals", "Moderate"],
                        ["Thursday", "Bike — 45–60 min steady", "Low"],
                        ["Friday", "Rest or short easy swim", "Recovery"],
                        ["Saturday", "Long bike (60–90 min) + 15 min brick run", "Long + moderate"],
                        ["Sunday", "Long run — 40–60 min, easy pace", "Low"],
                      ].map(([day, session, intensity], i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <td className="p-3 font-bold" style={{ color: TEXT }}>{day}</td>
                          <td className="p-3" style={{ color: DIM }}>{session}</td>
                          <td className="p-3 hidden md:table-cell" style={{ color: DIM }}>{intensity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>

              <FadeIn delay={0.24}>
                <p>This template is flexible. Swap days around to fit your schedule &mdash; the key constraint is spacing hard or long sessions apart. And take one complete rest day every week, minimum.</p>
              </FadeIn>

              {/* Discipline priorities */}
              <FadeIn delay={0.26}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Which discipline matters most?</h2>
                <p>Most age-group triathlon time is lost on the run, not the swim. This surprises beginners who assume the swim is the hard part. Here is how to think about each discipline:</p>
              </FadeIn>

              <FadeIn delay={0.28}>
                <div className="my-8 space-y-4">
                  {[
                    { label: "Swim — technique over volume", colour: "#0ea5e9", desc: "A 30% improvement in swimming saves roughly 2 minutes in an Olympic triathlon. That is less time than most athletes lose in transition. Every swim session should include a drill component — body position, catch mechanics, bilateral breathing. Technique matters far more than metres covered." },
                    { label: "Bike — your aerobic engine", colour: "#22c55e", desc: "The bike leg is the longest discipline in every triathlon format. It is also the safest place to accumulate aerobic volume — low injury risk, high training return. Your long weekend ride is the anchor of your training week. Build FTP (functional threshold power) gradually through consistent riding." },
                    { label: "Run — protect it above all", colour: "#f97316", desc: "Running carries the highest injury risk of the three disciplines. Never follow a hard run with another hard session. Build run volume conservatively — increase by a maximum of 5 minutes per week. The run is where races are won or lost, so arriving at the run leg healthy and fresh matters more than any single training session." },
                  ].map(({ label, colour, desc }, i) => (
                    <div key={i} className="p-6 rounded-sm" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                      <p className="font-headline font-bold mb-2" style={{ color: colour }}>{label}</p>
                      <p className="text-sm leading-relaxed" style={{ color: DIM }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Brick sessions */}
              <FadeIn delay={0.3}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Brick sessions: the triathlon-specific session</h2>
                <p>A brick session combines two disciplines back-to-back &mdash; most commonly cycling followed immediately by running. The first time you run off the bike, your legs will feel heavy, uncoordinated and strange. This is completely normal. It is called &ldquo;brick legs&rdquo; and it diminishes with practice.</p>
              </FadeIn>

              <FadeIn delay={0.32}>
                <p>You need at least 2&ndash;4 brick sessions in the 6 weeks before your race. A beginner brick looks like this:</p>
                <ul className="list-none space-y-3 my-6">
                  {[
                    "Ride 45–60 minutes at a comfortable effort",
                    "Rack your bike, change shoes as quickly as you can",
                    "Run 15–20 minutes at an easy pace — do not chase speed",
                    "The goal is to practise the transition and let your legs adapt to the sensation",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: ACCENT }}>&#9654;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              {/* Progression rules */}
              <FadeIn delay={0.34}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Progression rules that prevent injury</h2>
                <p>The single most common beginner mistake is doing too much, too soon. Your cardiovascular fitness will improve faster than your tendons, ligaments and connective tissue can adapt. Follow these rules:</p>
                <ul className="list-none space-y-3 my-6">
                  {[
                    "Increase total weekly training volume by no more than 10% per week",
                    "Swim and run: increase duration by a maximum of 5 minutes per week",
                    "Bike: increase duration by a maximum of 10 minutes per week",
                    "Take a recovery week every 4th week at roughly 50% of your normal volume",
                    "Take at least one complete rest day every week — no exceptions",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: ACCENT }}>&#9654;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={0.36}>
                <p>Recovery weeks are not lost fitness. They are where adaptation actually occurs &mdash; your body repairs tissue, consolidates aerobic gains, and prepares for the next loading block. Skipping them leads to accumulated fatigue, suppressed immune function, and injury.</p>
              </FadeIn>

              {/* Gear */}
              <FadeIn delay={0.38}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>What gear you actually need</h2>
                <p>Triathlon has a reputation for being expensive. For your first race, you need far less than the industry suggests:</p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="my-8 space-y-4">
                  {[
                    { label: "Essential", items: "Goggles, swimsuit (or tri suit), a bike that works and fits, helmet (mandatory), running shoes that fit, a race belt for your bib number" },
                    { label: "Helpful but not required", items: "Wetsuit (check water temperature rules — permitted 14–22\u00b0C, banned above 22\u00b0C), bike shoes with clipless pedals, a basic GPS watch, sunglasses" },
                    { label: "Do not buy yet", items: "Triathlon-specific bike, power meter, aero helmet, carbon wheels, race-day nutrition products you have not tested in training" },
                  ].map(({ label, items }, i) => (
                    <div key={i} className="p-6 rounded-sm" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                      <p className="font-headline font-bold mb-2" style={{ color: ACCENT }}>{label}</p>
                      <p className="text-sm leading-relaxed" style={{ color: DIM }}>{items}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.42}>
                <p>A tri suit (a one-piece outfit you swim, ride and run in) saves significant time in transitions. It is the single best gear investment for a beginner. Everything else is a performance upgrade, not a requirement.</p>
              </FadeIn>

              {/* Open water swimming */}
              <FadeIn delay={0.44}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Open water swimming: do not skip this</h2>
                <p>Pool fitness does not fully transfer to open water. Research shows open water swimming costs 15&ndash;20% more energy than pool swimming at the same pace, due to sighting, navigation, waves, and the absence of walls for rest.</p>
              </FadeIn>

              <FadeIn delay={0.46}>
                <p>Get into open water at least 2&ndash;3 times before race day. Focus on:</p>
                <ul className="list-none space-y-3 my-6">
                  {[
                    "Sighting every 10–12 strokes — lift only your eyes above the water, not your whole head",
                    "Breathing control in the first 200 metres — slow your stroke rate deliberately, focus on exhaling fully underwater",
                    "If you feel panicked, roll onto your back, float, breathe, and resume when ready — this is normal and it is not a failure",
                    "Practise in your wetsuit if you plan to race in one — it changes your body position and stroke mechanics",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: "#0ea5e9" }}>&#9654;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              {/* Race day tips */}
              <FadeIn delay={0.48}>
                <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Race day: what beginners get wrong</h2>
                <p>Three mistakes ruin more first triathlons than anything else:</p>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="my-8 space-y-4">
                  {[
                    { num: "1", title: "Starting the swim too fast", desc: "Adrenaline and the mass start will push you to sprint the first 200 metres. This causes early fatigue, panic, and breathing difficulties. Start at a controlled pace. You will make up more time by finishing strong than by starting fast." },
                    { num: "2", title: "Pushing too hard on the bike", desc: "The bike feels easy compared to swimming — so beginners ride too hard, arrive at the run with depleted legs, and walk. Ride at a pace where you could comfortably hold a conversation. You need to save energy for the run." },
                    { num: "3", title: "Eating something new on race day", desc: "Every gel, drink, and bar should have been tested in training. New food on race day causes nausea, cramping, and worse. Practise your race nutrition during long training sessions." },
                  ].map(({ num, title, desc }, i) => (
                    <div key={i} className="p-6 rounded-sm" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                      <p className="font-headline font-bold mb-2" style={{ color: TEXT }}><span style={{ color: ACCENT }}>{num}.</span> {title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: DIM }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Closing */}
              <FadeIn delay={0.52}>
                <p>Your first triathlon is about proving to yourself that you can do it. Nobody at the finish line asks what place you came. Train consistently, respect the progression rules, practise your transitions, and trust that the preparation will carry you through. The hardest part is not race day &mdash; it is the months of showing up to train when nobody is watching.</p>
              </FadeIn>

              {/* FAQ */}
              <FadeIn delay={0.54}>
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
              <FadeIn delay={0.56}>
                <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                  <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                  <div className="space-y-3">
                    <Link href="/blog/brick-sessions-explained" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>Brick Sessions Explained: Training Your Legs for the Run Off the Bike &rarr;</Link>
                    <Link href="/blog/zone-training-complete-guide" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>Heart Rate Zone Training: The Complete Guide &rarr;</Link>
                    <Link href="/blog/race-week-nutrition" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>Race Week Nutrition: What to Eat Before Race Day &rarr;</Link>
                  </div>
                </div>
              </FadeIn>

              {/* CTA */}
              <FadeIn delay={0.58} className="mt-16 pt-12">
                <div style={{ borderTop: `1px solid ${RULE}` }} className="pt-12">
                  <p className="font-headline text-xl font-bold mb-2" style={{ color: TEXT }}>
                    Ready for your first triathlon?
                  </p>
                  <p className="font-body text-sm mb-8" style={{ color: DIM }}>
                    PlanMetric builds AI-personalised triathlon plans matched to your fitness, your schedule, and your race date. From $29.99.
                  </p>
                  <Link href="/intake" className="inline-block font-label text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]" style={{ background: ACCENT, color: TEXT }}>
                    Build my triathlon plan &rarr;
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

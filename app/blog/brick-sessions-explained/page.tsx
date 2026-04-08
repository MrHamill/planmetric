import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brick Sessions Explained — Plan Metric",
  description: "Learn how brick sessions train your legs for the run off the bike: protocols, frequency, cadence strategy, and how to vary your brick run speed.",
  openGraph: {
    title: "Brick Sessions Explained",
    description: "How to train your legs for the run off the bike: protocols, frequency, and cadence strategy.",
    type: "article",
  },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

export default function BrickSessionsArticle() {
  return (
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
      <div className="pointer-events-none fixed inset-0 z-50" style={{ opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

      <article className="pt-40 pb-32 px-8 md:px-24">
        <div className="max-w-2xl mx-auto">
          <FadeInHero>
            <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: "#a855f7", background: "rgba(168,85,247,0.10)" }}>Triathlon</span>
              <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>6 min read</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
              Brick sessions explained &mdash; how to train your legs for the run off the <span style={{ color: ACCENT }}>bike</span>
            </h1>
          </FadeInHero>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <FadeIn delay={0.1}>
              <p>Every triathlete knows the feeling. You dismount the bike, start running, and your legs feel like they belong to someone else. Heavy, uncoordinated, running on concrete stilts. This is &ldquo;brick legs&rdquo; &mdash; the neuromuscular shock of transitioning from cycling to running without any break. It happens because the muscle recruitment pattern for cycling is fundamentally different from running, and your nervous system needs time to switch.</p>
            </FadeIn>

            <FadeIn delay={0.12}>
              <p>The good news: this sensation diminishes with repeated practice. Brick sessions are the specific training tool designed to make the bike-to-run transition feel manageable on race day. Research and coaching best-practice from Norwegian endurance training principles confirm that brick sessions are non-negotiable in the six weeks before any triathlon.</p>
            </FadeIn>

            <FadeIn delay={0.14}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>What a brick session actually is</h2>
              <p>A brick session is a bike ride followed immediately by a run, with no rest in between &mdash; mimicking race-day transition conditions. The standard protocol is 60&ndash;90 minutes of cycling at race power, followed immediately by 15&ndash;30 minutes of running at race pace. The transition should be practised exactly as it would happen on race day: dismount, rack, shoes, go.</p>
            </FadeIn>

            <FadeIn delay={0.16}>
              <p>The purpose is neuromuscular adaptation. Your body needs to learn how to recruit running muscles immediately after sustained cycling effort. The quadriceps have been working in a shortened range during the pedal stroke, and suddenly they need to operate through the full extension and ground-contact pattern of running. Without practice, this switch costs you minutes in the first kilometre off the bike.</p>
            </FadeIn>

            <FadeIn delay={0.18}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>How many bricks you need</h2>
              <p>The coaching consensus from triathlon-specific training research is clear: complete at least 2&ndash;4 brick sessions in the six weeks before race day. For Olympic distance and above, weekly bricks during the build phase are ideal. For sprint distance, two to three bricks in the final four weeks is sufficient.</p>
              <p className="mt-4">One brick session per week is the standard frequency during your build phase. Do not stack bricks in the final week before the race &mdash; they carry significant training load and need recovery time.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Vary your run speed off the bike</h2>
              <p>A common mistake is running every brick at the same pace. D3 Multisport coach Mike Ricci recommends rotating brick run intensities:</p>
              <ul className="list-none space-y-3 my-6">
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Easy brick:</strong> Run at conversational pace. Focus on getting your legs to turn over smoothly. This is about adaptation, not fitness.</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Stride brick:</strong> Run easy for 10 minutes, then insert 4&ndash;6 strides of 20 seconds at 5K effort with full recovery between each. Teaches your neuromuscular system to fire at high speed immediately after cycling.</span></li>
                <li className="flex gap-3"><span style={{ color: ACCENT }}>&#9654;</span> <span><strong>Race-pace brick:</strong> Run 15&ndash;20 minutes at your target triathlon run pace. This is the most race-specific version and should be done every other week in build phase.</span></li>
              </ul>
              <p>The goal is that your run pace should never be a surprise to your legs on race day.</p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Cadence on the bike matters for the run</h2>
              <p>How you ride directly affects how you run. Cycling cadence research consistently shows that higher cadence &mdash; 90&ndash;100 RPM &mdash; reduces muscular fatigue on the bike and preserves run legs for T2. The mechanism is straightforward: higher cadence shifts effort from muscular force production to cardiovascular output. You arrive at transition with less muscular fatigue and more glycogen in your legs.</p>
              <p className="mt-4">Many age-group triathletes default to 70&ndash;75 RPM because it feels powerful on the bike. But this higher-force, lower-cadence approach costs them significantly on the run. If your race cadence is consistently below 85 RPM, building cadence through targeted drills &mdash; high-cadence spins at 100&ndash;110 RPM in Zone 2 &mdash; should be a training priority in your build phase.</p>
            </FadeIn>

            <FadeIn delay={0.24}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The weekday commute brick</h2>
              <p>You do not need a three-hour session to train the transition. Cycling home from work and running immediately for 20 minutes is a highly effective time-efficient brick that replicates race conditions. It saves time by combining transport and training, and the frequency of practice accelerates neuromuscular adaptation faster than a single long brick on the weekend.</p>
            </FadeIn>

            <FadeIn delay={0.26}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Do not forget swim-to-bike</h2>
              <p>While the bike-to-run transition gets the most attention, occasional swim-to-bike bricks build T1 confidence. The shift from horizontal swimming to vertical cycling is its own neuromuscular challenge &mdash; dizziness, elevated heart rate and disorientation are common in athletes who have not practised it. Include at least one or two swim-to-bike sessions in the final six weeks, ideally in open water if your race is open water.</p>
            </FadeIn>

            <FadeIn delay={0.28}>
              <p>Brick sessions are uncomfortable by design. That discomfort is the point &mdash; every brick you complete in training is one less surprise on race day. The athletes who execute the run off the bike cleanly are the ones who have practised the transition until it feels normal. Not easy, but normal.</p>
            </FadeIn>

            <FadeIn delay={0.3} className="mt-16 pt-12">
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

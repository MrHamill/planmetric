import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Most Training Plans Fail — Plan Metric",
  description: "Most training plans are written for an athlete who doesn't exist. Learn why standardised plans underperform, how intensity distribution matters, and what a plan should actually do.",
  openGraph: {
    title: "Why Most Training Plans Fail",
    description: "Learn why standardised plans underperform and what individualised training actually looks like.",
    type: "article",
  },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

export default function WhyTrainingPlansFailArticle() {
  return (
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
      <div className="pointer-events-none fixed inset-0 z-50" style={{ opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

      <article className="pt-40 pb-32 px-8 md:px-24">
        <div className="max-w-2xl mx-auto">
          <FadeInHero>
            <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: ACCENT, background: "rgba(184,92,44,0.10)" }}>Methodology</span>
              <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>7 min read</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
              Why most training plans fail &mdash; and what to do <span style={{ color: ACCENT }}>instead</span>
            </h1>
          </FadeInHero>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <FadeIn delay={0.1}>
              <p>Most training plans are written for an athlete who does not exist. They assume perfect consistency, no injuries, no work travel, no sick children, and a body that recovers on schedule every week. The moment real life interferes &mdash; and it always does &mdash; the plan breaks. The athlete falls behind, tries to catch up by cramming missed sessions, and either burns out or gets injured. This is not a discipline problem. It is a design problem.</p>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The standardised plan problem</h2>
              <p>A 15-week randomised controlled trial compared individualised training programmes to standardised ones. The individualised group improved their 10 km time by 6.2%. The standardised group improved by 2.9%. Individualisation roughly doubled the rate of improvement &mdash; and the only difference was that the personalised plans responded to each athlete&rsquo;s recovery status rather than following a fixed weekly script.</p>
            </FadeIn>

            <FadeIn delay={0.14}>
              <p>The monitoring was straightforward. Morning heart rate variability guided intensity decisions. When HRV was suppressed or perceived recovery was low, the session intensity was reduced. When readiness was high, quality sessions were pushed harder. The plan adapted to the athlete, not the other way around.</p>
            </FadeIn>

            <FadeIn delay={0.16}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Too much intensity, not enough base</h2>
              <p>The most common error in amateur training plans is intensity distribution. Norwegian coaching research across elite endurance athletes in cycling, cross-country skiing, rowing and triathlon consistently shows the same pattern: 80&ndash;90% of training should be at low intensity, below ventilatory threshold one. Only 5&ndash;10% should be at threshold, and roughly 5% at high intensity.</p>
              <p className="mt-4">Most amateur plans are the opposite. They prescribe moderate intensity too frequently, with recovery days that are not actually easy and quality sessions that are not actually hard. The athlete ends up in a perpetual grey zone &mdash; too fatigued to go hard when it matters, never truly recovering between sessions.</p>
            </FadeIn>

            <FadeIn delay={0.18}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The 10% rule exists for a reason</h2>
              <p>Bodies absorb training load changes of roughly 10% per week. Beyond that, the risk of breakdown rises sharply. Joe Friel&rsquo;s three guiding principles from The Triathlete&rsquo;s Training Bible remain the gold standard: apply the least amount of stress needed to produce adaptation, pursue continual improvement through gradual change, and ensure every session has a specific purpose.</p>
              <p className="mt-4">Progression rules from elite coaching practice are specific. Swim and run duration should increase by a maximum of 5 minutes per week. Bike duration by a maximum of 10 minutes. Do not schedule back-to-back hard sessions, where hard means either high intensity or high duration. Every fourth week should be an active recovery week at 50&ndash;60% of normal volume.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Consistency beats any single session</h2>
              <p>Norwegian coaches are explicit on this point: consistency over weeks and months matters more than any single session. Athletes should train to improve, not to prove fitness in training. A bad session is one session, not a trend. Missing one session is fine. Missing one week sets you back. Missing one month requires rebuilding.</p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <p>The long run is the most important session of the week for distance athletes. It should never be sacrificed to compensate for a bad interval session. Quality over quantity applies to the whole programme &mdash; unsupervised junk miles do not move the needle. Every session needs a clear purpose: improve fitness, maintain fitness, or recover. If a session does not fit one of those three, remove it.</p>
            </FadeIn>

            <FadeIn delay={0.24}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Recovery is not optional</h2>
              <p>Recovery should be treated as a training variable, not the absence of training. Sleep is the highest-ROI recovery tool available &mdash; 8&ndash;10 hours per night is optimal for athletes in heavy training. HRV is suppressed with poor sleep, and a suppressed morning HRV is a reliable signal that intensity should be reduced that day.</p>
              <p className="mt-4">High-intensity work requires 48&ndash;72 hours of full recovery before the next quality session. Race recovery timelines are specific: 3&ndash;5 days after a sprint, 5&ndash;7 days after an Olympic, 10&ndash;14 days after a 70.3, and 3&ndash;4 weeks after a full Ironman before returning to quality training.</p>
            </FadeIn>

            <FadeIn delay={0.26}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>What a plan should actually do</h2>
              <p>A training plan that works starts with the athlete&rsquo;s data: current volume, heart rate zones, race date, schedule constraints, injury history. It builds from where they are, not from where the plan writer assumes they should be. It responds to how the athlete is recovering, not to a rigid weekly template. It allocates intensity correctly &mdash; genuinely easy days, genuinely hard quality sessions, and nothing in between.</p>
            </FadeIn>

            <FadeIn delay={0.28}>
              <p>The plan should include recovery weeks every four weeks, progressive volume increases within the 10% rule, and a taper protocol that reduces volume by 20&ndash;50% in the final 2&ndash;3 weeks while maintaining intensity. And every plan should be reviewed by a human coach who can spot the things algorithms miss &mdash; life stress, motivation, the difference between a schedule that looks good on paper and one an athlete can actually follow.</p>
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

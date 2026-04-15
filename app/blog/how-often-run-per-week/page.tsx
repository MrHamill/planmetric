import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Often Should I Run Per Week?",
  description: "Find out how many days per week you should run based on your experience level. Covers beginner to intermediate frequency, rest days, and the 80/20 rule.",
  openGraph: {
    title: "How Often Should I Run Per Week?",
    description: "A research-backed guide to weekly running frequency for beginners and intermediate runners.",
    type: "article",
  },
  alternates: { canonical: "/blog/how-often-run-per-week" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

const faq = [
  {
    q: "How many days a week should a beginner run?",
    a: "Beginners should run 3 to 4 days per week, with at least 1 to 2 full rest days between sessions. This gives your muscles, tendons, and connective tissue time to adapt to the impact forces of running. As your body adapts over several months, you can gradually add a fifth day.",
  },
  {
    q: "Is it OK to run every day?",
    a: "Running every day is not recommended for most runners. At least 1 to 2 full rest days per week are critical for injury prevention and muscle recovery. Even elite athletes schedule recovery days. Without rest, cumulative fatigue builds and injury risk rises sharply.",
  },
  {
    q: "How much of my running should be easy?",
    a: "Roughly 80% of your weekly running should be at low intensity, fully conversational pace in Zone 1. Only about 20% should be hard quality sessions like intervals or tempo runs. In a 5-session week, that means 4 easy runs and 1 hard session. Most runners make the mistake of running too hard on easy days.",
  },
  {
    q: "What is a good weekly running schedule?",
    a: "A balanced weekly schedule includes 1 long run, 1 to 2 quality sessions such as intervals or tempo work, and the remaining days as easy runs or rest. For a 5-day runner, that could be: Tuesday intervals, Thursday tempo, Saturday long run, Monday and Wednesday easy, with Friday and Sunday as rest days.",
  },
  {
    q: "How do I know if I am running too much?",
    a: "Signs of overtraining include persistent fatigue, elevated resting heart rate, disrupted sleep, recurring niggles or injuries, and declining performance despite consistent training. If you experience these, reduce your volume and add an extra rest day. A recovery week at 50 to 60% of normal volume every fourth week helps prevent overtraining.",
  },
];

export default function HowOftenRunPerWeekArticle() {
  return (
    <>
    <ArticleJsonLd title="How Often Should I Run Per Week?" description="A research-backed guide to weekly running frequency for beginners and intermediate runners." slug="how-often-run-per-week" datePublished="2026-04-18" />
    <FaqJsonLd items={faq} />
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
      <div className="pointer-events-none fixed inset-0 z-50" style={{ opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

      <article className="pt-40 pb-32 px-8 md:px-24">
        <div className="max-w-2xl mx-auto">
          <FadeInHero>
            <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: "#f97316", background: "rgba(249,115,22,0.10)" }}>Run</span>
              <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>8 min read</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
              How often should I run per <span style={{ color: ACCENT }}>week</span>?
            </h1>
          </FadeInHero>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <FadeIn delay={0.1}>
              <p>It is one of the most common questions in running: how many days a week should I actually run? Ask ten runners and you will get ten different answers. Some swear by running every day. Others are convinced that three days is the sweet spot. The truth, as with most things in endurance training, depends on where you are right now and where you are trying to get to.</p>
              <p className="mt-4">What the research consistently shows is that more is not always better. The number of days you run matters far less than the quality of those sessions, how you distribute intensity across the week, and whether you give your body enough time to recover between efforts. Get the frequency wrong and you end up injured, overtrained, or stuck on a plateau. Get it right and you build fitness steadily, stay healthy, and actually enjoy the process.</p>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Start with your experience level</h2>
              <p>Running frequency should match your training age, not your ambition. A beginner who jumps straight to six days a week is almost guaranteed to pick up an injury within the first few months. Your cardiovascular system adapts to running faster than your muscles, tendons, and bones do. You might feel like you can handle more, but your connective tissue is still catching up.</p>
              <p className="mt-4">As a general framework:</p>
              <div className="overflow-x-auto mt-6 mb-4">
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-6" style={{ color: DIM }}>Level</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-6" style={{ color: DIM }}>Days per week</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3" style={{ color: DIM }}>Key sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Beginner</td>
                      <td className="py-3 pr-6 font-body">3&ndash;4</td>
                      <td className="py-3 font-body">1 long run, 1 quality, 1&ndash;2 easy</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Intermediate</td>
                      <td className="py-3 pr-6 font-body">4&ndash;5</td>
                      <td className="py-3 font-body">1 long run, 2 quality, 1&ndash;2 easy</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 font-body">Advanced</td>
                      <td className="py-3 pr-6 font-body">5&ndash;6</td>
                      <td className="py-3 font-body">1 long run, 2&ndash;3 quality, 2&ndash;3 easy</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">Regardless of your level, at least 1 to 2 full rest days per week are critical for injury prevention and muscle recovery. Rest days are not a sign of weakness. They are where adaptation actually happens.</p>
            </FadeIn>

            <FadeIn delay={0.14}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The 80/20 rule: most of your running should be easy</h2>
              <p>Before you worry about how many days to run, you need to understand how hard to run on those days. Research across elite endurance athletes consistently shows that roughly 80% of training should be at low intensity &mdash; Zone 1, fully conversational &mdash; and only about 20% should be hard, quality work above 4 mmol/L lactate.</p>
              <p className="mt-4">In practical terms:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>In a <strong>5-session week</strong>: 4 easy runs + 1 hard session</li>
                <li>In a <strong>7-session week</strong>: 5&ndash;6 easy runs + 1&ndash;2 hard sessions</li>
              </ul>
              <p className="mt-4">Most amateur runners get this backwards. They run too hard on easy days and too easy on hard days, spending most of their time in a grey zone that is too intense to recover from but not intense enough to trigger meaningful adaptation. If you can only change one thing about your training, make your easy days genuinely easy. You should be able to hold a full conversation without pausing for breath. If you cannot, slow down.</p>
            </FadeIn>

            <FadeIn delay={0.16}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>What a good week actually looks like</h2>
              <p>A well-structured training week balances three types of session: quality work that challenges your body, easy running that builds aerobic base without draining you, and rest that lets everything consolidate. Here is what a typical week might look like for an intermediate runner training 5 days:</p>
              <div className="overflow-x-auto mt-6 mb-4">
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-6" style={{ color: DIM }}>Day</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-6" style={{ color: DIM }}>Session</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3" style={{ color: DIM }}>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Monday</td>
                      <td className="py-3 pr-6 font-body">Easy 30&ndash;45 min or rest</td>
                      <td className="py-3 font-body">Recovery</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Tuesday</td>
                      <td className="py-3 pr-6 font-body">Intervals (VO2max)</td>
                      <td className="py-3 font-body">Quality</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Wednesday</td>
                      <td className="py-3 pr-6 font-body">Easy 30&ndash;45 min</td>
                      <td className="py-3 font-body">Aerobic</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Thursday</td>
                      <td className="py-3 pr-6 font-body">Tempo or hills</td>
                      <td className="py-3 font-body">Quality</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Friday</td>
                      <td className="py-3 pr-6 font-body">Rest</td>
                      <td className="py-3 font-body">Recovery</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Saturday</td>
                      <td className="py-3 pr-6 font-body">Parkrun or race effort</td>
                      <td className="py-3 font-body">Quality</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 font-body">Sunday</td>
                      <td className="py-3 pr-6 font-body">Long run</td>
                      <td className="py-3 font-body">Aerobic Volume</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">Notice the pattern: hard sessions on Tuesday, Thursday, and Saturday are always separated by easy days or rest. Never schedule back-to-back hard sessions. Your body needs 48 to 72 hours to recover from high-intensity work before the next quality effort. The easy days between quality sessions are not filler &mdash; they are building your aerobic base while your body repairs and adapts to the hard work.</p>
            </FadeIn>

            <FadeIn delay={0.18}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The long run is non-negotiable</h2>
              <p>If you can only fit three sessions into your week, make one of them a long run. It is the single most important session for any distance runner. The long run builds aerobic capacity, teaches your body to burn fat more efficiently, and develops the mental toughness you need for race day.</p>
              <p className="mt-4">Your long run should be at an easy, conversational pace &mdash; this is not a quality session. It falls in the 80% easy category. If you are training for a half marathon or marathon, the long run will eventually become the backbone of your entire programme. Never sacrifice the long run to compensate for a bad interval session earlier in the week.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Building up safely: the 10% rule</h2>
              <p>Once you have established your baseline frequency, the temptation is to add volume quickly. Resist it. Your body absorbs training load changes of roughly 10% per week. Beyond that, the risk of injury rises sharply. This applies to total weekly kilometres, not individual sessions.</p>
              <p className="mt-4">If you are currently running 30 km per week, your maximum increase the following week is 33 km. That might mean adding 3 minutes to each run, or adding a single short easy run. It does not mean jumping from four sessions to six in a single week.</p>
              <p className="mt-4">For run duration specifically, increase by a maximum of 5 minutes per week. Small, consistent increases compound into significant gains over months. Aggressive jumps compound into overuse injuries.</p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Recovery weeks matter more than you think</h2>
              <p>Every fourth week should be a recovery week at 50 to 60% of your normal training volume. If you are over 45, make that every third week. Recovery weeks are not lost fitness &mdash; they are where your body consolidates the training you have done over the previous three weeks. Skip them and you accumulate fatigue that eventually manifests as injury, illness, or stagnation.</p>
              <p className="mt-4">During a recovery week, maintain your easy running sessions but drop the intensity and duration of quality sessions. Keep your routine and rhythm &mdash; just dial everything back. You should feel slightly restless by the end of a recovery week. That is the sign it is working.</p>
            </FadeIn>

            <FadeIn delay={0.24}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Injury prevention is frequency management</h2>
              <p>Most running injuries are not caused by a single bad session. They are caused by accumulated overload &mdash; too many hard sessions without adequate recovery, too much volume added too quickly, or the same surfaces and routes creating repetitive strain patterns.</p>
              <p className="mt-4">Practical steps to stay healthy:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Never run back-to-back hard sessions</li>
                <li>Take at least 1 to 2 full rest days per week</li>
                <li>Rotate running surfaces where possible</li>
                <li>Deload every 3 to 4 weeks</li>
                <li>Include strength training twice per week during base phase</li>
                <li>Increase weekly volume by no more than 10%</li>
              </ul>
              <p className="mt-4">If something hurts for more than two sessions, take an extra rest day. Consistency over weeks and months matters far more than any single session. Missing one session is fine. Missing one week sets you back. Missing one month from an injury that could have been avoided by resting for two days is the real cost of ignoring your body.</p>
            </FadeIn>

            <FadeIn delay={0.26}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>So, how many days should you run?</h2>
              <p>If you are just starting out, run 3 to 4 days per week. Focus on making every session count rather than accumulating junk kilometres. Keep 80% of your running genuinely easy. Include one long run. Add one quality session when you feel ready, and give yourself at least two rest days.</p>
              <p className="mt-4">If you have been running consistently for six months or more, 4 to 5 days is the sweet spot for most runners. That gives you room for a long run, 1 to 2 quality sessions, and enough easy running to build your aerobic base without grinding yourself down.</p>
              <p className="mt-4">The right frequency is the one you can sustain week after week, month after month, without breaking down. A <Link href="/intake" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>personalised training plan</Link> built around your schedule, your current fitness, and your race goals will tell you exactly how to structure each week &mdash; so you spend your time running, not guessing.</p>
            </FadeIn>

            <FadeIn delay={0.28}>
              <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                <div className="space-y-3">
                  <Link href="/blog/heart-rate-zones" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Read Your Heart Rate Zones &rarr;</Link>
                  <Link href="/blog/why-training-plans-fail" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>Why Most Training Plans Fail &rarr;</Link>
                </div>
              </div>
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
    </>
  );
}

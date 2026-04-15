import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Do I Start Running as a Beginner?",
  description: "A complete beginner's guide to starting running. Covers the Couch to 5K programme, essential gear, pacing, common mistakes, and how to build a lasting running habit.",
  openGraph: {
    title: "How Do I Start Running as a Beginner?",
    description: "Everything you need to go from zero to your first 5K. Gear, pacing, the C25K programme, and how to avoid the mistakes that sideline most new runners.",
    type: "article",
  },
  alternates: { canonical: "/blog/start-running-beginner" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

const faq = [
  {
    q: "How long does it take a beginner to run 5K?",
    a: "Most beginners can complete their first 5K in 9 weeks using a structured Couch to 5K programme. The programme builds from 60-second run intervals in week 1 to a continuous 30-minute run by week 9. If any week feels too difficult, simply repeat it before moving on.",
  },
  {
    q: "Is it OK to walk during a run?",
    a: "Yes. Walk breaks are a core part of every beginner running programme. The run-walk method builds aerobic fitness while keeping intensity low enough to avoid injury. Even experienced runners use walk breaks strategically during long runs and ultra-marathons.",
  },
  {
    q: "What shoes should a beginner runner buy?",
    a: "Visit a specialty running store for a gait analysis and choose shoes that feel comfortable immediately with no break-in period. Buy half a size to a full size larger than your street shoes because feet swell during running. A neutral shoe with a 6 to 8 mm heel-to-toe drop is a versatile starting point.",
  },
  {
    q: "How fast should a beginner run?",
    a: "Slow enough to hold a full conversation without gasping for breath. This is called conversational pace and it sits in heart rate Zone 2, where roughly 80% of aerobic adaptation occurs. If you cannot breathe through your nose, you are running too hard. Speed comes later once you have built an aerobic base.",
  },
  {
    q: "How do I avoid injury as a new runner?",
    a: "Follow the 10% rule and never increase weekly volume by more than 10%. Always take rest days between runs, avoid cotton socks and clothing, and resist the urge to run fast on every session. Most beginner injuries come from doing too much too soon rather than from running itself.",
  },
];

export default function StartRunningBeginnerArticle() {
  return (
    <>
    <ArticleJsonLd title="How Do I Start Running as a Beginner?" description="A complete beginner's guide to starting running. Covers the Couch to 5K programme, essential gear, pacing, common mistakes, and how to build a lasting running habit." slug="start-running-beginner" datePublished="2026-04-18" />
    <FaqJsonLd items={faq} />
    <main style={{ background: BG, color: TEXT }} className="-mt-[72px] relative">
      <div className="pointer-events-none fixed inset-0 z-50" style={{ opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

      <article className="pt-40 pb-32 px-8 md:px-24">
        <div className="max-w-2xl mx-auto">
          <FadeInHero>
            <Link href="/blog" className="font-label text-[10px] tracking-widest uppercase mb-8 inline-block transition-colors hover:text-white" style={{ color: DIM }}>&larr; Back to Journal</Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ color: "#f97316", background: "rgba(249,115,22,0.10)" }}>Run</span>
              <span className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>9 min read</span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-8">
              How do I start running as a <span style={{ color: ACCENT }}>beginner</span>?
            </h1>
          </FadeInHero>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <FadeIn delay={0.1}>
              <p>You do not need to be fit to start running. You do not need expensive gear, a gym membership, or a natural talent for endurance. You just need a pair of shoes and a willingness to begin slowly. Running is the most accessible sport on the planet, and the barrier to entry is exactly as high as you make it.</p>
              <p className="mt-4">The problem is that most beginners start wrong. They lace up, sprint down the street, and collapse after 400 metres convinced they are not built for running. That is not a fitness problem &mdash; it is a pacing problem. Every runner you have ever admired started exactly where you are right now. The difference is that they followed a progression that respected their body&rsquo;s need to adapt gradually. This guide gives you that same progression.</p>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The only rule that matters: slow down</h2>
              <p>The single biggest mistake new runners make is running too fast. It sounds counterintuitive, but the key to becoming a better runner is to run slowly. Your target pace as a beginner is conversational &mdash; you should be able to speak full sentences without gasping for air. If you cannot breathe through your nose, you are going too hard.</p>
              <p className="mt-4">This pace sits in heart rate Zone 2, and it is where roughly 80% of aerobic adaptation occurs. Even Eliud Kipchoge &mdash; the fastest marathon runner in history &mdash; runs 10 of his 13 weekly sessions at easy pace. If the greatest runner alive spends most of his time running slowly, you absolutely should too.</p>
              <p className="mt-4">Conversational pace feels absurdly easy at first. That is the point. Your cardiovascular system adapts to running faster than your muscles, tendons, and bones. Running slowly protects those structures while your aerobic engine builds underneath. Speed comes later, once the foundation is solid.</p>
            </FadeIn>

            <FadeIn delay={0.14}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Couch to 5K: your first 9 weeks</h2>
              <p>The Couch to 5K programme (C25K) is the gold standard for beginner runners. It takes you from zero running to a continuous 30-minute run over 9 weeks, running just 3 days per week with a rest day between every session. Each session follows a simple structure: 5-minute walk warm-up, intervals, then a 5-minute cool-down walk.</p>
              <p className="mt-4">Here is the weekly progression:</p>
              <div className="overflow-x-auto mt-6 mb-4">
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-6" style={{ color: DIM }}>Week</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-6" style={{ color: DIM }}>Run interval</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-6" style={{ color: DIM }}>Walk interval</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3" style={{ color: DIM }}>Total time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">1</td>
                      <td className="py-3 pr-6 font-body">60 sec</td>
                      <td className="py-3 pr-6 font-body">90 sec</td>
                      <td className="py-3 font-body">20 min</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">2</td>
                      <td className="py-3 pr-6 font-body">90 sec</td>
                      <td className="py-3 pr-6 font-body">2 min</td>
                      <td className="py-3 font-body">20 min</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">3</td>
                      <td className="py-3 pr-6 font-body">3 min</td>
                      <td className="py-3 pr-6 font-body">3 min</td>
                      <td className="py-3 font-body">20 min</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">4</td>
                      <td className="py-3 pr-6 font-body">5 min</td>
                      <td className="py-3 pr-6 font-body">2.5 min</td>
                      <td className="py-3 font-body">25 min</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">5</td>
                      <td className="py-3 pr-6 font-body">8 min &rarr; 20 min continuous</td>
                      <td className="py-3 pr-6 font-body">5 min</td>
                      <td className="py-3 font-body">25 min</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">6</td>
                      <td className="py-3 pr-6 font-body">10 min</td>
                      <td className="py-3 pr-6 font-body">3 min</td>
                      <td className="py-3 font-body">25 min</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">7</td>
                      <td className="py-3 pr-6 font-body">25 min continuous</td>
                      <td className="py-3 pr-6 font-body">&mdash;</td>
                      <td className="py-3 font-body">25 min</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">8</td>
                      <td className="py-3 pr-6 font-body">28 min continuous</td>
                      <td className="py-3 pr-6 font-body">&mdash;</td>
                      <td className="py-3 font-body">28 min</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 font-body">9</td>
                      <td className="py-3 pr-6 font-body">30 min continuous</td>
                      <td className="py-3 pr-6 font-body">&mdash;</td>
                      <td className="py-3 font-body">30 min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">Week 5 is the breakthrough moment &mdash; your first continuous 20-minute run. It feels daunting, but by that point your body has been quietly adapting for four weeks. Trust the process. And if any week feels too hard, simply repeat it. There is no prize for finishing early and no shame in taking extra time. The goal is to finish each interval, not to run fast.</p>
            </FadeIn>

            <FadeIn delay={0.16}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Gear that actually matters</h2>
              <p>Running is beautifully simple, but there are a few pieces of gear that make a genuine difference to comfort and injury prevention. Everything else is optional.</p>

              <h3 className="font-headline text-lg font-bold mb-3 mt-8" style={{ color: TEXT }}>Running shoes</h3>
              <p>This is the one piece of equipment worth investing in. Visit a specialty running store where they can analyse your gait and recommend the right shoe. A few things to know before you go:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Comfort is the priority &mdash; if a shoe needs a break-in period, it is the wrong shoe</li>
                <li>Buy half a size to a full size larger than your street shoes because your feet swell during running</li>
                <li>A neutral shoe suits most runners; stability shoes are for overpronation</li>
                <li>A heel-to-toe drop of 6 to 8 mm is a versatile starting point for beginners</li>
              </ul>

              <h3 className="font-headline text-lg font-bold mb-3 mt-8" style={{ color: TEXT }}>Socks and clothing</h3>
              <p>The single most important clothing rule for runners: never wear cotton. Cotton absorbs moisture and holds it against your skin, creating blisters, chafing, and discomfort. Every item touching your skin should be synthetic (polyester or nylon) or merino wool.</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Socks:</strong> synthetic or wool running socks &mdash; this alone prevents most blisters</li>
                <li><strong>Shirt:</strong> polyester or nylon moisture-wicking fabric</li>
                <li><strong>Shorts:</strong> running shorts with a built-in liner or compression tights</li>
                <li><strong>Sports bra (women):</strong> high-support, moisture-wicking &mdash; fit is critical</li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.18}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>The mistakes that sideline most beginners</h2>
              <p>Nearly every new runner falls into the same traps. Knowing them in advance dramatically improves your chances of still running three months from now.</p>

              <div className="overflow-x-auto mt-6 mb-4">
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-6" style={{ color: DIM }}>Mistake</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3" style={{ color: DIM }}>Why it hurts</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Too much too soon</td>
                      <td className="py-3 font-body">Shin splints, runner&rsquo;s knee, stress fractures &mdash; connective tissue needs weeks to adapt</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Running too fast every session</td>
                      <td className="py-3 font-body">Burnout and prevents aerobic base building &mdash; the foundation you need for all future speed</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Skipping rest days</td>
                      <td className="py-3 font-body">Your body adapts during rest, not during the run itself &mdash; no rest means no progress</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Wearing cotton</td>
                      <td className="py-3 font-body">Blisters and chafing that make every run miserable &mdash; switch to synthetic or wool</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <td className="py-3 pr-6 font-body">Overstriding</td>
                      <td className="py-3 font-body">Acts as a brake with every step, increasing impact forces through knees and hips</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 font-body">Comparing to others</td>
                      <td className="py-3 font-body">Discouragement and pushing pace beyond what your body is ready for</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">The 10% rule is your best defence against the first mistake: never increase your total weekly running volume by more than 10%. If you ran 15 minutes three times this week (45 minutes total), next week&rsquo;s ceiling is about 50 minutes. Small, consistent increases compound into significant fitness gains over months. Aggressive jumps compound into injuries.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Building a running habit that sticks</h2>
              <p>Starting a running programme is straightforward. Sticking with it past the first few weeks is where most people fall off. The research on habit formation gives us a few strategies that genuinely work.</p>

              <p className="mt-4"><strong>Habit stacking.</strong> Attach your run to something you already do every day. &ldquo;After I brush my teeth in the morning, I put on my running shoes.&rdquo; The existing habit becomes the trigger. You are not relying on motivation &mdash; you are riding the momentum of a routine you have already built.</p>

              <p className="mt-4"><strong>Remove friction.</strong> Set out your running clothes the night before. Have your shoes by the door. Fill your water bottle. Every obstacle you remove makes it more likely you will actually get out the door on tired mornings.</p>

              <p className="mt-4"><strong>Schedule it like a meeting.</strong> Block time in your calendar for each run. When running competes with &ldquo;free time&rdquo; it loses. When it occupies a non-negotiable slot, it happens.</p>

              <p className="mt-4"><strong>Sign up for a race.</strong> External accountability increases adherence dramatically. A parkrun, a local 5K, even a charity fun run &mdash; having a date on the calendar gives every training session a purpose. It does not matter how fast you run it. Crossing the finish line of your first race is one of the best feelings in sport.</p>

              <p className="mt-4"><strong>Start smaller than you think you need to.</strong> If the C25K programme feels intimidating, start with brisk walks. Walk for 20 minutes three times a week for two weeks. Then add 30-second jog intervals. The goal is consistency first, intensity later. A habit built on 10-minute sessions survives. A habit built on ambitious 45-minute plans dies after a fortnight.</p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Understanding your effort: the 80/20 rule</h2>
              <p>Even as a beginner, understanding how to distribute effort across your week will set you apart from the majority of recreational runners who never improve. The principle is simple: 80% of your running should be easy, and only 20% should be hard.</p>
              <p className="mt-4">In the context of a C25K programme, this means all of your sessions should feel easy. You are in the 80% phase &mdash; building an aerobic base. The 20% quality work (intervals, tempo runs, hills) comes later, once you can run continuously for 30 minutes and have been running consistently for at least 3 months.</p>
              <p className="mt-4">How do you know if you are running easy enough? Three tests:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Talk test:</strong> you can hold a full conversation, not just one-word answers</li>
                <li><strong>Nose breathing:</strong> you can breathe comfortably through your nose</li>
                <li><strong>Heart rate:</strong> if you have a watch, aim for Zone 2 &mdash; roughly 60 to 70% of your maximum heart rate</li>
              </ul>
              <p className="mt-4">If you want to understand heart rate zones in more depth, read our guide on <Link href="/blog/heart-rate-zones" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>how to read your heart rate zones</Link>.</p>
            </FadeIn>

            <FadeIn delay={0.24}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>What comes after Couch to 5K?</h2>
              <p>You have finished the programme. You can run 30 minutes without stopping. Now what?</p>
              <p className="mt-4">First, consolidate. Run 3 times per week at your comfortable 30-minute distance for at least 2 to 4 weeks. Let your body fully absorb the training load. Many new runners make the mistake of immediately jumping to a half-marathon plan the week after finishing C25K &mdash; that is how injuries happen.</p>
              <p className="mt-4">Once you are comfortable at 30 minutes, you have two paths forward:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Add distance:</strong> extend one run per week by 5 minutes, keeping the other two at 30 minutes. This becomes your weekly long run. Within a couple of months you will be running 45 to 60 minutes continuously.</li>
                <li><strong>Add frequency:</strong> add a fourth easy run of 20 to 25 minutes. More sessions per week builds your aerobic base faster than longer individual runs. For guidance on the right number of sessions, see <Link href="/blog/how-often-run-per-week" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>how often you should run per week</Link>.</li>
              </ul>
              <p className="mt-4">A <Link href="/intake" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>personalised training plan</Link> takes the guesswork out of this progression. It maps out every session from your current fitness to your goal race, building volume and intensity at a rate your body can handle &mdash; tailored from your purchase date right through to race day.</p>
            </FadeIn>

            <FadeIn delay={0.26}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Your first week: a practical checklist</h2>
              <p>Here is exactly what your first week of running looks like. No ambiguity, no decisions to make &mdash; just follow the steps.</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Day 1 (e.g. Monday):</strong> 5-minute brisk walk warm-up. Alternate 60 seconds of easy jogging with 90 seconds of walking for 20 minutes. 5-minute cool-down walk.</li>
                <li><strong>Day 2 (Tuesday):</strong> Rest. Walk if you want, but no running.</li>
                <li><strong>Day 3 (Wednesday):</strong> Repeat the Day 1 session. It should feel slightly easier.</li>
                <li><strong>Day 4 (Thursday):</strong> Rest.</li>
                <li><strong>Day 5 (Friday):</strong> Repeat the session one more time. Three sessions done.</li>
                <li><strong>Days 6 &amp; 7 (Weekend):</strong> Rest. Go for a walk, stretch, but let your body recover.</li>
              </ul>
              <p className="mt-4">That is it. Three 30-minute sessions including warm-up and cool-down. No sprinting, no tracking pace, no worrying about distance. If you can do that for one week, you can do it for two. And if you can do it for two, you can finish the programme.</p>
            </FadeIn>

            <FadeIn delay={0.28}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>You are already a runner</h2>
              <p>There is no minimum speed, minimum distance, or physical prerequisite that qualifies you as a runner. The moment you step out the door with the intention of running, you are a runner. Full stop. You do not need to earn the title by finishing a marathon or hitting a certain pace. You earn it by showing up consistently.</p>
              <p className="mt-4">Start slower than you think you should. Follow a programme. Invest in proper shoes. Be patient with the process. In 9 weeks you will be running continuously for 30 minutes and wondering why you did not start sooner.</p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                <div className="space-y-3">
                  <Link href="/blog/how-often-run-per-week" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How Often Should I Run Per Week? &rarr;</Link>
                  <Link href="/blog/heart-rate-zones" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Read Your Heart Rate Zones &rarr;</Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.32} className="mt-16 pt-12">
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

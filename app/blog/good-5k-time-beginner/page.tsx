import Link from "next/link";
import { FadeIn, FadeInHero } from "@/components/FadeIn";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Is a Good 5K Time for a Beginner?",
  description: "Realistic 5K benchmarks for beginners by age and gender. Includes parkrun percentiles, first-race expectations, and how quickly new runners improve.",
  openGraph: {
    title: "What Is a Good 5K Time for a Beginner?",
    description: "Realistic 5K benchmarks for beginners by age and gender, plus parkrun percentiles and first-year improvement timelines.",
    type: "article",
  },
  alternates: { canonical: "/blog/good-5k-time-beginner" },
};

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";
const RULE = "rgba(245,245,240,0.15)";

const faq = [
  {
    q: "What is a good 5K time for a beginner?",
    a: "A good 5K time for a beginner is anything under 35 to 40 minutes. Breaking 30 minutes is an excellent milestone that puts you above average for a new runner. Most beginners finish their first 5K in 30 to 45 minutes depending on age, gender, and fitness background.",
  },
  {
    q: "How fast should I run my first 5K?",
    a: "Your first 5K should be about finishing, not chasing a fast time. Most first-time runners finish between 30 and 45 minutes. After 8 weeks of consistent training, men typically run 28 to 40 minutes and women 32 to 45 minutes. Many runners drop 3 to 8 minutes in their second or third race simply from better pacing.",
  },
  {
    q: "What is the average 5K time by age?",
    a: "Average 5K times vary by age and gender. For men in their 20s, the beginner benchmark is under 30 minutes. For women in their 20s, it is under 35 minutes. Times naturally increase with age, adding roughly 1 to 2 minutes per decade. Parkrun data shows the overall median finish time is around 28 to 31 minutes.",
  },
  {
    q: "How much can I improve my 5K time in the first year?",
    a: "Most new runners improve their 5K time by 10 to 15% in the first year of consistent training. It is common to go from over 40 minutes down to sub-30 minutes within 12 months. The biggest gains happen in the first 6 to 8 months as your aerobic base develops and your pacing improves.",
  },
  {
    q: "What is age grading in running?",
    a: "Age grading adjusts your race time against the world record for your age and gender, expressed as a percentage. A score of 60 to 69% is local club level, 70 to 79% is regional level, and 80% or above is national level. It allows fair comparison across different ages and is built into most parkrun results.",
  },
];

export default function Good5kTimeBeginnerArticle() {
  return (
    <>
    <ArticleJsonLd title="What Is a Good 5K Time for a Beginner?" description="Realistic 5K benchmarks for beginners by age and gender, plus parkrun percentiles and first-year improvement timelines." slug="good-5k-time-beginner" datePublished="2026-04-30" />
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
              What is a good 5K time for a <span style={{ color: ACCENT }}>beginner</span>?
            </h1>
          </FadeInHero>

          <div className="space-y-8 font-body text-base leading-relaxed" style={{ color: "rgba(245,245,240,0.8)" }}>
            <FadeIn delay={0.1}>
              <p>If you have just started running, or you are thinking about signing up for your first 5K, this question is probably sitting somewhere in the back of your mind. You want to know what is realistic, what is good, and what you should be aiming for. The short answer is that any time you cross the finish line is a good time. But that is not particularly useful when you are trying to set a goal or understand where you sit.</p>
              <p className="mt-4">The longer answer depends on your age, gender, training background, and how long you have been running. A 25-year-old former footballer and a 55-year-old who has never run before are going to have very different starting points. What matters is knowing what is realistic for you, and understanding that your first 5K time is just a starting point &mdash; not a ceiling.</p>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>What counts as beginner, intermediate, and competitive?</h2>
              <p>Before looking at any numbers, it helps to define the categories. These are based on training experience, not talent.</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Beginner (0 to 1 year of running):</strong> The goal is to finish. Most beginners complete a 5K in 30 to 45 minutes or more. Breaking 30 minutes is an excellent milestone at this stage.</li>
                <li><strong>Intermediate (1 to 3 years):</strong> Consistent training brings most runners into the 22 to 27 minute range. Pacing, aerobic base, and training structure start making a real difference.</li>
                <li><strong>Competitive (3+ years):</strong> Under 20 minutes for men and under 23 to 24 minutes for women. These times require structured speed work, high weekly volume, and race-specific preparation.</li>
                <li><strong>Elite:</strong> Under 15 minutes for men and under 17 minutes for women. This is a level that requires years of dedicated training and significant natural ability.</li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.14}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>5K benchmarks by age and gender</h2>
              <p>The table below shows realistic 5K benchmarks across age groups. These are based on large-scale race data and parkrun results, not elite performances. Use them as a guide, not as a rigid standard.</p>
              <div className="overflow-x-auto mt-6 mb-4">
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-4" style={{ color: DIM }}>Age</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-4" style={{ color: DIM }}>Gender</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-4" style={{ color: DIM }}>Beginner</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-4" style={{ color: DIM }}>Intermediate</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3" style={{ color: DIM }}>Competitive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["15\u201318", "M", "<30:00", "22:00\u201326:00", "<19:00"],
                      ["15\u201318", "F", "<35:00", "25:00\u201330:00", "<23:00"],
                      ["20\u201329", "M", "<30:00", "21:00\u201325:00", "<19:00"],
                      ["20\u201329", "F", "<35:00", "24:00\u201329:00", "<22:00"],
                      ["30\u201339", "M", "<32:00", "23:00\u201327:00", "<20:00"],
                      ["30\u201339", "F", "<38:00", "26:00\u201331:00", "<24:00"],
                      ["40\u201349", "M", "<34:00", "24:00\u201328:00", "<21:00"],
                      ["40\u201349", "F", "<40:00", "28:00\u201333:00", "<25:00"],
                      ["50\u201359", "M", "<36:00", "26:00\u201330:00", "<23:00"],
                      ["50\u201359", "F", "<42:00", "30:00\u201335:00", "<27:00"],
                      ["60+", "M", "<40:00", "28:00\u201333:00", "<25:00"],
                      ["60+", "F", "<48:00", "33:00\u201338:00", "<29:00"],
                    ].map(([age, gender, beg, inter, comp], i) => (
                      <tr key={i} style={{ borderBottom: i < 11 ? `1px solid ${CARD_BORDER}` : undefined }}>
                        <td className="py-3 pr-4 font-body">{age}</td>
                        <td className="py-3 pr-4 font-body">{gender}</td>
                        <td className="py-3 pr-4 font-body">{beg}</td>
                        <td className="py-3 pr-4 font-body">{inter}</td>
                        <td className="py-3 font-body">{comp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4">A few patterns stand out. Competitive times increase by roughly 1 minute per decade of age. Women&rsquo;s beginner benchmarks sit about 4 to 8 minutes higher than men&rsquo;s in the same age group, which reflects physiological differences in VO2max and muscle mass rather than effort or commitment. Whatever your age or gender, the gap between beginner and intermediate is where the most dramatic improvement happens &mdash; and it is largely a result of consistent, structured training rather than raw talent.</p>
            </FadeIn>

            <FadeIn delay={0.16}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Where do you sit? Parkrun percentiles</h2>
              <p>If you want to know how your time compares to the broader running population, parkrun data provides the best snapshot. With millions of finishers every week across thousands of events, these percentiles give you an honest picture of where you stand.</p>
              <div className="overflow-x-auto mt-6 mb-4">
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-6" style={{ color: DIM }}>Percentile</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3" style={{ color: DIM }}>Approximate 5K time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Top 1%", "Under 17:30\u201318:00"],
                      ["Top 10%", "Under 23:00"],
                      ["Top 25%", "Under 25:00"],
                      ["Median (50th)", "28:00\u201331:00"],
                      ["Bottom 25%", "Over 35:00"],
                    ].map(([pct, time], i) => (
                      <tr key={i} style={{ borderBottom: i < 4 ? `1px solid ${CARD_BORDER}` : undefined }}>
                        <td className="py-3 pr-6 font-body">{pct}</td>
                        <td className="py-3 font-body">{time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4">The male median sits around 31:28 and the female median around 35 to 37 minutes. That means if you finish a parkrun in under 30 minutes, you are already faster than more than half the field. If your first 5K is anywhere in the 30 to 40 minute range, you are in good company &mdash; that is exactly where most people start.</p>
            </FadeIn>

            <FadeIn delay={0.18}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>What to expect after 8 weeks of training</h2>
              <p>If you follow a structured beginner programme for 8 weeks, here is what is realistic for your first race:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Men:</strong> 28 to 40 minutes</li>
                <li><strong>Women:</strong> 32 to 45 minutes</li>
                <li><strong>30:00 (6:00/km pace):</strong> An excellent beginner milestone</li>
                <li><strong>35 to 40 minutes:</strong> Very common and completely respectable</li>
                <li><strong>Under 30:00:</strong> Above average for a new runner</li>
              </ul>
              <p className="mt-4">One of the most overlooked factors in beginner racing is pacing. Many first-time runners go out far too fast in the opening kilometre, hit a wall at the 3 km mark, and finish much slower than they are capable of. It is extremely common for runners to drop 3 to 8 minutes off their time in their second or third race purely from better pacing &mdash; same fitness, smarter execution.</p>
              <p className="mt-4">If you ran your first 5K in 38 minutes but went out at 5:00/km pace and blew up at halfway, there is a strong chance you can run 33 to 34 minutes next time just by starting at 6:30/km and building into the second half.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>How quickly will you improve?</h2>
              <p>The good news for beginners is that the first year of running delivers the fastest improvement you will ever experience. Your body is adapting to a completely new stimulus, and the gains come quickly.</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>First year:</strong> 10 to 15% improvement is typical with consistent training</li>
                <li><strong>Common trajectory:</strong> 40+ minutes down to sub-30 minutes within 12 months</li>
                <li><strong>Biggest gains:</strong> The first 6 to 8 months, when aerobic base develops most rapidly</li>
              </ul>
              <p className="mt-4">After the first year, improvement slows. A runner who went from 40 minutes to 28 minutes in year one might only drop from 28 to 25 minutes in year two. That is completely normal. The law of diminishing returns applies to running just as it does to everything else. Each minute becomes harder to find as you get faster.</p>
              <p className="mt-4">What drives improvement in that first year is not speed work or complicated training plans. It is consistency. Running 3 to 4 times per week, keeping most of your runs easy, and gradually building your weekly volume is enough to unlock dramatic improvement. A <Link href="/plans" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>structured training plan</Link> accelerates this by ensuring your sessions are properly distributed and progressively overloaded.</p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Age grading: a fairer way to compare</h2>
              <p>Raw finish times do not tell the full story. A 25-minute 5K from a 60-year-old is a far more impressive performance than the same time from a 25-year-old. That is where age grading comes in.</p>
              <p className="mt-4">Age grading adjusts your time against the world record for your age and gender, giving you a percentage score that allows fair comparison across the entire running population. Here is what the levels mean:</p>
              <div className="overflow-x-auto mt-6 mb-4">
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3 pr-6" style={{ color: DIM }}>Age grade</th>
                      <th className="font-label text-[10px] uppercase tracking-widest text-left py-3" style={{ color: DIM }}>Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["100%", "World record"],
                      ["90%+", "World class"],
                      ["80\u201389%", "National level"],
                      ["70\u201379%", "Regional level"],
                      ["60\u201369%", "Local club level"],
                    ].map(([grade, level], i) => (
                      <tr key={i} style={{ borderBottom: i < 4 ? `1px solid ${CARD_BORDER}` : undefined }}>
                        <td className="py-3 pr-6 font-body">{grade}</td>
                        <td className="py-3 font-body">{level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4">Most parkrun results include your age grade alongside your finish time. If you are in the 50 to 60% range, you are performing well as a recreational runner. Hitting 60% or above puts you at local club level, regardless of your raw time. It is a much more motivating metric than comparing yourself to the 22-year-old at the front of the field.</p>
            </FadeIn>

            <FadeIn delay={0.24}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Three things that matter more than your time</h2>
              <p>It is easy to get fixated on the number on the clock. But for beginner runners, there are three things that will have a far bigger impact on your long-term running than your 5K time:</p>
              <p className="mt-4"><strong>1. Consistency.</strong> Running 3 to 4 times per week for six months will improve your 5K time more than any single session or training trick. The runners who get fast are the ones who keep showing up. Missed weeks and stop-start patterns are what keep most beginners stuck at the same level.</p>
              <p className="mt-4"><strong>2. Easy pace discipline.</strong> The single biggest mistake beginner runners make is running too hard on easy days. Roughly 80% of your running should be at a conversational pace &mdash; slow enough that you could hold a full conversation without gasping. If every run feels hard, you are training in a grey zone that builds fatigue without building fitness. Slow down on easy days so you can run faster on hard days.</p>
              <p className="mt-4"><strong>3. Pacing on race day.</strong> Start your 5K slower than you think you should. The first kilometre should feel almost too easy. Build into the middle section, and save your fastest effort for the final kilometre. Negative splitting &mdash; running the second half faster than the first &mdash; is how experienced runners race. It takes discipline, but it consistently produces faster overall times than going out hard and fading.</p>
            </FadeIn>

            <FadeIn delay={0.26}>
              <h2 className="font-headline text-xl md:text-2xl font-bold mb-4 mt-12" style={{ color: TEXT }}>Setting your first 5K goal</h2>
              <p>If you have never raced before, here is a practical way to set a realistic goal. Go to your local parkrun and run at an effort you could sustain for the full 5 km without stopping. Whatever that time is, use it as your baseline. Then set your first race goal 1 to 2 minutes faster than that, which accounts for the race-day adrenaline and taper effect.</p>
              <p className="mt-4">If you do not have a parkrun baseline, use these rough targets based on 8 weeks of beginner training:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Under 25 years old:</strong> Aim for 28 to 32 minutes (men) or 32 to 38 minutes (women)</li>
                <li><strong>25 to 40 years old:</strong> Aim for 30 to 35 minutes (men) or 35 to 40 minutes (women)</li>
                <li><strong>Over 40 years old:</strong> Aim for 33 to 40 minutes (men) or 38 to 45 minutes (women)</li>
              </ul>
              <p className="mt-4">These are achievable goals, not stretch targets. Beating them gives you confidence and a new baseline to work from. The worst thing a beginner can do is set an unrealistic goal, miss it, and feel discouraged. Set a goal you can hit, hit it, and then set a harder one. A <Link href="/intake" className="underline transition-colors hover:text-white" style={{ color: ACCENT }}>personalised training plan</Link> can map out the exact sessions you need to get there, built around your schedule and your current fitness level.</p>
            </FadeIn>

            <FadeIn delay={0.28}>
              <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${RULE}` }}>
                <p className="font-label text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>Keep reading</p>
                <div className="space-y-3">
                  <Link href="/blog/improve-running-pace" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How to Improve Your Running Pace &rarr;</Link>
                  <Link href="/blog/how-often-run-per-week" className="block font-body text-sm transition-colors hover:text-white" style={{ color: ACCENT }}>How Often Should I Run Per Week? &rarr;</Link>
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

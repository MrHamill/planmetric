import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export const maxDuration = 10;

/* ─── Scheduled blog publish dates ────────────────────────────── */
const SCHEDULED_BLOGS: { title: string; slug: string; publishDate: string }[] = [
  { title: "How do I start running as a beginner?", slug: "start-running-beginner", publishDate: "2026-04-18" },
  { title: "How often should I run per week?", slug: "how-often-run-per-week", publishDate: "2026-04-21" },
  { title: "How long does it take to run a 5K?", slug: "how-long-to-run-5k", publishDate: "2026-04-24" },
  { title: "What is a good 5K time for a beginner?", slug: "good-5k-time-beginner", publishDate: "2026-04-27" },
  { title: "How do I improve my running pace?", slug: "improve-running-pace", publishDate: "2026-04-30" },
  { title: "How do I breathe properly when running?", slug: "breathing-while-running", publishDate: "2026-05-03" },
  { title: "What should I eat before a run?", slug: "what-to-eat-before-running", publishDate: "2026-05-06" },
  { title: "How do I avoid injury when running?", slug: "avoid-running-injury", publishDate: "2026-05-09" },
  { title: "How do I train for a half marathon from scratch?", slug: "half-marathon-training-plan", publishDate: "2026-05-12" },
  { title: "How many weeks does it take to train for a marathon?", slug: "marathon-training-weeks", publishDate: "2026-05-15" },
];

/* ─── GET /api/cron/blog-notify ───────────────────────────────
   Called by Vercel Cron daily at 8am AEST.
   Checks if a blog is scheduled for today and sends an email
   notification confirming it is now live.
   ──────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const todaysBlog = SCHEDULED_BLOGS.find((b) => b.publishDate === today);

  /* ─── Check for "start next batch" reminder (1 week after last blog) ─ */
  if (today === "2026-05-08") {
    await sendEmail({
      to: "pete@planmetric.com.au",
      subject: "All 10 blogs are live — time to start the next batch",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #A0522D; margin-bottom: 24px;">Plan Metric Blog</p>
          <h1 style="font-size: 22px; font-weight: 700; color: #1C1614; margin-bottom: 16px;">All 10 running blogs have been posted.</h1>
          <p style="font-size: 15px; color: #3A2E28; line-height: 1.6; margin-bottom: 16px;">
            Every post from the first batch is now live and indexed. Time to start researching and writing the next 10 — this time targeting <strong>triathlon searches</strong>.
          </p>
          <p style="font-size: 15px; color: #3A2E28; line-height: 1.6; margin-bottom: 8px;">
            Here are the 10 highest-value triathlon topics you haven't covered yet:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <thead>
              <tr style="border-bottom: 2px solid #E4DAC8;">
                <th style="text-align: left; padding: 8px 4px; color: #A0522D; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">#</th>
                <th style="text-align: left; padding: 8px 4px; color: #A0522D; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Blog Topic</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #E4DAC8;"><td style="padding: 10px 4px; color: #6B3A2A;">1</td><td style="padding: 10px 4px; color: #1C1614;">What are the triathlon distances? (sprint, Olympic, 70.3, Ironman explained)</td></tr>
              <tr style="border-bottom: 1px solid #E4DAC8;"><td style="padding: 10px 4px; color: #6B3A2A;">2</td><td style="padding: 10px 4px; color: #1C1614;">How do I train for a sprint triathlon?</td></tr>
              <tr style="border-bottom: 1px solid #E4DAC8;"><td style="padding: 10px 4px; color: #6B3A2A;">3</td><td style="padding: 10px 4px; color: #1C1614;">How do I swim in open water for the first time?</td></tr>
              <tr style="border-bottom: 1px solid #E4DAC8;"><td style="padding: 10px 4px; color: #6B3A2A;">4</td><td style="padding: 10px 4px; color: #1C1614;">What is a good triathlon time for a beginner?</td></tr>
              <tr style="border-bottom: 1px solid #E4DAC8;"><td style="padding: 10px 4px; color: #6B3A2A;">5</td><td style="padding: 10px 4px; color: #1C1614;">Triathlon transition tips — how to set up T1 and T2</td></tr>
              <tr style="border-bottom: 1px solid #E4DAC8;"><td style="padding: 10px 4px; color: #6B3A2A;">6</td><td style="padding: 10px 4px; color: #1C1614;">What gear do I need for my first triathlon?</td></tr>
              <tr style="border-bottom: 1px solid #E4DAC8;"><td style="padding: 10px 4px; color: #6B3A2A;">7</td><td style="padding: 10px 4px; color: #1C1614;">How do I train for an Olympic distance triathlon?</td></tr>
              <tr style="border-bottom: 1px solid #E4DAC8;"><td style="padding: 10px 4px; color: #6B3A2A;">8</td><td style="padding: 10px 4px; color: #1C1614;">How do I improve my cycling for triathlon?</td></tr>
              <tr style="border-bottom: 1px solid #E4DAC8;"><td style="padding: 10px 4px; color: #6B3A2A;">9</td><td style="padding: 10px 4px; color: #1C1614;">How do I fuel during a triathlon? (on-course nutrition guide)</td></tr>
              <tr style="border-bottom: 1px solid #E4DAC8;"><td style="padding: 10px 4px; color: #6B3A2A;">10</td><td style="padding: 10px 4px; color: #1C1614;">Can I do a triathlon without a road bike?</td></tr>
            </tbody>
          </table>
          <p style="font-size: 14px; color: #3A2E28; line-height: 1.6; margin-top: 16px;">
            Open Claude Code and start researching these topics. Same process as last time — gather research, then write and schedule.
          </p>
          <p style="margin: 28px 0;">
            <a href="https://planmetric.com.au/blog" style="display: inline-block; background: #A0522D; color: #F0E6D4; text-decoration: none; padding: 12px 28px; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
              View all published blogs &rarr;
            </a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, action: "next-batch-reminder-sent" });
  }

  if (!todaysBlog) {
    return NextResponse.json({ ok: true, message: "No blog scheduled for today" });
  }

  const blogUrl = `https://planmetric.com.au/blog/${todaysBlog.slug}`;
  const remaining = SCHEDULED_BLOGS.filter((b) => b.publishDate > today).length;

  await sendEmail({
    to: "pete@planmetric.com.au",
    subject: `Blog published today: ${todaysBlog.title}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px;">
        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #A0522D; margin-bottom: 24px;">Plan Metric Blog</p>
        <h1 style="font-size: 22px; font-weight: 700; color: #1C1614; margin-bottom: 16px;">New blog is live</h1>
        <p style="font-size: 15px; color: #3A2E28; line-height: 1.6; margin-bottom: 8px;">
          <strong>${todaysBlog.title}</strong> has been published and is now visible on the blog index and sitemap.
        </p>
        <p style="margin: 24px 0;">
          <a href="${blogUrl}" style="display: inline-block; background: #A0522D; color: #F0E6D4; text-decoration: none; padding: 12px 28px; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
            View post &rarr;
          </a>
        </p>
        <hr style="border: none; border-top: 1px solid #E4DAC8; margin: 24px 0;" />
        <p style="font-size: 13px; color: #6B3A2A;">
          ${remaining > 0
            ? `${remaining} more blog${remaining === 1 ? "" : "s"} scheduled. Next one publishes in 3 days.`
            : "This was the final scheduled blog. All 10 posts are now live. You\u2019ll get a reminder on May 22 with 10 new triathlon topics to start on."}
        </p>
        <p style="font-size: 13px; color: #6B3A2A; margin-top: 8px;">
          Consider sharing this post on Instagram today for maximum reach.
        </p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true, published: todaysBlog.slug });
}

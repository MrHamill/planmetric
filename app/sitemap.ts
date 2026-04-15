import type { MetadataRoute } from "next";

export const revalidate = 3600;

const BASE = "https://planmetric.com.au";

const BLOG_POSTS: { slug: string; publishDate: string }[] = [
  { slug: "heart-rate-zones", publishDate: "2025-03-25" },
  { slug: "race-week-nutrition", publishDate: "2025-03-25" },
  { slug: "why-training-plans-fail", publishDate: "2025-03-25" },
  { slug: "brick-sessions-explained", publishDate: "2025-03-25" },
  { slug: "how-to-taper", publishDate: "2025-03-25" },
  { slug: "city2surf-2026-guide", publishDate: "2025-03-25" },
  { slug: "zone-training-complete-guide", publishDate: "2025-03-25" },
  { slug: "triathlon-training-beginners", publishDate: "2025-03-25" },
  { slug: "gold-coast-marathon-2026-guide", publishDate: "2025-03-25" },
  { slug: "start-running-beginner", publishDate: "2026-04-18" },
  { slug: "how-often-run-per-week", publishDate: "2026-04-21" },
  { slug: "how-long-to-run-5k", publishDate: "2026-04-24" },
  { slug: "good-5k-time-beginner", publishDate: "2026-04-27" },
  { slug: "improve-running-pace", publishDate: "2026-04-30" },
  { slug: "breathing-while-running", publishDate: "2026-05-03" },
  { slug: "what-to-eat-before-running", publishDate: "2026-05-06" },
  { slug: "avoid-running-injury", publishDate: "2026-05-09" },
  { slug: "half-marathon-training-plan", publishDate: "2026-05-12" },
  { slug: "marathon-training-weeks", publishDate: "2026-05-15" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/plans`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/assessment`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/intake`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const blogPosts: MetadataRoute.Sitemap = BLOG_POSTS
    .filter((p) => p.publishDate <= today)
    .map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...blogPosts];
}

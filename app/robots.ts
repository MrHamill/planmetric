import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/plan/", "/intake/success", "/plans/success", "/thank-you"],
    },
    sitemap: "https://planmetric.com.au/sitemap.xml",
  };
}

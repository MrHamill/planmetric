export function ArticleJsonLd({ title, description, slug, datePublished }: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://planmetric.com.au/blog/${slug}`,
    datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Organization",
      name: "Plan Metric",
      url: "https://planmetric.com.au",
    },
    publisher: {
      "@type": "Organization",
      name: "Plan Metric",
      url: "https://planmetric.com.au",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

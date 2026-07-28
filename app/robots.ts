import type { MetadataRoute } from "next";

// Generates /robots.txt.
//
// IMPORTANT: while the site is non-indexable we still ALLOW crawling. That looks
// backwards, but it's deliberate: a crawler must be able to fetch a page to see its
// `noindex` directive. "Disallow: /" would block the fetch, so Google could still index
// bare URLs it discovered elsewhere (the classic "No information is available for this
// page" result) and would never learn we wanted them dropped.
//
// The actual blocking is done by `noindex` in two places:
//   - the `robots` metadata in app/layout.tsx (HTML pages)
//   - the X-Robots-Tag header in next.config.ts (everything, incl. images/PDF/API)
//
// If you need the site genuinely unreachable rather than just unlisted, use Vercel
// Deployment Protection / HTTP auth instead — that's the only airtight option.
export default function robots(): MetadataRoute.Robots {
  const isIndexable = process.env.SITE_INDEXABLE === "true";

  if (!isIndexable) {
    return { rules: [{ userAgent: "*", allow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://finevuaustralia.com.au/sitemap.xml",
  };
}

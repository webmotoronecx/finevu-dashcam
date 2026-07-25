import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Import *.svg as React components (SVGR). Renders <IconCheck className=... />.
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  async redirects() {
    return [
      // The "Where to buy" page was renamed to "Retailers"; keep old links working.
      { source: "/where-to-buy", destination: "/retailers", permanent: true },
    ];
  },
  async headers() {
    // Search-engine visibility is OFF unless SITE_INDEXABLE === "true" (fail-safe: a
    // missing var keeps the site hidden). This header is the authoritative signal — it
    // covers every response, not just HTML, so images/PDFs/API routes are excluded from
    // search too. Keep it in sync with the `robots` metadata in app/layout.tsx.
    if (process.env.SITE_INDEXABLE === "true") return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
        ],
      },
    ];
  },
};

export default nextConfig;

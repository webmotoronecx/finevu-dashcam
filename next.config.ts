import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Import *.svg as React components (SVGR). Renders <IconCheck className=... />.
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              // Drop the hardcoded width/height so the icon is sized purely by CSS...
              dimensions: false,
              // ...and keep viewBox, which SVGO strips by default. Without it the SVG
              // cannot scale: CSS resizes the canvas while the artwork stays at its
              // native size, so anything past the new box is clipped.
              svgoConfig: {
                plugins: [
                  { name: "preset-default", params: { overrides: { removeViewBox: false } } },
                ],
              },
            },
          },
        ],
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

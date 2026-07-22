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
};

export default nextConfig;

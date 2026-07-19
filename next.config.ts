import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The "Where to buy" page was renamed to "Retailers"; keep old links working.
      { source: "/where-to-buy", destination: "/retailers", permanent: true },
    ];
  },
};

export default nextConfig;

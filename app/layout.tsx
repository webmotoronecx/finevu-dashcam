import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { ComingSoonGate } from "@/components/ComingSoonGate";
import { siteConfig } from "@/config/site.config";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Search-engine visibility is OFF unless SITE_INDEXABLE is explicitly "true".
// Fail-safe by design: a missing/typo'd env var keeps the site noindex rather than
// silently exposing it. Flip it only when the site is meant to rank publicly.
// NOTE: this must stay paired with the X-Robots-Tag header in next.config.ts and the
// crawl-allowing app/robots.ts — crawlers have to be able to FETCH a page to see its
// noindex directive, so we deliberately do NOT "Disallow: /".
export const isIndexable = process.env.SITE_INDEXABLE === "true";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  robots: isIndexable
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <ComingSoonGate>{children}</ComingSoonGate>
        <Analytics />
      </body>
    </html>
  );
}

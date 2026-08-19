import type { Metadata, Viewport } from "next";
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

// Tints the browser chrome — on iOS Safari this is the bar behind the URL field at
// the bottom of the screen, which otherwise picks up the page's white background.
// #0A0A0B is the brand near-black (--foreground); Safari flips the bar's own text to
// light automatically off its luminance. This is site-wide, not per-page.
export const viewport: Viewport = {
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* data-scroll-behavior tells the App Router to suspend the page's smooth scrolling for the
     duration of a route transition. globals.css sets `scroll-behavior: smooth` on <html> for
     the in-page anchors (#apply, #why, the wizard's scrollIntoView), and without this
     attribute the router's scroll-to-top obeys it too — so submitting a form near the footer
     ANIMATED the entire page height up to the top of the thank-you page instead of arriving
     there.

     Next stopped disabling this automatically in 15.3; the attribute is the opt-in that
     replaced it. Removing it brings the animation back on EVERY navigation, not just the
     thank-you pages — it is only least bearable there, because forms sit low on the page. */
  return (
    <html lang="en" data-scroll-behavior="smooth">
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

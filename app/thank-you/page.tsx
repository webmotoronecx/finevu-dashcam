import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { ThankYou } from "@/components/ThankYou";
import { genericThankYou, withOverrides } from "@/lib/data/thank-you";

// Generic fallback so the bare /thank-you URL is never a dead end.
// Per-form variants live at /thank-you/[type]. Heading and paragraph accept
// ?title= / ?desc= overrides here too.

export const metadata: Metadata = {
  title: "Thank you",
  description: genericThankYou.body,
  // Pinned regardless of SITE_INDEXABLE — a thank-you page must never be indexed,
  // or cold organic traffic lands on a confirmation it never earned.
  robots: { index: false, follow: true },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <ThankYou variant={withOverrides(genericThankYou, await searchParams)} />
      <LearnMoreLinks />
      <Footer />
    </div>
  );
}

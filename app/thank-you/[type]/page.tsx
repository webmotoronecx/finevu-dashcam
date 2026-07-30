import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { ThankYou } from "@/components/ThankYou";
import { thankYouSlugs, thankYouVariants, withOverrides } from "@/lib/data/thank-you";

// Per-form confirmation pages: /thank-you/contact, /thank-you/register, etc.
// Forms router.push() here on a successful submit. Copy lives in lib/data/thank-you.ts.
//
// The heading and its paragraph accept per-submit overrides via ?title= / ?desc=
// (build the URL with thankYouUrl()); anything omitted falls back to the variant.

type SearchParams = Record<string, string | string[] | undefined>;
type Props = { params: Promise<{ type: string }>; searchParams: Promise<SearchParams> };

export function generateStaticParams() {
  return thankYouSlugs.map((type) => ({ type }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { type } = await params;
  const variant = thankYouVariants[type];
  return {
    title: variant ? variant.eyebrow : "Thank you",
    description: variant?.body,
    // Pinned regardless of SITE_INDEXABLE — see app/thank-you/page.tsx.
    robots: { index: false, follow: true },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { type } = await params;
  const variant = thankYouVariants[type];
  if (!variant) notFound();

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <ThankYou variant={withOverrides(variant, await searchParams)} />
      <LearnMoreLinks />
      <Footer />
    </div>
  );
}

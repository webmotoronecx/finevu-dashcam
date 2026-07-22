import { BrandedNotice } from "@/components/BrandedNotice";

export default function NotFound() {
  return (
    <BrandedNotice
      logo={false}
      eyebrow="Page not found"
      title="404"
      sub="The page you're looking for doesn't exist or has moved."
      cta={{ label: "Back to Home", href: "/" }}
    />
  );
}

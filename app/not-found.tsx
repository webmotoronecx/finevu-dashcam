import { ComingSoon } from "@/components/ComingSoon";

/**
 * Unmatched routes render the same branded "Coming Soon" placeholder used by
 * <ComingSoonGate>, so visitors never land on a bare 404 while the site is
 * still filling out. Next.js still serves this with a 404 HTTP status, so
 * crawlers learn the URL doesn't exist — only the wording is friendlier.
 */
export default function NotFound() {
  return <ComingSoon />;
}

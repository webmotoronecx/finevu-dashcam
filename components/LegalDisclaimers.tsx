import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

/**
 * Site-wide legal fine print (warranty, SD cards, hardwire kit).
 *
 * Content lives in `siteConfig.disclaimers` so the warranty/ACL wording exists exactly
 * once — it previously sat in five pages and had drifted into three different versions.
 *
 * Numbering comes from <ol> order, and the sup="1|2|3" footnote markers on the product
 * and homepage tiles reference those positions. See the `disclaimers` docs in
 * config/site.config.ts before changing the order.
 */
export function LegalDisclaimers({
  theme = "light",
  className,
  limit,
}: {
  /** Text colour + data-nav-theme. Default "light". */
  theme?: "light" | "dark";
  /** Per-page background and vertical spacing — the component supplies none. */
  className?: string;
  /**
   * Render only the first N disclaimers, for pages that make just some of the claims
   * (e.g. /about only cites the warranty). Deliberately "first N" rather than an
   * arbitrary pick: <ol> numbers sequentially from 1, so taking a subset off the front
   * keeps each entry's number matching its footnote marker. Selecting, say, only the
   * 3rd entry would render it as "1" and silently break the reference.
   */
  limit?: number;
}) {
  const items = limit ? siteConfig.disclaimers.slice(0, limit) : siteConfig.disclaimers;

  return (
    // data-nav-theme is required on every full-width section, otherwise the navbar
    // picks the wrong contrast when scrolled over this block.
    // Background and padding are theme defaults; anything passed via className wins
    // (cn/twMerge resolves the conflict in favour of the caller).
    <section
      data-nav-theme={theme}
      className={cn(
        "py-12 md:py-14",
        theme === "dark" ? "bg-[#0f0f0f]" : "bg-[#EBEBEB]",
        className,
      )}
    >
      <div className="mx-auto max-w-[1220px] px-6">
        <ol
          className={cn(
            "list-decimal space-y-4 ps-5 text-[12px] font-medium leading-[18px]",
            theme === "dark" ? "text-[#838383]" : "text-[#9aa0ad]",
          )}
        >
          {items.map((d) => (
            <li key={d.title}>
              {d.title}
              <br />
              {d.body}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

interface LogoProps {
  /** Tailwind size/spacing classes — controls the wordmark size via font-size */
  className?: string;
  /**
   * "primary" — orange FINE + grey Vu (use on dark, gradient or white)
   * "white"   — all white (use on orange or busy imagery)
   */
  variant?: "primary" | "white";
}

/**
 * FineVu wordmark. Rendered as live text in the brand font (Inter) so it always
 * matches the site typography and recolours cleanly per background.
 * "FINE" in FineVu orange, "Vu" in FineVu grey.
 */
export function Logo({ className = "text-2xl", variant = "primary" }: LogoProps) {
  const fine = variant === "white" ? "text-white" : "text-[var(--finevu-orange)]";
  const vu = variant === "white" ? "text-white" : "text-[var(--finevu-grey)]";

  return (
    <span
      className={`font-sans font-bold tracking-tight leading-none select-none ${className}`}
      aria-label="FineVu"
    >
      <span className={fine}>FINE</span>
      <span className={vu}>Vu</span>
    </span>
  );
}

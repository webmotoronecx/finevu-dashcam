interface LogoProps {
  /** Tailwind height class — controls the wordmark size, e.g. "h-7", "h-8" */
  className?: string;
  /**
   * "primary" — official orange FINE + grey Vu wordmark (use on dark, gradient or white)
   * "white"   — all-white wordmark (use on orange or busy imagery)
   */
  variant?: "primary" | "white";
}

/**
 * FineVu wordmark — official brand logo asset (public/brand/).
 * "primary" = orange/grey master logo; "white" = reversed white logo.
 */
export function Logo({ className = "h-7", variant = "primary" }: LogoProps) {
  const src =
    variant === "white" ? "/brand/finevu-logo-white.png" : "/brand/finevu-logo.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="FineVu"
      className={`${className} w-auto select-none`}
      draggable={false}
    />
  );
}

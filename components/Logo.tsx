interface LogoProps {
  /** Tailwind height class — controls the wordmark size, e.g. "h-7", "h-8" */
  className?: string;
  // Variants are named for the surface they sit on:
  //   "primary"  — orange FINE + brand-grey (#A2A2A3) Vu; for white backgrounds only.
  //   "contrast" — same wordmark, Vu darkened to #6E6E71. Use on grey/off-white surfaces
  //                (#f7f7f7, zinc-50, the light nav glass), where the brand grey drops to
  //                ~2.3:1 and the "Vu" visually disappears. #6E6E71 lands at ~5:1.
  //   "dark"     — orange FINE + white Vu; for dark/gradient backgrounds.
  //   "white"    — fully reversed wordmark; for orange or busy photographic backgrounds.
  variant?: "primary" | "contrast" | "dark" | "white";
}

// FineVu wordmark from the official brand asset in public/brand/
const SOURCES: Record<NonNullable<LogoProps["variant"]>, string> = {
  primary: "/brand/finevu-logo.png",
  contrast: "/brand/finevu-logo-contrast.png",
  dark: "/brand/finevu-logo-dark.png",
  white: "/brand/finevu-logo-white.png",
};

export function Logo({ className = "h-7", variant = "primary" }: LogoProps) {
  const src = SOURCES[variant];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="FineVu"
      className={`${className} select-none`}
      draggable={false}
    />
  );
}

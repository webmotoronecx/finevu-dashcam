interface LogoProps {
  /** Tailwind height class — controls the wordmark size, e.g. "h-7", "h-8" */
  className?: string;
  // "primary" = orange/grey wordmark (dark/gradient/white bg); "white" = reversed wordmark (orange/busy bg)
  variant?: "primary" | "white";
}

// FineVu wordmark from the official brand asset in public/brand/
export function Logo({ className = "h-7", variant = "primary" }: LogoProps) {
  const src =
    variant === "white" ? "/brand/finevu-logo-white.png" : "/brand/finevu-logo.png";

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

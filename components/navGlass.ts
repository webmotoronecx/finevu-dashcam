/**
 * Translucent glass surface for the navbar rows, themed to the section beneath them
 * (see the `data-nav-theme` sampler in components/Navigation.tsx).
 *
 * Lives in its own module so <Navigation> and <ProductSubNav> can share one definition
 * without importing each other. The border colour is exposed separately as a class so
 * each row can choose which edges it draws — the floating pill outlines all four, the
 * full-width rows only their bottom hairline.
 */
export function glassStyle(isDark: boolean): React.CSSProperties {
  // Dark values are the Figma spec verbatim: rgba(217,217,217,0.05) over a 10px blur.
  // The #D9D9D9 tint reads all but identically to white at 5%, but keep it as-is so the
  // token matches the design file. Light theme is unspecified in Figma; it keeps the
  // opaque-ish white it already had, at the same blur.
  const blur = "blur(10px)";
  return {
    background: isDark ? "rgba(217, 217, 217, 0.05)" : "rgba(255, 255, 255, 0.72)",
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
    transition: "background 250ms ease, border-color 250ms ease",
  };
}

export function glassBorderClass(isDark: boolean): string {
  return isDark ? "border-white/15" : "border-black/[0.06]";
}

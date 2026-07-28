// Shared section heading with an optional accent-highlighted word.
// Extracted from the GX4K product page; the accent token travels with it.
//
// The accent differs by theme rather than by prop: GX4K clips a purple→blue
// gradient into the text, GX35 uses flat brand orange. Theme is explicit
// (`theme="dark" | "light"`), matching BentoCard/MediaSection.

export type HeadTheme = "dark" | "light";

const THEME: Record<HeadTheme, { text: string; grad: string | null; accent: string }> = {
  dark: {
    text: "text-white",
    grad: "linear-gradient(90deg, #8ea6f0 0%, #b79ce2 100%)",
    accent: "",
  },
  light: {
    text: "text-[#1D1D1F]",
    grad: null, // flat orange, not a gradient clip
    accent: "text-[#f68428]",
  },
};

export function Head({
  pre = "",
  grad = "",
  post = "",
  className = "",
  theme = "dark",
  as: Tag = "h2",
}: {
  pre?: string;
  grad?: string;
  post?: string;
  className?: string;
  theme?: HeadTheme;
  as?: "h1" | "h2" | "h3";
}) {
  const t = THEME[theme];
  return (
    <Tag
      className={`font-semibold tracking-[-0.01em] ${t.text} text-[30px] md:text-[42px] leading-[1.12] ${className}`}
    >
      {pre}
      {grad &&
        (t.grad ? (
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: t.grad, WebkitBackgroundClip: "text" }}
          >
            {grad}
          </span>
        ) : (
          <span className={t.accent}>{grad}</span>
        ))}
      {post}
    </Tag>
  );
}

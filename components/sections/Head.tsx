// Shared section heading with an optional gradient-highlighted word.
// Extracted from the GX4K product page; the gradient token travels with it.

const HEAD_GRAD = "linear-gradient(90deg, #8ea6f0 0%, #b79ce2 100%)";

export function Head({
  pre = "",
  grad = "",
  post = "",
  className = "",
  as: Tag = "h2",
}: {
  pre?: string;
  grad?: string;
  post?: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <Tag
      className={`font-semibold tracking-[-0.01em] text-white text-[30px] md:text-[42px] leading-[1.12] ${className}`}
    >
      {pre}
      {grad && (
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: HEAD_GRAD, WebkitBackgroundClip: "text" }}
        >
          {grad}
        </span>
      )}
      {post}
    </Tag>
  );
}

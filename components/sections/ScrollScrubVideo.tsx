"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore, type CSSProperties } from "react";

/**
 * Scroll-scrubbed video background section.
 *
 * The section is a tall track; an inner sticky stage pins a full-bleed backdrop while scroll
 * progress drives the overlays. Pass either `video` — whose `currentTime` is *scrubbed* by scroll
 * (we own playback; the video is paused, never autoplayed/looped) — or `image` for a still
 * backdrop, which skips the seeking and rAF loop entirely and leaves everything else identical.
 * Two kinds of overlay ride on top, each revealed on its own scroll window:
 *   - `beats`    — centered headline moments (like ScrollHero).
 *   - `callouts` — annotation blocks (title · sub · divider · spec list) joined to a point on
 *                  the footage by a gradient leader line, styled like
 *                  components/sections/OpticsSection.tsx. Stacks vertically below `lg`.
 *
 * Callouts are authored *point-first*: `at` is the feature on the footage (in `stageViewBox`
 * units, so it tracks the video at any size) and the leader + block are then built outward
 * from it in **fixed CSS pixels**. That split is deliberate — the block's text is fixed-px, so
 * anchoring the block in viewBox units instead made it drift further from the product, on an
 * ever-longer leader, the larger the display got. See `syncCallouts` for the geometry.
 *
 * Why no GSAP: the cost of scrubbing is the browser *seeking/decoding* video frames, not
 * the animation library — a library would just set `currentTime` like we do here. For
 * smooth seeks the source MP4 must be encoded with dense keyframes, e.g.:
 *   ffmpeg -i in.mov -an -c:v libx264 -g 1 -keyint_min 1 -sc_threshold 0 \
 *     -pix_fmt yuv420p -crf 20 -movflags +faststart out.mp4
 */

export type ScrubBeat = {
  /** Scroll-progress window (0..1) over which this beat is visible. */
  start: number;
  end: number;
  kicker?: string;
  headline: string;
  sub?: string;
};

export type ScrubCallout = {
  key: string;
  /** Big label, e.g. "Front". */
  title: string;
  /** Small sub-label under the title, e.g. "UHD wide". */
  sub?: string;
  /** Spec lines listed under the divider. */
  items: string[];
  /** Scroll-progress window (0..1) over which the block fades in. */
  start: number;
  end: number;
  /** The feature being annotated — a point on the video frame, in `stageViewBox` units. The lg+
   *  stage is sized to the video's object-cover rect, so this tracks the same spot on the footage
   *  at every viewport size. The leader line's tip lands here; the block hangs off the far end. */
  at: [number, number];
  /** Which way the leader runs out of `at`, and so where the block lands relative to it.
   *  E.g. "top-left" → up-and-left, putting the block above and left of the feature. */
  direction: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Shape of the two-segment leader running from `at` out to the block:
   *   - `angle` — degrees off horizontal for the first, angled leg (default 45).
   *   - `diag`  — that leg's length in CSS px (default 165).
   *   - `run`    — the following horizontal leg's length in CSS px (default 55). This is the
   *                standoff between the bend and the block's edge, where the underline takes over.
   *   - `radius` — corner radius at the bend, in CSS px (default 0 = a sharp corner). Clamped to
   *                what the two legs can give up, so an over-large value just maxes out.
   *
   *  All three are **CSS pixels / literal degrees**, never viewBox units — that's the whole point:
   *  the leader is the same on-screen shape on a laptop and a 4K display, so the block sits a
   *  constant distance from what it labels while `at` alone scales with the footage. */
  leader?: { angle?: number; diag?: number; run?: number; radius?: number };
  /** Entrance slide direction as the block fades in (default "bottom" → slides up). */
  from?: "bottom" | "left" | "right";
};

// Theme tokens: dark (GX4K default) vs light (GX35) — mirrors OpticsSection's THEMES so the two
// sections stay visually interchangeable on a page.
type ScrubTheme = {
  nav: "dark" | "light";
  /** Backdrop behind the pinned media, and behind the mobile stack / reduced-motion fallback. */
  stageBg: string;
  sectionBg: string;
  reducedBg: string;
  headTitle: string;
  headSub: string;
  /** Beat body copy — kept distinct from headSub so the dark theme keeps its original white/90. */
  beatSub: string;
  /** Text legibility treatments — real shadows over video, "none" on light. */
  headShadow: string;
  textShadow: string;
  kickerGrad: string;
  beatGrad: string;
  calloutTitle: string;
  calloutSub: string;
  calloutDivider: string;
  calloutItem: string;
  lineStops: { offset: string; color: string }[];
  scrim: string | null;
  /** Fade into the page colour at the bottom of the stage, and the full-cover fade on exit. */
  bottomFade: string;
  exitFade: string;
  /** The pulsing scroll-hint tick. Themed because it's painted, not a class — the dark theme's
   *  white would be invisible on light. */
  scrollHintGrad: string;
};

const THEMES: Record<"dark" | "light", ScrubTheme> = {
  dark: {
    nav: "dark",
    stageBg: "bg-black",
    sectionBg: "bg-[#08080c]",
    reducedBg: "radial-gradient(ellipse at 50% 40%, #0f1424 0%, #08080c 70%)",
    headTitle: "text-white",
    headSub: "text-[#c8ccd8]",
    beatSub: "text-white/90",
    headShadow: "drop-shadow(0 2px 18px rgba(0,0,0,0.55))",
    textShadow: "0 1px 12px rgba(0,0,0,0.8)",
    kickerGrad: "linear-gradient(90deg, #b3c4f5, #cbb0ee)",
    beatGrad: "linear-gradient(120deg, #ffffff 0%, #d0dafb 46%, #c1abec 100%)",
    calloutTitle: "text-[#f5f3f0]",
    calloutSub: "text-[#6e8fe6]",
    calloutDivider: "linear-gradient(90deg, #ffffff 0%, #6e8fe6 55%, #4f2d74 100%)",
    calloutItem: "text-white",
    lineStops: [
      { offset: "0%", color: "#ffffff" },
      { offset: "55%", color: "#6e8fe6" },
      { offset: "100%", color: "#4f2d74" },
    ],
    scrim:
      "radial-gradient(ellipse 78% 58% at 50% 50%, rgba(6,7,11,0.62) 0%, rgba(6,7,11,0.34) 46%, rgba(6,7,11,0.06) 74%, transparent 100%)",
    bottomFade:
      "[background-image:linear-gradient(to_bottom,rgba(8,8,12,0)_0%,rgba(8,8,12,0.55)_45%,rgba(8,8,12,0.88)_75%,#08080c_100%)] md:[background-image:linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]",
    exitFade: "bg-black",
    scrollHintGrad: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
  },
  light: {
    nav: "light",
    stageBg: "bg-white",
    sectionBg: "bg-white",
    reducedBg: "radial-gradient(ellipse at 50% 40%, #ffffff 0%, #f2f2f4 70%)",
    headTitle: "text-[#1d1d1f]",
    headSub: "text-[#6e6e73]",
    beatSub: "text-[#3a3a42]",
    headShadow: "none",
    textShadow: "none",
    kickerGrad: "linear-gradient(90deg, #f68428, #ffb682)",
    beatGrad: "linear-gradient(120deg, #1d1d1f 0%, #3a3a42 46%, #6e6e73 100%)",
    calloutTitle: "text-[#1d1d1f]",
    calloutSub: "text-[#f68428]",
    calloutDivider: "linear-gradient(90deg, #ffb682 0%, #f68428 65%, #f68428 100%)",
    calloutItem: "text-[#1d1d1f]",
    // Deliberately the same ramp as `calloutDivider` above: on the pinned overlay the leader *is*
    // the block's underline, so a different colour here would split one stroke into two.
    lineStops: [
      { offset: "0%", color: "#ffb682" },
      { offset: "65%", color: "#f68428" },
      { offset: "100%", color: "#f68428" },
    ],
    scrim: null,
    bottomFade:
      "[background-image:linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,0.55)_45%,rgba(255,255,255,0.88)_75%,#ffffff_100%)]",
    exitFade: "bg-white",
    scrollHintGrad: "linear-gradient(to bottom, rgba(29,29,31,0.35), transparent)",
  },
};

const emptySubscribe = () => () => {};
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Leader defaults — see `ScrubCallout.leader`. Lengths are CSS px, `angle` is degrees. */
const LEADER = { angle: 45, diag: 165, run: 55, radius: 0 };

// Scroll → video time. Default is linear (0→duration). With `reverseAt` set, it's a
// triangle: play forward reaching the last frame exactly at p=reverseAt, then reverse
// back to frame 0 by p=1 — the clip winds forward then rewinds to its initial state.
function scrubTime(p: number, duration: number, reverseAt?: number) {
  if (!reverseAt || reverseAt <= 0 || reverseAt >= 1) return p * duration;
  return p <= reverseAt
    ? (p / reverseAt) * duration
    : (1 - (p - reverseAt) / (1 - reverseAt)) * duration;
}

/** Section title + description — mirrors OpticsSection's OpticsHead, legible over video. */
function ScrubHead({ head, t, className = "" }: { head: SectionHead; t: ScrubTheme; className?: string }) {
  return (
    <div className={`pointer-events-auto mx-auto max-w-[720px] text-center ${className}`}>
      <h2 className={`text-[28px] font-semibold leading-[1.12] tracking-[-0.01em] md:text-[42px] ${t.headTitle}`} style={{ filter: t.headShadow }}>
        {head.title}
      </h2>
      {head.subtitle && (
        <p className={`mx-auto mt-4 max-w-[560px] text-[15px] leading-[1.6] md:text-[18px] ${t.headSub}`} style={{ textShadow: t.textShadow }}>
          {head.subtitle}
        </p>
      )}
    </div>
  );
}

export type SectionHead = { title: string; subtitle?: string };

// How hard the video time chases the scroll target each frame (0..1). Lower = smoother
// but laggier; this makes even cheap encodes look fluid and avoids seek-spam jank.
const LERP = 0.15;

// Height of the sticky stage at md+ — also the `H` in the object-cover width formula below, so the
// callout layer resolves to the video's exact rendered box. Keep the two in lockstep.
const STAGE_H = "100dvh";

// Framing for the backdrop, shared by the <video> and <img> branches so they can't drift apart —
// the callout stage is computed from this exact box. Below md, `mobileObjectPosition` picks which
// slice of the (cropped) frame shows and `mobileScale` zooms it; md+ resets to normal.
//
// Two independent vertical adjustments, both applied identically to the media and to the callout
// stage below — they must move as one box or every leader detaches from the artwork:
//   `--ssv-head`  (`headroom`) reserves space at the top; the media *shrinks* by that much.
//   `--ssv-nudge` (`nudgeY`)   slides everything down at full size; the overflow is clipped.
// Both resolve percentages against the same containing block (the sticky stage), so a `%` nudge
// means the same thing to each.
//
// `--ssv-maxw` (`maxMediaWidth`) is the third shared value: a ceiling on the box width, defaulting
// to `100%` so it's a no-op unless the prop is set. `inset-x-0` + `mx-auto` centres the box once
// the cap bites — auto inline margins resolve against left:0/right:0, so no extra transform.
//
// ⚠️ The cap itself is applied *inline* via `mediaStyle`, NOT as a `max-w-[…]` class here.
// `app/globals.css` carries an **unlayered** `img, video, svg { max-width: 100% }` (the iOS
// horizontal-overflow guard), and unlayered declarations outrank everything in `@layer utilities`
// — so a Tailwind `max-w-*` on a media element is silently dead no matter how specific it looks.
// The class generates fine and computes to 100%; only an inline style wins. Don't "tidy" it back.
const MEDIA_CLASS =
  "absolute top-50 md:top-[calc(var(--ssv-head)+var(--ssv-nudge))] inset-0 mx-auto w-full object-cover [object-position:var(--ssv-pos)] [transform:scale(var(--ssv-scale))] md:[object-position:center] md:[transform:none] h-[60dvh] md:h-[calc(100%-var(--ssv-head))]";

// `fit="contain"`: the box is sized by *width* and carries the media's own aspect ratio, so the
// media fills it exactly — no crop, and therefore no exposed top edge. It overflows the stage on
// wide viewports and leaves a band of `stageBg` on narrow ones, where the visible edge is the
// media's true row 0. This is OpticsSection's model, and the reason that section has no seam.
//
// `headroom` doesn't apply here (there's no box height to give up); `nudgeY` does all the work.
const MEDIA_CLASS_CONTAIN =
  "absolute inset-x-0 mx-auto w-full top-[calc(50%+var(--ssv-nudge,0px))] -translate-y-1/2 object-cover";

/** One annotation block — shared by the pinned overlay and the mobile stack.
 *
 * `measureDivider` is only passed by the pinned overlay, and `anchored` keys off it: there the
 * leader line *is* the divider — its last segment runs under the block — so this element renders
 * unpainted, as a 1px spacer holding the vertical rhythm and marking the row `syncCallouts`
 * measures. In normal flow (mobile stack / reduced motion) there is no leader, so it keeps its
 * painted gradient and draws the rule itself.
 *
 * Hide it with `display:none` (a `hidden`/`md:hidden` class) and the leader breaks: a
 * display:none element reports offsetWidth/offsetTop of 0, so every block would be placed at the
 * stage's origin with a zero-length underline. Unpainted-but-laid-out is the point. */
function CalloutBlock({ data, t, measureDivider }: { data: ScrubCallout; t: ScrubTheme; measureDivider?: (el: HTMLDivElement | null) => void }) {
  const anchored = measureDivider !== undefined;
  return (
    <div className="w-full ">
      <p className={`text-[28px] font-semibold leading-none xl:text-[34px] ${t.calloutTitle}`} style={{ filter: t.headShadow }}>
        {data.title}
      </p>
      {data.sub && (
        <p className={`mt-1.5 text-[12px] font-semibold tracking-wide xl:text-[13.6px] ${t.calloutSub}`} style={{ textShadow: t.textShadow }}>
          {data.sub}
        </p>
      )}
      <div
        ref={measureDivider}
        className="mt-3 h-px w-full"
        style={anchored ? undefined : { backgroundImage: t.calloutDivider }}
      />
      <ul className="mt-3.5 space-y-1.5">
        {data.items.map((it) => (
          <li key={it} className={`text-[13px] font-medium xl:text-[14.4px] ${t.calloutItem}`} style={{ textShadow: t.textShadow }}>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ScrollScrubVideo({
  video,
  image,
  poster,
  head,
  beats = [],
  callouts = [],
  scrubLength = "300vh",
  startVisible = 1,
  holdLength = "0vh",
  reverseAt,
  reverseOnExit = false,
  mobileObjectPosition = "center",
  mobileScale = 1,
  stageViewBox = "0 0 1920 1080",
  sectionClass = "",
  overlayScrim = true,
  theme = "dark",
  themeOverrides,
  headroom = 0,
  nudgeY = "0px",
  scrollHint = true,
  fit = "cover",
  maxMediaWidth,
  pinOnMobile = true,
  mobileVideo,
  mobileMediaClass = "",
}: {
  /** Video source (public path or remote URL). Encode with dense keyframes — see file header.
   *  Mutually exclusive with `image`; pass exactly one. */
  video?: string;
  /** Static background instead of a scrubbed clip. Everything else is unchanged — the section
   *  still pins, and beats/callouts still reveal on scroll — there is simply no footage to scrub,
   *  so no seeking and no rAF loop. Use this when the reveal is the point and the backdrop is a
   *  still (e.g. a product render). Mutually exclusive with `video`. */
  image?: string;
  /** Poster / first-frame image; also the static image shown under reduced motion. Video only —
   *  in `image` mode the image itself serves both roles. */
  poster?: string;
  /** Optional section title + description, pinned near the top of the stage (like OpticsSection). */
  head?: SectionHead;
  /** Centered headline moments. */
  beats?: ScrubBeat[];
  /** Positioned annotation blocks with optional connector lines. */
  callouts?: ScrubCallout[];
  /** Height of the scroll track that drives the scrub (default "300vh"). */
  scrubLength?: string;
  /** How much of the viewport the section must fill before the scrub starts, 0..1.
   *  `1` (default) = the old behaviour: progress 0 the moment the section is pinned
   *  (its top at the top of the viewport). `0.5` starts scrubbing while the section is
   *  only half on screen, so the video is already moving as it slides up into the pin.
   *  Lowering it lengthens the total scroll travel by `(1 − startVisible) × 100vh`
   *  without changing `scrubLength`, so beats/callout windows keep their relative shape. */
  startVisible?: number;
  /** Extra scroll (e.g. "80vh") the section stays pinned *after* the scrub finishes, before it
   *  unsticks. Added on top of `scrubLength`; the scrub still completes over `scrubLength`, then
   *  everything holds on the last frame — video, beats and connectors all freeze — for this much
   *  scroll. With `reverseOnExit` the hold sits between the forward scrub and the rewind, so the
   *  final frame lands before the section starts sliding away. Default "0vh" (no hold). */
  holdLength?: string;
  /** Optional "transition end": scroll progress (0..1) at which the video finishes
   *  playing forward and starts reversing back to frame 0. Omit for the default
   *  forward-only linear scrub. Typical value 0.6–0.75. Composes with `reverseOnExit`
   *  — there it overrides the geometry-derived split so you can tune where the flip lands. */
  reverseAt?: number;
  /** Reverse *as the section releases*, not while pinned: the video plays forward over
   *  the whole pinned range, then rewinds to frame 0 during the exit — while the next
   *  section scrolls into view. On its own the split is derived from `scrubLength` (the
   *  pin lasts `(scrubLength − 100vh)` of the track); pass `reverseAt` too to override it. */
  reverseOnExit?: boolean;
  /** Mobile-only (< md) framing of the object-cover video. `mobileObjectPosition` is a
   *  CSS object-position (e.g. "center", "50% 40%") choosing which slice of the cropped
   *  frame shows; `mobileScale` zooms it (>1 tighter/more crop, <1 pulls back but reveals
   *  the section background around the video). Both reset to normal at md+. Note: cover
   *  can't un-crop the sides — for a full uncropped mobile frame, supply a portrait clip. */
  mobileObjectPosition?: string;
  mobileScale?: number;
  /** Coordinate space for `callout.at` anchors and `callout.line` points. This **must** match the
   *  video's intrinsic pixel size — the callout layer is sized to the video's object-cover rect, so
   *  a mismatched aspect ratio skews every anchor and connector. Check with
   *  `ffprobe -show_entries stream=width,height <file>`; a mismatch warns in dev. */
  stageViewBox?: string;
  /** Extra classes on the outer <section>. */
  sectionClass?: string;
  /** Show the legibility scrim + bottom fade over the video (default true). The light theme has no
   *  scrim to begin with, so this only bites on dark. */
  overlayScrim?: boolean;
  /** Colour scheme — "dark" (default, GX4K) or "light" (GX35). Drives the nav theme, backdrop,
   *  scrim, fades and every text/line token, mirroring OpticsSection's `theme`. */
  theme?: "dark" | "light";
  /** Per-instance tweaks to the chosen `theme`, shallow-merged over it. For the one-off cases a
   *  preset can't express — e.g. light everywhere but with no bottom fade on this page:
   *
   *      <ScrollScrubVideo theme="light" themeOverrides={{ bottomFade: "", exitFade: "" }} />
   *
   *  The three atmosphere layers are disabled by falsy values: `scrim: null` drops the element,
   *  and `bottomFade`/`exitFade` set to `""` keep the element but paint nothing. Prefer editing
   *  THEMES when a change should apply everywhere — this is for the exceptions. */
  themeOverrides?: Partial<ScrubTheme>;
  /** Pixels reserved at the top of the pinned stage (md+ only, default 0). The backdrop starts
   *  that far down and gives up that much height, so `head` gets a band the artwork doesn't reach
   *  into — without it a tall subject sits straight under the title, which is only survivable on
   *  the dark theme because its scrim hides the collision.
   *
   *  The callout stage takes the *same* offset and the same height reduction, so the media and the
   *  coordinate space stay one box: `at` values keep pointing at the same pixels and no callout
   *  needs retuning. Cost is a slightly smaller render — 160px off a 900px viewport is ~18%. */
  headroom?: number;
  /** Slides the whole composition down without shrinking it — any CSS length, `%` resolving
   *  against the stage height (md+ only, default "0px"). This is OpticsSection's trick: its light
   *  theme anchors the stage at `top-[57%]` for "breathing room between the copy and the product
   *  photo". Where `headroom` buys clearance by making the render smaller, this buys it by pushing
   *  the render down and letting the bottom clip — so prefer this when the subject sits high in
   *  frame and there's dead space below it, and `headroom` when there isn't.
   *
   *  Applied to the media and the callout stage alike, so `at` values stay valid either way. */
  nudgeY?: string;
  /** Show the pulsing scroll-hint tick at the bottom of the stage (default true). Turn it off
   *  where the section isn't the first thing on the page, or where it competes with the artwork. */
  scrollHint?: boolean;
  /** How the backdrop fills the stage (default "cover").
   *
   *  `"cover"` — full-bleed: the media fills the viewport and is cropped on whichever axis
   *  overflows. Cinematic, and what GX4K's clip wants.
   *
   *  `"contain"` — the box is sized by width and carries the media's own aspect ratio, so nothing
   *  is cropped. Use this for a still with its own backdrop: cover would inset the box (via
   *  `headroom`/`nudgeY`) and expose a hard edge partway down the artwork, and because the crop
   *  shifts with viewport size no single `stageBg` colour can ever hide it. Trade-off: the media
   *  no longer guarantees to fill the stage — on narrow viewports a band of `stageBg` shows above
   *  and below, so set `stageBg` to the media's own edge colour. `headroom` is ignored; use
   *  `nudgeY`. `mobileObjectPosition`/`mobileScale` are no-ops, there being no crop to position. */
  fit?: "cover" | "contain";
  /** Ceiling on the backdrop's width — any CSS length (e.g. `"2160px"`). Unset = uncapped.
   *
   *  This is the ultrawide knob. The media box is width-driven (`contain` literally, `cover` via
   *  the `max()` below), so without a cap the artwork keeps growing with the viewport: past ~2560px
   *  it upscales beyond its own resolution and climbs into the pinned `head` copy and the callouts.
   *  Cap it at the media's native pixel width and it stops at 1:1, leaving that clearance intact.
   *
   *  Two things make this safe. It's a *maximum*, so anything narrower is unaffected — pages that
   *  don't set it behave exactly as before. And it caps **the media and the callout stage together**
   *  (one `--ssv-maxw` read by both, like `--ssv-head`/`--ssv-nudge`): capping only the media would
   *  leave the stage tracking full width and detach every leader line from the artwork.
   *
   *  Trade-off on `fit="cover"`: a capped box no longer full-bleeds, so `stageBg` shows at the left
   *  and right edges on wide viewports. Fine on artwork that already sits on the stage colour;
   *  otherwise it wants an edge gradient. `fit="contain"` already bands on narrow viewports, so
   *  this changes nothing there. */
  maxMediaWidth?: string;
  /** Keep the pinned, full-height treatment below `lg` (default true).
   *
   *  Set false for a still backdrop. The callout overlay is `lg+` only and a still has nothing to
   *  scrub, so on a phone the pin costs ~3 screens of scrolling past an unchanging image for no
   *  payoff. With it off, the track is `display:none` below lg and the stacked section instead
   *  renders the head and the full uncropped frame in normal flow, at its natural height.
   *
   *  Leave it true wherever the pin earns itself — a scrubbed `video`, or `beats`, both of which
   *  are the reason to hold the viewport in the first place. */
  pinOnMobile?: boolean;
  /** Source for the mobile playback under `pinOnMobile={false}`; defaults to `video`.
   *
   *  Worth setting, because `video` is a *scrub* encode — every frame a keyframe, which is what
   *  makes seeking exact and what makes the file large (GX4K's is 7 MB). Nothing seeks here, so
   *  that encode buys nothing and costs a phone the whole download. Point this at a small,
   *  normally-encoded copy: 1280 wide, CRF 26, `-g 48`. */
  mobileVideo?: string;
  /** Extra classes on the media in the `pinOnMobile={false}` stack, which is otherwise
   *  `block h-auto w-full` — the full frame at the full column width.
   *
   *  This is the knob for "too big on mobile": the pinned track is `hidden` below lg, so
   *  `mobileObjectPosition`/`mobileScale` (which live on `MEDIA_CLASS`) never apply here.
   *  Prefer sizing over transforms — `w-[85%] mx-auto` shrinks the laid-out box, whereas
   *  `scale-90` only paints it smaller and leaves the original height reserved. */
  mobileMediaClass?: string;
}) {
  // Memoised so `t` is referentially stable — `paint`/`syncCallouts` don't depend on it today, but
  // a fresh object each render would be a live trap for anything that later does.
  const t = useMemo(() => ({ ...THEMES[theme], ...themeOverrides }), [theme, themeOverrides]);
  // Scope the gradient's id to the theme: two instances with different themes on one page would
  // otherwise share one <linearGradient> and the second would inherit the first's stops.
  const lineGradId = `scrub-callout-line-${theme}`;
  // Gate reduced-motion behind mount so SSR and first client render match.
  const prefersReduced = useReducedMotion();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reduce = mounted && prefersReduced;

  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const dividerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const lineLen = useRef<number[]>([]);
  const targetTimeRef = useRef(0);
  const durationRef = useRef(0);

  // Stage aspect (from the viewBox) keeps the centered callout box proportional to the
  // line coordinate space, so blocks and connectors stay aligned at any width.
  const [, , vbW, vbH] = stageViewBox.split(/\s+/).map(Number);
  const stageAspect = vbW && vbH ? `${vbW} / ${vbH}` : "16 / 9";
  // The callout layer is the video's object-cover content box: for a container W×H and intrinsic
  // aspect A, cover renders it max(W, H·A) wide, centered. Expressed in CSS so it needs no JS and
  // can't fall out of sync with the video — see the stage div below. `H` here is the stage height
  // *after* `headroom` is taken off the top, matching MEDIA_CLASS's `md:h-[calc(100%-…)]`.
  // `contain` makes the stage the width-driven box the media itself occupies, so the two are the
  // same rectangle by construction rather than by a formula that has to replicate object-cover.
  //
  // `--ssv-maxw` (`maxMediaWidth`) caps the **box** term only, never the content term: under cover
  // the content rect is legitimately *wider* than its box on tall viewports (that's the horizontal
  // crop), and the stage has to be that wider rect. So the cap goes inside the `max()`, on the same
  // `boxWidth` the media's own `maxWidth` gets — and both expressions collapse to their old form at
  // the `100%` default.
  const contain = fit === "contain";
  const boxWidth = "min(100%, var(--ssv-maxw, 100%))";
  const stageWidth = contain
    ? boxWidth
    : vbW && vbH
      ? `max(${boxWidth}, calc((${STAGE_H} - var(--ssv-head, 0px)) * ${vbW} / ${vbH}))`
      : boxWidth;
  // Media class + the extra style the contain box needs (its height comes from the aspect ratio).
  // `maxWidth` has to live here rather than as a `max-w-[…]` class — see MEDIA_CLASS's note on the
  // unlayered `img, video, svg { max-width: 100% }` in globals.css, which outranks any utility.
  const mediaClass = contain ? MEDIA_CLASS_CONTAIN : MEDIA_CLASS;
  const mediaStyle: CSSProperties = contain
    ? { aspectRatio: stageAspect, maxWidth: boxWidth }
    : { ["--ssv-pos" as string]: mobileObjectPosition, ["--ssv-scale" as string]: mobileScale, maxWidth: boxWidth };

  // How much viewport height is scrolled *before* the section pins, in vh. `startVisible: 1`
  // gives 0 (progress starts at the pin, as before); 0.5 gives 50 — half a viewport of
  // lead-in during which the section is sliding up and the video is already scrubbing.
  const leadVh = (1 - clamp(startVisible, 0, 1)) * 100;
  // Framer offset: "start <x>%" fires progress 0 when the section's top reaches x% down the
  // viewport. 100% ("end") = section just peeking in; 0% ("start") = fully pinned.
  const startOffset: `start ${number}%` = `start ${100 - leadVh}%`;

  // Reverse-on-exit: the sticky stage is 100dvh, so the pin lasts `(trackVh − 100)` of
  // the track. Tracking the whole track (offset end→start) makes progress span the lead-in,
  // the pin *and* the exit; the fraction up to release becomes the reverse split, so the
  // video winds back as the section slides away. Falls back to the manual `reverseAt` otherwise.
  const trackVh = parseFloat(scrubLength);
  const exitReverseAt =
    reverseOnExit && Number.isFinite(trackVh) && trackVh > 100
      ? (leadVh + trackVh - 100) / (leadVh + trackVh)
      : undefined;

  // End hold: extra track height that keeps the section pinned after the scrub is done.
  //
  // Rather than thread a second timeline through the scrub/beat/connector maths, we grow the
  // track and *remap* raw scroll progress back onto the no-hold timeline — so `effReverseAt`
  // above and every authored beat/callout window keep meaning exactly what they meant before.
  //
  // In vh along the track: `fwdVh` is the travel over which the video scrubs forward (lead-in +
  // pin), then `holdVh` of plateau, then whatever remains (the 100vh exit, only tracked when
  // `reverseOnExit`). `V` is the total travel the raw progress spans; `V − holdVh` is the
  // no-hold travel the remap targets.
  const holdVh = Math.max(0, parseFloat(holdLength) || 0);
  const fwdVh = leadVh + trackVh - 100;
  const totalVh = leadVh + trackVh + holdVh - (reverseOnExit ? 0 : 100);
  const hold =
    holdVh > 0 && Number.isFinite(fwdVh) && fwdVh > 0 && totalVh > holdVh
      ? {
          start: fwdVh / totalVh, // raw progress where the scrub is finished
          end: (fwdVh + holdVh) / totalVh, // raw progress where it resumes / releases
          at: fwdVh / (totalVh - holdVh), // the no-hold progress being held
        }
      : null;

  // Raw scroll progress → no-hold-timeline progress: rate up to the plateau, freeze across it,
  // rate again after. Identity when there's no hold.
  const unhold = useCallback(
    (p: number) => {
      if (!hold) return p;
      if (p <= hold.start) return hold.start > 0 ? (p / hold.start) * hold.at : hold.at;
      if (p <= hold.end) return hold.at;
      return hold.at + ((p - hold.end) / (1 - hold.end)) * (1 - hold.at);
    },
    [hold?.start, hold?.end, hold?.at], // eslint-disable-line react-hooks/exhaustive-deps
  );
  // The split point: an explicit `reverseAt` always wins (so you can tune where the flip
  // happens); otherwise reverse-on-exit uses the geometry-derived release fraction.
  const effReverseAt = reverseAt ?? exitReverseAt;

  const { scrollYProgress } = useScroll({
    // Reduced motion is static, so it has no scroll target (see OpticsSection).
    target: reduce ? undefined : trackRef,
    // Reverse-on-exit needs progress to continue through the un-pin/exit, so track the
    // track's full travel (end at viewport start) rather than stopping at release.
    offset: reverseOnExit ? [startOffset, "end start"] : [startOffset, "end end"],
  });

  // Fade to black as the section releases. Its own timeline: 0 the moment the stage
  // unpins (section bottom at the viewport bottom), 1 when the section has fully left —
  // so the exit is always the last 100vh of travel regardless of `scrubLength`/`hold`.
  const { scrollYProgress: exitProgress } = useScroll({
    target: reduce ? undefined : trackRef,
    offset: ["end end", "end start"],
  });
  // Sit clear for the first slice of the release, then ramp to solid before the section
  // is gone, so the next section scrolls in from black rather than from a half-lit frame.
  const exitFade = useTransform(exitProgress, [0.1, 0.75], [0, 1]);

  // Overlay reveals — written straight to the DOM, instant and locked to the scrollbar.
  const paint = useCallback(
    (rawP: number) => {
      // With `reverseAt`, drive overlays off the same triangle as the video (0→1→0) so
      // they fade in on the way forward and back out on the rewind. Without it, this is
      // the identity (scrubTime(p,1) === p) and overlays behave one-way as before.
      const p = scrubTime(rawP, 1, effReverseAt);
      const fade = 0.06;
      beats.forEach((beat, i) => {
        const el = beatRefs.current[i];
        if (!el) return;
        let opacity = 0;
        if (p >= beat.start && p <= beat.end) {
          if (p - beat.start < fade) opacity = (p - beat.start) / fade;
          else if (beat.end - p < fade) opacity = (beat.end - p) / fade;
          else opacity = 1;
          opacity = clamp(opacity, 0, 1);
        }
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${20 * (1 - opacity)}px)`;
      });

      callouts.forEach((c, i) => {
        const t = clamp((p - c.start) / (c.end - c.start), 0, 1);
        const card = cardRefs.current[i];
        if (card) {
          // Slide in from the chosen edge (24px), easing to rest as it fades in.
          const off = (1 - t) * 24;
          const tx = c.from === "left" ? -off : c.from === "right" ? off : 0;
          const ty = c.from === "left" || c.from === "right" ? 0 : off;
          card.style.opacity = String(t);
          card.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        }
        const line = lineRefs.current[i];
        if (line) {
          line.style.strokeDashoffset = String((lineLen.current[i] || 0) * (1 - t));
          line.style.opacity = t > 0 ? "1" : "0";
        }
      });
    },
    [beats, callouts, effReverseAt],
  );

  // Scroll → target video time + overlay repaint (does not touch currentTime directly;
  // the rAF loop below lerps toward the target so seeks stay smooth).
  useMotionValueEvent(scrollYProgress, "change", (raw) => {
    // Everything downstream runs on the no-hold timeline; the plateau is folded in here once.
    const p = unhold(raw);
    targetTimeRef.current = scrubTime(p, durationRef.current || 0, effReverseAt);
    paint(p); // paint uses scroll progress — beats/callouts fire on scroll position, not video time
  });

  // Lay out every callout: place the block, build its leader path, prime the dash geometry.
  //
  // Everything is derived from `at` — the feature on the footage — outward, in **stage pixels**:
  //
  //     bend = at + (±diag·cos angle, ±diag·sin angle)   → the angled leg
  //     end  = bend + (±run, 0)                          → the horizontal leg
  //
  // `end` is the block's near edge; the path then carries on under the full block width *as*
  // that block's divider, so the underline and the leader are one unbroken gradient stroke (which
  // is why the divider itself renders unpainted on this overlay — see CalloutBlock). Because the
  // legs and the block are both fixed px, the whole assembly is identical at every resolution;
  // only `at` scales, keeping the tip on the feature.
  //
  // The block's width and its divider's y are measured rather than assumed — the text is fixed-px
  // but reflows with webfonts. Deliberately offsetWidth/offsetTop, not getBoundingClientRect:
  // `paint` puts an entrance transform on the inner card, and the offset properties ignore
  // transforms, so these read the resting box whenever they're taken.
  const syncCallouts = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sw = stage.clientWidth;
    const sh = stage.clientHeight;
    if (!sw || !sh) return;
    // px per viewBox unit. Kept per-axis (they're equal — the stage's aspectRatio comes from the
    // viewBox — but deriving both means a true 45° on screen even if that ever drifts).
    const kx = sw / vbW;
    const ky = sh / vbH;

    callouts.forEach((c, i) => {
      const line = lineRefs.current[i];
      const wrap = wrapRefs.current[i];
      const divider = dividerRefs.current[i];
      if (!line || !wrap || !divider) return;

      const sx = c.direction.endsWith("right") ? 1 : -1;
      const sy = c.direction.startsWith("top") ? -1 : 1;
      const angle = c.leader?.angle ?? LEADER.angle;
      const diag = c.leader?.diag ?? LEADER.diag;
      const run = c.leader?.run ?? LEADER.run;
      // Resolve the angled leg into its x/y extents. Both are taken in px (not viewBox units) so
      // the on-screen angle is exactly `angle` — the stage's x and y scales are equal today, but
      // deriving both keeps that true regardless.
      const rad = (angle * Math.PI) / 180;
      const dx = diag * Math.cos(rad);
      const dy = diag * Math.sin(rad);

      const ax = c.at[0] * kx;
      const ay = c.at[1] * ky;
      const bx = ax + sx * dx;
      const by = ay + sy * dy;
      const ex = bx + sx * run;

      // The divider's width and how far it sits below the block's top edge. It's the line the
      // leader aims at, so the leader always meets the block on the rule between the sub-label and
      // the spec list. The block has no fixed width, so `w` is whatever the text resolves to.
      const w = divider.offsetWidth;
      const dt = divider.offsetTop;
      // Place the block so the divider lands exactly on the leader's end, on the side the leader is
      // heading. The wrapper stays transform-free so the measurements above stay valid.
      wrap.style.left = `${sx > 0 ? ex : ex - w}px`;
      wrap.style.top = `${by - dt}px`;

      // Drawn block → product, so the dash reveal in `paint` runs outward from the text. The start
      // is the block's *far* edge: the first stretch is the underline, which runs flush into the
      // horizontal leg (both sit at y = by, so they're one straight line on screen).
      const startX = ex + sx * w;
      const P = (x: number, y: number) => `${x / kx},${y / ky}`; // px → viewBox units

      // Round the bend by trimming `r` off each leg and bridging them with a quadratic whose
      // control point is the corner itself — that's tangent to both legs, so the join is smooth at
      // any `angle`. Clamped to what each leg can spare (the horizontal side is underline + run).
      const r = Math.min(c.leader?.radius ?? LEADER.radius, w + run, diag);
      let d: string;
      if (r > 0) {
        // Unit vector along the outgoing leg, bend → tip.
        const ux = -sx * Math.cos(rad);
        const uy = -sy * Math.sin(rad);
        d =
          `M ${P(startX, by)}` +
          ` L ${P(bx + sx * r, by)}` + //        stop short of the corner…
          ` Q ${P(bx, by)} ${P(bx + ux * r, by + uy * r)}` + // …curve through it…
          ` L ${P(ax, ay)}`; //                  …and on to the feature
      } else {
        d = `M ${P(startX, by)} L ${P(bx, by)} L ${P(ax, ay)}`;
      }
      line.setAttribute("d", d);

      // `vector-effect: non-scaling-stroke` makes the browser resolve the *whole* stroke — dash
      // pattern included — in screen space, but getTotalLength() reports viewBox user units. Scale
      // the dash to px or the pattern no longer covers the path: under-long once the stage scales
      // past 1:1 (big screens), which renders the connector as a floating fragment.
      const dash = line.getTotalLength() * kx;
      lineLen.current[i] = dash;
      line.style.strokeDasharray = String(dash);
      line.style.strokeDashoffset = String(dash);
      line.style.opacity = "0";
    });
    paint(unhold(scrollYProgress.get()));
  }, [callouts, paint, scrollYProgress, unhold, vbW, vbH]);

  useEffect(() => {
    if (reduce) return;
    syncCallouts();
    // Webfonts change the block's height, which moves the divider — re-measure once they land.
    document.fonts?.ready.then(syncCallouts).catch(() => {});
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(syncCallouts);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [reduce, syncCallouts]);

  // Scrub loop: lerp video.currentTime toward the scroll target.
  useEffect(() => {
    if (reduce) return;
    const v = videoRef.current;
    if (!v) return;

    v.pause(); // we own currentTime; never let it autoplay
    const onMeta = () => {
      durationRef.current = v.duration || 0;
      targetTimeRef.current = scrubTime(unhold(scrollYProgress.get()), durationRef.current, effReverseAt);
      // The callout stage is the video's cover box, so a viewBox that doesn't match the real frame
      // silently skews every anchor and connector. Cheap guard — this exact mismatch shipped once.
      if (process.env.NODE_ENV !== "production" && v.videoWidth && (v.videoWidth !== vbW || v.videoHeight !== vbH)) {
        console.warn(
          `[ScrollScrubVideo] stageViewBox is ${vbW}×${vbH} but ${video} is ${v.videoWidth}×${v.videoHeight}. ` +
            `Callout anchors and connector lines will be skewed — pass stageViewBox="0 0 ${v.videoWidth} ${v.videoHeight}".`,
        );
      }
    };
    v.addEventListener("loadedmetadata", onMeta);
    if (v.readyState >= 1) onMeta();

    let cur = targetTimeRef.current;
    let raf = 0;
    const tick = () => {
      const target = targetTimeRef.current;
      cur += (target - cur) * LERP;
      if (Math.abs(target - cur) < 0.001) cur = target;
      // Skip while a seek is still resolving so we don't queue seeks faster than the
      // decoder drains; muted + playsInline lets us seek without a user gesture on iOS.
      if (durationRef.current > 0 && !v.seeking && Math.abs(v.currentTime - cur) > 0.01) {
        try {
          v.currentTime = cur;
        } catch {
          /* seek can throw before the media is seekable — ignore, next frame retries */
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, [reduce, scrollYProgress, unhold, effReverseAt, video, vbW, vbH]);

  const beatText = (beat: ScrubBeat, centered = false) => (
    <>
      {beat.kicker && (
        <p
          className="mb-3 bg-clip-text text-[11.5px] font-bold uppercase tracking-[0.28em] text-transparent"
          style={{ backgroundImage: t.kickerGrad, WebkitBackgroundClip: "text", filter: t.headShadow }}
        >
          {beat.kicker}
        </p>
      )}
      <h2
        className="bg-clip-text font-bold text-transparent"
        style={{
          fontSize: "clamp(2.2rem, 6vw, 4.8rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          backgroundImage: t.beatGrad,
          WebkitBackgroundClip: "text",
          filter: t.headShadow,
        }}
      >
        {beat.headline}
      </h2>
      {beat.sub && (
        <p className={`${centered ? "mx-auto " : ""}mt-5 max-w-xl text-lg leading-relaxed ${t.beatSub}`} style={{ textShadow: t.textShadow }}>
          {beat.sub}
        </p>
      )}
    </>
  );

  // Reduced motion: static poster, first beat (if any) + stacked callouts, no pin/scrub.
  if (reduce) {
    return (
      <section
        data-nav-theme={t.nav}
        className={`relative w-full overflow-hidden ${sectionClass}`}
        style={{ background: t.reducedBg }}
      >
        {(image ?? poster) && <img src={image ?? poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
        <div className="relative mx-auto flex min-h-[100dvh] max-w-[1280px] flex-col justify-center gap-12 px-6 py-20">
          {head && <ScrubHead head={head} t={t} />}
          {beats[0] && <div className="text-center">{beatText(beats[0], true)}</div>}
          {callouts.length > 0 && (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {callouts.map((c) => (
                <CalloutBlock key={c.key} data={c} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        ref={trackRef}
        data-nav-theme={t.nav}
        // With `pinOnMobile={false}` the whole track is dropped below lg — height and all — and the
        // static block in the mobile section below stands in for it.
        className={`relative w-full ${pinOnMobile ? "" : "hidden lg:block"} ${sectionClass}`}
        // The hold is just extra track: the pin lasts as long as the section is taller than the
        // sticky stage, and `unhold` above keeps the scrub itself confined to `scrubLength`.
        style={{ height: hold ? `calc(${scrubLength} + ${holdLength})` : scrubLength }}
      >
        <div
          className={`${t.stageBg} sticky top-0  h-[80dvh] md:h-[100dvh] w-full overflow-hidden flex  items-center `}
          // Declared once here so the media and the callout stage below read the same values —
          // they must move together or every leader detaches from the artwork.
          style={{
            ["--ssv-head" as string]: contain ? "0px" : `${headroom}px`,
            ["--ssv-nudge" as string]: nudgeY,
            ["--ssv-maxw" as string]: maxMediaWidth ?? "100%",
          }}
        >
          {/* Both branches carry identical framing classes so the callout stage — which is sized to
              the same object-cover box — lines up whichever backdrop is in use. */}
          {image ? (
            <img
              src={image}
              alt=""
              className={mediaClass}
              style={mediaStyle}
              onLoad={(e) => {
                // Same trap as the video path: the stage is the media's cover box, so a viewBox
                // that doesn't match the real frame skews every anchor and connector.
                const el = e.currentTarget;
                if (process.env.NODE_ENV !== "production" && el.naturalWidth && (el.naturalWidth !== vbW || el.naturalHeight !== vbH)) {
                  console.warn(
                    `[ScrollScrubVideo] stageViewBox is ${vbW}×${vbH} but ${image} is ${el.naturalWidth}×${el.naturalHeight}. ` +
                      `Callout anchors and leader lines will be skewed — pass stageViewBox="0 0 ${el.naturalWidth} ${el.naturalHeight}".`,
                  );
                }
              }}
            />
          ) : (
            <video
              ref={videoRef}
              src={video}
              poster={poster}
              muted
              playsInline
              preload="auto"
              // Stays object-cover; below md, `mobileObjectPosition` picks which slice of
              // the (cropped) frame shows and `mobileScale` zooms it. md+ resets to normal.
              className={mediaClass}
              style={mediaStyle}
            />
          )}

          {overlayScrim && t.scrim && (
            /* Legibility scrim (matches ScrollHero). The light theme has none — it would only
               grey down artwork that already reads against dark type. */
            <div className="pointer-events-none absolute inset-0" style={{ background: t.scrim }} />
          )}

          {/* Bottom fade into the page background, so the pinned stage never cuts off with a hard
              edge against the next section. Dark gives mobile the softer multi-stop ramp and md+ a
              straight fade to pure black; light fades to white. Skipped entirely when a theme (or
              a `themeOverrides`) empties it, rather than painting a transparent box. */}
          {t.bottomFade && <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-56 ${t.bottomFade}`} />}

          {/* Section title + description — pinned near the top, always visible (OpticsSection style). */}
          {head && (
            <div className="pointer-events-none absolute inset-x-0 top-[13%] px-6">
              <ScrubHead head={head} t={t} />
            </div>
          )}

          {/* Callout blocks + leader lines. The stage is sized to the video's *object-cover content
              box* — same centre, same aspect, same scale — so viewBox coordinates map 1:1 onto the
              footage and every `at` tracks the product at any viewport size. The blocks and leaders
              themselves are placed in px by `syncCallouts`. lg+ only; mobile stacks below. */}
          {callouts.length > 0 && (
            <div
              ref={stageRef}
              // Mirrors the media's offsets: its box starts `--ssv-head` lower so its centre sits
              // half that further down, and `--ssv-nudge` moves both by the same amount again.
              className="pointer-events-none absolute left-1/2 top-[calc(50%+var(--ssv-head,0px)/2+var(--ssv-nudge,0px))] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
              style={{ width: stageWidth, aspectRatio: stageAspect }}
            >
              <svg viewBox={stageViewBox} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <linearGradient id={lineGradId} x1="0" y1="0" x2="1" y2="1">
                    {t.lineStops.map((s) => (
                      <stop key={s.offset} offset={s.offset} stopColor={s.color} />
                    ))}
                  </linearGradient>
                </defs>
                {/* `d` is written by `syncCallouts` once the block has been measured; until then
                    the line has no geometry, and it is held at opacity 0 regardless. A path rather
                    than a polyline so the bend can carry a real corner radius. */}
                {callouts.map((c, i) => (
                  <path
                    key={c.key}
                    ref={(el) => {
                      lineRefs.current[i] = el;
                    }}
                    fill="none"
                    stroke={`url(#${lineGradId})`}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ opacity: 0 }}
                  />
                ))}
              </svg>

              {callouts.map((c, i) => (
                // Two elements on purpose: the wrapper takes the px position written by
                // `syncCallouts` and stays transform-free so it can read exact box-offsets, while
                // the inner card takes the entrance opacity/translate written by `paint`.
                <div
                  key={c.key}
                  ref={(el) => {
                    wrapRefs.current[i] = el;
                  }}
                  className="absolute"
                >
                  <div
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className="pointer-events-auto will-change-transform"
                    style={{ opacity: 0 }}
                  >
                    <CalloutBlock
                      data={c}
                      t={t}
                      measureDivider={(el) => {
                        dividerRefs.current[i] = el;
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {beats.map((beat, i) => (
            <div
              key={i}
              ref={(el) => {
                beatRefs.current[i] = el;
              }}
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              style={{ opacity: 0, transform: "translateY(20px)" }}
            >
              {/* Text itself is selectable; the full-inset wrapper stays click-through. */}
              <div className="pointer-events-auto">{beatText(beat)}</div>
            </div>
          ))}

          {/* Scroll hint. Skipped entirely when off, so its infinite animation isn't left
              running invisibly behind the exit fade. */}
          {scrollHint && t.scrollHintGrad && (
            <motion.div
              className="pointer-events-none absolute bottom-10 left-1/2 h-10 w-px -translate-x-1/2 origin-top"
              style={{ background: t.scrollHintGrad }}
              animate={{ scaleY: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
            />
          )}

          {/* Fade to black on exit — last layer, so it takes the video, callouts and
              beats down together as the section releases. */}
          {t.exitFade && (
            <motion.div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 z-20 ${t.exitFade}`}
              style={{ opacity: exitFade }}
            />
          )}
        </div>
      </section>

      {/* Mobile / tablet (< lg): callouts stacked in normal flow instead of positioned. */}
      {callouts.length > 0 && (
        <section data-nav-theme={t.nav} className={`${t.sectionBg} pt-16 lg:hidden`}>
          {/* With the pin active the head is already shown over the media at every breakpoint, so
              repeating it here would duplicate the heading. When the pin is off below lg the track
              is display:none, so this section carries the head and the media itself. */}
          {!pinOnMobile && (
            <div className="mx-auto mb-12 max-w-[1280px] px-">
              {head && <ScrubHead head={head} t={t} className="mb-10 px-6" />}
              {/* Full width, natural height — the whole frame, uncropped. A still is an <img>; a
                  clip falls back to its own first frame rather than `poster`, so a missing or
                  mistyped poster path can't blank the section (it silently did for GX4K). */}
              {image ? (
                <img src={image} alt="" className={`block h-auto w-full ${mobileMediaClass}`} />
              ) : video ? (
                /* Plays normally here — nothing is scrubbing it, so it just loops. `muted` +
                   `playsInline` are what iOS requires to autoplay at all. */
                <video
                  src={mobileVideo ?? video}
                  poster={poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={`block h-auto w-full ${mobileMediaClass}`}
                />
              ) : poster ? (
                <img src={poster} alt="" className={`block h-auto w-full ${mobileMediaClass}`} />
              ) : null}
            </div>
          )}
          {/* White only on the light theme: it lifts the callouts off a tinted `sectionBg`
              (GX35 overrides that to #F7F7F7). On dark it would be a glaring slab. */}
          <div className={`mx-auto relative ${theme === "light" ? "bg-white" : ""} py-6 grid max-w-[1280px] grid-cols-1 gap-10 px-6 sm:grid-cols-3`}>
            {callouts.map((c, i) => (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, x: c.from === "left" ? -24 : c.from === "right" ? 24 : 0, y: c.from === "left" || c.from === "right" ? 0 : 24 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <CalloutBlock data={c} t={t} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

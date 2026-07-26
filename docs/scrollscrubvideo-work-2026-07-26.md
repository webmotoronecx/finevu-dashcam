# ScrollScrubVideo — in-progress work (2026-07-26)

Handoff notes for work that is **not finished**. Branch `fixes/responsive`, nothing committed yet.

Two threads run through this:

1. **Callout leaders** on `/gx4k` — make them resolution-independent (they used to stretch and
   drift on large displays).
2. **Reusing `ScrollScrubVideo` on `/gx35`** in place of `OpticsSection`, with a still image
   instead of a clip — which pulled in theming, fit and mobile behaviour.

---

## Where things stand

| | state |
|---|---|
| `/gx4k` desktop leaders | **done** — point-first geometry, tuned by eye |
| `/gx4k` mobile | **done** — pin dropped, 0.63 MB clip autoplays |
| `/gx4k` MediaSection ×2 | **done** — pin + scrub released below lg, mobile cuts wired |
| `/gx35` optics section | **working** — callout `at` values still WRONG, see §3 |
| `/gx35` MediaSection ×2 | **done** — same treatment |
| `/gx35` hero (`ScrollHero`) | **done** — desktop re-encode + mobile cut |
| `/gx4k` hero (`ScrollHero`) | **done** — desktop re-encode + mobile cut |
| `/` homepage heroes ×2 | **done** — local `Hero` gained `mobileVideo`; GX35 reuses gx35's cuts |

`npm run build`, `npx tsc --noEmit` clean. Lint sits at 33 problems vs a 29 baseline; the extra
four are all `@next/next/no-img-element` on `<img>` tags, which this repo uses deliberately
(see CLAUDE.md — remote Unsplash, no `images.remotePatterns`).

---

## 1. Callout leaders — the model

**The bug.** Callouts used to be authored *block-first*: `at` was where the text block sat, plus a
hand-authored polyline out to the product. Both in `stageViewBox` units, which scale with the
video — but the block's text is fixed px. So on a large display the viewBox gap became a large
*pixel* gap while the text stayed the same size: the block drifted away from the product on an
ever-longer leader.

**The fix — authored point-first.** `at` is now the *feature on the footage*; the leader and block
are built outward from it in **fixed CSS pixels**. Only `at` scales, which keeps the tip on the
feature while the assembly stays a constant on-screen size.

```ts
at: [number, number];                    // the feature, in stageViewBox units
direction: "top-left" | "top-right" | "bottom-left" | "bottom-right";
leader?: { angle?: number; diag?: number; run?: number; radius?: number };
```

Geometry, in stage px (`syncCallouts`):

```
bend = at + (±diag·cos angle, ±diag·sin angle)   // the angled leg
end  = bend + (±run, 0)                          // the horizontal leg
```

`end` is the block's near edge; the path then continues **under the full block width as the
block's divider** — one unbroken gradient stroke. That is why the divider renders *unpainted* on
the pinned overlay (`anchored` in `CalloutBlock`) but painted in the mobile stack.

### Two traps

- **The divider must stay in layout.** `syncCallouts` reads its `offsetWidth`/`offsetTop` to place
  the block and align the leader. Hiding it with `display:none` (`hidden`, `md:hidden`) zeroes both
  and collapses every block onto the stage origin. Unpainted-but-laid-out is deliberate.
- **`stageViewBox` must match the media's real pixel size.** The stage is the media's box, so a
  mismatch skews every anchor. Dev-mode warns for both video and image.

### Known limitation — small viewports

With the current authored values and a content-width block, the overlay **only genuinely fits from
~1520px up**. `front` is the binding constraint every time (its leader reaches ~320px off an
anchor already left of centre).

| block width | fits from |
|---|---|
| content width (~300px) | 1520px |
| 240px | 1360px |
| 190px | 1264px |

An auto-fit pass that shrank the legs to fit was **built and then reverted** — it worked
(everything fitted at 1024×640) but was not liked. If revisited, the options were:

- `2xl:block` (1536+) and change nothing else
- `xl:block` (1280+) plus a narrower block
- `xl:block` plus shortening `front`'s leader alone

Not resolved. Below `lg` the overlay is hidden and callouts stack, so this only affects 1024–1520.

---

## 2. Component API added this session

All default to the previous behaviour, so adding them changed nothing on its own.

**`ScrollScrubVideo`**

| prop | purpose |
|---|---|
| `image` | still backdrop instead of `video`; skips seeking and the rAF loop |
| `theme` | `"dark"` (default) / `"light"` — mirrors `OpticsSection`'s `THEMES` |
| `themeOverrides` | `Partial<ScrubTheme>` shallow-merged over the preset |
| `headroom` | px reserved at the top; media **shrinks** |
| `nudgeY` | slides everything down **at full size**; overflow clips |
| `scrollHint` | show/hide the pulsing tick |
| `fit` | `"cover"` (default) / `"contain"` |
| `pinOnMobile` | keep the pinned full-height treatment below `lg` |
| `mobileVideo` | lighter source for the mobile autoplay |

**`MediaSection`** — `pinOnMobile`, `mobileVideo`. Same meaning, different mechanism: its pin is a
JS-built track plus a rAF loop, so it needs `useIsDesktop()` rather than a CSS class. See §4.

**`ScrollHero`** — `mobileVideo` only, via `<source media>`. No `pinOnMobile`: it never scrubbed,
and its pin is what reveals the beats.

Notes worth keeping:

- `headroom` and `nudgeY` are applied to the media **and** the callout stage via two CSS custom
  properties (`--ssv-head`, `--ssv-nudge`) declared once on the sticky container. They must move as
  one box or every leader detaches. `at` stays valid either way.
- `fit="contain"` ignores `headroom` (no box height to give up) and makes
  `mobileObjectPosition`/`mobileScale` no-ops (no crop to position).
- `themeOverrides` disables the atmosphere layers with **falsy** values: `scrim: null`,
  `bottomFade: ""`, `exitFade: ""`. `"false"` is a *truthy string* — it renders the element and
  applies `false` as a className.
- `reducedBg` takes a raw CSS value; `stageBg`/`sectionBg` take Tailwind classes, and those must be
  literals the scanner can see (`bg-[#F4F4F6]` works, a template string does not).

---

## 3. `/gx35` — what was done and what is not

`OpticsSection` is **commented out, not deleted** (`app/gx35/page.tsx`), with `ScrollScrubVideo`
above it. The `OpticsSection` import is now unused — that's the lint warning on line 6, left in
place so uncommenting is one step.

```tsx
theme="light"  image="/gx35/optics.webp"  fit="contain"  pinOnMobile={false}
stageViewBox="0 0 2160 1365"  nudgeY="7%"
themeOverrides={{ bottomFade: "", exitFade: "", stageBg: "bg-[#F4F4F6]", … }}
```

### Why each

- **`fit="contain"`** — the render carries its own backdrop. Under `cover`, `headroom`/`nudgeY`
  inset the box and left a hard edge partway down the artwork. Because the crop shifts with
  viewport size, **no single `stageBg` colour can hide it** — the visible top row is ~238 at one
  size and row 0 at another. `contain` sizes by width at the media's aspect, so nothing is cropped
  and there is no edge. This is `OpticsSection`'s own model.
- **`stageBg: "bg-[#F4F4F6]"`** — sampled from the image's actual top row, which is uniform across
  the full width. Where the stage shows past the artwork the join is invisible. (`#F7F7F7`, the
  page's `BACKING`, is 3/255 off and reads as a hard line.)
- **`stageViewBox="0 0 2160 1365"`** — `optics.webp` was regenerated on 2026-07-26 from a new
  `optics.png`, and that is **a different crop, not a resize**: 2160×1365 (aspect **1.582**) where
  the old file was 1920×1319 (**1.456**). Anchors authored against the old image do not carry over.
  Top-edge colour re-sampled and still `#F4F4F6`, so `stageBg` is unchanged.
- **`nudgeY="7%"`** — matches `OpticsSection`'s light-theme `top-[57%]` trick.

### Still to do

- **Callout `at` / `angle` values are WRONG and must be re-authored.** They were ported from
  `OpticsSection`'s `lines` (the `x1,y1` end is the product, confirmed against `overlayPos`) and
  rescaled into the *old* 1920×1319 image. The 2026-07-26 `optics.webp` is a different crop
  (2160×1365, aspect 1.582 vs 1.456), so a linear rescale does **not** fix them — the product sits
  in a different place in frame. Re-pick each `at` against the new image.
- `optics.webp` is only 33.7 KB at 2160×1365; may look soft on a large display.
- Decide whether the commented `OpticsSection` block and its import get deleted.
- **Asset state (2026-07-26):** `public/gx35/` holds `optics.webp` only — the 2.3 MB source PNG
  was moved to `assets/images/gx35-optics.png` (it is the *only* copy of that crop; the
  `assets/images/gx4k-optics*.png` files are different, smaller images). Hero has three variants:
  `hero.mp4` (21.54 MB, kept, **now unreferenced**), `hero_desktop.mp4` (3.99 MB, `video`),
  `hero_mobile.mp4` (1.26 MB, `mobileVideo`).

---

## 4. Mobile video

**Decision: below `lg`, a scrub section does not pin and does not scrub — the clip autoplays in
normal flow, off a lighter encode.** The scrub builds are all-keyframe (`-g 1`) purely so
`currentTime` seeks land exactly; nothing seeks on mobile, so that encode buys nothing and costs a
phone the whole download.

**`ScrollHero` is the exception and never scrubbed** — its clip has always been
`autoPlay loop muted playsInline`, and scroll only crossfades the beats. So there is nothing to
release there: **its pin stays**, because the pin *is* how the headlines reveal. It only needed a
lighter file.

### Which component does what

| component | mobile treatment | mechanism |
|---|---|---|
| `ScrollScrubVideo` | drop pin + scrub, autoplay in flow | track is `hidden lg:block`; a static block in the mobile section renders head + media |
| `MediaSection` | drop pin + scrub, autoplay in place | `useIsDesktop()` (matchMedia) — the pin is a JS-built track + rAF loop, so CSS can't switch it off |
| `ScrollHero` | **keep pin**, lighter source only | `<source media="(max-width: 1023px)">` — chosen at load time, no JS, no hydration flash |

`MediaSection` derives **both** flags from one gate, deliberately:

```ts
const mobileRelease = !pinOnMobile && !isDesktop;
const pinned    = pin        && !mobileRelease;
const scrubbing = videoScrub && !mobileRelease;
```

A pin without a scrub holds the viewport on a frozen frame; a scrub without a pin races past. They
must move together. `useIsDesktop` answers `true` on SSR so desktop is correct on first paint and
phones correct on hydration — the reverse would flash an unpinned section on every desktop load.

### Sizing — why 1280

The mobile block renders up to `min(viewport, 1280)` wide and the release applies below `lg`, so
**"mobile" includes tablets**: ~327 → ~1023 CSS px.

| device | css width | DPR | device px needed |
|---|---|---|---|
| iPhone SE | 327 | 2 | 654 |
| iPhone 15 | 345 | 3 | 1035 |
| iPhone 15 Pro Max | 382 | 3 | 1146 |
| iPad Air portrait | 772 | 2 | 1544 |

1280 covers every phone at DPR 3 and is acceptably soft on a retina tablet; 960 is visibly soft on
any modern phone. Keep the **native aspect** — the mobile block is `h-auto` in flow, nothing is
cover-cropped, so the ratio is an art decision now, not a technical one.

### Recipes

```bash
# mobile cut (any scrub or hero source)
ffmpeg -i <source> -an -vf "scale=1280:-2:flags=lanczos" \
  -c:v libx264 -profile:v high -preset slow -crf 26 \
  -g 48 -keyint_min 48 -pix_fmt yuv420p -movflags +faststart \
  public/<page>/<name>_mobile.mp4

# desktop re-encode, same resolution — for masters shipped at absurd bitrates
ffmpeg -i <source> -an -c:v libx264 -profile:v high -preset slow -crf 23 \
  -g 48 -keyint_min 48 -pix_fmt yuv420p -movflags +faststart \
  public/<page>/<name>_desktop.mp4
```

`-g 48` is a 2s keyframe interval — the *opposite* of a scrub build. Suffix `_mobile` / `_desktop`.

### Encoded so far (all measured, not estimated)

| source | original | mobile | desktop | status |
|---|---|---|---|---|
| `gx4k/gx4k_secondary_banner_scrub` | 7.02 MB | **0.63 MB** | — | ✅ wired |
| `gx4k/dual-sensors_scrub` | 5.51 MB | **0.35 MB** | — | ✅ wired (gx4k + gx35) |
| `gx4k/discreet_scrub` | 6.69 MB | **0.62 MB** | — | ✅ wired (gx4k + gx35) |
| `gx35/hero` | 21.54 MB | **1.26 MB** | **3.99 MB** | ✅ wired |
| `home/GX4K_Hero_Video_V2` | 20.97 MB | **1.44 MB** | **4.44 MB** | ✅ wired on `/gx4k` + `/` |

Neither hero was ever a scrub build — `gx35/hero.mp4` is 8 I-frames of 339 (~12.7 Mbps) and
`GX4K_Hero_Video_V2.mp4` is 7 of 306 (~13.4 Mbps). Both were simply shipped at broadcast bitrates
for muted background loops; the CRF 23 re-encodes are the same 1920×1080 for ~79–81% fewer bytes.

### Page totals

| page | desktop before | desktop after | mobile after |
|---|---|---|---|
| `/gx35` | 35.99 MB | **7.21 MB** | **2.26 MB** |
| `/gx4k` | 40.19 MB | **23.66 MB** | **3.04 MB** |
| `/` (heroes only) | 42.51 MB | **8.43 MB** | **2.70 MB** |

`/gx4k`'s desktop figure is still dominated by `gx4k_secondary_banner_scrub.mp4` (7.02 MB), which
is a genuine all-keyframe build and cannot be shrunk without hurting the scrub.

### Duplicate found

`public/home/GX35_Hero_Video_v2.mp4` is **byte-identical** to `public/gx35/hero.mp4` (same md5).
The homepage now points at `/gx35/hero_desktop.mp4` + `/gx35/hero_mobile.mp4` rather than encoding
a second copy of the same footage. Worth grepping for other duplicate pairs before encoding
anything else — `cmp -s a b` or `md5 -q`.

### Next task

**Nothing outstanding in this thread.** Every pinned/scrubbed section and every hero across `/`,
`/gx4k` and `/gx35` now has its mobile path. Remaining known work is elsewhere:

- The gx35 optics callout `at` values (§3) — still wrong, needs eyeballing against the new crop.
- The 1024–1520 callout clipping (§1) — unresolved by choice.
- `public/` still holds ~29 MB of superseded masters (§5) — the user is handling that.
- Other pages (`/installation`, carousels, `FeatureTabs`) have not been audited for video weight;
  `/gx35`'s carousel alone references several 30 MB+ clips.

---

## 5. Loose ends

- **Cleanup deferred by the user ("I'll clean it later"):**
  - `public/gx35/hero.mp4` (21.54 MB) — **tracked in git**, now unreferenced. Prune once the
    `hero_desktop.mp4` re-encode is signed off; until then the repo carries it for nothing.
  - `public/gx4k/gx4k_secondary_banner.mp4` (8.48 MB) — untracked 3472-wide original, unreferenced.
  - `assets/images/gx35-optics.png` (2.3 MB) — the only lossless copy of the optics crop; needed to
    regenerate `optics.webp` at any other quality. Keep unless the designer can re-supply.
  - Kept and in use: `*_mobile.mp4` ×4, `hero_desktop.mp4`.
  - ~~`gx4k_secondary_banner_scrub_2.mp4`~~ — deleted 2026-07-26.
- **Fixed en route:** `app/gx4k/page.tsx` asked for `/gx4k/hero-render.png`; the file is
  `hero_render.png` (underscore). Dead since it was written, invisible because the video covered
  the poster. Swept every `/gx4k/`, `/gx35/`, `/installation/`, `/home/` path — this was the only
  broken one.
- **`px-` in `ScrollScrubVideo`'s mobile media container is not a valid Tailwind class** — it
  compiles to nothing. Currently harmless (full-bleed is the apparent intent) but should be a real
  value or removed.
- The **SVG leader gradient runs diagonally** (`x1,y1→x2,y2 = 0,0→1,1`) while the CSS
  `calloutDivider` is `90deg` horizontal. Same colours, different axis. Not reconciled — changing
  it would affect the dark theme too.
- Higher-quality gx4k desktop scrub was explored (`docs` above; VMAF 93.8 for the current build)
  but **not adopted** — the 1280-wide `_scrub.mp4` is still what ships.

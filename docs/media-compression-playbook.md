# Media Compression Playbook

Repeatable steps for shrinking the `/public` payload — **images** (PNG → WebP) and, since
2026-07-27, **video**. Applied to **GX4K** and **GX35** — see results at the bottom.

The real problem is **payload, not markup**. `srcset` does nothing until smaller variants
exist, so the fastest high-impact win is a straight compression pass: convert big PNGs to
WebP and repoint the code refs.

> **Scope note (changed 2026-07-27):** this playbook was images-only through the 2026-07-25
> passes. Video is now covered — see [Video](#video-2026-07-27) below. The image steps 1–4
> are unchanged; the `/png-webp` slash command automates them for a single file, and
> `/opt-vid` does the same for a single video (encode + poster).

**Tooling:** `cwebp` (already installed via Homebrew). **No `sharp`, no npm dependency, no
`next/image`.** The site renders all images through `components/figma/ImageWithFallback.tsx`
(a plain `<img>`), so a WebP path just works.

---

## Step 1 — Find the heavy assets

```bash
ls -lS public/<page>/ | awk '{print $5, $9}' | head -40   # biggest files first
grep -nE "/[a-zA-Z0-9_./-]+\.(png|jpg|jpeg)" app/<page>/page.tsx   # raster refs + line numbers
```

> `cwebp` accepts **PNG and JPG** input, so this playbook covers both — the homepage had no
> PNGs but its JPGs still converted to WebP at ~70 % smaller. Refs may point outside the
> page's own dir (e.g. the homepage uses `/products/*.jpg`); grep by full path.

You can list assets that **already have a `.webp` twin**:

```bash
for f in public/<page>/*.png; do b="${f%.png}"; [ -f "$b.webp" ] && echo "TWIN: $f"; done
```

> ⚠️ **A `.webp` twin is NOT necessarily a compression of the `.png` — verify content
> before repointing.** On the gx4k page several twins (`box`, `compare-gx4k`,
> `compare-gx35`) turned out to be **entirely different product photos** created for
> another version — `box.webp` even showed a 64GB card + two cables vs the PNG's 128GB +
> one cable, a spec-accuracy risk. **Do not blind-repoint to a twin.** Either open both
> images and confirm they're the same shot, or skip the twin entirely and **encode your
> own WebP from the known-correct PNG** (Step 2). When in doubt, generate from the PNG.
>
> **Resolution used:** re-encode from the correct PNG and **overwrite** the stale twin
> (`cwebp -q 82 name.png -o name.webp`) — after first confirming the twin isn't referenced
> elsewhere (`grep -rn name.webp app/ components/ lib/ config/`). This gives correct content
> *and* the compression win at the original filename.

---

## Step 2 — PNG → WebP

```bash
cwebp -q 80 -mt public/<page>/<name>.png -o public/<page>/<name>.webp
```

- `-q 80` is a good default for photographic / gradient UI art (typically **80–95 %
  smaller**). Drop to `-q 75` for very large hero art if 80 is still heavy; raise toward
  `-q 90` only if you see banding on a gradient.
- **ALWAYS encode from the `.png`, and overwrite any existing `.webp` of the same name.**
  `cwebp -o` overwrites by default — do not trust a pre-existing twin (it may be a
  *different image*, see ⚠️ in Step 1). Re-generating from the correct PNG guarantees the
  `.webp` matches. First confirm the twin isn't used by another page:
  ```bash
  grep -rn "<name>.webp" app/ components/ lib/ config/   # if used elsewhere, check that page too
  cwebp -q 82 -mt public/<page>/<name>.png -o public/<page>/<name>.webp   # overwrite from correct PNG
  ```
- Then update the ref in `app/<page>/page.tsx`: `/<page>/<name>.png` → `.webp`. For a whole
  page at once (only touches this page's own dir, leaves borrowed refs + existing `.webp`):
  ```bash
  sed -i '' -E 's#(/<page>/[A-Za-z0-9_-]+)\.png#\1.webp#g' app/<page>/page.tsx
  ```
- **Keep the original `.png` on disk** (now unreferenced) until the page is signed off,
  then prune (Step 4).
- **Duplicates:** if two refs point to byte-identical files (`cmp a.png b.png`), encode
  once and point both refs at the single `.webp`.

---

## Step 3 — Verify

```bash
npm run build                        # must be clean (catches broken refs / types)
du -sh public/<page>                 # compare against the baseline you recorded
```

Then `npm run dev`, open `/<page>` in a browser, and walk every section confirming no
broken images.

---

## Step 4 — Prune originals (after sign-off)

Once the page looks right, delete the now-unreferenced original PNGs. **Match the full
`/<page>/<name>.png` path, not just the basename** — the same name can live in another
page's folder (e.g. `/gx35/box.png` vs `/gx4k/box.png`). Only delete files with no
remaining reference:

```bash
grep -rnE "/<page>/<name>\.png" app/ components/ config/ lib/   # must return nothing first
rm public/<page>/<name>.png
```

---

## Video (2026-07-27)

Video is now the dominant payload sitewide. **There are two encode recipes and they are not
interchangeable** — pick by how the clip is played, not by where it lives. Whichever you
pick, finish with the **poster extraction in C**; that step applies to every clip.

> **`/opt-vid` automates this whole section for a single file** — it probes the source,
> picks the recipe from the call site, keeps the master as `_orig`, builds the `_mobile`
> twin when needed, extracts the poster and repoints the refs. The steps below are the
> reference it encodes; read them when you need to deviate.

### A. Normal playback (carousel cards, `MediaSection`, autoplay loops)

```bash
ffmpeg -v error -y -i in.mp4 -an \
  -c:v libx264 -crf 26 -preset slow -vf "scale=1920:-2" \
  -pix_fmt yuv420p -movflags +faststart out.mp4
```

- **`-an` is not optional.** Every one of these renders `muted` (`Carousel.tsx`,
  `MediaSection`, the `ScrollScrubVideo` mobile stack), so an audio track is bytes nobody
  can ever hear. The GX35 masters carried ~317 kbps of AAC each.
- **`scale=1920:-2`** — carousel cards max out at 1040 CSS px, so 1920 still covers 2× DPR.
  `-2` keeps the height even, which H.264 requires (a 2500×1082 source lands at 1920×830).
- **CRF 26** is the default. Typical result is **83–93 % smaller**.
- **`+faststart`** moves the moov atom to the front so playback starts before the full
  download. Always include it.

**When CRF 26 under-performs** (< 60 % saved), the source has grain or fine-detail motion
and the encoder is spending bits on noise. Try a denoise pass before dropping quality:
`-vf "hqdn3d=1.5:1.5:6:6,scale=1920:-2"`. `alloc-only` is the live example — 42 % where its
siblings got 83 %, left as-is for now.

### B. Scroll-scrubbed (`ScrollScrubVideo`'s `video` prop) — every frame a keyframe

Seeking cost is *decoding*, so a normal GOP makes scrubbing stutter. Full rationale in
CLAUDE.md § ScrollScrubVideo:

```bash
ffmpeg -v error -y -i in.mp4 -an \
  -c:v libx264 -g 1 -keyint_min 1 -sc_threshold 0 -crf 23 -preset slow \
  -vf "scale=1920:-2" -pix_fmt yuv420p -movflags +faststart out_scrub.mp4
```

- **CRF 23, not 26** — scrub frames are held still under the eye, so artefacts read as
  defects rather than motion blur.
- **Verify, don't assume.** I-frame count must equal frame count:
  ```bash
  ffprobe -v error -select_streams v -show_entries frame=pict_type -of csv=p=0 f.mp4 | grep -c I
  ffprobe -v error -select_streams v -show_entries frame=pict_type -of csv=p=0 f.mp4 | wc -l
  ```
- All-keyframe usually **inflates** the file (GX4K `hero_render` 2.1 MB → 7.0 MB). It shrank
  for GX35 `discreet` only because that master was very loosely compressed. Keep clips short.

**Every scrub section also needs a mobile twin.** `mobileVideo` exists precisely because the
scrub encode buys nothing on a phone (nothing seeks there) and costs the whole download:

```bash
ffmpeg -v error -y -i in.mp4 -an -c:v libx264 -crf 26 -preset slow -g 48 \
  -vf "scale=1280:-2" -pix_fmt yuv420p -movflags +faststart out_mobile.mp4
```

Name them `<name>_scrub.mp4` / `<name>_mobile.mp4` so it's obvious which is which, and check
**both** props are pointed at the right one — `/gx4k` optics shipped `mobileVideo` set to the
8.9 MB master for a while, and nothing catches that but reading it.

### C. Poster frame — extract one for every clip

**Every video encode ends with a poster.** Not optional, not a follow-up pass: a `<video>`
with no `poster` shows a blank box until the first frame decodes, and on a scrub section
that blank can persist for the whole download.

Pull it from the **final encoded MP4**, not the master — the poster and the first decoded
frame must be the *same* image, or the handover flashes:

```bash
ffmpeg -v error -y -i out.mp4 -frames:v 1 -f image2 /tmp/frame.png
cwebp -q 82 /tmp/frame.png -o public/<page>/<name>-poster.webp
```

- **Naming: `<name>-poster.webp`** — same basename as the video, `-poster` suffix. So
  `discreet.mp4` → `discreet-poster.webp`, `alloc-driving.mp4` → `alloc-driving-poster.webp`.
  For a clip with `_scrub`/`_mobile` builds, one poster off the desktop/scrub build serves
  both — name it after the base clip (`discreet-poster.webp`, not `discreet_scrub-poster.webp`).
  Note the dash: the `_scrub` / `_mobile` / `_orig` suffixes mark *which encode of the video*
  a file is, so a poster — which isn't a video at all — stays on the dash.
- **Always WebP**, `-q 82`. These land at 20–60 KB; anything much bigger means you extracted
  before the `scale=` step.
- Then wire it up: `poster={...}` on the raw `<video>`, or the `poster` prop on
  `MediaSection` / `ScrollHero` / `FeatureTabs` (all three accept one, and all three fall
  back to `image` if you omit it — which is exactly how a section silently ships the wrong
  still). `BentoCard` uses its `img` as the poster by design.

> The three 2026-07-27 hero posters already follow this — `/home/gx4k-hero-poster.webp`,
> `/gx4k/gx4k-hero-poster.webp`, `/gx35/hero-poster.webp`. The rule is that convention
> written down, so nothing needs renaming.

### Keeping the masters

Keep the pre-compression original next to the output as `<name>_orig.<ext>`, so a re-encode
at different settings never needs the client again. `.gitignore` carries
**`public/**/*_orig.*`** — these must never be committed (they were tracked before, so
renaming one to `_orig` without that rule would have committed ~72 MB of masters). Delete
them once the page is signed off in a browser.

### Verify

`tsc`/`npm run build` **cannot** catch a bad media path — they're string literals. After any
rename, run `/link-check` (or at minimum grep the old filename) before committing.

---

## Results — GX4K (2026-07-25)

Baseline `public/gx4k` = **301 MB**. **Images only.**

24 PNGs converted to WebP; 6 of them were twin-candidates whose stale `.webp` was a
*different image* — re-encoded from the correct PNG and overwritten (per Step 1/2). Biggest
wins: `captured-front-rear` 5.9M→260K, `captured-ai-heat` 5.7M→176K, `second-eyes`
5.3M→304K, `graphic-your-dashcam` 4.7M→96K, `box` 1.0M→48K.

Referenced PNG payload: **~46 MB → ~2.0 MB.** 22 originals pruned (~37 MB); two kept only
because `app/gx35/page.tsx` borrowed them via `/gx4k/...` (`graphic-dual-vision.png`, and
`alloc-parking.png` until gx35 moved onto its own — since pruned).

---

## Results — GX35 (2026-07-25)

Baseline `public/gx35` = **290 MB**. **Images only.**

26 referenced `/gx35/*.png` re-encoded to WebP (`cwebp -q 80`), **overwriting** the 3
pre-existing twins (`detail-heat`, `detail-night`, `detail-starvis`) from the correct PNG
per Step 2 (verified `box.webp` still shows the AU **64GB** card, `detail-night` the correct
night scene). Biggest wins: `protected-power` 7.3M→406K, `detail-night` 6.8M→415K,
`connected-gps` 5.9M→285K, `box` 4.6M→130K, `connected-app` 4.9M→98K.

Referenced PNG payload: **~74.5 MB → ~3.3 MB.** All 26 PNG originals pruned plus the orphaned
`/gx4k/alloc-parking.png` — **27 files, ~80 MB freed.** Folder **290 MB → 218 MB**.

**Borrowed `/gx4k/` placeholders still referenced by gx35** (`// TODO(gx35-asset)`):
`graphic-dual-vision.png`, `disappear-screen-free.mp4`, `dual-sensors_scrub.mp4`,
`discreet_scrub.mp4`, plus `see-sensor.webp` / `wiring-experts.webp`. When gx35 gets its own
assets, these refs change and the borrowed `/gx4k/` files become prunable.

---

## Results — Homepage (2026-07-25)

**No PNGs** — the homepage was already on WebP/JPG. Converted its **6 JPGs → WebP** (`-q 82`,
encoded from the JPG source): `gx4k-studio` 196K→30K, `gx35-studio` 159K→23K, `hero-gx4k`
134K→61K, `hero-gx35` 89K→31K, plus the two 30K `reason-*` tiles. Two of these live under
`/products/` (the homepage references them cross-dir).

Referenced JPG payload **638K → 181K (~457K saved, ~72 %)**. All 6 JPG originals pruned
(unreferenced elsewhere) — **638K freed**. Build clean, all 21 routes prerender.

The homepage's remaining weight is the two hero videos in `public/home` (~40 MB) — video,
out of scope.

---

## Results — Installation (2026-07-25)

**Nothing to do — already optimized.** All 5 referenced images are already `.webp` (no PNG/JPG
anywhere), each ≤248K, and `public/installation` is only **1.0 MB** total with no video.
Left untouched.

---

## Results — Warranty (2026-07-25)

**Nothing to do — text-only policy page.** No image refs on the page, in its `PolicyDocument`
component, or in `lib/data/warranty.ts`; no `public/warranty` folder. Zero raster payload.

---

## Results — Terms of Service (2026-07-25)

**Nothing to do — text-only.** Same `PolicyDocument` pattern, backed by
`lib/data/installation-terms.ts` (no image refs); no `public/terms-of-service` folder.

---

## Results — Support (2026-07-25)

**Nothing to do — already `.webp`.** 3 referenced images, all WebP (`hero` 416K, two
product cards 56–72K); no PNG/JPG on the page or in its imported components; no rasters in
`public/support`. Folder 424K.

---

## Results — About (2026-07-25)

**Nothing to do — already `.webp`.** 7 referenced images, all WebP (`story` 468K, `genuine`
288K, `hero` 140K, four trust tiles ≤20K); no PNG/JPG on the page or in `public/about`.
Folder 964K.

---

## Results — Video, GX35 + GX4K (2026-07-27)

`public/gx35` **290 MB → 93 MB** once masters are pruned. Six clips re-encoded, all with
audio stripped:

| File | Before | After | Saved |
|------|--------|-------|-------|
| `gx35/day-ai-auto.mp4` | 33.8 MB (2560×1440 +AAC) | 2.45 MB | 92.8 % |
| `gx35/day-true-2k.mp4` | 38.0 MB (+AAC) | 5.15 MB | 86.4 % |
| `gx35/alloc-driving.mp4` | 40.2 MB (2500×1082 +AAC) | 6.90 MB | 82.8 % |
| `gx35/alloc-event.mp4` | 8.85 MB (+AAC) | 1.55 MB | 82.5 % |
| `gx35/alloc-only.mp4` | 21.2 MB (+AAC) | 12.3 MB | **41.9 %** ← grainy, see denoise note |
| `gx35/discreet.mp4` | 11.1 MB (2160×1200) | `_scrub` 1.73 MB + `_mobile` 251 KB | 82 % |

**GX4K `optics`:** no encode needed. `optics_orig.mp4` was byte-identical (md5 `b9145e08…`)
to `gx4k_secondary_banner.mp4`, whose `_scrub`/`_mobile` builds already existed and already
met spec — renamed to `optics_*` and repointed. Check for this before encoding anything:
`md5 -q a.mp4 b.mp4`.

## Results — Images, second pass (2026-07-27)

12 further PNGs → WebP at `-q 82`, refs repointed, originals pruned. **~34 MB → ~1.9 MB.**
Biggest: `gx4k/second-eyes` 7.3 M→591 K, `gx35/disappear-details` 3.7 M→268 K,
`gx4k/disappear-details` 4.4 M→357 K, `gx35/day-starvis` 1.9 M→33 K,
`gx4k/disappear-one` 1.7 M→17 K.

⚠️ **Three of these were content swaps, not compressions** — the supplied PNG was a
*different photo* from the `.webp` it overwrote (`gx4k/second-eyes`, `gx4k/alloc-parking`,
`gx35/alloc-parking`). Two looked like deliberate corrections (the GX35 page was showing a
GX4K unit). This is the Step 1 ⚠️ hazard, and it is common enough that `/png-webp` now
diffs dimensions and opens both images before overwriting.

Also found: `gx4k/disappear-screen.webp` and `gx4k/alloc-parking.webp` are byte-identical
(md5 `b49fbee1…`) — the same photo shipped twice under two names, in two sections.

## MVP status (2026-07-25)

All 8 MVP pages checked. Image compression applied where PNGs/JPGs existed:

| Page | Outcome |
|------|---------|
| GX4K | ✅ 24 PNG→WebP, pruned (~46 MB → ~2 MB referenced) |
| GX35 | ✅ 26 PNG→WebP, 3 twins fixed, pruned (~80 MB freed) |
| Homepage | ✅ 6 JPG→WebP, pruned (~457 KB saved) |
| Installation | ➖ already all WebP (1.0 MB) |
| Warranty | ➖ text-only, no images |
| Terms of Service | ➖ text-only, no images |
| Support | ➖ already all WebP (424 KB) |
| About | ➖ already all WebP (964 KB) |

~~**Videos across all pages remain out of scope**~~ — **superseded 2026-07-27.** GX35's
`day-*`, `alloc-*` and `discreet` clips are done (see Results above), as is GX4K `optics`.

**Still outstanding:**

- **`public/home` hero videos (~40 MB)** — the homepage's biggest remaining weight.
- **GX4K video** — only `optics` was touched; `alloc-only.mp4` there is 34 MB, and
  `captured-*` / `detail-*` are 3–5 MB each, all likely still carrying audio.
- **`public/assets/*.png`** — several 2–6 MB hash-named files. Check references first.
- **`alloc-only` (GX35)** — the 42 % outlier, deliberately left; a denoise pass should
  roughly halve it again.
- **Posters for the already-encoded clips** — the poster rule (Video § C) landed
  2026-07-28, after the GX35/GX4K video pass. Only the three hero stills exist; the six
  GX35 `day-*` / `alloc-*` / `discreet` clips and GX4K `optics` still have no
  `<name>-poster.webp`. Backfill them from the shipped MP4s.
- **Non-MVP pages** — untouched.

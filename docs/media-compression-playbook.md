# Image Compression Playbook

Repeatable steps for shrinking the `/public` **image** payload (PNG → WebP). Applied so far
to **GX4K** and **GX35** (2026-07-25) — see results at the bottom.

The real problem is **payload, not markup**. `srcset` does nothing until smaller variants
exist, so the fastest high-impact win is a straight compression pass: convert big PNGs to
WebP and repoint the code refs.

> **Scope:** images only. Video re-encoding is deliberately **not** part of this playbook.

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

**Videos across all pages remain out of scope** (see the ⚠️ note at the top). The remaining
large payload sitewide is video (hero clips, `alloc-*`, `day-*`) plus untouched non-MVP
pages and `public/assets/*.png` (several 2–6 MB hash-named files — check references before
converting).

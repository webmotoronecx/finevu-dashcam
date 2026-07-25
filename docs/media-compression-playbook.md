# Media Compression Playbook

Repeatable steps for shrinking the `/public` media payload. First run: **GX4K page**
(2026-07-25) — folder `public/gx4k` went **301 MB → ~106 MB** after pruning (see results
at the bottom). Use this same process to roll out to other pages / the rest of `/public`.

The real problem is **payload, not markup**. `srcset` does nothing until smaller variants
exist, and video has no `srcset` mechanism — so the fastest high-impact win is a straight
compression pass:

1. Big PNGs → WebP (repoint the code refs).
2. Oversized MP4s → re-encode at the same filename (no component changes).

**Tooling:** `cwebp` and `ffmpeg` (both already installed via Homebrew). **No `sharp`, no
npm dependency, no `next/image`.** The site renders all images through
`components/figma/ImageWithFallback.tsx` (a plain `<img>`), so a WebP path just works.

---

## Step 1 — Find the heavy assets

```bash
ls -lS public/<page>/ | awk '{print $5, $9}' | head -40   # biggest files first
grep -nE "/<page>/[a-zA-Z0-9_-]+\.(png|mp4)" app/<page>/page.tsx   # refs + line numbers
```

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

---

## Step 2 — PNG → WebP

```bash
cwebp -q 80 -mt public/<page>/<name>.png -o public/<page>/<name>.webp
```

- `-q 80` is a good default for photographic / gradient UI art (typically **80–95 %
  smaller**). Drop to `-q 75` for very large hero art if 80 is still heavy; raise toward
  `-q 90` only if you see banding on a gradient.
- Then update the ref in `app/<page>/page.tsx`: `/<page>/<name>.png` → `.webp`.
- **Keep the original `.png` on disk** (now unreferenced) until the page is signed off,
  then prune (Step 5).
- **Duplicates:** if two refs point to byte-identical files (`cmp a.png b.png`), encode
  once and point both refs at the single `.webp`.

---

## Step 3 — MP4 re-encode (same filename, no code change)

**Normal autoplay / background video** — H.264 CRF, downscale anything above 1920 wide,
web-optimised. Encode to a temp file, verify, then move over the original:

```bash
ffmpeg -y -i public/<page>/<v>.mp4 -an -c:v libx264 -crf 28 -preset slow \
  -vf "scale='min(1920,iw)':-2" -pix_fmt yuv420p -movflags +faststart /tmp/<v>.mp4
```

- `-an` drops audio (all site video is `muted`). `+faststart` = progressive load.
- CRF **28** is the default; a long/high-detail clip that stays large at 28 can go to
  **30–32** (this pass took a 16.5 s clip 38 MB → 9 MB at CRF 32).
- 4K sources are overkill for these small autoplay tiles — the `scale` expr downsizes
  them to 1920 while leaving already-small clips untouched.
- Duplicates: encode once, `cp` to the second filename.

**Scrub video (`*_scrub.mp4`, fed to `ScrollScrubVideo`)** — MUST keep **every frame a
keyframe** or scrubbing stutters. Use the dense-keyframe encode (add `-crf` to shrink):

```bash
ffmpeg -y -i public/<page>/<v>_scrub.mp4 -an -c:v libx264 -crf 30 -preset slow \
  -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart /tmp/<v>_scrub.mp4
```

**Verify keyframe density before swapping in** — I-frame count MUST equal total frames:

```bash
tot=$(ffprobe -v error -select_streams v -count_frames -show_entries stream=nb_read_frames -of csv=p=0 /tmp/<v>_scrub.mp4)
ifr=$(ffprobe -v error -select_streams v -show_frames -show_entries frame=pict_type /tmp/<v>_scrub.mp4 | grep -c 'pict_type=I')
echo "$ifr / $tot"   # must be equal
```

---

## Step 4 — Verify

```bash
npm run build                        # must be clean (catches broken refs / types)
du -sh public/<page>                 # compare against the baseline you recorded
```

Then `npm run dev`, open `/<page>` in a browser, and walk every section: confirm no
broken images and that `*_scrub.mp4` still scrub smoothly on scroll.

---

## Step 5 — Prune originals (after sign-off)

Once the page looks right, delete the now-unreferenced original PNGs. Only delete files
with **no remaining reference**:

```bash
grep -rn "<name>.png" app/ components/ config/ lib/   # must return nothing first
rm public/<page>/<name>.png
```

---

## Results — GX4K (2026-07-25)

Baseline `public/gx4k` = **301 MB**.

**Images (PNG → WebP, `-q 80`):**

| File | Before | After |
|------|--------|-------|
| captured-front-rear | 5.9M | 260K |
| captured-ai-heat | 5.7M | 176K |
| second-eyes | 5.3M | 304K |
| alloc-parking | 5.0M | 124K |
| graphic-your-dashcam | 4.7M | 96K |
| graphic-dual-vision | 2.4M | 60K |
| captured-starvis (also used for detail-starvis, identical dup) | 1.7M | 48K |
| protected-20-sec / -smart-time / -ai-heating | ~1.1M ea | 52–108K |
| safer-adas / safer-speed | 1.0–1.3M | 68–132K |
| built-capacitor / -in-house / -battery | 0.8–1.0M ea | 20–40K |
| connected-app / connected-gps | ~1.0M ea | 40–76K |
| warranty3 / microsd / cables / box / compare-gx4k / compare-gx35 | — | **REVERTED to `.png`** — the pre-existing twins were different images (see ⚠️ in Step 1). |

Referenced PNG payload for the converted set: **~44 MB → ~1.9 MB.** The 6 twin-candidates
were left as PNG (~2.5 MB total, modest) rather than swapped to unreliable twins.

**Video — REVERTED (quality decision pending).** A first pass re-encoded the 8 clips at
CRF 28 (CRF 32 for `alloc-only`, CRF 30 dense-keyframe for the scrubs), taking video
~180 MB → ~30 MB — but the output looked **too blurry**, so all videos were reverted to
their git originals. Before redoing them, pick a CRF from a watched quality ladder:

| Clip | Baseline | CRF 20 | CRF 23 | CRF 26 | (blurry 1st pass) |
|------|----------|--------|--------|--------|-------------------|
| captured-night (real footage) | 20M | 7.5M | 4.1M | 2.3M | 2.0M @28 |
| alloc-only (UI/text, 16.5 s) | 38M | 47M | 34M | 23M | 9.0M @32 |
| dual-sensors_scrub | 5.5M | 7.3M | 6.2M | 5.2M | 3.8M @30 |

Notes for the redo: `alloc-only` is an outlier — so detailed that CRF 20 exceeds the
original and even CRF 23 barely shrinks it; the scrub clips are already dense-keyframe so
CRF 20 also exceeds baseline (CRF ~26 is their realistic quality ceiling). Build the ladder
with the Step 3 commands into `public/gx4k/_compare/` and watch via QuickLook before
committing to a CRF.

**Net (images only, applied):** referenced PNG payload **~44 MB → ~1.9 MB**; a further
**~44 MB** of now-unreferenced original PNGs can be pruned (Step 5). Video savings are on
hold pending the CRF decision above.

**Not touched / flagged:**
- `disappear-screen-free.mp4` (33 MB) — inside a dead `{false && …}` block, never ships.
- Poster ref `app/gx4k/page.tsx:472` points to `/gx4k/hero-render.png` but the on-disk
  file is `hero_render.png` (hyphen vs underscore) — pre-existing broken poster, left as-is.
- No `srcset` / `<source media>` / component changes — deferred by choice.

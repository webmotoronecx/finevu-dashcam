import type { DownloadFile, FirmwareTab } from "@/components/sections/FirmwareDownloads";

/* Single source of truth for firmware / downloads content.
   Consumed by the GX4K and GX35 product pages (the FirmwareDownloads panel) and by
   /support (the per-model download + guide hubs), which previously each carried their
   own copy of the same steps.

   ⚠️ There is NO upstream source for any of this — docs/content-sources/*.txt say
   nothing about firmware. The update procedures below are generic and safe; the VERSION
   STRINGS ARE NOT. See CA-13 in docs/content-accuracy-changes.csv.

   The files themselves are served from Cloudflare R2, NOT from public/ — they are ~73 MB
   each and do not belong in the repo. `modelReleases` is the only thing to edit when a
   new build lands; see NEXT_PUBLIC_FIRMWARE_BASE_URL below and CLAUDE.md open item 6. */

export type ModelKey = "gx4k" | "gx35";

/** [label, meta, url?] — DownloadList on /support renders "Coming Soon" when url is absent. */
export type DownloadItem = [label: string, meta: string, url?: string];

export const firmwareSteps: string[] = [
    "Download the latest firmware.",
    "Remove the microSD card from your dash cam. Insert it into a microSD card reader and connect the reader to the PC.",
    "When the reader is connected to the PC, a USB drive or new disk drive will be created. (We recommend formatting a card previously used in another device before you upgrade the firmware.)",
    "Copy the downloaded firmware to the top-level root of the memory card.",
    "Insert the microSD card into the device. Turn on the vehicle or start the engine to turn on the device.",
    "The firmware update starts automatically.",
    "The system will automatically restart once the firmware update is completed.",
];

export const speedCamSteps: string[] = [
    "Download the latest Speed Cam data file.",
    "Remove the microSD card from your dash cam. Insert it into a microSD card reader and connect the reader to the PC.",
    "When the reader is connected to the PC, a USB drive or new disk drive will be created.",
    "Copy the downloaded Speed Cam data file to the top-level root of the memory card.",
    "Insert the microSD card into the device. Turn on the vehicle or start the engine to turn on the device.",
    "The Speed Cam data file update starts automatically.",
    "The system will automatically restart once the Speed Cam data file update is completed.",
];

export const firmwareWarning =
    "Do not power off your dash cam until it begins continuous recording — doing so may cause permanent damage.";

/** One downloadable file.
 *
 *  - `id` — the URL segment in /api/firmware/<id>. MUST BE UNIQUE ACROSS EVERY MODEL AND
 *    KIND, and must be stable: it is the public link, so changing one breaks any URL
 *    already shared. Lowercase, hyphens and dots only. `assertUniqueIds()` below fails the
 *    build on a collision rather than letting one file silently shadow another.
 *  - `key` — the object key in the R2 bucket, exactly as it appears there (keys are
 *    case-sensitive, and a file uploaded inside a folder carries the folder in its key).
 *    Never exposed to the browser.
 *  - `label` — the row text on /support and the option text in the product-page picker.
 *  - `meta` — /support's right-hand column, e.g. "v2.03 · ZIP" or "PDF · EN".
 *  - `version` — the version/date line the picker shows once selected. Falls back to `meta`.
 *  - `filename` — what the browser saves it as. Defaults to the last segment of `key`.
 *  - `sha256` — lowercase hex digest of the file, shown under the download so a customer
 *    can verify what they got. Firmware is executable code for a device, so a corrupted or
 *    swapped file can brick a camera; this is the one integrity control we can offer
 *    ourselves. Compute it FROM THE OBJECT IN R2, not from a local copy, or it certifies
 *    the wrong bytes. Omit it and the line simply does not render.
 *
 *  Keep each list newest-first: index 0 is presented as the latest. */
export type ReleaseFile = {
    id: string;
    key: string;
    label: string;
    meta: string;
    version?: string;
    filename?: string;
    sha256?: string;
};

/* Per-model release metadata. Firmware, manuals and Speed Cam data are ARRAYS — a model
   can ship several builds, a manual per language, or a dated Speed Cam file per release.
   Manuals and Speed Cam are empty because FineVu has not supplied those files.

   Partial data is always safe: an empty array renders a "Coming Soon" row on /support
   and HIDES that tab entirely on the product panels; if every tab is hidden the panel
   renders nothing at all. So add files as they arrive, in any order.

   Keys are object keys in the R2 bucket, resolved against R2_BASE above — never write a
   full URL here, or it will not follow the environment. Previously hardcoded on /support
   with no source: gx4k firmware "v2.03", gx35 "v1.14" (CA-13). The versions below came
   with the R2 uploads and still need a FineVu source. */

/* Whether the download UI is switched on. The FILES live in a private R2 bucket and are
   served by /api/firmware/[id], which holds the credentials — but this module is imported
   by client components, which cannot see server env vars. Hence a separate public flag.

   SET IT ONLY WHERE THE R2 CREDENTIALS ARE ALSO SET. The two go together: this renders the
   buttons, those make them work. Unset is the safe state — `hosted()` returns nothing, so
   every tab hides and the FirmwareDownloads section renders nothing at all, rather than
   shipping a button that 503s. It is therefore also the off switch: clear it in Vercel to
   pull the downloads without changing code.

   NEXT_PUBLIC_ values are inlined at build time, so changing it needs a REDEPLOY. */
const DOWNLOADS_ENABLED = process.env.NEXT_PUBLIC_FIRMWARE_DOWNLOADS === "true";

/** Same-origin download URL for a file. The presigned R2 URL never reaches the client —
    the route mints one per request and redirects, so this link is stable and shareable. */
export const hrefFor = (file: ReleaseFile) => `/api/firmware/${file.id}`;

/** The file list, or nothing at all when downloads are switched off. */
function hosted(files: ReleaseFile[]): ReleaseFile[] {
    return DOWNLOADS_ENABLED ? files : [];
}

export const modelReleases: Record<
    ModelKey,
    {
        firmware: ReleaseFile[];
        manuals: ReleaseFile[];
        speedCam: ReleaseFile[];
        quickStartUrl: string | null;
        specSheetUrl: string | null;
    }
> = {
    gx4k: {
        // e.g. { label: "Firmware", meta: "v2.03 · ZIP", url: "/downloads/gx4k/firmware-2.03.zip" }
        firmware: [
            {
                id: "gx4k-firmware-v1.00.005",
                key: "firmware/GX4K_FW_5.bin",
                label: "GX4K Firmware",
                meta: "V1.00.005 (2025-07-30)",
                // Verified against the object in R2 on 2026-08-11 (73,461,760 bytes).
                sha256: "f4ae1daebc840c18464663d9eab57c9ae2a2b991c81ec0071a777aa1fdfcdfa6",
            },
        ],
        manuals: [],
        speedCam: [],
        quickStartUrl: null,
        specSheetUrl: null,
    },
    gx35: {
        firmware: [
            {
                id: "gx35-firmware-v1.00.001",
                key: "firmware/GX35_FW_2.bin",
                label: "GX35 Firmware",
                meta: "V1.00.001 (2025-08-20)",
                // Verified against the object in R2 on 2026-08-11 (71,413,760 bytes).
                sha256: "8a7896b7087528f90fa5ba9af922ae9041027e18e10dedb54bf114fa8c0e9607",
            },
        ],
        manuals: [],
        speedCam: [],
        quickStartUrl: null,
        specSheetUrl: null,
    },
};

/* ── The allowlist ─────────────────────────────────────────────────────────────────────
   Every file declared above, flattened and keyed by id. /api/firmware/[id] resolves
   through this and 404s on anything absent.

   THIS IS THE SECURITY BOUNDARY. The route must never pass a client-supplied string to R2
   as an object key — that would turn a public endpoint into a read oracle for the whole
   private bucket, which is the main reason the bucket is private at all. The client sends
   an id we published; the object key only ever comes from this file.

   Note it is built from `modelReleases` directly, NOT through `hosted()`: the allowlist
   describes what EXISTS, while the flag controls what is OFFERED. The route checks the
   credentials separately, so a file stays resolvable for a direct link even when the UI
   is switched off. */
const ALL_FILES: ReleaseFile[] = Object.values(modelReleases).flatMap((r) => [
    ...r.firmware,
    ...r.manuals,
    ...r.speedCam,
]);

/* Duplicate ids would make one file silently unreachable — the Map keeps the last. With
   ~20 manuals and speed-cam files to come, that is a copy-paste away, so fail loudly at
   import time (which means at build time) instead of shipping a link to the wrong file. */
function assertUniqueIds(files: ReleaseFile[]): Map<string, ReleaseFile> {
    const byId = new Map<string, ReleaseFile>();
    for (const file of files) {
        if (byId.has(file.id)) {
            throw new Error(`Duplicate firmware file id "${file.id}" in modelReleases — ids must be unique across every model and kind.`);
        }
        byId.set(file.id, file);
    }
    return byId;
}

const FILES_BY_ID = assertUniqueIds(ALL_FILES);

/** Resolve a published download id to its file, or undefined if there is no such file. */
export function fileById(id: string): ReleaseFile | undefined {
    return FILES_BY_ID.get(id);
}

/** A file list, or a single url-less placeholder row so the hub layout never collapses.
    DownloadList shows "Coming Soon" for any row without a url. */
function rowsOr(files: ReleaseFile[], placeholder: [string, string]): DownloadItem[] {
    if (files.length === 0) return [placeholder];
    return files.map((f) => [f.label, f.meta, hrefFor(f)]);
}

/** The Downloads column of a /support model hub. */
export function downloadsFor(model: ModelKey): DownloadItem[] {
    const r = modelReleases[model];
    return [
        ...rowsOr(hosted(r.firmware), ["Firmware", "ZIP"]),
        ...rowsOr(hosted(r.manuals), ["User manual", "PDF · EN"]),
        ["Quick start guide", "PDF", r.quickStartUrl ?? undefined],
        ["Spec sheet", "PDF", r.specSheetUrl ?? undefined],
        // Speed Cam data only appears once there is a file — no placeholder row, since
        // this hub never advertised it before.
        ...hosted(r.speedCam).map((f): DownloadItem => [f.label, f.meta, hrefFor(f)]),
    ];
}

/** The Guides column of a /support model hub. Model-independent today — if a model ever
    needs its own guides, turn this into a Record<ModelKey, DownloadItem[]>. */
export const supportGuides: DownloadItem[] = [
    ["Firmware update steps", "GUIDE"],
    ["microSD card formatting", "GUIDE"],
    ["Parking mode & battery protection", "GUIDE"],
    ["Installation video", "VIDEO"],
];

/** Files as the product-page picker wants them. An empty array renders no picker. */
function pickerFiles(files: ReleaseFile[]): DownloadFile[] {
    return files.map((f) => ({
        label: f.label,
        version: f.version ?? f.meta,
        href: hrefFor(f),
        sha256: f.sha256,
    }));
}

/* Tabs for the FirmwareDownloads panel on the product pages. The instructions are the
   same for both models; `model` selects the files, so each tab wires its own download the
   moment modelReleases is filled in — no code change needed.

   A tab with an EMPTY file list is dropped from the switcher entirely — instructions for
   a file you cannot download are worse than no tab. With one tab left the panel drops the
   pill bar and renders a plain title; with none it renders nothing. */
export function downloadTabsFor(model: ModelKey): FirmwareTab[] {
    const r = modelReleases[model];
    return [
        {
            name: "Firmware",
            heading: "Instructions",
            steps: firmwareSteps,
            warning: firmwareWarning,
            downloads: pickerFiles(hosted(r.firmware)),
        },
        {
            name: "User Manual",
            downloads: pickerFiles(hosted(r.manuals)),
        },
        {
            name: "Speed Cam Data",
            heading: "Instructions",
            steps: speedCamSteps,
            downloads: pickerFiles(hosted(r.speedCam)),
        },
    ];
}

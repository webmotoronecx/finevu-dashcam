import type { DownloadFile, FirmwareTab } from "@/components/sections/FirmwareDownloads";

/* Single source of truth for firmware / downloads content.
   Consumed by the GX4K and GX35 product pages (the FirmwareDownloads panel) and by
   /support (the per-model download + guide hubs), which previously each carried their
   own copy of the same steps.

   ⚠️ There is NO upstream source for any of this — docs/content-sources/*.txt say
   nothing about firmware, and public/ holds no .zip or .pdf. The update procedures
   below are generic and safe; the VERSION STRINGS AND FILE URLS ARE NOT. See CA-13 in
   docs/content-accuracy-changes.csv. When the real files arrive, this file is the only
   place that needs editing. */

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
    "Do not power off your dash cam until it begins continuous recording, as it may cause permanent damage to the dash cam.";

/** One downloadable file. `label` is the row text on /support and the option text in the
    product-page picker; `meta` is /support's right-hand column (e.g. "v2.03 · ZIP",
    "PDF · EN"); `version` is the version/date line the picker shows once selected
    (e.g. "V1.00.001 (2025-08-20)"). Keep each model's list newest-first — index 0 is
    presented as the latest. */
export type ReleaseFile = { label: string; meta: string; url: string; version?: string };

/* Per-model release metadata. Firmware, manuals and Speed Cam data are ARRAYS — a model
   can ship several builds, a manual per language, or a dated Speed Cam file per release.
   All three are empty today because FineVu has not supplied the files: an empty array
   renders "Coming Soon" on /support and hides the CTA on the product panels, so nothing
   dead or unsourced ships. Previously hardcoded on /support with no source:
   gx4k firmware "v2.03", gx35 "v1.14" (CA-13). */

const parentUrl = 'https://pub-5f24122eb7464fec8edf4af659a6237c.r2.dev'   
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
        firmware: [{
            label:"GX4k Firmware",
            meta: "V1.00.005 (2025-07-30)",
            url:`${parentUrl}/GX4K_FW_5.bin`

        },
    {
            label:"GX4k Firmware",
            meta: "V1.00.005 (2025-07-30)",
            url:`${parentUrl}/GX4K_FW_5.bin`

        }],
        manuals: [],
        speedCam: [],
        quickStartUrl: null,
        specSheetUrl: null,
    },
    gx35: {
        firmware: [{
            label:"GX35 Firmware",
            meta: "V1.00.001 (2025-08-20)",
            url:`${parentUrl}/GX35_FW_2.bin`

        }],
        manuals: [],
        speedCam: [],
        quickStartUrl: null,
        specSheetUrl: null,
    },
};

/** A file list, or a single url-less placeholder row so the hub layout never collapses.
    DownloadList shows "Coming Soon" for any row without a url. */
function rowsOr(files: ReleaseFile[], placeholder: [string, string]): DownloadItem[] {
    if (files.length === 0) return [placeholder];
    return files.map((f) => [f.label, f.meta, f.url]);
}

/** The Downloads column of a /support model hub. */
export function downloadsFor(model: ModelKey): DownloadItem[] {
    const r = modelReleases[model];
    return [
        ...rowsOr(r.firmware, ["Firmware", "ZIP"]),
        ...rowsOr(r.manuals, ["User manual", "PDF · EN"]),
        ["Quick start guide", "PDF", r.quickStartUrl ?? undefined],
        ["Spec sheet", "PDF", r.specSheetUrl ?? undefined],
        // Speed Cam data only appears once there is a file — no placeholder row, since
        // this hub never advertised it before.
        ...r.speedCam.map((f): DownloadItem => [f.label, f.meta, f.url]),
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
    return files.map((f) => ({ label: f.label, version: f.version ?? f.meta, href: f.url }));
}

/* Tabs for the FirmwareDownloads panel on the product pages. The instructions are the
   same for both models; `model` selects the files, so each tab wires its own download the
   moment modelReleases is filled in — no code change needed.

   Every tab always shows its instructions. An empty file list is passed through as an
   empty array, which the panel renders as "Coming soon" in the download slot — so the
   only thing missing content hides is the download itself, never the how-to. */
export function downloadTabsFor(model: ModelKey): FirmwareTab[] {
    const r = modelReleases[model];
    return [
        {
            name: "Firmware",
            heading: "Instructions",
            steps: firmwareSteps,
            warning: firmwareWarning,
            downloads: pickerFiles(r.firmware),
        },
        {
            name: "User Manual",
            downloads: pickerFiles(r.manuals),
        },
        {
            name: "Speed Cam Data",
            heading: "Instructions",
            steps: speedCamSteps,
            downloads: pickerFiles(r.speedCam),
        },
    ];
}

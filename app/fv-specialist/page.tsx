import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "FineVu Specialist",
};

/**
 * Parse a URL param as a boolean.
 * Accepts true/1/yes/on (and their opposites); falls back to `fallback`
 * when the param is absent or unrecognised.
 */
function boolParam(value: string | string[] | undefined, fallback: boolean): boolean {
    const v = Array.isArray(value) ? value[0] : value;
    if (v == null) return fallback;
    const s = v.toLowerCase();
    if (["true", "1", "yes", "on"].includes(s)) return true;
    if (["false", "0", "no", "off"].includes(s)) return false;
    return fallback;
}

export default async function FvSpecialistPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const params = await searchParams;

    // Controllable via URL, e.g. ?autoplay=false&muted=0&loop=false&controls=true
    // Note: browsers block autoplay unless the video is muted, so ?autoplay=true&muted=false
    // will usually not start on its own.
    const autoPlay = boolParam(params.autoplay, false);
    const muted = boolParam(params.muted, false);
    const loop = boolParam(params.loop, false);
    const controls = boolParam(params.controls, true);

    return (
        <section data-nav-theme="dark" className="flex min-h-[100svh] w-full items-center justify-center bg-black">
            <video
                className="h-auto w-full max-w-[500px] object-contain md:h-[100svh] md:w-auto md:max-w-none"
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                controls={controls}
                playsInline
                preload="metadata"
            >
                <source src="/common/fv-specialist.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </section>
    );
}

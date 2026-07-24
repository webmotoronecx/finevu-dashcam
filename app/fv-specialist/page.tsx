import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "FineVu Specialist",
};

export default function FvSpecialistPage() {
    return (
        <section data-nav-theme="dark" className="flex min-h-[100svh] w-full items-center justify-center bg-black">
            <video
                className="h-auto w-full max-w-[500px] object-contain md:h-[100svh] md:w-auto md:max-w-none"
                controls
         
             
                playsInline
                preload="metadata"
            >
                <source src="/common/fv-specialist.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </section>
    );
}

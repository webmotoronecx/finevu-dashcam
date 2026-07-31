// TEMPORARY — verification gate for docs/stacked-panels-2026-07-30.md. Delete after testing.
import { StackedPanels, StackedPanel } from "@/components/sections/StackedPanels";

export default function StickyGate() {
    return (
        <>
            <div data-nav-theme="light" className="flex h-[60svh] items-center justify-center bg-white text-2xl">
                scroll down
            </div>
            <StackedPanels>
                <StackedPanel theme="dark" className="bg-red-700">
                    <div className="flex h-full items-center justify-center text-6xl text-white">1</div>
                </StackedPanel>
                <StackedPanel theme="light" className="bg-amber-300">
                    <div className="flex h-full items-center justify-center text-6xl">2</div>
                </StackedPanel>
                <StackedPanel theme="dark" className="bg-blue-800">
                    <div className="flex h-full items-center justify-center text-6xl text-white">3</div>
                </StackedPanel>
            </StackedPanels>
            <div data-nav-theme="light" className="flex h-[60svh] items-center justify-center bg-white text-2xl">
                after
            </div>
        </>
    );
}

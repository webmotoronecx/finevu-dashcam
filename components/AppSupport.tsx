"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Smartphone, ChevronDown, Info, Download } from "lucide-react";
import IconFinevuApp from "@/public/support/icon-finevu-app.svg"

// FineVu Wi-Fi app support card for the Support page: a summary strip whose
// "Get the app" button expands a collapsible downloads panel (iOS / Android store
// links, requirements and supported products). Built from the client-supplied HTML.

type Platform = {
  id: "ios" | "android";
  label: string;
  version: string;
  href: string;
  requirement: string;
  fine: string;
  supported: { name: string; featured?: boolean }[] 
};

// Both models are listed on both platforms, matching /gx35 and /faq and en.finevu.com.
// ⚠️ GX35-on-iOS still NEEDS APPROVAL: the Apple App Store listing for FineVu Wi-Fi
// (id1514069940) does not name the GX35. We follow en.finevu.com on the assumption the
// store listing is stale, but Fine Digital has not confirmed it. If that flips, three
// other surfaces flip with it — see docs/content-sources/general.txt § FINEVU WI-FI APP
// and gx35.txt:45 {!needs approval}, CA-76.
const platforms: Platform[] = [
  {
    id: "ios",
    label: "iOS",
    version: "V 1.1.77",
    href: "https://apps.apple.com/au/app/finevu-wi-fi/id1514069940",
    requirement: "Requires iOS 13.0 or later. Designed for iPhone.",
    fine: "Download size is approximately 117 MB. Some phones may behave differently depending on OS version and supported resolution. If you run into trouble, our support team can help — or contact FineVu directly at finevu-cs@finedigital.com.",
    supported: [
      { name: "GX4K", featured: true },
      { name: "GX35", featured: true },
    ]
  },
  {
    id: "android",
    label: "Android",
    version: "Latest version",
    href: "https://play.google.com/store/apps/details?id=com.finedigital.finevu3&hl=en_AU",
    requirement: "Requires Android 10.0 or higher.",
    fine: "Some phones may behave differently depending on OS version and supported resolution. If Android Auto is connected, disconnect it before pairing with your camera. If you run into trouble, our support team can help — or contact FineVu directly at finevu-cs@finedigital.com.",
    supported: [
      { name: "GX4K", featured: true },
      { name: "GX35", featured: true },
    ]
  },
];



const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6 },
};

export function AppSupport() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Platform["id"]>("ios");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const Icon = IconFinevuApp

  const active = platforms.find((p) => p.id === tab) ?? platforms[0];

  // "Get the app" opens the panel and scrolls it into view (matches the source design).
  const openAndScroll = () => {
    setOpen(true);
    requestAnimationFrame(() =>
      toggleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <motion.div
      {...fadeUp}
      className="mx-auto mt-5 max-w-[1020px] overflow-hidden rounded-[16px] border border-[#e7e7ea] bg-white"
    >
      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-5 px-[26px] py-[22px]">
        <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] bg-[#fef2e5] text-[var(--finevu-orange)]">
          {/* <Smartphone className="h-[24px] w-[24px]" strokeWidth={1.8} /> */}
          <Icon className="h-[60px] w-[60px]" />
        </span>
        <div className="min-w-[240px] flex-1">
          <h3 className="text-[18px] font-bold tracking-[-0.01em] text-[#17181a]">FineVu app support</h3>
          <p className="mt-1 text-[14.5px] leading-[1.5] text-[#55555c]">
            Change settings, view live footage and download clips over Wi-Fi. Works with both GX4K and GX35.
          </p>
        </div>
        <div className="flex w-full gap-3 sm:w-auto">
       
          <button
            type="button"
            onClick={openAndScroll}
            className="cta-hover inline-flex flex-1 items-center justify-center rounded-full bg-[var(--finevu-orange)] px-[26px] py-3.5 text-[13px] font-bold uppercase leading-[20px] tracking-[0.06em] text-white sm:flex-none"
          >
            Get the app
          </button>
        </div>
      </div>

      {/* Toggle */}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="app-downloads"
        className="flex w-full items-center justify-between gap-3 border-t border-[#e8e8ec] px-[26px] py-[18px] text-left text-[15px] font-semibold text-[#17181a] transition-colors hover:text-[var(--finevu-orange)]"
      >
        <span>About the FineVu Wi-Fi app &amp; downloads</span>
        <ChevronDown
          className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          strokeWidth={2.4}
        />
      </button>

      {/* Collapsible body (grid-rows 0fr→1fr for a height-agnostic slide) */}
      <div
        id="app-downloads"
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-[26px] pb-8 pt-1">
            <p className="mb-5 text-[15px] leading-[1.6] text-[#55555c]">
              The FineVu Wi-Fi app connects directly to your dash cam over Wi-Fi — no cables, no card readers.
              Watch a live view, play back and download recorded clips to your phone, adjust camera settings like
              LED, memory partition and ADAS, and keep your firmware and speed camera database up to date.
            </p>

            <div className="mb-6 flex items-start gap-2.5 rounded-[10px] bg-[#eaf4fd] px-4 py-3 text-[14px] leading-[1.5] text-[#1d6fb8]">
              <Info className="mt-0.5 h-[17px] w-[17px] shrink-0" strokeWidth={2} />
              <span>
                Only supported for download on phones. If you use a VPN, pause it before connecting — it can
                interfere with the Wi-Fi link to your camera.
              </span>
            </div>

            <div role="tablist" aria-label="Choose your platform" className="mb-6 flex gap-7 border-b border-[#e8e8ec]">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  id={`tab-${p.id}`}
                  aria-selected={tab === p.id}
                  aria-controls="app-version-panel"
                  onClick={() => setTab(p.id)}
                  className={`-mb-px border-b-2 px-0.5 pb-3 pt-2.5 text-[16px] font-semibold transition-colors ${
                    tab === p.id
                      ? "border-[var(--finevu-orange)] text-[#17181a]"
                      : "border-transparent text-[#8a8a92] hover:text-[#17181a]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              id="app-version-panel"
              aria-labelledby={`tab-${active.id}`}
              className="rounded-[12px] bg-[#f7f7f9] px-7 py-6"
            >
              <div className="mb-3.5 flex flex-wrap items-center justify-between gap-4">
                <h4 className="text-[17px] font-bold text-[#17181a] w-full md:w-auto">{active.version}</h4>
                <a
                  href={active.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-hover inline-flex items-center gap-2 rounded-full bg-[var(--finevu-orange)] px-[22px] py-3 text-[13px] font-bold uppercase tracking-[0.05em] text-white"
                >
                  Download <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
                </a>
              </div>
              <p className="mb-3.5 text-[14.5px] leading-[1.55] text-[#55555c]">{active.requirement}</p>
              <h5 className="mb-1.5 text-[14.5px] font-bold text-[#17181a]">Requirements</h5>
              <p className="text-[13.5px] leading-[1.6] text-[#8a8a92]">{active.fine}</p>
            </div>

            <div className="mt-8">
              <h4 className="mb-3.5 text-[19px] font-bold text-[#17181a]">Supported products</h4>
              <div className="flex flex-wrap gap-2.5">
                {active.supported.map((s) => (
                  <span
                    key={s.name}
                    className={`rounded-[8px] border px-3.5 py-[7px] text-[13.5px] ${
                      s.featured
                        ? "border-[var(--finevu-orange)] bg-[#fdf1e6] font-semibold text-[#de6f12]"
                        : "border-[#d9d9df] bg-white text-[#55555c]"
                    }`}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

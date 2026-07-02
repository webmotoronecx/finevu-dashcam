"use client";

import { Footer } from "@/components/Footer";
import { OpticsSection } from "@/components/sections/OpticsSection";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

/* ============================================================================
   FineVu GX4K — premium product page
   Full rebuild of Figma frame 102:2004 (FineVu Website Wireframe).
   Dark cinematic layout, real frame imagery in public/gx4k/*.
   ========================================================================== */

const SHELL = "mx-auto w-full max-w-[1280px] px-6 lg:px-10";
const HEAD_GRAD = "linear-gradient(90deg, #8ea6f0 0%, #b79ce2 100%)";
// FineVu Gradient v2 — used for the "What's in The Box?" item labels (Figma 110:2810)
const BOX_GRAD = "linear-gradient(166deg, #603DB0 0%, #4F47FF 44%, #6284D8 100%)";
const BODY = "text-[15px] md:text-[18px] leading-[1.6] text-[#a6a6a6]";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

/* Title-case section heading with an optional gradient-highlighted word. */
function Head({
  pre = "",
  grad = "",
  post = "",
  className = "",
  as: Tag = "h2",
}: {
  pre?: string;
  grad?: string;
  post?: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <Tag
      className={`font-semibold tracking-[-0.01em] text-white text-[30px] md:text-[42px] leading-[1.12] ${className}`}
    >
      {pre}
      {grad && (
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: HEAD_GRAD, WebkitBackgroundClip: "text" }}
        >
          {grad}
        </span>
      )}
      {post}
    </Tag>
  );
}

/* Dark media panel — used where the frame leaves an image slot empty. */
function Panel({ className = "", label }: { className?: string; label?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#0d0d14] ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, rgba(110,143,230,0.10), transparent 62%)",
        }}
      />
      {label && (
        <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-[13px] text-zinc-600">
          {label}
        </span>
      )}
    </div>
  );
}

/* Full-bleed showcase divider: big image with centered heading + subtitle. */
function Showcase({
  img,
  title,
  subtitle,
}: {
  img?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section data-nav-theme="dark" className="relative">
      <div className="relative h-[520px] md:h-[720px] w-full overflow-hidden">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[#26262b]" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,12,0.72) 0%, rgba(8,8,12,0.15) 34%, rgba(8,8,12,0.2) 70%, rgba(8,8,12,0.85) 100%)",
          }}
        />
        <motion.div
          {...fadeUp}
          className="absolute inset-x-0 top-[14%] mx-auto max-w-[720px] px-6 text-center"
        >
          <Head pre={title} className="!text-[30px] md:!text-[44px]" />
          <p className="mx-auto mt-3 max-w-[520px] text-[14px] md:text-[17px] leading-[1.5] text-white/60">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* Horizontal feature carousel — centred-peek cards, click/drag + prev/next.
   A transform track (not native scroll) so the ends clamp cleanly: the active
   card is centred, but the first/last clamp to a side margin instead of over-
   scrolling into empty space. Draggable by pointer; snaps to the nearest card. */
type Card = { title: string; body: string; img?: string; blank?: boolean };
function Carousel({
  pre,
  grad,
  post,
  cards,
  note,
  alignEnd,
  leftAlign,
  imgAspect = "73 / 50",
}: {
  pre?: string;
  grad?: string;
  post?: string;
  cards: Card[];
  note?: string;
  alignEnd?: boolean;
  leftAlign?: boolean;
  imgAspect?: string;
}) {
  const vpRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(0);
  const [range, setRange] = useState({ min: 0, max: 0, step: 1 });
  const [dragging, setDragging] = useState(false);
  // live gesture state (avoids stale-closure reads inside pointer handlers)
  const drag = useRef({ x: 0, tx: 0, active: false, min: 0, max: 0, step: 1 });

  // measure viewport/card and the clamped translate range for the current size
  const measure = useCallback(() => {
    const vp = vpRef.current;
    const card = trackRef.current?.querySelector<HTMLElement>("[data-card]");
    if (!vp || !card) return null;
    const cardW = card.offsetWidth;
    const gap = 24;
    const trackW = cards.length * cardW + (cards.length - 1) * gap;
    const vw = vp.clientWidth;
    let max: number;
    let min: number;
    if (leftAlign) {
      // First card flush to the content-left margin (matches the page SHELL:
      // max-w-[1280px] + px-6 / lg:px-10) so there's no leading empty space —
      // cards bleed off the right, last card clamps to the content-right margin.
      // Per Figma 140:225 (carousel is left-aligned, not centred).
      const pad = vw >= 1024 ? 40 : 24;
      const inset = Math.max(0, (vw - 1280) / 2) + pad;
      max = inset; // first card pinned at the content-left edge
      min = Math.min(max, vw - inset - trackW); // last card right edge → content-right
    } else {
      max = (vw - cardW) / 2; // first card centred → margin on the left
      min = Math.min(max, (vw + cardW) / 2 - trackW); // last card → margin on the right
    }
    const r = { min, max, step: cardW + gap };
    setRange(r);
    return r;
  }, [cards.length, leftAlign]);

  const snap = useCallback((rawTx: number, r: { min: number; max: number; step: number }) => {
    const i = Math.round((r.max - rawTx) / r.step);
    const clamped = Math.max(0, Math.min(cards.length - 1, i));
    setTx(Math.max(r.min, Math.min(r.max, r.max - clamped * r.step)));
  }, [cards.length]);

  // Position on mount (retry via rAF until the cards have laid out) and re-clamp
  // on resize. All setState runs inside async callbacks, never the effect body.
  const positioned = useRef(false);
  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    let raf = 0;
    const init = () => {
      const r = measure();
      if (!r) {
        raf = requestAnimationFrame(init);
        return;
      }
      positioned.current = true;
      setTx(alignEnd ? r.min : r.max);
    };
    raf = requestAnimationFrame(init);
    const ro = new ResizeObserver(() => {
      const r = measure();
      if (r && positioned.current) setTx((p) => Math.max(r.min, Math.min(r.max, p)));
    });
    ro.observe(vp);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [measure, alignEnd]);

  const stepBy = (d: number) => {
    const cur = Math.round((range.max - tx) / range.step);
    snap(range.max - (cur + d) * range.step, range);
  };

  const onDown = (e: React.PointerEvent) => {
    const r = measure() ?? range;
    drag.current = { x: e.clientX, tx, active: true, ...r };
    setDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore — synthetic events / unsupported pointers */
    }
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const raw = d.tx + (e.clientX - d.x);
    // rubber-band resistance past the clamped bounds
    const v = raw > d.max ? d.max + (raw - d.max) * 0.3 : raw < d.min ? d.min + (raw - d.min) * 0.3 : raw;
    setTx(v);
  };
  const onUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    snap(tx, { min: drag.current.min, max: drag.current.max, step: drag.current.step });
  };

  const atStart = tx >= range.max - 1;
  const atEnd = tx <= range.min + 1;

  return (
    <section data-nav-theme="dark" className="py-16 md:py-24">
      <div className={`${SHELL} mb-8 md:mb-12 text-center`}>
        <Head pre={pre} grad={grad} post={post} className="!text-[26px] md:!text-[38px]" />
      </div>
      <div ref={vpRef} className="overflow-hidden" style={{ touchAction: "pan-y" }}>
        <div
          ref={trackRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className={`flex select-none gap-6 pb-4 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            transform: `translate3d(${tx}px,0,0)`,
            transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {cards.map((c) => (
            <motion.article
              key={c.title}
              data-card
              {...fadeUp}
              className="w-[80vw] shrink-0 md:w-[62vw] lg:w-[min(48vw,1040px)]"
            >
              {c.img ? (
                <div
                  className="tile-hover relative overflow-hidden rounded-[22px] border border-white/[0.06]"
                  style={{ aspectRatio: imgAspect }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.title} draggable={false} className="h-full w-full object-cover" />
                </div>
              ) : c.blank ? (
                // image not yet supplied — Figma "blank" placeholder (#656565)
                <div className="rounded-[22px] bg-[#656565]" style={{ aspectRatio: imgAspect }} />
              ) : (
                <Panel className="aspect-[73/50]" />
              )}
              <h3 className="mt-6 text-[22px] md:text-2xl font-semibold text-white">
                {c.title}
              </h3>
              <p className={`mt-3 max-w-[540px] ${BODY} !text-[14px] md:!text-[16px]`}>
                {c.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
      <div className={`${SHELL} mt-2 flex items-center justify-end gap-3`}>
        {note && (
          <p className="mr-auto max-w-[560px] text-left text-[12px] text-zinc-600">{note}</p>
        )}
        <button
          onClick={() => stepBy(-1)}
          disabled={atStart}
          aria-label="Previous"
          className="cta-hover flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 hover:text-white disabled:cursor-default disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => stepBy(1)}
          disabled={atEnd}
          aria-label="Next"
          className="cta-hover flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 hover:text-white disabled:cursor-default disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

/* Bento tile for the "reasons to choose" grid — image with label overlay. */
function BentoTile({
  img,
  label,
  sup,
  className = "",
  imgClass = "",
}: {
  img: string;
  label: string;
  sup?: string;
  className?: string;
  imgClass?: string;
}) {
  return (
    // Figma 133:58 tile — rounded-[32px], image cover-fills to the edges,
    // white label overlaid at the bottom (subtle gradient for legibility).
    <div className={`tile-hover relative overflow-hidden rounded-[32px] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={label} className={`absolute inset-0 h-full w-full object-cover ${imgClass}`} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <p className="absolute inset-x-0 bottom-6 px-4 text-center text-[16px] font-semibold text-white md:text-[22px]">
        {label}
        {sup && <sup className="ml-0.5 align-super text-[11px] font-medium md:text-[13px]">[{sup}]</sup>}
      </p>
    </div>
  );
}

/* Two-tone label ("Front camera" → first word white, rest blue). */
function TwoTone({ text, className = "" }: { text: string; className?: string }) {
  const i = text.indexOf(" ");
  const first = i === -1 ? text : text.slice(0, i);
  const rest = i === -1 ? "" : text.slice(i);
  return (
    <span className={className}>
      <span className="text-white">{first}</span>
      <span className="text-[#6e8fe6]">{rest}</span>
    </span>
  );
}

/* ---------------------------------------------------------------- data ---- */

const detailCards = [
  { title: "3840 × 2160 UHD Front Camera", caption: "Every pixel captured", img: "/gx4k/card-uhd.webp" },
  { title: "Sony STARVIS IMX515", caption: "8.5MP · F/1.8 · crystal-clear detail", img: "/gx4k/card-sensor.webp" },
  { title: "Auto Night Vision", caption: "AI-controlled, always-on HDR mode", img: "/gx4k/card-night.webp" },
  { title: "Ai Heat Monitoring", caption: "Auto power-save if temps spike", img: "/gx4k/card-heat.webp" },
  { title: "136°/143° Field of View", caption: "Front & Rear", img: "" },
];

const cSeeDetail: Card[] = [
  { title: "True 4K Ultra HD", body: "Front records in 3840×2160 UHD, rear in Full HD 1080p. Number plates, road signs and faces stay sharp enough to actually hold up as evidence.", img: "/gx4k/see-uhd.webp" },
  { title: "Sony STARVIS Sensor", body: "The 8.5MP Sony STARVIS IMX515 delivers vivid, low-noise footage with the dynamic range to handle harsh glare and deep shadow alike.", img: "/gx4k/see-sensor.webp" },
  { title: "AI Auto Night Vision", body: "Smart AI reads the light around you and adjusts brightness and contrast on its own, for clear night footage with nothing to switch on.", blank: true },
];

const cParked: Card[] = [
  { title: "Power Saving Parking Mode", body: "Prolonged recording time. Consuming 98% less power, GX4K records 2,325 more hours than standard parking mode.", img: "/gx4k/parking.webp" },
  { title: "Smart Time-Lapse", body: "Records at 10fps while parked, then jumps to 30fps the instant something happens — up to 743 minutes of coverage without filling the card." },
  { title: "AI Heat Monitoring", body: "Built-in temperature sensing powers the camera down before heat becomes a risk — protection made for hot climates and long summer parks.", img: "/gx4k/card-heat.webp" },
  { title: "20-Second Impact Capture", body: "Every impact saves the 10 seconds before and 10 seconds after — front and rear — so the full scene is locked in, not just the moment of contact.", img: "/gx4k/impact.webp" },
];

const cSafer: Card[] = [
  { title: "ADAS Plus Driver Assistance", body: "Forward Vehicle Moving Alert (FVMA) and Lane Departure Warning (LDWS) keep you sharp, with a nudge when the car ahead pulls away or you drift lanes." },
  { title: "Speed Camera Alert", body: "Quarterly safety-camera database updates with voice and visual alerts. Fewer surprises, fewer tickets. Requires GPS reception." },
];

const cBuilt: Card[] = [
  { title: "Supercapacitor, Not Battery", body: "A supercapacitor replaces the traditional battery for better heat tolerance and a longer service life. Engineered for reliability, not shortcuts." },
  { title: "Built In-House", body: "FineVu builds in-house, not in generic factories, with quality control tight enough to keep defects below 0.2%. That's reliability you can count on." },
  { title: "Battery Protection Integrated", body: "Low-voltage cut-off powers the camera down before your car battery runs flat. Set your vehicle's profile in the FineVu app with a single tap." },
];

const cStorage: Card[] = [
  { title: "Format Free 2.0", body: "Format Free 2.0 ends manual card reformatting for good, extending your memory card's lifespan and keeping recording reliable, drive after drive." },
  { title: "Memory Allocation", body: "Split storage to match how you drive, with Driving, Event, Parking or Driving-Only priority, so the card fills with the footage you actually need." },
];

const cConnected: Card[] = [
  { title: "FineVu App", body: "View live video, download clips, change settings and update firmware right from your phone. Android and iOS, plus FineVu Player 2.0 on desktop." },
  { title: "5GHz Wi-Fi", body: "Fast dual-band Wi-Fi streams live footage to your phone and pulls clips straight off the camera. No removing the SD card." },
  { title: "Built-in GPS", body: "Records speed, location and route with no external GPS to buy or wire in. Every clip stamped with exactly where and how fast you were going." },
];

const disappearTabs = [
  {
    title: "Screen-Free by Design",
    body: "No LCD, no glare, no distraction. Just subtle status lights that let you know it's recording, keeping your attention where it belongs, on the road.",
  },
  {
    title: "Disappears Behind the Mirror",
    body: "At 96.5mm wide and just 114g, the wedge-shaped front unit tucks neatly behind your rear-view mirror. The rear camera is smaller still at only 23g. Always present, never in sight.",
  },
  {
    title: "One Cable, Clean Install",
    body: "A single 6-metre cable links the rear camera and powers it at the same time, so there's no second power run and no messy wiring. A 9-metre cable is available for larger vehicles.",
  },
  {
    title: "Details That Think Ahead",
    body: "Thoughtful touches throughout. A microSD slot with an on/off switch lets you pause recording without unplugging, QR-code pairing gets you set up in seconds, and simple physical buttons handle mic, emergency and Wi-Fi.",
  },
];

const detailGallery = [
  { src: "/gx4k/detail-lens.webp", alt: "GX4K lens macro", ratio: "746/562" },
  { src: "/gx4k/detail-body.webp", alt: "FineVu machined body", ratio: "527/562" },
];

const specRows: [string, string][] = [
  ["Front camera", "SONY STARVIS IMX515 · 8.5 MP · 3840 × 2160 (4K UHD) · 136° FOV"],
  ["Rear camera", "2 MP CMOS · 1920 × 1080 (Full HD) · 143° FOV · 23 g module"],
  ["Processor", "Dual-core"],
  ["Night vision", "HDR auto night vision (AI-controlled)"],
  ["Recording modes", "Continuous · Impact · Emergency · Parking (motion + impact) · Time-lapse"],
  ["Parking mode", "Power Saving Parking — up to 98% less power, +2,325 standby hours"],
  ["Driver assistance", "ADAS Plus — FVMA (front vehicle motion alert) · LDWS (lane departure)"],
  ["Connectivity", "Built-in 5 GHz Wi-Fi · Built-in GPS"],
  ["Storage", "microSD up to 256 GB · Format Free 2.0 · Memory allocation"],
  ["Protection", "Low voltage cut-off · G-sensor · AI heat monitoring"],
  ["Safety database", "Speed camera alerts, updated quarterly"],
];

const boxItems = [
  "Front Camera",
  "Rear Camera",
  "MicroSD Card & Adapter",
  "Power Cable",
  "Rear Cable",
  "User Manual",
];

const compareRows: [string, string, string][] = [
  ["Front Sensor", "Sony STARVIS IMX515 8.5MP", "Sony STARVIS 2 IMX675 5.12MP"],
  ["Front Resolution", "4K UHD 3840×2160", "2K QHD 2560×1440"],
  ["Rear Resolution", "Full HD 1920×1080", "Full HD 1920×1080"],
  ["Max Video", "4K 30fps", "2K 30fps"],
  ["Field of View", "136°F · 143°R", "147°F · 143°R"],
  ["GPS", "Built-in", "External (included)"],
  ["Parking Standby", "+2,325 hrs", "+13,950 hrs"],
  ["Processor", "Allwinner V536", "Allwinner V536"],
  ["Warranty", "3 Years", "3 Years"],
];

const firmwareSteps = [
  "Download the latest firmware.",
  "Remove the Micro SD card from your dashcam. Insert it into a Micro SD card reader and connect the reader to the PC.",
  "When the reader is connected to the PC, a USB drive or new disk drive will be created. (It's recommended to format the Micro SD card used for another device before you upgrade the firmware.)",
  "Copy the downloaded firmware onto the top-level root of the memory card.",
  "Insert the Micro SD card into the device. Turn on the vehicle or start the engine to turn on the device.",
  "The firmware update starts automatically.",
  "The system will automatically restart once the firmware update is completed.",
];

const warranty = [
  ["Warranty", "3 Year Warranty applies to FineVu dash cam main units only, including front and rear cameras, for 36 months from the date of purchase. Genuine FineVu accessories are covered by a 6 month warranty. Proof of purchase required. Full warranty terms apply. Your rights under the Australian Consumer Law are not excluded."],
  ["SD Cards", "GX35 includes a FineVu 64GB MicroSD Card and Adapter. GX4K includes a FineVu 128GB MicroSD Card and Adapter. Included MicroSD Cards and adapters are covered by a 6 month warranty."],
  ["Hardwire Kit & Power Cable", "GX35 and GX4K include a Hardwire Kit and Power Cable. Included Hardwire Kits and Power Cables are covered by a 6 month warranty."],
];

// Help / quick-links row (Figma 180:225)
const helpLinks: { icon: string; label: string; href: string; flip?: boolean }[] = [
  { icon: "/gx4k/help-where.svg", label: "Where to buy", href: "/where-to-buy" },
  { icon: "/gx4k/help-install.svg", label: "Install", href: "/booking", flip: true },
  { icon: "/gx4k/help-support.svg", label: "Support", href: "/support" },
];

/* ------------------------------------------------------------- component -- */

export default function GX4KPage() {
  const [fwTab, setFwTab] = useState<"Firmware" | "User Manual" | "Speed Cam Data">("Firmware");
  const [dtd, setDtd] = useState(0);

  return (
    <main className="overflow-x-clip bg-[#08080c]">
      {/* 1 · HERO ---------------------------------------------------------- */}
      <section
        data-nav-theme="dark"
        className="relative min-h-[760px] lg:min-h-[900px] flex items-start justify-center overflow-hidden bg-black"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gx4k/hero-bg.webp"
          alt="FineVu GX4K front and rear dash cam in a cosmic nebula"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 34%, rgba(0,0,0,0) 60%)",
          }}
        />
        <div className="relative z-10 flex w-full max-w-[620px] flex-col items-center px-6 pt-[160px] text-center">
          <motion.p
            {...fadeUp}
            className="text-[11.5px] font-bold uppercase tracking-[0.28em] text-[#6e8fe6]"
          >
            FineVu GX4K · 2-Channel UHD
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 bg-clip-text text-[58px] font-bold uppercase leading-[1.04] tracking-[-0.02em] text-transparent sm:text-7xl lg:text-[80px]"
            style={{
              backgroundImage: "linear-gradient(169deg, #ffffff 0%, #6e8fe6 55%, #4f2d74 100%)",
              WebkitBackgroundClip: "text",
            }}
          >
            4K Begins.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-[560px] text-[18px] leading-[1.6] text-[#e0e4f0]"
          >
            The clearest view of the road you&apos;ve ever recorded — front and rear.
          </motion.p>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
            <Link
              href="/where-to-buy"
              className="cta-hover mt-9 inline-flex items-center justify-center rounded-full px-12 py-3.5 text-sm font-semibold uppercase tracking-wide text-white"
              style={{ backgroundImage: "linear-gradient(24deg, #372649 10%, #4f2d74 38%, #6284d8 75%)" }}
            >
              Find a Retailer
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2 · EVERY DETAIL. CAPTURED IN ULTRA HD. + card grid --------------- */}
      <section data-nav-theme="dark" className="py-20 md:py-28">
        <motion.div {...fadeUp} className={`${SHELL} mb-12 text-center md:mb-16`}>
          <Head pre="Every detail. " grad="Captured in Ultra HD." className="!text-[30px] md:!text-[46px]" />
          <p className={`mx-auto mt-5 max-w-[560px] ${BODY} text-center`}>
            4K UHD at 30fps across two channels — licence plates, road signs, and low-light
            intersections rendered with uncompromised clarity.
          </p>
        </motion.div>

        <div className={`${SHELL} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12`}>
          <BentoCardGridItem card={detailCards[0]} className="lg:col-span-7 lg:row-span-2 aspect-[16/10] lg:aspect-auto lg:min-h-[520px]" />
          <BentoCardGridItem card={detailCards[1]} className="lg:col-span-5 aspect-[16/9]" />
          <BentoCardGridItem card={detailCards[2]} className="lg:col-span-5 aspect-[16/9]" />
          <BentoCardGridItem card={detailCards[3]} className="lg:col-span-6 aspect-[16/9]" />
          <BentoCardGridItem card={detailCards[4]} className="lg:col-span-6 aspect-[16/9]" />
        </div>
      </section>

      {/* 3 · THE OPTICS BEHIND THE IMAGE. — scroll-revealed callouts ------- */}
      <OpticsSection />

      {/* 4 · SEE EVERY DETAIL carousel ----------------------------------- */}
      <Carousel pre="See Every " grad="Detail" cards={cSeeDetail} imgAspect="1047 / 562" leftAlign />

      {/* 5 · PROTECTED WHILE PARKED carousel — hidden per request --------- */}
      {false && <Carousel grad="Protected" post=" While Parked" cards={cParked} alignEnd />}

      {/* ─── sections below hidden per request (flip false → true to show) ─── */}
      {false && (
      <>
      {/* 6 · A SECOND SET OF EYES. showcase ------------------------------- */}
      <Showcase title="A Second Set of Eyes." subtitle="ADAS Plus watches the road with you, and speaks up before you need to." />

      {/* 7 · SMARTER, SAFER DRIVING carousel ------------------------------ */}
      <Carousel pre="Smarter, " grad="Safer Driving" cards={cSafer} />

      {/* 8 · BUILT TO LAST carousel --------------------------------------- */}
      <Carousel
        pre="Built to Last"
        cards={cBuilt}
        note="* FineVu recommends changing the low voltage settings to ‘hybrid’ when using the ISG system."
        alignEnd
      />

      {/* 9 · STORAGE THAT MANAGES ITSELF carousel ------------------------- */}
      <Carousel pre="Storage That Manages Itself" cards={cStorage} />

      {/* 10 · YOUR DASHCAM. IN YOUR HAND. showcase ------------------------ */}
      <Showcase title="Your Dashcam. In Your Hand." subtitle="Live view, instant downloads and settings, all from your phone. No cables, no card removal." />

      {/* 11 · CONNECTED IN YOUR POCKET carousel --------------------------- */}
      <Carousel grad="Connected" post=" in Your Pocket" cards={cConnected} />

      {/* 12 · DISCREET BY DESIGN. showcase -------------------------------- */}
      <Showcase img="/gx4k/discreet.webp" title="Discreet by Design." subtitle="A screen-free, wedge-shaped body that tucks behind your mirror and out of your mind." />

      {/* 13 + 13b · DESIGNED TO DISAPPEAR band — one full-bleed gradient
          container behind both sections (Figma "Rectangle 35" / 141:114) ---- */}
      <div
        data-nav-theme="dark"
        style={{ background: "linear-gradient(180deg, #241C38 0%, #130F1E 7.2%, #08080C 59.6%)" }}
      >
      {/* 13 · DESIGNED TO DISAPPEAR (banner + interactive tabs) ------------ */}
      <section className="py-20 md:py-28">
        <motion.div {...fadeUp} className={`${SHELL} mb-8 text-center md:mb-12`}>
          <Head pre="Designed to Disappear" className="!text-[28px] md:!text-[42px]" />
        </motion.div>

        <div className={SHELL}>
          {/* Banner — Figma 110:2716 (blank placeholder: #656565, rounded-[32px]) */}
          <motion.div {...fadeUp} className="aspect-[1297/562] w-full rounded-[32px] bg-[#656565]" />

          {/* Tab selector — single inline row; drag/scroll horizontally on mobile */}
          <div className="mt-8">
            <div className="mx-auto flex w-max max-w-full gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {disappearTabs.map((t, i) => (
                <button
                  key={t.title}
                  onClick={() => setDtd(i)}
                  aria-pressed={dtd === i}
                  className={`cta-hover shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-semibold ${
                    dtd === i ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  style={dtd === i ? { backgroundImage: "linear-gradient(90deg, #4f2d74 0%, #6284d8 100%)" } : undefined}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          {/* Active tab copy */}
          <motion.p
            key={dtd}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`mx-auto mt-7 max-w-[660px] text-center ${BODY}`}
          >
            {disappearTabs[dtd].body}
          </motion.p>
        </div>
      </section>

      {/* 13b · SMALL IN SIZE. RICH IN DETAIL. gallery --------------------- */}
      <section className="py-16 md:py-24">
        <motion.div {...fadeUp} className={`${SHELL} mb-8 text-center md:mb-12`}>
          <Head pre="Small in Size. " grad="Rich in Detail." className="!text-[26px] md:!text-[40px]" />
        </motion.div>
        <div className={`${SHELL} space-y-4`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.42fr_1fr]">
            {detailGallery.map((g) => (
              <motion.div
                key={g.src}
                {...fadeUp}
                className="tile-hover overflow-hidden rounded-[22px] border border-white/[0.06]"
                style={{ aspectRatio: g.ratio.replace("/", " / ") }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} className="h-full w-full object-cover" />
              </motion.div>
            ))}
          </div>
          <motion.div
            {...fadeUp}
            className="tile-hover overflow-hidden rounded-[22px] border border-white/[0.06]"
            style={{ aspectRatio: "1297 / 427" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gx4k/detail-angle.webp" alt="GX4K angled macro" className="h-full w-full object-cover" />
          </motion.div>
        </div>
      </section>
      </div>
      </>
      )}

      {/* 14–19 · #0B0B0B band (More reasons → Firmware) — hidden per request */}
      {false && (
      <div data-nav-theme="dark" style={{ background: "#0B0B0B" }}>
      {/* 14–18 hidden per request (flip false → true to show) */}
      {false && (
      <>
      {/* 14 · REASONS / INCLUDES bento ------------------------------------ */}
      <section className="py-16 md:py-24">
        <motion.div {...fadeUp} className={`${SHELL} mb-8 text-center md:mb-12`}>
          <Head pre="More reasons to choose FineVu." className="!text-[26px] md:!text-[40px]" />
        </motion.div>
        {/* Figma 133:58 bento — top row taller (No.1 730 : warranty 550, both
            600 tall), bottom row two equal tiles (640×400); 20px gaps */}
        <div className={`${SHELL} space-y-4 sm:space-y-5`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[730fr_550fr] sm:gap-5">
            <BentoTile img="/gx4k/no1.webp" label="No.1 Dash Cam in Korea" className="aspect-[730/600]" />
            <BentoTile
              img="/gx4k/warranty3.webp"
              label="3 Year Warranty"
              sup="1"
              imgClass="object-[50%_42%]"
              className="aspect-[550/600] sm:aspect-auto sm:h-full"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <BentoTile img="/gx4k/microsd.webp" label="Includes 128GB MicroSD Card" sup="2" className="aspect-[640/400]" />
            <BentoTile img="/gx4k/cables.webp" label="Includes Hardwire Kit & Power Cable" sup="3" className="aspect-[640/400]" />
          </div>
        </div>
      </section>

      {/* 15 · LEAVE THE WIRING TO THE EXPERTS. install -------------------- */}
      <section data-nav-theme="dark" className="py-16 md:py-24">
        <div className={`${SHELL} text-center`}>
          <motion.div {...fadeUp}>
            <Head pre="Leave the Wiring to the Experts." className="!text-[28px] md:!text-[42px]" />
          </motion.div>
          <motion.div {...fadeUp} className="mt-10 overflow-hidden rounded-[28px] border border-white/[0.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gx4k/wiring-experts.webp" alt="FineVu certified installer arriving on-site" className="h-[280px] w-full object-cover md:h-[520px]" />
          </motion.div>
          <p className={`mx-auto mt-8 max-w-[620px] ${BODY} text-center`}>
            The GX4K records straight out of the box, but full-time parking protection means
            hardwiring it properly into your fuse box. Our certified installers fit it cleanly,
            hide every cable and set it up right the first time.
          </p>
          <Link
            href="/booking"
            className="cta-hover mt-8 inline-flex items-center justify-center rounded-full bg-[#f68428] px-10 py-3.5 text-sm font-semibold uppercase tracking-wide text-white"
          >
            Book Installation
          </Link>
        </div>
      </section>

      {/* 16 · FULL SPECIFICATIONS ----------------------------------------- */}
      <section data-nav-theme="dark" className="py-16 md:py-24">
        <div className={SHELL}>
          <motion.div {...fadeUp} className="mb-10 text-center">
            <Head pre="Full Specifications" className="!text-[28px] md:!text-[40px]" />
          </motion.div>
          <div className="mx-auto max-w-[900px] border-t border-white/10">
            {specRows.map(([label, value], i) => (
              <motion.div
                key={label}
                {...fadeUp}
                transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
                className="grid grid-cols-1 gap-2 border-b border-white/10 py-5 md:grid-cols-[260px_1fr] md:gap-8"
              >
                <TwoTone text={label} className="text-[11px] font-bold uppercase tracking-[0.16em]" />
                <p className="text-[15px] text-zinc-300">{value}</p>
              </motion.div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-[900px] text-xs text-zinc-600">
            Specifications compiled from FineVu published materials — confirm final figures against
            the official GX4K spec sheet before publishing.
          </p>
        </div>
      </section>

      {/* 17 · WHAT'S IN THE BOX? ------------------------------------------ */}
      <section data-nav-theme="dark" className="py-16 md:py-24">
        <div className={`${SHELL} text-center`}>
          <motion.div {...fadeUp}>
            <Head pre="What’s in The Box?" className="!text-[28px] md:!text-[40px]" />
          </motion.div>
          {/* Box contents — 3-col × 2-row grid, each label gradient-filled (Figma 110:2810) */}
          <div className="mx-auto mt-10 grid max-w-[760px] grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-3 md:mt-12">
            {boxItems.map((it) => (
              <p
                key={it}
                className="text-[16px] font-medium md:text-[20px]"
                style={{
                  backgroundImage: BOX_GRAD,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {it}
              </p>
            ))}
          </div>
          <motion.div {...fadeUp} className="mt-10 overflow-hidden rounded-[32px] md:mt-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gx4k/box.webp" alt="FineVu GX4K box contents" className="aspect-[1300/519] w-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* 18 · FINEVU SERIES COMPARISON — Figma 109:2614 (container 109:2615) */}
      <section data-nav-theme="dark" className="py-16 md:py-24">
        <div className={SHELL}>
          <motion.div
            {...fadeUp}
            className="mx-auto max-w-[992px] rounded-[32px] bg-[#141414] px-5 py-10 sm:px-10 md:rounded-[46px] md:px-14 md:py-16"
          >
            {/* Title (inside the container) */}
            <div className="text-center">
              <Head pre="FineVu Series Comparison" className="!text-[26px] md:!text-[40px]" />
            </div>

            {/* Two product columns */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-8 md:mt-12">
              {/* GX4K */}
              <div className="flex h-full flex-col items-center text-center">
                <div className="flex h-[34px] items-center">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#f68428]/60 px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#f68428] sm:px-3.5 sm:text-[12px]">
                    <Eye className="h-3.5 w-3.5" /> Currently Viewing
                  </span>
                </div>
                <h3 className="mt-4 text-[24px] font-bold text-white sm:text-[28px] md:text-[32px]">GX4K</h3>
                <p className="mx-auto mt-3 max-w-[320px] text-[13px] leading-[1.6] text-[#a6a6a6] sm:text-[15px]">
                  Crystal clear 4K recording for every drive. True 4K Ultra HD captures licence
                  plates and street signs with SONY STARVIS clarity.
                </p>
                <div className="flex flex-1 items-center justify-center py-6 md:py-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/gx4k/compare-gx4k.webp"
                    alt="FineVu GX4K front and rear cameras"
                    className="h-auto max-h-[130px] w-auto max-w-full object-contain md:max-h-[180px]"
                  />
                </div>
                <Link href="/gx4k" className="cta-hover inline-flex whitespace-nowrap rounded-full bg-[#f68428] px-6 py-3 text-[13px] font-semibold uppercase tracking-wide text-white sm:px-9 md:px-11 md:py-3.5">
                  Learn More
                </Link>
              </div>
              {/* GX35 */}
              <div className="flex h-full flex-col items-center text-center">
                <div className="h-[34px]" />
                <h3 className="mt-4 text-[24px] font-bold text-white sm:text-[28px] md:text-[32px]">GX35</h3>
                <p className="mx-auto mt-3 max-w-[320px] text-[13px] leading-[1.6] text-[#a6a6a6] sm:text-[15px]">
                  Record every moment in 2K. Premium FineVu protection and features at a more
                  accessible price point — the same trusted engineering.
                </p>
                <div className="flex flex-1 items-center justify-center py-6 md:py-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/gx4k/compare-gx35.webp"
                    alt="FineVu GX35"
                    className="h-auto max-h-[115px] w-auto max-w-full object-contain md:max-h-[155px]"
                  />
                </div>
                <Link href="/gx35" className="cta-hover inline-flex whitespace-nowrap rounded-full bg-[#f68428] px-6 py-3 text-[13px] font-semibold uppercase tracking-wide text-white sm:px-9 md:px-11 md:py-3.5">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Divider + spec table */}
            <div className="mt-10 border-t border-white/10 md:mt-12">
              {compareRows.map(([label, a, b]) => (
                <div key={label} className="grid grid-cols-2 gap-4 py-4 text-center sm:gap-8">
                  <div>
                    <p className="text-[11px] text-zinc-500 sm:text-[12px]">{label}</p>
                    <p className="mt-1 text-[14px] font-semibold text-white sm:text-[16px]">{a}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-500 sm:text-[12px]">{label}</p>
                    <p className="mt-1 text-[14px] font-semibold text-white sm:text-[16px]">{b}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      </>
      )}

      {/* 19 · FIRMWARE / DOWNLOADS ---------------------------------------- */}
      <section data-nav-theme="dark" className="py-16 md:py-24">
        <div className={`${SHELL} max-w-[820px]`}>
          <div className="mx-auto flex w-full max-w-[440px] rounded-full border border-white/10 p-1">
            {(["Firmware", "User Manual", "Speed Cam Data"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFwTab(t)}
                className={`flex-1 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                  fwTab === t ? "bg-[#f68428] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-semibold text-white">Instructions</h3>
            {fwTab === "Firmware" ? (
              <>
                <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-[14px] leading-relaxed text-zinc-400">
                  {firmwareSteps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <p className="mt-5 text-[13px] text-[#e5484d]">
                  Do not power off your dashcam until it begins continuous recording, as it may
                  cause permanent damage to the dashcam.
                </p>
              </>
            ) : (
              <p className="mt-4 text-[14px] leading-relaxed text-zinc-400">
                Download the latest {fwTab.toLowerCase()} for your GX4K from the FineVu support
                library, then follow the included guide.
              </p>
            )}
          </div>
        </div>
      </section>
      </div>
      )}

      {/* 20a–20b hidden per request (flip false → true to show) */}
      {false && (
      <>
      {/* 20a · HELP / QUICK LINKS — Figma 180:225 (#121214 band) --------- */}
      <section data-nav-theme="dark" className="bg-[#121214] py-14 md:py-20">
        <div className={SHELL}>
          <div className="mx-auto flex max-w-[900px] flex-col items-center justify-center gap-12 sm:flex-row sm:items-start sm:gap-16 md:gap-28">
            {helpLinks.map((it) => (
              <Link
                key={it.label}
                href={it.href}
                className="group flex w-full flex-col items-center text-center sm:w-[200px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.icon}
                  alt=""
                  aria-hidden
                  className={`h-[68px] w-[68px] md:h-[76px] md:w-[76px] ${it.flip ? "-scale-y-100" : ""}`}
                />
                <h3 className="mt-4 text-[20px] font-semibold text-white md:text-[22px]">{it.label}</h3>
                <span className="mt-3.5 text-[15px] font-medium text-[#a6a6a6] transition-colors group-hover:text-white">
                  Learn More &gt;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 20b · WARRANTY DISCLAIMER — Figma 180:226 (#0f0f0f, decimal list) */}
      <section data-nav-theme="dark" className="bg-[#0f0f0f] py-12 md:py-14">
        <div className={SHELL}>
          <ol className="mx-auto max-w-[1220px] list-decimal space-y-4 ps-5 text-[12px] font-medium leading-[18px] text-[#838383]">
            {warranty.map(([h, body]) => (
              <li key={h}>
                {h}
                <br />
                {body}
              </li>
            ))}
          </ol>
        </div>
      </section>
      </>
      )}

      <Footer />
    </main>
  );
}

/* Card for the "Every Detail" bento grid (title top, caption bottom). */
function BentoCardGridItem({
  card,
  className = "",
}: {
  card: { title: string; caption: string; img: string };
  className?: string;
}) {
  return (
    <motion.div
      {...fadeUp}
      className={`tile-hover relative overflow-hidden rounded-[22px] border border-white/[0.06] ${className}`}
    >
      {card.img ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.img} alt={card.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[#26262b]" />
      )}
      <p className="absolute inset-x-0 top-5 px-4 text-center text-[15px] md:text-[17px] font-semibold text-white">
        {card.title}
      </p>
      <p className="absolute inset-x-0 bottom-5 px-4 text-center text-[13px] text-white/70">
        {card.caption}
      </p>
    </motion.div>
  );
}

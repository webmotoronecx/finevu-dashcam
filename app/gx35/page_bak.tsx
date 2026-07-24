"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { OpticsSection } from "@/components/sections/OpticsSection";
import { BentoCard } from "@/components/sections/BentoCard";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

// FineVu GX35 product page — light alternating layout with real photography and grey placeholders per the Figma frame.

// Design tokens (Figma variables)
const SHELL = "mx-auto w-full max-w-[1180px] px-6 lg:px-8";
// Figma hex values inlined in classNames since Tailwind can't compile dynamic values
const BACKING = "#F7F7F7"; // Light-mode backing off-white
const BOX_GRAD = "linear-gradient(100deg, #1a1a1f 0%, #1a1a1f 30%, #f68428 100%)";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

// Section heading with an optional orange-highlighted word
function Head({
  pre = "",
  hi = "",
  post = "",
  className = "",
  as: Tag = "h2",
}: {
  pre?: string;
  hi?: string;
  post?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`font-semibold tracking-[-0.02em] leading-[1.08] text-[#1D1D1F] text-[30px] md:text-[42px] ${className}`}
    >
      {pre}
      {hi && <span className="text-[#f68428]">{hi}</span>}
      {post}
    </Tag>
  );
}

// Grey placeholder box for client-supplied footage or lifestyle stills
function ImgBlock({
  ratio = "aspect-[16/9]",
  label,
  className = "",
}: {
  ratio?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden rounded-[24px] bg-[#656565] ${ratio} ${className}`}>
      {label && (
        <span className="absolute inset-0 flex items-center justify-center px-8 text-center text-[13px] text-white/50">
          {label}
        </span>
      )}
    </div>
  );
}

// Full-bleed showcase divider: image with centered heading and subtitle
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
      <div className="relative h-[440px] md:h-[600px] w-full overflow-hidden">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[#656565]" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,12,0.55) 0%, rgba(8,8,12,0.12) 34%, rgba(8,8,12,0.18) 68%, rgba(8,8,12,0.7) 100%)",
          }}
        />
        <motion.div
          {...fadeUp}
          className="absolute inset-x-0 top-[16%] mx-auto max-w-[720px] px-6 text-center"
        >
          <h2 className="text-[28px] md:text-[44px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[14px] md:text-[17px] leading-[1.5] text-white/70">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Bento tile for the "More reasons" grid — image with a white label overlay
function BentoTile({
  img,
  label,
  sup,
  className = "",
  imgClass = "",
}: {
  img?: string;
  label: string;
  sup?: string;
  className?: string;
  imgClass?: string;
}) {
  return (
    <div className={`tile-hover relative overflow-hidden rounded-[32px] border border-[#ececf0] ${className}`}>
      {img ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={label} className={`absolute inset-0 h-full w-full object-cover ${imgClass}`} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <p className="absolute inset-x-0 bottom-6 px-4 text-center text-[16px] md:text-[22px] font-semibold text-white">
            {label}
            {sup && <sup className="ml-0.5 align-super text-[11px] font-medium md:text-[13px]">[{sup}]</sup>}
          </p>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[#656565]" />
          <p className="absolute inset-x-0 bottom-6 px-4 text-center text-[16px] md:text-[22px] font-semibold text-white">
            {label}
            {sup && <sup className="ml-0.5 align-super text-[11px] font-medium md:text-[13px]">[{sup}]</sup>}
          </p>
        </>
      )}
    </div>
  );
}

// Horizontal feature carousel — peek cards on a drag/prev/next track, with a fixed gutter beside the active card
type Card = { title: string; body: string; img?: string; note?: string };
function Carousel({
  pre,
  hi,
  post,
  sub,
  cards,
  alignEnd,
  pinGutter,
  gutterRight,
  imgAspect = "1047 / 562",
}: {
  pre?: string;
  hi?: string;
  post?: string;
  sub?: string;
  cards: Card[];
  alignEnd?: boolean;
  pinGutter?: boolean;
  gutterRight?: boolean;
  imgAspect?: string;
}) {
  const vpRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(0);
  const [range, setRange] = useState({ min: 0, max: 0, step: 1 });
  const [gutter, setGutter] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ x: 0, tx: 0, active: false, min: 0, max: 0, step: 1 });

  // On mobile, disable the right-gutter mirror so every carousel slides the same way
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const rightGutter = !!gutterRight && !isMobile;

  const measure = useCallback(() => {
    const vp = vpRef.current;
    const card = trackRef.current?.querySelector<HTMLElement>("[data-card]");
    if (!vp || !card) return null;
    const cardW = card.offsetWidth;
    const gap = 24;
    const step = cardW + gap;
    if (pinGutter) {
      // Fixed gutter: active card lands at a set spot; gutterRight mirrors it to the right with cards reversed
      const fullVw = document.documentElement.clientWidth;
      const g = Math.max(0, (fullVw - cardW) / 2);
      const span = (cards.length - 1) * step;
      setGutter(g);
      const r = rightGutter
        ? { min: fullVw - g - cardW - span, max: fullVw - g - cardW, step }
        : { min: -span, max: 0, step };
      setRange(r);
      return r;
    }
    const trackW = cards.length * cardW + (cards.length - 1) * gap;
    const vw = vp.clientWidth;
    const max = (vw - cardW) / 2;
    const min = Math.min(max, (vw + cardW) / 2 - trackW);
    const r = { min, max, step };
    setRange(r);
    return r;
  }, [cards.length, pinGutter, rightGutter]);

  const snap = useCallback(
    (rawTx: number, r: { min: number; max: number; step: number }) => {
      const i = Math.round((r.max - rawTx) / r.step);
      const clamped = Math.max(0, Math.min(cards.length - 1, i));
      setTx(Math.max(r.min, Math.min(r.max, r.max - clamped * r.step)));
    },
    [cards.length]
  );

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
      setTx(alignEnd || (pinGutter && rightGutter) ? r.min : r.max);
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
  }, [measure, alignEnd, pinGutter, rightGutter]);

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
      /* ignore */
    }
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const raw = d.tx + (e.clientX - d.x);
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

  // Right-gutter renders cards reversed, so prev/next direction and disabled-ends are mirrored
  const flip = !!(pinGutter && rightGutter);
  const displayCards = flip ? [...cards].reverse() : cards;
  const goPrev = () => stepBy(flip ? 1 : -1);
  const goNext = () => stepBy(flip ? -1 : 1);
  const prevOff = flip ? atEnd : atStart;
  const nextOff = flip ? atStart : atEnd;

  return (
    <section data-nav-theme="light" className="py-16 md:py-24">
      <div className={`${SHELL} mb-8 text-center md:mb-12`}>
        <Head pre={pre} hi={hi} post={post} className="!text-[26px] md:!text-[38px]" />
        {sub && <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-[1.6] text-[#6E6E73] md:text-[18px]">{sub}</p>}
      </div>
      <div
        ref={vpRef}
        className="overflow-hidden"
        style={{
          touchAction: "pan-y",
          marginLeft: pinGutter && !rightGutter ? gutter : undefined,
          marginRight: pinGutter && rightGutter ? gutter : undefined,
        }}
      >
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
          {displayCards.map((c) => (
            <motion.article
              key={c.title}
              data-card
              {...fadeUp}
              className="w-[80vw] shrink-0 md:w-[62vw] lg:w-[min(48vw,1040px)]"
            >
              {c.img ? (
                <div
                  className="tile-scale relative overflow-hidden rounded-[22px]"
                  style={{ aspectRatio: imgAspect }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.title} draggable={false} className="h-full w-full object-cover" />
                </div>
              ) : (
                // solid #656565 — matches the Figma placeholder cards
                <div className="rounded-[22px] bg-[#656565]" style={{ aspectRatio: imgAspect }} />
              )}
              <h3 className="mt-6 text-[22px] md:text-2xl font-semibold text-[#1D1D1F]">{c.title}</h3>
              <p className="mt-3 max-w-[540px] text-[14px] md:text-[16px] leading-[1.6] text-[#6E6E73]">{c.body}</p>
              {c.note && (
                <p className="mt-3 max-w-[540px] text-[12px] font-medium leading-[1.6] text-[#9aa0ad]">{c.note}</p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
      {/* Nav row — pinGutter aligns the arrows to the featured card's right edge. */}
      <div
        className={`mt-2 flex items-center justify-end gap-3 ${pinGutter ? "" : SHELL}`}
        style={pinGutter ? { marginRight: gutter } : undefined}
      >
        <button
          onClick={goPrev}
          disabled={prevOff}
          aria-label="Previous"
          className="cta-hover flex h-11 w-11 items-center justify-center rounded-full border border-[#dcdce0] text-[#6E6E73] hover:text-[#1D1D1F] disabled:cursor-default disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goNext}
          disabled={nextOff}
          aria-label="Next"
          className="cta-hover flex h-11 w-11 items-center justify-center rounded-full border border-[#dcdce0] text-[#6E6E73] hover:text-[#1D1D1F] disabled:cursor-default disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

// Data

// "Every detail" bento; the field-of-view tile stays a placeholder until the client supplies that shot
const featureTiles = [
  { title: "2560 × 1440 QHD Front Camera", caption: "Every pixel captured", img: "/gx35/detail-front.webp" },
  { title: "Sony STARVIS 2 IMX675", caption: "5.12MP F/1.8", img: "/gx35/detail-starvis.webp" },
  { title: "Auto Night Vision", caption: "AI-controlled, always-on HDR mode", img: "/gx35/detail-night.webp" },
  { title: "Ai Heat Monitoring", caption: "Auto power-save if temps spike", img: "/gx35/detail-heat.webp" },
  { title: "147° / 143° Field of View", caption: "Front & Rear", img: "" },
];

// Optics callouts in front to core to rear order, matching the pinned reveal timing
const opticsCallouts = [
  {
    key: "front",
    title: "Front",
    sub: "QHD wide",
    items: ["SONY STARVIS 2 IMX675", "5.12 MP sensor", "2560 × 1440 (2K QHD)", "147° field of view"],
  },
  {
    key: "core",
    title: "Core",
    sub: "Dual-core engine",
    items: ["Dual-core processor", "Allwinner V536 processor", "microSD up to 256 GB", "Format Free 2.0"],
  },
  {
    key: "rear",
    title: "Rear",
    sub: "Full-HD wide",
    items: ["2 MP CMOS sensor", "1920 × 1080 (Full HD)", "143° field of view", "23 g compact module"],
  },
];

const cSeeDetail: Card[] = [
  {
    title: "True 2K Quad HD",
    body: "Front records in 2560×1440 QHD, rear in Full HD 1080p. Number plates, road signs and faces stay sharp enough to actually hold up as evidence.",
    img: "/gx4k/see-uhd.webp",
  },
  {
    title: "Sony STARVIS 2 Sensor",
    body: "The 5.12MP Sony STARVIS 2 IMX675 is a full generation newer, with sharper low-light detail and 30% less power draw than the sensor before it.",
    img: "/gx4k/see-sensor.webp",
  },
  {
    title: "AI Auto Night Vision",
    body: "Smart AI reads the light around you and adjusts brightness and contrast on its own — clear night footage with nothing to switch on.",
    img: "/gx4k/card-night.webp",
  },
];

const cParked: Card[] = [
  {
    title: "Power Saving Parking Mode",
    body: "Prolonged recording time. Consuming 98% less power, GX35 records 13,950 more hours than standard parking mode.",
    img: "/gx4k/parking.webp",
  },
  {
    title: "Smart Time-Lapse",
    body: "Records at 10fps while parked, then jumps to 30fps the instant something happens — up to 743 minutes of coverage without filling the card.",
  },
  {
    title: "AI Heat Monitoring",
    body: "Built-in temperature sensing powers the camera down before heat becomes a risk — protection made for hot climates and long summer parks.",
  },
  {
    title: "20-Second Impact Capture",
    body: "Every impact saves the 10 seconds before and 10 seconds after — front and rear — so the full scene is locked in, not just the moment of contact.",
    img: "/gx4k/impact.webp",
  },
];

const cSafer: Card[] = [
  {
    title: "ADAS Plus Driver Assistance",
    body: "Forward Vehicle Moving Alert (FVMA) and Lane Departure Warning (LDWS) keep you sharp, with a nudge when the car ahead pulls away or you drift lanes.",
  },
  {
    title: "Speed Camera Alert",
    body: "Quarterly safety-camera database updates with voice and visual alerts. Fewer surprises, fewer tickets. Requires GPS reception.",
  },
];

const cStorage: Card[] = [
  {
    title: "Format Free 2.0",
    body: "Format Free 2.0 ends manual card reformatting for good, extending your memory card's lifespan and keeping recording reliable, drive after drive.",
  },
  {
    title: "Memory Allocation",
    body: "Split storage to match how you drive, with Driving, Event, Parking or Driving-Only priority, so the card fills with the footage you actually need.",
  },
];

const cConnected: Card[] = [
  {
    title: "FineVu App",
    body: "View live video, download clips, change settings and update firmware right from your phone. Android and iOS, plus FineVu Player 2.0 on desktop.",
  },
  {
    title: "5GHz Wi-Fi",
    body: "Fast dual-band Wi-Fi streams live footage to your phone and pulls clips straight off the camera. No removing the SD card.",
  },
  {
    title: "Built-in GPS",
    body: "Records speed, location and route. Every clip stamped with exactly where and how fast you were going.",
  },
];

const cBuilt: Card[] = [
  {
    title: "Supercapacitor, Not Battery",
    body: "A supercapacitor replaces the traditional battery for better heat tolerance and a longer service life. Engineered for reliability, not shortcuts.",
  },
  {
    title: "Built In-House",
    body: "FineVu builds in-house, not in generic factories, with quality control tight enough to keep defects below 0.2%. That's reliability you can count on.",
  },
  {
    title: "Battery Protection Integrated",
    body: "Low-voltage cut-off powers the camera down before your car battery runs flat. Set your vehicle's profile in the FineVu app with a single tap.",
    note: "* FineVu recommends changing the low voltage settings to ‘hybrid’ when using the ISG system.",
  },
];

// "Designed to disappear" interactive tabs
const disappearTabs = [
  {
    title: "Screen-Free by Design",
    body: "No LCD, no glare, no distraction. Just subtle status lights that let you know it's recording, keeping your attention where it belongs, on the road.",
  },
  {
    title: "Disappears Behind the Mirror",
    body: "At just 74mm wide and 76g, the front unit is smaller than a standard business card and tucks neatly behind your rear-view mirror. The rear camera is smaller still at only 23g.",
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

const specRows: [string, string][] = [
  ["Front camera", "SONY STARVIS 2 IMX675 · 5.12 MP · 2560 × 1440 (Quad HD) · 147.4° FOV"],
  ["Rear camera", "2.13 MP CMOS · 1920 × 1080 (Full HD) · 143.2° FOV"],
  ["Processor", "Dual-core"],
  ["Night vision", "HDR + Auto Night Vision with AI light-environment adjustment"],
  ["Recording modes", "Continuous · Impact · Emergency · Parking (motion + impact) · Smart Time-Lapse"],
  ["Parking mode", "Power Saving Parking — up to 98% less power · 20-sec event capture with 10-sec pre-buffer"],
  ["Driver assistance", "ADAS Plus — FVMA (front vehicle motion alert) · LDWS (lane departure)"],
  ["Connectivity", "Built-in Wi-Fi · External GPS · FineVu Wi-Fi App"],
  ["Storage", "microSD up to 256 GB · Format Free 2.0 · Memory allocation"],
  ["Protection", "Low voltage cut-off · G-sensor · AI heat monitoring · Supercapacitor"],
  ["Safety database", "Speed camera alerts, GPS-supported"],
];

const boxItems = [
  "Front Camera",
  "Rear Camera",
  "Power Cable",
  "Rear Cable",
  "User Manual",
  "MicroSD Card & Adapter",
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

// Component

export default function GX35Page() {
  const [fwTab, setFwTab] = useState<"Firmware" | "User Manual" | "Speed Cam Data">("Firmware");
  const [dtd, setDtd] = useState(0);

  return (
    <main className="overflow-x-clip bg-white">
      {/* Hero */}
      <section
        data-nav-theme="light"
        className="relative min-h-[600px] sm:min-h-[720px] lg:min-h-[820px] bg-[#eceef0] bg-cover bg-center"
        style={{ backgroundImage: "url(/products/gx35-hero-scene.jpg)" }}
      >
        {/* Legibility scrim keeping the light hero copy readable, stronger on mobile */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[600px] sm:h-[560px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(236,238,240,0.94) 0%, rgba(236,238,240,0.86) 40%, rgba(236,238,240,0.6) 66%, rgba(236,238,240,0) 100%)",
          }}
        />
        <motion.div
          className="relative z-10 mx-auto w-full max-w-[840px] px-6 pt-[150px] text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.24em] text-[#6E6E73]">
            FineVu GX35 · 2-Channel QHD
          </p>
          <h1 className="mt-4 text-[2.5rem] sm:text-6xl lg:text-[72px] font-semibold leading-[1.04] tracking-[-0.02em]">
            <span className="text-[#f68428]">Perfectly Compact.</span>
            <br />
            <span className="text-[#1D1D1F]">In Sharp QHD.</span>
          </h1>
          <p className="mt-6 mx-auto max-w-full sm:max-w-[520px] text-[18px] leading-[1.55] text-[#6E6E73]">
            2K QHD clarity and Sony&apos;s newest STARVIS 2 sensor, in a body smaller than a business
            card.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/retailers"
              className="cta-hover inline-flex h-12 items-center justify-center rounded-full bg-[#f68428] px-9 text-[14px] font-semibold uppercase leading-[20px] text-white"
            >
              Find a Retailer
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Every detail feature bento */}
      <section data-nav-theme="light" className="bg-white py-20 md:py-28">
        <motion.div {...fadeUp} className={`${SHELL} mb-12 text-center md:mb-16`}>
          <Head pre="Every detail. " hi="In Sharp QHD." className="!text-[30px] md:!text-[46px]" />
          <p className="mx-auto mt-5 max-w-[560px] text-[18px] leading-[1.6] text-[#6E6E73]">
            2K QHD at 30fps across two channels — licence plates, road signs, and low-light
            intersections rendered with uncompromised clarity.
          </p>
        </motion.div>

        <div className={`${SHELL} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12`}>
          <BentoCard
            theme="light"
            {...featureTiles[0]}
            className="lg:col-span-7 lg:row-span-2 aspect-[16/10] lg:aspect-auto lg:min-h-[520px]"
          />
          <BentoCard theme="light" {...featureTiles[1]} className="lg:col-span-5 aspect-[16/9]" />
          <BentoCard theme="light" {...featureTiles[2]} className="lg:col-span-5 aspect-[16/9]" />
          <BentoCard
            theme="light"
            {...featureTiles[3]}
            className="lg:col-span-5 aspect-[16/9] lg:aspect-auto lg:min-h-[300px]"
          />
          <BentoCard
            theme="light"
            {...featureTiles[4]}
            className="lg:col-span-7 aspect-[16/9] lg:aspect-auto lg:min-h-[300px]"
          />
        </div>
      </section>

      {/* Optics pinned scroll-reveal */}
      <OpticsSection
        theme="light"
        image="/gx35/optics.webp"
        stageAspect="2160 / 1484"
        lineViewBox="0 0 2160 1484"
        overlayPos={{
          front: "left-[64%] top-[30%]",
          core: "left-[25%] top-[62%]",
          rear: "left-[53%] top-[68%]",
        }}
        lines={{
          front: { x1: 1120, y1: 665, x2: 1385, y2: 560 },
          core: { x1: 905, y1: 795, x2: 700, y2: 930 },
          rear: { x1: 1150, y1: 930, x2: 1165, y2: 1010 },
        }}
        head={{
          title: "The Optics Behind the Image.",
          subtitle:
            "Sony STARVIS 2 IMX675. A next-generation 5.12-megapixel sensor paired with F/1.8 wide-aperture glass, drawing 30% less power than the previous STARVIS while lifting low-light clarity.",
        }}
        callouts={opticsCallouts}
      />

      {/* In Sharp QHD showcase */}
      <Showcase
        title="In Sharp QHD."
        subtitle="2560 × 1440 across the front channel — plates, faces and signage rendered with clarity."
      />

      {/* See Every Detail carousel */}
      <Carousel pre="See Every " hi="Detail" cards={cSeeDetail} pinGutter />

      {/* Protected While Parked carousel */}
      <Carousel hi="Protected" post=" While Parked" cards={cParked} pinGutter gutterRight />

      {/* A Second Set of Eyes showcase (ADAS) */}
      <Showcase
        title="A Second Set of Eyes."
        subtitle="ADAS Plus watches the road with you, and speaks up before you need to."
      />

      {/* Smarter, Safer Driving carousel */}
      <Carousel pre="Smarter, " hi="Safer Driving" cards={cSafer} pinGutter />

      {/* Built to Last carousel */}
      <Carousel pre="Built to Last" cards={cBuilt} pinGutter gutterRight />

      {/* Storage That Manages Itself carousel */}
      <Carousel pre="Storage That Manages Itself" cards={cStorage} pinGutter />

      {/* Your Dashcam in Your Hand showcase (app) */}
      <Showcase
        title="Your Dashcam. In Your Hand."
        subtitle="Live view, instant downloads and settings, all from your phone. No cables, no card removal."
      />

      {/* Connected in Your Pocket carousel */}
      <Carousel hi="Connected" post=" in Your Pocket" cards={cConnected} pinGutter gutterRight />

      {/* Discreet by Design showcase */}
      <Showcase
        title="Discreet by Design."
        subtitle="A screen-free, wedge-shaped body that tucks behind your mirror and out of your mind."
      />

      {/* Designed to Disappear tabs and detail gallery */}
      <section data-nav-theme="light" className="bg-white py-20 md:py-28">
        <motion.div {...fadeUp} className={`${SHELL} mb-8 text-center md:mb-12`}>
          <Head pre="Designed to Disappear" className="!text-[28px] md:!text-[42px]" />
        </motion.div>

        <div className={SHELL}>
          {/* Banner placeholder for the hidden-behind-mirror still */}
          <motion.div {...fadeUp} className="aspect-[1297/562] w-full rounded-[32px] bg-[#656565]" />

          {/* Tab selector — active tab is an orange-gradient pill, scrolls on mobile */}
          <div className="mt-8 overflow-x-auto px-6 pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto flex w-max items-center rounded-full bg-[#e6e6e6]">
              {disappearTabs.map((t, i) => (
                <button
                  key={t.title}
                  onClick={() => setDtd(i)}
                  aria-pressed={dtd === i}
                  className={`cta-hover shrink-0 whitespace-nowrap rounded-full px-6 py-3.5 text-[13px] transition-colors ${
                    dtd === i ? "font-semibold text-white" : "font-medium text-[#6b6b6b] hover:text-[#1D1D1F]"
                  }`}
                  style={
                    dtd === i
                      ? { backgroundImage: "linear-gradient(167deg, #ffb682 0%, #f68428 65%, #f68428 100%)" }
                      : undefined
                  }
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
            className="mx-auto mt-7 max-w-[660px] text-center text-[15px] leading-[1.6] text-[#6E6E73] md:text-[18px]"
          >
            {disappearTabs[dtd].body}
          </motion.p>
        </div>

        {/* Small in size, rich in detail macro gallery */}
        <motion.div {...fadeUp} className={`${SHELL} mb-8 mt-16 text-center md:mb-12 md:mt-24`}>
          <Head pre="Small in size. " hi="Rich in detail." className="!text-[26px] md:!text-[40px]" />
        </motion.div>
        <div className={`${SHELL} space-y-4`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[746fr_527fr]">
            <motion.div
              {...fadeUp}
              className="tile-hover relative aspect-[746/562] overflow-hidden rounded-[32px] border border-[#ececf0]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gx35/detail-lens.webp"
                alt="Close-up of the GX35 front camera lens"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              {...fadeUp}
              className="tile-hover relative aspect-[527/562] overflow-hidden rounded-[32px] border border-[#ececf0]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gx35/detail-logo.webp"
                alt="FineVu logo on the machined GX35 body"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
          </div>
          <motion.div
            {...fadeUp}
            className="tile-hover relative aspect-[1297/427] overflow-hidden rounded-[32px] border border-[#ececf0]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gx35/detail-full.webp"
              alt="FineVu GX35 front unit"
              className="absolute inset-0 h-full w-full object-cover object-[50%_55%]"
            />
          </motion.div>
        </div>
      </section>

      {/* More Reasons to Choose FineVu bento */}
      <section data-nav-theme="light" className="py-16 md:py-24" style={{ background: BACKING }}>
        <motion.div {...fadeUp} className={`${SHELL} mb-8 text-center md:mb-12`}>
          <Head pre="More reasons to choose FineVu." className="!text-[26px] md:!text-[40px]" />
        </motion.div>
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
            <BentoTile img="/gx4k/microsd.webp" label="Includes 64GB MicroSD Card" sup="2" className="aspect-[640/400]" />
            <BentoTile img="/gx4k/cables.webp" label="Includes Hardwire Kit & Power Cable" sup="3" className="aspect-[640/400]" />
          </div>
        </div>
      </section>

      {/* Leave the Wiring to the Experts install */}
      <section data-nav-theme="light" className="bg-white py-16 md:py-24">
        <div className={`${SHELL} text-center`}>
          <motion.div {...fadeUp}>
            <Head pre="Leave the Wiring to the Experts." className="!text-[28px] md:!text-[42px]" />
          </motion.div>
          <motion.div {...fadeUp} className="mt-10 overflow-hidden rounded-[28px] border border-[#ececf0]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gx4k/wiring-experts.webp"
              alt="FineVu certified installer arriving on-site"
              className="h-[280px] w-full object-cover md:h-[520px]"
            />
          </motion.div>
          <p className="mx-auto mt-8 max-w-[620px] text-[18px] leading-[1.6] text-[#6E6E73]">
            The GX35 records straight out of the box, but full-time parking protection means
            hardwiring it properly into your fuse box. Our certified installers fit it cleanly, hide
            every cable and set it up right the first time.
          </p>
          <Link
            href="/installation"
            className="cta-hover mt-8 inline-flex items-center justify-center rounded-full bg-[#f68428] px-10 py-3.5 text-sm font-semibold uppercase leading-[20px] text-white"
          >
            Book Installation
          </Link>
        </div>
      </section>

      {/* Full Specifications */}
      <section data-nav-theme="light" className="py-16 md:py-24" style={{ background: BACKING }}>
        <div className={SHELL}>
          <motion.div {...fadeUp} className="mb-10 text-center">
            <Head pre="Full Specifications" className="!text-[28px] md:!text-[40px]" />
          </motion.div>
          <div className="mx-auto max-w-[900px] border-t border-[#e3e3e6]">
            {specRows.map(([label, value], i) => (
              <motion.div
                key={label}
                {...fadeUp}
                transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
                className="grid grid-cols-1 gap-2 border-b border-[#e3e3e6] py-5 md:grid-cols-[260px_1fr] md:gap-8"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f68428]">{label}</p>
                <p className="text-[15px] leading-[1.5] text-[#44495a]">{value}</p>
              </motion.div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-[900px] text-xs text-[#9aa0ad]">
            Specifications compiled from FineVu published materials — confirm final figures against
            the official GX35 spec sheet before publishing.
          </p>
        </div>
      </section>

      {/* What's in the Box */}
      <section data-nav-theme="light" className="bg-white py-16 md:py-24">
        <div className={`${SHELL} text-center`}>
          <motion.div {...fadeUp}>
            <Head pre="What’s in The Box?" className="!text-[28px] md:!text-[40px]" />
          </motion.div>
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
          <motion.div {...fadeUp} className="mt-10 md:mt-12">
            <ImgBlock ratio="aspect-[1300/519]" label="GX35 box contents — front & rear cameras, cables, mount, MicroSD card and manual" />
          </motion.div>
        </div>
      </section>

      {/* FineVu Series Comparison */}
      <section data-nav-theme="light" className="py-16 md:py-24" style={{ background: BACKING }}>
        <div className={SHELL}>
          <motion.div
            {...fadeUp}
            className="mx-auto max-w-[992px] rounded-[32px] bg-white px-5 py-10 shadow-[0_20px_60px_rgba(20,22,40,0.08)] sm:px-10 md:rounded-[46px] md:px-14 md:py-16"
          >
            <div className="text-center">
              <Head pre="FineVu Series Comparison" className="!text-[26px] md:!text-[40px]" />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-8 md:mt-12">
              {/* GX4K */}
              <div className="flex h-full flex-col items-center text-center">
                <div className="h-[34px]" />
                <h3 className="mt-4 text-[24px] font-bold text-[#1D1D1F] sm:text-[28px] md:text-[32px]">GX4K</h3>
                <p className="mx-auto mt-3 max-w-[320px] text-[13px] leading-[1.6] text-[#6E6E73] sm:text-[15px]">
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
                <Link
                  href="/gx4k"
                  className="cta-hover inline-flex whitespace-nowrap rounded-full bg-[#f68428] px-6 py-3 text-[14px] font-semibold uppercase leading-[20px] text-white sm:px-9 md:px-11 md:py-3.5"
                >
                  Learn More
                </Link>
              </div>
              {/* GX35 — currently viewing */}
              <div className="flex h-full flex-col items-center text-center">
                <div className="flex h-[34px] items-center">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#f68428]/60 px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#f68428] sm:px-3.5 sm:text-[12px]">
                    <Eye className="h-3.5 w-3.5" /> Currently Viewing
                  </span>
                </div>
                <h3 className="mt-4 text-[24px] font-bold text-[#1D1D1F] sm:text-[28px] md:text-[32px]">GX35</h3>
                <p className="mx-auto mt-3 max-w-[320px] text-[13px] leading-[1.6] text-[#6E6E73] sm:text-[15px]">
                  Record every moment in 2K. Premium FineVu protection and features at a more
                  accessible price point — the same trusted engineering.
                </p>
                <div className="flex flex-1 items-center justify-center py-6 md:py-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/gx4k/compare-gx35.webp"
                    alt="FineVu GX35"
                    className="h-auto max-h-[130px] w-auto max-w-full object-contain md:max-h-[180px]"
                  />
                </div>
                <Link
                  href="/gx35"
                  className="cta-hover inline-flex whitespace-nowrap rounded-full bg-[#f68428] px-6 py-3 text-[14px] font-semibold uppercase leading-[20px] text-white sm:px-9 md:px-11 md:py-3.5"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="mt-10 border-t border-[#e3e3e6] md:mt-12">
              {compareRows.map(([label, a, b]) => (
                <div key={label} className="grid grid-cols-2 gap-4 py-4 text-center sm:gap-8">
                  <div>
                    <p className="text-[11px] text-[#9aa0ad] sm:text-[12px]">{label}</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#1D1D1F] sm:text-[16px]">{a}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#9aa0ad] sm:text-[12px]">{label}</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#1D1D1F] sm:text-[16px]">{b}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Firmware / Downloads */}
      <section data-nav-theme="light" className="bg-white py-16 md:py-24">
        <div className={`${SHELL} max-w-[820px]`}>
          <div className="mx-auto flex w-full max-w-[440px] rounded-full border border-[#e3e3e6] p-1">
            {(["Firmware", "User Manual", "Speed Cam Data"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFwTab(t)}
                className={`flex min-h-[44px] flex-1 items-center justify-center rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                  fwTab === t ? "bg-[#f68428] text-white" : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-semibold text-[#1D1D1F]">Instructions</h3>
            {fwTab === "Firmware" ? (
              <>
                <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-[14px] leading-relaxed text-[#6E6E73]">
                  {firmwareSteps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <p className="mt-5 text-[13px] text-[#e5484d]">
                  Do not power off your dashcam until it begins continuous recording, as it may cause
                  permanent damage to the dashcam.
                </p>
              </>
            ) : (
              <p className="mt-4 text-[14px] leading-relaxed text-[#6E6E73]">
                Download the latest {fwTab.toLowerCase()} for your GX35 from the FineVu support
                library, then follow the included guide.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Help / quick links — Where to buy, Install, Support */}
      <LearnMoreLinks />

      {/* Warranty disclaimer */}
      <section data-nav-theme="light" className="py-12 md:py-14" style={{ background: BACKING }}>
        <div className={SHELL}>
          <ol className="mx-auto max-w-[1220px] list-decimal space-y-4 ps-5 text-[12px] font-medium leading-[18px] text-[#9aa0ad]">
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

      {/* CTA + footer band (shared component matches the frame's closing) */}
      <Footer />
    </main>
  );
}

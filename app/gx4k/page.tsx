"use client";

import { Footer } from "@/components/Footer";
import { motion } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

/* ============================================================================
   FineVu GX4K — premium product page
   Full rebuild of Figma frame 102:2004 (FineVu Website Wireframe).
   Dark cinematic layout, real frame imagery in public/gx4k/*.
   ========================================================================== */

const SHELL = "mx-auto w-full max-w-[1280px] px-6 lg:px-10";
const HEAD_GRAD = "linear-gradient(90deg, #8ea6f0 0%, #b79ce2 100%)";
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

/* Horizontal feature carousel with prev/next controls. */
type Card = { title: string; body: string; img?: string };
function Carousel({
  pre,
  grad,
  post,
  cards,
  note,
}: {
  pre?: string;
  grad?: string;
  post?: string;
  cards: Card[];
  note?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const by = (d: number) =>
    ref.current?.scrollBy({ left: d * 620, behavior: "smooth" });
  return (
    <section data-nav-theme="dark" className="py-16 md:py-24">
      <div className={`${SHELL} mb-8 md:mb-12 text-center`}>
        <Head pre={pre} grad={grad} post={post} className="!text-[26px] md:!text-[38px]" />
      </div>
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-6 px-6 pb-4 lg:scroll-pl-10 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((c) => (
          <motion.article
            key={c.title}
            {...fadeUp}
            className="w-[86vw] max-w-[600px] shrink-0 snap-start"
          >
            {c.img ? (
              <div className="tile-hover relative aspect-[73/50] overflow-hidden rounded-[22px] border border-white/[0.06]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.title} className="h-full w-full object-cover" />
              </div>
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
      <div className={`${SHELL} mt-2 flex items-center justify-end gap-3`}>
        {note && (
          <p className="mr-auto max-w-[560px] text-left text-[12px] text-zinc-600">{note}</p>
        )}
        <button
          onClick={() => by(-1)}
          aria-label="Previous"
          className="cta-hover flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => by(1)}
          aria-label="Next"
          className="cta-hover flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 hover:text-white"
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
}: {
  img: string;
  label: string;
  sup?: string;
  className?: string;
}) {
  return (
    <div className={`tile-hover relative overflow-hidden rounded-[20px] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={label} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <p className="absolute inset-x-0 bottom-5 px-4 text-center text-[15px] md:text-[17px] font-semibold text-white">
        {label}
        {sup && <sup className="ml-0.5 text-[10px] font-medium">[{sup}]</sup>}
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

const opticsCols = [
  { title: "Front", sub: "UHD wide", items: ["SONY STARVIS IMX515", "8.5 MP sensor", "3840 × 2160 (4K UHD)", "136° field of view"] },
  { title: "Core", sub: "Dual-core engine", items: ["Dual-core processor", "HDR auto night vision", "microSD up to 256 GB", "Format Free 2.0"] },
  { title: "Rear", sub: "Full-HD wide", items: ["2 MP CMOS sensor", "1920 × 1080 (Full HD)", "143° field of view", "23 g compact module"] },
];

const cSeeDetail: Card[] = [
  { title: "True 4K Ultra HD", body: "Front records in 3840×2160 UHD, rear in Full HD 1080p. Number plates, road signs and faces stay sharp enough to actually hold up as evidence.", img: "/gx4k/card-uhd.webp" },
  { title: "AI Auto Night Vision", body: "Smart AI reads the light around you and adjusts brightness and contrast on its own — clear night footage with nothing to switch on.", img: "/gx4k/card-night.webp" },
  { title: "Sony STARVIS Sensor", body: "The 8.5MP Sony STARVIS IMX515 delivers vivid, low-noise footage with the dynamic range to handle harsh glare and deep shadow alike.", img: "/gx4k/card-sensor.webp" },
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

/* ------------------------------------------------------------- component -- */

export default function GX4KPage() {
  const [fwTab, setFwTab] = useState<"Firmware" | "User Manual" | "Speed Cam Data">("Firmware");
  const [dtd, setDtd] = useState(0);

  return (
    <main className="overflow-hidden bg-[#08080c]">
      {/* 1 · HERO ---------------------------------------------------------- */}
      <section
        data-nav-theme="dark"
        className="relative min-h-[760px] lg:min-h-[900px] flex items-start justify-center overflow-hidden bg-black"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gx4k/hero-bg.png"
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

      {/* 3 · THE OPTICS BEHIND THE IMAGE. --------------------------------- */}
      <section data-nav-theme="dark" className="py-16 md:py-24">
        <motion.div {...fadeUp} className={`${SHELL} text-center`}>
          <Head pre="The Optics Behind the Image." className="!text-[28px] md:!text-[42px]" />
          <p className={`mx-auto mt-5 max-w-[560px] ${BODY} text-center`}>
            Sony STARVIS IMX515. A precision-engineered 8.5-megapixel sensor paired with F/1.8
            wide-aperture glass, made to perform when it matters most.
          </p>
        </motion.div>

        <div className={`${SHELL} relative mt-10 md:mt-16`}>
          <motion.div {...fadeUp} className="relative overflow-hidden rounded-[28px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gx4k/optics.webp" alt="GX4K front and rear cameras" className="w-full object-cover" />
          </motion.div>
          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
            {opticsCols.map((col, i) => (
              <motion.div key={col.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <h3 className="text-2xl font-bold text-white">{col.title}</h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6e8fe6]">{col.sub}</p>
                <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  {col.items.map((it) => (
                    <li key={it} className="text-sm text-zinc-400">{it}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · SEE EVERY DETAIL carousel ------------------------------------ */}
      <Carousel pre="See Every " grad="Detail" cards={cSeeDetail} />

      {/* 5 · PROTECTED WHILE PARKED carousel ------------------------------ */}
      <Carousel grad="Protected" post=" While Parked" cards={cParked} />

      {/* 6 · A SECOND SET OF EYES. showcase ------------------------------- */}
      <Showcase title="A Second Set of Eyes." subtitle="ADAS Plus watches the road with you, and speaks up before you need to." />

      {/* 7 · SMARTER, SAFER DRIVING carousel ------------------------------ */}
      <Carousel pre="Smarter, " grad="Safer Driving" cards={cSafer} />

      {/* 8 · BUILT TO LAST carousel --------------------------------------- */}
      <Carousel
        pre="Built to Last"
        cards={cBuilt}
        note="* FineVu recommends changing the low voltage settings to ‘hybrid’ when using the ISG system."
      />

      {/* 9 · STORAGE THAT MANAGES ITSELF carousel ------------------------- */}
      <Carousel pre="Storage That Manages Itself" cards={cStorage} />

      {/* 10 · YOUR DASHCAM. IN YOUR HAND. showcase ------------------------ */}
      <Showcase title="Your Dashcam. In Your Hand." subtitle="Live view, instant downloads and settings, all from your phone. No cables, no card removal." />

      {/* 11 · CONNECTED IN YOUR POCKET carousel --------------------------- */}
      <Carousel grad="Connected" post=" in Your Pocket" cards={cConnected} />

      {/* 12 · DISCREET BY DESIGN. showcase -------------------------------- */}
      <Showcase img="/gx4k/discreet.webp" title="Discreet by Design." subtitle="A screen-free, wedge-shaped body that tucks behind your mirror and out of your mind." />

      {/* 13 · DESIGNED TO DISAPPEAR (banner + interactive tabs) ------------ */}
      <section data-nav-theme="dark" className="py-20 md:py-28">
        <motion.div {...fadeUp} className={`${SHELL} mb-8 text-center md:mb-12`}>
          <Head pre="Designed to Disappear" className="!text-[28px] md:!text-[42px]" />
        </motion.div>

        <div className={SHELL}>
          {/* Banner */}
          <motion.div {...fadeUp} className="overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0d0d14]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gx4k/optics.webp"
              alt="FineVu GX4K, screen-free wedge design"
              className="h-[240px] w-full object-cover md:h-[520px]"
            />
          </motion.div>

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
      <section data-nav-theme="dark" className="py-16 md:py-24">
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

      {/* 14 · REASONS / INCLUDES bento ------------------------------------ */}
      <section data-nav-theme="dark" className="py-16 md:py-24">
        <motion.div {...fadeUp} className={`${SHELL} mb-8 text-center md:mb-12`}>
          <Head pre="More reasons to choose FineVu." className="!text-[26px] md:!text-[40px]" />
        </motion.div>
        <div className={`${SHELL} grid grid-cols-1 gap-4 sm:grid-cols-2`}>
          <BentoTile img="/gx4k/no1.webp" label="No.1 Dash Cam in Korea" className="aspect-[16/10]" />
          <BentoTile img="/gx4k/warranty3.webp" label="3 Year Warranty" sup="1" className="aspect-[16/10]" />
          <BentoTile img="/gx4k/microsd.webp" label="Includes 128GB MicroSD Card" sup="2" className="aspect-[16/10]" />
          <BentoTile img="/gx4k/cables.webp" label="Includes Hardwire Kit & Power Cable" sup="3" className="aspect-[16/10]" />
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
            <img src="/gx4k/install.webp" alt="FineVu certified installer" className="h-[280px] w-full object-cover md:h-[520px]" />
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
          <div className="mx-auto mt-8 grid max-w-[720px] grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-3">
            {boxItems.map((it) => (
              <TwoTone key={it} text={it} className="text-[15px] md:text-[17px] font-semibold" />
            ))}
          </div>
          <motion.div {...fadeUp} className="mt-10 overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0d0d14]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gx4k/box.webp" alt="FineVu GX4K box contents" className="mx-auto max-h-[520px] w-auto object-contain" />
          </motion.div>
        </div>
      </section>

      {/* 18 · FINEVU SERIES COMPARISON ------------------------------------ */}
      <section data-nav-theme="dark" className="py-16 md:py-24">
        <div className={SHELL}>
          <motion.div {...fadeUp} className="mb-10 text-center">
            <Head pre="FineVu Series Comparison" className="!text-[28px] md:!text-[40px]" />
          </motion.div>

          <div className="mx-auto max-w-[900px] rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-6 md:p-10">
            <div className="grid grid-cols-2 gap-6">
              {/* GX4K */}
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f68428]/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#f68428]">
                  <Eye className="h-3.5 w-3.5" /> Currently Viewing
                </span>
                <h3 className="mt-4 text-2xl font-bold text-white md:text-3xl">GX4K</h3>
                <p className="mx-auto mt-3 max-w-[280px] text-[13px] leading-relaxed text-zinc-400">
                  Crystal clear 4K recording for every drive. True 4K Ultra HD captures licence
                  plates and street signs with SONY STARVIS clarity.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/gx4k/compare-gx4k.webp" alt="GX4K" className="mx-auto my-6 h-[150px] w-auto object-contain md:h-[200px]" />
                <Link href="/gx4k" className="cta-hover inline-flex rounded-full bg-[#f68428] px-8 py-3 text-[13px] font-semibold uppercase tracking-wide text-white">
                  Learn More
                </Link>
              </div>
              {/* GX35 */}
              <div className="text-center">
                <span className="inline-block h-[26px]" />
                <h3 className="mt-4 text-2xl font-bold text-white md:text-3xl">GX35</h3>
                <p className="mx-auto mt-3 max-w-[280px] text-[13px] leading-relaxed text-zinc-400">
                  Record every moment in 2K. Premium FineVu protection and features at a more
                  accessible price point — the same trusted engineering.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/products/gx35-studio.jpg" alt="GX35" className="mx-auto my-6 h-[150px] w-auto object-contain md:h-[200px]" />
                <Link href="/gx35" className="cta-hover inline-flex rounded-full bg-[#f68428] px-8 py-3 text-[13px] font-semibold uppercase tracking-wide text-white">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10">
              {compareRows.map(([label, a, b]) => (
                <div key={label} className="grid grid-cols-2 gap-6 border-b border-white/10 py-4 text-center">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
                    <p className="mt-1 text-[15px] font-semibold text-white">{a}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
                    <p className="mt-1 text-[15px] font-semibold text-white">{b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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

      {/* 20 · WARRANTY DISCLAIMER ----------------------------------------- */}
      <section data-nav-theme="dark" className="pb-24 pt-4">
        <div className={`${SHELL} max-w-[900px] space-y-5`}>
          {warranty.map(([h, body]) => (
            <div key={h}>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#6e8fe6]">{h}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-zinc-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

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

"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { OpticsSection } from "@/components/sections/OpticsSection";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Eye } from "lucide-react";
import { MediaSection, type MediaSectionData } from "@/components/sections/MediaSection";
import { Head } from "@/components/sections/Head";
import { Carousel, type Card } from "@/components/sections/Carousel";
import { FeatureTabs } from "@/components/sections/FeatureTabs";
import { BarGraph } from "@/components/sections/BarGraph";
import { ScrollScrubVideo } from "@/components/sections/ScrollScrubVideo";
import { BentoCard } from "@/components/sections/BentoCard";

/* FineVu GX4K product page — Figma frame 102:2004 (dark cinematic layout). */

const SHELL = "mx-auto w-full max-w-[1280px] px-6 lg:px-10";
// FineVu Gradient v2 — used for the "What's in The Box?" item labels (Figma 110:2810)
const BOX_GRAD = "linear-gradient(166deg, #603DB0 0%, #4F47FF 44%, #6284D8 100%)";
const BODY = "text-[15px] md:text-[18px] leading-[1.6] text-[#a6a6a6]";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

/* Scroll-pinned video hero: a fixed video with headline "beats" that fade in and out as you scroll (Figma Make hero). */
type HeroBeat = { start: number; end: number; kicker: string; headline: string; sub?: string };

const HERO_BEATS: HeroBeat[] = [
  {
    start: 0.08,
    end: 0.42,
    kicker: "FineVu GX4K · 2-Channel UHD",
    headline: "4K Begins Here.",
    sub: "The clearest view of the road you've ever recorded — front and rear.",
  },
  {
    start: 0.55,
    end: 0.88,
    kicker: "Dual-Channel Recording",
    headline: "Front & Rear. Every Detail.",
    sub: "4K UHD front. 2K QHD rear. Simultaneous. No compromises.",
  },
];

// Kept light so the text reads over the video (no low-contrast dark stops).
const KICKER_GRAD = "linear-gradient(90deg, #b3c4f5, #cbb0ee)";
const HERO_HEAD_GRAD = "linear-gradient(120deg, #ffffff 0%, #d0dafb 46%, #c1abec 100%)";
const HEAD_SHADOW = "drop-shadow(0 2px 18px rgba(0,0,0,0.55))";
const TEXT_SHADOW = "0 1px 12px rgba(0,0,0,0.8)";
const emptySubscribe = () => () => {};

function ScrollHero({
  video,
  poster,
  // Total scroll length as a multiple of the viewport height. Lower = the beats
  // arrive with less scrolling (e.g. 220 feels snappy, 380 is the cinematic default).
  heightVh = 260,
}: {
  video: string;
  poster?: string;
  heightVh?: number;
}) {
  // Gate reduced-motion behind mount so SSR and first client render match.
  const prefersReduced = useReducedMotion();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reduce = mounted && prefersReduced;

  const containerRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Native scroll drives the beat fades — instant, locked to the scrollbar.
  useEffect(() => {
    if (reduce) return;
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const scrollable = container.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.max(0, Math.min(1, -container.getBoundingClientRect().top / scrollable)) : 0;
      HERO_BEATS.forEach((beat, i) => {
        const el = beatRefs.current[i];
        if (!el) return;
        const fade = 0.06;
        let opacity = 0;
        if (p >= beat.start && p <= beat.end) {
          if (p - beat.start < fade) opacity = (p - beat.start) / fade;
          else if (beat.end - p < fade) opacity = (beat.end - p) / fade;
          else opacity = 1;
          opacity = Math.max(0, Math.min(1, opacity));
        }
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${20 * (1 - opacity)}px)`;
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [reduce]);

  /* Reduced motion: static hero, first beat only, no pin */
  if (reduce) {
    const beat = HERO_BEATS[0];
    return (
      <section
        data-nav-theme="dark"
        className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 40%, #0f1424 0%, #08080c 70%)" }}
      >
        <div className="px-6 text-center">
          <p
            className="mb-3 bg-clip-text text-[11.5px] font-bold uppercase tracking-[0.28em] text-transparent"
            style={{ backgroundImage: KICKER_GRAD, WebkitBackgroundClip: "text", filter: HEAD_SHADOW }}
          >
            {beat.kicker}
          </p>
          <h1
            className="bg-clip-text font-bold text-transparent"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: 1.08, letterSpacing: "-0.02em", backgroundImage: HERO_HEAD_GRAD, WebkitBackgroundClip: "text", filter: HEAD_SHADOW }}
          >
            {beat.headline}
          </h1>
          {beat.sub && <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/90" style={{ textShadow: TEXT_SHADOW }}>{beat.sub}</p>}
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} data-nav-theme="dark" className="relative w-full" style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <video
          src={video}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Legibility scrim plus a bottom fade into the next section */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 78% 58% at 50% 50%, rgba(6,7,11,0.62) 0%, rgba(6,7,11,0.34) 46%, rgba(6,7,11,0.06) 74%, transparent 100%)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32" style={{ background: "linear-gradient(to bottom, transparent, #08080c)" }} />

        {HERO_BEATS.map((beat, i) => (
          <div
            key={i}
            ref={(el) => {
              beatRefs.current[i] = el;
            }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            <p
              className="mb-3 bg-clip-text text-[11.5px] font-bold uppercase tracking-[0.28em] text-transparent"
              style={{ backgroundImage: KICKER_GRAD, WebkitBackgroundClip: "text", filter: HEAD_SHADOW }}
            >
              {beat.kicker}
            </p>
            {i === 0 ? (
              <h1
                className="bg-clip-text font-bold text-transparent"
                style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: 1.08, letterSpacing: "-0.02em", backgroundImage: HERO_HEAD_GRAD, WebkitBackgroundClip: "text", filter: HEAD_SHADOW }}
              >
                {beat.headline}
              </h1>
            ) : (
              <h2 className="font-bold text-white" style={{ fontSize: "clamp(2.2rem, 6vw, 4.8rem)", lineHeight: 1.1, letterSpacing: "-0.02em", textShadow: TEXT_SHADOW }}>
                {beat.headline}
              </h2>
            )}
            {beat.sub && <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90" style={{ textShadow: TEXT_SHADOW }}>{beat.sub}</p>}
          </div>
        ))}

        {/* scroll hint */}
        <motion.div
          className="pointer-events-none absolute bottom-10 left-1/2 h-10 w-px -translate-x-1/2 origin-top"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }}
          animate={{ scaleY: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
        />
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
    // Figma 133:58 tile — image cover-fills to the edges, white label overlaid at the bottom
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

/* Data */

const detailCards = [
  { title: "3840 × 2160 UHD Front Camera", caption: "Every pixel captured", video: "/gx4k/captured-front-cam.mp4" },
  { title: "Sony STARVIS IMX515", caption: "8.5MP · F/1.8 · crystal-clear detail", img: "/gx4k/captured-starvis.png" },
  { title: "Auto Night Vision", caption: "AI-controlled, always-on HDR mode", video: "/gx4k/captured-night.mp4" },
  { title: "Ai Heat Monitoring", caption: "Auto power-save if temps spike", img: "/gx4k/captured-ai-heat.png" },
  { title: "136°/143° Field of View", caption: "Front & Rear", img: "/gx4k/captured-front-rear.png" },
];

const cSeeDetail: Card[] = [
  { title: "True 4K Ultra HD", body: "Front records in 3840×2160 UHD, rear in Full HD 1080p. Number plates, road signs and faces stay sharp enough to actually hold up as evidence.", video: "/gx4k/detail-true-4k.mp4" },
  { title: "Sony STARVIS Sensor", body: "The 8.5MP Sony STARVIS IMX515 delivers vivid, low-noise footage with the dynamic range to handle harsh glare and deep shadow alike.", img: "/gx4k/detail-starvis.png" },
  { title: "AI Auto Night Vision", body: "Smart AI reads the light around you and adjusts brightness and contrast on its own, for clear night footage with nothing to switch on.", video:"/gx4k/detail-auto-night.mp4" },
];

const cParked: Card[] = [
  { title: "Power Saving Parking Mode", body: "Prolonged recording time. Consuming 98% less power, GX4K records 2,325 more hours than standard parking mode.", img: "/gx4k/parking.webp" },
  { title: "20-Second Impact Capture", body: "Every impact saves the 10 seconds before and 10 seconds after — front and rear — so the full scene is locked in, not just the moment of contact.", img: "/gx4k/protected-20-sec.png "},
  { title: "Smart Time-Lapse", body: "Records at 10fps while parked, then jumps to 30fps the instant something happens — up to 743 minutes of coverage without filling the card.", img: "/gx4k/protected-smart-time.png"  },
  { title: "AI Heat Monitoring", body: "Built-in temperature sensing powers the camera down before heat becomes a risk — protection made for hot climates and long summer parks." , img: "/gx4k/protected-ai-heating.png"},

];

const cSafer: Card[] = [
  { title: "ADAS Plus Driver Assistance", body: "Forward Vehicle Moving Alert (FVMA) and Lane Departure Warning (LDWS) keep you sharp, with a nudge when the car ahead pulls away or you drift lanes." , img:"/gx4k/safer-adas.png"},
  { title: "Speed Camera Alert", body: "Quarterly safety-camera database updates with voice and visual alerts. Fewer surprises, fewer tickets. Requires GPS reception.", img:"/gx4k/safer-speed.png" },
];

const cBuilt: Card[] = [
  { title: "Supercapacitor, Not Battery", body: "A supercapacitor replaces the traditional battery for better heat tolerance and a longer service life. Engineered for reliability, not shortcuts.", img:"/gx4k/built-capacitor.png" },
  { title: "Built In-House", body: "FineVu builds in-house, not in generic factories, with quality control tight enough to keep defects below 0.2%. That's reliability you can count on." , img:"/gx4k/built-in-house.png"},
  { title: "Battery Protection Integrated", body: "Low-voltage cut-off powers the camera down before your car battery runs flat. Set your vehicle's profile in the FineVu app with a single tap.", note: "* FineVu recommends changing the low voltage settings to ‘hybrid’ when using the ISG system.", img:"/gx4k/built-battery.png" },
];

const cStorage: Card[] = [
  { title: "Format Free 2.0", body: "Format Free 2.0 ends manual card reformatting for good, extending your memory card's lifespan and keeping recording reliable, drive after drive." },
  { title: "Memory Allocation", body: "Split storage to match how you drive, with Driving, Event, Parking or Driving-Only priority, so the card fills with the footage you actually need." },
];

const cConnected: Card[] = [
  { title: "FineVu App", body: "View live video, download clips, change settings and update firmware right from your phone. Android and iOS, plus FineVu Player 2.0 on desktop." , img:"/gx4k/connected-app.png" },
  { title: "5GHz Wi-Fi", body: "Fast dual-band Wi-Fi streams live footage to your phone and pulls clips straight off the camera. No removing the SD card.", video:"/gx4k/connected-5g.mp4"  },
  { title: "Built-in GPS", body: "Records speed, location and route with no external GPS to buy or wire in. Every clip stamped with exactly where and how fast you were going.",  img:"/gx4k/connected-gps.png"  },
];

/* Full-bleed MediaSection dividers (title + description over image/color). */
const mDualVision: MediaSectionData = {
  title: `Dual Vision`,
  description: `GX4K is equipped with the SONY STARVIS IMX515, an 8.5MP flagship image sensor up front, paired with a 2MP CMOS sensor at the rear. The IMX515 delivers superior light sensitivity and a wider dynamic range than conventional sensors, capturing sharper detail, richer color, and cleaner footage in low-light and nighttime driving conditions. Together, the dual-sensor setup ensures every journey is recorded front and back with exceptional clarity, less noise, and reduced motion blur.`,
  image: "/gx4k/graphic-dual-vision.png",
  aspectRatio: "2160/1207",
  theme: "dark",
};

const mSecondEyes: MediaSectionData = {
  title: `A second set of eyes`,
  description: `ADAS Plus watches the road with you, and speaks up before you need to.`,
  image: "/gx4k/graphic-second-eyes.png",
  aspectRatio: "2160/1484",
  theme: "dark",
};

const mInYourHand: MediaSectionData = {
  title: "Your Dashcam. In Your Hand.",
  description: "Live view, instant downloads and settings, all from your phone. No cables, no card removal.",
  image: "/gx4k/graphic-your-dashcam.png",
  aspectRatio: "2160/1484",
  theme: "dark",
};

const mDiscreet: MediaSectionData = {
  image: "/gx4k/graphic-discreet.png",
  title: "Discreet by Design.",
  description: "A screen-free, wedge-shaped body that tucks behind your mirror and out of your mind.",
  aspectRatio: "2160/1484",
  theme: "dark",
};

const disappearTabs = [
  {
    title: "Screen-Free by Design",
    body: "No LCD, no glare, no distraction. Just subtle status lights that let you know it's recording, keeping your attention where it belongs, on the road.",
    video:"/gx4k/disappear-screen-free.mp4"
  },
  {
    title: "Disappears Behind the Mirror",
    body: "At 96.5mm wide and just 114g, the wedge-shaped front unit tucks neatly behind your rear-view mirror. The rear camera is smaller still at only 23g. Always present, never in sight.",
     video:""
  },
  {
    title: "One Cable, Clean Install",
    body: "A single 6-metre cable links the rear camera and powers it at the same time, so there's no second power run and no messy wiring. A 9-metre cable is available for larger vehicles.",
     video:""
  },
  {
    title: "Details That Think Ahead",
    body: "Thoughtful touches throughout. A microSD slot with an on/off switch lets you pause recording without unplugging, QR-code pairing gets you set up in seconds, and simple physical buttons handle mic, emergency and Wi-Fi.",
     video:""
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


const memoryAllocationTabs = [
  {
    title: "Driving Priority",
    component: (
      <div className="bg-[#1D1D1D] rounded-[32px] p-6 md:p-14">
      <BarGraph
        data={[
          { label: "Driving", value: 70 },
          { label: "Driving Event", value: 10 },
          { label: "Parking Motion", value: 15 },
          { label: "Parking Event", value: 5 },
        ]}
      />
      </div>
    ),
  },
  {
    title: "Event Priority",
    component: (
      <div className="bg-[#1D1D1D] rounded-[32px] p-6 md:p-14">
      <BarGraph
        data={[
          { label: "Driving", value: 45 },
          { label: "Driving Event", value: 20 },
          { label: "Parking Motion", value: 20 },
          { label: "Parking Event", value: 15 },
        ]}
      />
      </div>
    ),
  },
  {
    title: "Parking Priority",
    component: (
      <div className="bg-[#1D1D1D] rounded-[32px] p-6 md:p-14">
      <BarGraph
        data={[
          { label: "Driving", value: 40 },
          { label: "Driving Event", value: 10 },
          { label: "Parking Motion", value: 45 },
          { label: "Parking Event", value: 5 },
        ]}
      />
      </div>
    ),
  },
  {
    title: "Driving Only",
    component: (
      <div className="bg-[#1D1D1D] rounded-[32px] p-6 md:p-14">
      <BarGraph
        data={[
          { label: "Driving", value: 85 },
          { label: "Driving Event", value: 15 },
          { label: "Parking Motion", value: 0 },
          { label: "Parking Event", value: 0 },
        ]}
      />
      </div>
    ),
  }
]

/* Component */

export default function GX4KPage() {
  const [fwTab, setFwTab] = useState<"Firmware" | "User Manual" | "Speed Cam Data">("Firmware");

  return (
    <main className="overflow-x-clip bg-[#08080c]">
      {/* Hero: scroll-pinned video */}
      <ScrollHero video="/home/GX4K_Hero_Video_V2.mp4" poster="/gx4k/hero-bg.webp" />

      {/* Scroll-scrubbed render: playback + annotation callouts driven by scroll position.
          NOTE: callout `pos`/`line` coords are a starting point (borrowed from OpticsSection);
          tune them against the actual video framing. */}
     

      {/* Every detail card grid */}
      <section data-nav-theme="dark" className="py-20 md:py-28">
        <motion.div {...fadeUp} className={`${SHELL} mb-12 text-center md:mb-16`}>
          <Head pre="Every detail. " grad="Captured in Ultra HD." className="!text-[30px] md:!text-[46px]" />
          <p className={`mx-auto mt-5 max-w-[560px] ${BODY} text-center`}>
            4K UHD at 30fps across two channels — licence plates, road signs, and low-light
            intersections rendered with uncompromised clarity.
          </p>
        </motion.div>

        <div className={`${SHELL} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12`}>
          <BentoCard theme="dark" {...detailCards[0]} className="lg:col-span-7 lg:row-span-2 aspect-[16/10] lg:aspect-auto lg:min-h-[520px]" />
          <BentoCard theme="dark" {...detailCards[1]} className="lg:col-span-5 aspect-[16/9]" />
          <BentoCard theme="dark" {...detailCards[2]} className="lg:col-span-5 aspect-[16/9]" />
          <BentoCard theme="dark" {...detailCards[3]} className="lg:col-span-6 aspect-[16/9]" />
          <BentoCard theme="dark" {...detailCards[4]} className="lg:col-span-6 aspect-[16/9]" />
        </div>
      </section>

      {/* Optics behind the image */}
      {/* <OpticsSection /> */}
      <ScrollScrubVideo
        video="/gx4k/gx4k_secondary_banner_scrub.mp4"
        poster="/gx4k/hero-render.png"      
        reverseOnExit
        head={{
          title: "The Optics Behind the Image.",
          subtitle:
            "Sony STARVIS IMX515. A precision-engineered 8.5-megapixel sensor paired with F/1.8 wide-aperture glass, made to perform when it matters most.",
        }}
        callouts={[
          {
            key: "front",
            title: "Front",
            sub: "UHD wide",
            items: ["SONY STARVIS IMX515", "8.5 MP sensor", "3840 × 2160 (4K UHD)", "136° field of view"],
            start: 0.2,
            end: 0.95,
            pos: "left-[0px] top-[100px]",
            // horizontal lead-in off the divider, then a bend down to the front lens
            line: { points: [[0, 300], [500, 300], [700, 560]] },
            from:"right"
          },
          {
            key: "core",
            title: "Core",
            sub: "Dual-core engine",
            items: ["Dual-core processor", "HDR auto night vision", "microSD up to 256 GB", "Format Free 2.0"],
            start: 0.36,
            end: 0.95,
            pos: "left-[190px] bottom-[-90px]",
            line: { points: [[300, 1040], [760, 1040], [980, 612]] },
            from:"right"
          },
          {
            key: "rear",
            title: "Rear",
            sub: "Full-HD wide",
            items: ["2 MP CMOS sensor", "1920 × 1080 (Full HD)", "143° field of view", "23 g compact module"],
            start: 0.64,
            end: 0.95,
            pos: "right-[-50px] bottom-[-95px]",
            line: { points: [[1300, 690], [1400, 1040], [1760, 1040]] },
            from:"left"
          },
        ]}
      />


      <MediaSection data={mDualVision} />

      {/* See every detail carousel */}
      <Carousel pre="See Every " grad="Detail" cards={cSeeDetail} imgAspect="1047 / 562" pinGutter />

    

 

      {/* Protected while parked carousel */}
      <Carousel grad="Protected" post=" While Parked" cards={cParked} imgAspect="1047 / 562" pinGutter gutterRight />

     

      {/* Second set of eyes showcase */}
      <MediaSection data={mSecondEyes} />
     
      {/* Smarter safer driving carousel */}
      <Carousel pre="Smarter, " grad="Safer Driving" cards={cSafer} imgAspect="1047 / 562" pinGutter />

      {/* Built to last carousel */}
      <Carousel
        pre="Built to Last"
        cards={cBuilt}
        imgAspect="1047 / 562"
        pinGutter
        gutterRight
        bgClassName="bg-[#101010]"
      />

      {/* Storage manages itself carousel */}
      {/* <Carousel pre="Storage That Manages Itself" cards={cStorage} imgAspect="1047 / 562" pinGutter /> */}

      <section data-nav-theme="dark" className="py-20 md:py-28">
        <motion.div {...fadeUp} className={`${SHELL} mb-12 text-center md:mb-16`}>
          <Head pre="Storage That Manages Itself" className="!text-[30px] md:!text-[46px]" />
        </motion.div>

        <div className={`${SHELL} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12`}>
          <BentoCard theme="dark" title="" className="lg:col-span-6 lg:row-span-2 aspect-[16/10] lg:aspect-auto lg:min-h-[520px]" />
          <BentoCard
            theme="dark"
            variant="displayText"
            title="Format Free 2.0"
            caption="Format Free 2.0 ends manual card reformatting for good, extending your memory card's lifespan and keeping recording reliable, drive after drive."
            className="lg:col-span-6  lg:row-span-2  aspect-[16/10] lg:aspect-auto lg:min-h-[520px]"
          />
          <BentoCard theme="dark" img="/gx4k/bento-storage-dash.png" className="lg:col-span-12 aspect-[16/7]" />
        </div>
      </section>
  

      <section data-nav-theme="dark" className="pt-0 py-20">
        <motion.div {...fadeUp} className={`${SHELL} text-center`}>
          <Head pre="Memory Allocation" className="!text-[30px] md:!text-[38px]" />
          <p className={`mx-auto mt-5 max-w-[660px] ${BODY} text-center mb-6`}>
          Split storage to match how you drive, with Driving, Event, Parking or Driving-Only priority, so the card fills with the footage you actually need.
          </p>
          <small className="text-white/30">
           <div>{`* The MicroSD card is formatted when changing the memory allocation.`}</div>
           <div>{`* The memory format type is FAT32, and if the format type is different, the dashcam proceeds with formatting automatically.`}</div>
           <div>{`(After formatting, once you insert it into the device and supply it with power, the formatting will be in progress to set the memory.)`}</div>
          </small>
        </motion.div>

         <div className="flex items-center justify-center">
            <FeatureTabs sectionClass={`py-10 min-w-0 md:min-w-[970px]`} title="" tabs={memoryAllocationTabs} tabsPosition="top" />
         </div> 
           
     
        
      </section>

      {/* Your dashcam in your hand */}
      <MediaSection data={mInYourHand} />

      {/* Connected in your pocket carousel */}
      <Carousel grad="Connected" post=" in Your Pocket" cards={cConnected} imgAspect="1047 / 562" pinGutter gutterRight />

      {/* Discreet by design showcase */}
      <MediaSection data={mDiscreet} />

      {/* Designed to disappear band */}
      <div
        data-nav-theme="dark"
        style={{ background: "linear-gradient(180deg, #241C38 0%, #130F1E 7.2%, #08080C 59.6%)" }}
      >
      {/* Designed to disappear tabs */}
      <FeatureTabs sectionClass={`py-20 md:py-28`} title="Designed to Disappear" tabs={disappearTabs} />

      {/* Small in size gallery */}
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
                className="tile-hover-purple overflow-hidden rounded-[22px] border border-white/[0.06]"
                style={{ aspectRatio: g.ratio.replace("/", " / ") }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} className="h-full w-full object-cover" />
              </motion.div>
            ))}
          </div>
          <motion.div
            {...fadeUp}
            className="tile-hover-purple overflow-hidden rounded-[22px] border border-white/[0.06]"
            style={{ aspectRatio: "1297 / 427" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gx4k/detail-angle.webp" alt="GX4K angled macro" className="h-full w-full object-cover" />
          </motion.div>
        </div>
      </section>
      </div>

      {/* More reasons and wiring band */}
      <div data-nav-theme="dark" style={{ background: "#0B0B0B" }}>
      {/* Reasons and includes bento */}
      <section className="py-16 md:py-24">
        <motion.div {...fadeUp} className={`${SHELL} mb-8 text-center md:mb-12`}>
          <Head pre="More reasons to choose FineVu." className="!text-[26px] md:!text-[40px]" />
        </motion.div>
        {/* Figma 133:58 bento — taller top row, two equal tiles below. */}
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

      {/* Leave wiring to the experts */}
      <section data-nav-theme="dark" className="py-16 md:py-24">
        <div className={`${SHELL} text-center`}>
          <motion.div {...fadeUp}>
            <Head pre="Leave the Wiring to the Experts." className="!text-[28px] md:!text-[42px]" />
          </motion.div>
          <motion.div {...fadeUp} className="mt-10 overflow-hidden rounded-[28px] border border-white/[0.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/installation/hero.webp" alt="FineVu certified installer arriving on-site" className="h-[280px] w-full object-cover md:h-[520px]" />
          </motion.div>
          <p className={`mx-auto mt-8 max-w-[620px] ${BODY} text-center`}>
            The GX4K records straight out of the box, but full-time parking protection means
            hardwiring it properly into your fuse box. Our certified installers fit it cleanly,
            hide every cable and set it up right the first time.
          </p>
          <Link
            href="/installation"
            className="cta-hover mt-8 inline-flex items-center justify-center rounded-full bg-[#f68428] px-10 py-3.5 text-sm font-semibold uppercase leading-[20px] text-white"
          >
            Book Installation
          </Link>
        </div>
      </section>

      {/* Full specifications */}
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

      {/* What's in the box */}
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

      {/* FineVu series comparison */}
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
                <Link href="/gx4k" className="cta-hover inline-flex whitespace-nowrap rounded-full bg-[#f68428] px-6 py-3 text-[14px] font-semibold uppercase leading-[20px] text-white sm:px-9 md:px-11 md:py-3.5">
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
                <Link href="/gx35" className="cta-hover inline-flex whitespace-nowrap rounded-full bg-[#f68428] px-6 py-3 text-[14px] font-semibold uppercase leading-[20px] text-white sm:px-9 md:px-11 md:py-3.5">
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
      {/* Firmware and downloads */}
      <section data-nav-theme="dark" className="py-16 md:py-24">
        <div className={`${SHELL} max-w-[820px]`}>
          <div className="mx-auto flex w-full max-w-[440px] rounded-full border border-white/10 p-1">
            {(["Firmware", "User Manual", "Speed Cam Data"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFwTab(t)}
                className={`flex min-h-[44px] flex-1 items-center justify-center rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors ${
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

      {/* Help and quick links */}
      <LearnMoreLinks theme="dark" />

      {/* Warranty disclaimer */}
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

      <Footer />
    </main>
  );
}

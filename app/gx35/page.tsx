"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { LegalDisclaimers } from "@/components/LegalDisclaimers";
import { OpticsSection } from "@/components/sections/OpticsSection";
import { ScrollScrubVideo } from "@/components/sections/ScrollScrubVideo";
import { BentoCard } from "@/components/sections/BentoCard";
import { MediaSection, type MediaSectionData } from "@/components/sections/MediaSection";
import { Head } from "@/components/sections/Head";
import { Carousel, type Card } from "@/components/sections/Carousel";
import { FeatureTabs } from "@/components/sections/FeatureTabs";
import { BarGraph } from "@/components/sections/BarGraph";
import { ScrollHero, type HeroBeat } from "@/components/sections/ScrollHero";
import { FirmwareDownloads, type FirmwareTab } from "@/components/sections/FirmwareDownloads";
import { motion } from "motion/react";
import Link from "next/link";
import { Eye } from "lucide-react";

// FineVu GX35 product page — light alternating layout with real photography and grey placeholders per the Figma frame.

// Design tokens (Figma variables)
const SHELL = "mx-auto w-full max-w-[1180px] px-6 lg:px-8";
// Figma hex values inlined in classNames since Tailwind can't compile dynamic values
const BACKING = "#F7F7F7"; // Light-mode backing off-white

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};


// Data

/* Scroll-pinned video hero beats — copy only; the component lives in components/sections/ScrollHero.tsx */
const HERO_BEATS: HeroBeat[] = [
  {
    start: 0.08,
    end: 0.42,
    kicker: "FineVu GX35 · 2-Channel QHD",
    headline: "Perfectly Compact.",
    sub: "QHD 2K clarity from a Sony STARVIS 2 sensor, in a camera smaller than a credit card.",
  },
  {
    start: 0.55,
    end: 0.88,
    kicker: "Dual-Channel Recording",
    headline: "In Sharp QHD.",
    sub: "2560 × 1440 front. Full HD rear. Simultaneous. Nothing missed.",
  },
];

// "Every detail" bento; the field-of-view tile stays a placeholder until the client supplies that shot
const featureTiles = [
  { title: "2560 × 1440 QHD Front Camera", caption: "Every pixel captured", video: "/gx35/detail-front-camera.mp4" },
  { title: "Sony STARVIS 2 IMX675", caption: "5.12MP F/1.8", img: "/gx35/detail-starvis.webp" },
  { title: "Auto Night Vision", caption: "AI-controlled, always-on HDR mode", img: "/gx35/detail-night.webp" },
  { title: "Ai Heat Monitoring", caption: "Auto power-save if temps spike", img: "/gx35/detail-heat.webp" },
  { title: "147° / 143° Field of View", caption: "Front & Rear", img: "/gx35/detail-field.webp" },
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
    video: "/gx35/day-true-2k.mp4",
  },
  {
    title: "Sony STARVIS 2 Sensor",
    body: "The 5.12MP Sony STARVIS 2 IMX675 is a full generation newer, with sharper low-light detail and 30% less power draw than the sensor before it.",
    img: "/gx35/day-starvis.webp",
  },
  {
    title: "AI Auto Night Vision",
    body: "Smart AI reads the light around you and adjusts brightness and contrast on its own — clear night footage with nothing to switch on.",
    video: "/gx35/day-ai-auto.mp4",
  },
];

const cParked: Card[] = [
  {
    title: "Power Saving Parking Mode",
    body: "Prolonged recording time. Consuming 98% less power, GX35 records 13,950 more hours than standard parking mode.",
    img: "/gx35/protected-power.webp",
  },
  {
    title: "20-Second Impact Capture",
    body: "Every impact saves the 10 seconds before and 10 seconds after — front and rear — so the full scene is locked in, not just the moment of contact.",
    img: "/gx35/protected-20-sec.webp",
  },
  {
    title: "Smart Time-Lapse",
    body: "Records a lightweight time-lapse while parked, then jumps to full 30fps the instant an impact is detected — up to 1,129 minutes of coverage without filling the card.",
    img: "/gx35/protected-smart.webp",
  },
  {
    title: "AI Heat Monitoring",
    body: "Built-in temperature sensing powers the camera down before heat becomes a risk — protection made for hot climates and long summer parks.",
    img: "/gx35/protected-heat.webp",
  },
  {
    title: "A Minute of Motion",
    body: "Any movement caught while parked is saved as a full minute of footage, so nothing around your car goes unrecorded.",
    img: "/gx35/protected-minute.webp",
  },
 
];

const cSafer: Card[] = [
  {
    title: "ADAS Plus Driver Assistance",
    body: "Front Vehicle Motion Alert (FVMA) and Lane Departure Warning (LDWS) keep you sharp, with a nudge when the car ahead pulls away or you drift lanes.",
    img: "/gx35/smarter-adas.webp",
  },
  {
    title: "Speed Camera Alert",
    body: "Quarterly safety-camera database updates with voice and visual alerts. Fewer surprises, fewer tickets. Requires GPS reception.",
    img: "/gx35/smarter-speed.webp",
  },
];

const cConnected: Card[] = [
  {
    title: "FineVu App",
    body: "View live video, download clips, change settings and update firmware right from your phone. Android and iOS, plus FineVu Player 2.0 on desktop.",
    img: "/gx35/connected-app.webp",
  },
  {
    title: "5GHz Wi-Fi",
    body: "Fast dual-band Wi-Fi streams live footage to your phone and pulls clips straight off the camera. No removing the SD card.",
    video: "/gx35/connected-5g.mp4",
  },
  {
    title: "GPS Included",
    body: "The included GPS antenna stamps every clip with speed, location and route — and powers the speed camera alerts.",
    img: "/gx35/connected-gps.webp",
  },
];

const cBuilt: Card[] = [
  {
    title: "Built In-House",
    body: "FineVu builds in-house, not in generic factories, with quality control tight enough to keep defects below 0.2%. That's reliability you can count on.",
    img: "/gx35/built-in-house.webp",
  },
  {
    title: "Supercapacitor, Not Battery",
    body: "A supercapacitor replaces the traditional battery for better heat tolerance and a longer service life. Engineered for reliability, not shortcuts.",
    img: "/gx35/built-supercapacitor.webp",
  },

  {
    title: "Battery Protection Integrated",
    body: "Low-voltage cut-off powers the camera down before your car battery runs flat. Set your vehicle's profile in the FineVu app with a single tap.",
    note: "* FineVu recommends changing the low voltage settings to ‘hybrid’ when using the ISG system.",
    img: "/gx35/built-battery.webp",
  },
];


const storageFormat = [
  { img: "/gx35/storage-format.webp" },
  { title: "Sony STARVIS 2 IMX675", caption: "5.12MP F/1.8" }
];

// "Designed to disappear" interactive tabs. Tabs without media fall back to
// FeatureTabs' grey placeholder until GX35 footage is supplied.
const disappearTabs = [
  {
    title: "Screen-Free by Design",
    body: "No LCD, no glare, no distraction. Just subtle status lights that let you know it's recording, keeping your attention where it belongs, on the road.",
    image: "/gx35/disappear-screen.webp", 
  },
  {
    title: "Smaller Than a Business Card",
    body: "At just 74mm wide and 57g, the front unit is smaller than a credit card and tucks neatly behind your rear-view mirror. The rear camera is smaller still at only 23g.",
    image: "/gx35/disappear-smaller.webp", 
  },
  {
    title: "One Cable, Clean Install",
    body: "A single 6-metre cable links the rear camera and powers it at the same time, so there's no second power run and no messy wiring. A 9-metre cable is available for larger vehicles.",
    image: "/gx35/disappear-one.webp", 
  },
  {
    title: "Details That Think Ahead",
    body: "Thoughtful touches throughout. A microSD slot with an on/off switch lets you pause recording without unplugging, QR-code pairing gets you set up in seconds, and simple physical buttons handle mic, emergency and Wi-Fi.",
    image: "/gx35/disappear-details.webp", 
  },
];

/* Full-bleed MediaSection dividers (title + description over image/video).
 * These replace the old local `Showcase` component. Media is borrowed from /gx4k
 * until GX35 art is supplied — every such path is tagged TODO(gx35-asset). */

const mDualVision: MediaSectionData = {
  title: "Dual Vision",
  description:
    "GX35 pairs the Sony STARVIS 2 IMX675 — a 5.12MP next-generation sensor — up front with a 2MP CMOS sensor at the rear. STARVIS 2 lifts low-light clarity while drawing 30% less power than the sensor before it, capturing sharper detail and cleaner footage after dark. Together the dual-sensor setup records every journey front and back with exceptional clarity, less noise and reduced motion blur.",
  image: "/gx4k/graphic-dual-vision.png", // TODO(gx35-asset)
  video: "/gx4k/dual-sensors_scrub.mp4", // TODO(gx35-asset) — all-keyframe build, see CLAUDE.md
  mobileVideo: "/gx4k/dual-sensors_mobile.mp4", // TODO(gx35-asset) — borrowed, as above
  pinOnMobile: false,
  background: "#000",
  aspectRatio: "2160/1207",
  // Phones stack instead of overlaying: the section stops setting its own height, the
  // media drops into flow with the aspect ratio above, and this padding opens the band
  // the copy sits in. Tune padTop against the description length, not the viewport.
  stackOnMobile: true,
  padTop: "pt-[440px] md:pt-0",
  textPosition: "14%",
  theme: "dark",
  topScrimGradient: "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
  fade: true,
  fadeColor: "#000",
  fadeRange: 0.2,
  textFrom: "bottom",
  textOffsetY: 120,
  textReplay: true,
  pin: true,
  pinHeightVh: 250,
  videoScrub: true,
  // Mobile releases the scrub, so this takes over there: one play-through on entry
  // rather than a loop. Inert on desktop, where the scrub still owns playback.
  videoPlayOnce: true,
  videoScrubStart: 0.2,
  videoScrubEnd: 0.8,
};

const mSecondEyes: MediaSectionData = {
  title: "A second set of eyes.",
  description: "ADAS Plus watches the road with you, and speaks up before you need to.",
  image: "/gx35/second-eyes.webp", // TODO(gx35-asset)
  aspectRatio: "2160/1484",
  theme: "dark",
  heightVh: 100,
  textPosition: "8%",
  heightVhMobile: false,
};

const mInYourHand: MediaSectionData = {
  title: "Your Dashcam. In Your Hand.",
  description: "Live view, instant downloads and settings, all from your phone. No cables, no card removal.",
  image: "/gx35/your-dashcam.webp", 
  theme: "dark",
  textPosition: "8%",
  heightVh: 120,
  heightVhMobile: false,
  mediaClass:"object-top"
};

const mDiscreet: MediaSectionData = {
  video: "/gx35/discreet_scrub.mp4",
  mobileVideo: "/gx35/discreet_mobile.mp4",
  pinOnMobile: false,
  background: "#000",
  title: "Discreet by Design.",
  description:
    "A screen-free body smaller than a credit card, tucked behind your mirror and out of your mind.",
  aspectRatio: "2160/1484",
  theme: "dark",
  titleClass: "text-orange-gradient",
  descriptionClass: "text-[#6E6E73]",
  topScrim: false,
  textPosition: "14%",
  textReplay: true,
  pin: true,
  pinHeightVh: 250,
  videoScrub: true,
  // Mobile releases the scrub, so this takes over there: one play-through on entry
  // rather than a loop. Inert on desktop, where the scrub still owns playback.
  videoPlayOnce: true,
  videoScrubStart: 0.2,
  videoScrubEnd: 0.9,
};

/* "Memory allocation" tabs — each tab overlays a light-theme BarGraph on its clip.
 * Values are percentage splits of total storage; `max={100}` pins the scale so bar
 * lengths are true proportions and stay comparable across tabs. */
const memoryAllocationTabs = [
  {
    title: "Driving Priority",
    video: "/gx35/alloc-driving.mp4",
    componentStatic: true,
    componentOverlay: true,
    component: (
      <BarGraph
        theme="light"
        columns={2}
        max={100}
        data={[
          { label: "Driving", value: 70 },
          { label: "Driving Event", value: 10 },
          { label: "Parking Motion", value: 15 },
          { label: "Parking Event", value: 5 },
        ]}
      />
    ),
  },
  {
    title: "Event Priority",
    video: "/gx35/alloc-event.mp4", 
    componentStatic: true,
    componentOverlay: true,
    component: (
      <BarGraph
        theme="light"
        columns={2}
        max={100}
        data={[
          { label: "Driving", value: 45 },
          { label: "Driving Event", value: 20 },
          { label: "Parking Motion", value: 20 },
          { label: "Parking Event", value: 15 },
        ]}
      />
    ),
  },
  {
    title: "Parking Priority",
    image: "/gx35/alloc-parking.webp", 
    componentStatic: true,
    componentOverlay: true,
    component: (
      <BarGraph
        theme="light"
        columns={2}
        max={100}
        data={[
          { label: "Driving", value: 40 },
          { label: "Driving Event", value: 10 },
          { label: "Parking Motion", value: 45 },
          { label: "Parking Event", value: 5 },
        ]}
      />
    ),
  },
  {
    title: "Driving Only",
    video: "/gx35/alloc-only.mp4", 
    componentStatic: true,
    componentOverlay: true,
    component: (
      <BarGraph
        theme="light"
        columns={2}
        max={100}
        data={[
          { label: "Driving", value: 85 },
          { label: "Driving Event", value: 15 },
          { label: "Parking Motion", value: 0 },
          { label: "Parking Event", value: 0 },
        ]}
      />
    ),
  },
];

const specRows: [string, string][] = [
  ["Front camera", "SONY STARVIS 2 IMX675 · 5.12 MP · 2560 × 1440 (Quad HD) · 147.4° FOV"],
  ["Rear camera", "2 MP CMOS · 1920 × 1080 (Full HD) · 143.2° FOV"],
  ["Processor", "Dual-core"],
  ["Night vision", "HDR + Auto Night Vision with AI light-environment adjustment"],
  ["Recording modes", "Continuous · Impact · Emergency · Parking (motion + impact) · Smart Time-Lapse"],
  ["Parking mode", "Power Saving Parking — up to 98% less power · 20-sec event capture with 10-sec pre-buffer"],
  ["Driver assistance", "ADAS Plus — FVMA (front vehicle motion alert) · LDWS (lane departure)"],
  ["Connectivity", "Built-in Wi-Fi · External GPS antenna (included) · FineVu Wi-Fi App"],
  ["Storage", "microSD up to 256 GB · Format Free 2.0 · Memory allocation"],
  ["Protection", "Low voltage cut-off · G-sensor · AI heat monitoring · Supercapacitor"],
  ["Safety database", "Speed camera alerts, GPS-supported"],
];

// Order follows docs/content-sources/gx35.txt == IN THE BOX ==. The Cradle and the
// GPS(2.5Φ) antenna are GX35-only; the antenna is why the GPS spec row says "external".
const boxItems = [
  "Front Camera",
  "Rear Camera",
  "Cradle",
  "MicroSD Card & Adapter",
  "Hardwire Kit",
  "Power Cable",
  "Rear Cable",
  "GPS Antenna",
  "User Manual"
];

const compareRows: [string, string, string][] = [
  ["Front Sensor", "Sony STARVIS IMX515 8.5MP", "Sony STARVIS 2 IMX675 5.12MP"],
  ["Front Resolution", "4K UHD 3840×2160", "2K QHD 2560×1440"],
  ["Rear Resolution", "Full HD 1920×1080", "Full HD 1920×1080"],
  ["Max Video", "4K 30fps", "2K 30fps"],
  ["Field of View", "136°F · 143°R", "147°F · 143°R"],
  ["GPS", "Built-in", "External antenna (included)"],
  ["Parking Standby", "+2,325 hrs", "+13,950 hrs"],
  ["Processor", "Allwinner V536", "Allwinner V536"],
  ["Warranty", "3 Years", "3 Years"],
];

const firmwareSteps = [
  "Download the latest firmware.",
  "Remove the Micro SD card from your dashcam. Insert it into Micro SD card reader and connect the reader to the PC.",
  "When the reader is connected to the PC, a USB drive or new disk drive will be created. (It's recommended to format the Micro SD card used for another device before you upgrade the firmware.)",
  "Copy the downloaded firmware on the top-level root of the memory card.",
  "Insert the Micro SD card into on the device. Turn on the vehicle or start the engine to turn on the device.",
  "The firmware update starts automatically.",
  "The system will automatically restart once the firmware update is completed.",
];

const speedCamSteps = [
  "Download the latest Speed Cam data file.",
  "Remove the Micro SD card from your dashcam. Insert it into Micro SD card reader and connect the reader to the PC.",
  "When the reader is connected to the PC, a USB drive or new disk drive will be created.",
  "Copy the downloaded Speed Cam data file on the top-level root of the memory card.",
  "Insert the Micro SD card into on the device. Turn on the vehicle or start the engine to turn on the device.",
  "The Speed Cam data file update starts automatically.",
  "The system will automatically restart once the Speed Cam data file update is completed.",
];

const downloadTabs: FirmwareTab[] = [
  {
    name: "Firmware",
    heading: "Instructions",
    steps: firmwareSteps,
    warning:
      "Do not power off your dashcam until it begins continuous recording, as it may cause permanent damage to the dashcam.",
    // downloadLabel: "Download Firmware",
  },
  {
    name: "User Manual",
    // heading: "User Manual",
    intro: "Coming soon",
    // downloadLabel: "Download User Manual (PDF)",
  },
  {
    name: "Speed Cam Data",
    heading: "Instructions",
    steps: speedCamSteps,
    // downloadLabel: "Download Speed Cam Data",
  },
];

// Component

export default function GX35Page() {
  return (
    <main className="overflow-x-clip bg-[#F5F5F7]">
      {/* Hero: scroll-pinned video. `fadeTo` is white so the pinned stage lands on the
          light page background instead of GX4K's near-black. */}
    
      <ScrollHero
        // Re-encoded from hero.mp4 at the same 1920×1080 — the master ran ~12.7 Mbps, which is
        // far past what a muted background loop needs. The 21.5 MB original is kept on disk.
        video="/gx35/hero_desktop.mp4"
        // Below lg the browser fetches this instead, via <source media> — so a phone never pulls
        // the desktop file at all. The pin stays: unlike the scrub sections it reveals the beats.
        mobileVideo="/gx35/hero_mobile.mp4"
        // Frame 1 of hero_desktop.mp4, so the still and the first decoded frame match exactly.
        poster="/gx35/hero-poster.webp"
        beats={HERO_BEATS}
        theme="light"
      />

      {/* Every detail feature bento */}
      <section data-nav-theme="light" className=" py-20 md:py-28">
        <motion.div {...fadeUp} className={`${SHELL} mb-12 text-center md:mb-16`}>
          <Head theme="light" pre="Every detail. " grad="In Sharp QHD." className="!text-[30px] md:!text-[46px]" />
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

      {/* Optics pinned scroll-reveal — trialling the ScrollScrubVideo treatment with a still
          backdrop instead. The original light-theme OpticsSection is kept below, commented, until
          that call is made. */}
      <ScrollScrubVideo
        scrollHint={false}
        theme="light"
        image="/gx35/optics.webp"
        fit="contain"
        // Below lg there are no callouts to reveal and nothing to scrub, so the pin would just
        // hold a still image for ~3 screens. Off, the mobile section shows the frame in flow.
        pinOnMobile={false}
        mobileMediaClass="scale-150"
        themeOverrides={{ bottomFade: "", exitFade: "", stageBg: "bg-[#F4F4F6]", sectionBg: "bg-[#F7F7F7]", reducedBg: "#F4F4F6" }}
        // Must match optics.webp's real pixel size — the callout layer is sized to the same box,
        // so `at` values below are literal image pixels. Note this crop is 1.582 wide, NOT the
        // 1.456 of the image OpticsSection used; anchors from that era do not carry over.
        stageViewBox="0 0 2160 1365"

        
        nudgeY="7%"
        head={{
          title: "The Optics Behind the Image.",
          subtitle:
            "Sony STARVIS 2 IMX675. A next-generation 5.12-megapixel sensor paired with F/1.8 wide-aperture glass, drawing 30% less power than the previous STARVIS while lifting low-light clarity.",
        }}
        // `at` values are the OpticsSection line's product end (its x1/y1), rescaled from that
        // component's 2160×1484 space into this one's 1920×1319 (×0.8889). Angles approximate the
        // original leader directions — all of it wants eyeballing, the geometry model differs.
        callouts={[
          {
            ...opticsCallouts[0],
            start: 0.2,
            end: 0.3,
            at: [1100, 570],
            direction: "top-right",
            leader: { angle: 25, diag: 190, run: 60, radius: 6 },
            from: "left",
          },
          {
            ...opticsCallouts[1],
            start: 0.3,
            end: 0.4,
            at: [904, 707],
            direction: "bottom-left",
            leader: { angle: 25, diag: 160, run: 60, radius: 6 },
            from: "right",
          },
          {
            ...opticsCallouts[2],
            start: 0.4,
            end: 0.6,
            at: [1160, 860],
            direction: "bottom-left",
            leader: { angle: 40, diag: 40, run: 60, radius: 6 },
            from: "right",
          },
        ]}
      />

      {/* <OpticsSection
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
      /> */}

      {/* Dual Vision showcase */}
      {/* <MediaSection data={mDualVision} /> */}

      {/* See Every Detail carousel */}
      <Carousel theme="light" pre="Every Detail. " grad="Day or night." cards={cSeeDetail} pinGutter />

      {/* Protected While Parked carousel */}
      <Carousel theme="light" grad="Protected" post=" While Parked" cards={cParked} pinGutter gutterRight />

      {/* A Second Set of Eyes showcase (ADAS) */}
      <MediaSection data={mSecondEyes} />

      {/* Smarter, Safer Driving carousel */}
      <Carousel theme="light" pre="Smarter, " grad="Safer Driving" cards={cSafer} pinGutter />

      {/* Built to Last carousel */}
      <Carousel theme="light" pre="Built to Last" cards={cBuilt} pinGutter gutterRight />

      {/* Storage That Manages Itself */}
      <section data-nav-theme="light" className=" pt-20 md:pt-28">
        <motion.div {...fadeUp} className={`${SHELL} mb-12 text-center md:mb-16`}>
          <Head theme="light" pre="Storage That Manages Itself" className="!text-[30px] md:!text-[46px]" />
        </motion.div>

        <div className={`${SHELL} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12`}>
          <BentoCard theme="light" {...storageFormat[0]} title="" className="lg:col-span-7 lg:row-span-2 aspect-[16/10] lg:aspect-auto lg:min-h-[520px]" />
          <BentoCard
            theme="light"
            variant="displayText"
            title="Format Free 2.0"
            caption="Format Free 2.0 ends manual card reformatting for good, extending your memory card's lifespan and keeping recording reliable, drive after drive."
            className="lg:col-span-5 lg:row-span-2 aspect-[16/10] lg:aspect-auto lg:min-h-[520px]"
          />
        </div>
      </section>

      <section data-nav-theme="light" className=" max-w-[1180px] pt-0 pb-20 mx-auto">
        <FeatureTabs theme="light" sectionClass="pb-10 min-w-0 md:min-w-[970px]" title="" tabs={memoryAllocationTabs} />

        <motion.div {...fadeUp} className={`${SHELL} text-center`}>
          <Head theme="light" pre="Memory Allocation" className="!text-[30px] md:!text-[38px]" />
          <p className="mx-auto mt-5 mb-6 max-w-[660px] text-center text-[15px] leading-[1.6] text-[#6E6E73] md:text-[18px]">
          Split storage to match how you drive, with Driving, Event, Parking or Driving-Only priority, so the card fills with the footage you actually need.
          </p>
          <small className="text-[#9aa0ad]">
            <div>{`* The MicroSD card is formatted when changing the memory allocation.`}</div>
            <div>{`* The memory format type is FAT32, and if the format type is different, the dashcam proceeds with formatting automatically.`}</div>
            <div>{`(After formatting, once you insert it into the device and supply it with power, the formatting will be in progress to set the memory.)`}</div>
          </small>
        </motion.div>
      </section>

      {/* Your Dashcam in Your Hand showcase (app) */}
      <MediaSection data={mInYourHand} />

      {/* Connected in Your Pocket carousel */}
      <Carousel theme="light" grad="Connected" post=" in Your Pocket" cards={cConnected} />

      {/* Discreet by Design showcase */}
      <MediaSection data={mDiscreet} />

      {/* Designed to Disappear tabs and detail gallery */}
     
      <section data-nav-theme="light" className="pt-16 pb-20 md:pb-28">

        <FeatureTabs
          theme="light"
          title="Designed to Disappear"
          tabs={disappearTabs}
          shellClass={SHELL}
        />

        {/* Small in size, rich in detail macro gallery */}
        <motion.div {...fadeUp} className={`${SHELL} mb-8 mt-16 text-center md:mb-12 md:mt-24`}>
          <Head theme="light" pre="Small in size. " grad="Rich in detail." className="!text-[26px] md:!text-[40px]" />
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
      <section data-nav-theme="light" className="py-16 md:py-24">
        <motion.div {...fadeUp} className={`${SHELL} mb-8 text-center md:mb-12`}>
          <Head theme="light" pre="More reasons to choose FineVu." className="!text-[26px] md:!text-[40px]" />
        </motion.div>
        <div className={`${SHELL} space-y-4 sm:space-y-5`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[730fr_550fr] sm:gap-5">
            <BentoCard theme="light" variant="overlayLabel" img="/gx35/no1.webp" title="No.1 Dash Cam in Korea" className="aspect-[730/600]" />
            <BentoCard
              theme="light"
              variant="overlayLabel"
              img="/gx35/warranty3.webp"
              title="3 Year Warranty"
              sup="1"
              imgClass="object-[50%_42%]"
              className="aspect-[550/600] sm:aspect-auto sm:h-full"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <BentoCard theme="light" variant="overlayLabel" img="/gx35/microsd.webp" title="Includes 64GB MicroSD Card" sup="2" className="aspect-[640/400]" />
            <BentoCard theme="light" variant="overlayLabel" img="/gx35/cables.webp" title="Includes Hardwire Kit & Power Cable" sup="3" className="aspect-[640/400]" />
          </div>
        </div>
      </section>

      {/* Leave the Wiring to the Experts install */}
      <section data-nav-theme="light" className="py-16 md:py-24">
        <div className={`${SHELL} text-center`}>
          <motion.div {...fadeUp}>
            <Head theme="light" pre="Leave the Wiring to the Experts." className="!text-[28px] md:!text-[42px]" />
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
      <section data-nav-theme="light" className="py-16 md:py-24">
        <div className={SHELL}>
          <motion.div {...fadeUp} className="mb-10 text-center">
            <Head theme="light" pre="Full Specifications" className="!text-[28px] md:!text-[40px]" />
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
        </div>
      </section>

      {/* What's in the Box */}
      <section data-nav-theme="light" className=" py-16 md:py-24">
        <div className={`${SHELL} text-center`}>
          <motion.div {...fadeUp}>
            <Head theme="light" pre="What’s in The Box?" className="!text-[28px] md:!text-[40px]" />
          </motion.div>
          <div className="mx-auto mt-10 grid max-w-[760px] grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-3 md:mt-12">
            {boxItems.map((it) => (
              <p
                key={it}
                className="text-orange-gradient text-[16px] font-medium md:text-[20px]"
              >
                {it}
              </p>
            ))}
          </div>
          <motion.div {...fadeUp} className="mt-10 overflow-hidden rounded-[32px] md:mt-12">
            {/* TODO(gx35-asset): borrowed GX4K box shot until a GX35 one is supplied. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gx35/box.webp" alt="FineVu GX35 box contents" className="aspect-[1300/519] w-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* FineVu Series Comparison */}
      <section data-nav-theme="light" className="py-16 md:py-24" >
        <div className={SHELL}>
          <motion.div
            {...fadeUp}
            className="mx-auto max-w-[992px] rounded-[32px] bg-[#eaeaea] px-5 py-10 sm:px-10 md:rounded-[46px] md:px-14 md:py-16"
          >
            <div className="text-center">
              <Head theme="light" pre="FineVu Series Comparison" className="!text-[26px] md:!text-[40px]" />
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
                    src="/gx35/compare-gx4k.webp"
                    alt="FineVu GX4K front and rear cameras"
                    className="h-auto max-h-[130px] w-auto max-w-full object-contain md:max-h-[264px]"
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
                    src="/gx35/compare-gx35.webp"
                    alt="FineVu GX35"
                    className="h-auto max-h-[130px] w-auto max-w-full object-contain md:max-h-[264px]"
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
      {/* <FirmwareDownloads tabs={downloadTabs} theme="light" ariaLabel="GX35 downloads" /> */}

      {/* Help / quick links — Where to buy, Install, Support */}
      <LearnMoreLinks  />

      {/* Warranty disclaimer — copy lives in siteConfig.disclaimers */}
      <LegalDisclaimers theme="light" />

      {/* CTA + footer band (shared component matches the frame's closing) */}
      <Footer />
    </main>
  );
}

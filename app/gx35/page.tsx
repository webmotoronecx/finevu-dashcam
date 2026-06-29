"use client";

import { Footer } from "@/components/Footer";
import { motion } from "motion/react";
import Link from "next/link";

/* ============================================================================
   GX35 — FineVu GX35 Cloud product page (Figma node 32:1989)
   Light, Apple-style scrolling page. Backgrounds alternate #f5f5f7 / white.
   Hero + Cloud use real product photography (public/products/*); every other
   image is a light placeholder box, matching the Figma (client to supply
   footage/lifestyle stills).
   ============================================================================ */

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const SHELL = "max-w-[1180px] mx-auto px-6";
const EYEBROW = "text-[#d9670f] text-[12.5px] font-semibold uppercase tracking-[0.22em]";
const HEAD =
  "text-[#1a1a1f] text-3xl sm:text-4xl lg:text-[2.9rem] font-bold uppercase leading-[1.05] tracking-tight";
const HEAD_PLAIN =
  "text-[#1a1a1f] text-3xl sm:text-4xl lg:text-[2.9rem] font-bold leading-[1.05] tracking-tight";
const BODY = "text-[#5c6478] text-base leading-[1.6]";

/* Light placeholder box — warm-white → cool-grey, as in the Figma image blocks. */
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
    <div
      className={`relative w-full overflow-hidden rounded-[24px] border border-[#ececf0] bg-gradient-to-b from-[#fbf9f6] to-[#eef0f4] ${ratio} ${className}`}
    >
      {label && (
        <span className="absolute inset-0 flex items-center justify-center px-8 text-center text-[13px] text-[#9aa0ad]">
          {label}
        </span>
      )}
    </div>
  );
}

/* Real product photo in a rounded frame. */
function PhotoBlock({
  src,
  alt,
  ratio = "aspect-[16/9]",
  className = "",
}: {
  src: string;
  alt: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden rounded-[24px] ${ratio} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}

const opticsCols = [
  {
    label: "Front",
    heading: "QHD wide",
    specs: ["SONY STARVIS 2 IMX675", "5.1 MP sensor", "2560 × 1440 (QHD 2K)", "147.4° field of view"],
  },
  {
    label: "Rear",
    heading: "Full-HD wide",
    specs: ["2.1 MP CMOS sensor", "1920 × 1080 (Full HD)", "143.2° field of view", "swivel mount"],
  },
  {
    label: "Core",
    heading: "Dual-core engine",
    specs: ["Allwinner V536 dual-core", "HDR auto night vision", "supercapacitor power", "microSD up to 256 GB"],
  },
];

const smarterCards = [
  {
    eyebrow: "Built-in 5GHz Wi-Fi",
    title: "Your footage, on your phone",
    body: "Live view, download clips and update firmware in the FineVu app — no SD card removal, no dongle.",
    wide: true,
  },
  {
    eyebrow: "GPS included",
    title: "Speed & location, logged",
    body: "External GPS in the box, plus speed-camera alerts.",
  },
  {
    eyebrow: "Smart time-lapse",
    title: "10fps idle, 30fps on event",
    body: "Compresses long drives, full frame rate when it counts.",
  },
  {
    eyebrow: "One-touch lock",
    title: "Protect a clip instantly",
    body: "A dedicated button saves the moment so it's never overwritten.",
  },
  {
    eyebrow: "Format Free 2.0",
    title: "No reformatting, ever",
    body: "Extends card life and reliability.",
  },
  {
    eyebrow: "Low voltage cut-off",
    title: "Battery protection built in",
    body: "Powers down before your car battery runs low.",
  },
];

const specRows: [string, string][] = [
  ["Front camera", "SONY STARVIS 2 IMX675 · 5.1 MP · 2560 × 1440 (QHD 2K) · 147.4° FOV"],
  ["Rear camera", "2.1 MP CMOS · 1920 × 1080 (Full HD) · 143.2° FOV · swivel mount"],
  ["Processor", "Allwinner V536 dual-core"],
  ["Cloud", "FineVu Cloud — live view, push impact alerts, auto event backup. Free 4 GB storage included."],
  ["Night vision", "HDR auto night vision (AI-controlled)"],
  ["Recording modes", "Continuous · Impact · Emergency · Parking (motion + impact) · Time-lapse (10fps idle / 30fps event)"],
  ["Parking mode", "Power Saving Parking — up to 98% less power, +13,950 standby hours · Absolute Parking (10s pre + 10s post impact)"],
  ["Driver assistance", "ADAS Plus — LDWS (lane departure) · FVDA (front vehicle departure alert) · Speed camera alert"],
  ["Connectivity", "Built-in 5 GHz Wi-Fi · External GPS (included)"],
  ["Power", "Supercapacitor · Low voltage cut-off · AI heat monitoring"],
  ["Storage", "microSD up to 256 GB · Format Free 2.0 · Memory allocation"],
  ["Audio", "Built-in microphone and speaker"],
  ["Safety database", "Speed camera alerts — updated regularly"],
];

const card =
  "rounded-[20px] border border-[#ececf0] bg-white p-6 shadow-[0_8px_30px_rgba(20,22,40,0.05)]";
const cardEyebrow = "text-[#d9670f] text-[11.5px] font-semibold uppercase tracking-[0.2em]";
const cardTitle = "text-[#1a1a1f] text-lg font-semibold leading-snug";
const cardBody = "text-[#5c6478] text-sm leading-[1.5]";
const statNum = "text-[#f68428] text-[40px] md:text-[44px] font-bold leading-none tracking-tight";

export default function GX35Page() {
  return (
    <main className="bg-white overflow-x-hidden">
      {/* ===================================================================
          1. HERO — full-bleed product photo + centered text overlay
      =================================================================== */}
      <section
        data-nav-theme="light"
        className="relative min-h-[560px] sm:min-h-[720px] lg:min-h-[840px] bg-[#eceef0] bg-cover bg-center"
        style={{ backgroundImage: "url(/products/gx35-hero-scene.jpg)" }}
      >
        <motion.div
          className="relative z-10 mx-auto w-full max-w-[840px] px-6 pt-[140px] text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className={EYEBROW}>FineVu GX35 Cloud · 2K QHD · 2-Channel</p>
          <h1
            className="mt-4 text-[2.25rem] sm:text-6xl lg:text-[80px] font-bold uppercase leading-[1.05] tracking-[-0.01em] whitespace-normal lg:whitespace-nowrap"
            style={{
              backgroundImage: "linear-gradient(100deg, #1a1a1f 0%, #1a1a1f 38%, #f68428 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Eyes everywhere.
          </h1>
          <p className="mt-5 mx-auto max-w-full sm:max-w-[505px] text-base leading-[1.6] text-[#3a3f4c]">
            QHD 2K clarity in a camera smaller than a credit card — now with a live view of your car
            from anywhere in the world.
          </p>
          <div className="mt-7 flex justify-center">
            <Link
              href="/where-to-buy"
              className="inline-flex h-11 w-[214px] items-center justify-center rounded-full bg-[#f68428] text-sm font-semibold uppercase tracking-[0.06em] text-white transition-transform hover:scale-[1.03]"
            >
              Find a retailer
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===================================================================
          2. CLOUD
      =================================================================== */}
      <section data-nav-theme="light" className="bg-[#f5f5f7] py-20 md:py-28">
        <div className={SHELL}>
          <motion.div className="text-center" {...fadeUp}>
            <p className={EYEBROW}>FineVu Cloud</p>
            <h2 className={`mt-4 ${HEAD}`}>Your car, live, from anywhere.</h2>
            <p className={`mt-5 mx-auto max-w-[480px] ${BODY}`}>
              Connect over Wi-Fi and the GX35 streams a live view to your phone, pushes real-time
              impact alerts, and backs up event footage to the cloud automatically — wherever you are.
              Includes free cloud storage.
            </p>
          </motion.div>
          <motion.div className="mt-12" {...fadeUp}>
            <PhotoBlock src="/products/gx35-cloud.jpg" alt="FineVu GX35 lens detail" ratio="aspect-[16/9]" />
          </motion.div>
          <p className="mt-5 text-center text-[13px] text-[#9aa0ad]">
            Cloud features require an in-car Wi-Fi connection. Free plan includes 4 GB event storage;
            unlimited live view and push alerts available on a paid plan.
          </p>
        </div>
      </section>

      {/* ===================================================================
          3. 2K QUAD HD
      =================================================================== */}
      <section data-nav-theme="light" className="bg-white py-20 md:py-28">
        <div className={SHELL}>
          <motion.div className="text-center" {...fadeUp}>
            <p className={EYEBROW}>2K Quad HD</p>
            <h2 className={`mt-4 ${HEAD}`}>Small camera. Serious detail.</h2>
            <p className={`mt-5 mx-auto max-w-[470px] ${BODY}`}>
              The front camera records 2560 × 1440 QHD at 30fps — sharp enough to read the license
              plates and road signs that matter, in a body you&apos;ll barely notice on your windshield.
            </p>
          </motion.div>
          <motion.div className="mt-12" {...fadeUp}>
            <ImgBlock ratio="aspect-[16/9]" />
          </motion.div>
          <p className="mt-5 text-center text-[13px] text-[#9aa0ad]">
            Footage shown is representative. Recording quality varies with windshield condition,
            mounting angle and lighting.
          </p>
        </div>
      </section>

      {/* ===================================================================
          4. THE OPTICS
      =================================================================== */}
      <section data-nav-theme="light" className="bg-[#f5f5f7] py-20 md:py-28">
        <div className={SHELL}>
          <motion.div {...fadeUp}>
            <p className={EYEBROW}>The optics</p>
            <h2 className={`mt-4 ${HEAD}`}>A SONY STARVIS 2 front sensor.</h2>
            <p className={`mt-5 max-w-[465px] ${BODY}`}>
              The latest-generation SONY STARVIS 2 IMX675 captures brighter, cleaner footage with less
              noise — so detail holds up in daylight, headlights, and the dark in between.
            </p>
          </motion.div>

          <motion.div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8" {...fadeUp}>
            {opticsCols.map((col) => (
              <div key={col.label}>
                <p className="text-[#d9670f] text-[11.5px] font-semibold uppercase tracking-[0.2em]">
                  {col.label}
                </p>
                <h3 className="mt-1.5 text-xl font-semibold text-[#1a1a1f]">{col.heading}</h3>
                <hr className="my-4 border-[#dededf]" />
                <ul className="space-y-2.5 text-sm text-[#5c6478]">
                  {col.specs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          <motion.div className="mt-12" {...fadeUp}>
            <ImgBlock ratio="aspect-[16/9]" />
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          5. AUTO NIGHT VISION — text left / image right
      =================================================================== */}
      <section data-nav-theme="light" className="bg-white py-20 md:py-28">
        <div className={SHELL}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeUp}>
              <p className={EYEBROW}>Auto night vision</p>
              <h2 className={`mt-4 ${HEAD}`}>Clarity the moment the sun goes down.</h2>
              <p className={`mt-5 max-w-[465px] ${BODY}`}>
                A smart AI system reads the light around you and switches night mode on at exactly the
                right moment, balancing brightness and contrast with HDR — completely hands-free.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <ImgBlock ratio="aspect-[4/3]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          6. DISCREET BY DESIGN — image left / text right
      =================================================================== */}
      <section data-nav-theme="light" className="bg-[#f5f5f7] py-20 md:py-28">
        <div className={SHELL}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div className="order-2 lg:order-1" {...fadeUp}>
              <ImgBlock
                ratio="aspect-[4/3]"
                label="Compact — Tiny GX35 beside a credit card for scale, clean bright studio"
              />
            </motion.div>
            <motion.div className="order-1 lg:order-2" {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <p className={EYEBROW}>Discreet by design</p>
              <h2 className={`mt-4 ${HEAD} lg:whitespace-nowrap`}>Smaller than a credit card.</h2>
              <p className={`mt-5 max-w-[465px] ${BODY}`}>
                The GX35 tucks neatly behind your mirror and stays out of your eyeline. A swivel mount
                lets you turn it toward a side window whenever you need a different angle.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          7. WHILE YOU'RE AWAY — bento
      =================================================================== */}
      <section data-nav-theme="light" className="bg-white py-20 md:py-28">
        <div className={SHELL}>
          <motion.div {...fadeUp}>
            <p className={EYEBROW}>While you&apos;re away</p>
            <h2 className={`mt-4 ${HEAD}`}>It never stops watching.</h2>
          </motion.div>

          <motion.div className="mt-10 grid lg:grid-cols-2 gap-3.5" {...fadeUp}>
            {/* Big card */}
            <div className={`${card} flex flex-col`}>
              <p className={cardEyebrow}>Power saving parking</p>
              <p className={`mt-3 ${statNum}`}>+13,950 hrs</p>
              <p className="mt-3 text-lg font-semibold text-[#1a1a1f]">
                98% less power than standard parking mode
              </p>
              <p className="mt-2 text-sm text-[#5c6478]">
                Keep watch for weeks without draining the car battery.
              </p>
            </div>

            {/* Right column */}
            <div className="grid gap-3.5">
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div className={`${card} min-h-[204px]`}>
                  <p className={cardEyebrow}>AI heat monitoring</p>
                  <p className={`mt-3 ${cardTitle}`}>Smart thermal control</p>
                  <p className={`mt-2 ${cardBody}`}>
                    Auto-switches to power-saving if it overheats, then back when it cools.
                  </p>
                </div>
                <div className={`${card} min-h-[204px]`}>
                  <p className={cardEyebrow}>Absolute parking</p>
                  <p className={`mt-3 ${statNum}`}>20 sec</p>
                  <p className="mt-3 text-lg font-semibold text-[#1a1a1f]">
                    10s before + 10s after an impact
                  </p>
                </div>
              </div>
              <div className={`${card} min-h-[200px]`}>
                <p className={cardEyebrow}>Motion surveillance</p>
                <p className={`mt-3 ${cardTitle}`}>A full minute of footage on any motion</p>
                <p className={`mt-2 ${cardBody}`}>
                  Catch the whole event — not just the instant it began.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          8. ADAS PLUS
      =================================================================== */}
      <section data-nav-theme="light" className="bg-[#f5f5f7] py-20 md:py-28">
        <div className={SHELL}>
          <motion.div className="text-center" {...fadeUp}>
            <p className={EYEBROW}>ADAS Plus</p>
            <h2 className={`mt-4 ${HEAD}`}>A co-pilot that never blinks.</h2>
            <p className={`mt-5 mx-auto max-w-[470px] ${BODY}`}>
              Built-in alerts watch the road and warn you out loud — when you drift from your lane,
              when the car ahead pulls away, and when you&apos;re approaching a speed camera.
            </p>
          </motion.div>

          <motion.div className="mt-12" {...fadeUp}>
            <ImgBlock ratio="aspect-[16/9]" label="ADAS — Highway with glowing lane-detection lines" />
          </motion.div>

          <motion.div className="mt-12 grid sm:grid-cols-2 gap-8" {...fadeUp}>
            <div>
              <p className="text-[#d9670f] text-[11.5px] font-semibold uppercase tracking-[0.2em]">LDWS</p>
              <p className="mt-2 text-sm text-[#5c6478] leading-[1.5]">
                Lane Departure Warning System — alerts you the moment you drift out of lane.
              </p>
            </div>
            <div>
              <p className="text-[#d9670f] text-[11.5px] font-semibold uppercase tracking-[0.2em]">FVDA</p>
              <p className="mt-2 text-sm text-[#5c6478] leading-[1.5]">
                Front Vehicle Departure Alert — tells you when the car ahead moves off in traffic.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          9. SMARTER IN EVERY WAY — bento
      =================================================================== */}
      <section data-nav-theme="light" className="bg-white py-20 md:py-28">
        <div className={SHELL}>
          <motion.div {...fadeUp}>
            <p className={EYEBROW}>Smarter in every way</p>
            <h2 className={`mt-4 ${HEAD}`}>Connected. Effortless.</h2>
          </motion.div>

          <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5" {...fadeUp}>
            {smarterCards.map((c) => (
              <div key={c.eyebrow} className={`${card} ${c.wide ? "sm:col-span-2" : ""}`}>
                <p className={cardEyebrow}>{c.eyebrow}</p>
                <p className={`mt-3 ${cardTitle}`}>{c.title}</p>
                <p className={`mt-2 ${cardBody}`}>{c.body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          10. SPECIFICATIONS
      =================================================================== */}
      <section data-nav-theme="light" className="bg-[#f5f5f7] py-20 md:py-28">
        <div className={SHELL}>
          <motion.div {...fadeUp}>
            <p className={EYEBROW}>The detail</p>
            <h2 className={`mt-4 ${HEAD_PLAIN}`}>Specifications</h2>
          </motion.div>

          <motion.dl className="mt-10 border-t border-[#e3e3e6]" {...fadeUp}>
            {specRows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-1 sm:grid-cols-[360px_1fr] gap-1 sm:gap-6 border-b border-[#e3e3e6] py-4"
              >
                <dt className="text-[#d9670f] text-[11.5px] font-semibold uppercase tracking-[0.18em] pt-0.5">
                  {label}
                </dt>
                <dd className="text-[15px] text-[#44495a] leading-[1.5]">{value}</dd>
              </div>
            ))}
          </motion.dl>
          <p className="mt-6 text-[13px] text-[#9aa0ad]">
            Specifications compiled from FineVu published materials and are subject to change.
          </p>
        </div>
      </section>

      {/* ===================================================================
          11. CLOSING WORDMARK BAND
      =================================================================== */}
      <section data-nav-theme="light" className="bg-[#f5f5f7] pb-16 pt-2 text-center">
        <p className="text-lg font-bold text-[#1a1a1f]">
          Fine<span className="text-[#f68428]">Vu</span> GX35 CLOUD
        </p>
        <p className="mt-2 text-base text-[#9aa0ad]">Eyes everywhere.</p>
      </section>

      <Footer />
    </main>
  );
}

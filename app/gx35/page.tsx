"use client";

import { Footer } from "@/components/Footer";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ============================================================================
   GX35 — FineVu GX35 Cloud product page (Figma node 32:1989)
   Apple-style light scrolling page. Image blocks are solid #656565 placeholders
   per the Figma (client to supply photography/footage).
   ============================================================================ */

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const EYEBROW = "text-[#d9670f] text-xs font-semibold uppercase tracking-[0.2em]";
const HEAD = "text-[#1a1a1f] text-3xl md:text-4xl lg:text-[2.6rem] font-bold uppercase leading-[1.05] tracking-tight";
const BODY = "text-[#5c6478] text-base md:text-lg leading-relaxed";

const gradientText = {
  backgroundImage: "linear-gradient(135deg, #1a1a1f 0%, #f68428 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text" as const,
  color: "transparent",
};
const statGradient = {
  backgroundImage: "linear-gradient(120deg, #f68428 0%, #d9670f 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text" as const,
  color: "transparent",
};

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
    <div className={`relative w-full overflow-hidden rounded-[22px] bg-[#656565] ${ratio} ${className}`}>
      {label && (
        <span className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm text-white/70">
          {label}
        </span>
      )}
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
    body: "Live view, download clips and update firmware in the FineVu app — no cables, no card removal.",
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
  ["Front camera", "SONY STARVIS 2 IMX675 · 5.1 MP · 2560 × 1440 (QHD 2K) · 147.4° FOV · 30fps"],
  ["Rear camera", "2.1 MP CMOS · 1920 × 1080 (Full HD) · 143.2° FOV · swivel mount"],
  ["Processor", "Allwinner V536 dual-core"],
  ["Cloud", "FineVu Cloud — live view, push impact alerts, automatic event upload"],
  ["Night vision", "HDR auto night vision (AI-controlled)"],
  ["Recording modes", "Continuous · Impact · Emergency · Parking (motion & impact)"],
  ["Parking mode", "Power Saving Parking — up to 98% less power, +13,950 hrs of standby watch"],
  ["Driver assistance", "ADAS Plus — LDWS (lane departure) · FVDA (front vehicle departure)"],
  ["Connectivity", "Built-in 5 GHz Wi-Fi · External GPS (included)"],
  ["Power", "Supercapacitor · Low voltage cut-off · AI heat monitoring"],
  ["Storage", "microSD up to 256 GB · Format Free 2.0 · Memory allocation"],
  ["Audio", "Built-in microphone and speaker"],
  ["Safety database", "Speed-camera alerts — updated regularly"],
];

const bentoCard =
  "rounded-[22px] border border-[#e6e6eb] bg-white p-6 md:p-7 shadow-[0_8px_30px_rgba(20,22,40,0.06)]";

export default function GX35Page() {
  return (
    <main className="bg-white overflow-x-hidden">
      {/* ===================================================================
          1. HERO
      =================================================================== */}
      <section data-nav-theme="light" className="bg-white pt-32 md:pt-40 pb-16 md:pb-20">
        <motion.div
          className="max-w-[1100px] mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className={EYEBROW}>FineVu GX35 Cloud · 2K QHD · 2-Channel</p>
          <h1
            className="mt-5 text-5xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight leading-[1.02]"
            style={gradientText}
          >
            Eyes everywhere.
          </h1>
          <p className={`mt-6 mx-auto max-w-xl ${BODY}`}>
            QHD 2K clarity in a camera smaller than a credit card — now with a live view of your car
            from anywhere in the world.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/where-to-buy"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--finevu-orange)] px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-transform hover:scale-[1.03]"
            >
              Find a retailer
            </Link>
          </div>
        </motion.div>

        <motion.div className="mt-12 md:mt-16 max-w-[1180px] mx-auto px-6" {...fadeUp}>
          <ImgBlock ratio="aspect-[16/9]" label="GX35 — front & rear cameras" />
        </motion.div>
      </section>

      {/* ===================================================================
          2. CLOUD
      =================================================================== */}
      <section data-nav-theme="light" className="bg-white py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <motion.div className="text-center max-w-2xl mx-auto" {...fadeUp}>
            <p className={EYEBROW}>FineVu Cloud</p>
            <h2 className={`mt-4 ${HEAD}`}>Your car, live, from anywhere.</h2>
            <p className={`mt-5 ${BODY}`}>
              Connect over Wi-Fi and the GX35 streams a live view to your phone, pushes impact alerts
              and uploads events automatically — so you always know what&apos;s happening to your car.
            </p>
          </motion.div>
          <motion.div className="mt-12" {...fadeUp}>
            <ImgBlock ratio="aspect-[16/9]" label="FineVu Cloud — live view on a phone" />
          </motion.div>
          <p className="mt-5 text-center text-sm text-[#9aa0ad]">
            Cloud features require an in-car Wi-Fi connection.
          </p>
        </div>
      </section>

      {/* ===================================================================
          3. 2K QUAD HD
      =================================================================== */}
      <section data-nav-theme="light" className="bg-zinc-50 py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <motion.div className="text-center max-w-2xl mx-auto" {...fadeUp}>
            <p className={EYEBROW}>2K Quad HD</p>
            <h2 className={`mt-4 ${HEAD}`}>Small camera. Serious detail.</h2>
            <p className={`mt-5 ${BODY}`}>
              The front camera records 2560 × 1440 QHD at 30fps through a SONY STARVIS 2 sensor —
              sharp number plates, clear road signs and true-to-life colour, day or night.
            </p>
          </motion.div>
          <motion.div className="mt-12" {...fadeUp}>
            <ImgBlock ratio="aspect-[16/9]" label="2K QHD footage still" />
          </motion.div>
          <p className="mt-5 text-center text-sm text-[#9aa0ad]">
            Footage shown is representative. Recording quality varies with conditions.
          </p>
        </div>
      </section>

      {/* ===================================================================
          4. THE OPTICS
      =================================================================== */}
      <section data-nav-theme="light" className="bg-white py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <motion.div className="max-w-2xl" {...fadeUp}>
            <p className={EYEBROW}>The optics</p>
            <h2 className={`mt-4 ${HEAD}`}>A SONY STARVIS 2 front sensor.</h2>
            <p className={`mt-5 ${BODY}`}>
              The latest-generation SONY STARVIS 2 IMX675 captures more light, more detail and cleaner
              night footage — paired with a Full HD rear camera and a dual-core processing engine.
            </p>
          </motion.div>

          <motion.div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" {...fadeUp}>
            {opticsCols.map((col) => (
              <div key={col.label}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9670f]">{col.label}</p>
                <h3 className="mt-1 text-2xl font-bold text-[#1a1a1f]">{col.heading}</h3>
                <hr className="my-4 border-zinc-200" />
                <ul className="space-y-2 text-sm text-[#5c6478]">
                  {col.specs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          <motion.div className="mt-12" {...fadeUp}>
            <ImgBlock ratio="aspect-[16/9]" label="GX35 lens & sensor detail" />
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          5. AUTO NIGHT VISION
      =================================================================== */}
      <section data-nav-theme="light" className="bg-zinc-50 py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div {...fadeUp}>
              <p className={EYEBROW}>Auto night vision</p>
              <h2 className={`mt-4 ${HEAD}`}>Clarity the moment the sun goes down.</h2>
              <p className={`mt-5 ${BODY}`}>
                A smart AI system reads the light around you and switches exposure automatically, lifting
                detail out of the dark without blowing out headlights or street lamps.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <ImgBlock ratio="aspect-[4/3]" label="Night-vision footage still" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          6. DISCREET BY DESIGN
      =================================================================== */}
      <section data-nav-theme="light" className="bg-white py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div className="order-2 lg:order-1" {...fadeUp}>
              <ImgBlock ratio="aspect-[4/3]" label="Compact — tiny GX35 beside a credit card for scale" />
            </motion.div>
            <motion.div className="order-1 lg:order-2" {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <p className={EYEBROW}>Discreet by design</p>
              <h2 className={`mt-4 ${HEAD}`}>Smaller than a credit card.</h2>
              <p className={`mt-5 ${BODY}`}>
                The GX35 tucks neatly behind your mirror and stays out of sight — no bulky housing, no
                obstruction of your view, just clean, premium protection.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          7. WHILE YOU'RE AWAY — bento
      =================================================================== */}
      <section data-nav-theme="light" className="bg-zinc-50 py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <motion.div {...fadeUp}>
            <p className={EYEBROW}>While you&apos;re away</p>
            <h2 className={`mt-4 ${HEAD}`}>It never stops watching.</h2>
          </motion.div>

          <motion.div className="mt-10 grid lg:grid-cols-2 gap-5" {...fadeUp}>
            {/* Big card */}
            <div className={`${bentoCard} flex flex-col justify-center`}>
              <p className={EYEBROW}>Power saving parking</p>
              <p className="mt-3 text-4xl md:text-5xl font-extrabold" style={statGradient}>
                +13,950 hrs
              </p>
              <p className="mt-3 text-lg font-semibold text-[#1a1a1f]">
                98% less power than standard parking mode
              </p>
              <p className="mt-2 text-base text-[#5c6478]">
                Keep watch for weeks without draining the car battery.
              </p>
            </div>

            {/* Right column */}
            <div className="grid gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className={bentoCard}>
                  <p className={EYEBROW}>AI heat monitoring</p>
                  <p className="mt-3 text-lg font-semibold text-[#1a1a1f]">Smart thermal control</p>
                  <p className="mt-2 text-sm text-[#5c6478]">
                    Auto-switches to power-saving if it overheats, then back when it cools.
                  </p>
                </div>
                <div className={bentoCard}>
                  <p className={EYEBROW}>Absolute parking</p>
                  <p className="mt-3 text-4xl font-extrabold" style={statGradient}>
                    20 sec
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[#1a1a1f]">
                    10s before + 10s after an impact
                  </p>
                </div>
              </div>
              <div className={bentoCard}>
                <p className={EYEBROW}>Motion surveillance</p>
                <p className="mt-3 text-lg font-semibold text-[#1a1a1f]">
                  A full minute of footage on any motion
                </p>
                <p className="mt-2 text-base text-[#5c6478]">
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
      <section data-nav-theme="light" className="bg-white py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <motion.div className="text-center max-w-2xl mx-auto" {...fadeUp}>
            <p className={EYEBROW}>ADAS Plus</p>
            <h2 className={`mt-4 ${HEAD}`}>A co-pilot that never blinks.</h2>
            <p className={`mt-5 ${BODY}`}>
              Built-in alerts watch the road and warn you out loud — so you stay focused on driving,
              not on the screen.
            </p>
          </motion.div>

          <motion.div className="mt-12" {...fadeUp}>
            <ImgBlock ratio="aspect-[16/9]" label="ADAS — highway with glowing lane-detection lines" />
          </motion.div>

          <motion.div className="mt-10 grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto" {...fadeUp}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#1a1a1f]">LDWS</p>
              <p className="mt-2 text-sm text-[#5c6478] leading-relaxed">
                Lane Departure Warning System — alerts you the moment you drift out of your lane without
                indicating.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#1a1a1f]">FVDA</p>
              <p className="mt-2 text-sm text-[#5c6478] leading-relaxed">
                Front Vehicle Departure Alert — tells you when the car ahead has pulled away, so you&apos;re
                never caught daydreaming in traffic.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          9. SMARTER IN EVERY WAY — bento
      =================================================================== */}
      <section data-nav-theme="light" className="bg-zinc-50 py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <motion.div {...fadeUp}>
            <p className={EYEBROW}>Smarter in every way</p>
            <h2 className={`mt-4 ${HEAD}`}>Connected. Effortless.</h2>
          </motion.div>

          <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" {...fadeUp}>
            {smarterCards.map((c) => (
              <div key={c.eyebrow} className={`${bentoCard} ${c.wide ? "sm:col-span-2" : ""}`}>
                <p className={EYEBROW}>{c.eyebrow}</p>
                <p className="mt-3 text-lg font-semibold text-[#1a1a1f]">{c.title}</p>
                <p className="mt-2 text-sm text-[#5c6478] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          10. SPECIFICATIONS
      =================================================================== */}
      <section data-nav-theme="light" className="bg-white py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <motion.div {...fadeUp}>
            <p className={EYEBROW}>The detail</p>
            <h2 className={`mt-4 ${HEAD}`}>Specifications</h2>
          </motion.div>

          <motion.dl className="mt-10 border-t border-zinc-200" {...fadeUp}>
            {specRows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-8 border-b border-zinc-200 py-4"
              >
                <dt className="text-sm font-semibold text-[#1a1a1f]">{label}</dt>
                <dd className="text-sm text-[#5c6478]">{value}</dd>
              </div>
            ))}
          </motion.dl>
          <p className="mt-6 text-xs text-[#9aa0ad]">
            Specifications compiled from FineVu published material and may change without notice.
          </p>
        </div>
      </section>

      {/* ===================================================================
          11. CLOSING CTA
      =================================================================== */}
      <section data-nav-theme="light" className="bg-zinc-50 py-20 md:py-28">
        <motion.div className="max-w-[900px] mx-auto px-6 text-center" {...fadeUp}>
          <p className={EYEBROW}>FineVu GX35 Cloud</p>
          <h2
            className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-[1.02]"
            style={gradientText}
          >
            Eyes everywhere.
          </h2>
          <p className={`mt-5 mx-auto max-w-lg ${BODY}`}>
            QHD 2K clarity, cloud-connected — made in Korea and backed by a 3-Year Australian Warranty.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/where-to-buy"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--finevu-orange)] px-8 py-3.5 font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Where to buy
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 px-8 py-3.5 font-semibold text-zinc-800 transition-colors hover:border-[var(--finevu-orange)] hover:text-[var(--finevu-orange)]"
            >
              Book installation
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

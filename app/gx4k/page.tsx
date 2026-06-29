"use client";

import { Footer } from "@/components/Footer";
import { motion } from "motion/react";
import Link from "next/link";

/* ============================================================================
   FineVu GX4K — premium product page (Figma frame 2:6)
   Dark cinematic layout. The hero + "Discreet by design" use real exported
   renders (public/gx4k/*). Every other media panel is a placeholder box that
   mirrors the Figma's "Image NN" slots (no invented imagery).
   ========================================================================== */

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const SECTION = "relative max-w-[1280px] mx-auto px-6 lg:px-8";
const EYEBROW =
  "text-[11.5px] font-bold uppercase tracking-[0.28em] text-[#6e8fe6]";
const HEADING =
  "font-bold uppercase tracking-tight text-white text-3xl sm:text-4xl md:text-[44px] leading-[1.05]";
const BODY = "text-[17px] md:text-[18px] leading-[1.62] text-zinc-400";
const CARD_LABEL =
  "text-[11px] font-bold uppercase tracking-[0.22em] text-[#6e8fe6]";

/* Placeholder media box — mirrors Figma's "Image NN" slots. */
function Placeholder({
  label,
  caption,
  className = "",
}: {
  label: string;
  caption: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0c0c14] ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 55%, rgba(110,143,230,0.10), transparent 60%)",
        }}
      />
      <span
        className="absolute left-5 top-5 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
        style={{ backgroundImage: "linear-gradient(90deg, #7c8ce8, #9b7fe0)" }}
      >
        {label}
      </span>
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <p className="text-center text-[13px] text-zinc-500">{caption}</p>
      </div>
    </div>
  );
}

/* Compact feature card used across the parking + connected bento grids. */
function FeatureCard({
  label,
  title,
  titleBig,
  body,
  className = "",
}: {
  label: string;
  title?: string;
  titleBig?: string;
  body?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-7 ${className}`}
    >
      <span className={`block ${CARD_LABEL}`}>{label}</span>
      {titleBig && (
        <p className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-white">
          {titleBig}
        </p>
      )}
      {title && <p className="mt-3 font-semibold text-white">{title}</p>}
      {body && (
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
      )}
    </div>
  );
}

const sensorCols = [
  {
    title: "Front",
    sub: "UHD wide",
    items: [
      "SONY STARVIS IMX515",
      "8.5 MP sensor",
      "3840 × 2160 (4K UHD)",
      "136° field of view",
    ],
  },
  {
    title: "Rear",
    sub: "Full-HD wide",
    items: [
      "2 MP CMOS sensor",
      "1920 × 1080 (Full HD)",
      "143° field of view",
      "23 g compact module",
    ],
  },
  {
    title: "Core",
    sub: "Dual-core engine",
    items: [
      "Dual-core processor",
      "HDR auto night vision",
      "microSD up to 256 GB",
      "Format Free 2.0",
    ],
  },
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

export default function GX4KPage() {
  return (
    <main className="overflow-hidden bg-[#08080c]">
      {/* ===================================================================
          1 · HERO — "4K Begins." (real composite render)
      =================================================================== */}
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
              "linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0) 60%)",
          }}
        />
        <div className="relative z-10 flex w-full max-w-[600px] flex-col items-center px-6 pt-[160px] text-center">
          <motion.p {...fadeUp} className={EYEBROW}>
            FineVu GX4K · 2-Channel UHD
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 bg-clip-text text-[58px] font-bold uppercase leading-[1.04] tracking-[-0.02em] text-transparent sm:text-7xl lg:text-[80px]"
            style={{
              backgroundImage:
                "linear-gradient(169deg, #ffffff 0%, #6e8fe6 55%, #4f2d74 100%)",
            }}
          >
            4K Begins.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-[580px] text-[18px] leading-[1.62] text-[#e0e4f0]"
          >
            The clearest view of the road you&apos;ve ever recorded — front and
            rear.
          </motion.p>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
            <Link
              href="/where-to-buy"
              className="mt-9 inline-flex items-center justify-center rounded-full px-12 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:scale-[1.03]"
              style={{
                backgroundImage:
                  "linear-gradient(24deg, #372649 10%, #4f2d74 38%, #6284d8 75%)",
              }}
            >
              Find a Retailer
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          2 · EVERY DETAIL. CAPTURED IN ULTRA HD.
      =================================================================== */}
      <section data-nav-theme="dark" className="relative py-32 md:py-44">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 30%, rgba(110,143,230,0.08), transparent 70%)",
          }}
        />
        <motion.div
          {...fadeUp}
          className={`${SECTION} flex max-w-[760px] flex-col items-center text-center`}
        >
          <p className={EYEBROW}>Crystal-Clear UHD</p>
          <h2 className={`${HEADING} mt-4`}>Every detail. Captured in Ultra HD.</h2>
          <p className={`${BODY} mt-5 max-w-[560px]`}>
            3840 × 2160 resolution on the front camera resolves the things that
            matter — license plates, road signs, the moment it all happened.
          </p>
        </motion.div>
      </section>

      {/* ===================================================================
          3 · A SONY STARVIS FRONT SENSOR.
      =================================================================== */}
      <section data-nav-theme="dark" className="py-20 md:py-24">
        <div className={SECTION}>
          <motion.div {...fadeUp}>
            <p className={EYEBROW}>The Optics</p>
            <h2 className={`${HEADING} mt-4`}>A Sony STARVIS front sensor.</h2>
            <p className={`${BODY} mt-5 max-w-[520px]`}>
              Built around an 8.5-megapixel SONY STARVIS IMX515, the GX4K pulls
              light from the scene most cameras lose to shadow — for clarity that
              holds up day or night.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
            {sensorCols.map((col, i) => (
              <motion.div key={col.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <h3 className="text-2xl font-bold text-white">{col.title}</h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6e8fe6]">
                  {col.sub}
                </p>
                <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  {col.items.map((it) => (
                    <li key={it} className="text-sm text-zinc-400">
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-14">
            <Placeholder
              label="Image 03"
              caption="Extreme macro of the lens, warm reflections on glass"
              className="h-[380px]"
            />
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          4 · THE DARK IS NO LONGER A BLIND SPOT.  (text left / image right)
      =================================================================== */}
      <section data-nav-theme="dark" className="py-20 md:py-24">
        <div className={`${SECTION} grid items-center gap-12 lg:grid-cols-2`}>
          <motion.div {...fadeUp}>
            <p className={EYEBROW}>Auto Night Vision</p>
            <h2 className={`${HEADING} mt-4`}>The dark is no longer a blind spot.</h2>
            <p className={`${BODY} mt-5 max-w-[480px]`}>
              A smart AI system reads the light around you and switches night
              mode on at exactly the right moment — balancing brightness and
              contrast automatically, completely hands-free.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
            <Placeholder
              label="Image 05"
              caption="Night driving, glowing streetlights and taillights, clean low-light"
              className="h-[330px]"
            />
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          5 · ENGINEERED AROUND LIGHT.  (image left / text right)
      =================================================================== */}
      <section data-nav-theme="dark" className="py-20 md:py-24">
        <div className={`${SECTION} grid items-center gap-12 lg:grid-cols-2`}>
          <motion.div {...fadeUp} className="lg:order-1 order-2">
            <Placeholder
              label="Image 04"
              caption="Abstract light through concentric glass lens rings"
              className="h-[330px]"
            />
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="lg:order-2 order-1">
            <p className={EYEBROW}>Light Fidelity</p>
            <h2 className={`${HEADING} mt-4`}>Engineered around light.</h2>
            <p className={`${BODY} mt-5 max-w-[480px]`}>
              From the sensor&apos;s first pixel to the final frame, every element
              is tuned to keep light clean and true — so what you record looks
              like what you saw.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          6 · IT NEVER STOPS WATCHING.  (parking bento)
      =================================================================== */}
      <section data-nav-theme="dark" className="py-20 md:py-24">
        <div className={SECTION}>
          <motion.div {...fadeUp} className="mb-12">
            <p className={EYEBROW}>While You&apos;re Away</p>
            <h2 className={`${HEADING} mt-4`}>It never stops watching.</h2>
          </motion.div>

          <div className="grid items-stretch gap-4 lg:grid-cols-2">
            {/* Left tall card */}
            <motion.div
              {...fadeUp}
              className="relative overflow-hidden rounded-[24px] border border-white/[0.06] p-7"
              style={{
                background:
                  "linear-gradient(155deg, rgba(79,45,116,0.22) 0%, rgba(13,13,22,0.55) 55%)",
              }}
            >
              <span className={CARD_LABEL}>Power Saving Parking</span>
              <p className="mt-4 text-5xl font-bold tracking-tight text-white md:text-6xl">
                +2,325 hrs
              </p>
              <p className="mt-4 font-semibold text-white">
                98% less power than standard parking mode
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Keep recording for days without draining the car battery.
              </p>
              <Placeholder
                label="Image 06"
                caption="Car parked at night, dashcam glowing orange"
                className="mt-6 h-[260px]"
              />
            </motion.div>

            {/* Right column */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FeatureCard
                  label="AI Heat Monitoring"
                  title="Smart thermal control"
                  body="Auto-switches to power-saving if it overheats, then back when it cools."
                  className="h-full"
                />
                <FeatureCard
                  label="Absolute Parking"
                  titleBig="20 sec"
                  body="10s before + 10s after an impact."
                  className="h-full"
                />
              </div>
              <FeatureCard
                label="Motion Surveillance"
                title="A full minute of footage on any motion"
                body="Catch the whole event — not just the instant it began."
                className="flex-1"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          7 · A CO-PILOT THAT NEVER BLINKS.  (ADAS)
      =================================================================== */}
      <section data-nav-theme="dark" className="py-20 md:py-24">
        <div className={SECTION}>
          <motion.div {...fadeUp} className="mx-auto max-w-[680px] text-center">
            <p className={EYEBROW}>ADAS Plus</p>
            <h2 className={`${HEADING} mt-4`}>A co-pilot that never blinks.</h2>
            <p className={`${BODY} mt-5`}>
              Integrated sensors read the road and warn you with voice alerts —
              lane drift, the car ahead pulling away, a speed camera on approach.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="mt-12">
            <Placeholder
              label="Image 08"
              caption="Highway at golden hour with glowing lane-detection lines"
              className="h-[400px]"
            />
          </motion.div>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <motion.div {...fadeUp}>
              <h3 className="text-xl font-bold text-[#6e8fe6]">FVMA</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Front Vehicle Motion Alert — tells you when the car ahead moves
                off in traffic.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.05 }}>
              <h3 className="text-xl font-bold text-[#6e8fe6]">LDWS</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Lane Departure Warning — alerts you the moment you drift out of
                lane.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          8 · CONNECTED. EFFORTLESS.  (connectivity bento)
      =================================================================== */}
      <section data-nav-theme="dark" className="py-20 md:py-24">
        <div className={SECTION}>
          <motion.div {...fadeUp} className="mb-12">
            <p className={EYEBROW}>Smarter in Every Way</p>
            <h2 className={`${HEADING} mt-4`}>Connected. Effortless.</h2>
          </motion.div>

          <div className="grid items-stretch gap-4 lg:grid-cols-3">
            {/* Row 1 — wide Wi-Fi card */}
            <motion.div
              {...fadeUp}
              className="relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-7 lg:col-span-2"
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 70% at 85% 10%, rgba(98,132,216,0.16), transparent 60%)",
                }}
              />
              <span className={`relative ${CARD_LABEL}`}>Built-In 5GHz Wi-Fi</span>
              <p className="relative mt-3 font-semibold text-white">
                Your footage, on your phone
              </p>
              <p className="relative mt-2 max-w-[460px] text-sm text-zinc-400">
                Live view, download clips and update firmware in the FineVu app —
                no SD card removal, no dongle.
              </p>
              <Placeholder
                label="Image 10"
                caption="Smartphone showing FineVu app with 4K footage preview"
                className="relative mt-6 h-[230px]"
              />
            </motion.div>

            {/* Row 1 — tall GPS card */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="h-full">
              <FeatureCard
                label="Built-In GPS"
                title="Speed & location, logged"
                body="No external module required."
                className="h-full"
              />
            </motion.div>

            {/* Row 2 — three cards */}
            <motion.div {...fadeUp}>
              <FeatureCard label="Time-Lapse" titleBig="743 min" body="Long drives, condensed." className="h-full" />
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.05 }}>
              <FeatureCard
                label="Speed Camera Alert"
                title="Always up to date"
                body="Quarterly database updates with voice & visual warnings."
                className="h-full"
              />
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <FeatureCard
                label="Format Free 2.0"
                title="No reformatting, ever"
                body="Extends card life and reliability."
                className="h-full"
              />
            </motion.div>

            {/* Row 3 — one card */}
            <motion.div {...fadeUp}>
              <FeatureCard
                label="Low Voltage Cut-Off"
                title="Battery protection built in"
                body="Powers down before your car battery runs low."
                className="h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          9 · DISCREET BY DESIGN.  (real cosmic render)
      =================================================================== */}
      <section data-nav-theme="dark" className="py-20 md:py-24">
        <div className={SECTION}>
          <motion.div {...fadeUp} className="mx-auto mb-12 max-w-[680px] text-center">
            <p className={EYEBROW}>In Your Car</p>
            <h2 className={`${HEADING} mt-4`}>Discreet by design.</h2>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="overflow-hidden rounded-[28px] border border-white/[0.06]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gx4k/discreet.png"
              alt="FineVu GX4K dash cam, machined finish on a cosmic background"
              className="block w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          10 · SPECIFICATIONS
      =================================================================== */}
      <section data-nav-theme="dark" className="py-20 md:py-28">
        <div className={SECTION}>
          <motion.div {...fadeUp} className="mb-12">
            <p className={EYEBROW}>The Detail</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-[38px]">
              Specifications
            </h2>
          </motion.div>

          <div className="border-t border-white/10">
            {specRows.map(([label, value], i) => (
              <motion.div
                key={label}
                {...fadeUp}
                transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
                className="grid grid-cols-1 gap-2 border-b border-white/10 py-5 md:grid-cols-[260px_1fr] md:gap-8"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6e8fe6]">
                  {label}
                </p>
                <p className="text-[15px] text-zinc-300">{value}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-xs text-zinc-600">
            Specifications compiled from FineVu published materials — confirm
            final figures against the official GX4K spec sheet before publishing.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

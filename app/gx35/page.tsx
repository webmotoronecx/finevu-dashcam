"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Camera,
  Cpu,
  MapPin,
  HardDrive,
  ShieldCheck,
  Moon,
  Gauge,
  Thermometer,
  ParkingCircle,
  BatteryCharging,
  Wifi,
  ScanEye,
  CarFront,
  PersonStanding,
  Smartphone,
  Globe,
  Share2,
  Package,
  CheckCircle2,
  Award,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { ReportPreview } from "@/components/ReportPreview";
import { TiltCard } from "@/components/TiltCard";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

/* Shared motion presets */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

/* Official FineVu GX35 product photography */
const productHero = "/products/gx35-hero.jpg";
const productStudio = "/products/gx35-studio.jpg";

const keySpecs = [
  { icon: Camera, title: "HD 2K front camera", desc: "Sharp 2K capture of the road ahead, day and night." },
  { icon: Camera, title: "Full HD rear camera", desc: "1080p coverage watching everything behind you." },
  { icon: Cpu, title: "SONY STARVIS sensor", desc: "Premium low-light imaging for clearer night footage." },
  { icon: Wifi, title: "Built-in GPS & Wi-Fi", desc: "Location, speed and route data, synced to your phone." },
  { icon: HardDrive, title: "64GB SD card included", desc: "Ready to record straight out of the box." },
  { icon: ScanEye, title: "ADAS Plus programmed", desc: "Driver-assist alerts configured and ready to go." },
  { icon: BatteryCharging, title: "Car battery protection", desc: "Smart voltage cut-off keeps your battery safe." },
  { icon: Moon, title: "Auto night vision", desc: "Automatically adapts exposure for low-light driving." },
  { icon: Gauge, title: "Speed camera alerts", desc: "Stay aware of fixed speed and red-light cameras." },
  { icon: Thermometer, title: "Heat monitoring", desc: "Protects the cam in high-temperature conditions." },
  { icon: ParkingCircle, title: "Park mode recording*", desc: "Guards your car while you're away from it." },
];

const adasFeatures = [
  { icon: ScanEye, title: "Lane departure warning", desc: "Alerts you if you drift out of your lane unintentionally." },
  { icon: CarFront, title: "Forward collision warning", desc: "Warns when you're closing in too fast on the car ahead." },
  { icon: PersonStanding, title: "Pedestrian detection", desc: "Flags people detected in your forward path." },
  { icon: Camera, title: "Blind-spot awareness", desc: "Extra eyes on the areas you can't easily see." },
];

const appFeatures = [
  { icon: Smartphone, title: "View, download & share", desc: "Pull clips straight to your phone and share in a tap." },
  { icon: ParkingCircle, title: "Parking mode control", desc: "Arm, disarm and review park-mode events remotely." },
  { icon: Globe, title: "Full web browser access", desc: "Everything from the app, also available on the web." },
];

const boxContents = [
  "2K front camera",
  "Full HD rear camera",
  "micro SD card & adapter",
  "plug & play front cable",
  "hardwire power rear cable",
  "user manual",
];

const trustMarks = ["Made in Korea", "3-Year Australian Warranty^", "4 million+ sold worldwide", "SONY STARVIS sensor"];

export default function GX35Page() {
  return (
    <main className="bg-white">
      {/* ===================================================================
          1. HERO
      =================================================================== */}
      <section
        data-nav-theme="dark"
        className="brand-gradient-soft relative overflow-hidden pt-32 md:pt-40 pb-24 md:pb-32"
      >
        {/* Giant 2K watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden">
          <span className="text-[16rem] font-bold text-white opacity-20 leading-none -mr-8 select-none">
            2K
          </span>
        </div>

        <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div {...fadeUp} className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="finevu-capsule font-mono text-xs tracking-wider">
                FRONT &amp; REAR · 2CH
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/20">
                <Award className="w-3.5 h-3.5 text-[var(--finevu-orange)]" />
                Best Value
              </span>
            </div>

            <p className="text-white/70 text-lg font-medium mb-3">
              Front &amp; Rear GX35 2K Dash Cam 2CH
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
              GX35 2K
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-white/90 mb-8">
              Record Every Moment in 2K.
            </p>
            <p className="text-lg text-white/70 max-w-xl mb-10">
              Premium FineVu protection and smart features at a more accessible price.
              The same trusted FineVu engineering — a smart choice for upgrading from basic HD.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/where-to-buy"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--finevu-orange)] px-8 py-4 font-bold text-white transition-transform hover:scale-[1.03]"
              >
                Where to Buy
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-4 font-bold text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/20"
              >
                Book Installation
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
              {trustMarks.map((mark) => (
                <span key={mark} className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-[var(--finevu-orange)]" />
                  {mark}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          2. KEY SPECS GRID
      =================================================================== */}
      <section data-nav-theme="light" className="bg-zinc-50 py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div {...fadeUp} className="max-w-2xl mb-14">
            <p className="font-mono text-xs tracking-wider text-[var(--finevu-orange)] uppercase mb-4">
              Key specs
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
              Everything you need, packed in.
            </h2>
            <p className="mt-4 text-lg text-[var(--finevu-grey)]">
              The GX35 ships ready to protect — premium imaging, smart driver alerts
              and a 64GB card in the box.
            </p>
          </motion.div>

          {/* Product showcase */}
          <motion.div
            {...fadeUp}
            className="mb-14 overflow-hidden rounded-[2rem] bg-white ring-1 ring-zinc-200"
          >
            <ImageWithFallback
              src={productHero}
              alt="FineVu GX35 2K front and rear dash cam"
              className="w-full aspect-[16/7] object-cover"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {keySpecs.map((spec, i) => (
              <motion.div
                key={spec.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="group h-full rounded-[2rem] bg-white p-7 ring-1 ring-zinc-200 transition-all hover:ring-[var(--finevu-orange)] hover:shadow-lg">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--finevu-orange)]/10 text-[var(--finevu-orange)]">
                    <spec.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-black">{spec.title}</h3>
                  <p className="mt-2 text-sm text-[var(--finevu-grey)]">{spec.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. WHY 2K
      =================================================================== */}
      <section data-nav-theme="dark" className="brand-gradient relative overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-start overflow-hidden">
          <span className="text-[16rem] font-bold text-white opacity-20 leading-none -ml-8 select-none">
            2K
          </span>
        </div>

        <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div {...fadeUp}>
              <p className="font-mono text-xs tracking-wider text-[var(--finevu-orange)] uppercase mb-4">
                Why 2K
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Premium protection. <span className="text-[var(--finevu-orange)]">Smarter price.</span>
              </h2>
              <p className="mt-6 text-lg text-white/70">
                The GX35 balances clarity, features and value — ideal for everyday drivers
                who still want premium protection. You get sharp 2K front footage, Full HD
                rear coverage and the full suite of FineVu smart alerts, without paying for 4K.
              </p>
              <p className="mt-4 text-lg text-white/70">
                Same trusted FineVu engineering. A smarter way to step up from basic HD.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="grid grid-cols-2 gap-5"
            >
              {[
                { value: "2K", label: "Front resolution" },
                { value: "1080p", label: "Rear resolution" },
                { value: "64GB", label: "SD card included" },
                { value: "3-Yr", label: "Aus warranty^" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[2rem] bg-white/5 p-7 ring-1 ring-white/10 backdrop-blur"
                >
                  <p className="text-4xl md:text-5xl font-bold text-brand-gradient bg-white bg-clip-text">
                    <span className="text-white">{stat.value}</span>
                  </p>
                  <p className="mt-2 text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. SAFETY / ADAS
      =================================================================== */}
      <section data-nav-theme="light" className="bg-white py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div {...fadeUp} className="relative">
              <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-zinc-200">
                <ImageWithFallback
                  src={productStudio}
                  alt="FineVu GX35 front and rear cameras"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="finevu-capsule font-mono text-xs tracking-wider">
                    ADAS PLUS
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp}>
              <p className="font-mono text-xs tracking-wider text-[var(--finevu-orange)] uppercase mb-4">
                Safety &amp; driver assist
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
                Smart alerts that watch your back.
              </h2>
              <p className="mt-4 text-lg text-[var(--finevu-grey)]">
                The GX35 carries the same ADAS feature set as the rest of the FineVu range,
                helping you stay aware on every drive.
              </p>

              <div className="mt-10 grid sm:grid-cols-2 gap-6">
                {adasFeatures.map((f) => (
                  <div key={f.title} className="flex gap-4">
                    <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--finevu-orange)]/10 text-[var(--finevu-orange)]">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">{f.title}</h3>
                      <p className="mt-1 text-sm text-[var(--finevu-grey)]">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 flex items-start gap-2 text-sm text-[var(--finevu-grey)]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--finevu-orange)]" />
                Hardwiring is required for all ADAS features to function.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. APP
      =================================================================== */}
      <section data-nav-theme="dark" className="brand-gradient relative overflow-hidden py-24 md:py-32">
        <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div {...fadeUp}>
              <p className="font-mono text-xs tracking-wider text-[var(--finevu-orange)] uppercase mb-4">
                FineVu app
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Seamless access via the FineVu app.
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Connect over Wi-Fi to view, manage and share your footage — from your phone
                or any web browser.
              </p>

              <div className="mt-10 space-y-6">
                {appFeatures.map((f) => (
                  <div key={f.title} className="flex gap-4">
                    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--finevu-orange)] ring-1 ring-white/15">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{f.title}</h3>
                      <p className="mt-1 text-sm text-white/60">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm">
                <ReportPreview />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          6. WHAT'S IN THE BOX
      =================================================================== */}
      <section
        data-nav-theme="dark"
        className="bg-[var(--finevu-charcoal)] py-24 md:py-32"
      >
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div {...fadeUp} className="max-w-2xl mb-14">
            <p className="font-mono text-xs tracking-wider text-[var(--finevu-orange)] uppercase mb-4">
              In the box
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              What&apos;s in the box.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {boxContents.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex h-full items-center gap-4 rounded-[2rem] bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--finevu-orange)]/15 text-[var(--finevu-orange)]">
                    <Package className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-white">{item}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3.5 font-bold text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
            >
              DIY or professional installation available
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          7. CROSS-SELL
      =================================================================== */}
      <section data-nav-theme="light" className="bg-zinc-50 py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div {...fadeUp}>
            <TiltCard className="rounded-[2rem]">
              <div className="brand-gradient relative overflow-hidden rounded-[2rem] p-10 md:p-16">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden">
                  <span className="text-[16rem] font-bold text-white opacity-20 leading-none -mr-10 select-none">
                    4K
                  </span>
                </div>
                <div className="relative max-w-xl">
                  <p className="font-mono text-xs tracking-wider text-[var(--finevu-orange)] uppercase mb-4">
                    Step up
                  </p>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                    Want ultimate 4K clarity? Meet the GX4K.
                  </h2>
                  <p className="mt-4 text-lg text-white/70">
                    If you want the sharpest footage FineVu makes, the GX4K steps up to
                    true 4K front recording.
                  </p>
                  <Link
                    href="/gx4k"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--finevu-orange)] px-8 py-4 font-bold text-white transition-transform hover:scale-[1.03]"
                  >
                    Explore the GX4K
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          8. FINAL CTA
      =================================================================== */}
      <section
        data-nav-theme="dark"
        className="brand-gradient-soft relative overflow-hidden py-24 md:py-32"
      >
        <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Record every moment.
            </h2>
            <p className="mt-5 text-lg text-white/70">
              Get the GX35 2K fitted and protect every drive — front and rear.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/where-to-buy"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--finevu-orange)] px-8 py-4 font-bold text-white transition-transform hover:scale-[1.03]"
              >
                Where to Buy
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-4 font-bold text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/20"
              >
                Book Installation
              </Link>
            </div>

            {/* Footnotes */}
            <div className="mt-14 space-y-1 text-xs text-white/50">
              <p>* Recording triggered by motion.</p>
              <p>^ Nationwide warranty terms, conditions and exclusions apply.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { ReportPreview } from '@/components/ReportPreview';
import { TiltCard } from '@/components/TiltCard';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Camera,
  Video,
  Cpu,
  Wifi,
  HardDrive,
  Gauge,
  BatteryCharging,
  Moon,
  AlertTriangle,
  Thermometer,
  ParkingSquare,
  Clock,
  CheckCircle2,
  MapPin,
  Eye,
  CarFront,
  PackageOpen,
  ChevronRight,
} from 'lucide-react';

// Official FineVu GX4K product photography.
const productHero = '/products/gx4k-hero.jpg';
const productStudio = '/products/gx4k-studio.jpg';
// Lifestyle/footage imagery (Unsplash placeholder — swap for FineVu footage stills).
const roadImage =
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const specs = [
  { icon: Camera, title: 'HD 4K Front Camera', desc: 'Ultra HD 3840×2160 recording captures the road in stunning detail.' },
  { icon: Video, title: 'Full HD Rear Camera', desc: 'Sharp 1080p rear coverage protects you from behind, day and night.' },
  { icon: Cpu, title: 'SONY STARVIS Sensor', desc: 'Premium low-light image sensor for clarity in any conditions.' },
  { icon: Wifi, title: 'Built-in GPS & Wi-Fi', desc: 'Tag every clip with speed and location, then connect over Wi-Fi.' },
  { icon: HardDrive, title: '128GB SD Card Included', desc: 'Plenty of high-endurance storage in the box, ready to record.' },
  { icon: Gauge, title: 'ADAS Plus Programmed', desc: 'Advanced driver-assistance alerts come pre-configured.' },
  { icon: BatteryCharging, title: 'Car Battery Protection', desc: 'Smart voltage cut-off prevents draining your battery flat.' },
  { icon: Moon, title: 'Auto Night Vision', desc: 'Adaptive exposure keeps footage usable after dark.' },
  { icon: AlertTriangle, title: 'Speed Camera Alerts', desc: 'GPS-based warnings help you stay aware on every route.' },
  { icon: Thermometer, title: 'Heat Monitoring', desc: 'On-board thermal protection guards the camera in the heat.' },
  { icon: ParkingSquare, title: 'Park Mode Recording*', desc: 'Keeps watch over your car while parked and unattended.' },
  { icon: Clock, title: 'Time Lapse Control', desc: 'Compress long journeys or parking sessions into compact files.' },
];

const adasFeatures = [
  { title: 'Lane Departure Warning', desc: 'Alerts you if the vehicle drifts out of its lane without indicating.' },
  { title: 'Forward Collision Warning', desc: 'Warns when you are closing in too quickly on the car ahead.' },
  { title: 'Pedestrian Warnings', desc: 'Flags pedestrians in your path so you can react sooner.' },
  { title: 'Blind-Spot Detection', desc: 'Helps you change lanes with greater confidence and awareness.' },
];

const boxContents = [
  '4K front camera',
  '1080p rear camera',
  'Micro SD card & adapter',
  'Plug & play front cable',
  'Hardwire power rear cable',
  'User manual',
];

const trustRow = ['SONY STARVIS', 'Made in Korea', '3-Year AU Warranty'];

export default function GX4KPage() {
  return (
    <main className="overflow-hidden">
      {/* ====================================================================
          1. HERO
      ==================================================================== */}
      <section
        data-nav-theme="dark"
        className="relative brand-gradient text-white pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden"
      >
        {/* GX4K product hero image (right side, blends into the brand gradient) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[58%]">
          <ImageWithFallback
            src={productHero}
            alt="FineVu GX4K front and rear dash cam"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a16] via-[#0a0a16]/55 to-transparent" />
          <div className="absolute inset-0 lg:hidden bg-black/45" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="max-w-3xl">
            <motion.span
              {...fadeUp}
              className="finevu-capsule font-mono"
            >
              FRONT &amp; REAR · 2CH
            </motion.span>

            <motion.h1
              {...fadeUp}
              transition={{ delay: 0.05 }}
              className="mt-6 text-7xl md:text-8xl font-bold tracking-tight"
            >
              GX4K
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="mt-4 text-2xl md:text-3xl font-bold text-white/90"
            >
              Crystal Clear 4K Recording for Every Drive.
            </motion.p>

            <motion.p
              {...fadeUp}
              transition={{ delay: 0.15 }}
              className="mt-5 text-lg text-zinc-300 max-w-xl"
            >
              The flagship Front &amp; Rear GX4K Dash Cam 2CH. True 4K up front, Full HD
              behind, and a complete safety system built in.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.2 }}
              className="mt-9 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/where-to-buy"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--finevu-orange)] px-8 py-4 font-semibold text-white transition-transform hover:scale-[1.03]"
              >
                Where to Buy
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Book Installation
              </Link>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.25 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-mono text-zinc-300"
            >
              {trustRow.map((t, i) => (
                <span key={t} className="flex items-center gap-2">
                  {i > 0 && <span className="text-white/30">·</span>}
                  <ShieldCheck className="w-4 h-4 text-[var(--finevu-orange)]" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. KEY SPECS GRID
      ==================================================================== */}
      <section data-nav-theme="light" className="bg-zinc-50 py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div {...fadeUp} className="max-w-2xl">
            <span className="font-mono text-xs tracking-widest text-[var(--finevu-orange)] uppercase">
              The Specs
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-zinc-900">
              Engineered to never miss a thing.
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Every feature you would expect from a premium dash cam, included as
              standard on the GX4K.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {specs.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <motion.div
                  key={spec.title}
                  {...fadeUp}
                  transition={{ delay: (i % 4) * 0.05 }}
                >
                  <div className="h-full bg-white rounded-[2rem] p-7 border border-zinc-100 transition-shadow hover:shadow-lg">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--finevu-orange)]/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[var(--finevu-orange)]" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-zinc-900">{spec.title}</h3>
                    <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{spec.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.p {...fadeUp} className="mt-8 text-xs text-zinc-500">
            * Recording triggered by motion.
          </motion.p>
        </div>
      </section>

      {/* ====================================================================
          3. 4K CLARITY
      ==================================================================== */}
      <section
        data-nav-theme="dark"
        className="relative bg-black text-white py-24 md:py-32 overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp}>
              <span className="font-mono text-xs tracking-widest text-[var(--finevu-orange)] uppercase">
                Resolution
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold">
                True <span className="text-brand-gradient">4K Ultra HD.</span>
              </h2>
              <p className="mt-5 text-lg text-zinc-400 max-w-lg">
                The GX4K captures every detail that matters &mdash; from licence plates
                two lanes over to the fine print on a distant street sign. When the
                footage has to count, choose 4K for the best possible clarity.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-8 max-w-md">
                <div>
                  <div className="text-4xl font-bold text-[var(--finevu-orange)]">
                    <AnimatedCounter end={4} suffix="K" />
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">Front resolution (3840&times;2160)</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[var(--finevu-orange)]">
                    <AnimatedCounter end={4} suffix="M+" />
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">FineVu cameras sold worldwide</p>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 aspect-[4/3]">
                <ImageWithFallback
                  src={roadImage}
                  alt="Open road captured in crisp 4K detail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-5 left-5 finevu-capsule font-mono">
                  3840 × 2160
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. SAFETY / ADAS
      ==================================================================== */}
      <section data-nav-theme="light" className="bg-white py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <motion.div {...fadeUp}>
              <span className="font-mono text-xs tracking-widest text-[var(--finevu-orange)] uppercase">
                ADAS Plus
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold text-zinc-900">
                Not just a dash cam. A safety system.
              </h2>
              <p className="mt-5 text-lg text-zinc-600 max-w-lg">
                The GX4K does more than record. Its advanced driver-assistance system
                actively helps you stay aware of what is happening around the vehicle.
              </p>
              <div className="mt-8 inline-flex items-start gap-3 rounded-2xl bg-zinc-50 border border-zinc-100 p-5 max-w-lg">
                <Cpu className="w-5 h-5 text-[var(--finevu-orange)] shrink-0 mt-0.5" />
                <p className="text-sm text-zinc-600">
                  The camera must be hard-wired to experience all ADAS features.
                  Professional installation is recommended.
                </p>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5">
              {adasFeatures.map((f, i) => (
                <motion.div key={f.title} {...fadeUp} transition={{ delay: (i % 2) * 0.05 }}>
                  <TiltCard className="h-full">
                    <div className="h-full rounded-[2rem] bg-zinc-50 border border-zinc-100 p-7">
                      <Eye className="w-6 h-6 text-[var(--finevu-orange)]" />
                      <h3 className="mt-4 text-lg font-bold text-zinc-900">{f.title}</h3>
                      <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{f.desc}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. APP
      ==================================================================== */}
      <section
        data-nav-theme="dark"
        className="relative brand-gradient text-white py-24 md:py-32 overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp} className="order-2 lg:order-1 max-w-lg mx-auto w-full">
              <ReportPreview />
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="order-1 lg:order-2">
              <span className="font-mono text-xs tracking-widest text-[var(--finevu-orange)] uppercase">
                FineVu App
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold">
                Your footage, anywhere.
              </h2>
              <p className="mt-5 text-lg text-zinc-300 max-w-lg">
                Connect over built-in Wi-Fi to view, save and share clips straight from
                your phone. Every recording is GPS-tagged with speed and location, so
                the full story is always there when you need it.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: Wifi, text: 'Instant Wi-Fi connection to your dash cam' },
                  { icon: MapPin, text: 'GPS speed and location stamped on every clip' },
                  { icon: ArrowUpRight, text: 'Save and share footage in a couple of taps' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.text} className="flex items-center gap-3 text-zinc-200">
                      <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[var(--finevu-orange)]" />
                      </span>
                      {item.text}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. WHAT'S IN THE BOX
      ==================================================================== */}
      <section
        data-nav-theme="dark"
        className="bg-[var(--finevu-charcoal)] text-white py-24 md:py-32"
      >
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp}>
              <span className="font-mono text-xs tracking-widest text-[var(--finevu-orange)] uppercase">
                In the Box
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold">
                Everything you need to get started.
              </h2>
              <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {boxContents.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-200">
                    <CheckCircle2 className="w-5 h-5 text-[var(--finevu-orange)] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-[2rem] bg-black/30 border border-white/10 p-7">
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-2xl bg-[var(--finevu-orange)]/15 flex items-center justify-center shrink-0">
                    <PackageOpen className="w-5 h-5 text-[var(--finevu-orange)]" />
                  </span>
                  <div>
                    <h3 className="font-bold">DIY or professional installation available</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      Plug &amp; play it yourself, or have it expertly hard-wired to unlock
                      every ADAS and Park Mode feature.
                    </p>
                    <Link
                      href="/services"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--finevu-orange)] hover:gap-2.5 transition-all"
                    >
                      View installation services
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-xs text-zinc-500">
                ^ Nationwide warranty terms, conditions and exclusions apply.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 aspect-[4/3]">
                <ImageWithFallback
                  src={productStudio}
                  alt="FineVu GX4K front and rear cameras"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2 text-sm font-mono text-zinc-200">
                  <CarFront className="w-4 h-4 text-[var(--finevu-orange)]" />
                  Fits virtually any vehicle
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. CROSS-SELL STRIP
      ==================================================================== */}
      <section data-nav-theme="light" className="bg-zinc-50 py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div {...fadeUp}>
            <Link
              href="/gx35"
              className="group block rounded-[2rem] bg-white border border-zinc-100 p-8 md:p-12 transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="font-mono text-xs tracking-widest text-[var(--finevu-orange)] uppercase">
                    Compare
                  </span>
                  <h2 className="mt-3 text-3xl md:text-4xl font-bold text-zinc-900">
                    Prefer 2K value? Meet the GX35.
                  </h2>
                  <p className="mt-3 text-zinc-600 max-w-xl">
                    The GX35 brings sharp 2K front recording and the same trusted FineVu
                    safety features at a friendlier price point.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-7 py-4 font-semibold text-white shrink-0 transition-transform group-hover:scale-[1.03]">
                  Explore the GX35
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          8. FINAL CTA
      ==================================================================== */}
      <section
        data-nav-theme="dark"
        className="relative brand-gradient text-white py-24 md:py-32 overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
          <span className="text-[16rem] leading-none font-bold text-white opacity-20">4K</span>
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.h2 {...fadeUp} className="text-4xl md:text-6xl font-bold max-w-3xl mx-auto uppercase">
            Ask more of your dash cam.
          </motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.05 }} className="mt-5 text-lg text-zinc-300 max-w-xl mx-auto">
            Get the Front &amp; Rear GX4K fitted by the experts, or find your nearest
            stockist today.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/where-to-buy"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--finevu-orange)] px-8 py-4 font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Where to Buy
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Book Installation
            </Link>
          </motion.div>
          <motion.p {...fadeUp} transition={{ delay: 0.15 }} className="mt-8 text-sm font-mono text-zinc-400">
            Distributed in Australia by Auto Xtreme · 1800 818 288
          </motion.p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

"use client";

import { Footer } from '@/components/Footer';
import { BrandMarquee } from '@/components/BrandMarquee';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import {
  ShieldCheck, Users, Award, ChevronRight, ArrowUpRight, ArrowRight,
  Wifi, MapPin, Moon, Radio, Cpu, CheckCircle, TrendingUp,
  BadgeCheck, CalendarClock, ScanEye, ParkingSquare, Thermometer,
  Gauge, Camera, Wrench
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from "next/link";
import { ScrollProgress } from '@/components/ScrollProgress';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { TiltCard } from '@/components/TiltCard';
import { ParticleBackground } from '@/components/GridBackground';
import { Hero } from '@/components/Hero';
import { ReportPreview } from '@/components/ReportPreview';
import { ReviewCard } from '@/components/ReviewCard';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

// "The No.1 dash cam brand in Korea." — proven-performance cards.
const provenStats = [
  { icon: TrendingUp, title: "No.1 Market Share", desc: "The most-trusted dash cam brand in its home market of Korea." },
  { icon: BadgeCheck, title: "<0.2% Field Defect Rate", desc: "Built to an exacting standard — reliability the numbers prove." },
  { icon: ShieldCheck, title: "3 Years Warranty", desc: "Backed locally in Australia, with support you can actually call." },
  { icon: CalendarClock, title: "15+ Years", desc: "Engineering automotive-IT since 2009 under FINEDIGITAL." },
];

// "Not just a dash cam. A safety system." — safety cards.
const safetyFeatures = [
  { icon: Cpu, title: "ADAS Plus", desc: "Lane departure, forward collision, pedestrian and blind-spot warnings — your safety co-pilot on every drive." },
  { icon: Radio, title: "24/7 Parking Mode", desc: "Smart Sense parking surveillance records impacts and motion automatically, even when you're away." },
  { icon: Moon, title: "Auto Night Vision", desc: "SONY STARVIS image sensors deliver sharp, clear footage day and night." },
  { icon: MapPin, title: "Built-in GPS & Wi-Fi", desc: "Tag every clip with location and speed, then view, save and share over Wi-Fi via the FineVu app." },
];

// "A co-pilot that never blinks." — intelligence cards.
const intelligenceCards = [
  { icon: ScanEye, title: "AI Damage Detection 2.0", desc: "Instantly flags collision events with AI precision." },
  { icon: ParkingSquare, title: "Power-Saving Parking", desc: "98% less power draw while your car sits idle." },
  { icon: Thermometer, title: "AI Heat Monitoring", desc: "Protects footage and hardware in extreme temps." },
  { icon: Gauge, title: "ADAS Plus", desc: "Lane departure, forward collision and distance warnings." },
  { icon: Camera, title: "Speed Camera Alert", desc: "Real-time alerts with built-in GPS mapping." },
  { icon: Wifi, title: "Built-in GPS & Wi-Fi", desc: "Connect to the FineVu app for instant clip access." },
];

// NOTE: lifestyle/guide imagery uses Unsplash placeholders — swap for official
// FineVu photography when available.
const educationCards = [
  {
    slug: "4k-vs-2k-dash-cam",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "4K vs 2K: which dash cam is right for you?",
    description: "Ultra-sharp 4K clarity or dependable 2K value — how to choose the FineVu that fits your drive.",
  },
  {
    slug: "how-adas-keeps-you-safer",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "How ADAS keeps you safer",
    description: "Lane departure, forward collision and pedestrian warnings explained — and why hardwiring matters.",
  },
  {
    slug: "parking-mode-explained",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Parking mode, explained",
    description: "How FineVu watches over your vehicle 24/7 and captures incidents while you're parked.",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />
      <Hero />
      <BrandMarquee />

      {/* Content wrapper */}
      <div className="relative z-10 bg-white">

        {/* Featured products */}
        <section className="py-24 bg-zinc-50" data-nav-theme="light">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <motion.div className="text-center mb-14" {...fadeUp}>
              <span className="finevu-capsule mb-5">FRONT &amp; REAR · 2CH</span>
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">
                Featured Products
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GX4K */}
              <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
                <Link href="/gx4k" className="block group h-full">
                  <div className="rounded-[2rem] overflow-hidden border border-zinc-200 bg-white hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-zinc-100 to-zinc-200 overflow-hidden">
                      <ImageWithFallback
                        src="/products/gx4k-studio.jpg"
                        alt="FineVu GX4K 4K front and rear dash cam"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-5 left-5 finevu-capsule">4K UHD</span>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">GX4K</h3>
                      <p className="text-zinc-600 leading-relaxed mb-6 flex-grow">
                        Crystal clear 4K recording for every drive. True 4K Ultra HD captures licence plates and street signs with SONY STARVIS clarity.
                      </p>
                      <div className="flex items-center gap-2 text-[var(--finevu-orange)] group-hover:gap-3 transition-all">
                        <span className="text-sm font-semibold uppercase tracking-widest">Explore GX4K</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* GX35 */}
              <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
                <Link href="/gx35" className="block group h-full">
                  <div className="rounded-[2rem] overflow-hidden border border-zinc-200 bg-white hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-zinc-100 to-zinc-200 overflow-hidden">
                      <ImageWithFallback
                        src="/products/gx35-hero.jpg"
                        alt="FineVu GX35 2K front and rear dash cam"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider">2K · Best Value</span>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">GX35 2K</h3>
                      <p className="text-zinc-600 leading-relaxed mb-6 flex-grow">
                        Record every moment in 2K. Premium FineVu protection and features at a more accessible price point — the same trusted engineering.
                      </p>
                      <div className="flex items-center gap-2 text-[var(--finevu-orange)] group-hover:gap-3 transition-all">
                        <span className="text-sm font-semibold uppercase tracking-widest">Explore GX35</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* The No.1 dash cam brand in Korea */}
        <section className="py-24 bg-zinc-100" data-nav-theme="light">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <motion.div className="text-center max-w-3xl mx-auto mb-14" {...fadeUp}>
              <span className="finevu-capsule mb-5">Proven Performance</span>
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-5">
                The No.1 dash cam brand in Korea.
              </h2>
              <p className="text-zinc-600 text-lg leading-relaxed">
                Built by FINEDIGITAL, an automotive-IT specialist since 2009, held to a standard the numbers prove.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {provenStats.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    className="rounded-[1.75rem] bg-white border border-zinc-200 p-8 hover:shadow-xl transition-all duration-500"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-[var(--finevu-orange)]/10 flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5 text-[var(--finevu-orange)]" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">{f.title}</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Not just a dash cam. A safety system. */}
        <section className="py-24 bg-white" data-nav-theme="light">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
            <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeUp} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-6">
                Not just a dash cam. A safety system.
              </h2>
              <p className="text-lg text-zinc-600 leading-relaxed">
                FineVu turns your dash cam into a smart co-pilot — alerting you to dangers on the road and watching over your vehicle when you&apos;re away.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {safetyFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    className="rounded-[1.75rem] border border-zinc-200 p-8 hover:border-[var(--finevu-orange)]/40 hover:shadow-xl transition-all duration-500 bg-white h-full"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-[var(--finevu-orange)]/10 flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5 text-[var(--finevu-orange)]" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">{f.title}</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-xs text-zinc-400 mt-8 text-center">The FineVu camera must be hard-wired to experience all ADAS features.</p>
          </div>
        </section>

        {/* Installation — we'll come to you */}
        <section className="py-24 bg-black" data-nav-theme="dark">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
            <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeUp} transition={{ duration: 0.8 }}>
              <span className="finevu-capsule mb-5">Installation</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                We&apos;ll come to you
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                Book a FineVu mobile installer to fit your dash cam at home or work — fully hardwired, fully tested, fully covered.
              </p>
            </motion.div>

            {/* Image placeholder — solid #656565 box per Figma. Client to supply art. */}
            <motion.div
              className="rounded-[2.5rem] overflow-hidden aspect-[16/7] max-w-5xl mx-auto bg-[#656565]"
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            <motion.div className="flex justify-center mt-10" {...fadeUp} transition={{ duration: 0.8, delay: 0.3 }}>
              <Link href="/booking">
                <motion.button
                  className="px-9 py-3.5 rounded-full bg-[var(--finevu-orange)] text-white font-semibold text-sm uppercase tracking-wider smooth-transition hover:shadow-[0_0_30px_var(--electric-glow)]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Installation
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* App — your footage, anywhere */}
        <section className="py-24 brand-gradient overflow-hidden" data-nav-theme="dark">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <TiltCard>
                  <ReportPreview className="w-full max-w-sm mx-auto shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500" />
                </TiltCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="finevu-capsule mb-6">FineVu App</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                  Your footage, anywhere.
                </h2>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Wi-Fi and GPS connectivity make it easy to view, save and share footage whenever you need it — no need to remove the memory card. Share important clips with family, friends or insurers in just a few taps.
                </p>
                <div className="space-y-4 mb-10">
                  {[
                    { icon: Wifi, t: "Live view & instant download over Wi-Fi" },
                    { icon: MapPin, t: "GPS location, speed and route on every clip" },
                    { icon: Radio, t: "Parking mode control and event playback" },
                  ].map((row, i) => {
                    const Icon = row.icon;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-[var(--finevu-orange)]" />
                        </div>
                        <span className="text-white/90">{row.t}</span>
                      </div>
                    );
                  })}
                </div>
                <Link href="/how-it-works">
                  <button className="px-8 py-3 rounded-full bg-[var(--finevu-orange)] text-white hover:scale-105 transition-transform font-semibold text-sm uppercase tracking-wider">
                    See how it works
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* A co-pilot that never blinks — intelligence */}
        <section className="py-24 bg-white" data-nav-theme="light">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
            <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeUp} transition={{ duration: 0.8 }}>
              <span className="finevu-capsule mb-5">Intelligence built in</span>
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-5">
                A co-pilot that never blinks.
              </h2>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Advanced sensors and smart software work together to protect you on the road and your vehicle while it&apos;s parked.
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
              {[
                { end: 98, suffix: "%", label: "Less power in parking mode", accent: true },
                { end: 743, suffix: "", label: "Minutes of smart time-lapse" },
                { end: 20, suffix: " s", label: "Captured around every impact" },
                { end: 1.9, suffix: " s", decimals: 1, label: "From power-on to recording" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className={`text-4xl md:text-5xl font-bold mb-2 ${s.accent ? "text-[var(--finevu-orange)]" : "text-zinc-900"}`}>
                    <AnimatedCounter end={s.end} duration={2} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </div>
                  <p className="text-zinc-500 text-xs md:text-sm leading-snug">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {intelligenceCards.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div
                    key={i}
                    className="rounded-[1.75rem] border border-zinc-200 p-8 hover:shadow-xl hover:border-[var(--finevu-orange)]/40 transition-all duration-500 bg-white"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-[var(--finevu-orange)]/10 flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5 text-[var(--finevu-orange)]" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">{c.title}</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">{c.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trusted by drivers worldwide */}
        <section className="relative py-28 bg-black overflow-hidden" data-nav-theme="dark">
          <ParticleBackground />
          <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16">
            <motion.div className="text-center mb-14" {...fadeUp} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Trusted by drivers worldwide
              </h2>
              <p className="text-lg text-zinc-400">Over 4 million dash cams sold globally.</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-8 mb-20 max-w-3xl mx-auto"
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-[var(--finevu-orange)] mb-2">
                  <AnimatedCounter end={4} duration={2} suffix="M+" />
                </div>
                <p className="text-zinc-400 font-mono text-xs md:text-sm uppercase tracking-wider">Sold worldwide</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-[var(--finevu-orange)] mb-2">
                  <AnimatedCounter end={3} duration={2} suffix="yr" />
                </div>
                <p className="text-zinc-400 text-xs md:text-sm font-mono uppercase tracking-wider">AU warranty</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-[var(--finevu-orange)] mb-2">
                  <AnimatedCounter end={4.8} duration={2} decimals={1} />
                </div>
                <p className="text-zinc-400 font-mono text-xs md:text-sm uppercase tracking-wider">Avg. rating</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen", location: "Sydney, NSW", vehicle: "Toyota RAV4",
                  review: "The 4K footage is incredibly clear — you can read number plates easily. Setup with the app was simple and the parking mode gives me real peace of mind.",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                  verified: true,
                },
                {
                  name: "Michael Roberts", location: "Melbourne, VIC", vehicle: "Ford Ranger",
                  review: "Professional install was quick and tidy — no messy wiring. The ADAS alerts have genuinely made me a more attentive driver.",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                  verified: true,
                },
                {
                  name: "Emma Thompson", location: "Brisbane, QLD", vehicle: "Mazda CX-5",
                  review: "Front and rear recording saved me after a car park bump. I shared the clip with my insurer straight from the app. Couldn't recommend FineVu more.",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1754298949882-216a1c92dbb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                  verified: true,
                },
              ].map((t, i) => (
                <ReviewCard key={i} {...t} delay={i * 0.2} />
              ))}
            </div>

            <motion.div
              className="mt-16 pt-16 border-t border-white/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-[var(--finevu-orange)]" />
                  <span className="text-white/80 font-mono text-sm uppercase tracking-wider">Made in Korea</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[var(--finevu-orange)]" />
                  <span className="text-white/80 font-mono text-sm uppercase tracking-wider">3-Year Australian warranty</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-[var(--finevu-orange)]" />
                  <span className="text-white/80 font-mono text-sm uppercase tracking-wider">80+ installers nationwide</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Built in Korea. Backed in Australia. */}
        <section className="py-28 bg-zinc-950" data-nav-theme="dark">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
            <motion.div className="text-center mb-14 max-w-3xl mx-auto" {...fadeUp} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                <span className="text-white">Built in Korea.</span><br />
                <span className="text-[var(--finevu-orange)]">Backed in Australia.</span>
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Engineered in Korea, trusted by drivers worldwide, and backed by local Australian support.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Big footage card */}
              <motion.div
                className="lg:col-span-2 relative overflow-hidden rounded-[2rem] group min-h-[420px] border border-white/5 bg-[#161618]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Dark designed card (per Figma) — subtle warm glow, no photo */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 70% 55%, rgba(244,121,32,0.16) 0%, transparent 55%)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-10">
                  <span className="finevu-capsule mb-4">SONY STARVIS</span>
                  <h3 className="text-3xl font-bold text-white mb-3">Footage that holds up after dark</h3>
                  <p className="text-zinc-300 max-w-lg mb-6">
                    The STARVIS sensor pulls detail out of low light, so number plates and signs stay readable at night.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-zinc-400">
                    <span><span className="text-white">4K</span> front</span>
                    <span><span className="text-white">Sony STARVIS</span> sensor</span>
                    <span><span className="text-white">139°</span> field of view</span>
                    <span><span className="text-white">Front + rear</span> channels</span>
                  </div>
                </div>
              </motion.div>

              {/* Side cards */}
              <div className="flex flex-col gap-6">
                {[
                  { icon: ShieldCheck, t: "3-year AU warranty", d: "Covered locally, with support you can actually call." },
                  { icon: MapPin, t: "Built-in GPS & Wi-Fi", d: "Tag every trip with speed and location, then review on your phone." },
                  { icon: CheckCircle, t: "SD card included", d: "Pre-installed and formatted — it records from the first drive." },
                ].map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={i}
                      className="rounded-[2rem] p-7 bg-[var(--finevu-charcoal)] border border-white/5 flex-1 flex flex-col justify-center"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--finevu-orange)]/15 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-[var(--finevu-orange)]" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{c.t}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{c.d}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* DIY or pro install banner */}
            <motion.div
              className="mt-6 rounded-[2rem] bg-[var(--finevu-orange)] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">DIY or pro install</h3>
                  <p className="text-white/85 text-sm max-w-xl leading-relaxed">
                    Everything you need is in the box. Prefer a hand? Book one of 80+ mobile installers to fit it at home or work.
                  </p>
                </div>
              </div>
              <Link href="/services" className="shrink-0">
                <motion.button
                  className="px-7 py-3 rounded-full bg-zinc-900 text-white font-semibold text-sm flex items-center gap-2 hover:bg-black transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  See installation options <ChevronRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Dash cam guides */}
        <section className="py-28 bg-white border-t border-zinc-100" data-nav-theme="light">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
            <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeUp} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight text-zinc-900">
                Dash cam guides
              </h2>
              <p className="text-lg text-zinc-600">
                Everything you need to choose, install and get the most from your FineVu.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {educationCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="h-full"
                >
                  <Link href={`/learn/${card.slug}`}>
                    <TiltCard className="group cursor-pointer smooth-transition h-full" tiltStrength={8}>
                      <div className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden h-full flex flex-col p-6 hover:shadow-xl transition-all duration-500 hover:border-[var(--finevu-orange)]/30">
                        {/* Image placeholder — solid #656565 box per Figma. Client to supply art. */}
                        <div className="relative overflow-hidden rounded-2xl mb-6 h-[220px] w-full bg-[#656565]" />
                        <div className="space-y-4 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[var(--finevu-orange)] smooth-transition leading-tight">{card.title}</h3>
                          <p className="text-zinc-600 leading-relaxed text-sm flex-grow">{card.description}</p>
                          <div className="flex items-center gap-2 text-[var(--finevu-orange)] pt-4 border-t border-zinc-100 mt-auto">
                            <span className="text-xs font-mono uppercase tracking-widest">Read guide</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/learn">
                <motion.button
                  className="px-7 py-3 rounded-full border border-zinc-300 text-zinc-900 hover:bg-black hover:text-white transition-colors font-medium text-sm uppercase tracking-wider"
                  whileHover={{ scale: 1.05 }}
                >
                  View all guides
                </motion.button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

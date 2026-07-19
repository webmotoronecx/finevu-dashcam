"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { ReportPreview } from '@/components/ReportPreview';
import { motion } from 'motion/react';
import {
  Camera,
  Wrench,
  Smartphone,
  ShieldCheck,
  Moon,
  Satellite,
  Gauge,
  Car,
  Thermometer,
  Share2,
} from 'lucide-react';
import Link from "next/link";

// NOTE: No real product photography available — road/driving Unsplash shots
// and brand-gradient panels are used as placeholders throughout.

export default function Page() {
  const steps = [
    {
      number: "01",
      title: "Choose your model",
      description:
        "Pick the FineVu that fits how you drive. GX4K for true 4K front clarity, or GX35 for a sharp, value-packed 2K setup — both front + rear.",
      icon: Camera,
      details: [
        "GX4K — 4K front + 2K rear",
        "GX35 — 2K front + Full HD rear",
        "SONY STARVIS sensors on both",
        "Made in Korea, 3-year Australian warranty",
      ],
      links: [
        { label: "Explore GX4K", href: "/gx4k" },
        { label: "Explore GX35", href: "/gx35" },
      ],
    },
    {
      number: "02",
      title: "Install it your way",
      description:
        "Everything you need is in the box for a tidy DIY fit. Prefer a hidden, professional finish? Book one of our 80+ mobile installers.",
      icon: Wrench,
      details: [
        "DIY with the included cables and guides",
        "Plug & play front cable",
        "Hardwire kit for rear and parking mode",
        "Professional mobile install available",
      ],
      links: [
        { label: "Installation options", href: "/services" },
        { label: "Book an installer", href: "/booking" },
      ],
    },
    {
      number: "03",
      title: "Pair the FineVu app",
      description:
        "Connect over Wi-Fi to set up GPS, adjust settings and check your live view — all from your phone, no cables needed.",
      icon: Smartphone,
      details: [
        "Connect over built-in Wi-Fi",
        "Enable built-in GPS tracking",
        "Live view and quick settings",
        "Firmware updates on tap",
      ],
      links: [
        { label: "Support & setup", href: "/support" },
      ],
    },
    {
      number: "04",
      title: "Drive protected",
      description:
        "Continuous and event recording capture every trip. ADAS alerts keep you sharp, and 24/7 parking mode watches over your car when you're away.",
      icon: ShieldCheck,
      details: [
        "Continuous + event recording",
        "ADAS driver alerts",
        "24/7 parking mode",
        "Speed camera alerts",
      ],
      links: [
        { label: "View the features", href: "#features" },
      ],
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "ADAS Plus",
      desc: "Lane departure and forward collision warnings help you stay alert on every drive. Requires hardwiring to unlock.",
    },
    {
      icon: Car,
      title: "Parking Mode",
      desc: "Round-the-clock monitoring catches bumps, break-ins and hit-and-runs while you're parked.",
    },
    {
      icon: Moon,
      title: "Auto Night Vision",
      desc: "SONY STARVIS sensors pull detail out of the dark so number plates stay readable after sunset.",
    },
    {
      icon: Satellite,
      title: "Built-in GPS & Wi-Fi",
      desc: "Stamp every clip with speed and location, and connect instantly to the FineVu app.",
    },
    {
      icon: Gauge,
      title: "Speed Camera Alerts",
      desc: "Get a heads-up for fixed speed and red-light cameras as you approach them.",
    },
    {
      icon: Thermometer,
      title: "Heat Monitoring",
      desc: "Built-in temperature protection guards the camera during long parking sessions in the Australian sun.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative pt-32 md:pt-40 pb-24 flex items-center justify-center overflow-hidden brand-gradient"
        data-nav-theme="dark"
      >
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-[var(--finevu-orange)]">
              How it works
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Owning a FineVu, end to end
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              From choosing your camera to driving protected — here's everything from box to road.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Four simple steps
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Choose, install, pair and drive — you'll be protected in no time.
            </p>
          </motion.div>

          <div className="space-y-32">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  id={index === 3 ? "features" : undefined}
                  className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Content */}
                  <div className={`space-y-8 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="inline-flex items-center gap-4">
                      <motion.div
                        className="w-20 h-20 rounded-2xl bg-[var(--finevu-light-grey)] flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className="w-10 h-10 text-[var(--finevu-orange)]" />
                      </motion.div>
                      <span className="text-7xl font-bold text-zinc-100">{step.number}</span>
                    </div>

                    <div>
                      <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-xl text-zinc-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <ul className="space-y-4">
                      {step.details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-[var(--finevu-orange)]" />
                          <span className="text-zinc-700">{detail}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-3 pt-2">
                      {step.links.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.href}
                          className="cta-hover px-5 py-2.5 rounded-full border border-zinc-200 text-sm font-medium text-zinc-900 hover:border-[var(--finevu-orange)] hover:text-[var(--finevu-orange)] smooth-transition"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Visual */}
                  <motion.div
                    className={`tile-hover relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl ${isEven ? 'md:order-2' : 'md:order-1'}`}
                  >
                    <div className="absolute inset-0 brand-gradient" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-[2rem] bg-[var(--finevu-orange)] flex items-center justify-center shadow-2xl">
                        <Icon className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-32 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              What every FineVu does
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Smart protection built in — on the road and while you're parked.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="tile-hover bg-white rounded-[2rem] p-10 space-y-6 border border-zinc-100"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--finevu-light-grey)]"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-8 h-8 text-[var(--finevu-orange)]" />
                  </motion.div>
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            className="text-center text-sm text-zinc-500 mt-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ADAS Plus and 24/7 parking mode require hardwiring. A professional install
            unlocks every feature — see your{" "}
            <Link href="/services" className="text-[var(--finevu-orange)] font-medium underline">
              installation options
            </Link>
            .
          </motion.p>
        </div>
      </section>

      {/* App Section */}
      <section className="py-24 brand-gradient text-white overflow-hidden" data-nav-theme="dark">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-[var(--finevu-orange)] mb-4">
                The FineVu app
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                View, save & share your footage
              </h2>
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                Connect over Wi-Fi to review clips, download the moments that matter and
                share them in seconds — no card readers, no fuss.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Live view straight from your phone",
                  "Save event clips to your device",
                  "Share footage with insurers or police",
                  "GPS speed and location on every clip",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <Share2 className="w-5 h-5 text-[var(--finevu-orange)] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/support">
                  <button className="cta-hover px-8 py-3 rounded-full bg-[var(--finevu-orange)] text-white font-medium hover:opacity-90 smooth-transition w-full sm:w-auto text-center">
                    App setup & support
                  </button>
                </Link>
                <Link href="/learn">
                  <button className="cta-hover px-8 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 smooth-transition w-full sm:w-auto text-center font-medium">
                    Learn more
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[var(--finevu-orange)]/20 rounded-full blur-[100px] -z-10" />
              <ReportPreview className="w-full max-w-md mx-auto shadow-2xl rotate-[2deg] hover:rotate-0 transition-transform duration-500" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="relative rounded-[2rem] overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Placeholder driving image */}
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
              alt="Open road at dusk (placeholder)"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 text-center py-24 px-8 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Ready to drive protected?
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Explore the range, then pick up your FineVu from a stockist near you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link href="/gx4k">
                  <motion.button
                    className="cta-hover px-8 py-3 rounded-full bg-[var(--finevu-orange)] text-white font-medium"
                  >
                    Explore the range
                  </motion.button>
                </Link>
                <Link href="/retailers">
                  <motion.button
                    className="cta-hover px-8 py-3 rounded-full border border-white/40 text-white font-medium hover:bg-white/10 smooth-transition"
                  >
                    Where to buy
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

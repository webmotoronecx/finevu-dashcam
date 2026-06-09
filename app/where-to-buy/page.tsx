"use client";

import { Footer } from '@/components/Footer';
import { BusinessEnquiryForm } from '@/components/BusinessEnquiryForm';
import { motion } from 'motion/react';
import {
  Phone,
  ExternalLink,
  ArrowRight,
  Wrench,
  MapPin,
  Globe,
  ShieldCheck,
  Award,
} from 'lucide-react';
import Link from "next/link";

export default function Page() {
  const products = [
    {
      name: "FineVu GX4K",
      tag: "4K front + 2K rear",
      href: "/gx4k",
      description:
        "Our flagship 4K dash cam with a SONY STARVIS sensor for sharp number-plate clarity day and night.",
    },
    {
      name: "FineVu GX35",
      tag: "2K front + 2K rear",
      href: "/gx35",
      description:
        "Crisp 2K front and rear recording with SONY STARVIS imaging — premium protection at a sharper price.",
    },
  ];

  const trust = [
    { icon: MapPin, label: "Made in Korea" },
    { icon: ShieldCheck, label: "3-Year Australian warranty" },
    { icon: Award, label: "4 million+ sold worldwide" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative pt-32 md:pt-40 pb-24 overflow-hidden brand-gradient text-white"
        data-nav-theme="dark"
      >
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="max-w-3xl space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="finevu-capsule font-mono">
              <Globe className="w-3.5 h-3.5" /> Australian distribution
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Where to buy FineVu.
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
              FineVu premium 4K and 2K dash cams are distributed in Australia by
              Auto Xtreme. Buy direct, find an installer, or enquire about
              becoming a stockist.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Primary path — Auto Xtreme */}
      <section className="py-24 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--finevu-orange)] mb-4">
              Buy through Auto Xtreme
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Your official Australian distributor.
            </h2>
          </div>

          <div className="bg-[var(--finevu-charcoal)] text-white rounded-[2rem] p-10 md:p-14">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              <div className="max-w-xl">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Auto Xtreme
                </h3>
                <p className="text-white/75 text-lg leading-relaxed">
                  The fastest way to buy genuine FineVu dash cams with full
                  Australian warranty and local support. Order online or talk to
                  the team about the right model for your vehicle.
                </p>
              </div>
              <div className="flex flex-col gap-4 shrink-0 w-full lg:w-auto">
                <a
                  href="https://autoxtreme.com.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-[var(--finevu-orange)] text-white font-semibold hover:scale-[1.03] transition-transform flex items-center justify-center gap-2"
                >
                  Shop autoxtreme.com.au
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a
                  href="tel:1800818288"
                  className="px-8 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call 1800 818 288
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-24 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--finevu-orange)] mb-4">
              The range
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Choose your FineVu.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-[2rem] p-10 border border-zinc-100 flex flex-col"
              >
                <span className="finevu-capsule font-mono self-start mb-6">
                  {product.tag}
                </span>
                <h3 className="text-3xl font-bold mb-3">{product.name}</h3>
                <p className="text-zinc-600 leading-relaxed mb-8 flex-1">
                  {product.description}
                </p>
                <Link
                  href={product.href}
                  className="inline-flex items-center gap-2 text-[var(--finevu-orange)] font-semibold hover:gap-3 transition-all"
                >
                  Learn more
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Buy + install */}
      <section className="py-24 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="bg-brand-gradient-soft rounded-[2rem] p-10 md:p-14 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-[var(--finevu-orange)]" />
                <span className="font-mono text-xs uppercase tracking-widest">
                  Buy + install
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Want it fitted for you?
              </h2>
              <p className="text-white/80 leading-relaxed">
                Book a professional installation through our network of 80+
                experienced installers. They come to you for a clean, hidden,
                hardwired finish.
              </p>
            </div>
            <Link
              href="/booking"
              className="shrink-0 px-8 py-4 rounded-full bg-white text-[var(--finevu-charcoal)] font-semibold hover:scale-[1.03] transition-transform text-center"
            >
              Find an installer
            </Link>
          </div>
        </div>
      </section>

      {/* Trade / stockist enquiry */}
      <section className="py-24 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1100px] mx-auto px-8 lg:px-16">
          <BusinessEnquiryForm
            type="Stockist"
            title="Become a FineVu stockist"
            subtitle="Retailer or trade enquiry? Get in touch."
            showCompany={true}
          />
        </div>
      </section>

      {/* Trust band */}
      <section className="py-16 bg-[var(--finevu-charcoal)] text-white" data-nav-theme="dark">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid sm:grid-cols-3 gap-8">
            {trust.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-center gap-3 text-center"
              >
                <item.icon className="w-6 h-6 text-[var(--finevu-orange)] shrink-0" />
                <span className="text-lg font-bold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

"use client";

import { Footer } from '@/components/Footer';
import { BusinessEnquiryForm } from '@/components/BusinessEnquiryForm';
import { motion } from 'motion/react';
import {
  MapPin,
  ShieldCheck,
  Cable,
  Sparkles,
  ClipboardCheck,
  Users,
  Wrench,
  CheckCircle,
} from 'lucide-react';
import Link from "next/link";

export default function Page() {
  const benefits = [
    {
      icon: Users,
      title: "80+ experienced installers",
      description:
        "A national network of professional auto electricians who fit FineVu dash cams every day.",
    },
    {
      icon: MapPin,
      title: "We come to you",
      description:
        "Mobile installation at your home or office. No need to drop your car off or wait around.",
    },
    {
      icon: Cable,
      title: "Clean, hidden finish",
      description:
        "Cables tucked behind trim for a factory look. No messy wiring, no dangling leads.",
    },
    {
      icon: ShieldCheck,
      title: "All ADAS features unlocked",
      description:
        "Proper hardwiring powers parking mode and the full driver-assist feature set safely.",
    },
  ];

  const steps = [
    {
      num: "01",
      icon: ClipboardCheck,
      title: "Enquire",
      description:
        "Tell us your vehicle, your location and which FineVu camera you have or want.",
    },
    {
      num: "02",
      icon: Users,
      title: "We match you with a local installer",
      description:
        "We connect you with an experienced FineVu installer near you and confirm a time that suits.",
    },
    {
      num: "03",
      icon: CheckCircle,
      title: "Installed & paired",
      description:
        "Your camera is hardwired, hidden and paired to the app — ready to record before they leave.",
    },
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
              <Wrench className="w-3.5 h-3.5" /> Professional installation
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Book your installation.
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
              Get your FineVu dash cam fitted by a professional. Our mobile
              installer network comes to your home or office for a clean, hidden,
              hardwired finish — no DIY, no fuss.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#enquire"
                className="px-8 py-4 rounded-full bg-[var(--finevu-orange)] text-white font-semibold hover:scale-[1.03] transition-transform"
              >
                Request an installation
              </a>
              <Link
                href="/services"
                className="px-8 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Prefer DIY? See setup help
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why professional installation */}
      <section className="py-24 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--finevu-orange)] mb-4">
              Why book an installer
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              A professional fit, done properly.
            </h2>
            <p className="text-zinc-600 text-lg mt-6 leading-relaxed">
              Hardwiring a dash cam takes more than plugging it in. Our installers
              fit it cleanly, hide every cable and unlock the full set of FineVu
              features safely.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-zinc-50 rounded-[2rem] p-8 border border-zinc-100"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--finevu-orange)]/10 flex items-center justify-center mb-6">
                  <benefit.icon className="w-6 h-6 text-[var(--finevu-orange)]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-zinc-600 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How booking works */}
      <section className="py-24 bg-[var(--finevu-charcoal)] text-white" data-nav-theme="dark">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--finevu-orange)] mb-4">
              How booking works
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Three simple steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 rounded-[2rem] p-8 border border-white/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-3xl font-bold text-[var(--finevu-orange)]">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="py-24 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1100px] mx-auto px-8 lg:px-16">
          <BusinessEnquiryForm
            type="Installation"
            title="Request an installation"
            subtitle="Tell us your vehicle and location and we'll match you with a local FineVu installer."
          />
        </div>
      </section>

      {/* DIY note */}
      <section className="py-20 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="bg-brand-gradient-soft rounded-[2rem] p-10 md:p-14 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[var(--finevu-orange)]" />
                <span className="font-mono text-xs uppercase tracking-widest">
                  Rather do it yourself?
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                DIY installation is available too.
              </h2>
              <p className="text-white/80 leading-relaxed">
                Comfortable with a screwdriver and trim tools? FineVu cameras
                ship ready to self-install. See our setup help and guides.
              </p>
            </div>
            <Link
              href="/services"
              className="shrink-0 px-8 py-4 rounded-full bg-white text-[var(--finevu-charcoal)] font-semibold hover:scale-[1.03] transition-transform text-center"
            >
              DIY setup help
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

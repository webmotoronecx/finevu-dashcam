"use client";

import { Footer } from "@/components/Footer";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { submitForm } from "@/lib/submitForm";
import {
  CalendarDays,
  Cable,
  PlugZap,
  SlidersHorizontal,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Info,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const whyReasons = [
  {
    icon: Cable,
    title: "Clean, concealed wiring",
    desc: "Cables routed behind trim panels for a tidy, factory-style finish — no dangling leads across the windscreen.",
  },
  {
    icon: PlugZap,
    title: "Correct connection",
    desc: "OBD or hardwire done properly, with parking mode set up the way you want it for round-the-clock protection.",
  },
  {
    icon: SlidersHorizontal,
    title: "Set up and tested",
    desc: "Camera angle dialled in, settings configured, and the whole system checked before you drive away.",
  },
];

const pricing = [
  { tier: "Hatchback / Sedan", price: "$200" },
  { tier: "SUV / Hatchback", price: "$250" },
  { tier: "Prestige", price: "$300" },
];
const priceFeatures = ["Front or front + rear install", "Concealed cable routing", "Full system test & setup"];

const steps = [
  {
    n: "01",
    title: "Request a time",
    desc: "Fill in the booking form above with your name, contact details, dash cam model, vehicle info and preferred appointment time.",
  },
  {
    n: "02",
    title: "Send your details",
    desc: "We'll review your request and follow up by phone or email to confirm availability and answer any questions.",
  },
  {
    n: "03",
    title: "Get confirmed",
    desc: "Once confirmed, bring your dash cam, cables and memory card to our Clayton South workshop at your appointment time.",
  },
];

const inTheInstall = [
  "Front or front + rear dash cam installation",
  "Neat cable routing and a tidy finish",
  "OBD or hardwire connection (where applicable)",
  "Camera angle adjustment and basic setup",
];
const bringWithYou = [
  "FineVu dash cam main unit",
  "Rear camera (if applicable)",
  "All cables — power, rear camera, OBD / hardware",
  "Memory card — FineVu or compatible microSD",
];

const inputClass =
  "w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-[var(--finevu-orange)] focus:bg-white";
const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5";

function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [installType, setInstallType] = useState<"front" | "rear">("front");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("botcheck")) {
      setSubmitted(true);
      return;
    }
    setSending(true);
    setError("");
    const email = String(fd.get("email") || "");
    const res = await submitForm(
      {
        first_name: String(fd.get("firstName") || ""),
        last_name: String(fd.get("lastName") || ""),
        email,
        mobile: String(fd.get("mobile") || ""),
        dash_cam_model: String(fd.get("model") || ""),
        vehicle: String(fd.get("vehicle") || ""),
        install_type: installType === "front" ? "Front only" : "Front + Rear",
        preferred_datetime: String(fd.get("datetime") || ""),
        notes: String(fd.get("notes") || ""),
      },
      { subject: "FineVu installation booking request", replyTo: email },
    );
    setSending(false);
    if (res.ok) setSubmitted(true);
    else setError(res.error);
  }

  return (
    <div
      id="book"
      className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 sm:p-8 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)] scroll-mt-28"
    >
      <div className="flex items-center gap-2.5 mb-6">
        <CalendarDays className="w-5 h-5 text-[var(--finevu-orange)]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Request a Booking</h3>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center text-center py-10">
          <CheckCircle2 className="w-12 h-12 text-[var(--finevu-orange)] mb-4" />
          <h4 className="text-xl font-bold text-zinc-900 mb-2">Booking request sent</h4>
          <p className="text-sm text-zinc-600 max-w-sm">
            Thanks — we&apos;ll be in touch by email or phone to confirm your appointment.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="firstName">First Name</label>
              <input id="firstName" name="firstName" className={inputClass} placeholder="Jane" required />
            </div>
            <div>
              <label className={labelClass} htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" className={inputClass} placeholder="Smith" required />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" className={inputClass} placeholder="jane@example.com" required />
          </div>
          <div>
            <label className={labelClass} htmlFor="mobile">Mobile</label>
            <input id="mobile" name="mobile" type="tel" className={inputClass} placeholder="04xx xxx xxx" />
          </div>
          <div>
            <label className={labelClass} htmlFor="model">Dash Cam Model</label>
            <input id="model" name="model" className={inputClass} placeholder="FineVu GX4K" />
          </div>
          <div>
            <label className={labelClass} htmlFor="vehicle">Vehicle Make / Model / Year</label>
            <input id="vehicle" name="vehicle" className={inputClass} placeholder="e.g. Toyota RAV4 2023" />
          </div>

          <div>
            <span className={labelClass}>Install Type</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setInstallType("front")}
                className={`min-h-[44px] rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                  installType === "front"
                    ? "bg-[var(--finevu-orange)] text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Front Only
              </button>
              <button
                type="button"
                onClick={() => setInstallType("rear")}
                className={`min-h-[44px] rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                  installType === "rear"
                    ? "bg-[var(--finevu-orange)] text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Front + Rear
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="datetime">Preferred Date &amp; Time</label>
            <input id="datetime" name="datetime" type="datetime-local" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Anything else we should know?"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="cta-hover w-full flex items-center justify-center gap-2 rounded-full bg-[var(--finevu-orange)] px-6 py-3.5 text-sm font-semibold uppercase leading-[20px] text-white disabled:opacity-70"
          >
            {sending ? "Sending…" : (<>Request Booking <ArrowUpRight className="w-4 h-4" /></>)}
          </button>
          {error && <p className="text-center text-[13px] font-medium text-[#D93816]">{error}</p>}
          <p className="text-center text-[11px] text-zinc-400 pt-1">
            By appointment only · Clayton South VIC · We&apos;ll confirm by email or phone
          </p>
        </form>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative w-full px-4 md:px-8 lg:px-[5.5vw] pt-3 md:pt-4 pb-3 lg:pb-[1vw]" data-nav-theme="dark">
        <div className="relative w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] min-h-[600px] lg:min-h-[max(560px,38vw)] flex items-center justify-center">
          {/* Image placeholder — solid #656565 box per Figma. Client to supply art. */}
          <div className="absolute inset-0 bg-[#656565]" />
          <motion.div
            className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-28 md:pt-24 pb-20"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-white/80 font-semibold text-xs md:text-sm tracking-[0.24em] uppercase mb-5">
              Install Network
            </p>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.02] uppercase mb-6 break-words">
              Professional Installation
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
              Buying your FineVu dash cam is the easy part. Having it fitted cleanly and correctly — wiring concealed,
              parking mode configured, camera dialled in — that&apos;s what a professional install is for. Book yours
              at our Clayton South workshop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#book" className="w-full sm:w-auto">
                <button className="cta-hover w-full sm:w-auto px-9 py-3.5 rounded-full bg-[var(--finevu-orange)] text-white font-semibold text-sm uppercase leading-[20px]">
                  Book Installation
                </button>
              </a>
              <a href="#pricing" className="w-full sm:w-auto">
                <button className="cta-hover w-full sm:w-auto px-9 py-3.5 rounded-full border border-white/40 text-white font-semibold text-sm uppercase leading-[20px] hover:bg-white/10 transition-colors backdrop-blur-sm">
                  View Pricing
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why book a pro install + booking form */}
      <section className="py-16 md:py-24 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left — why */}
            <motion.div {...fadeUp}>
              <span className="finevu-capsule uppercase mb-5">Why Book Installation</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight uppercase mb-8">
                Why book a pro install?
              </h2>
              <div className="space-y-6">
                {whyReasons.map((r) => {
                  const Icon = r.icon;
                  return (
                    <div key={r.title} className="flex gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-[var(--finevu-orange)]/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[var(--finevu-orange)]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 mb-1">{r.title}</h3>
                        <p className="text-sm text-zinc-600 leading-relaxed">{r.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl bg-zinc-50 border border-zinc-100 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--finevu-orange)] mb-2">
                  Already have your FineVu?
                </p>
                <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                  Great — just bring the unit, cables and memory card and we&apos;ll handle the rest.
                </p>
                <a
                  href="#included"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--finevu-orange)]"
                >
                  See what to bring <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Right — booking form */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <BookingForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24 bg-zinc-50 scroll-mt-24" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <motion.div className="text-center max-w-2xl mx-auto mb-12" {...fadeUp}>
            <span className="finevu-capsule uppercase mb-5">Proven Performance</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight uppercase mb-4">
              Simple, per-vehicle pricing
            </h2>
            <p className="text-zinc-600 text-lg">One flat rate, everything included. No hidden charges.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {pricing.map((p, i) => (
              <motion.div
                key={p.tier}
                className="tile-hover rounded-[1.75rem] border border-zinc-100 bg-white p-8 text-center shadow-[0_18px_50px_-20px_rgba(0,0,0,0.18)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h3 className="text-xl font-bold text-zinc-900">{p.tier}</h3>
                <div className="text-5xl md:text-6xl font-bold text-[var(--finevu-orange)] mt-4">{p.price}</div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mt-1">
                  Per vehicle/inc. setup
                </p>
                <hr className="my-6 border-zinc-100" />
                <ul className="space-y-3 text-left">
                  {priceFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-600">
                      <Check className="w-4 h-4 text-[var(--finevu-orange)] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <p className="flex items-start justify-center gap-2 text-center text-xs text-zinc-400 mt-8 max-w-3xl mx-auto px-4">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              Pricing covers the installation service only. Dash cam hardware sold separately. OBD/hardwire components
              may incur a small additional cost depending on vehicle.
            </span>
          </p>
        </div>
      </section>

      {/* Three steps */}
      <section className="py-16 md:py-24 bg-zinc-950" data-nav-theme="dark">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <motion.div className="text-center max-w-2xl mx-auto mb-12" {...fadeUp}>
            <span className="finevu-capsule uppercase mb-5">How to Book</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight uppercase mb-4">
              Three steps to a booked install
            </h2>
            <p className="text-zinc-400 text-lg">Quick and straightforward — from request to confirmed appointment.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                className="tile-hover rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-6xl md:text-7xl font-bold text-white/10 mb-6">{s.n}</div>
                <h3 className="text-base font-bold uppercase tracking-wider text-white mb-3">{s.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything in the service */}
      <section id="included" className="py-16 md:py-24 bg-white scroll-mt-24" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <motion.div className="text-center max-w-2xl mx-auto mb-12" {...fadeUp}>
            <span className="finevu-capsule uppercase mb-5">What&apos;s Included</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight uppercase mb-4">
              Everything in the service
            </h2>
            <p className="text-zinc-600 text-lg">Here&apos;s exactly what we do — and what to bring with you.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 max-w-4xl mx-auto">
            <motion.div {...fadeUp}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-5">In the install</h3>
              <ul className="space-y-4">
                {inTheInstall.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 mt-0.5 shrink-0 rounded-full bg-[var(--finevu-orange)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                    <span className="text-sm text-zinc-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-5">Bring with you</h3>
              <ul className="space-y-4">
                {bringWithYou.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 mt-0.5 shrink-0 rounded-full border border-[var(--finevu-orange)]/30 bg-[var(--finevu-orange)]/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-[var(--finevu-orange)]" />
                    </span>
                    <span className="text-sm text-zinc-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="mt-10 max-w-4xl mx-auto rounded-xl border-l-4 border-[var(--finevu-orange)] bg-zinc-50 p-5">
            <p className="text-sm text-zinc-600 leading-relaxed">
              <span className="font-bold text-zinc-900">Note:</span> The installation service covers fitting only —
              hardware is not supplied as part of this service. Please bring all items listed above to your
              appointment. If you&apos;re unsure what cables came with your unit, check the FineVu box contents or{" "}
              <Link href="/contact" className="text-[var(--finevu-orange)] underline">
                contact us before booking
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Workshop location */}
      <section className="py-16 md:py-24 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <motion.div {...fadeUp}>
              <span className="finevu-capsule uppercase mb-5">Where to Find Us</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight uppercase mb-6">
                Workshop location
              </h2>
              <p className="font-bold text-zinc-900">FineVu Dashcam Australia</p>
              <p className="text-zinc-600">Unit 28 / 266 Osborne Ave</p>
              <p className="text-zinc-600 mb-6">Clayton South VIC 3169</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Victoria only", "By appointment", "(03) 9099 0983"].map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-zinc-700"
                  >
                    {b}
                  </span>
                ))}
              </div>
              <a href="#book">
                <button className="cta-hover px-8 py-3.5 rounded-full bg-[var(--finevu-orange)] text-white font-semibold text-sm uppercase leading-[20px]">
                  Request Booking
                </button>
              </a>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              {/* Map placeholder — styled location mock per Figma. Client to supply embed. */}
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
                {/* faint road lines */}
                <div className="absolute left-[-10%] right-[-10%] top-[34%] h-px bg-zinc-400/40 -rotate-[7deg]" />
                <div className="absolute left-[-10%] right-[-10%] top-[64%] h-px bg-zinc-400/40 -rotate-[4deg]" />
                <div className="absolute top-[-10%] bottom-[-10%] left-[58%] w-px bg-zinc-400/30 rotate-[10deg]" />
                {/* glow + pin + label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute h-40 w-40 rounded-full bg-[var(--finevu-orange)]/25 blur-2xl" />
                  <span className="absolute -rotate-[30deg] translate-y-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--finevu-orange)]/70 whitespace-nowrap">
                    FineVu · Clayton South
                  </span>
                  <MapPin className="relative w-10 h-10 -translate-y-2 text-[var(--finevu-orange)]" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                {[
                  { t: "Independent installers", d: "Work is carried out by our team at the Clayton South workshop." },
                  { t: "Direct confirmation", d: "We'll call or email to confirm your appointment time." },
                  { t: "Outside Victoria?", d: "Currently workshop-only. Contact us to discuss options." },
                ].map((c) => (
                  <div key={c.t}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--finevu-orange)] mb-2">{c.t}</p>
                    <p className="text-xs text-zinc-600 leading-relaxed">{c.d}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

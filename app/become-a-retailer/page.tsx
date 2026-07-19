"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Star,
  BarChart3,
  Aperture,
  ShieldCheck,
  Megaphone,
  BadgeCheck,
  Wrench,
  Volume2,
  Sparkles,
  Truck,
  Store,
  Globe,
  Check,
  ChevronDown,
} from "lucide-react";

// Become a retailer page — dark hero + stat band, why-partner cards, partner chips, the range, how-it-works steps, apply form, and trade FAQs.

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6 },
};

const HERO_STATS = [
  { b: "No.1", s: "Dash cam brand in Korea" },
  { b: "3 Year", s: "Australian warranty" },
  { b: "<0.2%", s: "In-house defect rate" },
  { b: "2 models", s: "GX4K flagship & GX35" },
];

const whyPartner = [
  { icon: Star, title: "Premium brand, premium margins", body: "A recognised, award-winning product positioned above the supermarket shelf — so you sell on quality, not just price." },
  { icon: BarChart3, title: "No.1 dash cam in Korea", body: "The best-selling dash cam brand in its home market, made in-house by FineDigital with a defect rate held below 0.2%." },
  { icon: Aperture, title: "Sony STARVIS technology", body: "Genuine Sony STARVIS and STARVIS 2 sensors with true 4K and 2K clarity — features customers actively search for and ask about." },
  { icon: ShieldCheck, title: "Backed by a local distributor", body: "AutoXtreme handles importing, the 3-year Australian warranty, firmware and support — so your customers are looked after long after the sale." },
  { icon: Megaphone, title: "Marketing & POS support", body: "Display units, point-of-sale material and product assets to help FineVu look the part in-store and online." },
  { icon: BadgeCheck, title: "Authorised-only protection", body: "We keep distribution tight and grey-market stock out — protecting your pricing, your margin and the brand you're selling." },
];

const chips = [
  { icon: Wrench, label: "Auto electricians & installers" },
  { icon: Volume2, label: "Car audio & accessories" },
  { icon: Sparkles, label: "Window tint & detailing" },
  { icon: Truck, label: "4WD, caravan & camping" },
  { icon: Store, label: "Automotive parts stores" },
  { icon: Globe, label: "Online automotive retailers" },
];

const range = [
  {
    flagship: true,
    img: "/products/gx4k-card.jpg",
    model: "FineVu GX4K",
    tagline: "True 4K front & Full HD rear — the sharpest FineVu made.",
    specs: [
      ["Sony STARVIS IMX515", " — 8.5MP, 3840×2160 4K UHD front"],
      ["Built-in GPS & 5GHz Wi-Fi", ", 128GB card included"],
      ["ADAS Plus, HDR night vision", " & parking mode"],
    ],
    href: "/gx4k",
  },
  {
    flagship: false,
    img: "/products/gx35-card.jpg",
    model: "FineVu GX35",
    tagline: "2K QHD clarity and the latest sensor, at an accessible price.",
    specs: [
      ["Sony STARVIS 2 IMX675", " — 5.12MP, 2560×1440 2K QHD front"],
      ["External GPS included", ", Wi-Fi, 64GB card included"],
      ["Up to 13,950 hrs", " parking standby with power saving"],
    ],
    href: "/gx35",
  },
];

const steps = [
  { n: "1", title: "Apply", body: "Send us your business details using the form below — it takes a couple of minutes." },
  { n: "2", title: "Get approved", body: "We review your application and set up your wholesale account, usually within 1–2 business days." },
  { n: "3", title: "Order & merchandise", body: "Place your first order at wholesale pricing, with POS and display support to set you up." },
  { n: "4", title: "Start selling", body: "Sell with full warranty backing, and refer customers to our certified installer network." },
];

const perks = [
  ["Wholesale pricing & healthy margins", "Competitive trade pricing on the full range"],
  ["POS, display units & product assets", "Everything to merchandise FineVu in-store and online"],
  ["Product training & sales support", "So your team can sell the features with confidence"],
  ["Warranty handled by the distributor", "3-year Australian warranty managed by AutoXtreme"],
  ["Certified installer referrals", "Send customers who need hardwiring to trusted fitters"],
];

const businessTypes = [
  "Auto electrician / installer",
  "Car audio & accessories",
  "Window tint & detailing",
  "4WD / caravan / camping",
  "Automotive parts store",
  "Online retailer",
  "Fleet / commercial",
  "Other",
];
const STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

const faqs = [
  { q: "Is there a minimum order?", a: "Opening orders are kept low to make it easy to get started. Exact minimums and trade pricing are confirmed when your wholesale account is set up, based on your business type." },
  { q: "How is pricing structured?", a: "Approved retailers buy at wholesale pricing with margins designed to keep FineVu profitable to sell. Full trade price lists are shared once your account is approved." },
  { q: "Who handles warranty claims?", a: "AutoXtreme, the Australian distributor, manages the 3-year warranty on main units and the 6-month warranty on accessories. You sell with confidence knowing support is handled locally, not shipped overseas." },
  { q: "Can I sell FineVu online?", a: "Yes. Both in-store and online retailers are welcome. We ask online sellers to follow brand and pricing guidelines so the FineVu name — and your margin — stays protected against grey-market listings." },
  { q: "Do you offer marketing support?", a: "Approved retailers receive point-of-sale material, display units and product imagery, plus co-op marketing opportunities. We want FineVu to look premium wherever it's sold." },
  { q: "How do my customers get their dash cam installed?", a: "If you don't fit dash cams yourself, you can refer customers to our certified installer network for a professional hardwire install — a clean handoff that keeps them happy and coming back." },
];

const LABEL ="mb-2 block text-[13px] font-semibold uppercase tracking-[0.06em] text-[#5b5e66]";
const INPUT = "w-full rounded-[12px] border border-[#e7e7e3] bg-white px-4 py-[13px] text-[16px] text-[#1d1d1f] placeholder:text-[#9a9da5] outline-none transition-colors focus:border-[var(--finevu-orange)]";

function SectionHead({ title, sub }: { title: string; sub: React.ReactNode }) {
  return (
    <motion.div {...fadeUp} className="mb-11 text-center">
      <h2 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-[#17181a] md:text-[48px] md:leading-[60px]">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-[720px] text-[18px] leading-[1.6] text-[#5b5e66]">{sub}</p>
    </motion.div>
  );
}

// Trade FAQ accordion — same line-separated rows and rotating orange chevron as the FAQ page's FaqRow.
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e7e7ea]">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={`flex w-full items-center justify-between gap-5 py-[22px] text-left text-[17px] font-semibold leading-snug tracking-[-0.005em] transition-colors md:text-[18px] ${open ? "text-[var(--finevu-orange)]" : "text-[#17181a]"}`}>
        {q}
        <ChevronDown className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-[var(--finevu-orange)]" : "text-[#9c9ca3]"}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="max-w-[700px] pb-6 text-[16px] leading-[1.6] text-[#6b6b72] md:text-[18px]">{a}</p>
        </div>
      </div>
    </div>
  );
}

function RetailerForm() {
  const [f, setF] = useState({ biz: "", abn: "", btype: "", cname: "", email: "", phone: "", state: "", web: "", msg: "" });
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
    if (!f.biz.trim() || !f.btype || !f.cname.trim() || !f.email.trim() || !f.phone.trim() || !f.state) {
      setErr("Please complete the required fields marked with *.");
      return;
    }
    if (!emailOk) {
      setErr("Please enter a valid email address.");
      return;
    }
    setErr("");
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-[20px] border border-[#e7e7e3] bg-white p-[34px] text-center shadow-[0_10px_17px_rgba(20,21,25,0.06)]">
        <div className="mx-auto mb-[18px] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--finevu-orange)] text-white">
          <Check className="h-6 w-6" strokeWidth={2.4} />
        </div>
        <h3 className="mb-2 text-[22px] font-semibold text-[#17181a]">Application received</h3>
        <p className="text-[16px] text-[#6b6b72]">Thanks — the AutoXtreme trade team will review your details and be in touch within 1–2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-[20px] border border-[#e7e7e3] bg-white p-[34px] shadow-[0_10px_17px_rgba(20,21,25,0.06)]">
      <h3 className="text-[21px] font-bold tracking-[-0.01em] text-[#1d1d1f]">Apply to stock FineVu</h3>
      <p className="mb-6 mt-1.5 text-[15.68px] text-[#5b5e66]">Tell us about your business and we&apos;ll be in touch within 1–2 business days.</p>

      <div className="mb-4">
        <label className={LABEL}>Business name <span className="text-[var(--finevu-orange)]">*</span></label>
        <input className={INPUT} placeholder="Your business or trading name" value={f.biz} onChange={(e) => set("biz", e.target.value)} />
      </div>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>ABN</label>
          <input className={INPUT} placeholder="11 222 333 444" inputMode="numeric" value={f.abn} onChange={(e) => set("abn", e.target.value)} />
        </div>
        <div>
          <label className={LABEL}>Business type <span className="text-[var(--finevu-orange)]">*</span></label>
          <select className={INPUT} value={f.btype} onChange={(e) => set("btype", e.target.value)}>
            <option value="">Select…</option>
            {businessTypes.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className={LABEL}>Contact name <span className="text-[var(--finevu-orange)]">*</span></label>
        <input className={INPUT} placeholder="Your full name" value={f.cname} onChange={(e) => set("cname", e.target.value)} />
      </div>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Email <span className="text-[var(--finevu-orange)]">*</span></label>
          <input className={INPUT} type="email" placeholder="you@business.com.au" value={f.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className={LABEL}>Phone <span className="text-[var(--finevu-orange)]">*</span></label>
          <input className={INPUT} type="tel" placeholder="0400 000 000" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
      </div>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>State <span className="text-[var(--finevu-orange)]">*</span></label>
          <select className={INPUT} value={f.state} onChange={(e) => set("state", e.target.value)}>
            <option value="">Select…</option>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>Website / socials</label>
          <input className={INPUT} placeholder="yourstore.com.au" value={f.web} onChange={(e) => set("web", e.target.value)} />
        </div>
      </div>
      <div className="mb-4">
        <label className={LABEL}>Tell us about your business</label>
        <textarea className={`${INPUT} min-h-[110px] resize-y`} placeholder="Where you're based, what you sell, and roughly how many units you'd expect to move." value={f.msg} onChange={(e) => set("msg", e.target.value)} />
      </div>

      <button type="submit" className="cta-hover mt-2 w-full rounded-full bg-[var(--finevu-orange)] px-7 py-[15px] text-[14px] font-semibold uppercase leading-[20px] text-white">
        Submit Application
      </button>
      {err && <p className="mt-3.5 text-[13px] font-medium text-[#D93816]">{err}</p>}
      <p className="mt-3.5 text-center text-[13.6px] text-[#9a9da5]">
        By submitting, you agree to be contacted about a FineVu wholesale account. See our{" "}
        <Link href="/support" className="font-semibold text-[var(--finevu-orange)]">privacy policy</Link>.
      </p>
    </form>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section id="top" className="relative text-white" data-nav-theme="dark">
        <Image src="/retailers/hero.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(8,8,9,.55) 0%,rgba(8,8,9,.35) 45%,rgba(8,8,9,.62) 100%)" }} />
        <div className="relative z-10 mx-auto max-w-[760px] px-6 pt-36 pb-16 text-center md:pt-44 md:pb-20">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-[40px] font-semibold leading-[48px] tracking-[-0.8px] md:text-[64px] md:leading-[76px]">
            Stock Korea&apos;s
            <br />
            No.1 dash cam.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="mx-auto mt-[22px] max-w-[640px] text-[16px] leading-[1.6] text-white/85 md:text-[18px]">
            Add FineVu to your range. Premium 4K and 2K dash cams with Sony STARVIS sensors, healthy margins
            and a 3-year Australian warranty, backed by a distributor that supports every sale.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24 }} className="mt-8 flex flex-wrap justify-center gap-3.5">
            <a href="#apply" className="cta-hover rounded-full bg-[var(--finevu-orange)] px-[30px] py-[15px] text-[14px] font-semibold uppercase leading-[20px] text-white">Apply to Become a Retailer</a>
            <a href="#why" className="cta-hover rounded-full border border-white/40 px-[30px] py-[15px] text-[14px] font-semibold uppercase leading-[20px] text-white transition-colors hover:bg-white/10">Why Partner</a>
          </motion.div>
        </div>
        <div className="relative z-10">
          <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-y-8 px-6 pb-9 pt-10 md:grid-cols-4 md:items-start md:gap-y-0 border-t border-white/10">
            {HERO_STATS.map((s) => (
              <div key={s.b}>
                <b className={`block leading-[27px] ${s.b === "<0.2%" ? "text-[21.6px] font-semibold tracking-[-0.216px]" : "text-[18px] font-bold"}`}>{s.b}</b>
                <span className="mt-1 block text-[13px] leading-[19.5px] text-white/70">{s.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why partner */}
      <section id="why" className="scroll-mt-24 bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <SectionHead title="A brand that sells itself." sub="FineVu is a premium dash cam brand with the reputation, technology and local backing to move off your shelves, and the margins to make it worthwhile." />
          <div className="mx-auto grid max-w-[1112px] gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyPartner.map((c, i) => (
              <motion.div key={c.title} {...fadeUp} transition={{ duration: 0.55, delay: (i % 3) * 0.07 }} className="rounded-[16px] border border-[#e7e7e3] bg-white p-8 text-center shadow-[0_2px_5px_rgba(20,21,25,0.04)]">
                <span className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-[#fff1e8] text-[var(--finevu-orange)]"><c.icon className="h-[25px] w-[25px]" strokeWidth={1.8} /></span>
                <h3 className="mb-2.5 text-[19.5px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#17181a]">{c.title}</h3>
                <p className="text-[15.7px] leading-[1.6] text-[#5b5e66]">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we partner with */}
      <section className="bg-[#f7f7f7] py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <SectionHead title="Built for automotive retailers." sub="If your customers drive, FineVu fits your range. We work with businesses across the automotive aftermarket." />
          <div className="mx-auto flex max-w-[880px] flex-wrap justify-center gap-3">
            {chips.map((c) => (
              <motion.span key={c.label} {...fadeUp} className="inline-flex items-center gap-2.5 rounded-full border border-[#e7e7e3] bg-white px-[22px] py-[14px] text-[16px] font-medium text-[#17181b]">
                <c.icon className="h-[17px] w-[17px] text-[var(--finevu-orange)]" /> {c.label}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* The range */}
      <section id="range" className="scroll-mt-24 bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <SectionHead title="Two models. One premium brand." sub="A tight, easy-to-sell lineup that covers the premium and mid-premium ends of the market, with more models on the way." />
          <div className="mx-auto grid max-w-[1112px] gap-6 md:grid-cols-2">
            {range.map((r) => (
              <motion.article key={r.model} {...fadeUp} className={`flex flex-col rounded-[20px] border bg-white p-[34px] ${r.flagship ? "border-[#f3d3bc] shadow-[0_10px_15px_rgba(255,106,30,0.1)]" : "border-[#e7e7e3] shadow-[0_2px_5px_rgba(20,21,25,0.04)]"}`}>
                <div className="relative mb-6 h-[190px]">
                  <Image src={r.img} alt={r.model} fill sizes="500px" className="object-contain" />
                </div>
                <div className="text-[25.6px] font-bold tracking-[-0.02em] text-[#1d1d1f]">{r.model}</div>
                <p className="mb-[18px] mt-1.5 text-[15.7px] text-[#5b5e66]">{r.tagline}</p>
                <ul className="mb-7 grid gap-2.5">
                  {r.specs.map(([b, rest], j) => (
                    <li key={j} className="flex gap-3 text-[15.4px] text-[#1d1d1f]">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--finevu-orange)]" />
                      <span><b className="font-semibold">{b}</b>{rest}</span>
                    </li>
                  ))}
                </ul>
                <Link href={r.href} className="cta-hover mt-auto inline-flex w-fit items-center justify-center rounded-full bg-[var(--finevu-orange)] px-[28px] py-[13px] text-[14px] font-semibold uppercase leading-[20px] text-white">
                  Explore {r.model.replace("FineVu ", "")}
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#f7f7f7] py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <SectionHead title="From application to shelf." sub="Becoming a FineVu stockist is quick. Most accounts are approved within one to two business days." />
          <div className="relative mx-auto max-w-[1112px]">
            <div className="absolute left-[12.5%] right-[12.5%] top-[31px] hidden border-t-2 border-dashed border-[var(--finevu-orange)] lg:block" />
            <div className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
              {steps.map((s, i) => (
                <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="relative px-4 text-center">
                  <div className="mx-auto mb-4 flex h-[62px] w-[62px] items-center justify-center rounded-full border-2 border-[var(--finevu-orange)] bg-[#fff1e8] text-[32px] font-bold text-[var(--finevu-orange)]">{s.n}</div>
                  <h3 className="mb-1.5 text-[17.28px] font-semibold text-[#1d1d1f]">{s.title}</h3>
                  <p className="text-[15.2px] leading-[1.55] text-[#5b5e66]">{s.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="scroll-mt-24 bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto grid max-w-[1112px] items-start gap-11 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-[56px]">
          <motion.div {...fadeUp}>
            <h2 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-[#1d1d1f] md:text-[48px] md:leading-[60px]">Everything you get<br className="hidden md:block" /> as a FineVu retailer.</h2>
            <p className="mb-[26px] mt-4 text-[17px] leading-[1.6] text-[#5b5e66]">Apply once and we&apos;ll take care of the rest — pricing, stock, support and the marketing to sell it.</p>
            <ul className="mb-[26px] grid gap-4">
              {perks.map(([b, s]) => (
                <li key={b} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-[var(--finevu-orange)] bg-[#fff1e8] text-[var(--finevu-orange)]"><Check className="h-3 w-3" strokeWidth={3} /></span>
                  <div>
                    <b className="block text-[18px] font-semibold text-[#1d1d1f]">{b}</b>
                    <span className="block text-[15.2px] text-[#5b5e66]">{s}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="rounded-[12px] border border-[#e7e7e3] bg-[#f6f6f4] px-5 py-4 text-[15.2px] leading-[1.55] text-[#5b5e66]">
              <b className="text-[#1d1d1f]">FineVu is distributed in Australia by AutoXtreme.</b> Your application and wholesale account are managed by the distributor. Prefer to talk first? Call 1800 818 288.
            </div>
          </motion.div>
          <RetailerForm />
        </div>
      </section>

      {/* Trade FAQ */}
      <section className="bg-[#f7f7f7] py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[860px] px-6">
          <SectionHead title="Retailer questions." sub={<>Most trade questions are answered below. Can&apos;t find yours? <Link href="/contact" className="font-semibold text-[var(--finevu-orange)]">Contact us</Link> and we&apos;ll help.</>} />
          <div className="border-t border-[#e7e7ea]">
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* Learn more strip */}
      <LearnMoreLinks />

      <Footer />
    </div>
  );
}

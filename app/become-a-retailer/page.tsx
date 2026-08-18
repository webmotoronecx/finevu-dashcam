"use client";

import { Footer } from "@/components/Footer";
import { RequiredDot } from "@/components/RequiredDot";
import { FullscreenHero } from "@/components/sections/FullscreenHero";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { Accordion } from "@/components/Accordion";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { submitForm } from "@/lib/submitForm";
import { Turnstile, TURNSTILE_ENABLED } from "@/components/Turnstile";
import { thankYouUrl } from "@/lib/data/thank-you";
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
} from "lucide-react";

// Become a retailer page — dark hero + stat band, why-partner cards, partner chips, the range, how-it-works steps, apply form, and trade FAQs.

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6 },
};

const HERO_STATS = [
  { value: "No. 1", label: "Dash cam brand in Korea" },
  { value: "3-Year", label: "Australian warranty" },
  { value: "<0.2%", label: "In-house defect rate" },
  { value: "2 models", label: "GX4K flagship & GX35" },
];

const whyPartner = [
  { icon: Star, title: "Premium brand, premium margins", body: "A recognised, award-winning product positioned above the supermarket shelf — so you sell on quality, not just price." },
  { icon: BarChart3, title: "No. 1 dash cam in Korea", body: "The best-selling dash cam brand in its home market, made in-house by FineDigital with a defect rate held below 0.2%." },
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
    img: "/retailer/gx4k-small.png",
    model: "FineVu GX4K",
    tagline: "True 4K front & Full HD rear — the sharpest FineVu made.",
    specs: [
      ["Sony STARVIS IMX515", " — 8.5MP, 3840 × 2160 4K UHD front"],
      ["Built-in GPS & 5GHz Wi-Fi", ", 128GB card included"],
      ["ADAS Plus, HDR night vision", " & parking mode"],
    ],
    href: "/gx4k",
  },
  {
    flagship: false,
    img: "/retailer/gx35-small.png",
    model: "FineVu GX35",
    tagline: "2K QHD clarity and the latest sensor, at an accessible price.",
    specs: [
      ["Sony STARVIS 2 IMX675", " — 5.12MP, 2560 × 1440 2K QHD front"],
      ["External GPS included", ", Wi-Fi, 64GB card included"],
      ["13,950 more hours", " of parking recording than it would in standard parking mode"],
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
// Matches /register and /warranty-claim (FA-08). Per-FIELD, not one combined message:
// "complete the required fields marked with *" left the applicant to re-scan nine inputs
// to find which one they missed.
const ERR = "mt-1.5 text-[12.5px] font-medium text-[#D93025]";

// The required fields in DOM order, paired with the ids their inputs already carry.
// A failed submit moves focus to the FIRST problem instead of leaving it on the button
// (FA-20): rendering nine error messages tells a sighted user what to fix, but a keyboard
// or screen-reader user was left on the submit button with no announcement and nine fields
// to hunt through. Order must match the visual order or focus jumps around the form.
const REQUIRED_FIELD_IDS: readonly (readonly [string, string])[] = [
  ["biz", "ret-biz"],
  ["btype", "ret-btype"],
  ["cname", "ret-cname"],
  ["email", "ret-email"],
  ["phone", "ret-phone"],
  ["state", "ret-state"],
];

// Deliberately permissive — it rejects what cannot be a phone number, not what isn't an
// Australian one. AU mobile and landline formats, with or without +61, spaces, dashes or
// brackets, all pass, and so do overseas numbers: online retailers do apply from outside
// AU. The previous check was `!f.phone.trim()`, which accepted a single character on the
// field a wholesale account is followed up on.
const isPhone = (v: string) => (v.match(/\d/g) ?? []).length >= 8;

// If router.push() never completes, `sending` stays true and the button reads "Submitting…"
// forever with no way back (FA-10). A successful navigation unmounts this component and the
// cleanup clears the timer, so this only ever fires on a genuine stall.
const REDIRECT_STALL_MS = 8000;

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

function RetailerForm() {
  const router = useRouter();
  const [f, setF] = useState({ biz: "", abn: "", btype: "", cname: "", email: "", phone: "", state: "", web: "", msg: "" });
  const [err, setErr] = useState("");
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [botcheck, setBotcheck] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  // Cleared on unmount, which is what a successful redirect does — see REDIRECT_STALL_MS.
  const stallTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (stallTimer.current) clearTimeout(stallTimer.current);
    },
    [],
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // One pass over every field, so the applicant sees ALL the problems at once rather
    // than fixing one and being told about the next (FA-08).
    const inv: Record<string, boolean> = {};
    if (!f.biz.trim()) inv.biz = true;
    if (!f.btype) inv.btype = true;
    if (!f.cname.trim()) inv.cname = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) inv.email = true;
    if (!isPhone(f.phone)) inv.phone = true;
    if (!f.state) inv.state = true;
    setInvalid(inv);
    if (Object.keys(inv).length > 0) {
      setErr("");
      // Focus the first problem. The message is already linked by aria-describedby, so
      // moving focus is what actually reads it out.
      const first = REQUIRED_FIELD_IDS.find(([key]) => inv[key]);
      if (first) document.getElementById(first[1])?.focus();
      return;
    }
    if (TURNSTILE_ENABLED && !captcha) {
      setErr("Please complete the verification below.");
      return;
    }
    setErr("");
    setSending(true);
    const res = await submitForm(
      {
        business_name: f.biz,
        abn: f.abn,
        business_type: f.btype,
        contact_name: f.cname,
        email: f.email,
        phone: f.phone,
        state: f.state,
        website: f.web,
        message: f.msg,
      },
      { subject: `FineVu retailer application — ${f.biz}`, replyTo: f.email, botcheck, turnstileToken: captcha },
    );
    // Leave `sending` on through the navigation so the button can't be re-submitted.
    if (res.ok) {
      router.push(thankYouUrl("become-a-retailer"));
      // The application HAS been sent by this point, so the stall message must not invite a
      // re-submit — that would mail support a duplicate. It tells them they're done instead.
      stallTimer.current = setTimeout(() => {
        setSending(false);
        setErr(
          "Your application was sent — this page just didn't move on. There's no need to submit it again; we'll be in touch.",
        );
      }, REDIRECT_STALL_MS);
    } else {
      setSending(false);
      setErr(res.error);
      // The token is single-use and may already be spent, so reissue one for the retry.
      setCaptcha("");
      setCaptchaReset((n) => n + 1);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-[20px] border border-[#e7e7e3] bg-white p-[34px] shadow-[0_10px_17px_rgba(20,21,25,0.06)]">
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" value={botcheck} onChange={(e) => setBotcheck(e.target.value)} className="hidden" />
      <h3 className="text-[21px] font-bold tracking-[-0.01em] text-[#1d1d1f]">Apply to stock FineVu</h3>
      <p className="mb-6 mt-1.5 text-[15.68px] text-[#5b5e66]">Tell us about your business and we&apos;ll be in touch within 1–2 business days.</p>

      <div className="mb-4">
        <label className={LABEL} htmlFor="ret-biz">Business name <RequiredDot /></label>
        <input id="ret-biz" aria-required="true" name="businessName" className={INPUT} placeholder="Your business or trading name" aria-invalid={invalid.biz || undefined} aria-describedby={invalid.biz ? "ret-biz-err" : undefined} value={f.biz} onChange={(e) => set("biz", e.target.value)} />
        {invalid.biz && <p id="ret-biz-err" className={ERR}>Enter your business or trading name.</p>}
      </div>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="ret-abn">ABN</label>
          <input id="ret-abn" name="abn" className={INPUT} placeholder="11 222 333 444" inputMode="numeric" value={f.abn} onChange={(e) => set("abn", e.target.value)} />
        </div>
        <div>
          <label className={LABEL} htmlFor="ret-btype">Business type <RequiredDot /></label>
          <select id="ret-btype" aria-required="true" name="businessType" className={INPUT} aria-invalid={invalid.btype || undefined} aria-describedby={invalid.btype ? "ret-btype-err" : undefined} value={f.btype} onChange={(e) => set("btype", e.target.value)}>
            <option value="">Select…</option>
            {businessTypes.map((b) => <option key={b}>{b}</option>)}
          </select>
          {invalid.btype && <p id="ret-btype-err" className={ERR}>Choose the closest business type.</p>}
        </div>
      </div>
      <div className="mb-4">
        <label className={LABEL} htmlFor="ret-cname">Contact name <RequiredDot /></label>
        <input id="ret-cname" aria-required="true" name="contactName" autoComplete="name" className={INPUT} placeholder="Your full name" aria-invalid={invalid.cname || undefined} aria-describedby={invalid.cname ? "ret-cname-err" : undefined} value={f.cname} onChange={(e) => set("cname", e.target.value)} />
        {invalid.cname && <p id="ret-cname-err" className={ERR}>Enter your full name.</p>}
      </div>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="ret-email">Email <RequiredDot /></label>
          <input id="ret-email" aria-required="true" name="email" autoComplete="email" className={INPUT} type="email" placeholder="you@business.com.au" aria-invalid={invalid.email || undefined} aria-describedby={invalid.email ? "ret-email-err" : undefined} value={f.email} onChange={(e) => set("email", e.target.value)} />
          {invalid.email && <p id="ret-email-err" className={ERR}>Enter a valid email address.</p>}
        </div>
        <div>
          <label className={LABEL} htmlFor="ret-phone">Phone <RequiredDot /></label>
          <input id="ret-phone" aria-required="true" name="phone" autoComplete="tel" className={INPUT} type="tel" placeholder="0400 000 000" aria-invalid={invalid.phone || undefined} aria-describedby={invalid.phone ? "ret-phone-err" : undefined} value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          {invalid.phone && <p id="ret-phone-err" className={ERR}>Enter a valid contact phone number.</p>}
        </div>
      </div>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="ret-state">State <RequiredDot /></label>
          <select id="ret-state" aria-required="true" name="state" autoComplete="address-level1" className={INPUT} aria-invalid={invalid.state || undefined} aria-describedby={invalid.state ? "ret-state-err" : undefined} value={f.state} onChange={(e) => set("state", e.target.value)}>
            <option value="">Select…</option>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {invalid.state && <p id="ret-state-err" className={ERR}>Choose your state.</p>}
        </div>
        <div>
          <label className={LABEL} htmlFor="ret-web">Website / socials</label>
          <input id="ret-web" name="website" className={INPUT} placeholder="yourstore.com.au" value={f.web} onChange={(e) => set("web", e.target.value)} />
        </div>
      </div>
      <div className="mb-4">
        <label className={LABEL} htmlFor="ret-msg">Tell us about your business</label>
        <textarea id="ret-msg" name="message" className={`${INPUT} min-h-[110px] resize-y`} placeholder="Where you're based, what you sell, and roughly how many units you'd expect to move." value={f.msg} onChange={(e) => set("msg", e.target.value)} />
      </div>

      <Turnstile onToken={setCaptcha} resetKey={captchaReset} />
      <button type="submit" disabled={sending} className="cta-hover mt-2 w-full rounded-full bg-[var(--finevu-orange)] px-7 py-[15px] text-[14px] font-semibold uppercase leading-[20px] text-white disabled:opacity-70">
        {sending ? "Submitting…" : "Submit Application"}
      </button>
      {/* role="alert" so a submit failure — a spent Turnstile token, a 429, a 503 — is
          announced rather than appearing silently below the button (FA-20). */}
      {err && <p role="alert" className="mt-3.5 text-[13px] font-medium text-[#D93816]">{err}</p>}
      <p className="mt-3.5 text-center text-[13.6px] text-[#9a9da5]">
        By submitting, you agree to be contacted about a FineVu wholesale account. See our{" "}
        <a
          href="https://motoronegroup.com/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[var(--finevu-orange)]"
        >
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <FullscreenHero
        id="top"
        image="/retailer/hero.png"
        maxWidth="max-w-[760px]"
        overlay="gradient"
        stats={HERO_STATS}
        title={<>Stock Korea&apos;s<br />No. 1 dash cam.</>}
        subtitle="Add FineVu to your range. Premium 4K and 2K dash cams with Sony STARVIS sensors, healthy margins and a 3-year Australian warranty, backed by a distributor that supports every sale."
        actions={
          <>
            <a href="#apply" className="cta-hover rounded-full bg-[var(--finevu-orange)] px-[30px] py-[15px] text-[14px] font-semibold uppercase leading-[20px] text-white">Apply to Become a Retailer</a>
            <a href="#why" className="cta-hover rounded-full border border-white/40 px-[30px] py-[15px] text-[14px] font-semibold uppercase leading-[20px] text-white transition-colors hover:bg-white/10">Why Partner</a>
          </>
        }
      />

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
                  <Image src={r.img} alt={r.model} fill sizes="500px" className="object-contain object-left" />
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
          <SectionHead title="From application to shelf." sub="Becoming a FineVu stockist is quick. Most accounts are approved within 1–2 business days." />
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
          <Accordion items={faqs} />
        </div>
      </section>

      {/* Learn more strip */}
      <LearnMoreLinks />

      <Footer />
    </div>
  );
}

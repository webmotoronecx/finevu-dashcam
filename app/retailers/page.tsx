"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  ClipboardCheck,
  Check,
  ArrowRight,
  MapPin,
  Phone,
  Search,
  Navigation,
  Monitor,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Retailers page — full-bleed hero, Online/Retail Stores tabs (retailer cards + store locator), why-authorised cards, installer CTA, and help strip.

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6 },
};

const retailers = [
  {
    logo: "/retailers/logo-jbhifi.png",
    name: "JB Hi-Fi",
    cat: "Electronics & Tech",
    desc: "Australia's home of consumer electronics. Buy FineVu online or in more than 300 stores nationwide, with the payment and delivery options you already know.",
    points: ["Fast delivery & Click + Collect", "Interest-free finance available"],
    cta: "Shop at JB Hi-Fi",
    href: "https://www.jbhifi.com.au",
  },
  {
    logo: "/retailers/logo-repco.png",
    name: "Repco",
    cat: "Auto Parts & Accessories",
    desc: "Australia's trusted automotive parts retailer. Pick up your FineVu in-store or order online, with hands-on advice from staff who know cars.",
    points: ["In-store fitting & product advice", "Click & Collect at 400+ stores"],
    cta: "Shop at Repco",
    href: "https://www.repco.com.au",
  },
  {
    logo: "/retailers/logo-autobarn.png",
    name: "Autobarn",
    cat: "Car Care & Accessories",
    desc: "The car accessories and aftermarket specialists. Find FineVu across the Autobarn store network or shop online for delivery to your door.",
    points: ["Nationwide store network", "Enthusiast accessory range"],
    cta: "Shop at Autobarn",
    href: "https://www.autobarn.com.au",
  },
];

type Store = { retailer: string; name: string; address: string; suburb: string; state: string; postcode: string; phone: string };
const BRAND: Record<string, string> = { "JB Hi-Fi": "#B58A00", Repco: "#0A4AA6", Autobarn: "#C0021B" };
const STORES: Store[] = [
  { retailer: "JB Hi-Fi", name: "JB Hi-Fi Melbourne City", address: "206 Bourke St", suburb: "Melbourne", state: "VIC", postcode: "3000", phone: "(03) 9200 5100" },
  { retailer: "JB Hi-Fi", name: "JB Hi-Fi Chadstone", address: "Chadstone Shopping Centre, 1341 Dandenong Rd", suburb: "Chadstone", state: "VIC", postcode: "3148", phone: "(03) 9200 5200" },
  { retailer: "JB Hi-Fi", name: "JB Hi-Fi Sydney City", address: "65 Market St", suburb: "Sydney", state: "NSW", postcode: "2000", phone: "(02) 9200 5300" },
  { retailer: "JB Hi-Fi", name: "JB Hi-Fi Chermside", address: "Westfield Chermside, Gympie Rd", suburb: "Chermside", state: "QLD", postcode: "4032", phone: "(07) 3200 5400" },
  { retailer: "JB Hi-Fi", name: "JB Hi-Fi Adelaide City", address: "Rundle Mall, 50 Rundle Mall", suburb: "Adelaide", state: "SA", postcode: "5000", phone: "(08) 8200 5500" },
  { retailer: "JB Hi-Fi", name: "JB Hi-Fi Perth City", address: "Murray St Mall, 200 Murray St", suburb: "Perth", state: "WA", postcode: "6000", phone: "(08) 6200 5600" },
  { retailer: "Repco", name: "Repco Richmond", address: "350 Bridge Rd", suburb: "Richmond", state: "VIC", postcode: "3121", phone: "(03) 9428 6100" },
  { retailer: "Repco", name: "Repco Alexandria", address: "110 Botany Rd", suburb: "Alexandria", state: "NSW", postcode: "2015", phone: "(02) 9698 6200" },
  { retailer: "Repco", name: "Repco Fortitude Valley", address: "260 Wickham St", suburb: "Fortitude Valley", state: "QLD", postcode: "4006", phone: "(07) 3252 6300" },
  { retailer: "Repco", name: "Repco Mile End", address: "180 Railway Tce", suburb: "Mile End", state: "SA", postcode: "5031", phone: "(08) 8234 6400" },
  { retailer: "Autobarn", name: "Autobarn Nunawading", address: "321 Whitehorse Rd", suburb: "Nunawading", state: "VIC", postcode: "3131", phone: "(03) 9878 7100" },
  { retailer: "Autobarn", name: "Autobarn Auburn", address: "200 Parramatta Rd", suburb: "Auburn", state: "NSW", postcode: "2144", phone: "(02) 9648 7200" },
  { retailer: "Autobarn", name: "Autobarn Underwood", address: "3215 Logan Rd", suburb: "Underwood", state: "QLD", postcode: "4119", phone: "(07) 3208 7300" },
  { retailer: "Autobarn", name: "Autobarn Cannington", address: "1420 Albany Hwy", suburb: "Cannington", state: "WA", postcode: "6107", phone: "(08) 9351 7400" },
  { retailer: "Autobarn", name: "Autobarn Hobart", address: "120 Argyle St", suburb: "Hobart", state: "TAS", postcode: "7000", phone: "(03) 6234 7500" },
  { retailer: "JB Hi-Fi", name: "JB Hi-Fi Canberra Centre", address: "148 Bunda St", suburb: "Canberra", state: "ACT", postcode: "2601", phone: "(02) 6200 5700" },
];
const STATE_OPTIONS: [string, string][] = [
  ["VIC", "Victoria"], ["NSW", "New South Wales"], ["QLD", "Queensland"], ["SA", "South Australia"],
  ["WA", "Western Australia"], ["TAS", "Tasmania"], ["ACT", "ACT"],
];
const FINDERS = [
  { label: "JB Hi-Fi", href: "https://www.jbhifi.com.au" },
  { label: "Repco", href: "https://www.repco.com.au" },
  { label: "Autobarn", href: "https://www.autobarn.com.au" },
];

function mapsUrl(s: Store) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${s.name}, ${s.address}, ${s.suburb} ${s.state} ${s.postcode}`);
}

const whyAuth = [
  { icon: ShieldCheck, title: "Genuine FineVu stock", node: <>Authorised retailers sell genuine FineVu units imported by AutoXtreme, the official Australian distributor — with the correct AU firmware, not grey-market imports.</> },
  { icon: Shield, title: "Full 3-year warranty", node: <>Every FineVu bought through an authorised retailer is covered by a 3-year Australian warranty, with support and servicing handled locally.</> },
  { icon: ClipboardCheck, title: "Expert help & installation", node: <>Buy in-store for hands-on advice, or once your camera arrives, <Link href="/booking" className="font-medium text-[var(--finevu-orange)] hover:underline">book a certified hardwire install</Link> to come to your home or workplace.</> },
];

const INPUT = "w-full rounded-[12px] border-[1.5px] border-[#e8e7e2] bg-white px-4 py-[13px] text-[15px] text-[#17181b] outline-none transition-colors focus:border-[var(--finevu-orange)]";

function StoreLocator() {
  const [state, setState] = useState("");
  const [retailer, setRetailer] = useState("");
  const [keyword, setKeyword] = useState("");
  const rows = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return STORES.filter((s) => {
      if (state && s.state !== state) return false;
      if (retailer && s.retailer !== retailer) return false;
      if (kw && !`${s.name} ${s.address} ${s.suburb} ${s.state} ${s.postcode} ${s.retailer}`.toLowerCase().includes(kw)) return false;
      return true;
    });
  }, [state, retailer, keyword]);

  return (
    <div>
      <p className="mb-[30px] flex max-w-[640px] items-start gap-3 text-[15px] text-[#5b5e66]">
        <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[var(--finevu-orange)]" />
        <span><b className="font-semibold text-[#17181b]">Find a store near you.</b> Filter by state or retailer, or search a suburb or postcode.</span>
      </p>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <select className={INPUT} value={state} onChange={(e) => setState(e.target.value)} aria-label="Filter by state">
          <option value="">All states &amp; territories</option>
          {STATE_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className={INPUT} value={retailer} onChange={(e) => setRetailer(e.target.value)} aria-label="Filter by retailer">
          <option value="">All retailers</option>
          <option>JB Hi-Fi</option><option>Repco</option><option>Autobarn</option>
        </select>
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9a9da5]" />
          <input className={`${INPUT} pl-11`} placeholder="Search suburb, postcode or store name" value={keyword} onChange={(e) => setKeyword(e.target.value)} aria-label="Search stores" />
        </div>
      </div>

      <div className="mx-0.5 my-3.5 flex flex-wrap items-center justify-between gap-3.5">
        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#5b5e66]">
          {rows.length ? <><b className="text-[var(--finevu-orange)]">{rows.length}</b> {rows.length === 1 ? "store found" : "stores found"}</> : "No stores found"}
        </span>
        <span className="text-[12.5px] text-[#9a9da5]">Sample stockist list shown for layout — connect your live retailer feed.</span>
      </div>

      <div className="max-h-[560px] overflow-y-auto rounded-[16px] border border-[#e8e7e2] bg-white">
        {rows.length === 0 ? (
          <div className="px-[30px] py-14 text-center">
            <Search className="mx-auto mb-4 h-[34px] w-[34px] text-[#9a9da5]" />
            <h4 className="mb-2 text-[1.1rem] font-semibold text-[#17181b]">No stores match your filters</h4>
            <p className="mx-auto mb-5 max-w-[380px] text-[15px] text-[#5b5e66]">Try a different suburb or postcode, or clear the filters to see every authorised store.</p>
            <button type="button" className="text-[15px] font-semibold text-[var(--finevu-orange)] underline" onClick={() => { setState(""); setRetailer(""); setKeyword(""); }}>Clear all filters</button>
          </div>
        ) : (
          rows.map((s) => (
            <div key={s.name} className="grid grid-cols-1 items-center gap-2 border-b border-[#e8e7e2] px-[26px] py-[22px] last:border-b-0 sm:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <span className="mb-2.5 inline-block rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: BRAND[s.retailer], borderColor: `${BRAND[s.retailer]}55`, background: `${BRAND[s.retailer]}12` }}>{s.retailer}</span>
                <div className="mb-2 text-[1.02rem] font-semibold text-[#17181b]">{s.name}</div>
                <div className="mt-1 flex items-start gap-2.5 text-[14px] text-[#5b5e66]"><MapPin className="mt-[3px] h-[15px] w-[15px] shrink-0 text-[#9a9da5]" /><span>{s.address}, {s.suburb} {s.state} {s.postcode}</span></div>
                <div className="mt-1 flex items-start gap-2.5 text-[14px] text-[#5b5e66]"><Phone className="mt-[3px] h-[15px] w-[15px] shrink-0 text-[#9a9da5]" /><a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`} className="font-medium text-[var(--finevu-orange)] hover:underline">{s.phone}</a></div>
              </div>
              <a href={mapsUrl(s)} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-[#e8e7e2] px-[18px] py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#17181b] transition-colors hover:border-[var(--finevu-orange)] hover:text-[var(--finevu-orange)]"><Navigation className="h-3.5 w-3.5" /> Directions</a>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-[#5b5e66]">
        <span>Official store finders:</span>
        {FINDERS.map((f) => <a key={f.label} href={f.href} target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--finevu-orange)] hover:underline">{f.label} →</a>)}
      </div>
    </div>
  );
}

// Contained, left-aligned card carousel with pointer-drag + snap, sized to the content column and a centred nav row underneath.
function RetailerCarousel({ items }: { items: typeof retailers }) {
  const vpRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(0);
  const [range, setRange] = useState({ min: 0, max: 0, step: 1 });
  const [dragging, setDragging] = useState(false);
  // live gesture state (avoids stale-closure reads inside pointer handlers)
  const drag = useRef({ x: 0, tx: 0, active: false, moved: false, min: 0, max: 0, step: 1 });

  // measure card width and the clamped translate range so each nav dot maps to a distinct card (max=0 keeps the first flush-left).
  const measure = useCallback(() => {
    const vp = vpRef.current;
    const card = trackRef.current?.querySelector<HTMLElement>("[data-card]");
    if (!vp || !card) return null;
    const cardW = card.offsetWidth;
    const step = cardW + 24;
    const r = { min: -(items.length - 1) * step, max: 0, step };
    setRange(r);
    return r;
  }, [items.length]);

  const snap = useCallback((rawTx: number, r: { min: number; max: number; step: number }) => {
    const i = Math.round((r.max - rawTx) / r.step);
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    setTx(Math.max(r.min, Math.min(r.max, r.max - clamped * r.step)));
  }, [items.length]);

  const positioned = useRef(false);
  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    let raf = 0;
    const init = () => {
      const r = measure();
      if (!r) {
        raf = requestAnimationFrame(init);
        return;
      }
      positioned.current = true;
      setTx(r.max);
    };
    raf = requestAnimationFrame(init);
    const ro = new ResizeObserver(() => {
      const r = measure();
      if (r && positioned.current) setTx((p) => Math.max(r.min, Math.min(r.max, p)));
    });
    ro.observe(vp);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [measure]);

  const stepBy = (d: number) => {
    const cur = Math.round((range.max - tx) / range.step);
    snap(range.max - (cur + d) * range.step, range);
  };
  const goTo = (i: number) => snap(range.max - i * range.step, range);

  const onDown = (e: React.PointerEvent) => {
    const r = measure() ?? range;
    drag.current = { x: e.clientX, tx, active: true, moved: false, ...r };
    setDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore — synthetic events / unsupported pointers */
    }
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    if (Math.abs(e.clientX - d.x) > 6) d.moved = true;
    const raw = d.tx + (e.clientX - d.x);
    // rubber-band resistance past the clamped bounds
    const v = raw > d.max ? d.max + (raw - d.max) * 0.3 : raw < d.min ? d.min + (raw - d.min) * 0.3 : raw;
    setTx(v);
  };
  const onUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    snap(tx, { min: drag.current.min, max: drag.current.max, step: drag.current.step });
  };

  const active = Math.max(0, Math.min(items.length - 1, Math.round((range.max - tx) / range.step)));
  const atStart = tx >= range.max - 1;
  const atEnd = tx <= range.min + 1;
  const ctrl =
    "flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#e8e7e2] bg-white text-[#17181b] transition-colors enabled:hover:border-[var(--finevu-orange)] enabled:hover:text-[var(--finevu-orange)] disabled:cursor-default disabled:opacity-30";

  return (
    <div>
      <div ref={vpRef} className="overflow-hidden" style={{ touchAction: "pan-y" }}>
        <div
          ref={trackRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className={`flex select-none items-stretch gap-6 pb-2 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            transform: `translate3d(${tx}px,0,0)`,
            transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {items.map((r, i) => (
            <motion.article
              key={r.name}
              data-card
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex w-[min(85vw,460px)] shrink-0 flex-col rounded-[20px] border border-[#e8e7e2] bg-white p-[30px] shadow-[0_2px_10px_rgba(20,21,25,0.04)]"
            >
              <span className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#f8dcc2] bg-[#fef2e5] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--finevu-orange)]"><ShieldCheck className="h-3 w-3" /> Authorised Retailer</span>
              <div className="mb-[18px] flex h-[50px] items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.logo} alt={r.name} draggable={false} className="max-h-[44px] w-auto max-w-[160px] object-contain" />
              </div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9a9da5]">{r.cat}</p>
              <p className="mb-5 text-[15px] leading-[1.6] text-[#5b5e66]">{r.desc}</p>
              <ul className="mb-[26px] grid gap-3">
                {r.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[14px] text-[#17181b]">
                    <span className="mt-px flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[var(--finevu-orange)] bg-[#fef2e5] text-[var(--finevu-orange)]"><Check className="h-2.5 w-2.5" strokeWidth={3} /></span>{p}
                  </li>
                ))}
              </ul>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { if (drag.current.moved) e.preventDefault(); }}
                className="cta-hover mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-[var(--finevu-orange)] px-[18px] py-[13px] text-[14px] font-semibold uppercase leading-[20px] text-white"
              >
                {r.cta} <ArrowRight className="h-[14px] w-[14px]" />
              </a>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Nav row: arrows + retailer dots */}
      <div className="mt-9 flex items-center justify-center gap-5">
        <button type="button" onClick={() => stepBy(-1)} disabled={atStart} aria-label="Previous retailer" className={ctrl}>
          <ChevronLeft className="h-[19px] w-[19px]" />
        </button>
        <div className="flex items-center">
          {items.map((r, i) => (
            <button
              key={r.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${r.name}`}
              aria-current={i === active}
              className="group flex h-6 min-w-6 items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-all ${i === active ? "w-[22px] bg-[var(--finevu-orange)]" : "w-2 bg-[#e8e7e2] group-hover:bg-[#c9c8c2]"}`}
              />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => stepBy(1)} disabled={atEnd} aria-label="Next retailer" className={ctrl}>
          <ChevronRight className="h-[19px] w-[19px]" />
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const [tab, setTab] = useState<"online" | "retail">("online");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section id="top" className="relative flex aspect-[2160/1040] max-h-[880px] min-h-[600px] items-center justify-center text-center text-white" data-nav-theme="dark">
        <Image src="/retailers/hero.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(rgba(12,12,14,.35),rgba(12,12,14,.5))" }} />
        <div className="relative z-10 mx-auto max-w-[660px] px-6 pt-36 pb-24">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-[40px] font-semibold leading-[48px] tracking-[-0.015em] md:text-[64px] md:leading-[76px]">
            Find your nearest
            <br />
            FineVu retailer
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="mx-auto mt-[22px] max-w-[540px] text-[16px] leading-[1.6] text-white/90 md:text-[18px]">
            FineVu dash cams are sold through our authorised Australian retailers — so you get genuine stock,
            local support and a full 3-year warranty. Shop online, or find a store near you.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24 }} className="mt-9 flex flex-wrap justify-center gap-3.5">
            <a href="#where" className="cta-hover rounded-full bg-[var(--finevu-orange)] px-7 py-3.5 text-[14px] font-semibold uppercase leading-[20px] text-white">Book Retailers</a>
            <a href="#why" className="cta-hover rounded-full border border-white/25 bg-white/15 px-7 py-3.5 text-[14px] font-semibold uppercase leading-[20px] text-white backdrop-blur transition-colors hover:bg-white/25">Why Buy Authorised</a>
          </motion.div>
        </div>
      </section>

      {/* Where to buy */}
      <section id="where" className="scroll-mt-24 bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.div {...fadeUp} className="mx-auto mb-11 max-w-[660px] text-center">
            <h2 className="text-[32px] font-semibold leading-[40px] tracking-[-0.015em] text-[#17181b] md:text-[48px] md:leading-[60px]">Buy FineVu from an<br />authorised retailer.</h2>
            <p className="mt-4 text-[18px] leading-[1.6] text-[#6e6e73]">Every retailer below sells genuine FineVu units imported by AutoXtreme, the official Australian distributor. Shop online for delivery or click &amp; collect, or switch to Retail Stores to find one near you.</p>
          </motion.div>

          {/* Tabs: centred with a full-width underline divider */}
          <div className="mb-8 border-b border-[#e8e7e2] pb-6">
            <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Where to buy options">
              {([["online", "Online Stores", Monitor], ["retail", "Retail Stores", Store]] as const).map(([key, label, Icon]) => (
                <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
                  className={`inline-flex items-center gap-2 rounded-full px-[23px] py-3 text-[.9rem] font-semibold transition-colors ${tab === key ? "bg-[#17181b] text-white" : "text-[#5b5e66] hover:text-[#17181b]"}`}>
                  <Icon className="h-[17px] w-[17px]" /> {label}
                </button>
              ))}
            </div>
          </div>

          {tab === "online" ? (
            <>
              <p className="mb-8 flex max-w-[640px] items-start gap-3 text-[15px] text-[#5b5e66]">
                <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[var(--finevu-orange)] text-[10px] font-bold text-[var(--finevu-orange)]">i</span>
                <span><b className="font-semibold text-[#17181b]">Shop the GX4K and GX35 online.</b> Each retailer stocks genuine FineVu units. Swipe or use the arrows to compare, then head to their store to buy.</span>
              </p>
              <RetailerCarousel items={retailers} />
            </>
          ) : (
            <StoreLocator />
          )}
        </div>
      </section>

      {/* Why authorised */}
      <section id="why" className="scroll-mt-24 bg-[#f4f4f1] py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.div {...fadeUp} className="mx-auto mb-11 max-w-[660px] text-center">
            <h2 className="text-[32px] font-semibold leading-[40px] tracking-[-0.015em] text-[#17181b] md:text-[48px] md:leading-[60px]">Why buy from an authorised<br />retailer?</h2>
            <p className="mt-4 text-[18px] leading-[1.6] text-[#5b5e66]">Grey-market dash cams can arrive without local warranty, support or the right firmware. Buying authorised protects your purchase.</p>
          </motion.div>
          <div className="mx-auto grid max-w-[1020px] gap-[22px] md:grid-cols-3">
            {whyAuth.map((w, i) => (
              <motion.div key={w.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="rounded-[14px] border border-[#e8e7e2] bg-white p-7 shadow-[0_2px_10px_rgba(20,21,25,0.04)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-[11px] bg-[#fef2e5] text-[var(--finevu-orange)]"><w.icon className="h-[22px] w-[22px]" strokeWidth={1.8} /></span>
                <h3 className="mb-2 mt-4 text-[1rem] font-semibold text-[#17181b]">{w.title}</h3>
                <p className="text-[15px] leading-[1.6] text-[#5b5e66]">{w.node}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Install CTA */}
      <section className="bg-white py-24 text-center md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.h2 {...fadeUp} className="mb-11 text-[32px] font-semibold leading-[40px] tracking-[-0.015em] text-[#17181b] md:text-[48px] md:leading-[60px]">Got your FineVu?<br />Leave the wiring to us.</motion.h2>
          <motion.div {...fadeUp} className="mx-auto aspect-[12/5] max-w-[860px] overflow-hidden rounded-[18px] shadow-[0_18px_44px_rgba(20,21,25,0.12)]">
            <Image src="/retailers/wiring.webp" alt="FineVu certified installer arriving on-site" width={860} height={358} className="h-full w-full object-cover" />
          </motion.div>
          <motion.p {...fadeUp} className="mx-auto mb-9 mt-9 max-w-[600px] text-[16px] leading-[1.6] text-[#5b5e66] md:text-[18px]">The GX4K records straight out of the box, but full-time parking protection means hardwiring it properly into your fuse box. Our certified installers fit it cleanly, hide every cable and set it up right the first time.</motion.p>
          <motion.div {...fadeUp}>
            <Link href="/booking" className="cta-hover inline-flex rounded-full bg-[var(--finevu-orange)] px-9 py-3.5 text-[14px] font-semibold uppercase leading-[20px] text-white">Book Installation</Link>
          </motion.div>
        </div>
      </section>

      {/* Help strip */}
      <LearnMoreLinks />

      <Footer cta={false} />
    </div>
  );
}

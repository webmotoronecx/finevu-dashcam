"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { motion } from "motion/react";
import { useMemo, useRef, useState, Fragment } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Clock,
  Sparkles,
  Camera,
  Cable,
  Plug,
  BatteryCharging,
  Smartphone,
  CheckCircle2,
  Check,
  ChevronDown,
  Home,
  Briefcase,
  Lock,
} from "lucide-react";

// Booking / installation page — hero, booking wizard, how-it-works, what's-included, service-area checker, why-experts, FAQs, fine print.

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6 },
};

const STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
const SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOWS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TOTAL = 5;
const STEP_LABELS = ["Your Dash Cam", "Location", "Date & Time", "Your Details", "Checkout"];

const HERO_STATS = [
  { value: "$250 AUD", label: "One price, every install" },
  { value: "Mobile service", label: "We come to home or work" },
  { value: "60–90 mins", label: "Typical install time" },
  { value: "No payment to book", label: "Pay on the day" },
];

const THREE = [
  { n: "1.", title: "Purchase from an authorised retailer", body: "Buy the GX4K or GX35 from an authorised FineVu retailer. The hardwire kit and power cable are already in the box — nothing extra to source.", img: "/installation/step-purchase.webp" },
  { n: "2.", title: "Book your installation online", body: "Choose your model, confirm the install location, pick a date and time that suits you. $250 flat — no payment required to reserve.", img: "/installation/step-book.webp" },
  { n: "", title: "Your installer comes to you", body: "A certified installer arrives at your home or workplace, fits the camera cleanly, conceals all cabling, configures everything and tests it before handover.", img: "/installation/step-install.webp" },
];

const INCLUDED = [
  { icon: Camera, title: "Precision camera placement", sub: "Mounted in the optimal position for full road coverage with minimal interior obstruction, clear of wiper sweep and your line of sight." },
  { icon: Cable, title: "Fully concealed cabling", sub: "Every cable routed through trim panels and A-pillars for a factory-fitted appearance, with the rear camera cable run the length of the vehicle." },
  { icon: Plug, title: "Safe fuse-box connection", sub: "Hardwired to a switched fuse with the correct amperage using fuse-tap connections — no bare wires, no cutting or splicing of factory wiring." },
  { icon: BatteryCharging, title: "Parking mode & battery protection setup", sub: "Voltage cutoff configured to protect your battery, parking mode enabled and tested so your camera keeps watch without draining the car." },
  { icon: Smartphone, title: "App connection & settings configuration", sub: "Wi-Fi pairing, ADAS settings and recording preferences set before handover — resolution, sensitivity, time and speed display." },
  { icon: CheckCircle2, title: "Full system test & handover", sub: "Live recording verified, all modes confirmed, and a brief walkthrough for the owner before your installer signs off." },
];

const WHY = [
  { icon: ShieldCheck, title: "Your vehicle, protected", body: "A professional hardwire uses a fused tap at the correct amperage. No risk of electrical faults, melted connectors, or void warranties from a botched DIY job." },
  { icon: Clock, title: "Parking mode, done properly", body: "Parking mode only works reliably with a hardwire. Our installers configure the voltage cutoff for your specific vehicle to protect your battery." },
  { icon: Sparkles, title: "A finish that matches the camera", body: "The GX4K is a premium piece of hardware. It deserves a premium install — cables fully hidden, no dangling wires, no tape, nothing visible." },
];

const FAQS = [
  { q: "Do I need to buy my dash cam before booking?", a: "Yes. FineVu dash cams are sold through our authorised retailers rather than directly from FineVu, so installation is booked separately. Once your camera has arrived — or is on its way — you can book your fitting here. Just make sure it's with the vehicle on the day." },
  { q: "Which models are supported?", a: "Our installer network fits the FineVu GX4K and GX35. Both are front-and-rear (2CH) systems, and both are covered by the same $250 flat installation rate." },
  { q: "How long does the installation take?", a: "Most installations take 60–90 minutes — that covers the front and rear cameras, hardwiring, configuration and testing. Some vehicles with complex trim can take a little longer. Your installer will give you an accurate estimate when they confirm your booking." },
  { q: "Where does the installation take place?", a: "Our installers are fully mobile and come to your home or workplace. All they need is level, off-street access to your vehicle — a driveway, garage, carport or accessible car park — and the vehicle available for the duration of the appointment." },
  { q: "Why is hardwire the standard install?", a: "Hardwiring connects your FineVu to the vehicle's fuse box using the hardwire kit already included in your box, so the camera can keep recording while the ignition is off. It unlocks parking mode and FineVu's battery protection system, which powers the camera down before your car's battery runs low — and it's the part that genuinely benefits from professional hands. If you only want recording while driving, the included power cable is a simple plug-in DIY setup, so there's no need to book an install for that." },
  { q: "Is it safe for my vehicle's electronics?", a: "Yes. Our installers use non-invasive fuse-tap connections matched to your vehicle — factory wiring is never cut or spliced. Cabling is routed behind existing trim, and everything is tested before handover, so your car's electronics and manufacturer warranty stay protected." },
  { q: "How much does it cost?", a: "Installation is one flat rate of $250 — every vehicle, whether you've chosen the GX4K or GX35. It covers the full front-and-rear hardwire installation, configuration and system test. Payment is taken securely at checkout when you book, and a tax receipt is emailed to you straight away." },
  { q: "What areas are covered?", a: "Our network covers all major metro areas and a growing list of regional centres, and we're expanding. If we can't reach you right now, we'll let you know promptly and help you find a suitable local option. Installation is not currently available in the Northern Territory." },
  { q: "Can I reschedule or cancel my booking?", a: "Of course. Plans change — just reply to your confirmation email or call us at least 24 hours before your appointment and we'll move it to a time that suits. There's no fee to reschedule with notice." },
];

const FINE_PRINT = [
  ["1. Warranty:", "3-Year Warranty applies to FineVu dash cam main unit cameras, including front and rear cameras, for 36 months from the date of purchase. Genuine FineVu accessories are covered by a 6-month warranty. Proof of purchase required. Full warranty terms apply. Your rights under the Australian Consumer Law are not excluded."],
  ["2. SD Cards:", "GX4K includes a FineVu 128GB MicroSD Card and Adapter. GX35 includes a FineVu 64GB MicroSD Card and Adapter. Included MicroSD Cards and adapters are covered by a 6-month warranty."],
  ["3. Hardwire Kit & Power Cable:", "GX4K and GX35 include a Hardwire Kit and Power Cable. Included Hardwire Kits and Power Cables are covered by a 6-month warranty."],
];

type Coverage ={ msg: string; cls: "ok" | "warn" | "err" | "" };
function coverageMessage(pc: string): Coverage {
  const n = parseInt(pc, 10);
  if (isNaN(n)) return { msg: "", cls: "" };
  if (pc.length === 4 && /^0[89]/.test(pc)) return { msg: "Installation isn’t currently available in the Northern Territory.", cls: "err" };
  const metro: [number, number, string][] = [
    [2000, 2249, "Sydney"], [2555, 2574, "Greater Sydney"], [2740, 2786, "Greater Sydney"], [2500, 2530, "Wollongong"], [2250, 2330, "Newcastle & Central Coast"],
    [2600, 2620, "Canberra"], [2900, 2920, "Canberra"], [3000, 3220, "Melbourne"], [3214, 3227, "Geelong"], [3335, 3338, "Melbourne West"], [3750, 3810, "Melbourne outer"],
    [4000, 4209, "Brisbane"], [4210, 4230, "the Gold Coast"], [4300, 4306, "Ipswich"], [4500, 4521, "Moreton Bay"], [4550, 4580, "the Sunshine Coast"],
    [5000, 5199, "Adelaide"], [6000, 6210, "Perth"], [7000, 7099, "Hobart"],
  ];
  for (const [lo, hi, name] of metro) if (n >= lo && n <= hi) return { msg: `Great news — certified installers service ${name}. Mobile installation is available in your area.`, cls: "ok" };
  return { msg: "You may be within our regional coverage. Submit your booking and we’ll confirm availability within one business day.", cls: "warn" };
}
const hintColor: Record<string, string> = { ok: "text-[#1E9E5A]", warn: "text-[#C77700]", err: "text-[#D93816]", "": "text-[#6e6e73]" };

type Form = {
  model: string | null; place: string | null; street: string; suburb: string; stateAu: string; postcode: string; slot: string | null;
  name: string; phone: string; email: string; retailer: string; make: string; vmodel: string; year: string; notes: string;
  ccName: string; ccNum: string; ccExp: string; ccCvc: string;
};
const EMPTY: Form = { model: null, place: null, street: "", suburb: "", stateAu: "", postcode: "", slot: null, name: "", phone: "", email: "", retailer: "", make: "", vmodel: "", year: "", notes: "", ccName: "", ccNum: "", ccExp: "", ccCvc: "" };

function useCalendar() {
  return useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const days: { date: Date; day: number; month: string; disabled: boolean }[] = [];
    for (let i = 0; i < 28; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const weekend = d.getDay() === 0 || d.getDay() === 6;
      days.push({ date: d, day: d.getDate(), month: MONTHS[d.getMonth()], disabled: d <= today || weekend });
    }
    return days;
  }, []);
}

const INPUT = "w-full rounded-[8px] border border-[#e8e7e2] bg-white px-[15px] py-3 text-[15px] text-[#1d1d1f] outline-none transition-colors focus:border-[var(--finevu-orange)]";
const FLABEL = "mb-2.5 mt-[22px] block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9c9ca3]";
const FIELD_LABEL = "mb-1.5 block text-[13px] font-semibold leading-[19.5px] text-[#1d1d1f]";

function BookingWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [hint, setHint] = useState<Coverage>({ msg: "", cls: "" });
  const [date, setDate] = useState<Date | null>(null);
  const [dateLabel, setDateLabel] = useState("");
  const [processing, setProcessing] = useState(false);
  const [ref, setRef] = useState("");
  const days = useCalendar();
  const bookRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const scrollTop = () => bookRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  function fail(msg: string): false { setHint({ msg, cls: "err" }); return false; }
  function validate(s: number): boolean {
    if (s === 1 && !form.model) return fail("Please select your FineVu model.");
    if (s === 2) {
      if (!form.place) return fail("Please choose home or workplace.");
      if (!form.street || !form.suburb || !form.stateAu || !/^\d{4}$/.test(form.postcode)) return fail("Please complete your address, including a 4-digit postcode.");
      if (form.stateAu === "NT" || /^0[89]\d\d$/.test(form.postcode)) return fail("Sorry — installation isn’t currently available in the Northern Territory.");
      setHint(coverageMessage(form.postcode)); return true;
    }
    if (s === 3) { if (!date) return fail("Please select a date."); if (!form.slot) return fail("Please select a start time."); }
    if (s === 4) {
      if (!form.name) return fail("Please enter your name.");
      if (!/^[\d\s+()-]{8,}$/.test(form.phone)) return fail("Please enter a valid mobile number.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return fail("Please enter a valid email address.");
      if (!form.make || !form.vmodel) return fail("Please enter your vehicle make and model.");
    }
    if (s === 5) {
      const num = form.ccNum.replace(/\s+/g, "");
      if (!form.ccName) return fail("Please enter the name on your card.");
      if (!/^\d{15,16}$/.test(num)) return fail("Please enter a valid card number.");
      const em = form.ccExp.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
      if (!em) return fail("Please enter your card expiry as MM/YY.");
      const now = new Date(); const yy = 2000 + parseInt(em[2], 10); const mm = parseInt(em[1], 10);
      if (yy < now.getFullYear() || (yy === now.getFullYear() && mm < now.getMonth() + 1)) return fail("Your card expiry date has passed.");
      if (!/^\d{3,4}$/.test(form.ccCvc)) return fail("Please enter your card’s 3–4 digit CVC.");
    }
    setHint({ msg: "", cls: "" }); return true;
  }
  function next() {
    if (!validate(step)) return;
    if (step < TOTAL) { setHint({ msg: "", cls: "" }); setStep(step + 1); scrollTop(); }
    else {
      setProcessing(true);
      window.setTimeout(() => { setRef("FV-" + Math.random().toString(36).slice(2, 8).toUpperCase()); setProcessing(false); setStep(6); scrollTop(); }, 900);
    }
  }
  function back() { if (step > 1) { setHint({ msg: "", cls: "" }); setStep(step - 1); scrollTop(); } }

  const summaryRows = (): [string, string][] => [
    ["Dash cam", `${form.model || "—"} · Front + rear (2CH)`],
    ["Install", "Professional hardwire install"],
    ["Location", (form.place ? form.place + " — " : "") + [form.street, form.suburb, form.stateAu, form.postcode].filter(Boolean).join(", ")],
    ["Date", dateLabel || "—"],
    ["Time", form.slot || "—"],
    ["Total", "$250.00 AUD — paid today"],
  ];
  const confirmRows = (): [string, string][] => {
    const rows = summaryRows();
    rows.push(["Payment", `Card ending ${form.ccNum.replace(/\s+/g, "").slice(-4)} · Paid`], ["Name", form.name], ["Contact", `${form.phone} · ${form.email}`]);
    if (form.make) rows.push(["Vehicle", [form.make, form.vmodel, form.year].filter(Boolean).join(" ")]);
    return rows;
  };
  const stepDone = (s: number) => s < step || step > TOTAL;

  return (
    <div ref={bookRef} className="scroll-mt-24">
      <div className="mx-auto w-full overflow-hidden rounded-[18px] border border-[#e8e7e2] bg-white shadow-[0_4px_40px_rgba(0,0,0,0.08)]">
        {/* head — step indicator + price badge */}
        <div className="flex flex-col gap-5 border-b border-[#e8e7e2] bg-[#f7f6f3] px-6 pb-[25px] pt-6 md:flex-row md:items-center md:justify-between md:px-9">
          <div className="flex flex-1 items-start">
            {STEP_LABELS.map((label, i) => {
              const s = i + 1; const active = s === step && step <= TOTAL; const done = stepDone(s);
              return (
                <Fragment key={label}>
                  {i > 0 && <div className={`mt-4 h-px min-w-[16px] flex-1 ${stepDone(i) ? "bg-[var(--finevu-orange)]" : "bg-[#e8e7e2]"}`} />}
                  <div className="flex flex-col items-center gap-2">
                    <span className={`flex size-8 items-center justify-center rounded-[16px] border-2 ${done ? "border-[var(--finevu-orange)] bg-[var(--finevu-orange)]" : active ? "border-[var(--finevu-orange)]" : "border-[#e8e7e2]"}`}>
                      {done ? <Check className="h-[15px] w-[15px] text-white" strokeWidth={2.5} /> : <span className={`text-[13px] font-bold leading-[19.5px] ${active ? "text-[var(--finevu-orange)]" : "text-[#9a9da5]"}`}>{s}</span>}
                    </span>
                    <span className={`whitespace-nowrap text-[11px] font-medium leading-[16.5px] ${active ? "text-[#1d1d1f]" : "text-[#9a9da5]"}`}>{label}</span>
                  </div>
                </Fragment>
              );
            })}
          </div>
          <span className="shrink-0 self-center whitespace-nowrap rounded-[8px] border border-[var(--finevu-orange)] bg-[#fff1e8] px-[15px] py-[9px] text-[12px] font-bold leading-[18px] text-[var(--finevu-orange)] md:self-start">$250 AUD · Paid Today</span>
        </div>

        {/* body */}
        <div className="min-h-[340px] px-6 py-8 md:px-9 md:py-10">
          {step === 1 && (
            <div>
              <h3 className="text-[22px] font-semibold text-[#1d1d1f]">Which FineVu are we fitting?</h3>
              <p className="mt-2 max-w-[600px] text-[18px] leading-[1.6] text-[#6e6e73]">Both models are front-and-rear systems with the hardwire kit and power cable included in the box — so everything your installer needs arrives with your camera.</p>
              <span className={FLABEL}>Your model</span>
              <div className="grid gap-3.5 sm:grid-cols-2">
                {[{ v: "GX4K", d: "4K UHD front + Full HD rear · Sony STARVIS · 128GB card & hardwire kit included" }, { v: "GX35", d: "2K QHD front + Full HD rear · Sony STARVIS 2 · 64GB card & hardwire kit included" }].map((m) => (
                  <button key={m.v} type="button" onClick={() => { set("model", m.v); setHint({ msg: "", cls: "" }); }} className={`relative rounded-[12px] border-[1.5px] px-5 py-[18px] text-left transition-colors ${form.model === m.v ? "border-[var(--finevu-orange)] bg-[#fef2e5]" : "border-[#e7e7ea] hover:border-[#9c9ca3]"}`}>
                    <span className="block text-[.95rem] font-semibold text-[#1d1d1f]">{m.v}</span>
                    <small className="mt-1.5 block text-[.8rem] leading-[1.5] text-[#6e6e73]">{m.d}</small>
                    {form.model === m.v && <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[var(--finevu-orange)]" />}
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-[12px] bg-[#f7f7f7] px-5 py-4 text-[.85rem] leading-[1.6] text-[#6e6e73]">
                <b className="text-[#1d1d1f]">Every booking is a full professional hardwire installation — $250 flat.</b> Front and rear cameras fitted, wired to the fuse box for parking mode and battery protection, configured and tested. Prefer plug-in power for driving-only recording? That&apos;s a simple DIY setup with the included power cable — no booking needed.
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-[22px] font-semibold leading-[33px] text-[#1d1d1f]">Where should we come to you?</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[{ v: "Home", t: "At home", icon: Home }, { v: "Workplace", t: "At my workplace", icon: Briefcase }].map((p) => {
                  const sel = form.place === p.v; const Ico = p.icon;
                  return (
                    <button key={p.v} type="button" onClick={() => { set("place", p.v); setHint({ msg: "", cls: "" }); }} className={`flex flex-col items-center gap-3 rounded-[14px] border-2 px-[26px] py-[30px] transition-colors ${sel ? "border-[var(--finevu-orange)] bg-[#fff1e8]" : "border-[#e8e7e2] bg-white hover:border-[#9c9ca3]"}`}>
                      <Ico className={`h-7 w-7 ${sel ? "text-[var(--finevu-orange)]" : "text-[#9a9da5]"}`} strokeWidth={1.75} />
                      <span className="text-[16px] font-semibold leading-[24px] text-[#1d1d1f]">{p.t}</span>
                      <span className={`flex size-[22px] items-center justify-center rounded-[11px] border-2 ${sel ? "border-[var(--finevu-orange)] bg-[var(--finevu-orange)]" : "border-[#e8e7e2]"}`}>
                        {sel && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8">
                <label htmlFor="street" className={FIELD_LABEL}>Street address</label>
                <AddressAutocomplete
                  id="street"
                  className={INPUT}
                  placeholder="Start typing your address…"
                  value={form.street}
                  onChange={(v) => set("street", v)}
                  onSelect={(p) => {
                    setForm((f) => ({
                      ...f,
                      street: p.street || f.street,
                      suburb: p.suburb || f.suburb,
                      stateAu: STATES.includes(p.state) ? p.state : f.stateAu,
                      postcode: p.postcode || f.postcode,
                    }));
                    setHint({ msg: "", cls: "" });
                  }}
                />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-2"><label className={FIELD_LABEL}>Suburb</label><input className={INPUT} placeholder="Melbourne" value={form.suburb} onChange={(e) => set("suburb", e.target.value)} /></div>
                <div><label className={FIELD_LABEL}>State</label><select className={INPUT} value={form.stateAu} onChange={(e) => set("stateAu", e.target.value)}><option value="">State</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select></div>
                <div><label className={FIELD_LABEL}>Postcode</label><input className={INPUT} placeholder="3000" inputMode="numeric" maxLength={4} value={form.postcode} onChange={(e) => set("postcode", e.target.value.replace(/\D/g, "").slice(0, 4))} /></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-[22px] font-semibold text-[#1d1d1f]">Choose a date and time</h3>
              <p className="mt-2 max-w-[600px] text-[18px] leading-[1.6] text-[#6e6e73]">Select a weekday that suits you, then a start time. Installers are available hourly from 9am to 5pm, Monday to Friday. Most installations take 60–90 minutes.</p>
              <span className={FLABEL}>Date</span>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {DOWS.map((d) => <div key={d} className="pb-1 text-center text-[11px] font-semibold uppercase text-[#9c9ca3]">{d}</div>)}
                {days.map((d, i) => {
                  const selected = date?.getTime() === d.date.getTime();
                  return (
                    <button key={i} type="button" disabled={d.disabled} onClick={() => { setDate(d.date); setDateLabel(d.date.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })); setHint({ msg: "", cls: "" }); }}
                      className={`flex flex-col items-center rounded-[10px] border-[1.5px] py-2 text-[.88rem] transition-colors ${d.disabled ? "cursor-not-allowed border-transparent text-[#d4d4d8]" : selected ? "border-[var(--finevu-orange)] bg-[#fef2e5] text-[var(--finevu-orange)]" : "border-[#e7e7ea] text-[#1d1d1f] hover:border-[#9c9ca3]"}`}>
                      <span className="text-[.6rem] uppercase text-[#9c9ca3]">{d.month}</span>{d.day}
                    </button>
                  );
                })}
              </div>
              <span className={FLABEL}>Start time</span>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
                {SLOTS.map((s) => (
                  <button key={s} type="button" onClick={() => { set("slot", s); setHint({ msg: "", cls: "" }); }} className={`rounded-full border-[1.5px] px-3 py-2.5 text-[.85rem] font-medium transition-colors ${form.slot === s ? "border-[var(--finevu-orange)] bg-[#fef2e5] text-[var(--finevu-orange)]" : "border-[#e7e7ea] text-[#1d1d1f] hover:border-[#9c9ca3]"}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-[22px] font-semibold text-[#1d1d1f]">Your details</h3>
              <p className="mt-2 max-w-[600px] text-[18px] leading-[1.6] text-[#6e6e73]">Almost done. We&apos;ll use these details to confirm your booking and for your installer to reach you on the day.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input className={INPUT} placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} />
                <input className={INPUT} placeholder="Mobile number" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input className={INPUT} placeholder="Email address" inputMode="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                <input className={INPUT} placeholder="Where did you purchase? (optional)" value={form.retailer} onChange={(e) => set("retailer", e.target.value)} />
              </div>
              <span className={FLABEL}>Your vehicle</span>
              <div className="grid gap-4 sm:grid-cols-3">
                <input className={INPUT} placeholder="Make (e.g. Toyota)" value={form.make} onChange={(e) => set("make", e.target.value)} />
                <input className={INPUT} placeholder="Model (e.g. RAV4)" value={form.vmodel} onChange={(e) => set("vmodel", e.target.value)} />
                <input className={INPUT} placeholder="Year" inputMode="numeric" maxLength={4} value={form.year} onChange={(e) => set("year", e.target.value.replace(/\D/g, "").slice(0, 4))} />
              </div>
              <span className={FLABEL}>Anything we should know? (optional)</span>
              <textarea className={`${INPUT} min-h-[88px] resize-y`} placeholder="e.g. previous dash cam to remove, apartment parking access, preferred contact time…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-[22px] font-semibold text-[#1d1d1f]">Checkout</h3>
              <p className="mt-2 max-w-[600px] text-[18px] leading-[1.6] text-[#6e6e73]">Pay the $250 flat rate now to lock in your appointment. Your card is charged today and your booking is confirmed instantly.</p>
              <div className="mt-6 rounded-[12px] bg-[#f7f7f7] px-6 py-[22px]">
                <span className="mb-3 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--finevu-orange)]">Order summary</span>
                <dl className="space-y-2 text-[.88rem]">{summaryRows().map(([k, v]) => <div key={k} className="flex justify-between gap-6"><dt className="text-[#6e6e73]">{k}</dt><dd className="text-right font-medium text-[#1d1d1f]">{v}</dd></div>)}</dl>
              </div>
              <span className={FLABEL}>Payment details</span>
              <input className={INPUT} placeholder="Name on card" autoComplete="cc-name" value={form.ccName} onChange={(e) => set("ccName", e.target.value)} />
              <input className={`${INPUT} mt-4`} placeholder="Card number" inputMode="numeric" autoComplete="cc-number" maxLength={19} value={form.ccNum} onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 16); set("ccNum", d.replace(/(\d{4})(?=\d)/g, "$1 ")); }} />
              <div className="mt-4 grid max-w-[420px] gap-4 sm:grid-cols-2">
                <input className={INPUT} placeholder="Expiry (MM/YY)" inputMode="numeric" autoComplete="cc-exp" maxLength={5} value={form.ccExp} onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 4); set("ccExp", d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d); }} />
                <input className={INPUT} placeholder="CVC" inputMode="numeric" autoComplete="cc-csc" maxLength={4} value={form.ccCvc} onChange={(e) => set("ccCvc", e.target.value.replace(/\D/g, "").slice(0, 4))} />
              </div>
              <p className="mt-[22px] flex items-start gap-2 text-[.78rem] text-[#9c9ca3]"><Lock className="mt-[3px] h-[13px] w-[13px] shrink-0 text-[var(--finevu-orange)]" /> Payments are encrypted and processed securely. A tax receipt is emailed to you as soon as payment clears.</p>
            </div>
          )}

          {step === 6 && (
            <div className="py-[22px] text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--finevu-orange)] text-white"><Check className="h-7 w-7" strokeWidth={2.4} /></div>
              <h3 className="text-[22px] font-semibold text-[#1d1d1f]">Booking confirmed — payment received</h3>
              <div className="my-3.5 text-[.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--finevu-orange)]">Ref {ref} · Paid</div>
              <p className="mx-auto max-w-[520px] text-[.92rem] leading-[1.7] text-[#6e6e73]">Thank you — your payment of $250.00 AUD has been received and your installation is locked in. Your confirmation and tax receipt are on their way to your email, and your installer will call ahead on the day. Please have your FineVu and all in-box accessories, including the hardwire kit, with the vehicle.</p>
              <div className="mx-auto mt-8 max-w-[580px] rounded-[12px] bg-[#f7f7f7] px-6 py-[22px] text-left">
                <dl className="space-y-2 text-[.88rem]">{confirmRows().map(([k, v]) => <div key={k} className="flex justify-between gap-6"><dt className="text-[#6e6e73]">{k}</dt><dd className="text-right font-medium text-[#1d1d1f]">{v}</dd></div>)}</dl>
              </div>
            </div>
          )}

          {hint.msg && step <= TOTAL && <p className={`mt-3.5 text-[.83rem] font-medium ${hintColor[hint.cls]}`}>{hint.msg}</p>}
        </div>

        {/* foot */}
        {step <= TOTAL && (
          <div className="flex items-center justify-between gap-4 border-t border-[#e8e7e2] px-6 py-5 md:px-9">
            <button type="button" onClick={back} disabled={step === 1} className="rounded-full border border-[#1d1d1f] px-[19px] py-[9px] text-[12px] font-semibold uppercase leading-[18px] tracking-[0.96px] text-[#1d1d1f] transition-colors disabled:cursor-not-allowed disabled:opacity-30">← Back</button>
            <span className="text-[13px] font-medium leading-[19.5px] text-[#9a9da5]">Step {step} of {TOTAL}</span>
            <button type="button" onClick={next} disabled={processing} className="cta-hover rounded-full bg-[var(--finevu-orange)] px-[18px] py-[8px] text-[12px] font-semibold uppercase leading-[18px] text-white disabled:opacity-70">{processing ? "Processing…" : step === TOTAL ? "Pay $250 AUD" : "Continue →"}</button>
          </div>
        )}
      </div>

      {/* We Accept — payment logos */}
      <div className="mt-14 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/installation/we-accept.svg" alt="We accept AMEX, Mastercard, Visa, Apple Pay, PayPal, Shop Pay and UnionPay" width={432} height={48} className="h-12 w-auto" />
      </div>
    </div>
  );
}

// Postcode row: [postcode, suburb, state, supported flag]; exact 4-digit lookup against a precomputed coverage dataset.
type PostcodeRow = [string, string, string, number];
let postcodeCache: PostcodeRow[] | null = null;

function PostcodeCheck() {
  const [pc, setPc] = useState("");
  const [result, setResult] = useState<Coverage>({ msg: "", cls: "" });
  const [checking, setChecking] = useState(false);

  async function loadRows(): Promise<PostcodeRow[] | null> {
    if (postcodeCache) return postcodeCache;
    try {
      const res = await fetch("/installation/au-postcodes.json");
      if (!res.ok) return null;
      const data = (await res.json()) as { rows: PostcodeRow[] };
      postcodeCache = data.rows;
      return postcodeCache;
    } catch {
      return null;
    }
  }

  async function run() {
    if (!/^\d{4}$/.test(pc)) { setResult({ msg: "Please enter a valid 4-digit Australian postcode.", cls: "err" }); return; }
    setChecking(true);
    const rows = await loadRows();
    setChecking(false);
    if (!rows) { setResult({ msg: "Sorry, we couldn’t check availability just now — please try again.", cls: "err" }); return; }
    const match = rows.find((r) => r[0] === pc);
    if (match && match[3]) setResult({ msg: `Great — installation is available in ${match[1]}, ${match[2]}.`, cls: "ok" });
    else if (match) setResult({ msg: `Sorry, we don’t service ${match[1]}, ${match[2]} yet.`, cls: "err" });
    else setResult({ msg: "Sorry, we don’t currently service that postcode. Submit a booking and we’ll confirm within one business day.", cls: "warn" });
  }

  return (
    <>
      <div className="mt-5 flex gap-3">
        <input value={pc} onChange={(e) => { setPc(e.target.value.replace(/\D/g, "").slice(0, 4)); if (result.msg) setResult({ msg: "", cls: "" }); }} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="Enter your postcode" inputMode="numeric" maxLength={4} autoComplete="postal-code" className="w-full flex-1 rounded-[8px] border border-[#e8e7e2] bg-[#f6f6f6] px-[15px] py-3 text-[15px] text-[#1d1d1f] outline-none transition-colors placeholder:text-[#17181b]/50 focus:border-[var(--finevu-orange)]" aria-label="Enter your postcode" />
        <button type="button" onClick={run} disabled={checking} className="cta-hover w-[166px] shrink-0 rounded-full bg-[var(--finevu-orange)] py-3 text-[14px] font-semibold uppercase leading-[20px] text-white disabled:opacity-70">{checking ? "Checking…" : "Check"}</button>
      </div>
      {result.msg && <p className={`mt-3.5 text-[.83rem] font-medium ${hintColor[result.cls]}`}>{result.msg}</p>}
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e8e7e2]">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={`flex w-full items-center justify-between gap-5 py-[20px] text-left text-[15px] font-semibold leading-[22.5px] transition-colors ${open ? "text-[var(--finevu-orange)]" : "text-[#17181b]"}`}>
        {q}<ChevronDown className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-[var(--finevu-orange)]" : "text-[#9c9ca3]"}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><div className="overflow-hidden"><p className="max-w-[700px] pb-6 text-[15px] leading-[23px] text-[#5b5e66]">{a}</p></div></div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section id="top" className="relative flex w-full aspect-[2160/960] min-h-screen items-center justify-center overflow-hidden text-center text-white" data-nav-theme="dark">
        <Image src="/installation/hero.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto max-w-[820px] px-6">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-[40px] font-semibold leading-[48px] tracking-[-0.8px] md:text-[64px] md:leading-[76px]">Leave the wiring to<br />the experts</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="mx-auto mt-[26px] max-w-[774px] text-[16px] leading-[27px] tracking-[-0.44px] text-white md:text-[18px]">Your FineVu records straight out of the box, but full-time parking protection means hardwiring it properly into your fuse box. Our certified installers come to you, fit it cleanly, hide every cable and set it up right the first time.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24 }} className="mt-9 flex flex-wrap justify-center gap-3.5">
            <a href="#book" className="cta-hover rounded-full bg-[var(--finevu-orange)] px-[29px] py-[14px] text-[14px] font-semibold uppercase leading-[20px] text-white">Book Installation</a>
            <a href="#how" className="cta-hover rounded-full border border-white/60 bg-white/5 px-[29px] py-[14px] text-[14px] font-semibold uppercase leading-[20px] text-white transition-colors hover:bg-white/10">See How It Works</a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="absolute inset-x-0 bottom-0 z-10"
        >
          <div className="mx-auto max-w-[1160px] px-6 pb-8 md:pb-12">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-6 text-left sm:grid-cols-4">
              {HERO_STATS.map((stat) => (
                <div key={stat.value}>
                  <div className="text-[20px] font-semibold leading-tight text-white md:text-[22px]">{stat.value}</div>
                  <div className="mt-1 text-[13px] leading-snug text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Wizard */}
      <section id="book" className="scroll-mt-24 bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <div className="mx-auto mb-11 max-w-[720px] text-center">
            <h2 className="text-[32px] font-semibold leading-[40px] tracking-[-0.5px] text-[#1d1d1f] md:text-[48px] md:leading-[60px]">Book your installation</h2>
            <p className="mt-4 text-[18px] leading-[27px] text-[#5b5e66]">Professional hardwire installation at your home or workplace. $250 flat rate — paid securely online when you book.</p>
          </div>
          <BookingWizard />
        </div>
      </section>

      {/* Three steps */}
      <section id="how" className="scroll-mt-24 bg-[#f7f7f7] py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <h2 className="mb-11 text-center text-[32px] font-semibold leading-[40px] tracking-[-0.5px] text-[#1d1d1f] md:text-[48px] md:leading-[60px]">From box to windscreen. In three steps.</h2>
          <Carousel opts={{ align: "start" }} className="relative w-full">
            <CarouselContent className="-ml-[50px]">
              {THREE.map((s) => (
                <CarouselItem key={s.title} className="pl-[50px] sm:basis-[72%] lg:basis-[58%]">
                  <div className="relative aspect-[1047/562] w-full overflow-hidden rounded-[32px]">
                    <Image src={s.img} alt={s.title} fill sizes="(max-width:768px) 100vw, 680px" className="object-cover" />
                  </div>
                  <h3 className="mt-8 text-[28px] font-semibold leading-[1.05] tracking-[-0.05px] text-[#1d1d1f] sm:mt-[88px] md:text-[38.4px] md:leading-[38.4px]">
                    {s.n && <span className="text-[var(--finevu-orange)]">{s.n} </span>}{s.title}
                  </h3>
                  <p className="mt-3.5 max-w-[624px] text-[20px] font-medium leading-[28px] text-[#6e6e73]">{s.body}</p>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Carousel nav (desktop) */}
            <div className="pointer-events-none absolute left-0 top-0 hidden w-[72%] pl-[50px] sm:block lg:w-[58%]">
              <div className="invisible aspect-[1047/562]" aria-hidden />
              <div className="pointer-events-auto flex justify-end gap-3 pt-[18px]">
                <CarouselPrevious className="static h-11 w-11 translate-x-0 translate-y-0 border-0 bg-[#ececec] text-[#1d1d1f] hover:bg-[#e0e0e0]" />
                <CarouselNext className="static h-11 w-11 translate-x-0 translate-y-0 border-0 bg-[#ececec] text-[#1d1d1f] hover:bg-[#e0e0e0]" />
              </div>
            </div>
            {/* Carousel nav (mobile) */}
            <div className="mt-8 flex justify-center gap-3 sm:hidden">
              <CarouselPrevious className="static h-11 w-11 translate-x-0 translate-y-0 border-0 bg-[#ececec] text-[#1d1d1f] hover:bg-[#e0e0e0]" />
              <CarouselNext className="static h-11 w-11 translate-x-0 translate-y-0 border-0 bg-[#ececec] text-[#1d1d1f] hover:bg-[#e0e0e0]" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[772px] px-6">
          <h2 className="mb-14 text-center text-[32px] font-semibold leading-[40px] tracking-[-0.5px] text-[#1d1d1f] md:text-[48px] md:leading-[60px]">One install. Everything covered.</h2>
          <ul className="grid gap-[24px]">
            {INCLUDED.map((it, i) => (
              <motion.li key={it.title} {...fadeUp} transition={{ duration: 0.45, delay: i * 0.05 }} className="flex items-start gap-[16px]">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[14px] bg-[var(--finevu-orange)] text-white"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
                <div><b className="block text-[15px] font-semibold leading-[22.5px] text-[#1d1d1f]">{it.title}</b><span className="mt-1 block text-[14px] leading-[22.4px] text-[#5b5e66]">{it.sub}</span></div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Service area */}
      <section className="bg-white pb-24 md:pb-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1000px] px-6">
          <h2 className="mb-11 text-center text-[32px] font-semibold leading-[40px] tracking-[-0.5px] text-[#1d1d1f] md:text-[48px] md:leading-[60px]">Installers near you. Australia-wide.</h2>
          <div className="grid items-center gap-11 md:grid-cols-2 md:gap-16">
            <div className="flex justify-center">
              <div className="relative aspect-[1102/1036] w-full max-w-[400px]">
                <Image src="/installation/aus-map.webp" alt="Map of Australia showing FineVu installation coverage" fill sizes="(max-width:768px) 80vw, 400px" className="object-contain" />
              </div>
            </div>
            <div>
              <h3 className="text-[22px] font-semibold leading-[33px] text-[#1d1d1f]">A growing national installer network</h3>
              <p className="mt-3.5 text-[18px] leading-[27px] tracking-[-0.4395px] text-[#5b5e66]">FineVu certified installers operate across major metropolitan areas with regional coverage expanding monthly. Enter your postcode to check availability in your area.</p>
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[12px] leading-[18px] text-[#5b5e66]">
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-[5px] bg-[var(--finevu-orange)]" />Metro coverage now</span>
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-[5px] bg-[#9a9da5]" />Regional - confirmed at booking</span>
              </div>
              <PostcodeCheck />
              <p className="mt-5 text-[12px] leading-[18px] text-[#9a9da5]">Installation is not currently available in the Northern Territory.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why experts */}
      <section className="bg-[#f7f7f7] py-[70px] md:py-[90px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-14 text-center text-[32px] font-semibold leading-[40px] tracking-[-0.88px] text-[#1d1d1f] md:text-[44px] md:leading-[66px]">Why leave it to the experts?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {WHY.map((w, i) => (
              <motion.div key={w.title} {...fadeUp} transition={{ duration: 0.55, delay: i * 0.08 }} className="rounded-[16px] border border-[#e8e7e2] bg-white px-[29px] py-[33px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#fff1e8] text-[var(--finevu-orange)]"><w.icon className="h-[22px] w-[22px]" strokeWidth={1.8} /></span>
                <h3 className="mt-5 text-[17px] font-semibold leading-[25.5px] text-[#1d1d1f]">{w.title}</h3>
                <p className="mt-2.5 text-[14px] leading-[23.1px] text-[#5b5e66]">{w.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[800px] px-6">
          <h2 className="mb-12 text-center text-[32px] font-semibold leading-[40px] tracking-[-0.88px] text-[#1d1d1f] md:text-[44px] md:leading-[66px]">Installation questions.</h2>
          <div className="border-t border-[#e8e7e2]">{FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}</div>
        </div>
      </section>

      {/* Learn more strip */}
      <LearnMoreLinks />

      {/* Fine print */}
      <section className="bg-[#f7f7f7] pb-16" data-nav-theme="light">
        <div className="mx-auto max-w-[900px] px-6">
          <ol className="grid gap-3.5 border-t border-[#e7e7ea] pt-8">{FINE_PRINT.map(([n, t]) => <li key={n} className="text-[12px] leading-[1.6] text-[#9c9ca3]"><b className="font-semibold text-[#6e6e73]">{n}</b> {t}</li>)}</ol>
        </div>
      </section>

      <Footer />
    </div>
  );
}

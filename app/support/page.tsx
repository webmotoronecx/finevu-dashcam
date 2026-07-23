"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { PageHero } from "@/components/sections/PageHero";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Phone, Mail, Smartphone, ChevronDown, ChevronRight } from "lucide-react";

// Support page — dark hero, phone/email cards, per-model download/guide hubs, troubleshooting accordion, registration and warranty panels, and fine print.

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6 },
};

const channels = [
  { icon: Phone, title: "Phone Support", desc: "Speak directly with our team", big: "1800 818 288", small: "Mon–Sun, 8:00 AM – 8:00 PM AEST", cta: "Call Now", href: "tel:1800818288" },
  { icon: Mail, title: "Email Support", desc: "Send us a detailed inquiry", big: "support@finevuaustralia.com", small: "Response within 24 hours", cta: "Send Email", href: "mailto:support@finevuaustralia.com" },
];

type ModelHub = {
  id: string;
  name: string;
  line: string;
  img: string;
  downloads: [string, string][];
  guides: [string, string][];
};

const models: ModelHub[] = [
  {
    id: "gx4k",
    name: "FineVu GX4K",
    line: "4K UHD front & FHD rear dash cam",
    img: "/products/gx4k-card-transparent.webp",
    downloads: [["Firmware", "v2.03 · ZIP"], ["User manual", "PDF · EN"], ["Quick start guide", "PDF"], ["Spec sheet", "PDF"]],
    guides: [["Firmware update steps", "GUIDE"], ["MicroSD card formatting", "GUIDE"], ["Parking mode & battery protection", "GUIDE"], ["Installation video", "VIDEO"]],
  },
  {
    id: "gx35",
    name: "FineVu GX35",
    line: "Compact FHD front & rear dash cam",
    img: "/products/gx35-card-transparent.webp",
    downloads: [["Firmware", "v1.14 · ZIP"], ["User manual", "PDF · EN"], ["Quick start guide", "PDF"], ["Spec sheet", "PDF"]],
    guides: [["Firmware update steps", "GUIDE"], ["MicroSD card formatting", "GUIDE"], ["Parking mode & battery protection", "GUIDE"], ["Installation video", "VIDEO"]],
  },
];

const troubleshooting = [
  { q: 'Camera says "check memory card" or footage won’t save', a: "Format the card in the camera’s own menu (not on a computer), and make sure you’re using a high-endurance card rated for dash cams. Cards should be re-formatted every 1–2 months for reliable recording." },
  { q: "Phone won’t connect to the camera’s Wi-Fi", a: "Turn off mobile data while connecting, ensure you’re joining the camera’s own Wi-Fi network (FINEVU_xxxx), and check the camera is in Wi-Fi pairing mode. If it still fails, forget the network on your phone and pair again." },
  { q: "Camera turns off in parking mode", a: "This is usually the low-voltage cutoff protecting your car battery. Check the cutoff voltage setting in the camera menu — 12.0V is typical for daily drivers. If your battery is older, it may be dropping below the cutoff sooner than expected." },
  { q: "GPS not connecting or speed shows zero", a: "Allow up to 5 minutes for first GPS lock in open sky. Windscreens with metallic tint or heating elements can block signal — try repositioning the camera or GPS antenna closer to a non-tinted area." },
  { q: "How do I update the firmware?", a: "Download the firmware for your model from the Download Centre above, copy it to a freshly formatted SD card, insert it into the camera and power on. The camera updates automatically — don’t disconnect power until it finishes." },
  { q: "Time or date is wrong on my footage", a: "Set your time zone (GMT offset) in the camera settings — with GPS connected, time syncs automatically once the zone is correct. Remember to adjust for daylight saving if your region uses it." },
];

const regPanels = [
  {
    title: "Register your product",
    body: "Registering takes two minutes and makes any future warranty claim faster — we’ll already have your details on file.",
    items: ["Faster warranty claims with pre-verified details", "Firmware update notifications for your model", "Keep your proof of purchase safely on record"],
    cta: "Register Now",
    primary: true,
  },
  {
    title: "Warranty",
    body: "Every FineVu dash cam is covered by a manufacturer’s warranty, no matter which authorised retailer you purchased from. Keep your receipt as proof of purchase.",
    items: ["Submit a claim with your model, serial number and receipt", "Our technicians assess and repair or replace", "Return shipping included on approved claims"],
    cta: "Start a Warranty Claim",
    primary: false,
  },
];

const finePrint = [
  ["1. Warranty:", "3-Year Warranty applies to FineVu dash cam main unit cameras, including front and rear cameras, for 36 months from the date of purchase. Genuine FineVu accessories are covered by a 6-month warranty. Proof of purchase required. Full warranty terms apply. Your rights under the Australian Consumer Law are not excluded."],
  ["2. SD Cards:", "GX4K includes a FineVu 128GB MicroSD Card and Adapter. GX35 includes a FineVu 64GB MicroSD Card and Adapter. Included MicroSD Cards and adapters are covered by a 6-month warranty."],
  ["3. Hardwire Kit & Power Cable:", "GX4K and GX35 include a Hardwire Kit and Power Cable. Included Hardwire Kits and Power Cables are covered by a 6-month warranty."],
];

function DownloadList({ heading, items }: { heading: string; items: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-2 text-[20px] font-semibold text-[#1d1d1f]">{heading}</h4>
      <ul>
        {items.map(([label, meta]) => (
          <li key={label}>
            <a href="#" className="group flex items-center justify-between gap-3 py-[7px] text-[15px]">
              <span className="font-medium text-[#6c6c6c] transition-colors group-hover:text-[var(--finevu-orange)]">
                {label} <span className="font-semibold text-[var(--finevu-orange)]">›</span>
              </span>
              <span className="shrink-0 font-medium text-[#9c9ca3]">{meta}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModelPanel({ active }: { active: ModelHub }) {
  return (
    <motion.div
      key={active.id + "-panel"}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-5 overflow-hidden rounded-[28px] border border-[var(--finevu-orange)] bg-white shadow-[0_4px_33px_5px_rgba(0,0,0,0.05)]"
    >
      <div className="border-b border-[var(--finevu-orange)] bg-[#fef0e2] px-8 py-7 sm:px-11">
        <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--finevu-orange)]">Model support</div>
        <h3 className="mt-1 text-[26px] font-semibold text-[#1d1d1f] sm:text-[32px]">{active.name}</h3>
      </div>
      <div className="px-8 py-9 sm:px-11">
        <div className="grid gap-x-12 gap-y-9 sm:grid-cols-2 sm:divide-x sm:divide-[#e7e7ea]">
          <div className="sm:pr-10">
            <DownloadList heading="Downloads" items={active.downloads} />
          </div>
          <div className="sm:pl-10">
            <DownloadList heading="Guides" items={active.guides} />
          </div>
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-[#e7e7ea] pt-7">
          <a href="#register" className="cta-hover rounded-full bg-[var(--finevu-orange)] px-7 py-3.5 text-[14px] font-semibold uppercase leading-[20px] text-white">Register this product</a>
          <Link href="/contact" className="rounded-full border border-[#1d1d1f] px-7 py-3.5 text-[14px] font-semibold uppercase leading-[20px] text-[#1d1d1f] transition-colors hover:bg-[#1d1d1f] hover:text-white">Contact support</Link>
          <span className="text-[14px] text-[#6c6c6c] sm:ml-auto">Serial number is on the sticker on the camera body.</span>
        </div>
      </div>
    </motion.div>
  );
}

function ModelHubs() {
  const [open, setOpen] = useState<string | null>(null);
  const active = models.find((m) => m.id === open) ?? null;
  return (
    <div className="mx-auto max-w-[1020px]">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {models.map((m) => {
          const selected = open === m.id;
          const short = m.name.replace("FineVu ", "");
          return (
            <Fragment key={m.id}>
              <button
                type="button"
                aria-expanded={selected}
                onClick={() => setOpen((o) => (o === m.id ? null : m.id))}
                className={`flex flex-col items-center rounded-[28px] bg-white px-8 pb-8 pt-9 text-center transition-colors ${
                  selected
                    ? "border-2 border-[var(--finevu-orange)]"
                    : "border border-[#bbbbbb] hover:border-[var(--finevu-orange)]"
                }`}
              >
                <div className="text-[26px] font-semibold text-[#0a0a0a] sm:text-[28px]">{m.name}</div>
                <div className="mt-1 text-[14px] text-[#5b5e66]">{m.line}</div>
                <div className="relative my-6 h-[150px] w-full max-w-[240px]">
                  <Image src={m.img} alt={m.name} fill sizes="240px" className="object-contain" />
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[15px] font-semibold ${
                    selected
                      ? "bg-[var(--finevu-orange)] text-white"
                      : "border border-[var(--finevu-orange)] text-[var(--finevu-orange)]"
                  }`}
                >
                  {selected ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  {selected ? `Close ${short} support` : `Open ${short} support`}
                </span>
              </button>

              {/* Mobile: panel opens directly under the tapped card */}
              {selected ? (
                <div className="sm:hidden">
                  <ModelPanel active={m} />
                </div>
              ) : null}
            </Fragment>
          );
        })}
      </div>

      {/* Desktop: panel spans full width below both cards */}
      {active ? (
        <div className="hidden sm:block">
          <ModelPanel active={active} />
        </div>
      ) : null}
    </div>
  );
}

function TroubleItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e7e7ea]">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={`flex w-full items-center justify-between gap-5 py-[22px] text-left text-[18px] font-semibold transition-colors ${open ? "text-[var(--finevu-orange)]" : "text-[#17181a]"}`}>
        {q}
        <ChevronDown className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-[var(--finevu-orange)]" : "text-[#9c9ca3]"}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden"><p className="max-w-[700px] pb-6 text-[18px] leading-[1.6] text-[#6b6b72]">{a}</p></div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <PageHero
        id="top"
        image="/support/hero.webp"
        maxWidth="max-w-[760px]"
        title={
          <>
            Welcome to FineVu
            <br />
            Support Centre
          </>
        }
      />

      {/* How can we help */}
      <section className="bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <motion.div {...fadeUp} className="mx-auto mb-11 max-w-[720px] text-center">
            <h2 className="text-[32px] font-semibold leading-[40px] tracking-[-0.015em] text-[#17181a] md:text-[48px] md:leading-[60px]">How can we help?</h2>
            <p className="mt-4 text-[18px] leading-[1.6] text-[#6b6b72]">Get in touch with our team, or find manuals, firmware and troubleshooting for your FineVu dash cam below.</p>
          </motion.div>
          <div className="mx-auto grid max-w-[820px] gap-[22px] sm:grid-cols-2">
            {channels.map((c, i) => (
              <motion.div key={c.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="flex min-w-0 flex-col rounded-[16px] border border-[#e7e7ea] bg-white p-7">
                <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-[#fef2e5] text-[var(--finevu-orange)]"><c.icon className="h-[22px] w-[22px]" strokeWidth={1.8} /></span>
                <h3 className="mb-1 mt-[18px] text-[18px] font-semibold text-[#17181a]">{c.title}</h3>
                <p className="text-[16px] text-[#6b6b72]">{c.desc}</p>
                <span className="mt-4 block break-words text-[18px] font-semibold text-[#17181a]">{c.big}</span>
                <span className="mt-[3px] block text-[13px] text-[#9c9ca3]">{c.small}</span>
                <a href={c.href} className="cta-hover mt-5 flex w-full items-center justify-center rounded-full bg-[var(--finevu-orange)] px-5 py-[14px] text-[14px] font-semibold uppercase leading-[20px] text-white">{c.cta}</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Select your dash camera */}
      <section id="downloads" className="bg-[#f4f4f5] py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <motion.div {...fadeUp} className="mx-auto mb-11 max-w-[720px] text-center">
            <h2 className="text-[32px] font-semibold leading-[40px] tracking-[-0.015em] text-[#0a0a0a] md:text-[48px] md:leading-[60px]">Select your dash camera</h2>
            <p className="mt-4 text-[18px] leading-[1.6] text-[#6b6b72]">Tap your model to open its support hub. Manuals, firmware, quick start guides and model FAQs, all in one place.</p>
          </motion.div>
          <ModelHubs />

          {/* App strip */}
          <motion.div {...fadeUp} className="mx-auto mt-5 flex max-w-[1020px] flex-wrap items-center gap-5 rounded-[16px] border border-[#e7e7ea] bg-white px-[26px] py-[22px]">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-[#fef2e5] text-[var(--finevu-orange)]"><Smartphone className="h-[22px] w-[22px]" strokeWidth={1.8} /></span>
            <div className="min-w-[220px] flex-1">
              <h3 className="text-[18px] font-semibold text-[#17181a]">FineVu app support</h3>
              <p className="text-[14px] text-[#6b6b72]">Change settings, view live footage and download clips over Wi-Fi. Works with both GX4K and GX35.</p>
            </div>
            <Link href="/how-it-works" className="rounded-full border-[1.5px] border-[#e7e7ea] px-[26px] py-3 text-[14px] font-semibold uppercase leading-[20px] text-[#17181a] transition-colors hover:border-[var(--finevu-orange)] hover:text-[var(--finevu-orange)] w-full md:w-auto">App Setup Guide</Link>
            <Link href="/how-it-works" className="cta-hover rounded-full bg-[var(--finevu-orange)] px-[26px] py-3 text-[14px] font-semibold uppercase leading-[20px] text-white  w-full md:w-auto">Get the App</Link>
          </motion.div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[760px] px-6">
          <motion.div {...fadeUp} className="mx-auto mb-11 max-w-[720px] text-center">
            <h2 className="text-[32px] font-semibold leading-[40px] tracking-[-0.015em] text-[#17181a] md:text-[48px] md:leading-[60px]">Troubleshooting common fixes</h2>
            <p className="mt-4 text-[18px] leading-[1.6] text-[#6b6b72]">
              Most issues are solved in a few minutes with the steps below. Can&apos;t find yours?{" "}
              <Link href="/contact" className="font-semibold text-[var(--finevu-orange)]">Contact us</Link> and we&apos;ll help.
            </p>
          </motion.div>
          <div className="border-t border-[#e7e7ea]">
            {troubleshooting.map((t) => <TroubleItem key={t.q} q={t.q} a={t.a} />)}
          </div>
        </div>
      </section>

      {/* Registration & warranty */}
      <section id="register" className="scroll-mt-24 bg-[#f4f4f5] py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <motion.div {...fadeUp} className="mx-auto mb-11 max-w-[720px] text-center">
            <h2 className="text-[32px] font-semibold leading-[40px] tracking-[-0.015em] text-[#17181a] md:text-[48px] md:leading-[60px]">Product Registration &amp; Warranty Claims</h2>
          </motion.div>
          <div className="mx-auto grid max-w-[900px] gap-[22px] md:grid-cols-2">
            {regPanels.map((p, i) => (
              <motion.div key={p.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="flex flex-col rounded-[16px] border border-[#e7e7ea] bg-white p-[30px]">
                <h3 className="mb-2.5 text-[18px] font-semibold text-[#17181a]">{p.title}</h3>
                <p className="mb-4 text-[16px] text-[#6b6b72]">{p.body}</p>
                <ul className="mb-6">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2.5 py-[5px] text-[16px] text-[#6b6b72]">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--finevu-orange)]" />{it}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-auto inline-flex w-fit items-center justify-center rounded-full px-[26px] py-[14px] text-[14px] font-semibold uppercase leading-[20px] ${p.primary ? "cta-hover bg-[var(--finevu-orange)] text-white" : "border-[1.5px] border-[#e7e7ea] text-[#17181a] transition-colors hover:border-[var(--finevu-orange)] hover:text-[var(--finevu-orange)]"}`}
                >
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <LearnMoreLinks />

      {/* Fine print */}
      <section className="bg-white pb-16" data-nav-theme="light">
        <div className="mx-auto max-w-[900px] px-6">
          <ol className="grid gap-3.5 border-t border-[#e7e7ea] pt-8">
            {finePrint.map(([n, t]) => (
              <li key={n} className="text-[12px] leading-[1.6] text-[#9c9ca3]"><b className="font-semibold text-[#6b6b72]">{n}</b> {t}</li>
            ))}
          </ol>
        </div>
      </section>

      <Footer />
    </div>
  );
}

"use client";

import { Footer } from "@/components/Footer";
import { motion } from "motion/react";
import { useState } from "react";
import { Package, ShieldCheck, Wrench, MapPin, Phone, Globe } from "lucide-react";
import Link from "next/link";

/* ============================================================================
   WHERE TO BUY — FineVu reseller directory (Figma node 22:13776)
   Light page: grey hero placeholder, #f4f4f5 "why" band, white directory,
   dark #161618 trade band. Headings are uppercase per the Figma.
   ============================================================================ */

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const SHELL = "max-w-[1180px] mx-auto px-6";
const BADGE =
  "inline-flex items-center rounded-full bg-[var(--finevu-orange)] px-3 py-[5px] text-[11px] font-bold uppercase tracking-[0.14em] text-white";
const HEAD =
  "text-[#1a1a1c] text-3xl sm:text-4xl lg:text-5xl font-bold uppercase leading-[1.04] tracking-tight";

type Reseller = {
  name: string;
  type: "In-store" | "Mobile" | "Online";
  location: string;
  phone?: string;
  web?: string;
};

type Group = { key: string; label: string; resellers: Reseller[] };

const groups: Group[] = [
  {
    key: "victoria",
    label: "Victoria",
    resellers: [
      { name: "Motor Junction", type: "In-store", location: "81 Keys Rd, Moorabbin VIC 3189", phone: "(03) 9553 1344", web: "motorjunction.com.au" },
      { name: "No Limit Car Sound & Vision", type: "In-store", location: "580 City Rd, South Melbourne VIC 3205", phone: "(03) 9686 0023", web: "nolimitcsv.com.au" },
      { name: "Glory Automotive", type: "In-store", location: "40 Connell Rd, Oakleigh VIC 3166", phone: "(03) 9569 6692", web: "gloryauto.com.au" },
      { name: "DNH Dashcam Solutions", type: "Mobile", location: "Caroline Springs VIC 3023", phone: "0403 760 498", web: "dnhdashcamsolutions.com" },
      { name: "MJP Autoview Solutions", type: "Mobile", location: "Melbourne VIC", phone: "0407 159 122", web: "facebook.com/mjpautoview" },
    ],
  },
  {
    key: "nsw",
    label: "New South Wales",
    resellers: [
      { name: "Better N Easy Solutions", type: "In-store", location: "E1/161 Arthur St, Homebush West NSW 2140", phone: "0423 761 701" },
      { name: "99TINT Sydney", type: "In-store", location: "22/50 Cosgrove Rd, Strathfield South NSW 2136", phone: "0490 129 999" },
    ],
  },
  {
    key: "brisbane",
    label: "Brisbane",
    resellers: [
      { name: "Pro Tinting (The 99 Tinting)", type: "In-store", location: "2/16 Lensworth St, Coopers Plains QLD 4108", phone: "0401 471 286" },
      { name: "Auto-Teck Brisbane", type: "In-store", location: "U2/3337 Pacific Hwy, Slacks Creek QLD 4127", phone: "07 3386 0621" },
      { name: "Auto Parts Guys", type: "In-store", location: "Unit 17/37 Mortimer Rd, Acacia Ridge QLD 4110", phone: "07 3340 4392", web: "autopartsguys.com.au" },
      { name: "Garage Audio", type: "In-store", location: "Unit 3/291 Morayfield Rd, Morayfield QLD 4506", phone: "07 3093 1846" },
    ],
  },
  {
    key: "gold-coast",
    label: "Gold Coast",
    resellers: [
      { name: "Monster Tint", type: "In-store", location: "10/53 Casua Drive, Varsity Lakes QLD 4227", phone: "0474 053 630" },
      { name: "A1 Automotive Care", type: "In-store", location: "66 Davenport St, Southport QLD 4215", phone: "0425 071 413" },
    ],
  },
  {
    key: "sa",
    label: "South Australia",
    resellers: [
      { name: "GT Auto Sound", type: "In-store", location: "34a Sunbeam Rd, Glynde SA 5070", phone: "0417 755 566", web: "gtautosound.com.au" },
    ],
  },
  {
    key: "wa",
    label: "Western Australia",
    resellers: [
      { name: "Joe Knows Group", type: "In-store", location: "Perth WA", phone: "0402 742 245", web: "joeknows.business.site" },
    ],
  },
  {
    key: "national",
    label: "National",
    resellers: [
      { name: "Schmicko", type: "Mobile", location: "Sydney, Melbourne & Perth", phone: "02 9158 6636", web: "schmicko.com.au" },
    ],
  },
  {
    key: "online",
    label: "Online",
    resellers: [
      { name: "Dashcams Australia", type: "Online", location: "Ships Australia-wide", phone: "(03) 9350 2605", web: "dashcamsaustralia.com.au" },
      { name: "Dashcam Owners Australia", type: "Online", location: "Ships Australia-wide", web: "dashcamownersaus.com.au" },
      { name: "Auto Parts Guys", type: "Online", location: "Ships Australia-wide", phone: "07 3340 4392", web: "autopartsguys.com.au" },
      { name: "Smart Audio Tech", type: "Online", location: "Ships Australia-wide", phone: "0415 369 545", web: "smartaudiotech.net" },
      { name: "EcoPowerPack (Dashcam Battery)", type: "Online", location: "Ships Australia-wide", web: "dashcambattery.com" },
    ],
  },
];

const totalCount = groups.reduce((sum, g) => sum + g.resellers.length, 0);

// Reseller directory + "Browse by state" CTA are hidden for now per client
// request. Flip to true to restore the full list (data above is preserved).
const SHOW_RESELLERS = false;

const whyReasons = [
  {
    icon: Package,
    title: "Genuine stock",
    desc: "Real FineVu units — current models, sealed and ready to fit. No grey imports, no surprises.",
  },
  {
    icon: ShieldCheck,
    title: "Full AU warranty",
    desc: "Your purchase is covered by our 3-year Australian warranty and local support team.",
  },
  {
    icon: Wrench,
    title: "Expert fitting",
    desc: "Installers who know the product and fit it cleanly — wiring hidden, set up the first time.",
  },
];

const typeBadge: Record<Reseller["type"], string> = {
  "In-store": "bg-[#fff1e7] text-[var(--finevu-orange)]",
  Mobile: "bg-blue-50 text-blue-600",
  Online: "bg-emerald-50 text-emerald-600",
};

const telHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, "")}`;
const webHref = (web: string) => `https://${web.replace(/^https?:\/\//, "")}`;

function ResellerCard({ r }: { r: Reseller }) {
  return (
    <div className="flex flex-col rounded-[10px] border border-[#e6e6e9] bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3 pb-3">
        <h4 className="text-[15px] font-bold leading-tight text-[#1a1a1c]">{r.name}</h4>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${typeBadge[r.type]}`}>
          {r.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 text-[14px] text-[#6b6b72]">
        <p className="flex items-start gap-2">
          <MapPin className="mt-[3px] h-[13px] w-[13px] shrink-0 text-[var(--finevu-orange)]" />
          <span>{r.location}</span>
        </p>
        {r.phone && (
          <p className="flex items-start gap-2">
            <Phone className="mt-[3px] h-[13px] w-[13px] shrink-0 text-[var(--finevu-orange)]" />
            <a href={telHref(r.phone)} className="hover:text-[var(--finevu-orange)] transition-colors">
              {r.phone}
            </a>
          </p>
        )}
        {r.web && (
          <p className="flex items-start gap-2">
            <Globe className="mt-[3px] h-[13px] w-[13px] shrink-0 text-[var(--finevu-orange)]" />
            <a
              href={webHref(r.web)}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:text-[var(--finevu-orange)] transition-colors"
            >
              {r.web}
            </a>
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {r.phone && (
          <a
            href={telHref(r.phone)}
            className="rounded-full bg-[#2d2d30] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-black"
          >
            Call
          </a>
        )}
        {r.web && (
          <a
            href={webHref(r.web)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#e6e6e9] px-4 py-2 text-[13px] font-semibold text-[#1a1a1c] transition-colors hover:border-[var(--finevu-orange)] hover:text-[var(--finevu-orange)]"
          >
            Visit site
          </a>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const [active, setActive] = useState<string>("all");
  const shownGroups = active === "all" ? groups : groups.filter((g) => g.key === active);

  const stats = [
    { value: "20+", label: "Authorised resellers" },
    { value: "6", label: "States covered" },
    { value: "3yr", label: "AU warranty" },
  ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* ===================================================================
          1. HERO — full-bleed grey placeholder (client to supply art)
      =================================================================== */}
      <section data-nav-theme="dark" className="relative bg-[#656565] text-white">
        <motion.div
          className="relative z-10 mx-auto max-w-[760px] px-6 pt-[210px] pb-[96px] text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/75">
            Install network
          </p>
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-[80px] font-bold uppercase leading-[1.04] tracking-[-0.01em]">
            Find a FineVu
            <br />
            near you
          </h1>
          <p className="mt-7 mx-auto max-w-[560px] text-base leading-relaxed text-white/80">
            Buy, fit and get support from an authorised FineVu reseller — right across Australia.
            Genuine stock, full warranty and expert installation.
          </p>
          <div className="mt-11 flex flex-col sm:flex-row gap-3 justify-center items-center">
            {SHOW_RESELLERS && (
              <a href="#network" className="w-full sm:w-auto">
                <button className="w-full sm:w-[214px] h-12 rounded-full bg-[var(--finevu-orange)] text-white font-semibold text-[14px] uppercase tracking-[0.04em] transition-transform hover:scale-[1.03]">
                  Browse by state
                </button>
              </a>
            )}
            <a href="https://autoxtreme.com.au" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <button className="w-full sm:w-[214px] h-12 rounded-full border border-white/40 text-white font-semibold text-[14px] uppercase tracking-[0.04em] hover:bg-white/10 transition-colors">
                Shop online
              </button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 flex justify-center gap-12 sm:gap-16">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-bold text-[var(--finevu-orange)]">{s.value}</div>
                <div className="mt-1 text-[12px] uppercase tracking-[0.08em] text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===================================================================
          2. WHY AUTHORISED
      =================================================================== */}
      <section data-nav-theme="light" className="bg-[#f4f4f5] py-20">
        <div className={SHELL}>
          <motion.div className="text-center" {...fadeUp}>
            <span className={BADGE}>Why authorised</span>
            <h2 className={`mt-5 ${HEAD}`}>Buy it right. Get it fitted right.</h2>
            <p className="mt-3 mx-auto max-w-[540px] text-base leading-relaxed text-[#6b6b72]">
              Choose an authorised reseller for genuine stock, full warranty and installers who actually
              know the product.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {whyReasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  className="rounded-[10px] border border-[#e6e6e9] bg-white p-7"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#fff1e7]">
                    <Icon className="h-5 w-5 text-[var(--finevu-orange)]" />
                  </div>
                  <h3 className="mt-3 text-[16px] font-semibold text-[#1a1a1c]">{r.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#6b6b72]">{r.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. FIND A RESELLER — hidden for now (toggle SHOW_RESELLERS)
      =================================================================== */}
      {SHOW_RESELLERS && (
      <section id="network" className="bg-white py-20 scroll-mt-24" data-nav-theme="light">
        <div className={SHELL}>
          <motion.div {...fadeUp}>
            <span className={BADGE}>The network</span>
            <h2 className={`mt-5 ${HEAD}`}>Find a reseller</h2>
            <p className="mt-3 max-w-[540px] text-base leading-relaxed text-[#6b6b72]">
              Filter by state, or scroll the full list. Tap to call or visit a site.
            </p>
          </motion.div>

          {/* Filter chips */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            <button
              onClick={() => setActive("all")}
              className={`rounded-full px-[17px] py-2 text-[13px] font-semibold transition-colors ${
                active === "all"
                  ? "bg-[#2d2d30] text-white"
                  : "border border-[#e6e6e9] bg-white text-[#1a1a1c] hover:border-zinc-300"
              }`}
            >
              All{" "}
              <span className={`text-[11px] font-bold ${active === "all" ? "text-white/70" : "text-[var(--finevu-orange)]"}`}>
                {totalCount}
              </span>
            </button>
            {groups.map((g) => (
              <button
                key={g.key}
                onClick={() => setActive(g.key)}
                className={`rounded-full px-[17px] py-2 text-[13px] font-semibold transition-colors ${
                  active === g.key
                    ? "bg-[#2d2d30] text-white"
                    : "border border-[#e6e6e9] bg-white text-[#1a1a1c] hover:border-zinc-300"
                }`}
              >
                {g.label}{" "}
                <span className={`text-[11px] font-bold ${active === g.key ? "text-white/70" : "text-[var(--finevu-orange)]"}`}>
                  {g.resellers.length}
                </span>
              </button>
            ))}
          </div>

          {/* Groups */}
          <div className="mt-10 space-y-10">
            {shownGroups.map((g) => (
              <div key={g.key}>
                <div className="mb-5 flex items-center gap-4">
                  <h3 className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.1em] text-[#1a1a1c]">
                    {g.label}
                  </h3>
                  <span className="h-px flex-1 bg-gradient-to-r from-[var(--finevu-orange)] to-transparent" />
                  <span className="text-[13px] font-semibold text-zinc-400">{g.resellers.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {g.resellers.map((r) => (
                    <ResellerCard key={`${g.key}-${r.name}`} r={r} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ===================================================================
          4. TRADE ENQUIRIES
      =================================================================== */}
      <section data-nav-theme="dark" className="relative overflow-hidden bg-[#161618] py-20">
        {/* radial orange glow, bottom-left */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(420px 220px at 14% 90%, rgba(244,121,32,0.18), rgba(122,61,16,0.09) 32%, rgba(0,0,0,0) 65%)",
          }}
        />
        <div className={`relative ${SHELL}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center rounded-full bg-[rgba(244,121,32,0.15)] px-3 py-[5px] text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--finevu-orange)]">
                Trade enquiries
              </span>
              <h2 className="mt-5 text-[22px] font-bold uppercase leading-[1.2] tracking-tight text-white">
                Stock the No.1 dash cam brand in Korea.
              </h2>
              <p className="mt-4 max-w-[542px] text-base leading-relaxed text-[#bdbdc4]">
                Join the FineVu reseller network and put a proven, premium product on your shelf — with
                full distributor support, training and marketing behind you.
              </p>
            </motion.div>

            <motion.div
              className="rounded-[14px] border border-white/10 bg-white/[0.05] p-8"
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-[18px] font-bold text-white">Become a reseller</h3>
              <p className="mt-2 text-[14px] text-[#bdbdc4]">
                Tell us about your business and we&apos;ll be in touch.
              </p>
              <Link href="/contact" className="mt-6 block">
                <button className="w-full rounded-full bg-[var(--finevu-orange)] px-6 py-3 text-[14px] font-semibold uppercase tracking-[0.04em] text-white transition-transform hover:scale-[1.02]">
                  Apply now
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

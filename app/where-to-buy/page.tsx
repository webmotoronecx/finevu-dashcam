"use client";

import { Footer } from "@/components/Footer";
import { motion } from "motion/react";
import { useState } from "react";
import {
  BadgeCheck,
  ShieldCheck,
  Wrench,
  MapPin,
  Phone,
  Globe,
  ArrowRight,
  Store,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

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

const whyReasons = [
  {
    icon: BadgeCheck,
    title: "Genuine stock",
    desc: "Real FineVu units — current models, sealed and ready to fit. No grey imports or old stock.",
  },
  {
    icon: ShieldCheck,
    title: "Full AU warranty",
    desc: "Your purchase is covered by our 3-year Australian warranty and backed by local support.",
  },
  {
    icon: Wrench,
    title: "Expert fitting",
    desc: "Installers who know the product and fit it cleanly the first time — wiring concealed, tested and ready.",
  },
];

const typeBadge: Record<Reseller["type"], string> = {
  "In-store": "bg-[var(--finevu-orange)]/10 text-[var(--finevu-orange)]",
  Mobile: "bg-blue-50 text-blue-600",
  Online: "bg-emerald-50 text-emerald-600",
};

const telHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, "")}`;
const webHref = (web: string) => `https://${web.replace(/^https?:\/\//, "")}`;

function ResellerCard({ r }: { r: Reseller }) {
  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-bold text-zinc-900 leading-snug">{r.name}</h4>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${typeBadge[r.type]}`}>
          {r.type}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-sm text-zinc-600">
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
          <span>{r.location}</span>
        </p>
        {r.phone && (
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
            <a href={telHref(r.phone)} className="hover:text-[var(--finevu-orange)] transition-colors">
              {r.phone}
            </a>
          </p>
        )}
        {r.web && (
          <p className="flex items-center gap-2">
            <Globe className="h-4 w-4 shrink-0 text-zinc-400" />
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

      <div className="mt-5 flex flex-wrap gap-2">
        {r.phone && (
          <a
            href={telHref(r.phone)}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Call
          </a>
        )}
        {r.web && (
          <a
            href={webHref(r.web)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-[var(--finevu-orange)] hover:text-[var(--finevu-orange)]"
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero — #656565 placeholder per Figma (client to supply art) */}
      <section
        className="relative w-full px-4 md:px-8 lg:px-[5.5vw] pt-3 md:pt-4 pb-3 lg:pb-[1vw]"
        data-nav-theme="dark"
      >
        <div className="relative w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] min-h-[600px] lg:min-h-[max(540px,36vw)] flex items-center justify-center">
          <div className="absolute inset-0 bg-[#656565]" />
          <motion.div
            className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-28 md:pt-24 pb-16"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-white/80 font-semibold text-xs md:text-sm tracking-[0.24em] uppercase mb-5">
              Install Network
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.02] mb-6">
              Find a FineVu near you
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
              Buy, fit and get support from an authorised FineVu reseller — right across Australia.
              Genuine stock, full warranty and expert installation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a href="#" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-9 py-3.5 rounded-full bg-[var(--finevu-orange)] text-white font-semibold text-sm uppercase tracking-wider transition-transform hover:scale-105">
                  Browse by State
                </button>
              </a>
              <a
                href="https://autoxtreme.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto px-9 py-3.5 rounded-full border border-white/40 text-white font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors backdrop-blur-sm">
                  Shop Online
                </button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-10 sm:gap-16">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[var(--finevu-orange)]">{s.value}</div>
                  <div className="text-[11px] md:text-xs uppercase tracking-wider text-white/70 mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why authorised */}
      <section className="py-16 md:py-24 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <motion.div className="text-center max-w-2xl mx-auto mb-12 md:mb-16" {...fadeUp}>
            <span className="finevu-capsule mb-5">Why authorised</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
              Buy it right. Get it fitted right.
            </h2>
            <p className="text-lg text-zinc-600">
              Choose an authorised reseller for genuine stock, full warranty and installers who actually
              know the product.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {whyReasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  className="rounded-[1.75rem] border border-zinc-200 bg-white p-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[var(--finevu-orange)]/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[var(--finevu-orange)]" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{r.title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{r.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Find a reseller */}
      <section id="network" className="py-16 md:py-24 bg-white scroll-mt-24" data-nav-theme="light">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-8" {...fadeUp}>
            <span className="finevu-capsule mb-5">The network</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
              Find a reseller
            </h2>
            <p className="text-lg text-zinc-600">
              Filter by state, or scroll the full list. Tap to call or visit a site.
            </p>
          </motion.div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            <button
              onClick={() => setActive("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === "all"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              All <span className="opacity-60">{totalCount}</span>
            </button>
            {groups.map((g) => (
              <button
                key={g.key}
                onClick={() => setActive(g.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active === g.key
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {g.label} <span className="opacity-60">{g.resellers.length}</span>
              </button>
            ))}
          </div>

          {/* Groups */}
          <div className="space-y-12">
            {shownGroups.map((g) => (
              <div key={g.key}>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-xl font-bold text-zinc-900 whitespace-nowrap">{g.label}</h3>
                  <span className="h-px flex-1 bg-zinc-200" />
                  <span className="text-sm font-semibold text-zinc-400">{g.resellers.length}</span>
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

      {/* Trade enquiries */}
      <section className="py-16 md:py-24 bg-zinc-950" data-nav-theme="dark">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="finevu-capsule mb-5">Trade enquiries</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5">
                Stock the No.1 dash cam brand in Korea.
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Join the FineVu reseller network and put a proven, premium product on your shelf — with
                full distributor support, training and marketing behind you.
              </p>
            </motion.div>

            <motion.div
              className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 md:p-10"
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--finevu-orange)]/15 flex items-center justify-center mb-5">
                <Store className="w-6 h-6 text-[var(--finevu-orange)]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Become a reseller</h3>
              <p className="text-zinc-400 mb-6">Tell us about your business and we&apos;ll be in touch.</p>
              <Link href="#">
                <button className="inline-flex items-center gap-2 rounded-full bg-[var(--finevu-orange)] px-8 py-3.5 font-semibold text-white transition-transform hover:scale-[1.03]">
                  Apply now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

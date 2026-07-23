"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { PageHero } from "@/components/sections/PageHero";
import { motion } from "motion/react";
import Image from "next/image";
import {
  Shield,
  Clock,
  CircleCheckBig,
} from "lucide-react";

// About page: dark hero, alternating split sections, stat cards, commitment list and fine print

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const stats = [
  { img: "/about/trust-no1.webp", cap: ["No.1 Dash cam brand", "by sales in Korea"] },
  { img: "/about/trust-warranty.webp", cap: ["3 Year Warranty", "[1]"] },
  { img: "/about/trust-founded.webp", cap: ["Founded in", "Gyeonggi-do, Korea"] },
  { img: "/about/trust-defect.webp", cap: ["<0.2% Defect rate across", "in-house production"] },
];

const whatWeBuild = [
  {
    icon: Shield,
    title: "Evidence you can rely on",
    body: "Sharp enough footage, day or night, to hold up for insurance claims and as evidence — not just a blurry impression of what happened.",
  },
  {
    icon: Clock,
    title: "Protection around the clock",
    body: "Power Saving Parking Mode keeps watch over your car long after the engine's off, without draining the battery.",
  },
  {
    icon: CircleCheckBig,
    title: "Quality that's tested, not assumed",
    body: "Built in FineVu's own factories with strict in-house quality control, not assembled by a third party chasing volume over reliability.",
  },
];

const commitments = [
  {
    title: "3-Year Australian warranty",
    body: "Every FineVu main unit is covered for 36 months from the date of purchase, with local warranty support, no shipping units back overseas.",
  },
  {
    title: "Correct AU firmware, always",
    body: "Units sold through authorised retailers ship with the right regional firmware and speed camera database from day one.",
  },
  {
    title: "Certified local installation",
    body: "A nationwide network of certified installers hardwires your camera properly, for full-time parking protection done right.",
  },
  {
    title: "A team that actually answers",
    body: "Australian-based phone and email support, run by people who know the product, not a generic overseas call centre.",
  },
];

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <motion.div {...fadeUp} className="mb-11 text-center">
      <h2 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.3px] text-[#17181a] md:text-[48px]">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-[600px] text-[18px] leading-[1.7] text-[#767676]">{sub}</p>
    </motion.div>
  );
}

function Split({
  reverse,
  img,
  alt,
  heading,
  paras,
}: {
  reverse?: boolean;
  img: string;
  alt: string;
  heading: string;
  paras: string[];
}) {
  return (
    <div className="mx-auto grid max-w-[1116px] items-center gap-9 md:gap-16 lg:grid-cols-2">
      <motion.div {...fadeUp} className={`overflow-hidden rounded-[32px] ${reverse ? "lg:order-2" : ""}`}>
        <div className="relative aspect-[16/12] w-full bg-[#dedee1]">
          <Image src={img} alt={alt} fill sizes="(max-width:1024px) 100vw, 526px" className="object-cover" />
        </div>
      </motion.div>
      <motion.div {...fadeUp}>
        <h3 className="text-[28px] font-bold leading-[1.25] tracking-[-0.01em] text-[#17181a] md:text-[32px] md:leading-[40px]">{heading}</h3>
        {paras.map((p, i) => (
          <p key={i} className="mt-[14px] text-[18px] leading-[1.7] text-[#4a4a4a]">
            {p}
          </p>
        ))}
      </motion.div>
    </div>
  );
}

/* Dark stat card with image fill and caption over a bottom gradient; aspect ratios from Figma */
function StatCard({ img, cap, aspect }: { img: string; cap: string[]; aspect: number }) {
  return (
    <motion.div
      {...fadeUp}
      className="relative flex items-end justify-center overflow-hidden rounded-[32px] transition-shadow duration-300 hover:shadow-[0_0_36px_4px_rgba(244,121,42,0.5)]"
      style={{ aspectRatio: aspect, background: "linear-gradient(160deg,#1B1B1E,#0B0B0C)" }}
    >
      <Image src={img} alt="" fill sizes="(max-width:640px) 100vw, 540px" className="object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 45%,rgba(0,0,0,.6))" }} />
      <span className="relative z-[2] px-5 pb-7 text-center text-[22px] font-semibold leading-[30px] text-white [text-shadow:0_2px_14px_rgba(0,0,0,.55)] md:text-[24px] md:leading-[32px]">
        {cap[0]}
        {cap[1] === "[1]" ? <sup className="text-[0.5em] text-white/70">[1]</sup> : <><br />{cap[1]}</>}
      </span>
    </motion.div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <PageHero
        image="/about/hero.webp"
        title={
          <>
            Engineered in Korea.
            <br />
            Trusted on Australian roads.
          </>
        }
        subtitle={
          <>
            Since 1992, FineVu has been designing dash cams that hold up when it matters. Today,
            we&apos;re bringing that same reliability to drivers right across Australia.
          </>
        }
      />

      {/* Split 1: heritage */}
      <section className="bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <Split
            img="/about/story.webp"
            alt="A FineVu engineer inspecting a dash cam over design drawings"
            heading="Over 30 years of automotive electronics, built in-house."
            paras={[
              "FineVu is the dash cam brand of Fine Digital Inc., a South Korean electronics company that's been designing car technology since 1992, long before dash cams were mainstream.",
              "That history matters. It's why FineVu builds its cameras in its own factories rather than outsourcing to generic manufacturers, keeping defect rates below 0.2% and making FineVu the No.1 selling dash cam brand in Korea.",
            ]}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#f4f4f5] py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <SectionHead title="Small country. Big trust." sub="The numbers behind three decades of dash cam engineering." />
          <div className="mx-auto max-w-[1040px] space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1.327fr_1fr]">
              <StatCard img={stats[0].img} cap={stats[0].cap} aspect={1.217} />
              <StatCard img={stats[1].img} cap={stats[1].cap} aspect={0.917} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard img={stats[2].img} cap={stats[2].cap} aspect={1.6} />
              <StatCard img={stats[3].img} cap={stats[3].cap} aspect={1.6} />
            </div>
          </div>
        </div>
      </section>

      {/* Split 2: genuine stock */}
      <section className="bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <Split
            img="/about/genuine.webp"
            alt="FineVu GX4K and GX35 boxes on an Australian retail shelf"
            heading="Genuine stock. Local support. No grey imports."
            paras={[
              "FineVu is distributed in Australia exclusively by AutoXtreme, and sold only through authorised retailers like JB Hi-Fi, Repco and Autobarn, so every unit you buy is genuine, running the correct AU firmware, and backed by local warranty support.",
              "We also run our own certified installation network, so full-time parking protection can be wired in properly, not left dangling off a cigarette lighter socket.",
            ]}
          />
        </div>
      </section>

      {/* What we build for */}
      <section className="bg-[#f4f4f5] py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <SectionHead title="What we build for" sub="Every FineVu camera is designed around three things drivers actually need." />
          <div className="grid gap-6 md:grid-cols-3">
            {whatWeBuild.map((c, i) => (
              <motion.div
                key={c.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-[16px] border border-[#e7e7ea] bg-white p-8"
              >
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-[11px] bg-[#fef2e5] text-[var(--finevu-orange)]">
                  <c.icon className="h-[21px] w-[21px]" strokeWidth={1.8} />
                </span>
                <h3 className="mb-2.5 text-[18px] font-semibold text-[#17181a]">{c.title}</h3>
                <p className="text-[18px] leading-[1.6] text-[#6b6b72]">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <SectionHead title="Our commitment to Australian drivers" sub="What buying a FineVu through an authorised Australian retailer actually gets you." />
          <div className="mx-auto grid max-w-[1116px] gap-5 md:grid-cols-2">
            {commitments.map((c, i) => (
              <motion.div
                key={c.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                className="flex gap-3.5 rounded-[12px] border border-[#d8d8d8] bg-white p-6"
              >
                <span className="mt-[8px] h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--finevu-orange)]" />
                <div>
                  <b className="block text-[17px] font-bold text-[#17181a]">{c.title}</b>
                  <p className="mt-1.5 text-[14.5px] leading-[1.6] text-[#767676]">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn more strip */}
      <LearnMoreLinks />

      {/* Fine print */}
      <section className="bg-[#f4f4f5] pb-16" data-nav-theme="light">
        <div className="mx-auto max-w-[900px] px-6">
          <ol className="list-decimal border-t border-[#e7e7ea] ps-[18px] pt-8">
            <li className="text-[12px] font-medium leading-[18px] text-[#838383]">
              Warranty
              <br />
              3 Year Warranty applies to FineVu dash cam main units only, including front and rear cameras,
              for 36 months from the date of purchase. Genuine FineVu accessories are covered by a 6 month
              warranty. Proof of purchase required. Full warranty terms apply. Your rights under the
              Australian Consumer Law are not excluded.
            </li>
          </ol>
        </div>
      </section>

      <Footer />
    </div>
  );
}

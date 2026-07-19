"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Phone, Mail } from "lucide-react";

// Contact page: dark hero, support cards, message form section and learn more strip

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const channels = [
  {
    icon: Phone,
    title: "Phone Support",
    desc: "Speak directly with our team",
    big: "1800 818 288",
    small: "Mon–Sun, 8:00 AM – 8:00 PM AEST",
    cta: "Call Now",
    href: "tel:1800818288",
  },
  {
    icon: Mail,
    title: "Email Support",
    desc: "Send us a detailed inquiry",
    big: "support@finevuaustralia.com",
    small: "Response within 24 hours",
    cta: "Send Email",
    href: "mailto:support@finevuaustralia.com",
  },
];

const points = [
  { n: "1", title: "Quick response", body: "We typically respond to all enquiries within 24 hours" },
  { n: "2", title: "Expert advice", body: "Get guidance from trained dash cam technicians" },
  {
    n: "3",
    title: "Support for every purchase",
    body: "We support all FineVu products, whichever authorised retailer you bought from",
  },
];

const subjects = [
  "Product question — GX4K",
  "Product question — GX35",
  "Firmware or app help",
  "Warranty claim",
  "Where to buy",
  "Other",
];

const LABEL = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#454b56]";
const INPUT =
  "w-full rounded-[10px] border border-[#e8e5e0] bg-white px-4 py-[13px] text-[15px] text-[#1d1d1f] placeholder:text-[#a8adb7] outline-none transition-colors focus:border-[var(--finevu-orange)]";

function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject ? `FineVu enquiry — ${form.subject}` : "FineVu enquiry");
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`,
    );
    window.location.href = `mailto:support@finevuaustralia.com?subject=${subject}&body=${body}`;
  }

  return (
    <motion.form
      {...fadeUp}
      onSubmit={submit}
      className="grid grid-cols-1 gap-x-4 gap-y-[18px] rounded-[16px] border border-[#e7e7ea] bg-white p-8 sm:grid-cols-2"
    >
      <div>
        <label className={LABEL} htmlFor="f-name">
          Your name <span className="text-[var(--finevu-orange)]">*</span>
        </label>
        <input id="f-name" className={INPUT} placeholder="John Smith" required value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>
      <div>
        <label className={LABEL} htmlFor="f-phone">
          Phone number
        </label>
        <input id="f-phone" className={INPUT} placeholder="0400 000 000" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor="f-email">
          Email address <span className="text-[var(--finevu-orange)]">*</span>
        </label>
        <input id="f-email" className={INPUT} placeholder="you@example.com" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor="f-subject">
          Subject <span className="text-[var(--finevu-orange)]">*</span>
        </label>
        <select
          id="f-subject"
          className={`${INPUT} appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%236B6B72%22%20stroke-width=%222.4%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpath%20d=%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] bg-[right_16px_center] bg-no-repeat`}
          required
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
        >
          <option value="" disabled>
            Select a subject
          </option>
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor="f-msg">
          Message <span className="text-[var(--finevu-orange)]">*</span>
        </label>
        <textarea
          id="f-msg"
          className={`${INPUT} min-h-[130px] resize-y`}
          placeholder="Tell us about your dash cam and what you need help with..."
          required
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="cta-hover col-span-full rounded-full bg-[var(--finevu-orange)] px-7 py-[15px] text-[14px] font-semibold uppercase leading-[20px] text-white"
      >
        Send Message
      </button>
      <p className="col-span-full text-center text-[12.5px] text-[#707784]">
        By submitting this form, you agree to our{" "}
        <Link href="/support" className="font-semibold text-[var(--finevu-orange)]">
          privacy policy
        </Link>
        .
      </p>
    </motion.form>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative text-white" data-nav-theme="dark">
        <Image src="/contact/hero.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(8,8,9,.5) 0%,rgba(8,8,9,.3) 45%,rgba(8,8,9,.55) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[760px] px-6 pt-36 pb-28 text-center md:pt-48 md:pb-36">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[40px] font-semibold leading-[48px] tracking-[-0.02em] md:text-[64px] md:leading-[76px]"
          >
            Get in touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mx-auto mt-6 max-w-[640px] text-[16px] leading-[1.6] text-white/85 md:text-[18px]"
          >
            Questions about your dash cam, an order from one of our retailers, or a warranty claim — our
            Australian support team is here to help.
          </motion.p>
        </div>
      </section>

      {/* How can we help */}
      <section className="bg-white py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto max-w-[1160px] px-6">
          <motion.div {...fadeUp} className="mx-auto mb-11 max-w-[720px] text-center">
            <h2 className="text-[32px] font-semibold leading-[40px] tracking-[-0.015em] text-[#17181a] md:text-[48px] md:leading-[60px]">
              How can we help?
            </h2>
            <p className="mt-4 text-[18px] leading-[1.6] text-[#6b6b72]">
              Get in touch with our team, or find manuals, firmware and troubleshooting for your FineVu
              dash cam below.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-[820px] gap-[22px] sm:grid-cols-2">
            {channels.map((c, i) => (
              <motion.div
                key={c.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex min-w-0 flex-col rounded-[16px] border border-[#e7e7ea] bg-white p-7"
              >
                <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-[#fef2e5] text-[var(--finevu-orange)]">
                  <c.icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                </span>
                <h3 className="mt-[18px] text-[18px] font-semibold text-[#17181a]">{c.title}</h3>
                <p className="mt-1 text-[16px] text-[#6b6b72]">{c.desc}</p>
                <span className="mt-4 block break-words text-[18px] font-semibold text-[#17181a]">{c.big}</span>
                <span className="mt-[3px] block text-[13px] text-[#9c9ca3]">{c.small}</span>
                <a
                  href={c.href}
                  className="cta-hover mt-5 flex w-full items-center justify-center rounded-full bg-[var(--finevu-orange)] px-5 py-[14px] text-[14px] font-semibold uppercase leading-[20px] text-white"
                >
                  {c.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Send us a message */}
      <section className="bg-[#f4f4f5] py-24 md:py-[96px]" data-nav-theme="light">
        <div className="mx-auto grid max-w-[1080px] items-start gap-11 px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-[60px]">
          <motion.div {...fadeUp}>
            <h2 className="text-[30px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#17181a] md:text-[38px]">
              Send us a message
            </h2>
            <p className="mt-3.5 max-w-[460px] text-[18px] leading-[1.6] text-[#6b6b72]">
              Have a question about your FineVu dash cam or need help before you buy? Fill out the form and
              we&apos;ll get back to you within 24 hours.
            </p>
            <ul className="mt-8">
              {points.map((p) => (
                <li key={p.n} className="flex items-start gap-4 py-3">
                  <span className="mt-0.5 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#fef2e5] text-[15px] font-semibold text-[var(--finevu-orange)]">
                    {p.n}
                  </span>
                  <div>
                    <b className="block text-[18px] font-semibold text-[#17181a]">{p.title}</b>
                    <p className="text-[16px] leading-[1.5] text-[#6b6b72]">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <ContactForm />
        </div>
      </section>

      {/* Learn more strip */}
      <LearnMoreLinks />

      <Footer />
    </div>
  );
}

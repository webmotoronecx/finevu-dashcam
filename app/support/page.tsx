"use client";

import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Wrench,
  Smartphone,
  Settings,
  ParkingCircle,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Mail,
  MessageSquare,
  CalendarClock,
  ArrowRight,
  HelpCircle,
  Plus,
  Minus,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const topics = [
  {
    icon: Wrench,
    title: "Installation guides",
    description:
      "Step-by-step DIY setup for your front + rear FineVu, or book a professional fit. Hardwiring, cable routing and best camera placement.",
    links: [
      { label: "Installation services", href: "/services" },
      { label: "Book a fit", href: "/booking" },
    ],
  },
  {
    icon: Smartphone,
    title: "FineVu app & pairing",
    description:
      "Connect over Wi-Fi, set up GPS, and view, save and share footage straight from your phone. Pair your GX4K or GX35 in minutes.",
    links: [
      { label: "GX4K", href: "/gx4k" },
      { label: "GX35", href: "/gx35" },
    ],
  },
  {
    icon: Settings,
    title: "Firmware & settings",
    description:
      "Keep your camera current with the latest firmware, adjust recording quality, loop length, time and date, and SONY STARVIS exposure.",
    links: [{ label: "How it works", href: "/how-it-works" }],
  },
  {
    icon: ParkingCircle,
    title: "Parking mode setup",
    description:
      "Enable motion and impact detection while parked. Set buffered recording, low-voltage cut-off, and protect your car around the clock.",
    links: [{ label: "Learn more", href: "/learn" }],
  },
  {
    icon: ShieldCheck,
    title: "Warranty & repairs",
    description:
      "Every FineVu comes with a 3-Year Australian Warranty. Lodge a claim or arrange a repair through Auto Xtreme on 1800 818 288.",
    links: [
      { label: "Call 1800 818 288", href: "tel:1800818288" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    icon: AlertTriangle,
    title: "Troubleshooting",
    description:
      "Not recording? App won't connect? SD card errors? Work through the common fixes, or reach the team for hands-on help.",
    links: [{ label: "Read the FAQ", href: "/faq" }],
  },
];

const channels = [
  {
    icon: Phone,
    title: "Phone support",
    line1: "Speak directly with our team",
    line2: "1800 818 288",
    line3: "Mon–Fri, 9:00 AM – 5:00 PM AEST",
    cta: "Call now",
    href: "tel:1800818288",
    external: true,
  },
  {
    icon: Mail,
    title: "Email support",
    line1: "Send us a detailed enquiry",
    line2: "Via our contact form",
    line3: "Response within one business day",
    cta: "Send email",
    href: "#",
    external: false,
  },
  {
    icon: MessageSquare,
    title: "Live help",
    line1: "Chat with our support team",
    line2: "Available during support hours",
    line3: "Mon–Fri, 9:00 AM – 5:00 PM AEST",
    cta: "Start chat",
    href: "#",
    external: false,
  },
  {
    icon: CalendarClock,
    title: "Book a call",
    line1: "Schedule a consultation",
    line2: "Talk through setup or warranty",
    line3: "Flexible scheduling available",
    cta: "Schedule call",
    href: "#",
    external: false,
  },
];

const faqGroups = [
  {
    heading: "General questions",
    items: [
      {
        q: "Which FineVu dash cam is right for me?",
        a: "The GX4K is our flagship, with true 4K front recording for maximum number-plate clarity. The GX35 records sharp 2K up front at a friendlier price. Both are 2-channel (front + rear) and use SONY STARVIS sensors.",
      },
      {
        q: "Where are FineVu dash cams made?",
        a: "FineVu cameras are designed and manufactured in Korea, with more than 4 million units sold worldwide. In Australia they're distributed and supported by Auto Xtreme.",
      },
      {
        q: "Do FineVu cameras work in Australian conditions?",
        a: "Yes. Every model is built with heat monitoring and a supercapacitor (not a battery), so it stands up to hot Australian summers and ships ready for local conditions.",
      },
      {
        q: "How many channels do FineVu cameras record?",
        a: "Both the GX4K and GX35 are 2-channel systems — they record the road ahead and behind at the same time with a matched front and rear camera.",
      },
    ],
  },
  {
    heading: "Installation & setup",
    items: [
      {
        q: "Can I install a FineVu myself?",
        a: "The front camera is a plug-and-play fit for most cars. For the rear camera, hardwiring and the full ADAS / parking-mode features, we recommend a professional installation so the wiring is concealed and everything is set up correctly.",
      },
      {
        q: "Do I need hardwiring for parking mode?",
        a: "Parking mode and the full ADAS feature set require a constant power connection, which means hardwiring. Our installers can take care of this with a low-voltage cut-off so your car battery is protected.",
      },
      {
        q: "How do I connect the FineVu app?",
        a: "Enable Wi-Fi on the camera, then connect your phone to it in the FineVu app. From there you can live-view, download and share clips, and update firmware over the air.",
      },
      {
        q: "Where should the camera be mounted?",
        a: "Mount the front camera behind the rear-view mirror for a clear, unobstructed view, and the rear camera high on the rear windscreen. Our installers position both for the best coverage.",
      },
    ],
  },
  {
    heading: "Features & recording",
    items: [
      {
        q: "What resolution do FineVu cameras record in?",
        a: "The GX4K records true 4K (3840 × 2160) up front; the GX35 records 2K QHD (2560 × 1440). Both pair a Full HD 1080p rear camera for complete front-and-rear coverage.",
      },
      {
        q: "How does parking mode work?",
        a: "While the car is parked the camera keeps watch using motion and impact detection, saving buffered footage of any event — typically several seconds before and after — without draining your battery.",
      },
      {
        q: "What size memory card should I use?",
        a: "Use a high-endurance microSD card. FineVu cameras support cards up to 256 GB, and Format Free 2.0 keeps the card healthy without constant reformatting.",
      },
      {
        q: "What is ADAS Plus?",
        a: "ADAS Plus is FineVu's driver-assistance suite — lane-departure and front-vehicle-departure alerts that warn you out loud. It requires hardwiring to function.",
      },
    ],
  },
  {
    heading: "Warranty & repairs",
    items: [
      {
        q: "What warranty do FineVu cameras come with?",
        a: "Every FineVu sold by Auto Xtreme is covered by a 3-Year Australian Warranty. Terms, conditions and exclusions apply.",
      },
      {
        q: "How do I make a warranty claim?",
        a: "Call Auto Xtreme on 1800 818 288 or get in touch through our contact form with your purchase details, and we'll guide you through the next steps.",
      },
      {
        q: "My camera isn't recording — what should I check first?",
        a: "Check the memory card is seated and formatted, confirm the camera has power, and make sure firmware is up to date. If it still won't record, reach out and we'll help you troubleshoot.",
      },
      {
        q: "Where do I get my FineVu repaired?",
        a: "Repairs are handled through Auto Xtreme, FineVu's Australian distributor. Contact the team and they'll arrange assessment and repair under your warranty where applicable.",
      },
    ],
  },
  {
    heading: "Technical & compatibility",
    items: [
      {
        q: "Which vehicles are FineVu cameras compatible with?",
        a: "FineVu cameras fit virtually any 12V/24V vehicle — cars, SUVs, utes and vans. Professional installation tailors the hardwire connection to your specific vehicle.",
      },
      {
        q: "Do the cameras have built-in GPS and Wi-Fi?",
        a: "Yes. Built-in Wi-Fi connects to the FineVu app, and GPS tags every clip with speed and location. The GX35 includes an external GPS module plus speed-camera alerts.",
      },
      {
        q: "How do I update the firmware?",
        a: "Firmware updates are delivered over Wi-Fi through the FineVu app, or via the memory card. Keeping firmware current ensures the best performance and latest features.",
      },
      {
        q: "Will parking mode drain my car battery?",
        a: "No — a low-voltage cut-off powers the camera down before your battery runs low, and Power Saving Parking draws up to 98% less power than standard parking mode.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[#e4e4e7] bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#18181b]">{q}</span>
        <span className="shrink-0 text-[var(--finevu-orange)]">
          {open ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5 text-zinc-400" />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-[15px] text-[#52525c] leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <ScrollProgress />

      {/* Hero — #656565 placeholder per Figma (client to supply art) */}
      <section
        className="relative w-full px-4 md:px-8 lg:px-[5.5vw] pt-3 md:pt-4 pb-3 lg:pb-[1vw]"
        data-nav-theme="dark"
      >
        <div className="relative w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] min-h-[560px] lg:min-h-[max(520px,34vw)] flex items-center justify-center">
          <div className="absolute inset-0 bg-[#656565]" />
          <motion.div
            className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-28 md:pt-24 pb-20"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-white/80 font-semibold text-xs md:text-sm tracking-[0.24em] uppercase mb-5">
              FineVu Support
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.02] uppercase mb-6">
              Help &amp; Support
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
              Everything you need to install, set up and get the most from your FineVu dash cam —
              backed by Auto Xtreme and a 3-Year Australian Warranty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-9 py-3.5 rounded-full bg-[var(--finevu-orange)] text-white font-semibold text-sm uppercase tracking-wider transition-transform hover:scale-105">
                  Browse Help Topics
                </button>
              </a>
              <a href="#" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-9 py-3.5 rounded-full border border-white/40 text-white font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors backdrop-blur-sm">
                  Find Retailer
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Browse help topics */}
      <section id="topics" className="py-16 md:py-28 bg-white scroll-mt-24" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <motion.div className="text-center mb-12 md:mb-16" {...fadeUp}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0b] uppercase mb-4">
              Browse help topics
            </h2>
            <p className="text-lg text-[#52525c] max-w-2xl mx-auto">
              Pick a topic to get going, or jump straight to the team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1312px] mx-auto">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={topic.title}
                  className="flex flex-col rounded-[2rem] border border-[#e4e4e7] bg-white p-8 transition-all hover:border-[var(--finevu-orange)]/50 hover:shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                  whileHover={{ y: -6 }}
                >
                  <Icon className="w-7 h-7 text-[var(--finevu-orange)] mb-5" />
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold tracking-tight text-[#18181b] mb-2">{topic.title}</h3>
                    <p className="text-[#52525c] leading-relaxed">{topic.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 pt-6">
                    {topic.links.map((link) =>
                      link.href.startsWith("/") ? (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#18181b] hover:text-[var(--finevu-orange)] transition-colors"
                        >
                          {link.label}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <a
                          key={link.label}
                          href={link.href}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#18181b] hover:text-[var(--finevu-orange)] transition-colors"
                        >
                          {link.label}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Get support your way */}
      <section className="py-16 md:py-28 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <motion.div className="text-center mb-12 md:mb-16" {...fadeUp}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#151515] uppercase mb-4">
              Get support your way
            </h2>
            <p className="text-lg text-[#52525c] max-w-2xl mx-auto">
              Choose the support channel that works best for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1295px] mx-auto">
            {channels.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  className="flex flex-col gap-6 rounded-2xl border border-[#e4e4e7] bg-white p-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                >
                  <div className="w-14 h-14 rounded-[14px] bg-[rgba(51,74,255,0.1)] flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[var(--finevu-orange)]" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold tracking-tight text-[#151515] mb-2">{c.title}</h3>
                    <p className="text-base text-[#52525c]">{c.line1}</p>
                    <p className="text-base text-[#18181b] mt-1">{c.line2}</p>
                    <p className="text-sm text-[#71717b] mt-1">{c.line3}</p>
                  </div>
                  {c.external ? (
                    <a href={c.href} className="block">
                      <button className="w-full rounded-full bg-[var(--finevu-orange)] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-transform hover:scale-[1.02]">
                        {c.cta}
                      </button>
                    </a>
                  ) : (
                    <a href={c.href} className="block">
                      <button className="w-full rounded-full bg-[var(--finevu-orange)] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-transform hover:scale-[1.02]">
                        {c.cta}
                      </button>
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Talk to support band */}
      <section className="py-16 md:py-28 bg-[#fafafa]" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <motion.div
            className="rounded-[2rem] brand-gradient p-10 md:p-16 text-center overflow-hidden"
            {...fadeUp}
          >
            <div className="w-16 h-16 rounded-full bg-[var(--finevu-orange)] flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase mb-4">
              Talk to support
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Still stuck? Auto Xtreme, FineVu&apos;s Australian distributor, can help with setup,
              warranty and repairs. Call us during support hours, Mon–Fri 9:00 AM – 5:00 PM AEST.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="tel:1800818288" className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--finevu-orange)] text-white font-semibold text-sm uppercase tracking-wider transition-transform"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Call 1800 818 288
                </motion.button>
              </a>
              <a href="#" className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-white/40 text-white font-semibold text-sm uppercase tracking-wider transition-colors hover:border-white"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Send a message
                </motion.button>
              </a>
            </div>
            <div className="pt-8">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-[var(--finevu-orange)] transition-colors"
              >
                <HelpCircle className="w-4 h-4" /> Prefer to read first? Check the FAQ
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-28 bg-white" data-nav-theme="light">
        <div className="max-w-[768px] mx-auto px-6">
          {faqGroups.map((group, gi) => (
            <motion.div key={group.heading} className={gi === 0 ? "" : "mt-16"} {...fadeUp}>
              <h2 className="text-2xl md:text-3xl font-bold text-[#18181b] mb-6">{group.heading}</h2>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

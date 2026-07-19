"use client";

import { Footer } from "@/components/Footer";
import { LearnMoreLinks } from "@/components/LearnMoreLinks";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// FAQ page — photo hero with brand scrim, category-grouped question accordions, important-information note, and a Learn More strip.

const groups: { title: string; items: { q: string; a: string[] }[] }[] = [
  {
    title: "Products & recording",
    items: [
      {
        q: "What's the difference between the GX4K and the GX35?",
        a: [
          "The GX4K is our flagship. It records in 4K UHD at the front and Full HD at the rear, so it picks up more detail and makes number plates easier to read at a distance. The GX35 records Full HD front and rear in a smaller, cheaper package that handles everyday driving well. Both have parking mode, Wi-Fi app connectivity and low-voltage battery protection.",
        ],
      },
      {
        q: "Does my dash cam record while my car is parked?",
        a: [
          "Yes, as long as a hardwire kit is installed. Parking mode keeps watch while the ignition is off and saves a clip whenever it detects motion or an impact. A built-in low-voltage cutoff stops recording before your car battery runs down, and you can adjust the cutoff level in the settings.",
        ],
      },
      {
        q: "How well does it record at night?",
        a: [
          "FineVu dash cams use low-light image sensors with automatic night vision. They brighten dark scenes and hold the exposure steady around headlights and street lighting, so you don't need to touch any settings. Night optimisation switches on by itself.",
        ],
      },
      {
        q: "How much footage can my memory card hold?",
        a: [
          "That depends on the card size and the model. As a rough guide, a 64GB card holds several hours of continuous footage before loop recording starts writing over the oldest files. Event and parking clips sit in protected folders, so normal driving footage won't overwrite them. We recommend high-endurance microSD cards made for dash cams.",
        ],
      },
      {
        q: "Can I view footage on my phone?",
        a: [
          "Yes. Connect your phone to the camera's built-in Wi-Fi through the FineVu app and you can watch live footage, play back and download clips, and change settings, all without any cables. You can also review footage on a computer with the FineVu PC player, which shows your GPS route and speed alongside the video.",
        ],
      },
    ],
  },
  {
    title: "Installation & the law",
    items: [
      {
        q: "Is it legal to use a dash cam in Australia?",
        a: [
          "Dash cams are legal to own and use in every Australian state and territory. Road rules do require that the camera doesn't block the driver's view, so it should sit behind or around the rear-view mirror, and you can't operate it by hand while driving.",
          "Laws on recording audio and conversations vary from state to state, and there may be rules about how you can share or publish recordings. This is general information rather than legal advice, so please check what applies where you live.",
        ],
      },
      {
        q: "Can I install it myself, or do I need a professional?",
        a: [
          "A basic install with the included power cable is straightforward for most people. Parking mode is a bit different: the hardwire kit connects to your vehicle's fuse box, which a confident DIYer can handle, but we'd suggest a professional if you're at all unsure. It's also required to keep some vehicle warranties intact. Plenty of our authorised retailers offer installation.",
        ],
      },
      {
        q: "Will hardwiring a dash cam void my car's warranty?",
        a: [
          "A hardwire kit fitted correctly with a fuse tap doesn't alter your vehicle's wiring, so in most cases it won't affect a new-car warranty. Warranty terms do vary between manufacturers, though, so if you're in any doubt, use a professional installer and hold onto a record of the installation.",
        ],
      },
      {
        q: "Where should the cameras be positioned?",
        a: [
          "The front camera should sit high on the windscreen, tucked behind the rear-view mirror so it stays out of the driver's line of sight, with the lens below any tinted band. The rear camera mounts in the centre at the top of the rear window. Keep both cameras clear of demister lines and airbag deployment zones.",
        ],
      },
    ],
  },
  {
    title: "Warranty & support",
    items: [
      {
        q: "What warranty comes with my FineVu dash cam?",
        a: [
          "FineVu dash cams purchased from an authorised Australian retailer are covered by a manufacturer's warranty against defects, in addition to your rights under the Australian Consumer Law.",
          "Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the goods repaired or replaced if the goods fail to be of acceptable quality and the failure does not amount to a major failure.",
        ],
      },
      {
        q: "What isn't covered by the warranty?",
        a: [
          "The manufacturer's warranty doesn't cover damage caused by accident, misuse, unauthorised modification or repair, incorrect installation, water ingress from improper fitting, or normal wear and tear. Consumable items such as memory cards and adhesive mounts have a shorter expected life and are covered against manufacturing defects only. These exclusions don't limit your statutory rights under the Australian Consumer Law.",
        ],
      },
      {
        q: "I bought my camera from a retailer. Who handles the warranty claim?",
        a: [
          "Either of us can help. Under the Australian Consumer Law you can take the product back to the retailer you bought it from, or come straight to FineVu support. We look after every FineVu product no matter which authorised retailer sold it. Just keep your receipt or tax invoice, since you'll need it as proof of purchase for any claim.",
        ],
      },
      {
        q: "Do I need to register my product?",
        a: [
          "Registration is optional and doesn't affect your warranty rights, but it does make any future claim quicker, since your details and proof of purchase are already on file. Registered owners also get firmware update notifications for their model.",
        ],
      },
      {
        q: "How do I keep my dash cam up to date?",
        a: [
          "Download the latest firmware for your model from the Download Centre and copy it onto a freshly formatted memory card. Put the card in, power the camera on, and the update installs itself. Leave the camera powered the whole time. It's also worth reformatting your memory card every one to two months to keep recording reliable.",
        ],
      },
    ],
  },
];

function FaqRow({ q, a }: { q: string; a: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e7e7ea]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-5 py-[22px] text-left text-[17px] font-semibold leading-snug tracking-[-0.005em] transition-colors md:text-[18px] ${open ? "text-[var(--finevu-orange)]" : "text-[#17181a]"}`}
      >
        {q}
        <ChevronDown
          className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 ${
            open ? "rotate-180 text-[var(--finevu-orange)]" : "text-[#9c9ca3]"
          }`}
        />
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="max-w-[700px] space-y-3 pb-6 text-[16px] leading-[1.6] text-[#6b6b72] md:text-[18px]">
            {a.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero: dash cam lineup photo */}
      <section className="relative overflow-hidden text-white" data-nav-theme="dark">
        {/* Product-lineup photography */}
        <Image
          src="/products/faq-hero.webp"
          alt="The FineVu dash cam range"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Darkening scrim for legibility — matches the support/retailers heroes */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(8,8,9,.5) 0%,rgba(8,8,9,.28) 45%,rgba(8,8,9,.55) 100%)" }} />
        <div className="relative z-10 mx-auto max-w-[760px] px-6 pt-36 pb-24 text-center md:pt-48 md:pb-36">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[40px] font-semibold leading-[48px] tracking-[-0.02em] md:text-[64px] md:leading-[76px]"
          >
            Frequently asked questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mx-auto mt-6 max-w-[640px] text-[16px] leading-[1.6] text-white/85 md:text-[18px]"
          >
            Everything you need to know about your FineVu dash cam. Can&apos;t find your answer?{" "}
            <Link href="/contact" className="font-semibold text-white underline decoration-white/40 underline-offset-4">
              Contact us
            </Link>{" "}
            and we&apos;ll help.
          </motion.p>
        </div>
      </section>

      {/* FAQ groups */}
      <main className="mx-auto max-w-[880px] px-6 pt-10 pb-5" data-nav-theme="light">
        {groups.map((g) => (
          <div key={g.title} className="pt-[34px]">
            <h2 className="pb-2 text-[15px] font-semibold uppercase leading-[1.4] tracking-[0.16em] text-[var(--finevu-orange)]">
              {g.title}
            </h2>
            <div className="border-t border-[#e7e7ea]">
              {g.items.map((it) => (
                <FaqRow key={it.q} q={it.q} a={it.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Important information */}
        <div className="my-14 rounded-[16px] border border-[#e7e7ea] bg-[#f4f4f5] px-7 py-6">
          <h3 className="mb-2 text-[16px] font-semibold text-[#17181a]">Important information</h3>
          <p className="mb-2 text-[13px] leading-[1.6] text-[#6b6b72]">
            The information on this page is general in nature and provided as a guide only. It does not
            constitute legal advice. Road rules, surveillance and recording laws differ between
            Australian states and territories and may change, so please check the requirements that
            apply in your location.
          </p>
          <p className="text-[13px] leading-[1.6] text-[#6b6b72]">
            Nothing on this page excludes, restricts or modifies any consumer guarantee, right or remedy
            conferred by the Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010
            (Cth)) or any other applicable law that cannot lawfully be excluded.
          </p>
        </div>
      </main>

      {/* Learn more strip */}
      <LearnMoreLinks />

      <Footer />
    </div>
  );
}

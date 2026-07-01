"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { ScrollProgress } from '@/components/ScrollProgress';
import Link from "next/link";

export default function Page() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "Choosing a FineVu",
      questions: [
        {
          q: "What's the difference between the GX4K and GX35?",
          a: "Both are front and rear systems with SONY STARVIS sensors — the difference is resolution. The GX4K records in 4K up front for maximum detail and the sharpest number-plate capture, and ships with a 128GB SD card. The GX35 records in crisp 2K, is the more affordable option, and ships with a 64GB SD card. If you want the most detail possible, choose GX4K; if you want premium footage at a sharper price, choose GX35."
        },
        {
          q: "Do I need front AND rear cameras?",
          a: "We recommend it. A front-only camera misses everything behind you — rear-end collisions, tailgaters and incidents while parked behind your vehicle. Every FineVu system in our range is a front and rear setup, so you're covered in both directions out of the box."
        },
        {
          q: "Where can I buy FineVu?",
          a: "FineVu is distributed in Australia by AutoXtreme and available through a national network of stockists and mobile installers. Use the Where to Buy page to find your nearest option, or call 1800 818 288."
        }
      ]
    },
    {
      category: "Features & how it works",
      questions: [
        {
          q: "What is ADAS, and do I need to hardwire the camera?",
          a: "ADAS stands for Advanced Driver Assistance Systems — features like lane departure and forward collision warnings that alert you on the road. To use ALL ADAS features, the camera must be hard-wired (a permanent power connection), not just plugged into the 12V socket. Hard-wiring also powers parking mode. A professional installer can do this in well under an hour."
        },
        {
          q: "What is parking mode / Smart Sense 24/7?",
          a: "Parking mode keeps your FineVu watching over your vehicle while it's parked and switched off. Smart Sense 24/7 monitors for impacts and motion and records the moment something happens, so you have evidence of car-park dings, theft and hit-and-runs. Parking mode requires the camera to be hard-wired for constant power."
        },
        {
          q: "Does it record in the dark?",
          a: "Yes. Every FineVu uses SONY STARVIS image sensors with automatic night vision, brightening low-light scenes so plates, signage and detail stay visible after dark and in poorly lit car parks."
        }
      ]
    },
    {
      category: "Footage, storage & install",
      questions: [
        {
          q: "How do I view and share my footage?",
          a: "Connect to your camera with the FineVu app over Wi-Fi to view, download and share clips straight from your phone, complete with GPS location data. You can also view footage in a web browser, or pop the SD card into a computer."
        },
        {
          q: "What SD card is included?",
          a: "A microSD card is included in the box: 128GB with the GX4K and 64GB with the GX35. Both are ready to record as soon as the camera is installed."
        },
        {
          q: "Can I install it myself, or do I need a professional?",
          a: "Either works. A capable DIYer can self-install a FineVu, especially for basic 12V-socket use. For a clean, hidden install and full ADAS plus parking mode (which require hard-wiring), we recommend a professional — FineVu is supported by a network of 80+ mobile installers across Australia who come to you."
        },
        {
          q: "What warranty do I get?",
          a: "Every FineVu sold in Australia comes with a 3-Year Australian Warranty, supported locally by AutoXtreme — not a grey-import warranty from overseas."
        }
      ]
    }
  ];

  let questionIndex = 0;

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />

      {/* Hero — brand gradient design layer (no real product photos) */}
      <section
        className="relative min-h-[70vh] flex items-center overflow-hidden brand-gradient pt-32 md:pt-40 pb-24"
        data-nav-theme="dark"
      >
        {/* Placeholder image — road/driving Unsplash, not a product photo */}
        <motion.div
          className="absolute inset-0 opacity-25"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
            alt="Driving on the highway"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 brand-gradient mix-blend-multiply" />
        </motion.div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 w-full">
          <motion.div
            className="space-y-6 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="finevu-capsule font-mono">FAQ</span>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05]">
              Frequently asked questions
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
              Everything you need to know about FineVu dash cams — from GX4K vs GX35
              to ADAS, parking mode and warranty.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-4xl mx-auto px-8 lg:px-16">
          <div className="space-y-16">
            {faqs.map((category, categoryIdx) => (
              <div key={categoryIdx}>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-12 text-zinc-900"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {category.category}
                </motion.h2>

                <div className="space-y-4">
                  {category.questions.map((faq, idx) => {
                    const currentIndex = questionIndex++;
                    const isOpen = openIndex === currentIndex;

                    return (
                      <motion.div
                        key={currentIndex}
                        className="border border-zinc-200 rounded-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : currentIndex)}
                          className="w-full px-8 py-6 flex items-center justify-between text-left smooth-transition hover:bg-zinc-50"
                          aria-expanded={isOpen}
                        >
                          <span className="text-lg font-bold pr-8">{faq.q}</span>
                          <div className="flex-shrink-0">
                            {isOpen ? (
                              <Minus className="w-6 h-6 text-[var(--finevu-orange)]" />
                            ) : (
                              <Plus className="w-6 h-6 text-zinc-400" />
                            )}
                          </div>
                        </button>

                        <motion.div
                          initial={false}
                          animate={{
                            height: isOpen ? "auto" : 0,
                            opacity: isOpen ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-8 pb-6 text-zinc-600 leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="py-32 brand-gradient" data-nav-theme="dark">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Still have questions?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Our Australian team is here to help. Call 1800 818 288 or reach out below.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/contact">
                <motion.button
                  className="cta-hover px-6 py-2.5 rounded-full bg-[var(--finevu-orange)] text-white smooth-transition"
                >
                  Contact us
                </motion.button>
              </Link>
              <Link href="/support">
                <motion.button
                  className="cta-hover px-6 py-2.5 rounded-full border-2 border-white/40 text-white smooth-transition"
                >
                  Visit support
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

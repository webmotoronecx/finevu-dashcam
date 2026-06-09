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
      category: "General Questions",
      questions: [
        {
          q: "What is an EV battery health check?",
          a: "An EV battery health check is a comprehensive diagnostic assessment that measures your battery's State of Health (SOH), capacity, and overall performance. Our technicians use professional-grade equipment to analyze the battery's current condition and predict future performance."
        },
        {
          q: "How long does a battery health check take?",
          a: "Our Essential Battery Health Check takes approximately 45 minutes. The Comprehensive EV Assessment takes 90 minutes, and our Pre-Purchase Inspection requires about 2 hours to complete a thorough evaluation."
        },
        {
          q: "Do you offer mobile service?",
          a: "Yes! We bring our fully equipped mobile diagnostic units to your home, office, or any convenient location across Australia. You can also visit our diagnostic centres if you prefer."
        },
        {
          q: "What's included in the report?",
          a: "You'll receive a detailed digital report including battery State of Health (SOH), capacity analysis, diagnostic scan results, charging efficiency metrics, and expert recommendations. All reports are easy to understand with clear visualizations."
        }
      ]
    },
    {
      category: "Pre-Purchase Inspections",
      questions: [
        {
          q: "Should I get a pre-purchase inspection before buying a used EV?",
          a: "Absolutely. The battery is the most expensive component of an EV, often costing $10,000-$20,000+ to replace. Our Pre-Purchase Inspection can reveal hidden issues and give you negotiating power, potentially saving you thousands of dollars."
        },
        {
          q: "Can the inspection help me negotiate the price?",
          a: "Yes! Our detailed report includes market value assessment and identifies any battery degradation or issues. Many customers have successfully negotiated thousands off the purchase price using our inspection findings."
        },
        {
          q: "How quickly can I get a pre-purchase inspection?",
          a: "We offer same-day and next-day appointments for urgent pre-purchase inspections. Our standard turnaround is 24-48 hours from booking to receiving your complete report."
        },
        {
          q: "What if the inspection reveals problems?",
          a: "Our report will detail any issues found, their severity, and estimated costs to address them. This information helps you make an informed decision about whether to proceed with the purchase, negotiate a lower price, or walk away."
        }
      ]
    },
    {
      category: "Battery Health & Performance",
      questions: [
        {
          q: "What is State of Health (SOH)?",
          a: "State of Health (SOH) is a measurement that indicates your battery's current capacity compared to when it was new. A 90% SOH means your battery retains 90% of its original capacity. This is one of the key metrics we measure during our checks."
        },
        {
          q: "How much battery degradation is normal?",
          a: "Most EV batteries lose 2-3% capacity per year under normal use. After 5 years, 85-90% SOH is typical. Anything below 80% SOH may indicate accelerated degradation or warranty eligibility for replacement."
        },
        {
          q: "Can battery health be improved?",
          a: "While you can't reverse degradation, you can slow it down with proper charging habits: avoid frequent fast charging, keep the battery between 20-80%, and minimize exposure to extreme temperatures."
        },
        {
          q: "When should I be concerned about my battery?",
          a: "Contact us if you notice: significant range loss (>20% from new), unusual charging behavior, battery warning lights, or if your vehicle is approaching warranty expiration. Early detection can help preserve warranty coverage."
        }
      ]
    },
    {
      category: "Pricing & Booking",
      questions: [
        {
          q: "How much does a battery health check cost?",
          a: "Our Essential Battery Health Check starts at $199. The Comprehensive EV Assessment is $299, and our full Pre-Purchase Inspection is $399. All prices include a detailed digital report and mobile service is available."
        },
        {
          q: "Do you charge extra for mobile service?",
          a: "Mobile service is included in all our package prices at no extra charge within our standard service areas. Extended travel areas may incur a small additional fee."
        },
        {
          q: "How do I book an appointment?",
          a: "You can book online through our website, call our team, or email us. We offer flexible scheduling with appointments available 7 days a week, including evenings."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, debit cards, PayPal, and bank transfers. Payment is due at the time of service or upon receiving your report for pre-purchase inspections."
        }
      ]
    },
    {
      category: "Technical Details",
      questions: [
        {
          q: "Which EV models do you support?",
          a: "We support all major EV brands including Tesla, Hyundai, Kia, Nissan, MG, BYD, Polestar, Volvo, and more. Our technicians are trained on the latest diagnostic equipment for both new and older EV models."
        },
        {
          q: "What equipment do you use?",
          a: "We use professional-grade diagnostic tools including OBD-II scanners, battery analyzers, and manufacturer-specific diagnostic software. Our equipment meets or exceeds industry standards for accuracy."
        },
        {
          q: "Are your technicians certified?",
          a: "Yes, all our technicians are certified in EV diagnostics and high-voltage systems. They undergo continuous training to stay current with the latest EV technology and safety protocols."
        },
        {
          q: "Is the diagnostic process safe for my vehicle?",
          a: "Absolutely. Our diagnostic procedures are completely non-invasive and follow manufacturer guidelines. We never make modifications or adjustments to your vehicle during a health check."
        }
      ]
    }
  ];

  let questionIndex = 0;

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-nav-theme="dark">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHN1cHBvcnQlMjBoZWxwfGVufDF8fHx8MTc2NDEzMDM3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Customer support"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </motion.div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-[1.1]">
              Frequently Asked Questions
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about EV battery health checks
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-4xl mx-auto px-8 lg:px-16">
          <div className="space-y-16">
            {faqs.map((category, categoryIdx) => (
              <div key={categoryIdx}>
                <motion.h2 
                  className="text-3xl md:text-4xl font-light mb-12 text-zinc-900"
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
                        >
                          <span className="text-lg pr-8">{faq.q}</span>
                          <div className="flex-shrink-0">
                            {isOpen ? (
                              <Minus className="w-6 h-6 text-[var(--electric-green)]" />
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
      <section className="py-32 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-light tracking-tight">
              Still have questions?
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Our team is here to help you understand EV battery health
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/contact">
                <motion.button
                  className="px-6 py-2.5 rounded-full bg-[#334AFF] text-white smooth-transition electric-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Support
                </motion.button>
              </Link>
              <Link href="/services">
                <motion.button
                  className="px-6 py-2.5 rounded-full border-2 border-zinc-300 smooth-transition"
                  whileHover={{ borderColor: "var(--electric-green)", color: "var(--electric-green)", scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Services
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
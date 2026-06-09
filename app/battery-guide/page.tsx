"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Battery, TrendingDown, Zap, ThermometerSun, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ScrollProgress } from '@/components/ScrollProgress';
import Link from "next/link";

export default function Page() {
  const guideTopics = [
    {
      icon: Battery,
      title: "Understanding Battery Health",
      content: "Your EV's battery is its most valuable component. State of Health (SOH) measures the current capacity compared to when new. A healthy battery should retain 85-90% capacity after 5 years. Factors affecting health include charging habits, temperature exposure, and driving patterns."
    },
    {
      icon: TrendingDown,
      title: "Normal vs Abnormal Degradation",
      content: "Expect 2-3% capacity loss per year under normal conditions. Degradation below 80% SOH within warranty period may qualify for replacement. Rapid degradation (>5% annually) indicates potential issues requiring professional assessment."
    },
    {
      icon: Zap,
      title: "Optimal Charging Practices",
      content: "Keep your battery between 20-80% for daily use. Avoid frequent DC fast charging when possible. Charge to 100% only before long trips. Use scheduled charging during cooler nighttime hours to reduce heat stress on the battery."
    },
    {
      icon: ThermometerSun,
      title: "Temperature Management",
      content: "Extreme temperatures accelerate battery degradation. Park in shaded areas during summer. In winter, precondition your battery before driving. Modern EVs have thermal management systems, but you can help by avoiding temperature extremes when possible."
    },
    {
      icon: AlertTriangle,
      title: "Warning Signs",
      content: "Watch for: significant range loss (>20% reduction), longer charging times, battery warning lights, unusual battery temperature, or inconsistent performance. These signs warrant a professional health check."
    },
    {
      icon: ShieldCheck,
      title: "Warranty Coverage",
      content: "Most EV batteries have 8-year/160,000km warranties covering capacity below 70%. Document your battery health regularly. Our reports can support warranty claims if degradation exceeds normal rates."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1733149085759-2e2cfdf6b373?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBiYXR0ZXJ5JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjQwNjE3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="EV battery technology"
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
              EV Battery Health Guide
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about maintaining and understanding your electric vehicle's battery
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-8 lg:px-16">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Why Battery Health Matters
            </h2>
            <div className="space-y-6 text-lg text-zinc-700 leading-relaxed">
              <p>
                Your EV's battery is its most expensive and important component, often representing 30-40% of the vehicle's total value. Understanding battery health isn't just about range—it's about protecting your investment, maintaining resale value, and ensuring your vehicle performs as expected.
              </p>
              <p>
                Unlike traditional cars where engine wear happens gradually over hundreds of thousands of kilometers, EV battery degradation is influenced by many factors: how you charge, where you drive, and even where you park. The good news? With proper care and regular monitoring, modern EV batteries can last well beyond their warranty periods.
              </p>
              <p>
                This guide will help you understand what affects battery health, how to maximize battery life, and when to seek professional assessment.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Guide Topics */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {guideTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={index}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-[var(--brand-light-gray)]/30 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-8 h-8 text-[var(--electric-green)]" />
                  </motion.div>
                  <h3 className="text-2xl">{topic.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {topic.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deep Dive: State of Health */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-8 lg:px-16">
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Understanding State of Health (SOH)
            </h2>

            <div className="space-y-8 text-lg text-zinc-700 leading-relaxed">
              <div>
                <h3 className="text-2xl text-zinc-900 mb-4">What is SOH?</h3>
                <p>
                  State of Health (SOH) is expressed as a percentage comparing your battery's current maximum capacity to its original capacity when new. For example, a battery with 90% SOH can store 90% of the energy it could when brand new.
                </p>
              </div>

              <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-200">
                <h4 className="text-xl text-zinc-900 mb-4">SOH Benchmarks:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--electric-green)] mt-1">✓</span>
                    <span><strong>95-100% SOH:</strong> Excellent - Battery is like new</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--electric-green)] mt-1">✓</span>
                    <span><strong>85-94% SOH:</strong> Good - Normal degradation for 3-5 year old vehicles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-600 mt-1">!</span>
                    <span><strong>75-84% SOH:</strong> Fair - Consider professional assessment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 mt-1">✗</span>
                    <span><strong>Below 75% SOH:</strong> Concerning - May affect warranty, requires inspection</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl text-zinc-900 mb-4">How We Measure SOH</h3>
                <p>
                  Our diagnostic equipment connects directly to your vehicle's battery management system (BMS) to retrieve accurate capacity data. We don't rely on the dashboard display, which can be optimistic. Our professional tools provide the real numbers you need for buying, selling, or maintaining your EV.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-8 lg:px-16">
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Best Practices for Battery Longevity
            </h2>

            <div className="space-y-8">
              {[
                {
                  title: "The 20-80 Rule",
                  description: "Keep your battery between 20% and 80% for daily driving. This range minimizes stress on the battery cells and significantly extends battery life. Only charge to 100% before long trips."
                },
                {
                  title: "Avoid Extreme Temperatures",
                  description: "Both extreme heat and cold accelerate degradation. Park in shaded or covered areas when possible. In winter, precondition your battery while still plugged in to reduce range impact and battery stress."
                },
                {
                  title: "Minimize DC Fast Charging",
                  description: "While convenient, frequent DC fast charging generates more heat and stress than AC charging. Reserve fast charging for road trips and use Level 2 charging for daily needs."
                },
                {
                  title: "Regular Driving",
                  description: "Batteries that sit unused for extended periods can degrade faster. If storing your EV, maintain charge around 50% and drive it at least once a month."
                },
                {
                  title: "Monitor Battery Health",
                  description: "Get professional battery health checks annually, or before major decisions like selling or when noticing performance changes. Early detection of issues can prevent costly problems."
                }
              ].map((practice, index) => (
                <motion.div
                  key={index}
                  className="border-l-4 border-[var(--electric-green)] pl-8 py-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-xl text-zinc-900 mb-2">{practice.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{practice.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* When to Get Checked */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-8 lg:px-16">
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              When to Get a Professional Check
            </h2>

            <div className="space-y-6 text-lg text-zinc-700 leading-relaxed">
              <p>Consider getting a professional battery health check if you:</p>
              <ul className="space-y-4 ml-6">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--electric-green)] text-2xl leading-none">•</span>
                  <span>Are considering buying a used EV (essential for pre-purchase)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--electric-green)] text-2xl leading-none">•</span>
                  <span>Notice more than 20% range reduction from new</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--electric-green)] text-2xl leading-none">•</span>
                  <span>Are approaching warranty expiration (document baseline health)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--electric-green)] text-2xl leading-none">•</span>
                  <span>Experience unusual charging behavior or battery warnings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--electric-green)] text-2xl leading-none">•</span>
                  <span>Plan to sell your EV (transparency builds buyer confidence)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--electric-green)] text-2xl leading-none">•</span>
                  <span>Want annual health monitoring for peace of mind</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-light tracking-tight">
              Ready to check your battery health?
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Get professional insights into your EV's most valuable component
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/booking">
                <motion.button
                  className="px-6 py-2.5 rounded-full bg-[#334AFF] text-white smooth-transition electric-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Health Check
                </motion.button>
              </Link>
              <Link href="/services">
                <motion.button
                  className="px-6 py-2.5 rounded-full border-2 border-zinc-300 smooth-transition"
                  whileHover={{ borderColor: "var(--electric-green)", color: "var(--electric-green)", scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Services
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
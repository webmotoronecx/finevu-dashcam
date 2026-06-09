"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Building2, Car, Shield, Users, TrendingUp, CheckCircle } from 'lucide-react';
import Link from "next/link";

export default function Page() {
  const partnerTypes = [
    {
      icon: Car,
      title: "Dealerships",
      description: "Pre-sale battery health inspections and certification services for used EV inventory",
      features: [
        "Increase buyer confidence with certified battery reports",
        "Faster sales cycles with transparent battery data",
        "Competitive advantage in the used EV market",
        "Volume pricing for dealer networks"
      ]
    },
    {
      icon: Building2,
      title: "Fleet Management",
      description: "Comprehensive battery health monitoring for electric vehicle fleets of any size",
      features: [
        "Regular health monitoring schedules",
        "Predictive maintenance insights",
        "Fleet performance reporting",
        "Custom diagnostic packages"
      ]
    },
    {
      icon: Shield,
      title: "Insurance Providers",
      description: "Verified battery health data for accurate risk assessment and claims processing",
      features: [
        "Independent battery health verification",
        "Pre-policy risk assessment data",
        "Claims support documentation"
      ]
    },
    {
      icon: Users,
      title: "Property Developers",
      description: "EV health check services for residents in new developments with EV infrastructure",
      features: [
        "Exclusive resident offers",
        "On-site diagnostic events",
        "Partnership marketing support",
        "Custom service packages"
      ]
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "Revenue Share",
      description: "Earn commission on every referral or service provided to your customers"
    },
    {
      icon: TrendingUp,
      title: "Business Growth",
      description: "Enhance your service offering with professional EV diagnostics"
    },
    {
      icon: Shield,
      title: "Brand Trust",
      description: "Association with Australia's leading EV battery health specialists"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Account manager and priority technical support for all partners"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden" data-nav-theme="dark">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc2NDExODQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Business partnership"
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
              Partner With EV360
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Join Australia's leading EV battery health assessment network
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Partnership Opportunities
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Tailored solutions for businesses across the EV ecosystem
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {partnerTypes.map((partner, index) => {
              const Icon = partner.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-zinc-50 rounded-3xl p-10 space-y-6"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                >
                  <div className="flex items-start gap-6">
                    <motion.div
                      className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[var(--brand-light-gray)]/30 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-8 h-8 text-[var(--electric-green)]" />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl mb-3">{partner.title}</h3>
                      <p className="text-zinc-600 leading-relaxed">{partner.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-zinc-200">
                    {partner.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[var(--electric-green)] flex-shrink-0 mt-0.5" />
                        <span className="text-zinc-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-32 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Partnership Benefits
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Why leading businesses choose EV360
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center space-y-6"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg"
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <Icon className="w-8 h-8 text-[var(--electric-green)]" />
                  </motion.div>
                  <h3 className="text-2xl">{benefit.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1564912139097-6e35a037c77f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjB0ZWNobmljaWFuJTIwZGlhZ25vc3RpY3xlbnwxfHx8fDE3NjQxMTgzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Partner success story"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 rounded-full bg-[var(--electric-green)]/10 text-[var(--electric-green)] text-sm">
                Partner Success Story
              </div>

              <div>
                <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
                  Increasing customer confidence by 85%
                </h2>
                <p className="text-xl text-zinc-600 leading-relaxed mb-6">
                  "Since partnering with EV360, we've seen a dramatic increase in used EV sales. The battery health reports give our customers the confidence they need to make purchasing decisions."
                </p>
                <div className="pt-6 border-t border-zinc-200">
                  <p className="text-zinc-900">Sarah Mitchell</p>
                  <p className="text-zinc-500">Sales Director, Premium EV Dealership Sydney</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="space-y-2">
                  <div className="text-4xl font-light text-[var(--electric-green)]">85%</div>
                  <div className="text-sm text-zinc-600">Buyer confidence increase</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-light text-[var(--electric-blue)]">40%</div>
                  <div className="text-sm text-zinc-600">Faster sales cycles</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-light text-[var(--electric-green)]">200+</div>
                  <div className="text-sm text-zinc-600">EVs certified monthly</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works for Partners */}
      <section className="py-32 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Simple onboarding process
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Get started in just a few steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "1", title: "Submit Application", desc: "Tell us about your business and partnership goals" },
              { num: "2", title: "Partnership Agreement", desc: "Review and sign our straightforward partner agreement" },
              { num: "3", title: "Onboarding & Training", desc: "Get access to resources and partner portal training" },
              { num: "4", title: "Start Referring", desc: "Begin offering EV360 services to your customers" }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 text-center space-y-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--brand-light-gray)]/30 flex items-center justify-center">
                  <span className="text-3xl font-light text-[var(--electric-green)]">{step.num}</span>
                </div>
                <h3 className="text-xl">{step.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center space-y-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
              Ready to partner with us?
            </h2>
            <p className="text-xl text-zinc-600">
              Join Australia's leading EV battery health assessment network and grow your business
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/contact">
                <motion.button
                  className="px-6 py-2.5 rounded-full bg-[#334AFF] text-white smooth-transition electric-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Become a Partner
                </motion.button>
              </Link>
              <Link href="/how-it-works">
                <motion.button
                  className="px-6 py-2.5 rounded-full border-2 border-zinc-300 smooth-transition"
                  whileHover={{ borderColor: "var(--electric-green)", color: "var(--electric-green)", scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>

            <p className="text-zinc-500 pt-4">
              Questions? Email us at partners@ev360.com.au or call 1300 EV 360
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, FileCheck, MessageCircle, Battery, Zap, ChevronDown } from 'lucide-react';
import Link from "next/link";
import { useState } from 'react';

import { ReportPreview } from '@/components/ReportPreview';

export default function Page() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const steps = [
    {
      number: "01",
      title: "Choose Your Service",
      description: "Select the EV health check package that suits your needs—from a quick battery assessment to comprehensive pre-purchase inspection.",
      icon: Battery,
      details: [
        "Browse our service packages",
        "Compare features and pricing",
        "Read what's included",
        "Get instant pricing"
      ]
    },
    {
      number: "02",
      title: "Book Your Appointment",
      description: "Schedule online or call our team. Choose mobile service at your location or visit our diagnostic centre.",
      icon: Calendar,
      details: [
        "Select your preferred date and time",
        "Choose home, office, or our centre",
        "Instant confirmation",
        "Flexible rescheduling"
      ]
    },
    {
      number: "03",
      title: "We Arrive & Inspect",
      description: "Our certified technician performs a comprehensive diagnostic using professional equipment, explaining findings as we go.",
      icon: Zap,
      details: [
        "Professional equipment setup",
        "Complete diagnostic testing",
        "Real-time updates",
        "Questions answered on-site"
      ]
    },
    {
      number: "04",
      title: "Receive Your Report",
      description: "Get a detailed, easy-to-understand digital report within 24 hours, with expert recommendations and next steps.",
      icon: FileCheck,
      details: [
        "Comprehensive digital report",
        "Battery health score",
        "Expert recommendations",
        "Follow-up support included"
      ]
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
            src="https://images.unsplash.com/photo-1666612509439-86c532fd2245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGJhdHRlcnklMjBjbG9zZXVwfGVufDF8fHx8MTc2NDExODMyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="EV battery diagnostic"
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
              How It Works
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Getting your EV health check is simple, transparent, and convenient
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Four simple steps
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              From booking to receiving your comprehensive report
            </p>
          </motion.div>

          <div className="space-y-32">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Content */}
                  <div className={`space-y-8 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="inline-flex items-center gap-4">
                      <motion.div
                        className="w-20 h-20 rounded-2xl bg-[var(--brand-light-gray)]/30 flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className="w-10 h-10 text-[var(--brand-primary)]" />
                      </motion.div>
                      <span className="text-7xl font-extralight text-zinc-200">{step.number}</span>
                    </div>

                    <div>
                      <h3 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-xl text-zinc-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <ul className="space-y-4">
                      {step.details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                          <span className="text-zinc-700">{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <motion.div
                    className={`relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl ${isEven ? 'md:order-2' : 'md:order-1'}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-[var(--brand-light-gray)]/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {index === 3 ? (
                         <div className="w-full h-full p-8 flex items-center justify-center">
                            <ReportPreview className="w-full max-w-sm shadow-2xl scale-90" />
                         </div>
                      ) : (
                        <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-[var(--brand-primary)] to-[#2030cc] flex items-center justify-center shadow-2xl">
                          <Icon className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Locations */}
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
              Where we can help
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Flexible service options to fit your schedule
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: MapPin,
                title: "Your Home",
                desc: "Most convenient option—our mobile unit comes to your driveway with all professional equipment."
              },
              {
                icon: MapPin,
                title: "Your Workplace",
                desc: "Schedule during work hours and we'll come to your office car park—no time off needed."
              },
              {
                icon: MapPin,
                title: "Our Diagnostic Centre",
                desc: "Visit our fully equipped facility for the ultimate diagnostic experience with real-time insights."
              }
            ].map((location, index) => {
              const Icon = location.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-[2rem] p-10 text-center space-y-6"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-light-gray)]/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-8 h-8 text-[var(--brand-primary)]" />
                  </motion.div>
                  <h3 className="text-2xl">{location.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{location.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              className="relative h-[600px] rounded-[2rem] overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1564912139097-6e35a037c77f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjB0ZWNobmljaWFuJTIwZGlhZ25vc3RpY3xlbnwxfHx8fDE3NjQxMTgzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="EV diagnostic in progress"
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
              <div>
                <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
                  What to expect during your check
                </h2>
                <p className="text-xl text-zinc-600 leading-relaxed">
                  Our professional, transparent approach means you're informed every step of the way.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  "Friendly introduction and initial vehicle inspection",
                  "Connection of professional diagnostic equipment",
                  "Live battery health and system diagnostics",
                  "Visual inspection of EV components",
                  "Questions and concerns addressed",
                  "Summary of findings before we leave"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[#2030cc] flex items-center justify-center text-white text-sm">
                      {index + 1}
                    </div>
                    <p className="text-zinc-700 pt-1">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Common questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "How long does an EV health check take?",
                a: "Our Essential check takes 45 minutes, Comprehensive takes 90 minutes, and Pre-Purchase inspection takes 2 hours."
              },
              {
                q: "Do I need to be present during the check?",
                a: "We recommend being present so we can discuss findings and answer questions, but it's not required. We'll provide a detailed report either way."
              },
              {
                q: "What equipment do you use?",
                a: "We use professional-grade OBD2 diagnostic tools, battery analyzers, and manufacturer-specific diagnostic software for accurate results."
              },
              {
                q: "When will I receive my report?",
                a: "Digital reports are delivered within 24 hours of your check, often sooner. You'll receive an email with a secure link to view and download."
              },
              {
                q: "Is the mobile service the same quality?",
                a: "Yes! Our mobile units carry the same professional equipment as our diagnostic centre, ensuring identical service quality."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-zinc-200"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  className="w-full flex items-center justify-between p-8 text-left hover:bg-zinc-50 transition-colors"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                >
                  <h3 className="text-xl pr-8">{faq.q}</h3>
                  <motion.div
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-zinc-500 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-8 pb-8 text-zinc-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
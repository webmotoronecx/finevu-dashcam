"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { CheckCircle, Clock, MapPin, FileText } from 'lucide-react';
import Link from "next/link";
import { ScrollProgress } from '@/components/ScrollProgress';
import { TiltCard } from '@/components/TiltCard';
import { ParallaxImage } from '@/components/ParallaxImage';
import { ServiceCard } from '@/components/ServiceCard';

import { ReportPreview } from '@/components/ReportPreview';

export default function Page() {
  const services = [
    {
      name: "Essential Battery Health Check",
      price: "$199",
      duration: "45 minutes",
      features: [
        "High-voltage (HV) battery evaluation",
        "State of Health (SOH) measurement",
        "Basic diagnostic interrogation",
        "Digital health report",
        "Mobile service available"
      ],
      recommended: false
    },
    {
      name: "Comprehensive EV Assessment",
      price: "$299",
      duration: "90 minutes",
      features: [
        "Full EV Inspection & Battery Health Assessment",
        "Diagnostic interrogation of all control modules",
        "Physical inspection of EV-specific components",
        "Safety and tampering assessment",
        "OEM-level scan tool analysis",
        "Detailed documentation & reporting",
        "Expert consultation included"
      ],
      recommended: true
    },
    {
      name: "Pre-Purchase Inspection",
      price: "$399",
      duration: "2 hours",
      features: [
        "Everything in Comprehensive Assessment",
        "Complete vehicle history analysis",
        "Market value assessment",
        "Future degradation projection",
        "Warranty status verification",
        "Non-invasive testing (warranty safe)",
        "48-hour turnaround guarantee"
      ],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden" data-nav-theme="dark">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <ImageWithFallback
            src="/assets/16287cb76b4c4efad14b989be12db54a5edea747.png"
            alt="EV diagnostic service"
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
              EV Health Check Services
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Choose the perfect health check package for your electric vehicle
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-tight">
              Choose Your Package
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              From quick battery checks to comprehensive pre-purchase inspections
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {services.map((service, index) => (
              <ServiceCard 
                key={index}
                {...service}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* The Report Section */}
      <section className="py-24 bg-zinc-900 text-white overflow-hidden" data-nav-theme="dark">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
                Data you can trust.
                <br />
                <span className="text-[var(--brand-primary)] font-medium">Verified.</span>
              </h2>
              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                Every service includes a detailed digital report. We don't just guess; we interrogate the battery management system to extract the truth about your vehicle's health.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Official State of Health (SOH) percentage",
                  "Cell voltage variance and balance check",
                  "Internal resistance measurements",
                  "Thermal management system performance",
                  "Charge cycle count and history"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                 <Link href="/booking">
                  <button className="px-8 py-3 rounded-full bg-[var(--brand-primary)] text-white font-medium hover:scale-105 transition-transform w-full sm:w-auto text-center">
                    Get Your Report
                  </button>
                 </Link>
                 <button className="px-8 py-3 rounded-full border border-zinc-700 text-white hover:bg-white/10 hover:scale-105 transition-all w-full sm:w-auto text-center flex items-center justify-center gap-2 font-medium">
                   View Sample <FileText className="w-4 h-4" />
                 </button>
              </div>
            </motion.div>

            {/* Report Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-primary)]/30 to-purple-500/30 rounded-full blur-[100px] -z-10" />
              <TiltCard>
                <ReportPreview className="w-full max-w-md mx-auto shadow-2xl rotate-[2deg] hover:rotate-0 transition-transform duration-500" />
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included Details */}
      <section className="py-32 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-tight">
              What's Included in Every Check
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Professional diagnostics and transparent reporting as standard
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                icon: FileText,
                title: "Standardized Reporting",
                desc: "Documentation that ensures consistency, reproducibility, and technical accuracy"
              },
              {
                icon: MapPin,
                title: "Mobile Service",
                desc: "We come to your home, office, or you can visit our diagnostic centre"
              },
              {
                icon: CheckCircle,
                title: "Certified Inspectors",
                desc: "HV safety certified technicians with diagnostic tool competency"
              },
              {
                icon: Clock,
                title: "Warranty Safe",
                desc: "Non-invasive testing that does not void manufacturer warranties"
              }
            ].map((item, index) => {
              const Icon = item.icon;
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
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-light-gray)]/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-8 h-8 text-[var(--brand-primary)]" />
                  </motion.div>
                  <h3 className="text-2xl">{item.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How Mobile Service Works */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-tight">
                  Mobile service at your convenience
                </h2>
                <p className="text-lg text-zinc-600 leading-relaxed">
                  Our fully equipped mobile units bring the diagnostic centre to you.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  "Book online or call our team",
                  "Choose your preferred time and location",
                  "Our technician arrives with professional equipment",
                  "Receive your report within 24 hours"
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[#2030cc] flex items-center justify-center text-white font-mono">
                      {index + 1}
                    </div>
                    <p className="text-lg text-zinc-700 pt-0.5">{step}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="px-8 py-4 rounded-full bg-[var(--brand-primary)] text-white smooth-transition electric-glow font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Mobile Service
              </motion.button>
            </motion.div>

            <motion.div
              className="relative h-[600px] rounded-[2rem] overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1596495717678-69df9f89c2a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc2hvcCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY0MTE4MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Mobile EV service"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              Not sure which service is right for you?
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Our team can help you choose the perfect health check for your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/how-it-works">
                <motion.button
                  className="px-6 py-2.5 rounded-full bg-[var(--brand-primary)] text-white smooth-transition electric-glow font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  How It Works
                </motion.button>
              </Link>
              <motion.button
                className="px-6 py-2.5 rounded-full border border-zinc-300 smooth-transition font-medium"
                whileHover={{ borderColor: "var(--brand-primary)", color: "var(--brand-primary)", scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Example Report
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
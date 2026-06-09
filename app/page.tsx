"use client";

import { Footer } from '@/components/Footer';
import { ProblemCard } from '@/components/ProblemCard';
import { EditorialCard } from '@/components/EditorialCard';
import { ReviewCard } from '@/components/ReviewCard';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { CheckCircle, ShieldCheck, Users, Award, ChevronRight, ArrowUpRight, ArrowRight, Zap, Battery, CarFront } from 'lucide-react';
import { motion} from 'motion/react';
import { useState} from 'react';
import Link from "next/link";
import { ScrollProgress } from '@/components/ScrollProgress';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { MagneticButton } from '@/components/MagneticButton';
import { ParallaxImage } from '@/components/ParallaxImage';
import { TiltCard } from '@/components/TiltCard';
import { TextReveal, LineReveal } from '@/components/TextReveal';
import { ParticleBackground } from '@/components/GridBackground';
import { BrandMarquee } from '@/components/BrandMarquee';
import { Hero } from '@/components/Hero';
const technicianImage = '/assets/1b2b252267a47a3c99ef04d3de02f27d219c9150.png';
const mobileVanImage = '/assets/211ec73fe84f24f3614d7848ac8db046247d62f7.png';
const batteryValueImage = '/assets/22eb057b3bbdadb4a8847fef1f98c5cd56dd25b2.png';
const reportImage = '/assets/f82e310949ec251e9d18c8d2dff33e9d24a0cc54.png';

import { ReportPreview } from '@/components/ReportPreview';

export default function Page() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeProblem, setActiveProblem] = useState(0);

  const problemCards = [
    {
      image: "https://images.unsplash.com/photo-1664013885879-42498caa2068?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBidXlpbmclMjB0ZXNsYSUyMGRlYWxlcnNoaXB8ZW58MXx8fHwxNzY0MTYyNjMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Buying an EV?",
      solutionTitle: "Pre-Purchase Verification",
      description: "Make a confident investment. Our comprehensive battery report reveals the true condition, remaining capacity, and any hidden faults of any electric vehicle before you commit.",
      link: "/buying"
    },
    {
      image: reportImage,
      title: "Selling your EV?",
      solutionTitle: "Certified Health Report",
      description: "Command a higher resale price. An independent EV360 certificate proves your battery's health to potential buyers, differentiating your vehicle from the rest of the market.",
      link: "/selling"
    },
    {
      image: "https://images.unsplash.com/photo-1610356992334-183d6b7b2acb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXNsYSUyMHNjcmVlbiUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NjQxMjc0MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Range dropping?",
      solutionTitle: "True Capacity Analysis",
      description: "Get clarity on your battery's real capacity. If you're noticing you can't go as far as you used to, our detailed health assessment will pinpoint if it's normal degradation or a cell defect."
    },
    {
      image: "https://images.unsplash.com/photo-1670813007457-5e12ba8cf03f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaXR5fGVufDF8fHx8MTc2NDA2ODY3MXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Warranty ending?",
      solutionTitle: "End-of-Warranty Audit",
      description: "Don't get caught out. Document your EV's health before your manufacturer warranty expires to ensure you have the evidence needed for any potential battery replacement claims."
    },
    {
      image: "https://images.unsplash.com/photo-1694479452720-782feb4d488b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2Mzk2OTQ1NXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Charging issues?",
      solutionTitle: "BMS & Charging Diagnostics",
      description: "Identify the root cause. Whether it's slow charging, interrupted sessions, or overheating, our diagnostic testing analyzes the BMS data to find performance bottlenecks."
    }
  ];

  const educationCards = [
    {
      image: "https://images.unsplash.com/photo-1692052664566-477579a08e8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBkcml2ZXdheSUyMGhvbWV8ZW58MXx8fHwxNzY0MDY4NjY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "What State of Health (SOH) Means",
      description: "Understanding battery SOH is crucial for knowing your EV's true condition and remaining value."
    },
    {
      image: batteryValueImage,
      title: "How Battery Health Affects EV Value",
      description: "Learn why battery health is the single most important factor in determining an electric vehicle's resale value."
    },
    {
      image: "https://images.unsplash.com/photo-1738101001619-f0fd42ceafb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBvZmZpY2UlMjBwYXJraW5nfGVufDF8fHx8MTc2NDA2ODY2OXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "EV Battery Myths (Debunked)",
      description: "Separating fact from fiction when it comes to electric vehicle battery degradation and longevity."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />
      <Hero />

      {/* Content Wrapper - scrolls over hero */}
      <div className="relative z-10 bg-white">

      {/* Core Solutions - Precision Grid */}
      <section className="py-24 bg-[#080808] relative overflow-hidden" data-nav-theme="dark">
        {/* Cinematic Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[var(--brand-primary)]/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
          
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight mb-2">
                Select your path.
              </h2>
              <p className="text-zinc-500 text-lg">
                Specialized diagnostic workflows for every stage of ownership.
              </p>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="hidden md:flex gap-2"
            >
              <span className="px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-zinc-400 uppercase tracking-widest bg-white/5">
                Verified
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-zinc-400 uppercase tracking-widest bg-white/5">
                Independent
              </span>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            
            {/* Buying (Major Feature) */}
            <motion.div 
              className="md:col-span-7 relative group rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900/50 hover:border-[var(--brand-primary)]/50 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/buying" className="block h-full w-full">
                <div className="absolute inset-0">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop"
                    alt="Buying an EV"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                </div>
                
                <div className="relative h-full p-8 md:p-12 flex flex-col justify-between z-20">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                      <CarFront className="w-6 h-6 text-[#334AFF]" />
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/20 border border-[var(--brand-primary)]/30 backdrop-blur-md">
                      <span className="text-[var(--brand-primary)] text-xs font-bold uppercase tracking-wider">For Buyers</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl md:text-5xl font-light text-white mb-4">
                      Pre-Purchase<br/>Verification
                    </h3>
                    <p className="text-zinc-300 text-lg max-w-md mb-8 border-l border-white/20 pl-4">
                      Don't inherit someone else's battery problem. Get a 360° health check before you sign.
                    </p>
                    <div className="flex items-center gap-3 text-white group-hover:text-[var(--brand-primary)] transition-colors">
                      <span className="text-sm font-medium uppercase tracking-widest">Start Assessment</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Selling & Diagnostics Column */}
            <div className="md:col-span-5 flex flex-col gap-6 h-full">
              
              {/* Selling (Medium) */}
              <motion.div 
                className="flex-1 relative group rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900/50 hover:border-[var(--brand-primary)]/50 transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link href="/selling" className="block h-full w-full">
                  <div className="absolute inset-0">
                    <ImageWithFallback 
                      src={reportImage}
                      alt="Selling an EV"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-50 group-hover:opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>
                  
                  <div className="relative h-full p-8 flex flex-col justify-between z-20">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <Award className="w-5 h-5 text-[#334AFF]" />
                      </div>
                      <span className="text-white/60 text-xs font-mono uppercase tracking-widest">For Sellers</span>
                    </div>

                    <div>
                      <h3 className="text-2xl md:text-3xl font-light text-white mb-2">
                        Certified Health Report
                      </h3>
                      <p className="text-zinc-400 text-sm mb-4">
                        Prove your battery's value. Command a higher price.
                      </p>
                      <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Diagnostics Grid (2 Small) */}
              <div className="h-[200px] grid grid-cols-2 gap-6">
                
                {/* Range */}
                <motion.div 
                  className="relative group rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 hover:bg-zinc-800 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Link href="/diagnostics" className="block h-full w-full p-6 flex flex-col justify-between">
                    <Battery className="w-8 h-8 text-[#334AFF]" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Range Analysis</h4>
                      <p className="text-zinc-500 text-xs">True capacity check</p>
                    </div>
                  </Link>
                </motion.div>

                {/* Warranty */}
                <motion.div 
                  className="relative group rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 hover:bg-zinc-800 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Link href="/diagnostics" className="block h-full w-full p-6 flex flex-col justify-between">
                    <ShieldCheck className="w-8 h-8 text-[#334AFF]" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Warranty Audit</h4>
                      <p className="text-zinc-500 text-xs">Before it expires</p>
                    </div>
                  </Link>
                </motion.div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* The Solution - The Report */}
      <section className="py-24 bg-zinc-50 overflow-hidden" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: The Report Visual */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-primary)]/10 to-purple-500/10 rounded-full blur-[100px] -z-10" />
              <TiltCard>
                <ReportPreview className="w-full max-w-md mx-auto shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500" />
              </TiltCard>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight text-zinc-900">
                The <span className="text-[var(--brand-primary)] font-medium">EV360 Certificate</span>.
                <br />
                Your battery's true value, verified.
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                Don't rely on dashboard estimates. Our comprehensive, independent report proves your vehicle's health with data extracted directly from the Battery Management System (BMS).
              </p>

              <div className="space-y-6 mb-10">
                {[
                  {
                    title: "For Sellers",
                    desc: "Prove your battery health to command a higher resale price.",
                    icon: <Award className="w-5 h-5 text-[var(--brand-primary)]" />
                  },
                  {
                    title: "For Buyers",
                    desc: "Avoid the $15,000 risk of buying an EV with a degraded battery.",
                    icon: <ShieldCheck className="w-5 h-5 text-[#334AFF]" />
                  },
                  {
                    title: "For Owners",
                    desc: "Track degradation over time and catch warranty issues early.",
                    icon: <CheckCircle className="w-5 h-5 text-[#334AFF]" />
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 p-2 rounded-2xl bg-white border border-zinc-200 shadow-sm shrink-0 h-fit text-[#334AFF]">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 mb-1">{item.title}</h3>
                      <p className="text-zinc-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/booking">
                <button className="px-8 py-3 rounded-full bg-[#334AFF] text-white hover:scale-105 transition-transform flex items-center font-medium">
                  Get Your Report
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="relative py-32 bg-black overflow-hidden" data-nav-theme="dark">
        <ParticleBackground />
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
              Trusted by EV owners across Australia
            </h2>
            <p className="text-lg text-zinc-400">
              Real reviews from real customers
            </p>
          </motion.div>

          {/* Trust Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-8 mb-20 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-light text-white mb-2 font-mono">
                <AnimatedCounter end={5.0} duration={2} decimals={1} />
              </div>
              <p className="text-zinc-400 font-mono text-sm uppercase tracking-wider">Star Rating</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-light text-white mb-2 font-mono">
                <AnimatedCounter end={53} duration={2} />
              </div>
              <p className="text-zinc-400 text-sm font-mono uppercase tracking-wider">Google Reviews</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-light text-white mb-2 font-mono">
                <AnimatedCounter end={100} duration={2} suffix="%" />
              </div>
              <p className="text-zinc-400 font-mono text-sm uppercase tracking-wider">5-Star Reviews</p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                location: "Sydney, NSW",
                vehicle: "Tesla Model 3",
                review: "The pre-purchase inspection gave me complete confidence in buying my used EV. The detailed battery report was invaluable during negotiations.",
                rating: 5,
                image: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDA1NjU5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                verified: true
              },
              {
                name: "Michael Roberts",
                location: "Melbourne, VIC",
                vehicle: "Hyundai Ioniq 5",
                review: "Mobile service was incredibly convenient. The technician was professional and explained everything clearly. Highly recommend!",
                rating: 5,
                image: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjQwMTQyNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                verified: true
              },
              {
                name: "Emma Thompson",
                location: "Brisbane, QLD",
                vehicle: "Nissan Leaf",
                review: "After noticing reduced range, the comprehensive check identified the issue and gave me peace of mind about my battery's health.",
                rating: 5,
                image: "https://images.unsplash.com/photo-1754298949882-216a1c92dbb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MDI4MDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                verified: true
              }
            ].map((testimonial, index) => (
              <ReviewCard
                key={index}
                {...testimonial}
                delay={index * 0.2}
              />
            ))}
          </div>

          {/* Bottom Trust Bar */}
          <motion.div 
            className="mt-16 pt-16 border-t border-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[var(--brand-primary)]" />
                <span className="text-white/80 font-mono text-sm uppercase tracking-wider">Google verified reviews</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-[#334AFF]" />
                <span className="text-white/80 font-mono text-sm uppercase tracking-wider">Industry certified technicians</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-[var(--brand-primary)]" />
                <span className="text-white/80 font-mono text-sm uppercase tracking-wider">5.0 star rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="py-32 bg-zinc-950" data-nav-theme="dark">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div 
            className="text-center mb-20 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-light mb-8 tracking-tight text-white">
              Trust built on transparency.
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Every 360° battery check covers all critical health indicators, from cell voltage balance to thermal performance, giving you a complete picture of your EV's condition.
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Large Feature Card - Technician at Work */}
            <motion.div
              className="md:col-span-2 lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-[2rem] group min-h-[400px] lg:min-h-[600px] border border-white/5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <TiltCard className="h-full">
                <div className="relative h-full overflow-hidden rounded-[2rem]">
                  <ImageWithFallback
                    src={technicianImage}
                    alt="EV technician performing diagnostic"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-10">
                    <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full bg-[#334AFF]">
                      <Award className="w-4 h-4 text-white" />
                      <span className="text-xs text-white uppercase tracking-wider font-mono">Certified Expertise</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-light text-white mb-3">
                      Trained EV specialists
                    </h3>
                    <p className="text-zinc-300 leading-relaxed max-w-md">
                      Our certified technicians bring deep expertise in EV battery systems and diagnostics.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Stat Card - EVs Inspected */}
            <motion.div
              className="relative overflow-hidden rounded-[2rem] min-h-[280px] border border-white/5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <TiltCard className="h-full">
                <div 
                  className="h-full rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden bg-zinc-900/50 backdrop-blur-sm"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-primary)]/10 rounded-full blur-3xl mix-blend-screen" />
                  <div className="relative z-10">
                    <div className="text-5xl md:text-6xl text-white mb-2 font-mono tracking-tighter">
                      <AnimatedCounter end={500} duration={2.5} suffix="+" />
                    </div>
                    <p className="text-zinc-500 text-sm font-mono uppercase tracking-wider">EVs inspected across Australia</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Diagnostic Tools Card */}
            <motion.div
              className="relative overflow-hidden rounded-[2rem] min-h-[280px] border border-white/5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TiltCard className="h-full">
                <div 
                  className="h-full rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden bg-zinc-900/50 backdrop-blur-sm"
                >
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[var(--brand-primary)]/20 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <ShieldCheck className="w-12 h-12 text-white mb-6" />
                    <h3 className="text-2xl text-white mb-2 font-light">Professional tools</h3>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Industry-leading diagnostic equipment</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Transparency Card - Charging Detail */}
            <motion.div
              className="md:col-span-2 lg:col-span-1 relative overflow-hidden rounded-[2rem] group min-h-[320px] border border-white/5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TiltCard className="h-full">
                <div className="relative h-full overflow-hidden rounded-[2rem]">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1596731498067-99aeb581d3d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nJTIwY2xvc2V1cHxlbnwxfHx8fDE3NjQxNjExMzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="EV charging port detail"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-10">
                    <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full bg-[#334AFF]">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span className="text-xs text-white uppercase tracking-wider font-mono">100% transparent</span>
                    </div>
                    <h3 className="text-2xl text-white mb-3 font-light">
                      Clear, honest reporting
                    </h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      No hidden details or conflicts of interest. Just data you can trust.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Mobile Service Card */}
            <motion.div
              className="relative overflow-hidden rounded-[2rem] group min-h-[320px] border border-white/5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <TiltCard className="h-full">
                <div className="relative h-full overflow-hidden rounded-[2rem]">
                  <ImageWithFallback
                    src={mobileVanImage}
                    alt="Mobile service van"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-10">
                    <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full bg-[#334AFF]">
                      <Users className="w-4 h-4 text-white" />
                      <span className="text-xs text-white uppercase tracking-wider font-mono">Convenience</span>
                    </div>
                    <h3 className="text-2xl text-white mb-3 font-light">We come to you</h3>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Customer Satisfaction Card */}
            <motion.div
              className="relative overflow-hidden rounded-[2rem] min-h-[280px] border border-white/5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <TiltCard className="h-full">
                <div 
                  className="h-full rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden bg-zinc-900/50 backdrop-blur-sm"
                >
                  <div className="absolute -top-8 -left-8 w-48 h-48 bg-[var(--brand-primary)]/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <div className="text-5xl md:text-6xl text-white mb-2 font-mono tracking-tighter">
                      <AnimatedCounter end={100} duration={2.5} suffix="%" />
                    </div>
                    <p className="text-zinc-500 text-sm font-mono uppercase tracking-wider">Customer satisfaction rate</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Industry Solutions Section */}
      <section className="relative py-32 bg-black overflow-hidden" data-nav-theme="dark">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand-primary)]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div 
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-2xl">
              <span className="text-[var(--brand-primary)] font-mono text-sm uppercase tracking-wider mb-2 block">Enterprise</span>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
                Business Solutions
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed max-w-xl">
                Scale your EV operations with Australia's leading battery intelligence platform. Tailored solutions for high-volume needs.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                title: "Dealerships", 
                desc: "Certified Pre-Owned programs that build trust and turn inventory faster.", 
                link: "/dealerships", 
                icon: Award
              },
              { 
                title: "Fleet Managers", 
                desc: "Maximize residual values and minimize downtime with lifecycle battery tracking.", 
                link: "/fleet", 
                icon: Users
              },
              { 
                title: "Insurers", 
                desc: "Data-driven risk assessment and claims verification for electric vehicles.", 
                link: "/insurance", 
                icon: ShieldCheck
              },
              { 
                title: "Strata & Property", 
                desc: "Mitigate fire risk and ensure safety compliance for basement charging.", 
                link: "/property", 
                icon: CheckCircle
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={index} href={item.link} className="block group">
                  <TiltCard className="h-full" tiltStrength={5}>
                    <div className="h-full bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-[var(--brand-primary)]/50 transition-all duration-500 relative overflow-hidden group-hover:bg-zinc-900/80">
                      {/* Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-8">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[var(--brand-primary)]/20 group-hover:border-[var(--brand-primary)]/30 transition-all duration-500">
                            <Icon className="w-7 h-7 text-[#334AFF]" />
                          </div>
                          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-all duration-300">
                            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-light text-white mb-3 group-hover:text-[var(--brand-primary)] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* EV Education Hub Preview */}
      <section className="py-32 bg-zinc-50 border-t border-zinc-200" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div 
            className="mb-20 flex justify-between items-end"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight text-zinc-900">
                EV Education Hub
              </h2>
              <p className="text-lg text-zinc-600 max-w-2xl">
                Learn everything you need to know about EV battery health and ownership.
              </p>
            </div>
            <Link href="/learn">
              <motion.button
                className="hidden md:block px-6 py-3 rounded-full border border-zinc-300 text-zinc-900 hover:bg-black hover:text-white transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                View All Articles
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {educationCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="h-full"
              >
                <TiltCard className="group cursor-pointer smooth-transition h-full" tiltStrength={8}>
                  <div className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden h-full flex flex-col p-6 hover:shadow-xl transition-all duration-500 hover:border-[var(--brand-primary)]/30">
                    {/* Image Container */}
                    <motion.div 
                      className="relative overflow-hidden rounded-2xl mb-6 h-[220px] w-full"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full"
                      >
                        <ImageWithFallback
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </motion.div>

                    {/* Content */}
                    <div className="space-y-4 flex flex-col flex-grow">
                      <h3 className="text-2xl font-light text-zinc-900 group-hover:text-[var(--brand-primary)] smooth-transition leading-tight">{card.title}</h3>
                      <p className="text-zinc-600 leading-relaxed text-sm flex-grow">{card.description}</p>
                      <motion.div 
                        className="flex items-center gap-2 text-[var(--brand-primary)] pt-4 border-t border-zinc-100 mt-auto"
                        initial={{ opacity: 0.8, x: 0 }}
                        whileHover={{ opacity: 1, x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-xs font-mono uppercase tracking-widest">Read Article</span>
                        <ArrowRight className="w-3 h-3" />
                      </motion.div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      </div>
      {/* End Content Wrapper */}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
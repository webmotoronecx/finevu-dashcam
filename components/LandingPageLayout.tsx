"use client";

import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import Link from "next/link";
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ReportPreview } from '@/components/ReportPreview';
import { TiltCard } from '@/components/TiltCard';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface LandingPageProps {
  title: string;
  subtitle: string;
  heroImage: string;
  audience: string;
  benefits: {
    title: string;
    description: string;
    icon: React.ElementType;
  }[];
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  faq?: { q: string; a: string }[];
  content?: React.ReactNode;
  form?: React.ReactNode;
}

export function LandingPageLayout({
  title,
  subtitle,
  heroImage,
  audience,
  benefits,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  faq,
  content,
  form
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-black overflow-hidden" data-nav-theme="dark">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--brand-primary)]/10 rounded-full blur-[120px] mix-blend-screen translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--brand-primary)]/5 rounded-full blur-[100px] mix-blend-screen -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm font-mono uppercase tracking-wider text-[var(--brand-primary)] mb-6">
                For {audience}
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.1] mb-6">
                {title}
              </h1>
              <p className="text-xl text-zinc-400 max-w-xl leading-relaxed mb-10">
                {subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* If form is present, scroll to it. Else link to ctaLink */}
                {form ? (
                   <button 
                    onClick={() => document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 rounded-full bg-[var(--brand-primary)] text-white font-medium hover:scale-105 transition-transform w-full sm:w-auto flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    {ctaText} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <Link href={ctaLink}>
                    <motion.button 
                      className="px-8 py-4 rounded-full bg-[var(--brand-primary)] text-white font-medium hover:scale-105 transition-transform w-full sm:w-auto flex items-center justify-center gap-2 group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {ctaText} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                )}
                
                {secondaryCtaText && secondaryCtaLink && (
                  <Link href={secondaryCtaLink}>
                    <motion.button 
                      className="px-8 py-4 rounded-full border border-zinc-700 text-white hover:bg-white/10 transition-colors w-full sm:w-auto font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {secondaryCtaText}
                    </motion.button>
                  </Link>
                )}
              </div>
            </motion.div>

            <motion.div
              className="relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ImageWithFallback
                src={heroImage}
                alt={`${audience} hero image`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div 
            className="grid md:grid-cols-3 gap-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-zinc-900" />
                  </div>
                  <h3 className="text-2xl font-light">{benefit.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Feature Content (Optional) */}
      {content && (
        <section className="py-24 bg-zinc-50" data-nav-theme="light">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
            {content}
          </div>
        </section>
      )}

      {/* Form Section OR The Solution/Report Preview */}
      {form ? (
        <section className="py-24 bg-white" data-nav-theme="light">
          <div className="max-w-[1000px] mx-auto px-8 lg:px-16">
            {form}
          </div>
        </section>
      ) : (
        <section className="py-24 bg-zinc-900 overflow-hidden" data-nav-theme="dark">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight leading-tight">
                  The Proof You Need.
                </h2>
                <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                  Our independent EV360 Certificate provides the data-backed assurance required for high-value transactions, insurance policies, and fleet management decisions.
                </p>
                <Link href={ctaLink}>
                  <button className="px-8 py-3 rounded-full bg-white text-zinc-900 font-medium hover:bg-zinc-200 transition-colors">
                    {ctaText}
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-primary)]/20 to-purple-500/10 rounded-full blur-[100px] -z-10" />
                <TiltCard>
                  <ReportPreview className="w-full max-w-md mx-auto shadow-2xl rotate-[2deg] hover:rotate-0 transition-transform duration-500" />
                </TiltCard>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Quote, Play, CheckCircle, TrendingUp, Shield, DollarSign } from 'lucide-react';
import { ScrollProgress } from '@/components/ScrollProgress';
import Link from "next/link";

export default function Page() {
  const featuredStories = [
    {
      name: "Sarah & James Chen",
      location: "Melbourne, VIC",
      vehicle: "2021 Tesla Model 3",
      story: "Pre-Purchase Peace of Mind",
      quote: "We were about to spend $45,000 on a used Model 3. EV360's inspection revealed the battery had degraded to 82% health - way below what the seller claimed. They saved us from a costly mistake and helped us negotiate $8,000 off the price.",
      image: "https://images.unsplash.com/photo-1536048284960-eb628c365abb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWFuJTIwZmFtaWx5JTIwY2FyfGVufDF8fHx8MTc2NDEzMDk3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      savings: "$8,000",
      service: "Pre-Purchase Inspection",
      instagramReel: null // Placeholder for future Instagram embed
    },
    {
      name: "Marcus Thompson",
      location: "Brisbane, QLD",
      vehicle: "2020 Nissan Leaf",
      story: "Warranty Claim Success",
      quote: "My Leaf was losing range fast but the dealer kept saying it was 'normal'. EV360's diagnostic report showed 76% battery health, which qualified me for a warranty replacement. The detailed report gave me the evidence I needed.",
      image: "https://images.unsplash.com/photo-1705850239069-b6fb8bb7c479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMG93bmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTMwOTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      savings: "$22,000",
      service: "Full Diagnostic Report",
      instagramReel: null
    },
    {
      name: "Emily Rodriguez",
      location: "Sydney, NSW",
      vehicle: "2022 Hyundai Ioniq 5",
      story: "First-Time EV Buyer Confidence",
      quote: "As a first-time EV buyer, I had so many questions. The team at EV360 not only checked my car thoroughly but educated me on what to look for in battery health. Now I feel confident about my purchase and know exactly how to maintain it.",
      image: "https://images.unsplash.com/photo-1603714228681-b399854b8f80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwc21pbGluZ3xlbnwxfHx8fDE3NjQwOTk1MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      savings: "Peace of Mind",
      service: "Battery Health Check",
      instagramReel: null
    }
  ];

  const quickWins = [
    {
      icon: DollarSign,
      stat: "$8,000",
      label: "Average savings on pre-purchase inspections",
      description: "Customers who discovered issues before buying"
    },
    {
      icon: Shield,
      stat: "94%",
      label: "Warranty claim success rate",
      description: "With our detailed diagnostic reports"
    },
    {
      icon: CheckCircle,
      stat: "2,500+",
      label: "EVs inspected",
      description: "Across Australia in the past year"
    },
    {
      icon: TrendingUp,
      stat: "4.9/5",
      label: "Customer satisfaction",
      description: "Based on 850+ verified reviews"
    }
  ];

  const caseStudies = [
    {
      title: "The $45K Decision",
      customer: "David M., Sydney",
      challenge: "Considering a used Tesla Model S advertised at $45,000 with 'excellent battery health'",
      solution: "Comprehensive pre-purchase inspection revealed battery degradation at 79% and cooling system issues",
      outcome: "David negotiated a $10,000 price reduction and budgeted for future repairs, making an informed purchase",
      tags: ["Pre-Purchase", "Tesla", "Negotiation"]
    },
    {
      title: "Warranty Victory",
      customer: "Lisa K., Melbourne",
      challenge: "Dealer denied warranty claim on 2019 Nissan Leaf despite significant range loss",
      solution: "EV360's detailed diagnostic report showed battery health at 74%, below manufacturer warranty threshold",
      outcome: "Dealer approved warranty replacement valued at $18,000 after reviewing our report",
      tags: ["Warranty", "Nissan", "Battery Replacement"]
    },
    {
      title: "Fleet Management Success",
      customer: "GreenFleet Logistics, Brisbane",
      challenge: "Managing 15 EV delivery vans with inconsistent performance and rising maintenance costs",
      solution: "Quarterly battery health monitoring and preventive maintenance scheduling",
      outcome: "23% reduction in unexpected downtime and extended vehicle lifespan by 2+ years",
      tags: ["Fleet", "Commercial", "Preventive Maintenance"]
    },
    {
      title: "First-Time EV Confidence",
      customer: "Rachel & Tom S., Perth",
      challenge: "Overwhelmed by EV options and concerned about battery longevity",
      solution: "Education session plus inspection of shortlisted vehicles before purchase",
      outcome: "Made confident purchase decision and received ongoing battery care guidance",
      tags: ["First-Time Buyer", "Education", "Multiple Vehicles"]
    }
  ];

  const commonReasons = [
    {
      reason: "Pre-Purchase Inspection",
      percentage: "47%",
      description: "Buyers wanting to verify battery health before committing to a used EV purchase"
    },
    {
      reason: "Warranty Claims",
      percentage: "28%",
      description: "Owners seeking detailed reports to support warranty or goodwill claims"
    },
    {
      reason: "Peace of Mind",
      percentage: "15%",
      description: "Current owners wanting to understand their EV's current condition"
    },
    {
      reason: "Selling Preparation",
      percentage: "10%",
      description: "Sellers wanting certification to increase buyer confidence and value"
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
            src="https://images.unsplash.com/photo-1695668543969-ea7dec95047c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHRlc3RpbW9uaWFsJTIwaW50ZXJ2aWV3fGVufDF8fHx8MTc2NDEzMDk3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Customer stories"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </motion.div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-[1.1]">
              Real Stories,<br />Real Results
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Hear from EV owners who made informed decisions with EV360
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              Impact by the Numbers
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              The measurable difference we've made for Australian EV owners
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickWins.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="p-8 rounded-2xl border border-zinc-200 smooth-transition hover:border-[var(--electric-green)] hover:shadow-lg text-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--electric-green)]/10 to-[var(--electric-blue)]/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-7 h-7 text-[var(--electric-green)]" />
                  </div>
                  <div className="text-4xl md:text-5xl font-light text-zinc-900 mb-3">
                    {item.stat}
                  </div>
                  <div className="text-lg text-zinc-900 mb-2">{item.label}</div>
                  <div className="text-sm text-zinc-500">{item.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Customer Stories */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              Featured Stories
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              In-depth interviews with customers who trusted EV360
            </p>
          </motion.div>

          <div className="space-y-16">
            {featuredStories.map((story, index) => (
              <motion.div
                key={index}
                className="grid lg:grid-cols-2 gap-12 items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                {/* Image or Video placeholder */}
                <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                    <ImageWithFallback
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                    {story.instagramReel && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <motion.button
                          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play className="w-8 h-8 text-white ml-1" />
                        </motion.button>
                      </div>
                    )}
                    <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                      <span className="text-white text-sm">{story.service}</span>
                    </div>
                  </div>
                </div>

                <div className={`space-y-6 order-1 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-light tracking-tight mb-2">
                      {story.story}
                    </h3>
                    <p className="text-zinc-600">
                      {story.name} • {story.location}
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">{story.vehicle}</p>
                  </div>

                  <div className="relative pl-6 border-l-4 border-[var(--electric-green)]">
                    <Quote className="absolute -left-3 top-0 w-6 h-6 text-[var(--electric-green)] bg-white" />
                    <p className="text-xl text-zinc-700 leading-relaxed italic">
                      "{story.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <div className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--electric-green)]/10 to-[var(--electric-blue)]/10">
                      <span className="text-2xl font-light text-[var(--electric-green)]">
                        {story.savings}
                      </span>
                      <span className="text-sm text-zinc-600 ml-2">
                        {typeof story.savings === 'string' && story.savings.includes('$') ? 'saved' : 'gained'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              Case Studies
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Detailed breakdowns of how EV360 solved real customer challenges
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                className="p-10 rounded-3xl border border-zinc-200 smooth-transition hover:border-[var(--electric-green)] hover:shadow-lg space-y-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div>
                  <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-2">
                    {study.title}
                  </h3>
                  <p className="text-zinc-600">{study.customer}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm uppercase tracking-wide text-[var(--electric-green)] mb-2">
                      Challenge
                    </h4>
                    <p className="text-zinc-700 leading-relaxed">{study.challenge}</p>
                  </div>

                  <div>
                    <h4 className="text-sm uppercase tracking-wide text-[var(--electric-green)] mb-2">
                      Solution
                    </h4>
                    <p className="text-zinc-700 leading-relaxed">{study.solution}</p>
                  </div>

                  <div>
                    <h4 className="text-sm uppercase tracking-wide text-[var(--electric-green)] mb-2">
                      Outcome
                    </h4>
                    <p className="text-zinc-700 leading-relaxed">{study.outcome}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-200">
                  {study.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 rounded-full bg-zinc-100 text-xs text-zinc-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Customers Reach Out */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              Why Customers Choose EV360
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Understanding what brings people to our service
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {commonReasons.map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="text-4xl font-light text-[var(--electric-green)]">
                      {item.percentage}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="h-2 rounded-full bg-zinc-200 overflow-hidden mb-3">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[var(--electric-green)] to-[var(--electric-blue)]"
                        initial={{ width: 0 }}
                        whileInView={{ width: item.percentage }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      />
                    </div>
                    <h3 className="text-xl text-zinc-900 mb-2">{item.reason}</h3>
                    <p className="text-zinc-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Content Section - Placeholder */}
      <section className="py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              Follow Our Stories
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto mb-8">
              Watch customer interviews and behind-the-scenes content on Instagram
            </p>
            <a 
              href="https://instagram.com/ev360australia" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <motion.button
                className="px-8 py-4 rounded-full bg-[#334AFF] text-white smooth-transition electric-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Follow @EV360Australia
              </motion.button>
            </a>
          </motion.div>

          {/* Instagram Grid Placeholder */}
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                className="aspect-square rounded-2xl bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item * 0.1 }}
              >
                <div className="text-center space-y-3 p-8">
                  <Play className="w-12 h-12 text-zinc-400 mx-auto" />
                  <p className="text-zinc-500">Instagram Reel Embed</p>
                  <p className="text-xs text-zinc-400">Add embed code here</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Join thousands of informed EV owners who trust EV360 for transparent battery health insights
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/booking">
                <motion.button
                  className="px-8 py-3 rounded-full bg-[#334AFF] text-white smooth-transition electric-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Check My EV
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  className="px-6 py-2.5 rounded-full border-2 border-zinc-300 smooth-transition"
                  whileHover={{ borderColor: "var(--electric-green)", color: "var(--electric-green)", scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Share Your Story
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
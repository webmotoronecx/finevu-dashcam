"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Target, Users, Award, TrendingUp, Shield, Zap } from 'lucide-react';
import { ScrollProgress } from '@/components/ScrollProgress';
import Link from "next/link";

export default function Page() {
  const values = [
    {
      icon: Shield,
      title: "Transparency First",
      description: "We believe EV buyers and sellers deserve complete transparency about battery health. No hidden issues, no surprises—just honest, data-driven assessments."
    },
    {
      icon: Award,
      title: "Expert Certified",
      description: "Our technicians are certified in EV diagnostics and high-voltage systems. We invest in continuous training to stay ahead of rapidly evolving EV technology."
    },
    {
      icon: Users,
      title: "Customer Focused",
      description: "We make EV battery health checks accessible, convenient, and easy to understand. Mobile service, flexible scheduling, and clear reports are standard."
    },
    {
      icon: Zap,
      title: "Technology Driven",
      description: "We use professional-grade diagnostic equipment that goes beyond dashboard readings to provide accurate, comprehensive battery health data."
    }
  ];

  const team = [
    {
      name: "Mark Richardson",
      role: "Founder & Lead Technician",
      description: "15+ years in automotive diagnostics, specialized in EV battery systems",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMHRlY2h8ZW58MXx8fHwxNzY0MTMwNjc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Sarah Chen",
      role: "Operations Manager",
      description: "Ensures seamless mobile service delivery across Australia",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY0MTMwNjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "James Wong",
      role: "Senior EV Technician",
      description: "Certified across all major EV platforms and diagnostic systems",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDEzMDcxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const stats = [
    { number: "500+", label: "Vehicles Inspected" },
    { number: "5.0", label: "Google Rating" },
    { number: "53", label: "Five-Star Reviews" },
    { number: "98%", label: "Satisfaction Rate" }
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
            src="https://images.unsplash.com/photo-1758518731722-320023fb8e66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBwcm9mZXNzaW9uYWwlMjB0ZWFtfGVufDF8fHx8MTc2NDEzMDExOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="EV360 Team"
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
              About EV360
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Australia's trusted partner for transparent EV battery health diagnostics
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-8 lg:px-16">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--electric-green)] to-[var(--electric-blue)] flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight">Our Mission</h2>
            </div>
            <div className="space-y-6 text-lg text-zinc-700 leading-relaxed">
              <p>
                Australia's EV market is growing rapidly, but buyers and sellers face a critical information gap: understanding battery health. The battery represents 30-40% of an EV's value, yet most transactions happen without proper battery assessment.
              </p>
              <p>
                We founded EV360 to solve this problem. Our mission is to make professional battery health checks accessible, affordable, and easy to understand for every EV owner and buyer in Australia.
              </p>
              <p>
                We believe transparency builds trust. Whether you're buying your first EV, selling your current one, or simply want peace of mind about your battery's condition, we provide the data-driven insights you need to make confident decisions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-5xl md:text-6xl font-light text-zinc-900 mb-3 font-mono">
                  {stat.number}
                </div>
                <p className="text-zinc-600 font-mono text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
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
              Our Values
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="flex gap-6"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0">
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--electric-green)]/10 to-[var(--electric-blue)]/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-8 h-8 text-[var(--electric-green)]" />
                    </motion.div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl">{value.title}</h3>
                    <p className="text-zinc-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
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
              Meet Our Team
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Certified EV specialists dedicated to transparency and excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="space-y-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <motion.div 
                  className="aspect-square rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-2xl">{member.name}</h3>
                  <p className="text-[var(--electric-green)]">{member.role}</p>
                  <p className="text-zinc-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
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
              How We Started
            </h2>
            <div className="space-y-6 text-lg text-zinc-700 leading-relaxed">
              <p>
                EV360 was born from a frustrating experience. Our founder, Mark, was helping a friend purchase a used Tesla Model 3. The car looked perfect, drove well, and the seller claimed the battery was "like new."
              </p>
              <p>
                After purchase, a professional diagnostic revealed the battery had degraded to 78% State of Health—well below what was expected for a vehicle that age. This discovery cost Mark's friend thousands in unexpected depreciation and raised serious questions about transparency in the used EV market.
              </p>
              <p>
                Mark, with over 15 years in automotive diagnostics, saw an opportunity. EVs were flooding the Australian market, but there was no accessible, professional service dedicated to battery health assessment. Most buyers relied on dashboard estimates or seller claims—neither providing the complete picture.
              </p>
              <p>
                In 2024, EV360 launched with a simple promise: make professional EV battery health checks accessible to everyone. We invested in professional-grade diagnostic equipment, trained certified technicians, and developed clear, easy-to-understand reporting. Our mobile service brings this expertise directly to customers across Australia.
              </p>
              <p>
                Today, we've helped hundreds of Australians make confident decisions about buying, selling, and maintaining their EVs. We're proud to be setting the standard for battery health transparency in Australia's growing EV market.
              </p>
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
              Ready to check your EV's battery health?
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Join hundreds of confident EV owners who trust EV360
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/booking">
                <motion.button
                  className="px-6 py-2.5 rounded-full bg-[#334AFF] text-white smooth-transition electric-glow"
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
                  Contact Us
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
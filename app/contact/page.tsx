"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { ScrollProgress } from '@/components/ScrollProgress';
import { useState } from 'react';
import Link from "next/link";

export default function Page() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjQxMzA1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Contact us"
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
              Get in Touch
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              We're here to answer your questions about EV battery health
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
            {[
              {
                icon: Phone,
                title: "Phone",
                content: "1300 EV 360",
                subtext: "(1300 383 360)",
                link: "tel:1300383360"
              },
              {
                icon: Mail,
                title: "Email",
                content: "hello@ev360.com.au",
                subtext: "We reply within 24 hours",
                link: "mailto:hello@ev360.com.au"
              },
              {
                icon: MapPin,
                title: "Victoria",
                content: "6/174-186 Atlantic Dr",
                subtext: "Keysborough VIC 3173",
                link: "https://maps.google.com/?q=6/174-186+Atlantic+Dr,+Keysborough+VIC+3173"
              },
              {
                icon: MapPin,
                title: "Queensland",
                content: "2/39 Ellison Rd",
                subtext: "Geebung QLD 4034",
                link: "https://maps.google.com/?q=2/39+Ellison+Rd,+Geebung+QLD+4034"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              const CardContent = (
                <motion.div
                  className="p-8 rounded-2xl border border-zinc-200 smooth-transition hover:border-[var(--electric-green)] hover:shadow-lg space-y-4 h-full"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--electric-green)]/10 to-[var(--electric-blue)]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[var(--electric-green)]" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-zinc-900">{item.title}</h3>
                    <p className="text-lg text-zinc-700">{item.content}</p>
                    <p className="text-sm text-zinc-500 mt-1">{item.subtext}</p>
                  </div>
                </motion.div>
              );

              return item.link ? (
                <a key={index} href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined} className="block">
                  {CardContent}
                </a>
              ) : (
                <div key={index}>
                  {CardContent}
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
                  Send us a message
                </h2>
                <p className="text-xl text-zinc-600 leading-relaxed">
                  Have a question about our services or need help choosing the right battery health check? Fill out the form and we'll get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--electric-green)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[var(--electric-green)]">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg text-zinc-900 mb-1">Quick Response</h4>
                    <p className="text-zinc-600">We typically respond to all inquiries within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--electric-green)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[var(--electric-green)]">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg text-zinc-900 mb-1">Expert Advice</h4>
                    <p className="text-zinc-600">Get guidance from certified EV technicians</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--electric-green)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[var(--electric-green)]">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg text-zinc-900 mb-1">No Obligation</h4>
                    <p className="text-zinc-600">Free quotes and consultations available</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[var(--electric-green)] focus:ring-2 focus:ring-[var(--electric-green)]/20 outline-none smooth-transition"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[var(--electric-green)] focus:ring-2 focus:ring-[var(--electric-green)]/20 outline-none smooth-transition"
                    placeholder="0400 000 000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[var(--electric-green)] focus:ring-2 focus:ring-[var(--electric-green)]/20 outline-none smooth-transition"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[var(--electric-green)] focus:ring-2 focus:ring-[var(--electric-green)]/20 outline-none smooth-transition"
                >
                  <option value="">Select a subject</option>
                  <option value="booking">Book a Service</option>
                  <option value="pre-purchase">Pre-Purchase Inspection</option>
                  <option value="general">General Inquiry</option>
                  <option value="warranty">Warranty Question</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[var(--electric-green)] focus:ring-2 focus:ring-[var(--electric-green)]/20 outline-none smooth-transition resize-none"
                  placeholder="Tell us about your EV and what you need help with..."
                />
              </div>

              <motion.button
                type="submit"
                className="w-full py-4 rounded-full bg-[var(--brand-primary)] text-white smooth-transition electric-glow flex items-center justify-center gap-2 hover:bg-[#2030cc]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-5 h-5" />
                Send Message
              </motion.button>

              <p className="text-sm text-zinc-500 text-center">
                By submitting this form, you agree to our privacy policy
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Looking for quick answers?
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Check our FAQ page or battery health guide for instant information
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/faq">
                <motion.button
                  className="px-6 py-2.5 rounded-full border-2 border-zinc-300 smooth-transition"
                  whileHover={{ borderColor: "var(--electric-green)", color: "var(--electric-green)", scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  FAQ
                </motion.button>
              </Link>
              <Link href="/battery-guide">
                <motion.button
                  className="px-6 py-2.5 rounded-full border-2 border-zinc-300 smooth-transition"
                  whileHover={{ borderColor: "var(--electric-green)", color: "var(--electric-green)", scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Battery Health Guide
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
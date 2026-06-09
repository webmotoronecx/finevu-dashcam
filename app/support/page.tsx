"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { MessageCircle, Phone, Mail, FileText, Calendar, CheckCircle } from 'lucide-react';
import { ScrollProgress } from '@/components/ScrollProgress';
import Link from "next/link";

export default function Page() {
  const supportOptions = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      details: "1300 EV 360 (1300 383 360)",
      hours: "Mon-Sun, 8:00 AM - 8:00 PM AEST",
      cta: "Call Now",
      link: "tel:1300383360"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed inquiry",
      details: "hello@ev360.com.au",
      hours: "Response within 24 hours",
      cta: "Send Email",
      link: "mailto:hello@ev360.com.au"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      details: "Available on our website",
      hours: "Mon-Fri, 9:00 AM - 6:00 PM AEST",
      cta: "Start Chat",
      link: "#"
    },
    {
      icon: Calendar,
      title: "Book a Call",
      description: "Schedule a consultation",
      details: "30-minute technical consultation",
      hours: "Flexible scheduling available",
      cta: "Schedule Call",
      link: "/booking"
    }
  ];

  const commonIssues = [
    {
      title: "Booking & Scheduling",
      questions: [
        "How do I book an appointment?",
        "Can I reschedule my appointment?",
        "What if I need to cancel?",
        "How quickly can you come to me?"
      ]
    },
    {
      title: "Reports & Results",
      questions: [
        "When will I receive my report?",
        "How do I interpret my results?",
        "Can I share my report with others?",
        "What format is the report in?"
      ]
    },
    {
      title: "Service Questions",
      questions: [
        "Which service do I need?",
        "What's included in each package?",
        "Do you service my EV model?",
        "Is mobile service available in my area?"
      ]
    },
    {
      title: "Technical Support",
      questions: [
        "Understanding State of Health (SOH)",
        "Battery warranty questions",
        "Interpreting diagnostic codes",
        "Vehicle-specific battery issues"
      ]
    }
  ];

  const resources = [
    {
      title: "Frequently Asked Questions",
      description: "Find answers to the most common questions about our services",
      icon: FileText,
      link: "/faq"
    },
    {
      title: "Battery Health Guide",
      description: "Learn everything about EV battery health and maintenance",
      icon: CheckCircle,
      link: "/battery-guide"
    },
    {
      title: "Contact Us",
      description: "Get in touch with our team for personalized assistance",
      icon: MessageCircle,
      link: "/contact"
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
            src="https://images.unsplash.com/photo-1496152658208-d41635783718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBoZWxwJTIwZGVza3xlbnwxfHx8fDE3NjQxMzA3MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
              We're Here to Help
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Get support from our certified EV battery specialists
            </p>
          </motion.div>
        </div>
      </section>

      {/* Support Options */}
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
              Get Support Your Way
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Choose the support channel that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportOptions.map((option, index) => {
              const Icon = option.icon;
              const isLink = option.link && option.link !== "#";
              
              const CardContent = (
                <motion.div
                  className="p-8 rounded-2xl border border-zinc-200 smooth-transition hover:border-[var(--electric-green)] hover:shadow-lg space-y-6 h-full flex flex-col"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--electric-green)]/10 to-[var(--electric-blue)]/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[var(--electric-green)]" />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-2xl mb-2">{option.title}</h3>
                    <p className="text-zinc-600 mb-4">{option.description}</p>
                    <p className="text-zinc-900 mb-2">{option.details}</p>
                    <p className="text-sm text-zinc-500">{option.hours}</p>
                  </div>

                  <motion.button
                    className="w-full py-3 rounded-full border-2 border-zinc-300 smooth-transition hover:border-[var(--electric-green)] hover:text-[var(--electric-green)]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.cta}
                  </motion.button>
                </motion.div>
              );

              return isLink ? (
                <Link key={index} href={option.link}>
                  {CardContent}
                </Link>
              ) : (
                <div key={index}>
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Common Issues */}
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
              Common Support Topics
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Quick links to frequently requested help topics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {commonIssues.map((category, index) => (
              <motion.div
                key={index}
                className="space-y-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-xl text-zinc-900 pb-3 border-b border-zinc-200">
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.questions.map((question, qIdx) => (
                    <li key={qIdx} className="text-zinc-600 text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-[var(--electric-green)] mt-1">•</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Self-Service Resources */}
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
              Self-Service Resources
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Find answers instantly with our comprehensive guides
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Link key={index} href={resource.link}>
                  <motion.div
                    className="p-10 rounded-2xl border border-zinc-200 smooth-transition hover:border-[var(--electric-green)] hover:shadow-lg space-y-6 h-full"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -8 }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--electric-green)]/10 to-[var(--electric-blue)]/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[var(--electric-green)]" />
                    </div>
                    <div>
                      <h3 className="text-2xl mb-3">{resource.title}</h3>
                      <p className="text-zinc-600 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-8 lg:px-16">
          <motion.div
            className="bg-white rounded-3xl p-12 border border-zinc-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--electric-green)] to-[var(--electric-blue)] flex items-center justify-center mx-auto">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                Need Immediate Assistance?
              </h2>
              <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                For urgent pre-purchase inspections or same-day service, call us directly
              </p>
              <div className="pt-4">
                <a href="tel:1300383360">
                  <motion.button
                    className="px-8 py-3 rounded-full bg-[#334AFF] text-white smooth-transition electric-glow text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Call 1300 EV 360
                  </motion.button>
                </a>
              </div>
              <p className="text-sm text-zinc-500">
                Available 7 days a week, 8:00 AM - 8:00 PM AEST
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Support Hours
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="p-8 rounded-2xl bg-zinc-50">
                <h3 className="text-xl text-zinc-900 mb-4">Phone Support</h3>
                <div className="space-y-2 text-zinc-600">
                  <p>Monday - Sunday</p>
                  <p className="text-2xl font-light text-zinc-900">8:00 AM - 8:00 PM</p>
                  <p className="text-sm text-zinc-500">Australian Eastern Standard Time</p>
                </div>
              </div>
              <div className="p-8 rounded-2xl bg-zinc-50">
                <h3 className="text-xl text-zinc-900 mb-4">Email Support</h3>
                <div className="space-y-2 text-zinc-600">
                  <p>24/7 Submission</p>
                  <p className="text-2xl font-light text-zinc-900">24 Hour Response</p>
                  <p className="text-sm text-zinc-500">Typically faster during business hours</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
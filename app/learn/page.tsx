"use client";

import { Footer } from '@/components/Footer';
import { EditorialCard } from '@/components/EditorialCard';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { BookOpen, TrendingUp, Shield, Zap } from 'lucide-react';
import { useState } from 'react';
import Link from "next/link";
import { articles } from '@/lib/data/articles';

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Calculate dynamic counts
  const categoryCounts = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = [
    {
      icon: BookOpen,
      title: "Battery Basics",
      color: "var(--brand-primary)"
    },
    {
      icon: TrendingUp,
      title: "Buying & Selling",
      color: "var(--brand-primary)"
    },
    {
      icon: Shield,
      title: "Maintenance & Care",
      color: "var(--brand-primary)"
    },
    {
      icon: Zap,
      title: "Performance",
      color: "var(--brand-primary)"
    }
  ];

  const filteredArticles = selectedCategory === "All" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

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
            src="https://images.unsplash.com/photo-1600439614353-174ad0ee3b25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBlZHVjYXRpb24lMjBsZWFybmluZ3xlbnwxfHx8fDE3NjQxMTg0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="EV education"
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
              EV Education Hub
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Expert insights and practical guides for electric vehicle owners
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.title;
              const count = categoryCounts[category.title] || 0;
              
              return (
                <motion.div
                  key={index}
                  className={`bg-white rounded-[2rem] p-8 text-center space-y-4 cursor-pointer border transition-all ${
                    isSelected ? 'border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20' : 'border-transparent hover:border-zinc-200'
                  }`}
                  onClick={() => setSelectedCategory(isSelected ? "All" : category.title)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-light-gray)]/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-8 h-8" style={{ color: category.color }} />
                  </motion.div>
                  <h3 className="text-xl">{category.title}</h3>
                  <p className="text-zinc-500 text-sm font-mono">{count} {count === 1 ? 'article' : 'articles'}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div 
            className="mb-20 flex justify-between items-end"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
                {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
              </h2>
              <p className="text-xl text-zinc-600 max-w-2xl">
                {selectedCategory === "All" 
                  ? "Everything you need to know about EV battery health, maintenance, and ownership"
                  : `Browse our curated guides about ${selectedCategory.toLowerCase()}`}
              </p>
            </div>
            {selectedCategory !== "All" && (
              <button 
                onClick={() => setSelectedCategory("All")}
                className="text-zinc-500 hover:text-[var(--brand-primary)] transition-colors underline underline-offset-4"
              >
                View all articles
              </button>
            )}
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                layout
              >
                <Link href={`/learn/${article.slug}`}>
                  <EditorialCard {...article} />
                </Link>
              </motion.div>
            ))}
          </div>
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-20 text-zinc-500">
              No articles found in this category.
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
                Stay informed
              </h2>
              <p className="text-xl text-zinc-600">
                Get the latest EV battery health insights delivered to your inbox
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 px-6 py-4 rounded-full border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
              />
              <motion.button
                type="submit"
                className="px-8 py-4 rounded-full bg-[var(--brand-primary)] text-white smooth-transition electric-glow whitespace-nowrap font-medium hover:bg-[#2030cc]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>

            <p className="text-sm text-zinc-500">
              Join 5,000+ EV owners. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

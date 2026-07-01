"use client";

import { Footer } from '@/components/Footer';
import { EditorialCard } from '@/components/EditorialCard';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { BookOpen, ShieldCheck, Camera, ScrollText } from 'lucide-react';
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
      title: "Buying Guide",
      color: "var(--finevu-orange)"
    },
    {
      icon: ShieldCheck,
      title: "Safety",
      color: "var(--finevu-orange)"
    },
    {
      icon: Camera,
      title: "Features",
      color: "var(--finevu-orange)"
    },
    {
      icon: ScrollText,
      title: "Ownership",
      color: "var(--finevu-orange)"
    }
  ];

  const filteredArticles = selectedCategory === "All"
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-32 md:pt-40 pb-20" data-nav-theme="dark">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Highway driving"
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
            <span className="finevu-capsule text-xs font-bold uppercase tracking-wider">
              FineVu Learn
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Dash cam guides
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Plain, honest advice on choosing, fitting and getting the most from your FineVu dash cam.
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
                  className={`tile-hover bg-white rounded-[2rem] p-8 text-center space-y-4 cursor-pointer border transition-all ${
                    isSelected ? 'border-[var(--finevu-orange)] ring-2 ring-[var(--finevu-orange)]/20' : 'border-transparent hover:border-zinc-200'
                  }`}
                  onClick={() => setSelectedCategory(isSelected ? "All" : category.title)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--finevu-orange)]/10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-8 h-8" style={{ color: category.color }} />
                  </motion.div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                  <p className="text-zinc-500 text-sm font-mono">{count} {count === 1 ? 'guide' : 'guides'}</p>
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
            className="mb-20 flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-end"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="min-w-0">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                {selectedCategory === "All" ? "Latest guides" : `${selectedCategory} guides`}
              </h2>
              <p className="text-xl text-zinc-600 max-w-2xl">
                {selectedCategory === "All"
                  ? "Everything you need to know about FineVu dash cams, from 4K vs 2K to parking mode and insurance."
                  : `Browse our guides on ${selectedCategory.toLowerCase()}.`}
              </p>
            </div>
            {selectedCategory !== "All" && (
              <button
                onClick={() => setSelectedCategory("All")}
                className="cta-hover text-zinc-500 hover:text-[var(--finevu-orange)] transition-colors underline underline-offset-4"
              >
                View all guides
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
              No guides found in this category.
            </div>
          )}
        </div>
      </section>

      {/* Help / CTA Section */}
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
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                Ready to choose?
              </h2>
              <p className="text-xl text-zinc-600">
                Compare the true 4K GX4K and the 2K GX35, then find your nearest stockist.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/gx4k">
                <motion.span
                  className="cta-hover inline-block px-8 py-4 rounded-full bg-[var(--finevu-orange)] text-white smooth-transition whitespace-nowrap font-bold hover:opacity-90"
                >
                  Explore the range
                </motion.span>
              </Link>
              <Link href="/where-to-buy">
                <motion.span
                  className="cta-hover inline-block px-8 py-4 rounded-full border-2 border-zinc-300 text-zinc-900 smooth-transition whitespace-nowrap font-bold hover:border-[var(--finevu-orange)]"
                >
                  Where to buy
                </motion.span>
              </Link>
            </div>

            <p className="text-sm text-zinc-500">
              Made in Korea. 3-Year Australian Warranty. 4 million+ sold worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

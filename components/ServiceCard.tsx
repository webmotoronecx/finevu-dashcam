"use client";

import { motion } from 'motion/react';
import { CheckCircle, Clock } from 'lucide-react';
import Link from "next/link";

interface ServiceCardProps {
  name: string;
  price: string;
  duration: string;
  features: string[];
  recommended: boolean;
  delay?: number;
}

export function ServiceCard({ name, price, duration, features, recommended, delay = 0 }: ServiceCardProps) {
  return (
    <motion.div
      className={`relative rounded-[2rem] p-8 lg:p-10 border flex flex-col h-full bg-white ${
        recommended 
          ? 'border-[var(--brand-primary)] shadow-2xl' 
          : 'border-zinc-200'
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-[var(--brand-primary)] text-white text-xs font-mono uppercase tracking-widest border border-white/20">
          Most Popular
        </div>
      )}

      <div className="space-y-6 flex-grow">
        <div>
          <h3 className="text-3xl font-light mb-2 tracking-tight">{name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-light font-mono text-[var(--brand-primary)] tracking-tighter">{price}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>

        <ul className="space-y-4 pt-6 border-t border-zinc-100">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0 mt-1" />
              <span className="text-zinc-600 text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 pt-6">
        <Link href="/booking" className="block">
          <motion.button
            className={`w-full py-4 rounded-full smooth-transition font-medium tracking-wide ${
              recommended
                ? 'bg-[var(--brand-primary)] text-white electric-glow hover:bg-[#2030cc]'
                : 'border border-zinc-200 text-zinc-900 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Check My EV
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

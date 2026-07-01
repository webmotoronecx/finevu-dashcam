"use client";

import { motion } from 'motion/react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface ReviewCardProps {
  name: string;
  location: string;
  vehicle: string;
  review: string;
  rating: number;
  image: string;
  verified?: boolean;
  delay?: number;
}

export function ReviewCard({ name, location, vehicle, review, image, delay = 0 }: ReviewCardProps) {
  return (
    <motion.div
      className="tile-hover relative p-8 rounded-[2rem] bg-zinc-900/50 backdrop-blur-sm border border-white/5 h-full flex flex-col hover:border-[var(--brand-primary)]/30 transition-colors"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-shrink-0">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10"
          />
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--brand-primary)] rounded-full border-2 border-black" />
        </div>
        <div>
          <p className="text-white font-medium text-lg">{name}</p>
          <p className="text-sm text-zinc-500 font-mono">{vehicle}</p>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-zinc-300 leading-relaxed mb-6 flex-grow text-base font-light">
        &ldquo;{review}&rdquo;
      </p>

      {/* Location */}
      <div className="pt-6 border-t border-white/5 mt-auto">
        <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono">{location}</p>
      </div>
    </motion.div>
  );
}
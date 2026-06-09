"use client";

import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
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

export function ReviewCard({ name, location, vehicle, review, rating, image, verified = false, delay = 0 }: ReviewCardProps) {
  return (
    <motion.div
      className="relative p-8 rounded-[2rem] bg-zinc-900/50 backdrop-blur-sm border border-white/5 h-full flex flex-col hover:border-[var(--brand-primary)]/30 transition-colors"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      {/* Verified Badge */}
      {verified && (
        <div className="absolute top-8 right-8">
          <motion.div 
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#334AFF] border border-[#334AFF] font-mono"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.5 + delay, type: "spring" }}
          >
            <CheckCircle className="w-3 h-3 text-white" />
            <span className="text-[10px] text-white uppercase tracking-widest">Verified</span>
          </motion.div>
        </div>
      )}

      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-8">
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

      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <motion.svg 
            key={i} 
            className="w-4 h-4 text-[var(--brand-primary)]" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6 + delay + i * 0.05, type: "spring" }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </motion.svg>
        ))}
      </div>

      {/* Review Text */}
      <p className="text-zinc-300 leading-relaxed mb-6 flex-grow text-lg font-light">
        "{review}"
      </p>

      {/* Location */}
      <div className="pt-6 border-t border-white/5 mt-auto">
        <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono">{location}</p>
      </div>
    </motion.div>
  );
}
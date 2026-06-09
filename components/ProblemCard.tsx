"use client";

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { TiltCard } from '@/components/TiltCard';
import { motion } from 'motion/react';
import Link from "next/link";
import { ChevronRight } from 'lucide-react';

interface ProblemCardProps {
  image: string;
  title: string;
  description: string;
  link?: string;
}

export function ProblemCard({ image, title, description, link }: ProblemCardProps) {
  const CardContent = () => (
    <>
      {/* Image */}
      <motion.div 
        className="relative h-[480px]"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4 }}
      >
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white" style={{ transform: 'translateZ(40px)' }}>
        <h3 className="text-2xl mb-3">{title}</h3>
        <p className="text-zinc-300 leading-relaxed opacity-90 mb-4">{description}</p>
        {link && (
          <div className="flex items-center text-[var(--brand-primary)] font-medium text-sm uppercase tracking-wider gap-2">
            Learn More <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 smooth-transition pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)]/20 to-transparent" />
      </div>
    </>
  );

  if (link) {
    return (
      <Link href={link}>
        <TiltCard className="group relative overflow-hidden rounded-3xl smooth-transition cursor-pointer" tiltStrength={10}>
          <CardContent />
        </TiltCard>
      </Link>
    );
  }

  return (
    <TiltCard className="group relative overflow-hidden rounded-3xl smooth-transition cursor-pointer" tiltStrength={10}>
      <CardContent />
    </TiltCard>
  );
}

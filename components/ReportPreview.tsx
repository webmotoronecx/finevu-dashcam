"use client";

import { motion } from 'motion/react';
import { Wifi, MapPin, Radio, Play, ShieldCheck, Video } from 'lucide-react';
import { Logo } from "@/components/Logo";

/**
 * FineVu app preview card — a phone-style mock of the FineVu companion app
 * showing a connected dash cam, live view and recording telemetry.
 * (Replaces the legacy EV battery certificate visual.)
 */
export function ReportPreview({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Device frame */}
      <div className="bg-zinc-950 w-full aspect-[1/1.4] rounded-[2rem] shadow-2xl overflow-hidden relative border border-zinc-800 flex flex-col">

        {/* App header */}
        <div className="bg-zinc-900 px-6 py-5 flex justify-between items-center text-white border-b border-white/5">
          <Logo className="text-lg" />
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--finevu-orange)] animate-pulse" />
            CONNECTED
          </span>
        </div>

        {/* Live view */}
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-800 border border-white/5">
            <img
              src="https://images.unsplash.com/photo-1502877338535-766e1452684a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Live dash cam view"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-mono text-white tracking-wider">LIVE · 4K</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-[var(--finevu-orange)] text-[9px] font-bold text-white">
              FRONT
            </div>
          </div>

          {/* Status chips */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center gap-1 border border-white/5">
              <Wifi className="w-4 h-4 text-[var(--finevu-orange)]" />
              <span className="text-[9px] text-zinc-400 font-mono uppercase">Wi-Fi</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center gap-1 border border-white/5">
              <MapPin className="w-4 h-4 text-[var(--finevu-orange)]" />
              <span className="text-[9px] text-zinc-400 font-mono uppercase">GPS</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center gap-1 border border-white/5">
              <Radio className="w-4 h-4 text-[var(--finevu-orange)]" />
              <span className="text-[9px] text-zinc-400 font-mono uppercase">Parking</span>
            </div>
          </div>

          {/* Recording rows */}
          <div className="space-y-2">
            {[
              { label: "Driving · 14:32", tag: "4K", icon: Video },
              { label: "Event · Impact detected", tag: "SAVED", icon: ShieldCheck },
            ].map((row, i) => {
              const Icon = row.icon;
              return (
                <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-[11px] text-zinc-300">{row.label}</span>
                  </div>
                  <span className="text-[9px] font-mono text-[var(--finevu-orange)] border border-[var(--finevu-orange)]/30 rounded px-1.5 py-0.5">
                    {row.tag}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">View · Save · Share</span>
            <span className="text-[10px] text-zinc-500 font-mono">FineVu App</span>
          </div>
        </div>

        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Decorative shadow card */}
      <motion.div
        className="absolute -right-4 -bottom-4 w-full h-full bg-[var(--finevu-charcoal)] -z-10 rounded-[2rem]"
        initial={{ rotate: 0 }}
        whileHover={{ rotate: -2 }}
      />
    </div>
  );
}

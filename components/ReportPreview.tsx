"use client";

import { motion } from 'motion/react';
import { CheckCircle, AlertTriangle, Battery, Gauge, Zap, Calendar, ShieldCheck, Download } from 'lucide-react';
const logo = '/brand/logo.svg';

export function ReportPreview({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Paper/Document Container */}
      <div className="bg-white w-full aspect-[1/1.4] rounded-sm shadow-2xl overflow-hidden relative border border-zinc-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-zinc-900 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <img src={logo} alt="EV360" className="h-6 w-auto" />
          </div>
          <span className="text-xs font-mono text-zinc-400">CERT-2026-8842</span>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 flex flex-col gap-6">
          
          {/* Vehicle Info */}
          <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-2xl font-bold text-zinc-900">Tesla Model 3</h3>
              <p className="text-zinc-500 text-sm">VIN: 5YJ3...8429</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                Certified
              </span>
            </div>
          </div>

          {/* Main Score */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#f4f4f5"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="var(--brand-primary)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset="12.56" // 95%
                  className="drop-shadow-[0_0_10px_rgba(51,74,255,0.4)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-zinc-900">95%</span>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">SOH</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">Excellent Health</h4>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
                Battery capacity is performing above average for vehicle age and mileage.
              </p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                <Battery className="w-3 h-3" />
                <span>Usable Cap</span>
              </div>
              <p className="font-mono font-bold text-zinc-900">54.2 kWh</p>
            </div>
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                <Gauge className="w-3 h-3" />
                <span>Range Est.</span>
              </div>
              <p className="font-mono font-bold text-zinc-900">412 km</p>
            </div>
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Cell Delta</span>
              </div>
              <p className="font-mono font-bold text-zinc-900">0.004 V</p>
            </div>
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                <Calendar className="w-3 h-3" />
                <span>Tested</span>
              </div>
              <p className="font-mono font-bold text-zinc-900">24 Feb 2026</p>
            </div>
          </div>

          {/* Footer of Doc */}
          <div className="mt-auto pt-6 border-t border-zinc-100 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Independent Verification</span>
             </div>
             {/* Signature Mockup */}
             <div className="font-script text-zinc-400 text-lg opacity-60 font-handwriting italic">
                John Doe
             </div>
          </div>
        </div>

        {/* Glossy Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 pointer-events-none" />
      </div>

      {/* Decorative Elements behind/around */}
      <motion.div 
        className="absolute -right-4 -bottom-4 w-full h-full bg-zinc-900 -z-10 rounded-sm"
        initial={{ rotate: 0 }}
        whileHover={{ rotate: -2 }}
      />
    </div>
  );
}

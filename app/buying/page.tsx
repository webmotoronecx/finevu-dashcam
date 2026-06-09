"use client";

import { LandingPageLayout } from '../../components/LandingPageLayout';
import { Search, ShieldCheck, DollarSign, FileCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Page() {
  const content = (
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div className="space-y-6">
        <h2 className="text-4xl font-light mb-6">Avoid the $15,000 Mistake</h2>
        <p className="text-lg text-zinc-600 leading-relaxed">
          Replacing an EV battery can cost upwards of $15,000. A used car might look perfect on the outside, but have a severely degraded battery that limits range and performance.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed">
          Don't rely on the dashboard "guess-o-meter". It can be manipulated. Our independent inspection gives you the raw data you need to negotiate with confidence.
        </p>
        <ul className="space-y-3 pt-4">
          {[
            "Verify true battery capacity vs. manufacturer rating",
            "Identify hidden cell imbalances",
            "Detect previous rapid charging abuse",
            "Confirm software is up to date"
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
              <span className="text-zinc-800">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative h-[400px] bg-zinc-200 rounded-[2rem] overflow-hidden shadow-lg border border-white/20">
        <img 
          src="https://images.unsplash.com/photo-1622333847289-41e8172e650a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFViUyMGRhc2hib2FyZCUyMGludGVyaW9yfGVufDF8fHx8MTc2NDA2ODY3MHww&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="EV dashboard showing range" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );

  return (
    <LandingPageLayout
      title="Buy Your Next EV With Total Confidence"
      subtitle="The used EV market is growing, but battery health is invisible. Our pre-purchase inspection reveals the true condition of the battery before you hand over your cash."
      heroImage="https://images.unsplash.com/photo-1670813007457-5e12ba8cf03f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaXR5fGVufDF8fHx8MTc2NDA2ODY3MXww&ixlib=rb-4.1.0&q=80&w=1080"
      audience="Buyers"
      benefits={[
        {
          title: "Negotiate Better",
          description: "Use our independent report to negotiate the price down if degradation is higher than expected for the vehicle's age.",
          icon: DollarSign
        },
        {
          title: "Verify Warranty",
          description: "Ensure the vehicle is still eligible for manufacturer battery warranty replacement if needed.",
          icon: FileCheck
        },
        {
          title: "Future Proofing",
          description: "Understand how much life is left in the battery and when you might need to consider replacement.",
          icon: Zap
        }
      ]}
      ctaText="Book Inspection"
      ctaLink="/booking"
      content={content}
    />
  );
}

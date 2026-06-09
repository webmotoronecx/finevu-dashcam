"use client";

import { LandingPageLayout } from '../../components/LandingPageLayout';
import { DollarSign, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export default function Page() {
  const content = (
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div className="order-2 md:order-1 relative h-[400px] bg-zinc-200 rounded-[2rem] overflow-hidden shadow-lg border border-white/20">
        <img 
          src="https://images.unsplash.com/photo-1681505526188-b05e68c77582?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250cmFjdCUyMGRvY3VtZW50JTIwc2lnbmF0dXJlJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc3MTkxMTQzMHww&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="Handshake over contract" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="order-1 md:order-2 space-y-6">
        <h2 className="text-4xl font-light mb-6">Prove Your Car's Value</h2>
        <p className="text-lg text-zinc-600 leading-relaxed">
          Buyers are terrified of degraded batteries. If you can't prove your battery is healthy, they will assume the worst and offer less.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed">
          An EV360 Certified Health Report is the "Building & Pest" report for your car. It removes doubt, builds trust instantly, and justifies your asking price.
        </p>
        <div className="bg-[var(--brand-primary)]/5 p-6 rounded-xl border border-[var(--brand-primary)]/10">
          <p className="text-zinc-900 font-medium">
            "I sold my Model 3 for $2,500 above market average simply because I had the battery report to prove it had 96% health."
          </p>
          <p className="text-[var(--brand-primary)] text-sm mt-2">- Sarah K., Sydney</p>
        </div>
      </div>
    </div>
  );

  return (
    <LandingPageLayout
      title="Sell Your EV Faster & For More"
      subtitle="The #1 question every buyer asks is 'How is the battery?'. Answer it with authority using an independent EV360 Health Certificate."
      heroImage="https://images.unsplash.com/photo-1560179707-f14e90ef3623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjQxMTg5NjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
      audience="Sellers"
      benefits={[
        {
          title: "Command Higher Prices",
          description: "Justify a premium price by proving your battery has been well-maintained and has high remaining capacity.",
          icon: DollarSign
        },
        {
          title: "Sell Faster",
          description: "Listings with verified battery health reports get more inquiries and close faster than those without.",
          icon: TrendingUp
        },
        {
          title: "Total Transparency",
          description: "Build immediate trust with potential buyers by being upfront about the most critical component of the car.",
          icon: ShieldCheck
        }
      ]}
      ctaText="Get Certified"
      ctaLink="/booking"
      content={content}
    />
  );
}

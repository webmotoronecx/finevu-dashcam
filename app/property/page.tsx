"use client";

import { BusinessEnquiryForm } from '../../components/BusinessEnquiryForm';
import { LandingPageLayout } from '../../components/LandingPageLayout';
import { Home, Zap, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Page() {
  const content = (
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div className="order-2 md:order-1 relative h-[400px] bg-zinc-200 rounded-[2rem] overflow-hidden shadow-lg border border-white/20">
        <img 
          src="https://images.unsplash.com/photo-1651131264294-3e331d1b8981?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGVsZWN0cmljJTIwY2FyJTIwY2hhcmdpbmclMjBwYXJraW5nJTIwYmFzZW1lbnR8ZW58MXx8fHwxNzcxOTExOTg4fDA&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="Apartment EV Charging" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="order-1 md:order-2 space-y-6">
        <h2 className="text-4xl font-light mb-6">Manage Fire Risk in Your Building</h2>
        <p className="text-lg text-zinc-600 leading-relaxed">
          Strata managers and building owners are rightly concerned about the fire safety of aging EVs charging in basement carparks.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed">
          While EV fires are rare, they are high-consequence events. Implementing a policy that requires annual battery health checks for resident vehicles can significantly mitigate this risk.
        </p>
        <h3 className="text-xl font-medium mt-4">Strata Safety Protocol</h3>
        <ul className="space-y-3">
          {[
            "Identify high-risk vehicles (damaged cells/thermal issues)",
            "Provide residents with peace of mind",
            "Satisfy building insurer requirements",
            "Facilitate safer charging infrastructure rollout"
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
              <span className="text-zinc-800">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <LandingPageLayout
      title="EV Safety for Strata & Building Managers"
      subtitle="Ensure the safety of your property and residents by implementing verified battery health checks for EVs charging in your building."
      heroImage="https://images.unsplash.com/photo-1596731498067-99aeb581d3d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaYXJnaW5nJTIwY2xvc2V1cHxlbnwxfHx8fDE3NjQxNjExMzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
      audience="Strata & Property"
      benefits={[
        {
          title: "Risk Mitigation",
          description: "Proactively identify at-risk batteries before they become a thermal runaway hazard in your basement.",
          icon: ShieldCheck
        },
        {
          title: "Insurance Compliance",
          description: "Many building insurers are starting to ask for EV safety protocols. Stay ahead of the curve.",
          icon: CheckCircle
        },
        {
          title: "Resident Value",
          description: "Offer a value-added service to your residents by organizing annual on-site battery check days.",
          icon: Home
        }
      ]}
      ctaText="Discuss Safety Protocol"
      ctaLink="/contact"
      content={content}
      form={<BusinessEnquiryForm type="Property" title="Protect Your Property with EV360" />}
    />
  );
}

"use client";

import { BusinessEnquiryForm } from '../../components/BusinessEnquiryForm';
import { LandingPageLayout } from '../../components/LandingPageLayout';
import {  Truck, Activity, BarChart, Clock } from 'lucide-react';

export default function Page() {
  const content = (
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div className="order-2 md:order-1 relative h-[400px] bg-zinc-200 rounded-[2rem] overflow-hidden shadow-lg border border-white/20">
        <img 
          src="https://images.unsplash.com/photo-1608023568014-6636291b5584?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwZWxlY3RyaWMlMjB2ZWhpY2xlJTIwZmxlZXQlMjBjaGFyZ2luZyUyMGRlcG90fGVufDF8fHx8MTc3MTkxMTk4Mnww&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="Fleet depot charging" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="order-1 md:order-2 space-y-6">
        <h2 className="text-4xl font-light mb-6">Data-Driven Fleet Management</h2>
        <p className="text-lg text-zinc-600 leading-relaxed">
          For fleet managers, battery health is about maximizing uptime and resale value.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed">
          We provide bulk diagnostic services to help you make informed decisions about when to cycle vehicles out of your fleet.
        </p>
        <h3 className="text-xl font-medium mt-4">Key Services</h3>
        <ul className="space-y-3">
          {[
            "End-of-lease battery condition reports",
            "Mid-life degradation tracking",
            "Driver behavior analysis (impact on SOH)",
            "Resale preparation for maximum return"
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
              <span className="text-zinc-800">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <LandingPageLayout
      title="Optimize Your Electric Fleet Lifecycle"
      subtitle="Maximize residual values and minimize downtime with regular, independent battery health monitoring for your entire fleet."
      heroImage="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2VyJTIwYXVzdHJhbGlhfGVufDF8fHx8MTc2NDExODk0MHww&ixlib=rb-4.1.0&q=80&w=1080"
      audience="Fleet Managers"
      benefits={[
        {
          title: "Predictive Maintenance",
          description: "Catch potential cell failures before they strand a driver or vehicle, reducing costly downtime.",
          icon: Clock
        },
        {
          title: "Maximize Residuals",
          description: "Sell your ex-fleet vehicles for higher prices with certified proof of battery health.",
          icon: BarChart
        },
        {
          title: "Driver Accountability",
          description: "Identify which drivers are abusing batteries with poor charging habits and provide targeted training.",
          icon: Truck
        }
      ]}
      ctaText="Request Fleet Consultation"
      ctaLink="/contact"
      content={content}
      form={<BusinessEnquiryForm type="Fleet" title="Optimize Your Fleet with EV360" />}
    />
  );
}

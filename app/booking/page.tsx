"use client";

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, CheckCircle, ChevronRight, ChevronDown, CreditCard, Home, FileText } from 'lucide-react';
import { useState } from 'react';
import Link from "next/link";

export default function Page() {
  const [step, setStep] = useState(1);
  const [showComparison, setShowComparison] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    serviceType: 'mobile', // mobile or centre
    location: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    additionalNotes: ''
  });

  const services = [
    {
      id: 'essential',
      name: 'Essential Check',
      price: '$199',
      description: 'Basic HV battery evaluation and SOH measurement',
      duration: '45 mins'
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Assessment',
      price: '$299',
      description: 'Complete EV inspection including module interrogation & safety check',
      duration: '90 mins',
      popular: true
    },
    {
      id: 'pre-purchase',
      name: 'Pre-Purchase Inspection',
      price: '$399',
      description: 'Comprehensive assessment plus market analysis & history report',
      duration: '120 mins'
    }
  ];

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    }, 500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <section className="pt-48 pb-24 min-h-screen flex items-center bg-white" data-nav-theme="light">
          <div className="max-w-[800px] mx-auto px-8 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              <div className="w-24 h-24 bg-[var(--brand-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(51,74,255,0.2)]">
                <CheckCircle className="w-12 h-12 text-[var(--brand-primary)]" />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-light tracking-tight leading-[1.1]">
                Booking Confirmed!
              </h1>
              
              <p className="text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                Thank you, {formData.firstName}. Your {services.find(s => s.id === formData.service)?.name} has been scheduled.
              </p>

              <div className="bg-zinc-50 rounded-[2rem] p-8 border border-zinc-200 mt-12 text-left max-w-xl mx-auto">
                <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
                  Booking Reference: #EV-{Math.floor(Math.random() * 10000) + 1000}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-zinc-200">
                    <span className="text-zinc-500">Date</span>
                    <span className="font-medium">{new Date(formData.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-zinc-200">
                    <span className="text-zinc-500">Time</span>
                    <span className="font-medium">{formData.time}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-zinc-200">
                    <span className="text-zinc-500">Location</span>
                    <span className="font-medium text-right max-w-[200px]">{formData.location}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-zinc-500">Service</span>
                    <span className="font-medium">{services.find(s => s.id === formData.service)?.name}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <p className="text-zinc-500 text-sm">
                  A confirmation email has been sent to <span className="text-zinc-900 font-medium">{formData.email}</span>
                </p>
                <Link href="/">
                  <motion.button 
                    className="px-8 py-3 rounded-full bg-zinc-900 text-white smooth-transition hover:bg-zinc-800 flex items-center gap-2 mx-auto font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Home className="w-4 h-4" />
                    Return Home
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 flex items-center justify-center overflow-hidden bg-white" data-nav-theme="light">
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-light tracking-tight leading-[1.1]">
              Book Your Check
            </h1>
            <p className="text-base md:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              Choose your service, date and time — we'll take care of the rest
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="py-12 bg-zinc-50 border-b border-zinc-200" data-nav-theme="light">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Date & Time' },
              { num: 3, label: 'Your Details' },
              { num: 4, label: 'Confirmation' }
            ].map((s, index) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all font-mono ${
                      step >= s.num
                        ? 'bg-[var(--brand-primary)] text-white'
                        : 'bg-white border-2 border-zinc-300 text-zinc-400'
                    }`}
                    animate={step >= s.num ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                  </motion.div>
                  <span className={`ml-3 text-sm font-mono uppercase tracking-wider ${step >= s.num ? 'text-zinc-900' : 'text-zinc-400'}`}>
                    {s.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`flex-1 h-0.5 mx-4 ${step > s.num ? 'bg-[var(--brand-primary)]' : 'bg-zinc-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 bg-white" data-nav-theme="light">
        <div className="max-w-[1200px] mx-auto px-8">
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-5xl md:text-6xl font-light tracking-tight">Choose Your Service</h2>
                  <p className="text-zinc-600">Select the health check package that's right for you</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      className={`relative rounded-[2rem] p-8 cursor-pointer transition-all ${
                        formData.service === service.id
                          ? 'bg-[var(--brand-light-gray)]/30 border-2 border-[var(--brand-primary)]'
                          : 'bg-zinc-50 border-2 border-transparent hover:border-zinc-300'
                      }`}
                      onClick={() => handleInputChange('service', service.id)}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {service.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--brand-primary)] text-white text-sm font-mono uppercase tracking-wider">
                          Most Popular
                        </div>
                      )}
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl mb-2">{service.name}</h3>
                          <div className="text-4xl font-light text-[var(--brand-primary)] mb-3 font-mono">{service.price}</div>
                          <p className="text-zinc-600 text-sm">{service.description}</p>
                        </div>
                        
                        <div className="pt-6 border-t border-zinc-200">
                          <div className="flex items-center gap-2 text-sm text-zinc-600 font-mono">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Service Comparison Toggle Button */}
                <div className="flex justify-center pt-8">
                  <motion.button
                    type="button"
                    onClick={() => setShowComparison(!showComparison)}
                    className="px-6 py-2.5 rounded-full border-2 border-zinc-300 smooth-transition flex items-center gap-2 font-medium"
                    whileHover={{ scale: 1.05, y: -3, borderColor: "var(--brand-primary)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showComparison ? 'Hide' : 'Compare Services in Detail'}
                    <motion.div
                      animate={{ rotate: showComparison ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                </div>

                {/* Service Comparison Table */}
                {showComparison && (
                  <motion.div 
                    className="max-w-[1100px] mx-auto"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="overflow-x-auto">
                      <div className="min-w-[800px] bg-white rounded-[2rem] border-2 border-zinc-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-4 bg-zinc-50 border-b border-zinc-200">
                          <div className="p-6"></div>
                          <div className="p-6 text-center">
                            <div className="font-medium">Essential</div>
                            <div className="text-sm text-zinc-500 mt-1 font-mono">$199</div>
                          </div>
                          <div className="p-6 text-center bg-[var(--brand-light-gray)]/20">
                            <div className="font-medium">Comprehensive</div>
                            <div className="text-sm text-zinc-500 mt-1 font-mono">$299</div>
                          </div>
                          <div className="p-6 text-center">
                            <div className="font-medium">Pre-Purchase</div>
                            <div className="text-sm text-zinc-500 mt-1 font-mono">$399</div>
                          </div>
                        </div>

                        {/* Table Rows */}
                        {[
                          { feature: 'High-Voltage (HV) Battery Evaluation', essential: true, comprehensive: true, prePurchase: true },
                          { feature: 'State of Health (SOH) Measurement', essential: true, comprehensive: true, prePurchase: true },
                          { feature: 'Diagnostic Interrogation of Modules', essential: false, comprehensive: true, prePurchase: true },
                          { feature: 'Physical Inspection of Components', essential: false, comprehensive: true, prePurchase: true },
                          { feature: 'Safety & Tampering Assessment', essential: false, comprehensive: true, prePurchase: true },
                          { feature: 'OEM-Level Scan Tool Analysis', essential: false, comprehensive: true, prePurchase: true },
                          { feature: 'Battery Analysis Software', essential: true, comprehensive: true, prePurchase: true },
                          { feature: '12V System Test', essential: true, comprehensive: true, prePurchase: true },
                          { feature: 'Standardized Documentation', essential: true, comprehensive: true, prePurchase: true },
                          { feature: 'Vehicle History Analysis', essential: false, comprehensive: false, prePurchase: true },
                          { feature: 'Market Value Assessment', essential: false, comprehensive: false, prePurchase: true },
                          { feature: 'Future Degradation Projection', essential: false, comprehensive: false, prePurchase: true },
                          { feature: 'Warranty Status Verification', essential: false, comprehensive: false, prePurchase: true },
                          { feature: 'Negotiation Support Report', essential: false, comprehensive: false, prePurchase: true }
                        ].map((row, index) => (
                          <div 
                            key={index} 
                            className={`grid grid-cols-4 border-b border-zinc-200 last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}`}
                          >
                            <div className="p-6 text-sm text-zinc-700">{row.feature}</div>
                            <div className="p-6 flex justify-center items-center">
                              {row.essential ? (
                                <CheckCircle className="w-5 h-5 text-[var(--brand-primary)]" />
                              ) : (
                                <span className="text-zinc-300">—</span>
                              )}
                            </div>
                            <div className="p-6 flex justify-center items-center bg-[var(--brand-light-gray)]/20">
                              {row.comprehensive ? (
                                <CheckCircle className="w-5 h-5 text-[var(--brand-primary)]" />
                              ) : (
                                <span className="text-zinc-300">—</span>
                              )}
                            </div>
                            <div className="p-6 flex justify-center items-center">
                              {row.prePurchase ? (
                                <CheckCircle className="w-5 h-5 text-[var(--brand-primary)]" />
                              ) : (
                                <span className="text-zinc-300">—</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-center pt-8">
                  <motion.button
                    type="button"
                    onClick={() => formData.service && setStep(2)}
                    disabled={!formData.service}
                    className="px-8 py-3 rounded-full bg-[var(--brand-primary)] text-white smooth-transition electric-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium hover:bg-[#2030cc]"
                    whileHover={formData.service ? { scale: 1.05 } : {}}
                    whileTap={formData.service ? { scale: 0.95 } : {}}
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Date, Time & Location */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12 max-w-[900px] mx-auto"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-5xl md:text-6xl font-light tracking-tight">Select Date & Time</h2>
                  <p className="text-zinc-600">Choose when you'd like your battery health check</p>
                </div>

                {/* Service Type Selection */}
                <div className="space-y-4">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Service Type</label>
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      className={`p-6 rounded-[2rem] cursor-pointer transition-all ${
                        formData.serviceType === 'mobile'
                          ? 'bg-[var(--brand-light-gray)]/30 border-2 border-[var(--brand-primary)]'
                          : 'bg-zinc-50 border-2 border-transparent hover:border-zinc-300'
                      }`}
                      onClick={() => handleInputChange('serviceType', 'mobile')}
                      whileHover={{ y: -3 }}
                    >
                      <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-[var(--brand-primary)] flex-shrink-0" />
                        <div>
                          <h3 className="text-xl mb-2">Mobile Service</h3>
                          <p className="text-sm text-zinc-600">We come to your location — home, work, or anywhere in the metro area</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className={`p-6 rounded-[2rem] cursor-pointer transition-all ${
                        formData.serviceType === 'centre'
                          ? 'bg-[var(--brand-light-gray)]/30 border-2 border-[var(--brand-primary)]'
                          : 'bg-zinc-50 border-2 border-transparent hover:border-zinc-300'
                      }`}
                      onClick={() => handleInputChange('serviceType', 'centre')}
                      whileHover={{ y: -3 }}
                    >
                      <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-[var(--brand-primary)] flex-shrink-0" />
                        <div>
                          <h3 className="text-xl mb-2">Service Centre</h3>
                          <p className="text-sm text-zinc-600">Visit one of our diagnostic centres across Sydney and Melbourne</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Location Input */}
                {formData.serviceType === 'mobile' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <label htmlFor="location" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Service Location</label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter your address or suburb"
                      className="w-full px-6 py-4 rounded-xl bg-zinc-50 border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
                    />
                  </motion.div>
                )}

                {formData.serviceType === 'centre' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <label htmlFor="centre" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Select Centre</label>
                    <select
                      id="centre"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-zinc-50 border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
                    >
                      <option value="">Choose a location</option>
                      <option value="sydney-cbd">Sydney CBD</option>
                      <option value="sydney-north">Sydney North Shore</option>
                      <option value="sydney-west">Sydney Western Suburbs</option>
                      <option value="melbourne-cbd">Melbourne CBD</option>
                      <option value="melbourne-east">Melbourne Eastern Suburbs</option>
                    </select>
                  </motion.div>
                )}

                {/* Date Selection */}
                <div className="space-y-2">
                  <label htmlFor="date" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-6 py-4 rounded-xl bg-zinc-50 border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-4">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Preferred Time</label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {timeSlots.map((time) => (
                      <motion.button
                        key={time}
                        type="button"
                        onClick={() => handleInputChange('time', time)}
                        className={`py-3 rounded-xl transition-all font-mono ${
                          formData.time === time
                            ? 'bg-[var(--brand-primary)] text-white'
                            : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-2 border-zinc-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <motion.button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-2.5 rounded-full border-2 border-zinc-300 smooth-transition font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => formData.date && formData.time && formData.location && setStep(3)}
                    disabled={!formData.date || !formData.time || !formData.location}
                    className="px-8 py-3 rounded-full bg-[var(--brand-primary)] text-white smooth-transition electric-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium hover:bg-[#2030cc]"
                    whileHover={formData.date && formData.time && formData.location ? { scale: 1.05 } : {}}
                    whileTap={formData.date && formData.time && formData.location ? { scale: 0.95 } : {}}
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Personal Details */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12 max-w-[900px] mx-auto"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-5xl md:text-6xl font-light tracking-tight">Your Details</h2>
                  <p className="text-zinc-600">Tell us about you and your vehicle</p>
                </div>

                <div className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-2xl">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-6 py-4 rounded-xl bg-zinc-50 border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-6 py-4 rounded-xl bg-zinc-50 border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
                          placeholder="Smith"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-6 py-4 rounded-xl bg-zinc-50 border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-6 py-4 rounded-xl bg-zinc-50 border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
                          placeholder="0400 000 000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="space-y-6 pt-8 border-t border-zinc-200">
                    <h3 className="text-2xl">Vehicle Details</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="vehicleMake" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Make</label>
                        <input
                          type="text"
                          id="vehicleMake"
                          value={formData.vehicleMake}
                          onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                          className="w-full px-6 py-4 rounded-xl bg-zinc-50 border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
                          placeholder="Tesla"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="vehicleModel" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Model</label>
                        <input
                          type="text"
                          id="vehicleModel"
                          value={formData.vehicleModel}
                          onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                          className="w-full px-6 py-4 rounded-xl bg-zinc-50 border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
                          placeholder="Model 3"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="vehicleYear" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Year</label>
                        <input
                          type="text"
                          id="vehicleYear"
                          value={formData.vehicleYear}
                          onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                          className="w-full px-6 py-4 rounded-xl bg-zinc-50 border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
                          placeholder="2023"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="additionalNotes" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Additional Notes (Optional)</label>
                      <textarea
                        id="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                        rows={3}
                        className="w-full px-6 py-4 rounded-xl bg-zinc-50 border-2 border-zinc-200 focus:border-[var(--brand-primary)] focus:outline-none transition-colors resize-none"
                        placeholder="Any specific concerns about your battery?"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <motion.button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-full border-2 border-zinc-300 smooth-transition font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-8 py-3 rounded-full bg-[var(--brand-primary)] text-white smooth-transition electric-glow flex items-center gap-2 font-medium hover:bg-[#2030cc]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Confirm Booking <CheckCircle className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
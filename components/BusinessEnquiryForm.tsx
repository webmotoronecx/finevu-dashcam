"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Loader2, Send } from 'lucide-react';

interface BusinessEnquiryFormProps {
  type: 'Dealership' | 'Fleet' | 'Insurance' | 'Property';
  title?: string;
  subtitle?: string;
}

export function BusinessEnquiryForm({ type, title, subtitle }: BusinessEnquiryFormProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  if (isSuccess) {
    return (
      <div className="bg-zinc-50 rounded-3xl p-12 text-center border border-zinc-200 shadow-sm">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-3xl font-light mb-4">Enquiry Received</h3>
        <p className="text-zinc-600 max-w-lg mx-auto mb-8">
          Thanks for your interest in our {type} solutions. A member of our partnerships team will be in touch within 24 hours to discuss your specific requirements.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-[var(--brand-primary)] font-medium hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-zinc-100" id="enquire">
      <div className="mb-10">
        <h3 className="text-3xl font-light mb-3">{title || `Partner with EV360 for ${type}s`}</h3>
        <p className="text-zinc-500">{subtitle || "Fill out the form below and our dedicated business team will contact you shortly."}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formState.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none transition-all"
              placeholder="John Smith"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700">Business Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formState.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none transition-all"
              placeholder="john@company.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium text-zinc-700">Company / Organization</label>
            <input
              type="text"
              id="company"
              name="company"
              required
              value={formState.company}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none transition-all"
              placeholder="Company Name Pty Ltd"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-zinc-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formState.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none transition-all"
              placeholder="0400 000 000"
            />
          </div>
        </div>

        {/* Dynamic Fields based on Type */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium text-zinc-700">Job Title</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formState.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none transition-all"
              placeholder="Manager"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="scale" className="text-sm font-medium text-zinc-700">
              {type === 'Dealership' && 'Monthly EV Sales Volume'}
              {type === 'Fleet' && 'Fleet Size'}
              {type === 'Insurance' && 'Approx. Policies / Claims p.a.'}
              {type === 'Property' && 'Number of Parking Spaces'}
            </label>
            <select
              id="scale"
              name="scale"
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none transition-all"
            >
              <option value="">Select range...</option>
              <option value="small">1 - 10</option>
              <option value="medium">11 - 50</option>
              <option value="large">51 - 100</option>
              <option value="enterprise">100+</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-zinc-700">How can we help?</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formState.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none transition-all resize-none"
            placeholder="Tell us about your requirements..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-[var(--brand-primary)] text-white font-medium text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Sending...
            </>
          ) : (
            <>
              Submit Enquiry <Send className="w-5 h-5" />
            </>
          )}
        </motion.button>

        <p className="text-xs text-zinc-400 text-center">
          By submitting this form, you agree to our privacy policy. We protect your data.
        </p>
      </form>
    </div>
  );
}
"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Loader2, Send } from 'lucide-react';

interface BusinessEnquiryFormProps {
  /** Context label used in the success message, e.g. "Fleet", "Installation", "Stockist" */
  type?: string;
  title?: string;
  subtitle?: string;
  /** Show the company/organisation field (for trade/fleet enquiries) */
  showCompany?: boolean;
}

export function BusinessEnquiryForm({
  type = "Enquiry",
  title,
  subtitle,
  showCompany = true,
}: BusinessEnquiryFormProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: '',
    message: '',
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  if (isSuccess) {
    return (
      <div className="bg-zinc-50 rounded-3xl p-12 text-center border border-zinc-200 shadow-sm">
        <div className="w-20 h-20 bg-[var(--finevu-orange)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[var(--finevu-orange)]" />
        </div>
        <h3 className="text-3xl font-bold mb-4">Enquiry received</h3>
        <p className="text-zinc-600 max-w-lg mx-auto mb-8">
          Thanks for getting in touch about FineVu {type.toLowerCase()}. Our team will be
          in touch within one business day.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-[var(--finevu-orange)] font-medium hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-zinc-100" id="enquire">
      <div className="mb-10">
        <h3 className="text-3xl font-bold mb-3">{title || "Get in touch"}</h3>
        <p className="text-zinc-500">
          {subtitle || "Fill out the form below and our team will contact you shortly."}
        </p>
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
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--finevu-orange)] focus:ring-1 focus:ring-[var(--finevu-orange)] outline-none transition-all"
              placeholder="Jordan Smith"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formState.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--finevu-orange)] focus:ring-1 focus:ring-[var(--finevu-orange)] outline-none transition-all"
              placeholder="jordan@email.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-zinc-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formState.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--finevu-orange)] focus:ring-1 focus:ring-[var(--finevu-orange)] outline-none transition-all"
              placeholder="0400 000 000"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="product" className="text-sm font-medium text-zinc-700">Product of interest</label>
            <select
              id="product"
              name="product"
              value={formState.product}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--finevu-orange)] focus:ring-1 focus:ring-[var(--finevu-orange)] outline-none transition-all"
            >
              <option value="">Select a model...</option>
              <option value="gx4k">GX4K — 4K Dash Cam</option>
              <option value="gx35">GX35 — 2K Dash Cam</option>
              <option value="unsure">Not sure yet</option>
            </select>
          </div>
        </div>

        {showCompany && (
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium text-zinc-700">Company / Organisation (optional)</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formState.company}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--finevu-orange)] focus:ring-1 focus:ring-[var(--finevu-orange)] outline-none transition-all"
              placeholder="Company Name Pty Ltd"
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-zinc-700">How can we help?</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formState.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[var(--finevu-orange)] focus:ring-1 focus:ring-[var(--finevu-orange)] outline-none transition-all resize-none"
            placeholder="Tell us what you need..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-[var(--finevu-orange)] text-white font-semibold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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

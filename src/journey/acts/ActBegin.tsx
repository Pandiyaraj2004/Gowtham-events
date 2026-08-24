import React, { useState, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { db } from '../../data/db';
import { FiMail, FiPhone, FiMapPin, FiCheck, FiSend, FiLoader, FiShield } from 'react-icons/fi';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter a valid telephone contact number.'),
  eventType: z.string().min(1, 'Please select an event category.'),
  date: z.string().min(1, 'Please enter an estimated date.'),
  guestCount: z.string().min(1, 'Please enter estimated guest attendance.'),
  budget: z.string().min(1, 'Please select a production budget tier.'),
  notes: z.string().min(10, 'Please provide brief details on your creative vision (min 10 characters).'),
});

type InquiryFields = z.infer<typeof inquirySchema>;

export const ActBegin: React.FC = memo(() => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFields>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      eventType: 'Private Sovereign Gala',
      budget: '$250,000 – $500,000',
    },
  });

  const onSubmit = async (data: InquiryFields) => {
    setIsSubmitting(true);
    try {
      // Register inquiry directly into the central database
      await db.saveBooking({
        id: `book-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        date: data.date,
        guests: parseInt(data.guestCount, 10) || 100,
        message: `Budget Tier: ${data.budget} | Vision: ${data.notes}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      toast.success('Inquiry submitted. Our executive directorship will contact you within 12 hours.');
      setIsSubmitted(true);
      reset();
    } catch {
      toast.error('Failed to submit consultation inquiry. Please contact directorship directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="begin"
      className="relative min-h-[130vh] py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 select-none pointer-events-none"
    >
      <div className="space-y-16 pointer-events-auto">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
            <span className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-amber-500">
              Private Consultation & Atelier Inquiries
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50 leading-tight">
            Initiate Your Bespoke <br />
            <span className="text-gradient-gold">Event Consultation</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-zinc-300 font-light leading-relaxed">
            Begin the dialogue with our executive event directorship. Every engagement begins with a private concept discovery and spatial CAD feasibility study.
          </p>
        </div>

        {/* 2-Column Inquiry & Directorship Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white/70 dark:bg-zinc-900/80 backdrop-blur-2xl border border-neutral-200/80 dark:border-zinc-800 p-8 sm:p-10 shadow-2xl space-y-6">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
                  <FiCheck size={32} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-neutral-900 dark:text-zinc-50">
                  Consultation Briefing Received
                </h3>
                <p className="text-sm text-neutral-600 dark:text-zinc-400 font-light max-w-md mx-auto leading-relaxed">
                  Your inquiry has been assigned to our Executive Managing Director. We will contact you at your preferred phone and email with initial spatial concepts.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Submit Additional Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-zinc-400 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Lady Victoria Vance"
                      {...register('name')}
                      className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-neutral-900 dark:text-zinc-100 transition-colors"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-zinc-400 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="vance@heritage.com"
                      {...register('email')}
                      className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-neutral-900 dark:text-zinc-100 transition-colors"
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-zinc-400 block">
                      Telephone Contact *
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 345-6789"
                      {...register('phone')}
                      className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-neutral-900 dark:text-zinc-100 transition-colors"
                    />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>

                  {/* Event Type */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-zinc-400 block">
                      Event Category
                    </label>
                    <select
                      {...register('eventType')}
                      className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-neutral-900 dark:text-zinc-100 transition-colors"
                    >
                      <option value="Private Sovereign Gala">Private Sovereign Gala</option>
                      <option value="International Corporate Summit">International Corporate Summit</option>
                      <option value="Landmark Destination Wedding">Landmark Destination Wedding</option>
                      <option value="Haute Couture Fashion Showcase">Haute Couture Fashion Showcase</option>
                      <option value="Architectural Pavilion Launch">Architectural Pavilion Launch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Date */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-zinc-400 block">
                      Target Date
                    </label>
                    <input
                      type="date"
                      {...register('date')}
                      className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-neutral-900 dark:text-zinc-100 transition-colors"
                    />
                    {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
                  </div>

                  {/* Guest Count */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-zinc-400 block">
                      Guests
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 350"
                      {...register('guestCount')}
                      className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-neutral-900 dark:text-zinc-100 transition-colors"
                    />
                    {errors.guestCount && <p className="text-xs text-red-500">{errors.guestCount.message}</p>}
                  </div>

                  {/* Budget */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-zinc-400 block">
                      Budget Tier
                    </label>
                    <select
                      {...register('budget')}
                      className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-neutral-900 dark:text-zinc-100 transition-colors"
                    >
                      <option value="$100,000 – $250,000">$100k – $250k</option>
                      <option value="$250,000 – $500,000">$250k – $500k</option>
                      <option value="$500,000 – $1,000,000">$500k – $1.0M</option>
                      <option value="$1,000,000+">$1.0M+ (Bespoke)</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-zinc-400 block">
                    Creative Vision & Spatial Requirements *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your desired location, atmosphere, architectural cues, and specific keynote requirements..."
                    {...register('notes')}
                    className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-neutral-900 dark:text-zinc-100 transition-colors resize-none"
                  />
                  {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs font-heading font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-xl shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all duration-300 cursor-pointer"
                >
                  {isSubmitting ? (
                    <FiLoader className="animate-spin text-lg" />
                  ) : (
                    <>
                      <span>Transmit Consultation Dossier</span>
                      <FiSend size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Directorship Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-neutral-950 text-white border border-zinc-800 shadow-2xl space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-amber-500 block">
                  Global Directorship
                </span>
                <h3 className="text-2xl font-heading font-bold text-white">
                  Headquarters & Concierge
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  For immediate sovereign coordination or confidential directorship queries.
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-zinc-800/80">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <FiMapPin size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-heading font-bold uppercase tracking-wider text-zinc-300">Studio & Atelier</div>
                    <div className="text-xs text-zinc-400 font-light">750 Fifth Avenue, Floor 48, New York, NY 10019</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <FiPhone size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-heading font-bold uppercase tracking-wider text-zinc-300">Executive Hotline</div>
                    <div className="text-xs text-zinc-400 font-light">+1 (212) 555-8900 (24/7 Concierge)</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <FiMail size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-heading font-bold uppercase tracking-wider text-zinc-300">Confidential Email</div>
                    <div className="text-xs text-zinc-400 font-light">directorship@gowthamevents.com</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center gap-3">
                <FiShield className="text-amber-400 shrink-0" size={18} />
                <span className="text-[11px] text-zinc-300 font-light leading-snug">
                  All consultations strictly bound by mutual bilateral Non-Disclosure Agreements.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ActBegin.displayName = 'ActBegin';

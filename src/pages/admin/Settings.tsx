import React, { useEffect, useState } from 'react';
import { db } from '../../data/db';
import { CompanyInfo } from '../../types';
import { toast } from 'react-hot-toast';
import { FiSave, FiMapPin, FiMail, FiPhone, FiCompass } from 'react-icons/fi';

export const Settings: React.FC = () => {
  const [info, setInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    db.getCompanyInfo().then(setInfo);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info) return;

    try {
      await db.saveCompanyInfo(info);
      toast.success('Website content tokens saved successfully! Public pages updated.');
    } catch (err: any) {
      toast.error('Failed to update settings.');
    }
  };

  if (!info) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
          CMS & Site Settings
        </h1>
        <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
          Modify core website copy text and contact details immediately.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Core website texts */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-4">
            <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50 flex items-center gap-2">
              <FiCompass className="text-amber-500" /> Landing Page Header Copy
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Corporate Brand Name</label>
                <input
                  type="text"
                  required
                  value={info.name}
                  onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Hero Page Tagline</label>
                <input
                  type="text"
                  required
                  value={info.tagline}
                  onChange={(e) => setInfo({ ...info, tagline: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-555">Hero Paragraph Description</label>
                <textarea
                  required
                  value={info.description}
                  onChange={(e) => setInfo({ ...info, description: e.target.value })}
                  rows={4}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-4">
            <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50">
              Agency Contact
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-505 flex items-center gap-1.5">
                  <FiMapPin className="text-amber-500" /> Physical Location
                </label>
                <input
                  type="text"
                  required
                  value={info.address}
                  onChange={(e) => setInfo({ ...info, address: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-505 flex items-center gap-1.5">
                  <FiMail className="text-amber-500" /> Public Email
                </label>
                <input
                  type="email"
                  required
                  value={info.email}
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-555 flex items-center gap-1.5">
                  <FiPhone className="text-amber-500" /> Reception Phone
                </label>
                <input
                  type="text"
                  required
                  value={info.phone}
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-heading font-bold tracking-widest uppercase shadow-lg shadow-amber-500/10 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <FiSave size={15} /> Save Changes
          </button>
        </div>

      </form>
    </div>
  );
};
export default Settings;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { services } from '../../data/mockData';
import { FiCheck, FiArrowRight, FiLayers, FiShield } from 'react-icons/fi';

interface ActOfferingsProps {
  onScrollToAct: (actId: string) => void;
}

export const ActOfferings: React.FC<ActOfferingsProps> = ({ onScrollToAct }) => {
  const [selectedService, setSelectedService] = useState<string>(services[0].id);

  const activeServiceData = services.find((s) => s.id === selectedService) || services[0];

  const standards = [
    'Complete 3D CAD Architectural Spatial Modeling prior to fabrication',
    'Dedicated Executive Directorship & Day-of Protocol Command',
    'Custom Optical & Acoustic Spatial Simulation Testing',
    'Full Permitting, Civil Engineering & Fire Safety Sign-offs',
    '24/7 White-Glove Staging Logistics & Destination Concierge',
    'Strict Confidentiality Protocols & Encrypted Communications',
  ];

  return (
    <section
      id="offerings"
      className="relative min-h-[160vh] py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 select-none pointer-events-none"
    >
      <div className="space-y-20 pointer-events-auto">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
            <span className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-amber-500">
              Act III &bull; Bespoke Curations & Disciplines
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50 leading-tight">
            Comprehensive Spatial <br />
            <span className="text-gradient-gold">Design Disciplines</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-zinc-300 font-light leading-relaxed">
            From monumental temporary architecture to bespoke Michelin-caliber culinary curations, we engineer every layer of high-concept gathering into an unforgettable sensorial world.
          </p>
        </div>

        {/* Interactive Discipline Selector & Focus Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Discipline Quick Tabs (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-neutral-400 dark:text-zinc-500 block mb-3">
              Production Capabilities
            </span>
            <div className="space-y-2">
              {services.map((service, idx) => {
                const isSelected = service.id === selectedService;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-neutral-900 dark:text-zinc-50 shadow-lg'
                        : 'bg-white/40 dark:bg-zinc-900/40 border-neutral-200/60 dark:border-zinc-800/60 text-neutral-600 dark:text-zinc-400 hover:bg-white/80 dark:hover:bg-zinc-900/80 hover:text-neutral-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold ${isSelected ? 'text-amber-500' : 'text-neutral-400 dark:text-zinc-600'}`}>
                        0{idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wider">
                        {service.title}
                      </span>
                    </div>
                    {isSelected && <FiArrowRight className="text-amber-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Spotlight Card (7 cols) */}
          <motion.div
            key={activeServiceData.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 rounded-3xl bg-white/70 dark:bg-zinc-900/80 backdrop-blur-2xl border border-neutral-200 dark:border-zinc-800 p-8 sm:p-10 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-zinc-800 pb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block">
                  Discipline Focus
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-900 dark:text-zinc-50">
                  {activeServiceData.title}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <FiLayers size={22} />
              </div>
            </div>

            <p className="text-sm text-neutral-700 dark:text-zinc-300 font-light leading-relaxed">
              {activeServiceData.description}
            </p>

            <div className="space-y-3">
              <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-neutral-500 dark:text-zinc-400 block">
                Signature Inclusions & Deliverables:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeServiceData.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-zinc-300">
                    <FiCheck className="text-amber-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-zinc-400 font-light">
                <FiShield className="text-amber-500" />
                <span>Custom CAD & Full Structural Warranty</span>
              </div>
              <button
                type="button"
                onClick={() => onScrollToAct('begin')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-heading font-bold tracking-wider uppercase bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all cursor-pointer"
              >
                <span>Request Quotation</span>
                <FiArrowRight size={14} />
              </button>
            </div>
          </motion.div>

        </div>

        {/* Global Production Standards Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950 text-zinc-100 border border-zinc-800 space-y-6 shadow-2xl">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-amber-500 block">
              The Gowtham Standard
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Guaranteed Operational Excellence
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Every production executed by our directorship follows rigid ISO-compliant event engineering standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {standards.map((std, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  ✓
                </span>
                <span className="text-xs text-zinc-300 font-light leading-relaxed">{std}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

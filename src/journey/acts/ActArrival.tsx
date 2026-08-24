import React, { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown, FiArrowUpRight, FiAward, FiCompass, FiShield, FiTrendingUp } from 'react-icons/fi';
import { db } from '../../data/db';
import { StatCounter } from '../../components/StatCounter';

interface ActArrivalProps {
  onScrollToAct: (actId: string) => void;
}

export const ActArrival: React.FC<ActArrivalProps> = memo(({ onScrollToAct }) => {
  const [approvedCount, setApprovedCount] = useState<number>(48);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await db.getBookings();
        const confirmed = bookings.filter((b) => b.status === 'approved' || b.status === 'converted').length;
        if (confirmed > 0) {
          setApprovedCount(confirmed + 42); // Baseline verified global archive
        }
      } catch {
        // Fallback baseline
      }
    };
    fetchBookings();
  }, []);

  return (
    <section
      id="arrival"
      className="relative min-h-[135vh] flex flex-col justify-between pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 select-none pointer-events-none"
    >
      {/* Top Tag & Main Narrative */}
      <div className="max-w-3xl space-y-6 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-amber-500 dark:text-amber-400">
            Spatial Scenography & Masterpiece Direction
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50 leading-[1.08]"
        >
          Curating Landmark <br />
          <span className="text-gradient-gold">Experiences</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-base sm:text-lg text-neutral-700 dark:text-zinc-300 font-light leading-relaxed max-w-2xl"
        >
          We architect sovereign galas, monumental corporate assemblies, and ultra-luxe private celebrations across the globe with absolute cinematic precision.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <button
            type="button"
            onClick={() => onScrollToAct('begin')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-heading font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-xl shadow-amber-500/20 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span>Begin Your Event</span>
            <FiArrowUpRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => onScrollToAct('proof')}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-xs font-heading font-bold tracking-widest uppercase bg-white/10 dark:bg-zinc-900/60 backdrop-blur-md border border-white/20 dark:border-zinc-800 text-neutral-800 dark:text-zinc-200 hover:border-amber-500/40 hover:text-amber-500 transition-all active:scale-95 cursor-pointer"
          >
            <span>Explore Archive</span>
          </button>
        </motion.div>
      </div>

      {/* Center 3D Staging Spacer */}
      <div className="h-40 sm:h-56 pointer-events-none" />

      {/* Bottom Live Metrics Row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="pointer-events-auto"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white/40 dark:bg-zinc-950/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/80 shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
              <FiAward size={15} />
              <span>Executed Galas</span>
            </div>
            <StatCounter target={approvedCount} suffix="+" label="Flawlessly delivered productions" />
          </div>

          <div className="space-y-1 border-l border-neutral-200 dark:border-zinc-800/80 pl-4 sm:pl-6">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
              <FiTrendingUp size={15} />
              <span>Production Value</span>
            </div>
            <StatCounter target={50} suffix="M+" label="Managed staging budget" />
          </div>

          <div className="space-y-1 border-l border-neutral-200 dark:border-zinc-800/80 pl-4 sm:pl-6">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
              <FiCompass size={15} />
              <span>Destinations</span>
            </div>
            <StatCounter target={18} suffix=" Capitals" label="Paris, Dubai, Como, NYC, London" />
          </div>

          <div className="space-y-1 border-l border-neutral-200 dark:border-zinc-800/80 pl-4 sm:pl-6">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
              <FiShield size={15} />
              <span>Client Discretion</span>
            </div>
            <StatCounter target={100} suffix="%" label="White-glove NDA protocol" />
          </div>
        </div>

        {/* Subtle Scroll Cue */}
        <div className="flex items-center justify-center pt-8 text-neutral-400 dark:text-zinc-500 text-xs font-heading font-semibold uppercase tracking-widest gap-2">
          <span>Scroll to explore</span>
          <FiArrowDown className="animate-bounce text-amber-500" />
        </div>
      </motion.div>
    </section>
  );
});

ActArrival.displayName = 'ActArrival';

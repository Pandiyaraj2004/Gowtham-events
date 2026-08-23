import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../data/db';
import { UpcomingEvent } from '../../types';
import { upcomingEvents as defaultUpcoming } from '../../data/mockData';
import { FiMapPin, FiCalendar, FiClock, FiArrowUpRight } from 'react-icons/fi';

interface ActWhatsNextProps {
  onScrollToAct: (actId: string) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const ActWhatsNext: React.FC<ActWhatsNextProps> = ({ onScrollToAct }) => {
  const [events, setEvents] = useState<UpcomingEvent[]>(defaultUpcoming);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const stored = await db.getUpcomingEvents();
        if (stored && stored.length > 0) {
          setEvents(stored);
        }
      } catch {
        // Fallback
      }
    };
    fetchUpcoming();

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateCountdown = (dateString: string): TimeRemaining => {
    const target = new Date(dateString).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  return (
    <section
      id="whatsnext"
      className="relative min-h-[130vh] py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 select-none pointer-events-none"
    >
      <div className="space-y-16 pointer-events-auto">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
            <span className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-amber-500">
              Act VI &bull; Forward Horizons
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50 leading-tight">
            Upcoming Landmark <br />
            <span className="text-gradient-gold">Galas & Summits</span>
          </h2>
          <p className="text-sm text-neutral-600 dark:text-zinc-400 font-light leading-relaxed">
            A real-time countdown to our upcoming international assemblies, private galas, and design showcases currently undergoing fabrication.
          </p>
        </div>

        {/* Upcoming Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => {
            const countdown = calculateCountdown(event.date);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-neutral-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-500/40 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Visual Header */}
                <div className="relative aspect-[16/9] overflow-hidden bg-zinc-950">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-amber-500 text-neutral-950">
                      {event.category || 'Gala'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs">
                    <div className="flex items-center gap-1 font-medium">
                      <FiMapPin className="text-amber-400" size={13} />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-zinc-300">
                      <FiCalendar className="text-amber-400" size={13} />
                      <span>{event.date}</span>
                    </div>
                  </div>
                </div>

                {/* Event Body */}
                <div className="p-6 space-y-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-heading font-bold text-neutral-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-zinc-400 font-light leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Live Ticking Countdown Pill Grid */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                      <FiClock size={12} />
                      <span>Countdown to Curtain Call</span>
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-zinc-950/80 border border-neutral-200 dark:border-zinc-800">
                        <div className="text-base font-mono font-bold text-neutral-900 dark:text-zinc-100">
                          {countdown.days}
                        </div>
                        <div className="text-[9px] uppercase font-bold text-neutral-400 dark:text-zinc-500">Days</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-zinc-950/80 border border-neutral-200 dark:border-zinc-800">
                        <div className="text-base font-mono font-bold text-neutral-900 dark:text-zinc-100">
                          {countdown.hours}
                        </div>
                        <div className="text-[9px] uppercase font-bold text-neutral-400 dark:text-zinc-500">Hours</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-zinc-950/80 border border-neutral-200 dark:border-zinc-800">
                        <div className="text-base font-mono font-bold text-neutral-900 dark:text-zinc-100">
                          {countdown.minutes}
                        </div>
                        <div className="text-[9px] uppercase font-bold text-neutral-400 dark:text-zinc-500">Mins</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-zinc-950/80 border border-neutral-200 dark:border-zinc-800">
                        <div className="text-base font-mono font-bold text-amber-500">
                          {countdown.seconds}
                        </div>
                        <div className="text-[9px] uppercase font-bold text-neutral-400 dark:text-zinc-500">Secs</div>
                      </div>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-4 border-t border-neutral-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500 dark:text-zinc-400 font-light">
                      Capacity: Limited VIP Access
                    </span>
                    <button
                      type="button"
                      onClick={() => onScrollToAct('begin')}
                      className="inline-flex items-center gap-1 text-xs font-heading font-bold text-amber-500 hover:text-amber-400 tracking-wider uppercase cursor-pointer"
                    >
                      <span>Inquire Access</span>
                      <FiArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

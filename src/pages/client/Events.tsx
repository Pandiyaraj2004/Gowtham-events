import React from 'react';
import { FiCalendar, FiMapPin, FiUser, FiSliders, FiClock } from 'react-icons/fi';

export const Events: React.FC = () => {

  // Standard milestones timeline configuration
  const milestones = [
    { label: 'Booking Confirmed', step: 1, done: true, desc: 'Contract signed and reservation deposit processed.' },
    { label: 'Coordinator Planning', step: 2, done: true, desc: 'Assigned event manager and scheduled layout syncs.' },
    { label: 'Venue Styling', step: 3, done: false, desc: 'Finalizing floral scaffolding and light placements.' },
    { label: 'Catering Pairings', step: 4, done: false, desc: 'Reviewing menu selections and wines list.' },
    { label: 'Event Day Curation', step: 5, done: false, desc: 'On-site execution, audio checking, and host coordination.' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
          My Events & Calendar
        </h1>
        <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
          Track planning milestone statuses, inspect timelines, and review coordination meetings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Milestones Timeline Tracker */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-8">
            <h2 className="text-lg font-heading font-semibold text-neutral-909 dark:text-zinc-50 mb-2 flex items-center gap-2">
              <FiSliders className="text-amber-500" /> Curation Milestones
            </h2>
            
            {/* Timeline Vertical Stack */}
            <div className="relative border-l-2 border-neutral-200 dark:border-zinc-850 pl-8 ml-3 space-y-8">
              {milestones.map((ms, idx) => (
                <div key={idx} className="relative">
                  {/* Outer circle dot */}
                  <span className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ring-4 ring-white dark:ring-zinc-900 ${
                    ms.done 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-neutral-100 dark:bg-zinc-950 text-neutral-400 dark:text-zinc-600 border border-neutral-300 dark:border-zinc-800'
                  }`}>
                    {ms.step}
                  </span>
                  <div>
                    <h3 className={`text-sm font-heading font-bold ${ms.done ? 'text-neutral-900 dark:text-zinc-200' : 'text-neutral-400 dark:text-zinc-650'}`}>
                      {ms.label}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-zinc-450 mt-1 font-light leading-relaxed max-w-lg">
                      {ms.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Event Details & Meeting Calendars */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-4">
            <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Event Details</h2>
            
            <div className="space-y-4 text-xs text-neutral-600 dark:text-zinc-350">
              <div className="flex items-center gap-3 bg-neutral-50 dark:bg-zinc-950/40 p-3 rounded-xl">
                <FiUser className="text-amber-500 shrink-0" size={16} />
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Producer</div>
                  <div className="font-semibold text-neutral-900 dark:text-zinc-250 mt-0.5">Julian Vance</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-neutral-50 dark:bg-zinc-950/40 p-3 rounded-xl">
                <FiMapPin className="text-amber-500 shrink-0" size={16} />
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Venue Location</div>
                  <div className="font-semibold text-neutral-900 dark:text-zinc-250 mt-0.5">Villa d'Este, Lake Como, Italy</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-neutral-50 dark:bg-zinc-950/40 p-3 rounded-xl">
                <FiCalendar className="text-amber-500 shrink-0" size={16} />
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Target Date</div>
                  <div className="font-semibold text-neutral-900 dark:text-zinc-250 mt-0.5">June 18, 2026</div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Calendar (Meetings list) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-4">
            <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500 flex items-center gap-1.5">
              <FiClock /> Project Calendar
            </h2>
            
            <div className="space-y-3">
              <div className="p-3 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-100 dark:border-zinc-850 rounded-xl text-xs">
                <div className="font-bold text-neutral-900 dark:text-zinc-250">July 30, 2026</div>
                <div className="text-neutral-500 mt-1">Deadline: Complete Menu Selections</div>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-100 dark:border-zinc-850 rounded-xl text-xs">
                <div className="font-bold text-neutral-900 dark:text-zinc-250">August 10, 2026</div>
                <div className="text-neutral-500 mt-1">Audio check: Lake Como Strings</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Events;

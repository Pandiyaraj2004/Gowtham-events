import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { teamMembers, companyInfo } from '../../data/mockData';
import { FiLinkedin, FiInstagram, FiTwitter, FiCompass } from 'react-icons/fi';

export const ActStory: React.FC = memo(() => {
  const milestones = [
    {
      year: '2018',
      title: 'Foundation of Gowtham Events',
      desc: 'Established as an avant-garde bespoke design studio in New York, curating private estate gatherings and conceptual art galas.',
    },
    {
      year: '2020',
      title: 'Kinetic Scenography & In-House Fabrication',
      desc: 'Integrated structural engineering and dynamic computerized stage lighting direction into our core production directorship.',
    },
    {
      year: '2022',
      title: 'International Sovereign Footprint',
      desc: 'Expanded destination operations across Lake Como, Paris, and Dubai, orchestrating sovereign summits and landmark private weddings.',
    },
    {
      year: '2024',
      title: 'Holographic & Multi-Sensory Integration',
      desc: 'Pioneered real-time spatial projection mapping, algorithmic lighting fixtures, and custom olfactory atmospheres.',
    },
    {
      year: '2026',
      title: 'Sustainable Architectural Masterpieces',
      desc: 'Setting the benchmark for carbon-neutral luxury event construction, zero-waste floral installations, and modular staging.',
    },
  ];

  const pillars = [
    {
      title: 'Architectural Rigor',
      desc: 'Every space is calculated with CAD precision, ensuring structural safety, optical sightlines, and flawless acoustic dispersion.',
    },
    {
      title: 'Cinematic Scenography',
      desc: 'Lighting, materials, and motion are choreographed as a single emotional crescendo that captivates from entrance to finale.',
    },
    {
      title: 'Absolute Discretion',
      desc: 'Strict non-disclosure agreements, encrypted communications, and discreet VIP handling protocols for all high-profile gatherings.',
    },
  ];

  return (
    <section
      id="story"
      className="relative min-h-[160vh] py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 select-none pointer-events-none"
    >
      <div className="space-y-24 pointer-events-auto">
        {/* Header & Philosophy */}
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
            <span className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-amber-500">
              Our Story & Creative Philosophy
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50 leading-tight">
            Engineering Emotion Through <br />
            <span className="text-gradient-gold">Architectural Staging</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-zinc-300 font-light leading-relaxed">
            {companyInfo.history}
          </p>
        </div>

        {/* 3 Pillars of Excellence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="p-8 rounded-3xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-neutral-200/80 dark:border-zinc-800/80 shadow-xl space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-mono font-bold text-sm">
                0{i + 1}
              </div>
              <h3 className="text-lg font-heading font-bold text-neutral-900 dark:text-zinc-50">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-400 font-light leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Chronological Milestone Journey */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-amber-500 block">
                Historical Progression
              </span>
              <h3 className="text-2xl font-heading font-bold text-neutral-900 dark:text-zinc-50">
                Milestones of Craft
              </h3>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-zinc-400">
              <FiCompass className="text-amber-500" />
              <span>2018 — Present Day</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((m, idx) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-white/40 dark:bg-zinc-950/60 backdrop-blur-md border border-neutral-200/60 dark:border-zinc-850 shadow-lg space-y-2 group hover:border-amber-500/40 transition-colors"
              >
                <div className="text-xs font-mono font-bold text-amber-500 tracking-wider">
                  {m.year}
                </div>
                <h4 className="text-base font-heading font-bold text-neutral-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                  {m.title}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-zinc-400 font-light leading-relaxed">
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Executive Directorship Grid */}
        <div className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-amber-500 block">
              Executive Directorship
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-900 dark:text-zinc-50">
              The Curators Behind the Scenes
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-400 font-light">
              Master architects, lighting designers, production directors, and protocol specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group rounded-3xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-neutral-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-base font-heading font-bold">{member.name}</div>
                    <div className="text-[11px] text-amber-400 font-medium uppercase tracking-wider">{member.role}</div>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-xs text-neutral-600 dark:text-zinc-400 font-light leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 dark:border-zinc-800/60 text-neutral-500 dark:text-zinc-400">
                    <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors" aria-label="LinkedIn">
                      <FiLinkedin size={15} />
                    </a>
                    <a href={member.socials.twitter} target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors" aria-label="Twitter">
                      <FiTwitter size={15} />
                    </a>
                    <a href={member.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors" aria-label="Instagram">
                      <FiInstagram size={15} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

ActStory.displayName = 'ActStory';

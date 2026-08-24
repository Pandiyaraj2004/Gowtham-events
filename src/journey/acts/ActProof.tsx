import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/db';
import { Project } from '../../types';
import { projects as defaultProjects } from '../../data/mockData';
import { FiMapPin, FiCalendar, FiUsers, FiMaximize2, FiArrowUpRight, FiX } from 'react-icons/fi';
import { Lightbox } from '../../components/Lightbox';

interface ActProofProps {
  onScrollToAct: (actId: string) => void;
}

export const ActProof: React.FC<ActProofProps> = memo(({ onScrollToAct }) => {
  const [projectList, setProjectList] = useState<Project[]>(defaultProjects);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const stored = await db.getProjects();
        if (stored && stored.length > 0) {
          setProjectList(stored);
        }
      } catch {
        // Fallback to default
      }
    };
    fetchProjects();
  }, []);

  const categories = ['All', 'Corporate', 'Wedding', 'Festival', 'Private'];

  const filteredProjects = selectedCategory === 'All'
    ? projectList
    : projectList.filter((p) =>
      (p.category || '').toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (p.name || '').toLowerCase().includes(selectedCategory.toLowerCase())
    );

  const allImages = projectList.map((p) => p.image).filter(Boolean);

  const openLightboxForProject = (project: Project) => {
    const idx = allImages.indexOf(project.image);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  return (
    <section
      id="proof"
      className="relative min-h-[180vh] py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 select-none pointer-events-none"
    >
      <div className="space-y-16 pointer-events-auto">
        {/* Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-200 dark:border-zinc-800 pb-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-amber-500">
                Masterpiece Archive & Global Productions
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50 leading-tight">
              Proven Excellence on <br />
              <span className="text-gradient-gold">the Global Stage</span>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-zinc-400 font-light leading-relaxed">
              Explore an archive of landmark productions executed for sovereign states, global luxury houses, and discerning private hosts.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'bg-white/40 dark:bg-zinc-900/60 border border-neutral-200/80 dark:border-zinc-800 text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.15 }}
              className="group rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-neutral-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-500/40 transition-all duration-500 flex flex-col justify-between"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
                    {project.category}
                  </span>
                </div>

                {/* Quick Enlarge Button */}
                <button
                  type="button"
                  onClick={() => openLightboxForProject(project)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-amber-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                  title="Enlarge Image"
                  aria-label="Enlarge Image"
                >
                  <FiMaximize2 size={14} />
                </button>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs">
                  <div className="flex items-center gap-1.5 font-medium">
                    <FiMapPin className="text-amber-400" size={13} />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-zinc-300">
                    <FiCalendar className="text-amber-400" size={13} />
                    <span>{project.date}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-bold text-neutral-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-zinc-400 font-light leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-zinc-400">
                    <FiUsers className="text-amber-500" size={13} />
                    <span>Distinguished Guests</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    className="inline-flex items-center gap-1 text-xs font-heading font-bold text-amber-500 hover:text-amber-400 tracking-wider uppercase cursor-pointer"
                  >
                    <span>Inspect</span>
                    <FiArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Project Modal Drawer */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="relative aspect-[21/9] bg-zinc-950 overflow-hidden shrink-0">
                  <img
                    src={activeProject.image}
                    alt={activeProject.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <button
                    onClick={() => setActiveProject(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                  >
                    <FiX size={18} />
                  </button>
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-amber-500 text-neutral-950">
                      {activeProject.category}
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-heading font-black">
                      {activeProject.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-zinc-300 font-light pt-1">
                      <span>{activeProject.location}</span>
                      <span>&bull;</span>
                      <span>{activeProject.date}</span>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-8 overflow-y-auto space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-heading font-bold uppercase tracking-widest text-amber-500">
                      Executive Narrative & Scenography
                    </h4>
                    <p className="text-sm sm:text-base text-neutral-700 dark:text-zinc-300 font-light leading-relaxed">
                      {activeProject.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-zinc-800">
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">Spatial Engineering</span>
                      <p className="text-xs text-neutral-700 dark:text-zinc-300 font-medium">Bespoke 3D kinetic truss layout with computational illumination.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">Guest Hospitality</span>
                      <p className="text-xs text-neutral-700 dark:text-zinc-300 font-medium">Multi-tier VIP security protocol and Michelin-tier catering.</p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-4">
                    <button
                      onClick={() => openLightboxForProject(activeProject)}
                      className="px-5 py-2.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider border border-neutral-300 dark:border-zinc-700 text-neutral-800 dark:text-zinc-200 hover:border-amber-500 hover:text-amber-500 transition-colors"
                    >
                      Enlarge Visual
                    </button>
                    <button
                      onClick={() => {
                        setActiveProject(null);
                        onScrollToAct('begin');
                      }}
                      className="px-6 py-2.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
                    >
                      Inquire for Similar Vision
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Lightbox Component */}
        <Lightbox
          isOpen={lightboxOpen}
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
          onNext={() => setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
        />
      </div>
    </section>
  );
});

ActProof.displayName = 'ActProof';

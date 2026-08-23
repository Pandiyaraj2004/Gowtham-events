import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { Button } from '../../components/Button';
import { SectionTitle } from '../../components/SectionTitle';
import { StatCounter } from '../../components/StatCounter';
import { HeroCanvas } from '../../components/3d/HeroCanvas';
import { db } from '../../data/db';
import { Service, Project, Testimonial } from '../../types';
import { values, partners } from '../../data/mockData';

export const Home: React.FC = () => {
  useSEO({
    title: 'Luxury Event Management & Experiential Design Agency',
    description:
      'Gowtham Events is a premier luxury event management and design agency, curating bespoke weddings, corporate galas, and immersive sensory productions worldwide.',
  });

  const heroContainerRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    db.getServices().then((data) => setServices(data.slice(0, 3)));
    db.getProjects().then((data) => setProjects(data.slice(0, 3)));
    db.getTestimonials().then(setTestimonials);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="relative overflow-hidden bg-primary text-primary">
      {/* =====================================================================
          1. Full-Bleed 3D Shader Hero Section
          ===================================================================== */}
      <section
        ref={heroContainerRef}
        className="relative min-h-[95vh] md:min-h-screen flex items-center justify-center px-6 md:px-12 py-24 overflow-hidden"
      >
        {/* WebGL 3D Canvas Background Layer */}
        <HeroCanvas containerRef={heroContainerRef} />

        {/* Hero Content Overlay */}
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center pt-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glassmorphism text-[10px] sm:text-xs font-heading font-bold tracking-[0.2em] text-amber-500 uppercase mb-8 border border-amber-500/20 shadow-lg"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>Luxury Event Curators</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl font-heading font-black tracking-tight leading-[1.04] mb-8 select-none"
          >
            Designing Bespoke <br className="hidden md:inline" />
            <span className="text-gradient-gold">Masterpieces</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="max-w-2xl text-base md:text-xl text-neutral-400 dark:text-zinc-300 font-light leading-relaxed mb-12"
          >
            We merge high-scenography architecture, sensory innovation, and military-precision logistics to construct unforgettable gathering environments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <Button to="/contact" variant="primary">
              Plan Your Event <FiArrowRight className="inline ml-1" />
            </Button>
            <Button to="/portfolio" variant="glass">
              Explore Showcase
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none opacity-60">
          <span className="text-[9px] font-heading uppercase tracking-[0.3em] text-neutral-400 dark:text-zinc-500">
            Scroll to Discover
          </span>
          <div className="w-4 h-7 rounded-full border border-neutral-400 dark:border-zinc-700 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-1 h-1.5 rounded-full bg-amber-500"
            />
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. Staggered Glass Stat Cards & Company Philosophy
          ===================================================================== */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-neutral-200 dark:border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-amber-500 font-heading text-xs font-bold uppercase tracking-[0.2em] block">
              About Gowtham Events
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-neutral-900 dark:text-zinc-50 leading-tight">
              Transforming ambitious visions into seamless realities.
            </h2>
            <p className="text-neutral-500 dark:text-zinc-400 leading-relaxed font-light">
              Gowtham Events orchestrates bespoke experiences for high-profile private clients, Fortune 500 corporations, and global cultural brands. We oversee every layer—from initial CAD structural drafts and acoustic engineering to Michelin-paired gastronomy.
            </p>
            <p className="text-neutral-500 dark:text-zinc-400 leading-relaxed font-light">
              Our multidisciplinary team of architect-scenographers, technical producers, and hospitality concierges guarantees absolute precision and discreet, flawless execution.
            </p>
            <div className="pt-2">
              <Button to="/about" variant="secondary">
                Our Heritage & Story
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-6">
            <StatCounter target={150} suffix="+" label="Events Curated" />
            <StatCounter target={25} suffix="+" label="Global Partners" />
            <StatCounter target={8} suffix="" label="Years of Excellence" />
            <StatCounter target={99} suffix="%" label="Client Satisfaction" />
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. Curated Services Catalog Showcase
          ===================================================================== */}
      <section className="py-24 bg-neutral-100/40 dark:bg-zinc-900/30 border-y border-neutral-200 dark:border-zinc-900 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16">
            <div>
              <span className="text-amber-500 font-heading text-xs font-bold uppercase tracking-[0.2em] block mb-3">
                Disciplines
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-neutral-900 dark:text-zinc-50">
                Curated Event Disciplines
              </h2>
            </div>
            <NavLink
              to="/services"
              className="text-amber-500 font-heading font-bold text-xs tracking-widest uppercase flex items-center gap-2 group hover:text-amber-400 mt-6 md:mt-0 transition-colors"
            >
              Explore All Disciplines{' '}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="glow-card rounded-3xl overflow-hidden premium-shadow group flex flex-col h-full bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-850"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/25 to-transparent" />
                  <h3 className="absolute bottom-6 left-6 right-6 text-xl font-heading font-bold text-white">
                    {service.title}
                  </h3>
                </div>
                <div className="p-7 flex flex-col justify-between flex-grow">
                  <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed font-light mb-6 line-clamp-3">
                    {service.description}
                  </p>
                  <NavLink
                    to="/services"
                    className="text-amber-500 text-xs font-heading font-bold uppercase tracking-wider hover:text-amber-400 inline-flex items-center gap-1"
                  >
                    Discover Discipline <FiArrowRight size={13} />
                  </NavLink>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          4. Completed Masterpieces (Portfolio Highlights)
          ===================================================================== */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16">
          <div>
            <span className="text-amber-500 font-heading text-xs font-bold uppercase tracking-[0.2em] block mb-3">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-neutral-900 dark:text-zinc-50">
              Completed Masterpieces
            </h2>
          </div>
          <NavLink
            to="/portfolio"
            className="text-amber-500 font-heading font-bold text-xs tracking-widest uppercase flex items-center gap-2 group hover:text-amber-400 mt-6 md:mt-0 transition-colors"
          >
            View Complete Portfolio{' '}
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </NavLink>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="glow-card rounded-3xl overflow-hidden premium-shadow group flex flex-col bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-850"
            >
              <div className="h-72 overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-heading font-bold tracking-widest uppercase bg-zinc-950/80 backdrop-blur-md text-amber-500 rounded-full border border-amber-500/20">
                  {project.category}
                </span>
              </div>
              <div className="p-7 flex flex-col justify-between flex-grow">
                <div>
                  <div className="text-xs text-neutral-450 dark:text-zinc-500 mb-2 font-medium">
                    {project.location} &bull; {project.date}
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-3 group-hover:text-amber-500 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed mb-6 font-light line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <NavLink
                  to="/portfolio"
                  className="text-amber-500 text-xs font-heading font-bold uppercase tracking-wider hover:text-amber-400 inline-flex items-center gap-1.5"
                >
                  View Case Study <FiArrowRight size={13} />
                </NavLink>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* =====================================================================
          5. The Gowtham Philosophy
          ===================================================================== */}
      <section className="py-24 bg-neutral-100/40 dark:bg-zinc-900/30 border-y border-neutral-200 dark:border-zinc-900 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="The Gowtham Philosophy"
            subtitle="Core Standards"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800/80 premium-shadow text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 font-heading font-bold text-lg border border-amber-500/20">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-3">
                  {val.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed font-light">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. Testimonials
          ===================================================================== */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <SectionTitle
          title="Distinguished Acclaim"
          subtitle="Client Testimonials"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-8 md:p-9 rounded-3xl glow-card premium-shadow flex flex-col justify-between bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-850"
            >
              <p className="text-neutral-600 dark:text-zinc-300 italic leading-relaxed text-sm mb-8 font-light">
                "{test.review}"
              </p>
              <div className="flex items-center gap-4 border-t border-neutral-100 dark:border-zinc-850 pt-5">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-12 h-12 rounded-full object-cover border border-amber-500/30"
                />
                <div>
                  <h4 className="text-sm font-heading font-bold text-neutral-900 dark:text-zinc-100">
                    {test.name}
                  </h4>
                  <p className="text-xs text-neutral-450 dark:text-zinc-500 font-light">
                    {test.role}, {test.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          7. Partner Brands Marquee
          ===================================================================== */}
      <section className="py-16 bg-neutral-200/40 dark:bg-zinc-950 border-y border-neutral-200/60 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-neutral-400 dark:text-zinc-600 block mb-8">
            Collaborating with Elite Global Brands
          </span>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-60 hover:opacity-90 transition-opacity duration-300">
            {partners.map((partner) => (
              <span
                key={partner.id}
                className="font-heading font-bold text-lg md:text-2xl tracking-[0.2em] text-neutral-500 dark:text-zinc-600"
              >
                {partner.name.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. Call to Action
          ===================================================================== */}
      <section className="py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-12 md:p-20 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl premium-shadow">
          <span className="text-amber-500 font-heading text-xs font-bold uppercase tracking-[0.2em] block mb-4">
            Private Consultation
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-neutral-900 dark:text-zinc-50 mb-6 leading-tight">
            Ready to design your <br />
            next milestone experience?
          </h2>
          <p className="text-neutral-500 dark:text-zinc-400 font-light max-w-xl mx-auto mb-10 leading-relaxed">
            Connect with our executive concierge team. We conduct initial spatial feasibility reviews, structural drafts, and concept sketches for all private briefs.
          </p>
          <Button to="/contact" variant="primary">
            Begin the Conversation <FiArrowRight className="inline ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiArrowUpRight } from 'react-icons/fi';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';
import { ZONES, getZoneByProgress } from '../journey/content/zoneRegistry';

interface NavScrollSpyProps {
  progress: number;
  onNavigate?: (actId: string) => void;
}

export const NavScrollSpy: React.FC<NavScrollSpyProps> = ({ progress, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentZone = getZoneByProgress(progress);

  useEffect(() => {
    setScrolled(progress > 0.02);
  }, [progress]);

  const scrollToAct = (actId: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(actId);
      return;
    }

    const targetEl = document.getElementById(actId);
    if (targetEl) {
      // Use Lenis global if available
      const win = window as any;
      if (win.__lenis) {
        win.__lenis.scrollTo(targetEl, { offset: 0, duration: 1.2 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3.5 bg-black/40 dark:bg-black/60 backdrop-blur-xl border-b border-white/10 dark:border-white/5 shadow-2xl'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <button
            type="button"
            onClick={() => scrollToAct('arrival')}
            className="flex items-center gap-3 group text-left cursor-pointer select-none"
            aria-label="Gowtham Events Home"
          >
            <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 shadow-md group-hover:scale-105 transition-transform duration-300">
              <Logo size={24} className="text-neutral-950" />
            </span>
            <div className="flex flex-col">
              <span className="font-heading font-black text-lg sm:text-xl tracking-wider text-neutral-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">
                GOWTHAM
              </span>
              <span className="text-[9px] font-heading font-bold tracking-[0.28em] uppercase text-amber-500 -mt-1">
                EVENTS
              </span>
            </div>
          </button>

          {/* Desktop Nav Scroll-Spy Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/10 dark:bg-zinc-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 dark:border-zinc-800/80 shadow-inner">
            {ZONES.map((zone) => {
              const isActive = currentZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => scrollToAct(zone.id)}
                  className={`relative px-4 py-2 rounded-full text-xs font-heading font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer select-none ${
                    isActive
                      ? 'text-neutral-950 dark:text-amber-400 font-bold'
                      : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeZoneIndicator"
                      className="absolute inset-0 bg-amber-400 dark:bg-amber-500/20 rounded-full border border-amber-500/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{zone.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-white/10 dark:bg-zinc-900/60 backdrop-blur-md border border-white/15 dark:border-zinc-800 text-neutral-700 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
              aria-label="Toggle dark/light mode"
            >
              {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>

            {/* Portal Sign-In Pill */}
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-white/10 dark:bg-zinc-900/60 backdrop-blur-md border border-white/15 dark:border-zinc-800 text-neutral-700 dark:text-zinc-200 hover:border-amber-500/50 hover:text-amber-500 transition-all"
            >
              <FiUser size={14} className="text-amber-500" />
              <span>Portal</span>
            </Link>

            {/* Direct CTA */}
            <button
              type="button"
              onClick={() => scrollToAct('begin')}
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-heading font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>Inquire</span>
              <FiArrowUpRight size={15} />
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full bg-white/10 dark:bg-zinc-900/60 backdrop-blur-md border border-white/15 dark:border-zinc-800 text-neutral-700 dark:text-zinc-300"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

        </div>

        {/* Dynamic Journey Progress Micro-Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
            transition={{ ease: 'linear', duration: 0.1 }}
          />
        </div>
      </header>

      {/* Mobile Nav Slide-Down Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-20 z-40 p-4 lg:hidden"
          >
            <div className="bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-zinc-400">
                  Story Journey Navigation
                </span>
                <span className="text-xs font-bold text-amber-500 uppercase">
                  {currentZone.actRoman} &bull; {currentZone.label}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1">
                {ZONES.map((zone) => {
                  const isActive = currentZone.id === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => scrollToAct(zone.id)}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                          : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-zinc-500">{zone.actRoman}</span>
                        <span className="text-sm font-heading font-semibold uppercase tracking-wider">
                          {zone.label}
                        </span>
                      </div>
                      {isActive && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-3 text-center rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-heading font-bold uppercase tracking-wider text-zinc-200"
                >
                  Portal Login
                </Link>
                <button
                  type="button"
                  onClick={() => scrollToAct('begin')}
                  className="flex-1 py-3 text-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 text-xs font-heading font-bold uppercase tracking-wider"
                >
                  Inquire Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

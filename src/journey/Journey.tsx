import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useJourneyScroll } from './useJourneyScroll';
import { NavScrollSpy } from '../components/NavScrollSpy';
import { JourneyCanvas } from './JourneyCanvas';
import { ActArrival } from './acts/ActArrival';
import { ActStory } from './acts/ActStory';
import { ActOfferings } from './acts/ActOfferings';
import { ActProof } from './acts/ActProof';
import { ActMoments } from './acts/ActMoments';
import { ActWhatsNext } from './acts/ActWhatsNext';
import { ActBegin } from './acts/ActBegin';
import { Logo } from '../components/Logo';
import { FiArrowUp, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { useSEO } from '../hooks/useSEO';

export const Journey: React.FC = () => {
  const progress = useJourneyScroll();
  const location = useLocation();

  useSEO({
    title: 'Gowtham Events — Luxury Event Architecture & Coordination',
    description:
      'A continuous 3D journey through bespoke event architecture, spatial scenography, and monumental private galas by Gowtham Events.',
  });

  const handleScrollToAct = useCallback((actId: string) => {
    const targetEl = document.getElementById(actId);
    if (targetEl) {
      const win = window as any;
      if (win.__lenis) {
        win.__lenis.scrollTo(targetEl, { offset: 0, duration: 1.4 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  // Handle deep-link redirects (e.g. /about, /services redirecting to / with state.scrollTo)
  useEffect(() => {
    const target = (location.state as any)?.scrollTo;
    if (target) {
      // Delay slightly for initial render & Lenis initialization
      const timer = setTimeout(() => {
        handleScrollToAct(target);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.state, handleScrollToAct]);

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-800 dark:text-zinc-200 selection:bg-amber-500 selection:text-neutral-950 transition-colors duration-300">
      
      {/* 1. Fixed Header Navigation with Scroll-Spy */}
      <NavScrollSpy progress={progress} onNavigate={handleScrollToAct} />

      {/* 2. Single Persistent 3D WebGL World Canvas */}
      <JourneyCanvas progress={progress} />

      {/* 3. Seven Narrative Acts (HTML Overlay Layer) */}
      <main className="relative z-10 w-full overflow-hidden">
        <ActArrival onScrollToAct={handleScrollToAct} />
        <ActStory />
        <ActOfferings onScrollToAct={handleScrollToAct} />
        <ActProof onScrollToAct={handleScrollToAct} />
        <ActMoments />
        <ActWhatsNext onScrollToAct={handleScrollToAct} />
        <ActBegin />
      </main>

      {/* 4. Luxury Footer */}
      <footer className="relative z-10 bg-black/80 dark:bg-black/90 backdrop-blur-2xl border-t border-white/10 dark:border-zinc-900 text-zinc-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Brand & Monogram */}
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 shadow-md">
              <Logo size={22} className="text-neutral-950" />
            </span>
            <div>
              <div className="font-heading font-black text-sm tracking-wider text-white">GOWTHAM EVENTS</div>
              <div className="text-[9px] font-heading font-bold tracking-[0.25em] text-amber-500 uppercase">
                Bespoke Spatial Architecture
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-xs text-zinc-400 font-light text-center">
            &copy; 2026 Gowtham Events. All rights reserved. Sovereign Event Directorship & Atelier.
          </div>

          {/* Social & Back to Top */}
          <div className="flex items-center gap-4 text-zinc-400">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors" aria-label="LinkedIn">
              <FiLinkedin size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors" aria-label="Twitter">
              <FiTwitter size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors" aria-label="Instagram">
              <FiInstagram size={16} />
            </a>
            <button
              type="button"
              onClick={() => handleScrollToAct('arrival')}
              className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-400 text-zinc-300 transition-all cursor-pointer ml-2"
              title="Return to Horizon"
              aria-label="Return to Top"
            >
              <FiArrowUp size={15} />
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Journey;

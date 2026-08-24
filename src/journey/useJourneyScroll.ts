// src/journey/useJourneyScroll.ts
// Ultra high-performance scroll pipeline powered by Lenis + GSAP ScrollTrigger
// Decouples scroll progress calculations from React re-renders for butter-smooth 60+ FPS

import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Global mutable progress store - accessed directly inside Three.js useFrame without React diffing
class JourneyScrollStore {
  private progress = 0;
  private listeners = new Set<(progress: number) => void>();

  get current(): number {
    return this.progress;
  }

  set(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    if (this.progress !== clamped) {
      this.progress = clamped;
      this.listeners.forEach((fn) => fn(clamped));
    }
  }

  subscribe(listener: (progress: number) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const journeyScrollStore = new JourneyScrollStore();

export function getJourneyProgress(): number {
  return journeyScrollStore.current;
}

export function subscribeJourneyProgress(cb: (p: number) => void): () => void {
  return journeyScrollStore.subscribe(cb);
}

/**
 * Initializes global Lenis smooth scroller & GSAP ScrollTrigger
 * Keeps main thread free of continuous React state diffing
 */
export function useJourneyScrollEngine() {
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    // 1. Initialize Lenis Smooth Scroller with optimized damping
    const lenis = new Lenis({
      duration: isTouch ? 0.9 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.2,
      wheelMultiplier: 1.0,
      autoRaf: false,
    });

    // Expose lenis instance globally for programmatic smooth scrolling
    (window as any).__lenis = lenis;

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    // Enable GSAP lag smoothing to absorb frame hitches gracefully instead of jumping
    gsap.ticker.lagSmoothing(500, 33);

    // 3. Create Main Journey ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: isTouch ? 0.4 : 0.6,
      onUpdate: (self) => {
        journeyScrollStore.set(self.progress);
      },
    });

    // 4. Handle resize and orientation changes efficiently
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      trigger.kill();
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);
}

/**
 * Optional hook for components that need reactive state (throttled)
 */
export function useJourneyProgressState(): number {
  const [progress, setProgress] = useState<number>(() => journeyScrollStore.current);

  useEffect(() => {
    return subscribeJourneyProgress((p) => {
      setProgress(p);
    });
  }, []);

  return progress;
}

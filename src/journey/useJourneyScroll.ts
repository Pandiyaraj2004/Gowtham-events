// src/journey/useJourneyScroll.ts
// Hook providing normalized scroll progress (0.0 to 1.0) powered by Lenis + GSAP ScrollTrigger

import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useJourneyScroll(): number {
  const [progress, setProgress] = useState<number>(0);
  const progressRef = useRef<number>(0);

  useEffect(() => {
    // Check user agent for touch-specific damping
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    // 1. Initialize Lenis Smooth Scroller
    const lenis = new Lenis({
      duration: isTouch ? 1.0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Expose lenis instance globally for programmatic smooth scrolling
    (window as any).__lenis = lenis;

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // 3. Create Main Journey ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: isTouch ? 0.6 : 0.8,
      onUpdate: (self) => {
        const val = Math.max(0, Math.min(1, self.progress));
        progressRef.current = val;
        setProgress(val);
      },
    });

    // 4. Handle resize and orientation changes
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      trigger.kill();
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return progress;
}

import React, { createContext, useContext, useEffect, useState } from 'react';

export type PerfTier = 'high' | 'mid' | 'low';

interface PerfTierContextValue {
  tier: PerfTier;
  isMobile: boolean;
  reducedMotion: boolean;
  dpr: [number, number];
}

const PerfTierContext = createContext<PerfTierContextValue>({
  tier: 'high',
  isMobile: false,
  reducedMotion: false,
  dpr: [1, 1.5],
});

export const PerfTierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tier, setTier] = useState<PerfTier>('high');
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Check reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hasReducedMotion = motionQuery.matches;
    setReducedMotion(hasReducedMotion);

    // 2. Check mobile agent & screen width
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileCheck =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
      window.innerWidth < 768;
    setIsMobile(mobileCheck);

    if (hasReducedMotion) {
      setTier('low');
      return;
    }

    // 3. Hardware concurrency & GPU detection
    const cores = navigator.hardwareConcurrency || 4;
    
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

      if (!gl) {
        setTier('low');
        return;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()
        : '';

      const isIntegrated =
        renderer.includes('intel') ||
        renderer.includes('mali') ||
        renderer.includes('adreno') ||
        renderer.includes('apple gpu') ||
        renderer.includes('powervr') ||
        renderer.includes('software') ||
        renderer.includes('llvmpipe');

      if (mobileCheck) {
        setTier(cores >= 8 && !isIntegrated ? 'mid' : 'mid');
      } else {
        if (cores >= 8 && !isIntegrated) {
          setTier('high');
        } else if (cores >= 4) {
          setTier('mid');
        } else {
          setTier('low');
        }
      }
    } catch {
      setTier(mobileCheck ? 'mid' : 'high');
    }
  }, []);

  const dpr: [number, number] = tier === 'high' ? [1, 1.5] : tier === 'mid' ? [1, 1.25] : [1, 1];

  return (
    <PerfTierContext.Provider value={{ tier, isMobile, reducedMotion, dpr }}>
      {children}
    </PerfTierContext.Provider>
  );
};

export const usePerfTier = () => {
  return useContext(PerfTierContext);
};

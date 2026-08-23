/**
 * Performance Tier Detection for WebGL & 3D Rendering
 * High: Full shader hero, bloom + chromatic aberration + vignette, physics, full particles
 * Mid: Shader hero, bloom only, no physics interaction, halved particles
 * Low / Reduced-Motion: Static fallback poster, zero WebGL loaded
 */

export type PerformanceTier = 'high' | 'mid' | 'low';

export const getPerformanceTier = (): PerformanceTier => {
  if (typeof window === 'undefined') return 'low';

  // 1. Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return 'low';
  }

  // 2. Check WebGL support
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'low';
  } catch (e) {
    return 'low';
  }

  // 3. Hardware concurrency & memory check
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;

  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    if (cores >= 8 && memory >= 6) {
      return 'mid';
    }
    return 'low';
  }

  if (cores >= 8 && memory >= 8) {
    return 'high';
  }

  if (cores >= 4 && memory >= 4) {
    return 'mid';
  }

  return 'low';
};

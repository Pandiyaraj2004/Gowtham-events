// src/journey/zoneManager.ts
// Lifecycle engine for mounting and disposing 3D zone assets based on scroll proximity

import { ZONES, ZoneId } from './content/zoneRegistry';

const PRELOAD_MARGIN = 0.03; // Preload zone 3% before entering range to prevent pop-in

export function activeZones(progress: number): ZoneId[] {
  const cleanP = Math.max(0, Math.min(1, progress));
  return ZONES.filter(
    (z) => cleanP >= z.range[0] - PRELOAD_MARGIN && cleanP <= z.range[1] + PRELOAD_MARGIN
  ).map((z) => z.id);
}

export function isZoneActive(zoneId: ZoneId, progress: number): boolean {
  const zone = ZONES.find((z) => z.id === zoneId);
  if (!zone) return false;
  const cleanP = Math.max(0, Math.min(1, progress));
  return cleanP >= zone.range[0] - PRELOAD_MARGIN && cleanP <= zone.range[1] + PRELOAD_MARGIN;
}

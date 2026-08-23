// src/journey/content/ActOfferings.content.ts
// 3D parameters and geometry descriptors for the services discipline emblems

export interface DisciplineEmblemConfig {
  id: string;
  shape: 'torus' | 'octahedron' | 'icosahedron' | 'cylinder' | 'torusKnot' | 'ring' | 'sphere' | 'dodecahedron';
  scale: number;
  color: string;
  roughness: number;
  metalness: number;
  transmission?: number;
  rotationSpeed: [number, number, number];
}

export const DISCIPLINE_EMBLEMS: Record<string, DisciplineEmblemConfig> = {
  spatial: {
    id: 'spatial',
    shape: 'torusKnot',
    scale: 0.9,
    color: '#c9a24b',
    roughness: 0.15,
    metalness: 0.95,
    rotationSpeed: [0.3, 0.5, 0.1],
  },
  scenography: {
    id: 'scenography',
    shape: 'octahedron',
    scale: 1.1,
    color: '#dfb75f',
    roughness: 0.1,
    metalness: 0.9,
    transmission: 0.4,
    rotationSpeed: [0.2, 0.4, 0.3],
  },
  floral: {
    id: 'floral',
    shape: 'icosahedron',
    scale: 1.0,
    color: '#e5c158',
    roughness: 0.25,
    metalness: 0.8,
    rotationSpeed: [0.4, 0.2, 0.1],
  },
  symphony: {
    id: 'symphony',
    shape: 'torus',
    scale: 1.2,
    color: '#c9a24b',
    roughness: 0.12,
    metalness: 0.98,
    rotationSpeed: [0.1, 0.6, 0.2],
  },
  holographic: {
    id: 'holographic',
    shape: 'dodecahedron',
    scale: 1.0,
    color: '#f0d280',
    roughness: 0.05,
    metalness: 0.6,
    transmission: 0.7,
    rotationSpeed: [0.3, 0.3, 0.5],
  },
  vip: {
    id: 'vip',
    shape: 'ring',
    scale: 1.3,
    color: '#c9a24b',
    roughness: 0.18,
    metalness: 0.95,
    rotationSpeed: [0.2, 0.3, 0.1],
  },
  destination: {
    id: 'destination',
    shape: 'sphere',
    scale: 1.0,
    color: '#dfb75f',
    roughness: 0.2,
    metalness: 0.9,
    rotationSpeed: [0.1, 0.5, 0.1],
  },
  gastronomy: {
    id: 'gastronomy',
    shape: 'cylinder',
    scale: 0.8,
    color: '#c9a24b',
    roughness: 0.15,
    metalness: 0.92,
    rotationSpeed: [0.2, 0.4, 0.2],
  },
};

// src/journey/content/zoneRegistry.ts
// The single source of truth for scroll progress -> act zones, labels, routes, and SEO

export interface ZoneDefinition {
  id: 'arrival' | 'story' | 'offerings' | 'proof' | 'moments' | 'whatsnext' | 'begin';
  label: string;
  actRoman: string;
  range: [number, number];
  route: string;
  title: string;
  description: string;
}

export const ZONES: readonly ZoneDefinition[] = [
  {
    id: 'arrival',
    label: 'Home',
    actRoman: 'Act I',
    range: [0.0, 0.14],
    route: '/',
    title: 'Gowtham Events — Luxury Event Design & Coordination',
    description: 'Transforming extraordinary visions into impeccably curated, high-end private celebrations, corporate galas, and bespoke luxury productions.',
  },
  {
    id: 'story',
    label: 'About',
    actRoman: 'Act II',
    range: [0.14, 0.3],
    route: '/about',
    title: 'Our Story & Legacy — Gowtham Events',
    description: 'A relentless obsession with flawless execution, bespoke architectural staging, and creating unforgettable sensorial experiences.',
  },
  {
    id: 'offerings',
    label: 'Services',
    actRoman: 'Act III',
    range: [0.3, 0.46],
    route: '/services',
    title: 'Bespoke Curations & Disciplines — Gowtham Events',
    description: 'Comprehensive high-concept event design, precision technical staging, VIP hospitality, and holistic event management.',
  },
  {
    id: 'proof',
    label: 'Portfolio',
    actRoman: 'Act IV',
    range: [0.46, 0.64],
    route: '/portfolio',
    title: 'Masterpiece Archive — Gowtham Events',
    description: 'Explore an exclusive collection of our most prestigious international galas, private celebrations, and summits.',
  },
  {
    id: 'moments',
    label: 'Gallery',
    actRoman: 'Act V',
    range: [0.64, 0.78],
    route: '/gallery',
    title: 'Visual Moments & Atmosphere — Gowtham Events',
    description: 'Curated atmospheric captures celebrating our architectural lighting, floral installations, and design craft.',
  },
  {
    id: 'whatsnext',
    label: 'Upcoming',
    actRoman: 'Act VI',
    range: [0.78, 0.9],
    route: '/upcoming-events',
    title: 'Calendar & Upcoming Galas — Gowtham Events',
    description: 'Upcoming sovereign summits, private galas, and premier fashion showcases with live ticking countdown clocks.',
  },
  {
    id: 'begin',
    label: 'Contact',
    actRoman: 'Act VII',
    range: [0.9, 1.0],
    route: '/contact',
    title: 'Initiate Consultation — Gowtham Events',
    description: 'Inquire with our executive event directorship to begin curating your next landmark private or corporate gathering.',
  },
] as const;

export type ZoneId = (typeof ZONES)[number]['id'];

export const getZoneById = (id: string): ZoneDefinition | undefined => {
  return ZONES.find((z) => z.id === id);
};

export const getZoneByRoute = (route: string): ZoneDefinition | undefined => {
  return ZONES.find((z) => z.route === route);
};

export const getZoneByProgress = (progress: number): ZoneDefinition => {
  const cleanP = Math.max(0, Math.min(1, progress));
  for (const zone of ZONES) {
    if (cleanP >= zone.range[0] && cleanP <= zone.range[1]) {
      return zone;
    }
  }
  return ZONES[ZONES.length - 1];
};

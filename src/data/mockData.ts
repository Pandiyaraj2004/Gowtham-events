import { CompanyInfo, Service, Project, UpcomingEvent, Testimonial, TeamMember, Partner, ValueItem } from '../types';

export const companyInfo: CompanyInfo = {
  name: 'Gowtham Events',
  tagline: 'Designing Extraordinary Moments, Executing Flawless Experiences',
  description: 'Gowtham Events is a world-class, premium event management and design agency. We translate our clients\' visions into spectacular realities, managing every detail with artistic precision and operational excellence.',
  history: 'Founded in 2018, Gowtham Events emerged from a desire to redefine luxury event organization. What started as a boutique design studio has evolved into an industry-leading agency responsible for some of the most talked-about corporate galas, high-fashion weddings, and cutting-edge product launches globally.',
  mission: 'To create bespoke event experiences that provoke emotion, build connections, and leave an indelible mark on every guest in attendance.',
  vision: 'To be the global benchmark for creative innovation, luxury styling, and execution standards in the event management industry.',
  email: 'concierge@gowthamevents.com',
  phone: '+1 (555) 720-4300',
  address: '500 Fifth Avenue, Suite 4210, New York, NY 10110',
  socials: {
    facebook: 'https://facebook.com/gowthamevents',
    instagram: 'https://instagram.com/gowthamevents',
    twitter: 'https://twitter.com/gowthamevents',
    linkedin: 'https://linkedin.com/company/gowthamevents',
    whatsapp: 'https://wa.me/15557204300'
  }
};

export const services: Service[] = [
  {
    id: 'wedding-planning',
    title: 'Wedding Planning & Curation',
    description: 'Bespoke design, coordination, and styling for high-end luxury weddings.',
    fullDescription: 'From intimate estate gatherings to grand ballroom celebrations, we design and produce weddings that tell your unique love story. Our service covers everything from venue sourcing, vendor selection, custom set design, table styling, down to timeline management, guest concierge, and live execution.',
    icon: 'FiHeart',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    features: ['Bespoke Aesthetic Design', 'Full Planning & Production', 'Budget & Vendor Management', 'Day-of Guest Concierge']
  },
  {
    id: 'corporate-events',
    title: 'Corporate Galas & Summits',
    description: 'High-impact corporate experiences, award shows, and executive summits.',
    fullDescription: 'We help brands host world-class internal and external events that reinforce company culture, build trust, and showcase achievements. From premium AV design, keynote setup, registration workflows, to VIP dining experiences, we manage it all seamlessly.',
    icon: 'FiBriefcase',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800',
    features: ['Technical Direction & AV Production', 'Keynote & Panel Coordination', 'Premium Seating & Catering', 'Brand Integration']
  },
  {
    id: 'product-launches',
    title: 'Product Launches',
    description: 'Immersive launch campaigns designed to generate media coverage and hype.',
    fullDescription: 'Introduce your next big idea with style. We construct immersive, experiential brand environments that tell your product\'s story. Utilizing projection mapping, interactive displays, and premium lighting, we create highly-shareable moments for media, influencers, and stakeholders.',
    icon: 'FiCpu',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800',
    features: ['Immersive Stage Scenography', 'Interactive Tech Integrations', 'Press & Influencer Management', 'Hype-Driven Openings']
  },
  {
    id: 'college-festivals',
    title: 'Concerts & Large-scale Festivals',
    description: 'End-to-end management for arena-sized music festivals, concerts, and youth gatherings.',
    fullDescription: 'Managing large scale crowds requires heavy technical infrastructure, secure logistical workflows, and crowd control expertise. We coordinate stage builds, high-definition audio systems, artist hospitality, ticketing integration, and security operations to keep energy high and guests safe.',
    icon: 'FiMusic',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800',
    features: ['Main Stage Engineering', 'Line-up Booking & Logistics', 'Ticketing & RFID Gate Controls', 'Crowd Management & Security']
  },
  {
    id: 'stage-decoration',
    title: 'Creative Stage Design & Decor',
    description: 'Futuristic set designs, premium floral arrangements, and thematic props.',
    fullDescription: 'The stage is the visual core of any event. Our internal production workshop designs and builds custom staging, sculptural backdrops, thematic fabrications, and breathtaking lighting structures tailored to your theme, whether digital-modern or traditional-luxurious.',
    icon: 'FiFeather',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800',
    features: ['3D CAD Concept Rendering', 'On-site Set Carpentry & Paint', 'Premium Thematic Lighting', 'Luxury Floral Artistry']
  },
  {
    id: 'venue-management',
    title: 'Venue Sourcing & Management',
    description: 'Access to exclusive estates, private islands, and luxury spaces.',
    fullDescription: 'A premium event starts with an extraordinary location. We assist in locating and securing exclusive, private, or unconventional properties—from private historic estates to modern architectural masterpieces—and manage all licensing, permitting, and facility load-ins.',
    icon: 'FiMapPin',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800',
    features: ['Exclusive Venue Network', 'Permitting, Zoning, & Insurance', 'Technical Load-in Assessment', 'Facility Management']
  },
  {
    id: 'catering-experiences',
    title: 'Artisan Gastronomy & Catering',
    description: 'Fine dining menus curated by Michelin-trained private chefs.',
    fullDescription: 'Delight guests with highly curated culinary programs. We team up with top-tier private chefs and culinary designers to offer custom molecular gastronomy displays, thematic multi-course wine pairings, interactive live stations, and luxury mixology experiences.',
    icon: 'FiCoffee',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800',
    features: ['Custom Menu Curation', 'Sommelier & Wine Pairing', 'Artistic Food Styling', 'Craft Cocktails & Mixology']
  },
  {
    id: 'photography-cinema',
    title: 'Visual Storytelling & Cinema',
    description: 'Award-winning photojournalism and cinematic event coverage.',
    fullDescription: 'Preserve the legacy of your events. Our team of directors and photographers use cinema-grade cameras, drone rigs, and rapid-delivery edit systems to deliver breath-taking, editorial-quality event captures, highlights, and full-length films.',
    icon: 'FiCamera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
    features: ['Editorial Photojournalism', '4K Cinematic Highlight Reels', 'Drone Photography', 'Instant Social-Media Edits']
  }
];

export const projects: Project[] = [
  {
    id: 'lumina-summit-2025',
    name: 'Lumina Tech Summit',
    category: 'Corporate',
    date: 'October 2025',
    location: 'Silicon Valley, CA',
    description: 'An executive technology summit for 1,500 delegates focusing on green technology, featuring bespoke interactive LED stage backdrops and a carbon-neutral catering plan.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800'
    ]
  },
  {
    id: 'seraphina-wedding',
    name: 'Seraphina & Alexandre\'s Villa Gala',
    category: 'Wedding',
    date: 'June 2025',
    location: 'Lake Como, Italy',
    description: 'A magical three-day luxury wedding event set on the shores of Lake Como. Highlighted by custom glass-topped dining over the water, suspended rose garden, and a private orchestral performance.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800',
      'https://images.unsplash.com/photo-1507504038482-76210f5cce50?q=80&w=800'
    ]
  },
  {
    id: 'aurora-fashion-week',
    name: 'Aurora Autumn Fashion Runway',
    category: 'Product Launch',
    date: 'September 2025',
    location: 'Paris, France',
    description: 'A futuristic fashion showcase incorporating immersive projection mapping, dynamic mirror-clad runways, and a curated techno-classical live score.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800'
    ]
  },
  {
    id: 'neo-pulse-festival',
    name: 'NeoPulse Electronic Music Festival',
    category: 'Festival',
    date: 'July 2025',
    location: 'Miami, FL',
    description: 'An arena-sized electronic music gatherer showcasing top international DJs, featuring a 40-meter wide custom structure stage, lasers, and custom RFID entry bands.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800'
    ]
  },
  {
    id: 'stellar-ev-launch',
    name: 'Stellar EV Roadster Unveiling',
    category: 'Product Launch',
    date: 'December 2025',
    location: 'New York, NY',
    description: 'An exclusive press unveiling of Stellar Motors\' flagship electric vehicle. Guests experienced a theatrical laser reveal, smoke show, and interactive virtual reality drive simulators.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800'
    ]
  },
  {
    id: 'royal-heritage-ball',
    name: 'Heritage Foundation Gala Ball',
    category: 'Corporate',
    date: 'November 2025',
    location: 'London, UK',
    description: 'A black-tie charity fundraising ball held in a historic palace. The event raised $3.2M, featuring premium orchestral acts and custom museum-grade gallery pathways showcasing archival items.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800'
    ]
  }
];

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: 'nexus-con-2026',
    name: 'NEXUS Global Innovation Summit',
    date: '2026-10-15T09:00:00Z',
    location: 'Metropolitan Pavilion, NY',
    description: 'Gowtham Events\' premier corporate exhibition, showcasing the intersection of artificial intelligence, high-end styling, and event experience. Over 50 global speakers.',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800',
    registrationOpen: true
  },
  {
    id: 'solstice-ball-2026',
    name: 'Winter Solstice Charity Opera',
    date: '2026-12-21T19:00:00Z',
    location: 'The Majestic Theater, London',
    description: 'A majestic winter event combining operatic opera acts, bespoke Michelin dining, and luxury art auctions. All proceeds supporting global children\'s foundation.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800',
    registrationOpen: true
  },
  {
    id: 'oasis-fest-2026',
    name: 'Oasis Desert Boutique Festival',
    date: '2027-04-12T16:00:00Z',
    location: 'Mojave Desert, CA',
    description: 'A boutique luxury music and wellness gatherer under the stars, featuring luxury glamping retreats, multi-genre live artists, and ambient soundscapes.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800',
    registrationOpen: false
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Victoria Vance',
    role: 'VP of Global Brand Relations',
    company: 'Stellar Motors',
    review: 'Gowtham Events did not just build a stage; they built a world. Our EV launch was a masterpiece of technology and choreography. Our press coverage doubled compared to last year.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
  },
  {
    id: 't2',
    name: 'Marcus Sterling',
    role: 'Managing Director',
    company: 'Sterling Global Capital',
    review: 'Our Annual Partner Retreat requires strict secrecy and impeccable design. Gowtham Events delivered a flawless experience in Lake Como that exceeded our incredibly high standards. Truly outstanding.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
  },
  {
    id: 't3',
    name: 'Elena Rostova',
    role: 'Creative Director',
    company: 'Aurora Couture',
    review: 'Gowtham Events represents the peak of creative scenography. Their team turned our autumn runway into a mirror-clad, immersive forest. The projection work was pure visual art.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200'
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: 'team1',
    name: 'Julian Vance',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300',
    bio: 'Julian has over 15 years of experience in luxury brand experiences, curating events for top technology firms, private estates, and luxury fashion brands globally.',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'team2',
    name: 'Sophia Laurent',
    role: 'Chief Experience Architect',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300',
    bio: 'Sophia holds a master\'s in scenography and architecture. She specializes in large-scale technical productions, spatial planning, and immersive digital systems.',
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com'
    }
  },
  {
    id: 'team3',
    name: 'Harrison Sterling',
    role: 'Head of Operations & Logistics',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300',
    bio: 'Harrison directs on-site operations. He is responsible for site safety, global talent logistics, vendor contract management, and complex technical setups.',
    socials: {
      linkedin: 'https://linkedin.com'
    }
  }
];

export const values: ValueItem[] = [
  {
    title: 'Artistic Excellence',
    description: 'We believe events are fleeting works of art, deserving of the finest styling, custom installations, and visual cohesion.',
    icon: 'FiFeather'
  },
  {
    title: 'Precision Logistics',
    description: 'Creativity is nothing without flawless execution. We coordinate schedules, suppliers, and safety checks down to the second.',
    icon: 'FiActivity'
  },
  {
    title: 'Client Discretion',
    description: 'We safeguard our clients\' confidentiality, offering private planning channels, NDA agreements, and secure check-ins.',
    icon: 'FiShield'
  },
  {
    title: 'Sensory Innovation',
    description: 'We touch every sense, aligning gastronomy, ambient lighting, spatial aroma, and acoustics for complete immersion.',
    icon: 'FiTarget'
  }
];

export const partners: Partner[] = [
  { id: 'p1', name: 'Stellar Motors', logo: 'Stellar' },
  { id: 'p2', name: 'Vance Estates', logo: 'Vance' },
  { id: 'p3', name: 'Sterling Capital', logo: 'Sterling' },
  { id: 'p4', name: 'Aurora Couture', logo: 'Aurora' },
  { id: 'p5', name: 'Maison Culinary', logo: 'Maison' }
];

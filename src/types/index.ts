export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  history: string;
  mission: string;
  vision: string;
  email: string;
  phone: string;
  address: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    whatsapp: string;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  icon: string; // Icon identifier for rendering
  image: string;
  features: string[];
}

export interface Project {
  id: string;
  name: string;
  category: string;
  date: string;
  location: string;
  description: string;
  image: string;
  gallery: string[];
}

export interface UpcomingEvent {
  id: string;
  name: string;
  date: string; // ISO date string
  location: string;
  description: string;
  image: string;
  registrationOpen: boolean;
  category?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  review: string;
  rating: number;
  avatar: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface ValueItem {
  title: string;
  description: string;
  icon: string;
}

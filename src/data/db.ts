// Gowtham Events Database Service Layer
// Primary: Cloud Firestore
// Fallback: LocalStorage (Offline / Demo Mode)
import * as mockSeeds from './mockData';
import { CompanyInfo, Service, Project, UpcomingEvent, Testimonial } from '../types';

// Types for Bookings and Closure Reports
export interface EventBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  guests: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  meetingDate?: string;
  createdAt: string;
}

export interface ProjectClosureReport {
  id: string; // Linked to project/event ID
  projectName: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  guests: number;
  status: 'completed';
  
  // Financials
  estimatedBudget: number;
  amountReceived: number;
  expenses: number;
  additionalExpenses: number;
  netProfit: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  paymentMethod: string;
  
  // Team
  eventManager: string;
  partners: string[];
  vendors: string[];
  
  // Feedback & Notes
  rating: number;
  review: string;
  challenges: string;
  lessonsLearned: string;
  recommendations: string;
  media: string[];
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userEmail: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

// LocalStorage Keys
const KEYS = {
  SERVICES: 'vanguard_db_services',
  PROJECTS: 'vanguard_db_projects',
  TESTIMONIALS: 'vanguard_db_testimonials',
  UPCOMING: 'vanguard_db_upcoming',
  COMPANY: 'vanguard_db_company',
  BOOKINGS: 'vanguard_db_bookings',
  REPORTS: 'vanguard_db_closure_reports',
  LOGS: 'vanguard_db_activity_logs',
};

// Seed LocalStorage helpers if not configured
const loadLocalStorage = <T>(key: string, seed: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(data);
};

const saveLocalStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Log activity logger helper
const logAdminAction = (action: string, details: string) => {
  const logs = loadLocalStorage<ActivityLog[]>(KEYS.LOGS, []);
  
  // Get active session email/name
  const activeSessionData = localStorage.getItem('vanguard_auth_session');
  const user = activeSessionData ? JSON.parse(activeSessionData) : null;
  
  const newLog: ActivityLog = {
    id: `log-${Math.random().toString(36).substr(2, 9)}`,
    userEmail: user?.email || 'system@gowthamevents.com',
    userName: user?.name || 'System Operator',
    action,
    details,
    timestamp: new Date().toISOString(),
  };

  logs.unshift(newLog); // Put new logs at top
  saveLocalStorage(KEYS.LOGS, logs);
};

export const db = {
  // --- Admin Logs ---
  getActivityLogs: async (): Promise<ActivityLog[]> => {
    return loadLocalStorage<ActivityLog[]>(KEYS.LOGS, []);
  },

  logActivity: async (action: string, details: string): Promise<void> => {
    logAdminAction(action, details);
  },

  // --- Company Details ---
  getCompanyInfo: async (): Promise<CompanyInfo> => {
    return loadLocalStorage<CompanyInfo>(KEYS.COMPANY, mockSeeds.companyInfo);
  },

  saveCompanyInfo: async (info: CompanyInfo): Promise<void> => {
    saveLocalStorage(KEYS.COMPANY, info);
    logAdminAction('Update Website Content', `Updated core company address, contact information, and brand tagline`);
  },

  // --- Services CRUD ---
  getServices: async (): Promise<Service[]> => {
    return loadLocalStorage<Service[]>(KEYS.SERVICES, mockSeeds.services);
  },

  saveService: async (service: Service): Promise<void> => {
    const list = await db.getServices();
    const idx = list.findIndex((s) => s.id === service.id);
    if (idx !== -1) {
      list[idx] = service;
      logAdminAction('Update Service', `Modified service details for "${service.title}"`);
    } else {
      list.push(service);
      logAdminAction('Create Service', `Added new service category "${service.title}"`);
    }
    saveLocalStorage(KEYS.SERVICES, list);
  },

  // --- Projects/Portfolio CRUD ---
  getProjects: async (): Promise<Project[]> => {
    return loadLocalStorage<Project[]>(KEYS.PROJECTS, mockSeeds.projects);
  },

  saveProject: async (project: Project): Promise<void> => {
    const list = await db.getProjects();
    const idx = list.findIndex((p) => p.id === project.id);
    if (idx !== -1) {
      list[idx] = project;
      logAdminAction('Update Project', `Modified project specifications for "${project.name}"`);
    } else {
      list.push(project);
      logAdminAction('Publish Project', `Published a new portfolio project "${project.name}"`);
    }
    saveLocalStorage(KEYS.PROJECTS, list);
  },

  deleteProject: async (id: string): Promise<void> => {
    const list = await db.getProjects();
    const project = list.find(p => p.id === id);
    const filtered = list.filter((p) => p.id !== id);
    saveLocalStorage(KEYS.PROJECTS, filtered);
    if (project) {
      logAdminAction('Remove Project', `Deleted portfolio showcase item for "${project.name}"`);
    }
  },

  // --- Testimonials CRUD ---
  getTestimonials: async (): Promise<Testimonial[]> => {
    return loadLocalStorage<Testimonial[]>(KEYS.TESTIMONIALS, mockSeeds.testimonials);
  },

  saveTestimonial: async (test: Testimonial): Promise<void> => {
    const list = await db.getTestimonials();
    const idx = list.findIndex((t) => t.id === test.id);
    if (idx !== -1) {
      list[idx] = test;
    } else {
      list.push(test);
      logAdminAction('Create Testimonial', `Added a new client review from "${test.name}"`);
    }
    saveLocalStorage(KEYS.TESTIMONIALS, list);
  },

  // --- Upcoming Events CRUD ---
  getUpcomingEvents: async (): Promise<UpcomingEvent[]> => {
    return loadLocalStorage<UpcomingEvent[]>(KEYS.UPCOMING, mockSeeds.upcomingEvents);
  },

  saveUpcomingEvent: async (event: UpcomingEvent): Promise<void> => {
    const list = await db.getUpcomingEvents();
    const idx = list.findIndex((e) => e.id === event.id);
    if (idx !== -1) {
      list[idx] = event;
      logAdminAction('Update Event', `Updated event details for upcoming schedule: "${event.name}"`);
    } else {
      list.push(event);
      logAdminAction('Schedule Event', `Added upcoming event "${event.name}" to the public calendar`);
    }
    saveLocalStorage(KEYS.UPCOMING, list);
  },

  deleteUpcomingEvent: async (id: string): Promise<void> => {
    const list = await db.getUpcomingEvents();
    const event = list.find(e => e.id === id);
    const filtered = list.filter((e) => e.id !== id);
    saveLocalStorage(KEYS.UPCOMING, filtered);
    if (event) {
      logAdminAction('Remove Event', `Deleted scheduled event calendar entry: "${event.name}"`);
    }
  },

  // --- Bookings CRM ---
  getBookings: async (): Promise<EventBooking[]> => {
    // Start with a couple of mock bookings for demo purposes
    const mockBookings: EventBooking[] = [
      {
        id: 'book-1',
        name: 'Victoria Vance',
        email: 'victoria@stellar.com',
        phone: '+1 (555) 789-0123',
        eventType: 'Product Launch',
        date: '2026-11-20',
        guests: 200,
        message: 'Looking to organize our next vehicle launch event with holographic projection systems.',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'book-2',
        name: 'Marcus Sterling',
        email: 'marcus@sterling.com',
        phone: '+1 (555) 234-5678',
        eventType: 'Corporate Gala',
        date: '2026-12-15',
        guests: 500,
        message: 'Annual fundraiser ball for our global foundation. Elite black-tie standard required.',
        status: 'approved',
        meetingDate: '2026-08-01T10:00:00Z',
        createdAt: new Date().toISOString(),
      }
    ];
    return loadLocalStorage<EventBooking[]>(KEYS.BOOKINGS, mockBookings);
  },

  saveBooking: async (booking: EventBooking): Promise<void> => {
    const list = await db.getBookings();
    const idx = list.findIndex((b) => b.id === booking.id);
    if (idx !== -1) {
      list[idx] = booking;
    } else {
      list.push(booking);
    }
    saveLocalStorage(KEYS.BOOKINGS, list);
  },

  updateBookingStatus: async (id: string, status: 'pending' | 'approved' | 'rejected' | 'converted', meetingDate?: string): Promise<void> => {
    const list = await db.getBookings();
    const idx = list.findIndex((b) => b.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (meetingDate) {
        list[idx].meetingDate = meetingDate;
      }
      saveLocalStorage(KEYS.BOOKINGS, list);
      logAdminAction('Update Booking', `Updated booking status for "${list[idx].name}" to: ${status.toUpperCase()}`);
    }
  },

  // --- Project Closure Reports (Financial summaries and performance inputs) ---
  getClosureReports: async (): Promise<ProjectClosureReport[]> => {
    // Initial mock closure data representing past completed projects
    const mockReports: ProjectClosureReport[] = [
      {
        id: 'lumina-summit-2025',
        projectName: 'Lumina Tech Summit',
        clientName: 'Lumina Tech LLC',
        eventType: 'Corporate',
        eventDate: '2025-10-10',
        eventLocation: 'Silicon Valley, CA',
        guests: 1500,
        status: 'completed',
        estimatedBudget: 80000,
        amountReceived: 95000,
        expenses: 65000,
        additionalExpenses: 5000,
        netProfit: 25000,
        paymentStatus: 'paid',
        paymentMethod: 'Wire Transfer',
        eventManager: 'Sophia Laurent',
        partners: ['Elena Rostova'],
        vendors: ['Stellar Audio', 'Maison catering'],
        rating: 5,
        review: 'Flawless production scaffolding. Highly recommended!',
        challenges: 'Heavy rain forced load-in load adjustments.',
        lessonsLearned: 'Always secure secondary generator options.',
        recommendations: 'Continue using Stellar Audio for projection builds.',
        media: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'seraphina-wedding',
        projectName: 'Seraphina & Alexandre\'s Villa Gala',
        clientName: 'Seraphina Vance',
        eventType: 'Wedding',
        eventDate: '2025-06-18',
        eventLocation: 'Lake Como, Italy',
        guests: 180,
        status: 'completed',
        estimatedBudget: 150000,
        amountReceived: 180000,
        expenses: 120000,
        additionalExpenses: 15000,
        netProfit: 45000,
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        eventManager: 'Julian Vance',
        partners: ['Harrison Sterling'],
        vendors: ['Maison catering', 'Lake Como Strings'],
        rating: 5,
        review: 'Magical three days. The suspended gardens were pure art.',
        challenges: 'Lake permit delays on load-in docks.',
        lessonsLearned: 'Coordinate permitting local contacts 6 weeks early.',
        recommendations: 'Lake Como venue bookings require local operators.',
        media: [],
        createdAt: new Date().toISOString(),
      }
    ];
    return loadLocalStorage<ProjectClosureReport[]>(KEYS.REPORTS, mockReports);
  },

  saveClosureReport: async (report: ProjectClosureReport): Promise<void> => {
    const list = await db.getClosureReports();
    const idx = list.findIndex((r) => r.id === report.id);
    if (idx !== -1) {
      list[idx] = report;
      logAdminAction('Update Closure Report', `Modified closure audit details for "${report.projectName}"`);
    } else {
      list.push(report);
      logAdminAction('Complete Closure Report', `Archived project "${report.projectName}" and saved closure details ($${report.netProfit} profit logged)`);
    }
    saveLocalStorage(KEYS.REPORTS, list);
    
    // Auto-update Project array status if relevant
    const projects = await db.getProjects();
    const projIdx = projects.findIndex((p) => p.id === report.id);
    if (projIdx !== -1) {
      projects[projIdx].description = `[COMPLETED] ${projects[projIdx].description}`;
      saveLocalStorage(KEYS.PROJECTS, projects);
    }
  },

  // --- Real-time Subscriptions Simulator ---
  subscribeToProjectChanges: (_projectId: string, callback: (data: any) => void): (() => void) => {
    // Register listener callbacks
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === KEYS.PROJECTS || e.key === KEYS.REPORTS || e.key === KEYS.BOOKINGS) {
        callback(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Interval ticker to verify changes inside the same window tab
    const interval = setInterval(() => {
      callback(null);
    }, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  },

  // --- Interactive Event Timeline & Tasks ---
  getProjectTasks: async (projectId: string): Promise<ProjectTask[]> => {
    const seedTasks: ProjectTask[] = [
      {
        id: 'task-w1',
        projectId: 'seraphina-wedding',
        name: 'Finalize floral arch and suspended gardens mockups',
        status: 'completed',
        deadline: '2026-06-01',
        notes: 'Coordinated with Lake Como local florist.',
      },
      {
        id: 'task-w2',
        projectId: 'seraphina-wedding',
        name: 'Complete catering food pairings catalog selection',
        status: 'in_progress',
        deadline: '2026-07-30',
        notes: 'Waiting client feedback on the seafood pairings.',
      },
      {
        id: 'task-w3',
        projectId: 'seraphina-wedding',
        name: 'Set up audio staging checks for Lake Como Strings group',
        status: 'pending',
        deadline: '2026-08-10',
      }
    ];
    const list = loadLocalStorage<ProjectTask[]>(KEYS.LOGS + '_tasks', seedTasks);
    return list.filter((t) => t.projectId === projectId);
  },

  saveProjectTask: async (task: ProjectTask): Promise<void> => {
    const list = loadLocalStorage<ProjectTask[]>(KEYS.LOGS + '_tasks', []);
    const idx = list.findIndex((t) => t.id === task.id);
    if (idx !== -1) {
      list[idx] = task;
    } else {
      list.push(task);
    }
    saveLocalStorage(KEYS.LOGS + '_tasks', list);
    db.logActivity('Task Update', `Task "${task.name}" updated to status: ${task.status.toUpperCase()}`);
    // Register activity log event if task is marked complete
    if (task.status === 'completed') {
      await db.addProjectTimeline(task.projectId, 'task_completed', `Task completed: "${task.name}"`);
    }
  },

  // --- Project Activity Timeline ---
  getProjectTimeline: async (projectId: string): Promise<ProjectActivity[]> => {
    const seedTimeline: ProjectActivity[] = [
      {
        id: 'time-1',
        projectId: 'seraphina-wedding',
        actionType: 'booking_confirmed',
        details: 'Booking confirmed by Gowtham Admins.',
        timestamp: '2026-06-18T10:00:00Z',
      },
      {
        id: 'time-2',
        projectId: 'seraphina-wedding',
        actionType: 'partner_assigned',
        details: 'Elena Rostova assigned as primary florist.',
        timestamp: '2026-06-19T14:30:00Z',
      }
    ];
    const list = loadLocalStorage<ProjectActivity[]>(KEYS.LOGS + '_timeline', seedTimeline);
    return list.filter((l) => l.projectId === projectId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  addProjectTimeline: async (projectId: string, actionType: ProjectActivity['actionType'], details: string): Promise<void> => {
    const list = loadLocalStorage<ProjectActivity[]>(KEYS.LOGS + '_timeline', []);
    const newLog: ProjectActivity = {
      id: `timeline-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      actionType,
      details,
      timestamp: new Date().toISOString(),
    };
    list.unshift(newLog);
    saveLocalStorage(KEYS.LOGS + '_timeline', list);
  },

  // --- Shared Document Approvals (Quotes, blueprints, contracts) ---
  getProjectDocuments: async (projectId: string): Promise<ProjectDocument[]> => {
    const seedDocs: ProjectDocument[] = [
      {
        id: 'doc-w1',
        projectId: 'seraphina-wedding',
        name: 'Lake Como Scenography Concept Plan.pdf',
        type: 'plan',
        url: 'https://res.cloudinary.com/demo/image/upload/v1615456321/sample.jpg',
        status: 'approved',
        uploadedAt: '2026-07-01T12:00:00Z',
      },
      {
        id: 'doc-w2',
        projectId: 'seraphina-wedding',
        name: 'Lake Como Catering Quotation.pdf',
        type: 'quotation',
        url: 'https://res.cloudinary.com/demo/image/upload/v1615456321/sample.jpg',
        status: 'pending',
        uploadedAt: '2026-07-20T10:00:00Z',
      }
    ];
    const list = loadLocalStorage<ProjectDocument[]>(KEYS.LOGS + '_docs', seedDocs);
    return list.filter((d) => d.projectId === projectId);
  },

  saveProjectDocument: async (doc: ProjectDocument): Promise<void> => {
    const list = loadLocalStorage<ProjectDocument[]>(KEYS.LOGS + '_docs', []);
    const idx = list.findIndex((d) => d.id === doc.id);
    if (idx !== -1) {
      list[idx] = doc;
    } else {
      list.push(doc);
    }
    saveLocalStorage(KEYS.LOGS + '_docs', list);
    await db.addProjectTimeline(doc.projectId, 'document_uploaded', `Document uploaded: "${doc.name}"`);
  },

  updateDocumentStatus: async (docId: string, status: 'approved' | 'rejected'): Promise<void> => {
    const list = loadLocalStorage<ProjectDocument[]>(KEYS.LOGS + '_docs', []);
    const idx = list.findIndex((d) => d.id === docId);
    if (idx !== -1) {
      list[idx].status = status;
      saveLocalStorage(KEYS.LOGS + '_docs', list);
      db.logActivity('Document Approved', `Document "${list[idx].name}" marked: ${status.toUpperCase()}`);
    }
  },

  // --- Communication Messaging center ---
  getChatMessages: async (projectId: string): Promise<ChatMessage[]> => {
    const seedChats: ChatMessage[] = [
      {
        id: 'msg-1',
        projectId: 'seraphina-wedding',
        senderEmail: 'admin@gowthamevents.com',
        senderName: 'Gowtham Admin',
        recipientEmail: 'seraphina@gowthamevents.com',
        message: 'Hello Seraphina! We have uploaded the updated lake villa layout plan under your Documents section. Let us know if you approve.',
        timestamp: '2026-07-24T10:00:00Z',
        read: true,
      }
    ];
    const list = loadLocalStorage<ChatMessage[]>(KEYS.LOGS + '_chats', seedChats);
    return list.filter((m) => m.projectId === projectId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  sendChatMessage: async (msg: ChatMessage): Promise<void> => {
    const list = loadLocalStorage<ChatMessage[]>(KEYS.LOGS + '_chats', []);
    list.push(msg);
    saveLocalStorage(KEYS.LOGS + '_chats', list);
  },

  markChatAsRead: async (projectId: string, userEmail: string): Promise<void> => {
    const list = loadLocalStorage<ChatMessage[]>(KEYS.LOGS + '_chats', []);
    let changed = false;
    list.forEach((m) => {
      if (m.projectId === projectId && m.recipientEmail.toLowerCase() === userEmail.toLowerCase() && !m.read) {
        m.read = true;
        changed = true;
      }
    });
    if (changed) {
      saveLocalStorage(KEYS.LOGS + '_chats', list);
    }
  },

  // --- System Announcements ---
  getAnnouncements: async (): Promise<Announcement[]> => {
    const seedAnns: Announcement[] = [
      {
        id: 'ann-1',
        title: 'New Cloudinary CDN Integrations Online',
        content: 'We have updated our core media assets delivery networks. High-res images will load and transcode instantly.',
        timestamp: '2026-07-20T08:00:00Z',
      }
    ];
    return loadLocalStorage<Announcement[]>(KEYS.LOGS + '_announcements', seedAnns);
  },

  saveAnnouncement: async (ann: Announcement): Promise<void> => {
    const list = loadLocalStorage<Announcement[]>(KEYS.LOGS + '_announcements', []);
    list.unshift(ann);
    saveLocalStorage(KEYS.LOGS + '_announcements', list);
    db.logActivity('Announce', `Published company announcement: "${ann.title}"`);
  }
};

export interface ProjectTask {
  id: string;
  projectId: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
  deadline: string;
  extensionRequested?: boolean;
  extensionReason?: string;
  completionReportSubmitted?: boolean;
  completionReportNotes?: string;
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  actionType: 'booking_confirmed' | 'partner_assigned' | 'document_uploaded' | 'task_completed' | 'project_completed' | 'gallery_published';
  details: string;
  timestamp: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  type: 'quotation' | 'plan' | 'contract';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  senderEmail: string;
  senderName: string;
  recipientEmail: string;
  message: string;
  timestamp: string;
  read: boolean;
  attachments?: { name: string; url: string; type: 'image' | 'file' }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export default db;

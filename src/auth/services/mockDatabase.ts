// Mock Database Service using LocalStorage
// Simulates Firestore role, registration, and partner status lookups

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'partner' | 'client';
  phone?: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
}

const USERS_KEY = 'vanguard_db_users';

// Standard baseline seed accounts
const DEFAULT_SEED_USERS: UserProfile[] = [
  // Admins
  {
    uid: 'admin-seed-id',
    email: 'admin@gowthamevents.com',
    name: 'Gowtham Administrator',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'admin-vanguard-seed-id',
    email: 'admin@vanguard.com',
    name: 'Gowtham Administrator',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  // Partners
  {
    uid: 'partner-seed-id',
    email: 'partner1@gowthamevents.com',
    name: 'Elena Rostova (Partner)',
    role: 'partner',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'partner-alt-seed-id',
    email: 'partner@gowthamevents.com',
    name: 'Elena Rostova (Partner)',
    role: 'partner',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'partner-vanguard-seed-id',
    email: 'partner1@vanguard.com',
    name: 'Elena Rostova (Partner)',
    role: 'partner',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  // Clients
  {
    uid: 'client-seed-id',
    email: 'sophia@gowthamevents.com',
    name: 'Sophia Laurent (Client)',
    role: 'client',
    phone: '+1 (555) 234-5678',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'client-alt-seed-id',
    email: 'client@gowthamevents.com',
    name: 'Sophia Laurent (Client)',
    role: 'client',
    phone: '+1 (555) 234-5678',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'client-vanguard-seed-id',
    email: 'client@vanguard.com',
    name: 'Sophia Laurent (Client)',
    role: 'client',
    phone: '+1 (555) 234-5678',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'client-sophia-vanguard-seed-id',
    email: 'sophia@vanguard.com',
    name: 'Sophia Laurent (Client)',
    role: 'client',
    phone: '+1 (555) 234-5678',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'google-client-uid',
    email: 'google.client@gowthamevents.com',
    name: 'Victoria Vance (Google Client)',
    role: 'client',
    phone: '+1 (555) 321-4321',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

// Helper to load users database, guaranteeing baseline seed users always exist
const getStoredUsers = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    let users: UserProfile[] = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(users)) {
      users = [];
    }

    let modified = false;

    // Ensure all default seeds exist in the store
    DEFAULT_SEED_USERS.forEach((seed) => {
      const exists = users.some(
        (u) => u.email.toLowerCase() === seed.email.toLowerCase()
      );
      if (!exists) {
        users.push(seed);
        modified = true;
      }
    });

    if (modified || !raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    return users;
  } catch (e) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_SEED_USERS));
    return DEFAULT_SEED_USERS;
  }
};

// Helper to save users database
const saveUsers = (users: UserProfile[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage', e);
  }
};

export const mockDatabase = {
  // Get user profile by UID
  getUser: (uid: string): UserProfile | null => {
    const users = getStoredUsers();
    return users.find((u) => u.uid === uid) || null;
  },

  // Get user profile by email or username (case-insensitive)
  getUserByEmail: (email: string): UserProfile | null => {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    // Direct username or alias check for Admin
    if (cleanEmail === 'admin' || cleanEmail === 'admin@gowthamevents.com' || cleanEmail === 'admin@vanguard.com') {
      const adminUser = users.find((u) => u.role === 'admin' || u.email.toLowerCase() === 'admin@gowthamevents.com');
      if (adminUser) return adminUser;
      return {
        uid: 'admin-seed-id',
        email: 'admin@gowthamevents.com',
        name: 'Gowtham Administrator',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
    }

    // Direct username or alias check for Partner
    if (cleanEmail === 'partner' || cleanEmail === 'partner1') {
      const partnerUser = users.find((u) => u.role === 'partner');
      if (partnerUser) return partnerUser;
    }

    // Direct username or alias check for Client
    if (cleanEmail === 'client' || cleanEmail === 'sophia') {
      const clientUser = users.find((u) => u.role === 'client');
      if (clientUser) return clientUser;
    }

    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) return found;

    // Fallback: If user enters an unseeded admin/partner/client email in offline/mock mode
    if (cleanEmail.includes('admin')) {
      return mockDatabase.createAdminProfile(
        `admin-${Math.random().toString(36).substr(2, 9)}`,
        cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gowthamevents.com`,
        'Gowtham Administrator',
        import.meta.env.VITE_ADMIN_ACCESS_CODE || 'GOWTHAM_ADMIN_2026'
      );
    }
    if (cleanEmail.includes('partner')) {
      return mockDatabase.createPartnerAccount(
        cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gowthamevents.com`,
        'Service Partner'
      );
    }
    if (cleanEmail.includes('client') || cleanEmail.includes('sophia')) {
      return mockDatabase.createClientProfile(
        `client-${Math.random().toString(36).substr(2, 9)}`,
        cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gowthamevents.com`,
        'Client Host',
        '+1 (555) 000-0000'
      );
    }

    return null;
  },

  // Create client profile
  createClientProfile: (uid: string, email: string, name: string, phone: string = ''): UserProfile => {
    const users = getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      existing.name = name || existing.name;
      existing.phone = phone || existing.phone;
      saveUsers(users);
      return existing;
    }

    const newProfile: UserProfile = {
      uid: uid || `client-${Math.random().toString(36).substr(2, 9)}`,
      email: cleanEmail,
      name: name || 'Client Host',
      phone,
      role: 'client',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    users.push(newProfile);
    saveUsers(users);
    return newProfile;
  },

  // Create admin profile
  createAdminProfile: (uid: string, email: string, name: string, accessCode: string): UserProfile => {
    const envAccessCode = import.meta.env.VITE_ADMIN_ACCESS_CODE || 'GOWTHAM_ADMIN_2026';
    
    // Verify Access Code
    if (accessCode !== envAccessCode) {
      throw new Error('Invalid Admin Access Code. Authentication rejected.');
    }

    const users = getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      existing.role = 'admin';
      existing.status = 'active';
      existing.name = name || existing.name;
      saveUsers(users);
      return existing;
    }

    const newProfile: UserProfile = {
      uid: uid || `admin-${Math.random().toString(36).substr(2, 9)}`,
      email: cleanEmail,
      name: name || 'Gowtham Administrator',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    users.push(newProfile);
    saveUsers(users);
    return newProfile;
  },

  // Get all partners (for Admin dashboard listing)
  getPartners: (): UserProfile[] => {
    const users = getStoredUsers();
    return users.filter((u) => u.role === 'partner');
  },

  // Admin CRUD for Partners: Create Partner Account
  createPartnerAccount: (email: string, name: string): UserProfile => {
    const users = getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.role === 'partner') {
        existing.status = 'active';
        saveUsers(users);
        return existing;
      }
      throw new Error('This email is already associated with another user account.');
    }

    const newPartner: UserProfile = {
      uid: `partner-${Math.random().toString(36).substr(2, 9)}`,
      email: cleanEmail,
      name: name || 'Service Partner',
      role: 'partner',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    users.push(newPartner);
    saveUsers(users);
    return newPartner;
  },

  // Admin CRUD for Partners: Update status (active, suspended, pending)
  updatePartnerStatus: (uid: string, status: 'active' | 'suspended' | 'pending'): UserProfile => {
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid && u.role === 'partner');
    if (index === -1) throw new Error('Partner account not found.');

    users[index].status = status;
    saveUsers(users);
    return users[index];
  },

  // Admin CRUD for Partners: Remove Partner
  removePartnerAccount: (uid: string): void => {
    const users = getStoredUsers();
    const filtered = users.filter((u) => !(u.uid === uid && u.role === 'partner'));
    saveUsers(filtered);
  },

  // Get all users (Admin view)
  getAllUsers: (): UserProfile[] => {
    return getStoredUsers();
  }
};

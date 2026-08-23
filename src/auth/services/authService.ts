import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './firebase';
import { mockDatabase } from './mockDatabase';

export interface AuthSession {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'partner' | 'client';
  status: 'active' | 'suspended' | 'pending';
  phone?: string;
}

// Session key for persistent storage
const SESSION_KEY = 'vanguard_auth_session';

// Helper to simulate smooth UX loading without excessive blocking
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  // Get active session on mount or page refresh
  getCurrentSession: async (): Promise<AuthSession | null> => {
    // 1. Quick check for existing local session (instant restore on refresh)
    try {
      const savedData = localStorage.getItem(SESSION_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData) as AuthSession;
        if (parsed && parsed.email && parsed.role) {
          // Cross-verify with database to ensure role / status hasn't changed
          const freshProfile = mockDatabase.getUserByEmail(parsed.email);
          if (freshProfile) {
            const freshSession: AuthSession = {
              uid: freshProfile.uid,
              email: freshProfile.email,
              name: freshProfile.name,
              role: freshProfile.role,
              status: freshProfile.status,
              phone: freshProfile.phone,
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(freshSession));
            return freshSession;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading saved session', e);
    }

    // 2. If Firebase is configured, check Firebase auth state
    if (isFirebaseConfigured && auth) {
      try {
        const firebaseUser = await new Promise<any>((resolve) => {
          if (auth.currentUser) return resolve(auth.currentUser);
          const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
              unsubscribe();
              resolve(user);
            },
            () => resolve(null)
          );
          // Fallback timeout after 1.5s
          setTimeout(() => resolve(null), 1500);
        });

        if (firebaseUser) {
          let profile =
            mockDatabase.getUser(firebaseUser.uid) ||
            mockDatabase.getUserByEmail(firebaseUser.email || '');

          if (!profile && firebaseUser.email) {
            profile = mockDatabase.createClientProfile(
              firebaseUser.uid,
              firebaseUser.email,
              firebaseUser.displayName || 'Client Host'
            );
          }

          if (profile) {
            const session: AuthSession = {
              uid: profile.uid,
              email: profile.email,
              name: profile.name,
              role: profile.role,
              status: profile.status,
              phone: profile.phone,
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            return session;
          }
        }
      } catch (err) {
        console.warn('Firebase session check failed', err);
      }
    }

    return null;
  },

  // Login using Email & Password
  loginWithEmail: async (email: string, password?: string): Promise<AuthSession> => {
    await delay(350); // Subtle transition latency

    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password || '');
        const fbUser = userCredential.user;
        let profile =
          mockDatabase.getUser(fbUser.uid) ||
          mockDatabase.getUserByEmail(cleanEmail);
        
        if (!profile) {
          // If authenticated on Firebase but no profile exists, create based on email pattern
          if (cleanEmail.includes('admin')) {
            profile = mockDatabase.createAdminProfile(
              fbUser.uid,
              cleanEmail,
              'Gowtham Administrator',
              import.meta.env.VITE_ADMIN_ACCESS_CODE || 'GOWTHAM_ADMIN_2026'
            );
          } else {
            profile = mockDatabase.createClientProfile(
              fbUser.uid,
              cleanEmail,
              fbUser.displayName || 'Client Host'
            );
          }
        }

        // Validate Partner status
        if (profile.role === 'partner') {
          if (profile.status === 'suspended') {
            throw new Error('Access Denied: This partner account has been suspended. Please contact the administrator.');
          }
          if (profile.status === 'pending') {
            throw new Error('Access Denied: This partner account is pending approval by the administrator.');
          }
        }

        const session: AuthSession = {
          uid: profile.uid,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          status: profile.status,
          phone: profile.phone,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
      } catch (err: any) {
        throw new Error(err.message || 'Firebase login failed.');
      }
    }

    // Mock Login Logic
    let profile = mockDatabase.getUserByEmail(cleanEmail);
    if (!profile) {
      // Auto-register general client accounts on valid password if not found
      if (password && password.length >= 6) {
        profile = mockDatabase.createClientProfile(
          `client-${Math.random().toString(36).substr(2, 9)}`,
          cleanEmail,
          cleanEmail.split('@')[0]
        );
      } else {
        throw new Error('Access Denied: Account not found. Please register or check your email.');
      }
    }

    // Role-specific validations
    if (profile.role === 'partner') {
      if (profile.status === 'suspended') {
        throw new Error('Access Denied: This partner account has been suspended. Please contact the administrator.');
      }
      if (profile.status === 'pending') {
        throw new Error('Access Denied: This partner account is pending approval by the administrator.');
      }
    }

    // Password verification check
    if (password && password.length < 6) {
      throw new Error('Invalid credentials: Password must be at least 6 characters.');
    }

    const session: AuthSession = {
      uid: profile.uid,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      status: profile.status,
      phone: profile.phone,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  // Google Sign-In (Client Role)
  loginWithGoogle: async (): Promise<AuthSession> => {
    await delay(400);

    if (isFirebaseConfigured && auth) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        let profile =
          mockDatabase.getUser(user.uid) ||
          mockDatabase.getUserByEmail(user.email || '');
        
        if (!profile) {
          profile = mockDatabase.createClientProfile(
            user.uid,
            user.email || 'google.client@gowthamevents.com',
            user.displayName || 'Google Client',
            ''
          );
        }

        const session: AuthSession = {
          uid: profile.uid,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          status: profile.status,
          phone: profile.phone,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
      } catch (err: any) {
        throw new Error(err.message || 'Google Authentication failed.');
      }
    }

    // Mock Google Sign-In
    let profile = mockDatabase.getUserByEmail('google.client@gowthamevents.com');
    if (!profile) {
      profile = mockDatabase.createClientProfile(
        'google-client-uid',
        'google.client@gowthamevents.com',
        'Victoria Vance (Google Client)',
        '+1 (555) 321-4321'
      );
    }

    const session: AuthSession = {
      uid: profile.uid,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      status: profile.status,
      phone: profile.phone,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  // Client Registration
  registerClient: async (email: string, name: string, phone: string, password?: string): Promise<AuthSession> => {
    await delay(400);

    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password || '');
        const profile = mockDatabase.createClientProfile(userCredential.user.uid, cleanEmail, name, phone);
        
        const session: AuthSession = {
          uid: profile.uid,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          status: profile.status,
          phone: profile.phone,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
      } catch (err: any) {
        throw new Error(err.message || 'Registration failed.');
      }
    }

    // Mock Registration
    const mockUid = `client-${Math.random().toString(36).substr(2, 9)}`;
    const profile = mockDatabase.createClientProfile(mockUid, cleanEmail, name, phone);

    const session: AuthSession = {
      uid: profile.uid,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      status: profile.status,
      phone: profile.phone,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  // Admin Registration
  registerAdmin: async (email: string, name: string, accessCode: string, password?: string): Promise<AuthSession> => {
    await delay(400);

    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password || '');
        const profile = mockDatabase.createAdminProfile(userCredential.user.uid, cleanEmail, name, accessCode);

        const session: AuthSession = {
          uid: profile.uid,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          status: profile.status,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
      } catch (err: any) {
        throw new Error(err.message || 'Admin Registration failed.');
      }
    }

    // Mock Registration
    const mockUid = `admin-${Math.random().toString(36).substr(2, 9)}`;
    const profile = mockDatabase.createAdminProfile(mockUid, cleanEmail, name, accessCode);

    const session: AuthSession = {
      uid: profile.uid,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      status: profile.status,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  // Reset Password recovery mailer
  forgotPassword: async (email: string): Promise<void> => {
    await delay(300);

    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
        return;
      } catch (err: any) {
        throw new Error(err.message || 'Password reset request failed.');
      }
    }

    // Mock password recovery
    const profile = mockDatabase.getUserByEmail(cleanEmail);
    if (!profile) {
      throw new Error('Account with this email does not exist.');
    }
  },

  // Sign out session
  logout: async (): Promise<void> => {
    await delay(200);

    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signOut error', e);
      }
    }

    localStorage.removeItem(SESSION_KEY);
  }
};

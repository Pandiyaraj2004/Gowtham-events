import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthSession } from '../services/authService';

interface AuthContextType {
  user: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<AuthSession>;
  loginWithGoogle: () => Promise<AuthSession>;
  registerClient: (email: string, name: string, phone: string, password?: string) => Promise<AuthSession>;
  registerAdmin: (email: string, name: string, accessCode: string, password?: string) => Promise<AuthSession>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        setUser(session);
      } catch (err) {
        console.error('Failed to restore auth session.', err);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const session = await authService.loginWithEmail(email, password);
      setUser(session);
      return session;
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const session = await authService.loginWithGoogle();
      setUser(session);
      return session;
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerClient = async (email: string, name: string, phone: string, password?: string) => {
    setIsLoading(true);
    try {
      const session = await authService.registerClient(email, name, phone, password);
      setUser(session);
      return session;
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerAdmin = async (email: string, name: string, accessCode: string, password?: string) => {
    setIsLoading(true);
    try {
      const session = await authService.registerAdmin(email, name, accessCode, password);
      setUser(session);
      return session;
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword(email);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        registerClient,
        registerAdmin,
        forgotPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

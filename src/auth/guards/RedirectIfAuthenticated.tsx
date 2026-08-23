import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../../components/Loader';

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

export const RedirectIfAuthenticated: React.FC<RedirectIfAuthenticatedProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader isLoading={true} />;
  }

  if (user) {
    const role = (user.role || '').trim().toLowerCase();
    // Redirect authenticated users to their corresponding role console
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (role === 'partner') {
      return <Navigate to="/partner" replace />;
    }
    if (role === 'client') {
      return <Navigate to="/client" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

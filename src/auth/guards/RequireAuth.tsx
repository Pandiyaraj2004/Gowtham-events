import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../../components/Loader';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'partner' | 'client')[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader isLoading={true} />;
  }

  if (!user) {
    // Save current location so login can redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = (user.role || '').trim().toLowerCase() as 'admin' | 'partner' | 'client';

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If the authenticated user's role is not authorized for this area
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

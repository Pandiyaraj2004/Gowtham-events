import React from 'react';
import { DashboardShell } from './DashboardShell';
import { 
  FiHome, 
  FiBarChart2, 
  FiCalendar, 
  FiUsers, 
  FiActivity, 
  FiPlusCircle, 
  FiCamera, 
  FiDollarSign, 
  FiFileText, 
  FiSettings,
  FiFolder,
  FiImage
} from 'react-icons/fi';

export const AdminLayout: React.FC = () => {
  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: FiHome, end: true },
    { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
    { name: 'Events', path: '/admin/events', icon: FiCalendar },
    { name: 'Clients', path: '/admin/clients', icon: FiUsers },
    { name: 'Partners', path: '/admin/partners', icon: FiActivity },
    { name: 'Bookings', path: '/admin/bookings', icon: FiPlusCircle },
    { name: 'Media', path: '/admin/media', icon: FiCamera },
    { name: 'Portfolio', path: '/admin/portfolio', icon: FiFolder },
    { name: 'Gallery', path: '/admin/gallery', icon: FiImage },
    { name: 'Payments', path: '/admin/payments', icon: FiDollarSign },
    { name: 'Reports', path: '/admin/reports', icon: FiFileText },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <DashboardShell
      portalName="Admin Console"
      roleBadge="Administrator"
      links={adminLinks}
    />
  );
};
export default AdminLayout;

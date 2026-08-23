import React from 'react';
import { DashboardShell } from './DashboardShell';
import { 
  FiHome, 
  FiCalendar, 
  FiLayers, 
  FiSettings,
  FiImage,
  FiMessageSquare
} from 'react-icons/fi';

export const ClientLayout: React.FC = () => {
  const clientLinks = [
    { name: 'Overview', path: '/client', icon: FiHome, end: true },
    { name: 'My Events', path: '/client/events', icon: FiCalendar },
    { name: 'Documents', path: '/client/documents', icon: FiLayers },
    { name: 'Gallery', path: '/client/gallery', icon: FiImage },
    { name: 'Messages', path: '/client/messages', icon: FiMessageSquare },
    { name: 'Profile', path: '/client/profile', icon: FiSettings },
  ];

  return (
    <DashboardShell
      portalName="Client Console"
      roleBadge="Client / Host"
      links={clientLinks}
    />
  );
};
export default ClientLayout;

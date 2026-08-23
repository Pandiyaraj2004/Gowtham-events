import React from 'react';
import { DashboardShell } from './DashboardShell';
import { 
  FiHome, 
  FiFolder, 
  FiSettings,
  FiCamera,
  FiMessageSquare
} from 'react-icons/fi';

export const PartnerLayout: React.FC = () => {
  const partnerLinks = [
    { name: 'Overview', path: '/partner', icon: FiHome, end: true },
    { name: 'Assigned Projects', path: '/partner/projects', icon: FiFolder },
    { name: 'Media Uploads', path: '/partner/media', icon: FiCamera },
    { name: 'Messages', path: '/partner/messages', icon: FiMessageSquare },
    { name: 'Profile', path: '/partner/profile', icon: FiSettings },
  ];

  return (
    <DashboardShell
      portalName="Partner Panel"
      roleBadge="Service Partner"
      links={partnerLinks}
    />
  );
};
export default PartnerLayout;

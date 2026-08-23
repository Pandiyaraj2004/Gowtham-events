import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { getZoneById } from '../../journey/content/zoneRegistry';
import { Loader } from '../../components/Loader';

export const Services: React.FC = () => {
  const zone = getZoneById('offerings');
  const navigate = useNavigate();

  useSEO({
    title: zone?.title || 'Bespoke Curations & Disciplines — Gowtham Events',
    description: zone?.description || 'Comprehensive high-concept event design, precision technical staging, and luxury event production.',
  });

  useEffect(() => {
    navigate('/', { state: { scrollTo: 'offerings' }, replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <Loader isLoading={true} />
    </div>
  );
};

export default Services;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { getZoneById } from '../../journey/content/zoneRegistry';
import { Loader } from '../../components/Loader';

export const Gallery: React.FC = () => {
  const zone = getZoneById('moments');
  const navigate = useNavigate();

  useSEO({
    title: zone?.title || 'Visual Moments & Atmosphere — Gowtham Events',
    description: zone?.description || 'Curated atmospheric captures celebrating our architectural lighting, floral installations, and design craft.',
  });

  useEffect(() => {
    navigate('/', { state: { scrollTo: 'moments' }, replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <Loader isLoading={true} />
    </div>
  );
};

export default Gallery;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { getZoneById } from '../../journey/content/zoneRegistry';
import { Loader } from '../../components/Loader';

export const Portfolio: React.FC = () => {
  const zone = getZoneById('proof');
  const navigate = useNavigate();

  useSEO({
    title: zone?.title || 'Masterpiece Archive — Gowtham Events',
    description: zone?.description || 'Explore our exclusive collection of luxury galas, celebrations, and architectural productions.',
  });

  useEffect(() => {
    navigate('/', { state: { scrollTo: 'proof' }, replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <Loader isLoading={true} />
    </div>
  );
};

export default Portfolio;

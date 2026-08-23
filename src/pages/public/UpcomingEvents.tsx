import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { getZoneById } from '../../journey/content/zoneRegistry';
import { Loader } from '../../components/Loader';

export const UpcomingEvents: React.FC = () => {
  const zone = getZoneById('whatsnext');
  const navigate = useNavigate();

  useSEO({
    title: zone?.title || 'Calendar & Upcoming Galas — Gowtham Events',
    description: zone?.description || 'Upcoming sovereign summits, private galas, and premier fashion showcases with live countdowns.',
  });

  useEffect(() => {
    navigate('/', { state: { scrollTo: 'whatsnext' }, replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <Loader isLoading={true} />
    </div>
  );
};

export default UpcomingEvents;

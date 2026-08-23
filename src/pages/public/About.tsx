import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { getZoneById } from '../../journey/content/zoneRegistry';
import { Loader } from '../../components/Loader';

export const About: React.FC = () => {
  const zone = getZoneById('story');
  const navigate = useNavigate();

  useSEO({
    title: zone?.title || 'Our Story & Legacy — Gowtham Events',
    description: zone?.description || 'Discover the story, mission, and architects behind Gowtham Events.',
  });

  useEffect(() => {
    navigate('/', { state: { scrollTo: 'story' }, replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <Loader isLoading={true} />
    </div>
  );
};

export default About;

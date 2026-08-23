import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { getZoneById } from '../../journey/content/zoneRegistry';
import { Loader } from '../../components/Loader';

export const Contact: React.FC = () => {
  const zone = getZoneById('begin');
  const navigate = useNavigate();

  useSEO({
    title: zone?.title || 'Initiate Consultation — Gowtham Events',
    description: zone?.description || 'Inquire with our executive event directorship to begin curating your next landmark gathering.',
  });

  useEffect(() => {
    navigate('/', { state: { scrollTo: 'begin' }, replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <Loader isLoading={true} />
    </div>
  );
};

export default Contact;

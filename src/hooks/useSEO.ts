import { useEffect } from 'react';

interface SEOParticle {
  title: string;
  description: string;
}

export const useSEO = ({ title, description }: SEOParticle) => {
  useEffect(() => {
    // Set title
    const fullTitle = `${title} | Gowtham Events`;
    document.title = fullTitle;

    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }, [title, description]);
};

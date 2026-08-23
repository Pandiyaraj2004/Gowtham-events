import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMaximize2 } from 'react-icons/fi';
import { Lightbox } from '../../components/Lightbox';

interface MomentItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

const GALLERY_MOMENTS: MomentItem[] = [
  {
    id: 'mom-1',
    title: 'Suspended Rose Pergola',
    category: 'Florals',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    description: 'Over 12,000 live white Avalanche roses suspended above the grand Lake Como dining pavilion.',
  },
  {
    id: 'mom-2',
    title: 'Volumetric Laser Scenography',
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800',
    description: '360-degree synchronized laser diffraction arrays at the Sovereign Tech Summit.',
  },
  {
    id: 'mom-3',
    title: 'Waterfront Staging Rig',
    category: 'Atmosphere',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800',
    description: 'Bespoke pontoon foundation built for 1,200 guests on the waters of the Côte d’Azur.',
  },
  {
    id: 'mom-4',
    title: 'Artisanal Haute Gastronomy',
    category: 'Gastronomy',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800',
    description: 'Custom molecular dessert service paired with vintage Champagne.',
  },
  {
    id: 'mom-5',
    title: 'Architectural Monogram Arch',
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800',
    description: 'Gold mirrored kinetic arches welcoming international dignitaries in Paris.',
  },
  {
    id: 'mom-6',
    title: 'Kinetic Hologram Projection',
    category: 'Atmosphere',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800',
    description: 'Real-time volumetric projection mapping across monumental estate façades.',
  },
];

export const ActMoments: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const tags = ['All', 'Lighting', 'Florals', 'Atmosphere', 'Gastronomy'];

  const filteredItems = selectedTag === 'All'
    ? GALLERY_MOMENTS
    : GALLERY_MOMENTS.filter(
        (item) =>
          item.category.toLowerCase().includes(selectedTag.toLowerCase()) ||
          item.title.toLowerCase().includes(selectedTag.toLowerCase())
      );

  const allImages = GALLERY_MOMENTS.map((g) => g.image);

  const handleOpenLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id="moments"
      className="relative min-h-[140vh] py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 select-none pointer-events-none"
    >
      <div className="space-y-16 pointer-events-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-zinc-800 pb-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-amber-500">
                Act V &bull; Atmospheric Moments
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50 leading-tight">
              Fleeting Moments, <br />
              <span className="text-gradient-gold">Enduring Impressions</span>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-zinc-400 font-light leading-relaxed">
              A sensory tapestry of intricate floral installations, dynamic optical projections, bespoke table architectures, and ambient guest atmospheres.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                    : 'bg-white/40 dark:bg-zinc-900/60 border border-neutral-200/80 dark:border-zinc-800 text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
              onClick={() => handleOpenLightbox(allImages.indexOf(item.image))}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-950 cursor-pointer shadow-lg border border-neutral-200/60 dark:border-zinc-800/80"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover Overlay Card */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
                    {item.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                    <FiMaximize2 size={14} />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-heading font-bold">{item.title}</h3>
                  <p className="text-xs text-zinc-300 font-light">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Lightbox Component */}
        <Lightbox
          isOpen={lightboxOpen}
          images={allImages}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
          onNext={() => setCurrentIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
        />

      </div>
    </section>
  );
};

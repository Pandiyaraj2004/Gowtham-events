import React, { useEffect, useState } from 'react';
import { FiEye, FiSearch } from 'react-icons/fi';
import { Lightbox } from '../../components/Lightbox';

interface MediaItem {
  id: string;
  url: string;
  category: string;
  title: string;
}

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('vanguard_db_gallery');
    if (data) {
      setItems(JSON.parse(data));
    }
  }, []);

  const filtered = items.filter((item) => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
            Shared Media Gallery
          </h1>
          <p className="text-xs text-neutral-500 dark:text-zinc-550 mt-1 font-light">
            Browse and download high-resolution event photographs shared by your event manager.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-450 dark:text-zinc-650" />
          <input
            type="text"
            placeholder="Search gallery files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 rounded-xl pl-11 pr-4 py-2.5 text-xs text-neutral-805 dark:text-zinc-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow relative h-60 cursor-pointer"
            onClick={() => setSelectedIdx(idx)}
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Hover overlay details */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end items-start text-white">
              <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400">{item.category}</span>
              <h4 className="text-sm font-heading font-semibold mt-1 flex items-center gap-1.5">
                <FiEye /> {item.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {selectedIdx !== null && (
        <Lightbox
          isOpen={selectedIdx !== null}
          images={filtered.map((item) => item.url)}
          currentIndex={selectedIdx}
          onClose={() => setSelectedIdx(null)}
          onPrev={() => setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : filtered.length - 1))}
          onNext={() => setSelectedIdx((prev) => (prev !== null && prev < filtered.length - 1 ? prev + 1 : 0))}
        />
      )}
    </div>
  );
};
export default Gallery;

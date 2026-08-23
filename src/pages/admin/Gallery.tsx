import React, { useEffect, useState } from 'react';
import { db } from '../../data/db';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

interface GalleryItem {
  id: string;
  url: string;
  category: string;
  title: string;
}

export const Gallery: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [albumFilter, setAlbumFilter] = useState<'all' | 'weddings' | 'corporate' | 'galas'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    url: '',
    category: 'corporate',
    title: '',
  });

  const loadGallery = () => {
    const data = localStorage.getItem('vanguard_db_gallery');
    if (!data) {
      const initial: GalleryItem[] = [
        { id: '1', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800', category: 'corporate', title: 'Grand Conference' },
        { id: '2', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800', category: 'weddings', title: 'Lake Como Arch' },
        { id: '3', url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800', category: 'galas', title: 'Champagne Tower' },
      ];
      localStorage.setItem('vanguard_db_gallery', JSON.stringify(initial));
      setGallery(initial);
    } else {
      setGallery(JSON.parse(data));
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.url || !newItem.title) {
      toast.error('Image URL and Title are required.');
      return;
    }
    const item: GalleryItem = {
      id: `img-${Date.now()}`,
      url: newItem.url,
      category: newItem.category,
      title: newItem.title,
    };
    const updated = [...gallery, item];
    localStorage.setItem('vanguard_db_gallery', JSON.stringify(updated));
    setGallery(updated);
    toast.success('Media added to gallery album successfully!');
    setNewItem({ url: '', category: 'corporate', title: '' });
    setShowAddModal(false);
    db.logActivity('Update Gallery', `Added photo "${item.title}" to album: ${item.category}`);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Remove this photo from the gallery?')) {
      const updated = gallery.filter(item => item.id !== id);
      localStorage.setItem('vanguard_db_gallery', JSON.stringify(updated));
      setGallery(updated);
      toast.success('Media removed.');
      db.logActivity('Update Gallery', `Deleted photo asset from album`);
    }
  };

  const filtered = gallery.filter(item => albumFilter === 'all' || item.category === albumFilter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
            Gallery Albums
          </h1>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
            Organize event assets, divide media collections, and publish high-res photographs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
        >
          <FiPlus /> Add Photo
        </button>
      </div>

      {/* Filter and Album Bar */}
      <div className="flex gap-2 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
        {(['all', 'corporate', 'weddings', 'galas'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setAlbumFilter(filter)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              albumFilter === filter
                ? 'bg-amber-500 text-neutral-950'
                : 'bg-neutral-55/10 dark:bg-zinc-950 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-zinc-900'
            }`}
          >
            {filter} Album
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow relative h-64"
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay Cover */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-between items-start text-white">
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="self-end p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg cursor-pointer transition-colors"
              >
                <FiTrash2 size={16} />
              </button>
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400">{item.category}</span>
                <h4 className="text-sm font-heading font-semibold mt-1">{item.title}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 rounded-2xl p-6 md:p-8 max-w-md w-full space-y-6 text-left relative">
            <div>
              <h3 className="text-lg font-heading font-semibold text-neutral-905 dark:text-zinc-50">
                Add Image to Album
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">
                Enter asset details. Images are automatically optimized and scaled.
              </p>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Photo Title</label>
                <input
                  type="text"
                  required
                  placeholder="Suspended floral installation"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Image Asset URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Select Album Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="corporate">Corporate Summit</option>
                  <option value="weddings">Weddings</option>
                  <option value="galas">Galas</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-grow py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Publish Media
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-neutral-250 dark:border-zinc-800 text-neutral-500 dark:text-zinc-400 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Gallery;

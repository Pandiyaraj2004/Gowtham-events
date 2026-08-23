import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { db } from '../../data/db';
import { useAuth } from '../../auth/context/AuthContext';
import { FiUploadCloud, FiClock } from 'react-icons/fi';

interface PartnerMedia {
  id: string;
  url: string;
  category: string;
  title: string;
  approved: boolean;
  uploadedAt: string;
}

export const Media: React.FC = () => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<PartnerMedia[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('weddings');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!title.trim()) {
      toast.error('Please enter a photo title first.');
      return;
    }

    toast.loading('Optimizing media and sending to Cloudinary...');

    setTimeout(() => {
      toast.dismiss();
      const mockUrl = 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800';
      const newItem: PartnerMedia = {
        id: `p-upload-${Date.now()}`,
        url: mockUrl,
        category,
        title,
        approved: false, // Must be approved by admin
        uploadedAt: new Date().toISOString(),
      };

      // Add to local state
      setUploads((prev) => [newItem, ...prev]);
      
      // Save inside local mock database gallery logs
      const currentGallery = JSON.parse(localStorage.getItem('vanguard_db_gallery') || '[]');
      // Inject partner upload (with approved: false status)
      currentGallery.push({
        id: newItem.id,
        url: newItem.url,
        category: newItem.category,
        title: `${newItem.title} (Uploaded by ${user?.name})`,
        approved: false, // admin filter
      });
      localStorage.setItem('vanguard_db_gallery', JSON.stringify(currentGallery));

      toast.success('Upload complete! Document queued for admin approval.');
      db.logActivity('Partner Upload', `${user?.name} uploaded event photo "${newItem.title}" (file: ${file.name}, pending approval)`);
      setTitle('');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
          Media Uploads
        </h1>
        <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
          Upload on-site setup photographs or high-res reels. Assets undergo administrative reviews before public syndications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload controller */}
        <div className="lg:col-span-5 p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-5">
          <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-2">Publish Event Photos</h2>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Asset Title</label>
            <input
              type="text"
              required
              placeholder="Table centerpiece setup"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-555">Album Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-300 focus:outline-none"
            >
              <option value="weddings">Weddings</option>
              <option value="corporate">Corporate Summit</option>
              <option value="galas">Galas</option>
            </select>
          </div>

          {/* Drag & Drop */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragActive 
                ? 'border-amber-500 bg-amber-500/5' 
                : 'border-neutral-250 dark:border-zinc-850 hover:border-amber-500/50 background-white dark:bg-zinc-950/20'
            }`}
          >
            <FiUploadCloud size={30} className="text-neutral-400 dark:text-zinc-650 mb-3" />
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-zinc-350 mb-1">
              Drag file here to upload
            </h3>
            <p className="text-[10px] text-neutral-450 dark:text-zinc-550 mb-3">Or click browse files</p>
            <label className="px-3.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-800 text-[10px] font-bold uppercase cursor-pointer hover:bg-amber-500 hover:text-neutral-950 transition-colors">
              Select File
              <input
                type="file"
                className="hidden"
                disabled={!title.trim()}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Uploads list */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-6">
          <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50">Uploads in Review Queue</h2>
          
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {uploads.length === 0 ? (
              <div className="text-center text-xs text-neutral-455 py-12 italic">No media assets in review. Uploaded photos appear here.</div>
            ) : (
              uploads.map((up) => (
                <div key={up.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/60 dark:border-zinc-850/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={up.url} alt={up.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-zinc-200">{up.title}</div>
                      <div className="text-[10px] text-neutral-500 mt-1 uppercase font-semibold">{up.category}</div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-bold uppercase tracking-wider rounded-full">
                    <FiClock /> In Review
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default Media;

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { db } from '../../data/db';
import { 
  FiUploadCloud, 
  FiFolder, 
  FiTrash2, 
  FiSliders, 
  FiGrid 
} from 'react-icons/fi';
import { getOptimizedMediaUrl } from '../../utils/cloudinary';

interface MediaAsset {
  id: string;
  name: string;
  folder: string;
  url: string;
  type: 'image' | 'video';
  size: string;
  uploadedAt: string;
}

export const Media: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState('Gallery');
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([
    {
      id: 'm-1',
      name: 'Lake Como Sunset Ceremony.jpg',
      folder: 'Gallery',
      url: 'https://res.cloudinary.com/demo/image/upload/v1615456321/sample.jpg',
      type: 'image',
      size: '2.4 MB',
      uploadedAt: '2026-07-24T12:00:00Z',
    },
    {
      id: 'm-2',
      name: 'Corporate Keynote Stage.jpg',
      folder: 'Events',
      url: 'https://res.cloudinary.com/demo/image/upload/v1615456321/sample.jpg',
      type: 'image',
      size: '1.8 MB',
      uploadedAt: '2026-07-24T12:30:00Z',
    },
    {
      id: 'm-3',
      name: 'Showcase Highlights Reel.mp4',
      folder: 'Portfolio',
      url: 'https://res.cloudinary.com/demo/video/upload/v1615456321/dog.mp4',
      type: 'video',
      size: '18.4 MB',
      uploadedAt: '2026-07-24T13:00:00Z',
    }
  ]);

  const folders = ['Company Logo', 'Hero', 'Services', 'Gallery', 'Portfolio', 'Events', 'Team', 'Partners'];

  const [dragActive, setDragActive] = useState(false);

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
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleFilesUpload = (files: FileList) => {
    toast.loading('Optimizing media and uploading preset channels...');
    
    // Simulate Cloudinary Upload preset
    setTimeout(() => {
      toast.dismiss();
      const newAssets: MediaAsset[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith('video');
        const asset: MediaAsset = {
          id: `upload-${Date.now()}-${i}`,
          name: file.name,
          folder: activeFolder,
          url: isVideo 
            ? 'https://res.cloudinary.com/demo/video/upload/v1615456321/dog.mp4'
            : 'https://res.cloudinary.com/demo/image/upload/v1615456321/sample.jpg',
          type: isVideo ? 'video' : 'image',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedAt: new Date().toISOString(),
        };
        newAssets.push(asset);
      }

      setMediaAssets((prev) => [...prev, ...newAssets]);
      toast.success(`Successfully uploaded and optimized ${files.length} asset(s) with f_auto, q_auto parameters!`);
      db.logActivity('Media Upload', `Uploaded and optimized ${files.length} media file(s) into folder: ${activeFolder}`);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this media asset from Cloudinary storage?')) {
      setMediaAssets(mediaAssets.filter((m) => m.id !== id));
      toast.success('Asset deleted.');
      db.logActivity('Media Delete', `Deleted media asset from folder: ${activeFolder}`);
    }
  };

  const filteredAssets = mediaAssets.filter((m) => m.folder === activeFolder);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
          Media Manager
        </h1>
        <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
          Upload logo assets, hero graphics, and portfolio media, optimized automatically through Cloudinary's dynamic CDN pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Folders List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
            <h2 className="text-xs font-bold text-neutral-450 dark:text-zinc-550 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FiFolder /> Folder Directory
            </h2>
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    activeFolder === folder
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'text-neutral-500 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-zinc-950/40'
                  }`}
                >
                  <span>{folder}</span>
                  <span className="text-[10px] bg-neutral-100 dark:bg-zinc-950 px-2 py-0.5 rounded-full font-mono">
                    {mediaAssets.filter((m) => m.folder === folder).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Drag & Drop + Media Grid */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Drag and Drop Container */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center transition-all ${
              dragActive 
                ? 'border-amber-500 bg-amber-500/5' 
                : 'border-neutral-200 dark:border-zinc-850 hover:border-amber-500/50 bg-white dark:bg-zinc-900'
            }`}
          >
            <FiUploadCloud size={40} className="text-neutral-400 dark:text-zinc-600 mb-4 animate-bounce-slow" />
            <h3 className="text-sm font-heading font-semibold text-neutral-900 dark:text-zinc-200 mb-1">
              Drag & Drop your media files here
            </h3>
            <p className="text-xs text-neutral-550 dark:text-zinc-550 mb-4">
              Supports JPG, PNG, WEBP, and MP4 up to 50MB. Uploads map to: <strong className="text-amber-500">{activeFolder}</strong>.
            </p>
            <label className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold uppercase tracking-wider cursor-pointer">
              Browse Files
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFilesUpload(e.target.files)}
              />
            </label>
          </div>

          {/* Media Assets Grid */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 flex items-center gap-2">
                <FiGrid /> Folder Files: {activeFolder}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAssets.length === 0 ? (
                <div className="col-span-full text-center py-12 text-zinc-500 italic">No files upload yet inside this folder directory.</div>
              ) : (
                filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="group rounded-2xl overflow-hidden bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/60 dark:border-zinc-850/80 premium-shadow relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Media Preview Box */}
                      <div className="h-40 bg-zinc-950 overflow-hidden relative flex items-center justify-center">
                        {asset.type === 'video' ? (
                          <video 
                            src={getOptimizedMediaUrl(asset.url, { type: 'video' })} 
                            className="w-full h-full object-cover" 
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={getOptimizedMediaUrl(asset.url, { width: 400 })}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-zinc-950/80 text-[8px] font-bold text-amber-500 uppercase font-mono">
                          {asset.type}
                        </span>
                      </div>
                      
                      {/* Details */}
                      <div className="p-4">
                        <div className="text-xs font-bold text-neutral-900 dark:text-zinc-200 truncate" title={asset.name}>
                          {asset.name}
                        </div>
                        <div className="text-[10px] text-neutral-500 dark:text-zinc-500 mt-1 flex justify-between">
                          <span>Size: {asset.size}</span>
                          <span>{new Date(asset.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Optimize / Actions bar */}
                    <div className="p-4 border-t border-neutral-200/50 dark:border-zinc-850/50 flex justify-between items-center bg-neutral-100/40 dark:bg-zinc-950/20">
                      {/* Cloudinary dynamic transformations details tooltip */}
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full uppercase cursor-help" title="Responsive width loading + auto format & quality triggers">
                        <FiSliders size={11} /> optimized
                      </span>
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                        title="Delete asset"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Media;

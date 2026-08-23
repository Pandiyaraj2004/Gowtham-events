import React, { useEffect, useState } from 'react';
import { db } from '../../data/db';
import { Project } from '../../types';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiMapPin, FiCalendar, FiGlobe } from 'react-icons/fi';

export const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    category: '',
    location: '',
    date: '',
    image: '',
    description: '',
  });

  const refreshProjects = () => {
    db.getProjects().then(setProjects);
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.category || !newProject.location) {
      toast.error('Name, Category, and Location are required.');
      return;
    }

    try {
      const projToSave: Project = {
        id: `proj-${Math.random().toString(36).substr(2, 9)}`,
        name: newProject.name,
        category: newProject.category,
        location: newProject.location,
        date: newProject.date || new Date().toISOString().split('T')[0],
        image: newProject.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800',
        description: newProject.description,
        gallery: [],
      };

      await db.saveProject(projToSave);
      toast.success('Project published successfully!');
      setNewProject({ name: '', category: '', location: '', date: '', image: '', description: '' });
      setShowAddModal(false);
      refreshProjects();
    } catch (err: any) {
      toast.error('Failed to publish project.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this project from your portfolio?')) {
      try {
        await db.deleteProject(id);
        toast.success('Project deleted.');
        refreshProjects();
      } catch (err: any) {
        toast.error('Failed to delete project.');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
            Portfolio Showcase
          </h1>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
            Manage projects published to the public website portfolio section.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
        >
          <FiPlus /> Add Project
        </button>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase bg-zinc-950/80 backdrop-blur-sm text-amber-500 rounded-full">
                  {p.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-base font-heading font-bold text-neutral-900 dark:text-zinc-100">{p.name}</h3>
                <div className="text-[11px] text-neutral-500 dark:text-zinc-500 mt-1.5 flex gap-4">
                  <span className="flex items-center gap-1"><FiMapPin /> {p.location}</span>
                  <span className="flex items-center gap-1"><FiCalendar /> {p.date}</span>
                </div>
                <p className="text-xs text-neutral-550 dark:text-zinc-400 mt-4 leading-relaxed font-light line-clamp-3">
                  {p.description}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 dark:border-zinc-850/60 flex justify-between items-center bg-neutral-50/50 dark:bg-zinc-950/10">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase">
                <FiGlobe /> Published
              </span>
              <button
                onClick={() => handleDeleteProject(p.id)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                title="Delete Project"
              >
                <FiTrash2 size={16} />
              </button>
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
                Add Portfolio Project
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">
                Fill details below. Publishing creates instant updates on the public showcases.
              </p>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="Stellar Corporate Ballroom"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Category Type</label>
                  <input
                    type="text"
                    required
                    placeholder="Corporate Gala"
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Completion Date</label>
                  <input
                    type="date"
                    value={newProject.date}
                    onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Location Address</label>
                <input
                  type="text"
                  required
                  placeholder="Paris, France"
                  value={newProject.location}
                  onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Image Asset URL</label>
                <input
                  type="text"
                  placeholder="https://unsplash.com/..."
                  value={newProject.image}
                  onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Project Description</label>
                <textarea
                  placeholder="Design methodologies and logistics summaries..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-grow py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Publish Project
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
export default Portfolio;

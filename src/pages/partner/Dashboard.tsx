import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { db, ProjectTask, Announcement } from '../../data/db';
import { FiFolder, FiCheckSquare, FiAlertCircle, FiStar, FiFileText } from 'react-icons/fi';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const projectId = 'seraphina-wedding'; // Baseline partner project
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [anns, setAnns] = useState<Announcement[]>([]);

  useEffect(() => {
    db.getProjectTasks(projectId).then(setTasks);
    db.getAnnouncements().then(setAnns);
  }, []);

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] pointer-events-none" />
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-neutral-500 dark:text-zinc-400 font-light leading-relaxed max-w-lg">
            Operational dashboard. Update assigned milestone statuses, submit project completion reports, and view global announcements.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="p-3 bg-amber-500/10 text-amber-500 w-fit rounded-xl mb-4"><FiFolder size={20} /></div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">1</div>
          <div className="text-[10px] text-neutral-450 dark:text-zinc-555 uppercase tracking-wider font-bold mt-1">Assigned Projects</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="p-3 bg-amber-500/10 text-amber-500 w-fit rounded-xl mb-4"><FiCheckSquare size={20} /></div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">{completedTasks}</div>
          <div className="text-[10px] text-neutral-450 dark:text-zinc-555 uppercase tracking-wider font-bold mt-1">Completed Deliverables</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="p-3 bg-amber-500/10 text-amber-500 w-fit rounded-xl mb-4"><FiAlertCircle size={20} /></div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">{pendingTasks}</div>
          <div className="text-[10px] text-neutral-450 dark:text-zinc-555 uppercase tracking-wider font-bold mt-1">Pending Checkmarks</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="p-3 bg-amber-500/10 text-amber-500 w-fit rounded-xl mb-4"><FiStar size={20} /></div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">4.8</div>
          <div className="text-[10px] text-neutral-450 dark:text-zinc-555 uppercase tracking-wider font-bold mt-1">Performance Rating</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Deadline alerts */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Upcoming deadlines */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-4">
            <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50">Deliverable Deadlines</h2>
            <div className="space-y-3.5">
              {tasks.filter((t) => t.status !== 'completed').map((t) => (
                <div key={t.id} className="p-4 rounded-xl border border-red-500/15 bg-red-500/5 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-zinc-200">{t.name}</div>
                    <div className="text-neutral-500 mt-1 font-light">Status: <strong className="text-amber-500 uppercase">{t.status}</strong></div>
                  </div>
                  <span className="font-mono text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded text-[10px]">Due: {t.deadline}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Announcements board */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-4">
            <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50 flex items-center gap-1.5">
              <FiFileText className="text-amber-500" /> Announcements
            </h2>
            <div className="space-y-4">
              {anns.map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-100 dark:border-zinc-850 space-y-1.5 text-xs">
                  <h3 className="font-bold text-neutral-900 dark:text-zinc-200">{ann.title}</h3>
                  <p className="text-neutral-505 dark:text-zinc-450 leading-relaxed font-light">{ann.content}</p>
                  <span className="text-[9px] text-neutral-400 font-mono block pt-1">{new Date(ann.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Dashboard;

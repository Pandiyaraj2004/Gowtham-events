import React, { useEffect, useState } from 'react';
import { db, ProjectTask } from '../../data/db';
import { toast } from 'react-hot-toast';
import { 
  FiMapPin, 
  FiCalendar, 
  FiUser, 
  FiCheckSquare, 
  FiClock, 
  FiSend 
} from 'react-icons/fi';

export const Projects: React.FC = () => {
  const projectId = 'seraphina-wedding';
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  
  // Extension & report modal states
  const [modalType, setModalType] = useState<'extension' | 'report' | null>(null);
  const [inputText, setInputText] = useState('');

  const loadTasks = () => {
    db.getProjectTasks(projectId).then(setTasks);
  };

  useEffect(() => {
    loadTasks();
    const unsub = db.subscribeToProjectChanges(projectId, () => {
      loadTasks();
    });
    return unsub;
  }, []);

  const handleUpdateStatus = async (task: ProjectTask, status: 'pending' | 'in_progress' | 'completed') => {
    const updated = { ...task, status };
    try {
      await db.saveProjectTask(updated);
      toast.success(`Task status updated to ${status.toUpperCase()}`);
      loadTasks();
    } catch (err) {
      toast.error('Failed to update task.');
    }
  };

  const handleOpenModal = (task: ProjectTask, type: 'extension' | 'report') => {
    setSelectedTask(task);
    setModalType(type);
    setInputText('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !inputText.trim()) return;

    let updated: ProjectTask = { ...selectedTask };

    if (modalType === 'extension') {
      updated.extensionRequested = true;
      updated.extensionReason = inputText;
      toast.success('Extension request dispatched for Admin review.');
    } else if (modalType === 'report') {
      updated.completionReportSubmitted = true;
      updated.completionReportNotes = inputText;
      updated.status = 'completed'; // auto mark completed when report is submitted
      toast.success('Task Completion Report submitted.');
    }

    try {
      await db.saveProjectTask(updated);
      setModalType(null);
      setSelectedTask(null);
      loadTasks();
    } catch (err) {
      toast.error('Submission failed.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
          Assigned Projects
        </h1>
        <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
          Manage operational schedules, check off tasks, and file completion audits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tasks Board Checklist */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-6">
            <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50 flex items-center gap-1.5">
              <FiCheckSquare className="text-amber-500" /> Operational Deliverables Checklist
            </h2>
            
            <div className="space-y-4">
              {tasks.map((t) => (
                <div 
                  key={t.id}
                  className="p-5 rounded-2xl bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/60 dark:border-zinc-850/80 space-y-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-zinc-200 leading-normal">{t.name}</h3>
                      <div className="text-[10px] text-neutral-450 mt-1.5 font-mono">Deadline: {t.deadline}</div>
                    </div>
                    
                    {/* Status selectors dropdown */}
                    <select
                      value={t.status}
                      onChange={(e) => handleUpdateStatus(t, e.target.value as any)}
                      className="bg-white dark:bg-zinc-900 border border-neutral-250 dark:border-zinc-800 rounded-lg text-[10px] font-bold uppercase tracking-wider px-2 py-1 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {t.notes && (
                    <p className="text-[11px] text-neutral-500 italic bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-neutral-100 dark:border-zinc-850/50">
                      Notes: "{t.notes}"
                    </p>
                  )}

                  {/* Submission alerts flags */}
                  {t.extensionRequested && (
                    <div className="text-[9px] text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1.5 bg-amber-500/5 p-2 rounded-lg">
                      <FiClock /> Extension Requested: "{t.extensionReason}"
                    </div>
                  )}

                  {t.completionReportSubmitted && (
                    <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1.5 bg-emerald-500/5 p-2 rounded-lg">
                      <FiSend /> Completion Audited: "{t.completionReportNotes}"
                    </div>
                  )}

                  {/* Actions buttons */}
                  {t.status !== 'completed' && (
                    <div className="flex gap-2.5 justify-end">
                      <button
                        onClick={() => handleOpenModal(t, 'extension')}
                        className="px-3.5 py-1.5 rounded-lg border border-neutral-250 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider hover:text-amber-500 cursor-pointer"
                        disabled={t.extensionRequested}
                      >
                        Request Extension
                      </button>
                      <button
                        onClick={() => handleOpenModal(t, 'report')}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                        disabled={t.completionReportSubmitted}
                      >
                        Submit Report
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Project details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-4">
            <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Project Overview</h2>
            
            <div className="space-y-4 text-xs text-neutral-600 dark:text-zinc-350">
              <div className="flex items-center gap-3 bg-neutral-50 dark:bg-zinc-950/40 p-3 rounded-xl">
                <FiUser className="text-amber-500 shrink-0" size={16} />
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Client Host</div>
                  <div className="font-semibold text-neutral-900 dark:text-zinc-250 mt-0.5">Seraphina Vance</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-neutral-50 dark:bg-zinc-950/40 p-3 rounded-xl">
                <FiMapPin className="text-amber-500 shrink-0" size={16} />
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Event Location</div>
                  <div className="font-semibold text-neutral-900 dark:text-zinc-250 mt-0.5">Lake Como, Italy</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-neutral-50 dark:bg-zinc-950/40 p-3 rounded-xl">
                <FiCalendar className="text-amber-500 shrink-0" size={16} />
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Delivery Date</div>
                  <div className="font-semibold text-neutral-900 dark:text-zinc-250 mt-0.5">June 18, 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Extension/Report Dialog Overlay */}
      {modalType && selectedTask && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <form onSubmit={handleFormSubmit} className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 rounded-2xl p-6 md:p-8 max-w-sm w-full space-y-6 text-left relative">
            <div>
              <h3 className="text-lg font-heading font-semibold text-neutral-905 dark:text-zinc-50">
                {modalType === 'extension' ? 'Request Deadline Extension' : 'Submit Completion Audit'}
              </h3>
              <p className="text-xs text-neutral-550 dark:text-zinc-400 mt-1 font-light leading-relaxed">
                {modalType === 'extension' 
                  ? 'Describe details and specify why an operational extension is necessary.' 
                  : 'Submit deliverables evidence notes before checking off task completed.'}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">
                {modalType === 'extension' ? 'Extension Justification' : 'Completion Deliverables Description'}
              </label>
              <textarea
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={3}
                className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                placeholder={modalType === 'extension' ? 'Permit delays require rescheduling caterer select...' : 'Florals assembled and string music synced...'}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-grow py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Submit Details
              </button>
              <button
                type="button"
                onClick={() => { setModalType(null); setSelectedTask(null); }}
                className="py-2.5 px-4 rounded-xl border border-neutral-250 dark:border-zinc-800 text-neutral-550 dark:text-zinc-400 text-xs font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default Projects;

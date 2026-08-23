import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { db, ProjectTask, ProjectDocument, ProjectActivity } from '../../data/db';
import { toast } from 'react-hot-toast';
import { 
  FiClock, 
  FiCheckCircle, 
  FiFileText, 
  FiActivity, 
  FiMessageSquare 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [docs, setDocs] = useState<ProjectDocument[]>([]);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  
  // Seraphina wedding is the baseline project for client demos
  const projectId = 'seraphina-wedding';

  const loadData = () => {
    db.getProjectTasks(projectId).then(setTasks);
    db.getProjectDocuments(projectId).then(setDocs);
    db.getProjectTimeline(projectId).then(setActivities);
  };

  useEffect(() => {
    loadData();
    // Live subscriber trigger
    const unsub = db.subscribeToProjectChanges(projectId, () => {
      loadData();
    });
    return unsub;
  }, []);

  // Calculate percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Pending client approvals
  const pendingApprovals = docs.filter((d) => d.status === 'pending');

  const handleApproveDoc = async (docId: string, docName: string) => {
    try {
      await db.updateDocumentStatus(docId, 'approved');
      toast.success(`Approved document: ${docName}`);
      await db.addProjectTimeline(projectId, 'document_uploaded', `Client approved: "${docName}"`);
      loadData();
    } catch (err) {
      toast.error('Approval failed.');
    }
  };

  const handleRejectDoc = async (docId: string, docName: string) => {
    try {
      await db.updateDocumentStatus(docId, 'rejected');
      toast.error(`Rejected document: ${docName}`);
      await db.addProjectTimeline(projectId, 'document_uploaded', `Client rejected: "${docName}"`);
      loadData();
    } catch (err) {
      toast.error('Rejection failed.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] pointer-events-none" />
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xs text-neutral-500 dark:text-zinc-400 font-light leading-relaxed max-w-lg">
            Monitor event curation milestones, review and sign quotations or floor plans, and correspond directly with your assigned producer.
          </p>
        </div>
        
        {/* Countdown Box */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-950/60 border border-neutral-150/40 dark:border-zinc-850 shrink-0 text-center w-full md:w-auto">
          <div className="text-[10px] uppercase font-bold text-neutral-450 dark:text-zinc-550 tracking-wider">Countdown to Villa Gala</div>
          <div className="text-2xl font-bold text-amber-500 mt-1 font-mono">June 18, 2026</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Progress & Approvals */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Progress Tracker Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-heading font-semibold text-neutral-909 dark:text-zinc-50 flex items-center gap-2">
                <FiActivity className="text-amber-500" /> Event Design Progress
              </h2>
              <span className="text-xs font-bold text-amber-500 font-mono">{percentComplete}% Done</span>
            </div>

            {/* Progress bar */}
            <div className="h-4.5 w-full bg-neutral-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-neutral-200/50 dark:border-zinc-850">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                style={{ width: `${percentComplete}%` }}
              />
            </div>

            {/* Task list details */}
            <div className="space-y-3.5">
              {tasks.map((task) => (
                <div key={task.id} className="flex justify-between items-center p-3.5 rounded-xl border border-neutral-100/50 dark:border-zinc-850 bg-neutral-50/50 dark:bg-zinc-950/20 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      task.status === 'completed' ? 'bg-emerald-500' :
                      task.status === 'in_progress' ? 'bg-amber-500' : 'bg-neutral-300 dark:bg-zinc-700'
                    }`} />
                    <span className={task.status === 'completed' ? 'line-through text-neutral-400' : 'text-neutral-700 dark:text-zinc-300'}>{task.name}</span>
                  </div>
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                    task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    task.status === 'in_progress' ? 'bg-amber-500/10 text-amber-500' : 'bg-neutral-200/60 dark:bg-zinc-800 text-neutral-500'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Approvals (Quotations, plans) */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-6">
            <h2 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 flex items-center gap-2">
              <FiCheckCircle className="text-amber-500" /> Pending Sign-offs
            </h2>
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8 text-neutral-450 dark:text-zinc-550 italic text-xs">All deliverables approved! No documents waiting for your sign-off.</div>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((doc) => (
                  <div key={doc.id} className="p-5 rounded-2xl bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/60 dark:border-zinc-850/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><FiFileText size={18} /></div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-zinc-200">{doc.name}</div>
                        <div className="text-[10px] text-neutral-550 dark:text-zinc-500 uppercase font-semibold mt-1 tracking-wider">{doc.type} &bull; Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleApproveDoc(doc.id, doc.name)}
                        className="flex-grow sm:flex-grow-0 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectDoc(doc.id, doc.name)}
                        className="flex-grow sm:flex-grow-0 px-4 py-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Timeline Activity */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Project Activity Timeline (Fulfills: Add a Project Activity Timeline) */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
            <h2 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
              <FiClock className="text-amber-500" /> Activity Timeline
            </h2>
            <div className="relative border-l-2 border-neutral-200 dark:border-zinc-850 pl-5 ml-2.5 space-y-6 max-h-[380px] overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <div className="text-center text-xs text-zinc-500 italic py-6">No event timeline logs logged yet.</div>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="relative">
                    <span className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white dark:border-zinc-900" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-zinc-200">{act.details}</div>
                      <div className="text-[9px] text-neutral-450 dark:text-zinc-550 font-mono mt-1">{new Date(act.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Support chat link */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto"><FiMessageSquare size={20} /></div>
            <h3 className="text-sm font-heading font-bold text-neutral-900 dark:text-zinc-100">Need Operational Support?</h3>
            <p className="text-xs text-neutral-500 dark:text-zinc-450 leading-relaxed font-light">Directly contact Harrison and coordinate menu cards or seating layout details.</p>
            <Link
              to="/client/messages"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-neutral-100 dark:bg-zinc-950 text-neutral-800 dark:text-zinc-350 text-xs font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-neutral-950 transition-colors"
            >
              Open Messaging Hub
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Dashboard;

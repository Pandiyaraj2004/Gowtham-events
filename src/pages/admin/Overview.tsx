import React, { useEffect, useState } from 'react';
import { 
  FiCalendar, 
  FiCheckSquare, 
  FiClock, 
  FiDollarSign, 
  FiMessageSquare, 
  FiUsers 
} from 'react-icons/fi';
import { db, ActivityLog, EventBooking, ProjectClosureReport } from '../../data/db';

export const Overview: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [bookings, setBookings] = useState<EventBooking[]>([]);
  const [reports, setReports] = useState<ProjectClosureReport[]>([]);
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Approve Victoria Vance\'s launch booking', done: false },
    { id: '2', text: 'Upload Lake Como gallery photo assets', done: true },
    { id: '3', text: 'Verify billing details on Stellar Audio contract', done: false },
    { id: '4', text: 'Schedule operational sync with Elena Rostova', done: false },
  ]);

  useEffect(() => {
    db.getActivityLogs().then(setLogs);
    db.getBookings().then(setBookings);
    db.getClosureReports().then(setReports);
  }, []);

  // Compute stats
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  
  // Calculate financials based on actual Project Closure Reports
  const totalRevenue = reports.reduce((acc, r) => acc + r.amountReceived, 0);
  const totalExpenses = reports.reduce((acc, r) => acc + r.expenses + r.additionalExpenses, 0);
  const netProfit = totalRevenue - totalExpenses;

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
            Console Overview
          </h1>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
            Live business diagnostics and admin operations management.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500"><FiDollarSign size={20} /></div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+14.2%</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">${totalRevenue.toLocaleString()}</div>
          <div className="text-[10px] text-neutral-450 dark:text-zinc-500 uppercase tracking-wider font-semibold mt-1">Total Revenue</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500"><FiUsers size={20} /></div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+8.4%</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">${netProfit.toLocaleString()}</div>
          <div className="text-[10px] text-neutral-450 dark:text-zinc-500 uppercase tracking-wider font-semibold mt-1">Net Profit Logged</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500"><FiMessageSquare size={20} /></div>
            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">{pendingBookings} Active</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">{bookings.length}</div>
          <div className="text-[10px] text-neutral-450 dark:text-zinc-500 uppercase tracking-wider font-semibold mt-1">Inquiries In-queue</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500"><FiCalendar size={20} /></div>
            <span className="text-[10px] font-bold text-neutral-450 dark:text-zinc-500 bg-neutral-100 dark:bg-zinc-950 px-2 py-0.5 rounded-full">Archive</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">{reports.length}</div>
          <div className="text-[10px] text-neutral-450 dark:text-zinc-500 uppercase tracking-wider font-semibold mt-1">Completed Events</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Activity Logs and Tasks */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Admin Activity Log (Requires audit trail logging) */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
            <h2 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
              <FiClock className="text-amber-500" /> Admin Activity Log
            </h2>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {logs.length === 0 ? (
                <div className="text-center text-sm text-neutral-450 dark:text-zinc-500 italic py-8">
                  No system logs recorded yet. Action audit trails list here.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-4 p-3.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-950/30 transition-colors border border-neutral-100/50 dark:border-zinc-850/30">
                    <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
                      {log.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-neutral-900 dark:text-zinc-150">
                        {log.userName} &bull; <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">{log.action}</span>
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-1 font-light leading-relaxed">
                        {log.details}
                      </div>
                      <div className="text-[9px] text-neutral-400 dark:text-zinc-650 mt-2 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tasks List */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
            <h2 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
              <FiCheckSquare className="text-amber-500" /> Operational Checklist
            </h2>
            <div className="space-y-3.5">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-950/20 transition-colors border border-neutral-150/40 dark:border-zinc-850 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => {}} // toggled by outer click
                    className="w-4.5 h-4.5 text-amber-500 accent-amber-500 rounded focus:ring-0 border-neutral-300 dark:border-zinc-800"
                  />
                  <span className={`text-xs ${
                    task.done ? 'line-through text-neutral-400 dark:text-zinc-600' : 'text-neutral-700 dark:text-zinc-250'
                  }`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Calendar & Quick Notification Summary */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Calendar Widget */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
            <h2 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
              <FiCalendar className="text-amber-500" /> Calendar Brief
            </h2>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-zinc-950/40 text-center border border-neutral-150/40 dark:border-zinc-850 mb-4">
              <div className="text-amber-500 uppercase tracking-widest text-[10px] font-bold">Today</div>
              <div className="text-3xl font-heading font-black text-neutral-900 dark:text-white mt-1">24</div>
              <div className="text-xs text-neutral-500 dark:text-zinc-500 mt-1">July 2026</div>
            </div>
            
            {/* Seed upcoming details list */}
            <div className="space-y-3.5">
              <div className="p-3 border-l-2 border-amber-500 bg-neutral-50 dark:bg-zinc-950/20 rounded-r-xl">
                <div className="text-xs font-bold text-neutral-900 dark:text-zinc-250">Lumina Sync Meet</div>
                <div className="text-[10px] text-neutral-450 dark:text-zinc-550 mt-1">10:00 AM &bull; Boardroom A</div>
              </div>
              <div className="p-3 border-l-2 border-zinc-400 bg-neutral-50 dark:bg-zinc-950/20 rounded-r-xl">
                <div className="text-xs font-bold text-neutral-900 dark:text-zinc-250">Lake Como Load-in</div>
                <div className="text-[10px] text-neutral-450 dark:text-zinc-550 mt-1">All Day Event &bull; Lake Como</div>
              </div>
            </div>
          </div>

          {/* Quick Notification Widget */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
            <h2 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-6">
              Console Alerts
            </h2>
            <div className="space-y-3.5">
              <div className="p-3 bg-red-500/10 text-red-500 text-xs rounded-xl font-light">
                <strong>Attention Needed:</strong> 1 Partner registration pending approval registry reviews.
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-500 text-xs rounded-xl font-light">
                <strong>Schedule Reminder:</strong> 2 Project closure audits are in backlog waiting for financials data.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Overview;

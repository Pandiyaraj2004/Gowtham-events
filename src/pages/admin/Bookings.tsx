import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, EventBooking } from '../../data/db';
import { toast } from 'react-hot-toast';
import { 
  FiSearch, 
  FiCalendar, 
  FiXCircle, 
  FiLayers, 
  FiDownload 
} from 'react-icons/fi';

export const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<EventBooking[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'converted'>('all');
  const [selectedBooking, setSelectedBooking] = useState<EventBooking | null>(null);
  const [meetingDate, setMeetingDate] = useState('');

  const refreshBookings = () => {
    db.getBookings().then(setBookings);
  };

  useEffect(() => {
    refreshBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected' | 'converted', dateStr?: string) => {
    try {
      await db.updateBookingStatus(id, status, dateStr);
      toast.success(`Booking status updated to ${status.toUpperCase()}`);
      setSelectedBooking(null);
      setMeetingDate('');
      refreshBookings();
    } catch (err: any) {
      toast.error(err.message || 'Status update failed.');
    }
  };

  // Convert Inquiry to project
  const handleConvertToProject = async (booking: EventBooking) => {
    try {
      // 1. Create a project skeleton inside db
      const newProj = {
        id: booking.id,
        name: `${booking.name}'s ${booking.eventType}`,
        category: booking.eventType,
        location: 'TBD',
        date: booking.date,
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800',
        description: `Bespoke event converted from inquiry. Expected guests: ${booking.guests}. Contact: ${booking.email}`,
        gallery: [],
      };
      
      const projects = await db.getProjects();
      projects.push(newProj);
      localStorage.setItem('vanguard_db_projects', JSON.stringify(projects));
      
      // 2. Mark booking as converted
      await db.updateBookingStatus(booking.id, 'converted');
      toast.success('Converted to portfolio project skeleton!');
      refreshBookings();
    } catch (err: any) {
      toast.error('Failed to convert booking.');
    }
  };

  // Export Booking Data to CSV
  const handleExportCSV = () => {
    try {
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Event Type', 'Event Date', 'Guests', 'Status', 'Created At'];
      const rows = bookings.map((b) => [
        b.id,
        b.name,
        b.email,
        b.phone,
        b.eventType,
        b.date,
        b.guests,
        b.status,
        b.createdAt,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Gowtham_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Bookings exported successfully.');
    } catch (err) {
      toast.error('Failed to export bookings.');
    }
  };

  // Filter bookings
  const filtered = bookings.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || 
                          b.email.toLowerCase().includes(search.toLowerCase()) ||
                          b.eventType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-905 dark:text-zinc-50">
            Booking Requests
          </h1>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
            Audit incoming client inquiries, schedule coordinator meetings, and launch projects.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-neutral-250 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-neutral-750 dark:text-zinc-300 hover:text-amber-500 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-650" />
          <input
            type="text"
            placeholder="Search bookings by client name, event type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl pl-11 pr-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected', 'converted'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-50 dark:bg-zinc-950 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-zinc-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-neutral-450 dark:text-zinc-500 italic">
            No booking requests match your filters.
          </div>
        ) : (
          filtered.map((b) => (
            <motion.div
              key={b.id}
              layout
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-neutral-450 dark:text-zinc-500 uppercase tracking-widest">{b.eventType}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    b.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    b.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                    b.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                    'bg-purple-500/10 text-purple-500'
                  }`}>
                    {b.status}
                  </span>
                </div>
                
                <h3 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-200">{b.name}</h3>
                <div className="text-[11px] text-neutral-500 dark:text-zinc-500 font-mono mt-1">{b.email} &bull; {b.phone}</div>
                <div className="text-xs text-neutral-550 dark:text-zinc-450 mt-4 leading-relaxed font-light font-sans bg-neutral-50 dark:bg-zinc-950/40 p-3 rounded-xl border border-neutral-100 dark:border-zinc-850/60">
                  {b.message}
                </div>
                
                <div className="text-xs text-neutral-500 dark:text-zinc-500 mt-4 flex gap-4">
                  <div>Date: <strong className="text-neutral-705 dark:text-zinc-300 font-mono">{b.date}</strong></div>
                  <div>Guests: <strong className="text-neutral-705 dark:text-zinc-300 font-mono">{b.guests}</strong></div>
                </div>

                {b.meetingDate && (
                  <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-4 flex items-center gap-1.5 bg-emerald-500/5 p-2 rounded-lg">
                    <FiCalendar /> Meeting: {new Date(b.meetingDate).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 mt-6 border-t border-neutral-150 dark:border-zinc-850 pt-4">
                {b.status === 'pending' && (
                  <>
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="flex-grow inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 cursor-pointer"
                    >
                      <FiCalendar /> Schedule
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'rejected')}
                      className="py-2 px-3.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <FiXCircle /> Reject
                    </button>
                  </>
                )}

                {b.status === 'approved' && (
                  <button
                    onClick={() => handleConvertToProject(b)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-purple-600 cursor-pointer"
                  >
                    <FiLayers /> Convert to Project
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Meeting Scheduler Dialog Overlay */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 rounded-2xl p-6 md:p-8 max-w-sm w-full space-y-6 text-left"
            >
              <div>
                <h3 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50">
                  Schedule Coordinator Meeting
                </h3>
                <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">
                  Assign a date/time to approve booking details and connect with {selectedBooking.name}.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Date & Time</label>
                <input
                  type="datetime-local"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="flex gap-3.5">
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'approved', meetingDate)}
                  disabled={!meetingDate}
                  className="flex-grow py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Approve Booking
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="py-2.5 px-4 rounded-xl border border-neutral-250 dark:border-zinc-800 text-neutral-500 dark:text-zinc-400 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Bookings;

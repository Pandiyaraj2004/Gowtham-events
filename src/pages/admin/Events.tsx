import React, { useEffect, useState } from 'react';
import { db } from '../../data/db';
import { mockDatabase } from '../../auth/services/mockDatabase';
import { UpcomingEvent } from '../../types';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiTag } from 'react-icons/fi';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    category: '',
    date: '',
    location: '',
    partner: '',
    notes: '',
  });

  const refreshEvents = () => {
    db.getUpcomingEvents().then(setEvents);
  };

  useEffect(() => {
    refreshEvents();
    setPartners(mockDatabase.getPartners());
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date || !newEvent.location) {
      toast.error('Event Name, Date, and Location are required.');
      return;
    }

    try {
      const eventToSave: UpcomingEvent = {
        id: `event-${Math.random().toString(36).substr(2, 9)}`,
        name: newEvent.name,
        category: newEvent.category || 'Luxury Event',
        date: newEvent.date,
        location: newEvent.location,
        description: newEvent.notes || 'No description provided.',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800',
        registrationOpen: true,
      };

      await db.saveUpcomingEvent(eventToSave);
      toast.success('Upcoming event scheduled successfully!');
      setNewEvent({ name: '', category: '', date: '', location: '', partner: '', notes: '' });
      setShowAddModal(false);
      refreshEvents();
    } catch (err: any) {
      toast.error('Failed to create event.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Delete this upcoming event schedule?')) {
      try {
        await db.deleteUpcomingEvent(id);
        toast.success('Event deleted.');
        refreshEvents();
      } catch (err: any) {
        toast.error('Deletion failed.');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
            Event Director
          </h1>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
            Manage corporate schedules, assign agency coordinators, and log layout permits.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
        >
          <FiPlus /> Schedule Event
        </button>
      </div>

      {/* Events Table/List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-zinc-850 text-xs text-neutral-450 dark:text-zinc-550 uppercase tracking-wider">
                <th className="pb-3">Event Details</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Scheduled Date</th>
                <th className="pb-3">Location</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-zinc-850/50">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 italic">No scheduled events found. Click 'Schedule Event' to create one.</td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e.id} className="text-neutral-700 dark:text-zinc-300">
                    <td className="py-4 font-bold text-neutral-900 dark:text-zinc-100">{e.name}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-500">
                        <FiTag size={10} /> {e.category}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-mono">{e.date}</td>
                    <td className="py-4 text-xs">{e.location}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDeleteEvent(e.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                        title="Delete Event"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 rounded-2xl p-6 md:p-8 max-w-md w-full space-y-6 text-left relative">
            <div>
              <h3 className="text-lg font-heading font-semibold text-neutral-905 dark:text-zinc-50">
                Schedule New Event
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">
                Enter details below to publish this upcoming event on the public calendar.
              </p>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="Vance Product Showcase"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Category Type</label>
                  <input
                    type="text"
                    placeholder="Corporate"
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Event Date</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Location Address</label>
                <input
                  type="text"
                  required
                  placeholder="Beverly Hills, CA"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Assign Partner Coordinator</label>
                <select
                  value={newEvent.partner}
                  onChange={(e) => setNewEvent({ ...newEvent, partner: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="">Select Partner...</option>
                  {partners.map(p => (
                    <option key={p.uid} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Event Notes</label>
                <textarea
                  placeholder="Specific planning requirements..."
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-grow py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Publish Schedule
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
export default Events;

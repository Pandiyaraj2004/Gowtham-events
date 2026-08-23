import React, { useEffect, useState } from 'react';
import { db, ProjectClosureReport } from '../../data/db';
import { mockDatabase } from '../../auth/services/mockDatabase';
import { Project } from '../../types';
import { toast } from 'react-hot-toast';
import { FiFileText, FiDollarSign, FiUsers, FiStar, FiCheckCircle } from 'react-icons/fi';

export const Closure: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  // Financial Form States
  const [financials, setFinancials] = useState({
    estimatedBudget: 0,
    amountReceived: 0,
    expenses: 0,
    additionalExpenses: 0,
    paymentStatus: 'paid' as 'paid' | 'partial' | 'pending',
    paymentMethod: 'Wire Transfer',
  });

  // Team Form States
  const [eventManager, setEventManager] = useState('');
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [vendorsInput, setVendorsInput] = useState('');

  // Feedback Form States
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  // Admin Notes
  const [notes, setNotes] = useState({
    challenges: '',
    lessonsLearned: '',
    recommendations: '',
  });

  useEffect(() => {
    db.getProjects().then(setProjects);
    setPartners(mockDatabase.getPartners());
  }, []);

  const handlePartnerToggle = (name: string) => {
    setSelectedPartners((prev) => 
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      toast.error('Please select a project to close.');
      return;
    }

    const selectedProject = projects.find((p) => p.id === selectedProjectId);
    if (!selectedProject) return;

    // Calculate Net Profit
    const netProfit = financials.amountReceived - financials.expenses - financials.additionalExpenses;

    const report: ProjectClosureReport = {
      id: selectedProjectId,
      projectName: selectedProject.name,
      clientName: 'Mock Client',
      eventType: selectedProject.category || 'Luxury Event',
      eventDate: selectedProject.date,
      eventLocation: selectedProject.location,
      guests: 200, // mock base
      status: 'completed',
      estimatedBudget: financials.estimatedBudget,
      amountReceived: financials.amountReceived,
      expenses: financials.expenses,
      additionalExpenses: financials.additionalExpenses,
      netProfit,
      paymentStatus: financials.paymentStatus,
      paymentMethod: financials.paymentMethod,
      eventManager,
      partners: selectedPartners,
      vendors: vendorsInput.split(',').map((v) => v.trim()).filter(Boolean),
      rating,
      review,
      challenges: notes.challenges,
      lessonsLearned: notes.lessonsLearned,
      recommendations: notes.recommendations,
      media: [],
      createdAt: new Date().toISOString(),
    };

    try {
      await db.saveClosureReport(report);
      toast.success('Project Closure Audit compiled. Ledger metrics updated!');
      
      // Clear Form
      setSelectedProjectId('');
      setFinancials({ estimatedBudget: 0, amountReceived: 0, expenses: 0, additionalExpenses: 0, paymentStatus: 'paid', paymentMethod: 'Wire Transfer' });
      setEventManager('');
      setSelectedPartners([]);
      setVendorsInput('');
      setRating(5);
      setReview('');
      setNotes({ challenges: '', lessonsLearned: '', recommendations: '' });
    } catch (err: any) {
      toast.error('Failed to register closure report.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
          Project Closure Audit
        </h1>
        <p className="text-xs text-neutral-500 dark:text-zinc-550 mt-1 font-light">
          Review financial summaries, log client ratings, catalog challenges, and update business metrics upon completion.
        </p>
      </div>

      <form onSubmit={handleSaveReport} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Audit Input details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Select Project */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-4">
            <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50 flex items-center gap-2">
              <FiFileText className="text-amber-500" /> Select Target Project
            </h2>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Active Projects</label>
              <select
                required
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-300 focus:outline-none"
              >
                <option value="">Select completed project to audit...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.date})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Card 2: Financial Summary */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-6">
            <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50 flex items-center gap-2">
              <FiDollarSign className="text-amber-500" /> Project Financial Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Estimated Budget ($)</label>
                <input
                  type="number"
                  required
                  placeholder="100000"
                  value={financials.estimatedBudget || ''}
                  onChange={(e) => setFinancials({ ...financials, estimatedBudget: Number(e.target.value) })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-805 dark:text-zinc-200 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Total Amount Received ($)</label>
                <input
                  type="number"
                  required
                  placeholder="110000"
                  value={financials.amountReceived || ''}
                  onChange={(e) => setFinancials({ ...financials, amountReceived: Number(e.target.value) })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-805 dark:text-zinc-200 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Base Expenses ($)</label>
                <input
                  type="number"
                  required
                  placeholder="70000"
                  value={financials.expenses || ''}
                  onChange={(e) => setFinancials({ ...financials, expenses: Number(e.target.value) })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-805 dark:text-zinc-200 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Additional Expenses ($)</label>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={financials.additionalExpenses || ''}
                  onChange={(e) => setFinancials({ ...financials, additionalExpenses: Number(e.target.value) })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-850 dark:text-zinc-200 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Payment Status</label>
                <select
                  value={financials.paymentStatus}
                  onChange={(e) => setFinancials({ ...financials, paymentStatus: e.target.value as any })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="paid">Fully Settled / Paid</option>
                  <option value="partial">Partial Payment Ledger</option>
                  <option value="pending">Awaiting Invoicing Transfer</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Payment Method</label>
                <input
                  type="text"
                  required
                  placeholder="Wire Transfer / Credit Card"
                  value={financials.paymentMethod}
                  onChange={(e) => setFinancials({ ...financials, paymentMethod: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Logistics notes */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-4">
            <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50">
              Audit Scenography Details
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Operational Challenges</label>
                <textarea
                  placeholder="Deliveries delayed, dock clearance limits, permitting lags..."
                  value={notes.challenges}
                  onChange={(e) => setNotes({ ...notes, challenges: e.target.value })}
                  rows={2}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Lessons Learned</label>
                <textarea
                  placeholder="Coordinate generators, book local catering options..."
                  value={notes.lessonsLearned}
                  onChange={(e) => setNotes({ ...notes, lessonsLearned: e.target.value })}
                  rows={2}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Team, feedback and compile button */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Team and Partners */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-4">
            <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50 flex items-center gap-2">
              <FiUsers className="text-amber-500" /> Curation Team
            </h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Event Manager</label>
                <input
                  type="text"
                  required
                  placeholder="Harrison Sterling"
                  value={eventManager}
                  onChange={(e) => setEventManager(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500 block mb-1">Assigned Partners</label>
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-2">
                  {partners.map((p) => (
                    <label key={p.uid} className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedPartners.includes(p.name)}
                        onChange={() => handlePartnerToggle(p.name)}
                        className="rounded border-neutral-350 dark:border-zinc-800 text-amber-500 focus:ring-0"
                      />
                      <span>{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Vendors List (comma separated)</label>
                <input
                  type="text"
                  placeholder="Stellar Audio, Maison Catering"
                  value={vendorsInput}
                  onChange={(e) => setVendorsInput(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200"
                />
              </div>
            </div>
          </div>

          {/* Client Feedback rating */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-4">
            <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50 flex items-center gap-2">
              <FiStar className="text-amber-500" /> Host Feedback
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Client Rating</label>
                  <span className="text-xs font-bold text-amber-500">{rating} Stars</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Host Review Copy</label>
                <textarea
                  placeholder="Review statement quotes..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-heading font-bold tracking-widest uppercase shadow-lg shadow-amber-500/10 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <FiCheckCircle size={15} /> Save & Compile Audit
          </button>

        </div>

      </form>
    </div>
  );
};
export default Closure;

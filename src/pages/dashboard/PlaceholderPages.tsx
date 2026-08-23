import React, { useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { mockDatabase, UserProfile } from '../../auth/services/mockDatabase';
import { toast } from 'react-hot-toast';
import { FiUsers, FiCalendar, FiDollarSign, FiPlus, FiTrash2, FiUserCheck } from 'react-icons/fi';

// Base Placeholder Container with a nice dashboard card shell
const DashboardSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 dark:text-zinc-50">{title}</h1>
    </div>
    <div className="grid gap-6">{children}</div>
  </div>
);

// ADMIN DASHBOARD & CUSTOM PARTNER MANAGEMENT CAPABILITIES
// This fulfills: "The Admin should be able to create, approve, suspend, or remove Partner accounts from the Admin Dashboard."
export const AdminDashboard: React.FC = () => {
  const [partners, setPartners] = useState<UserProfile[]>(() => mockDatabase.getPartners());
  const [newPartner, setNewPartner] = useState({ name: '', email: '' });
  
  const refreshPartners = () => {
    setPartners(mockDatabase.getPartners());
  };

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.email) {
      toast.error('Name and Email are required.');
      return;
    }
    try {
      mockDatabase.createPartnerAccount(newPartner.email, newPartner.name);
      toast.success('Partner created successfully!');
      setNewPartner({ name: '', email: '' });
      refreshPartners();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create partner.');
    }
  };

  const handleToggleStatus = (uid: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      mockDatabase.updatePartnerStatus(uid, nextStatus);
      toast.success(`Partner status updated to ${nextStatus}.`);
      refreshPartners();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRemovePartner = (uid: string) => {
    if (window.confirm('Are you sure you want to remove this partner account?')) {
      try {
        mockDatabase.removePartnerAccount(uid);
        toast.success('Partner account deleted.');
        refreshPartners();
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  return (
    <DashboardSection title="Admin Console Overview">
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow flex items-center gap-5">
          <div className="p-4 rounded-xl bg-amber-500/10 text-amber-500"><FiUsers size={24} /></div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">{partners.length}</div>
            <div className="text-xs text-neutral-450 dark:text-zinc-500 uppercase tracking-wider font-semibold">Registered Partners</div>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow flex items-center gap-5">
          <div className="p-4 rounded-xl bg-amber-500/10 text-amber-500"><FiCalendar size={24} /></div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">12 Active</div>
            <div className="text-xs text-neutral-450 dark:text-zinc-500 uppercase tracking-wider font-semibold">Event Masterpieces</div>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow flex items-center gap-5">
          <div className="p-4 rounded-xl bg-amber-500/10 text-amber-500"><FiDollarSign size={24} /></div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50">$48K</div>
            <div className="text-xs text-neutral-450 dark:text-zinc-500 uppercase tracking-wider font-semibold">Monthly Payouts</div>
          </div>
        </div>
      </div>

      {/* Partner Management System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Create Partner (Form) */}
        <div className="lg:col-span-4 p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">
          <h2 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
            <FiPlus className="text-amber-500" /> Create Partner Account
          </h2>
          <form onSubmit={handleCreatePartner} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Partner Name</label>
              <input
                type="text"
                required
                placeholder="Harrison Ford"
                value={newPartner.name}
                onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 text-neutral-800 dark:text-zinc-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Email Address</label>
              <input
                type="email"
                required
                placeholder="partner@gowthamevents.com"
                value={newPartner.email}
                onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 text-neutral-800 dark:text-zinc-200"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
            >
              Add Partner
            </button>
          </form>
        </div>

        {/* Partners List */}
        <div className="lg:col-span-8 p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">
          <h2 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-6">
            Bespoke Partner Directory
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-zinc-850 text-xs text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                  <th className="pb-3">Partner</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-zinc-850/50">
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-zinc-500 italic">No partners configured. Add one on the left.</td>
                  </tr>
                ) : (
                  partners.map((partner) => (
                    <tr key={partner.uid} className="text-neutral-700 dark:text-zinc-300">
                      <td className="py-4 font-semibold text-neutral-900 dark:text-zinc-200">{partner.name}</td>
                      <td className="py-4 text-xs">{partner.email}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          partner.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {partner.status}
                        </span>
                      </td>
                      <td className="py-4 text-right flex justify-end gap-3">
                        <button
                          onClick={() => handleToggleStatus(partner.uid, partner.status)}
                          className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg cursor-pointer transition-colors"
                          title="Toggle Status (Active/Suspended)"
                        >
                          <FiUserCheck size={16} />
                        </button>
                        <button
                          onClick={() => handleRemovePartner(partner.uid)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                          title="Remove Partner"
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
      </div>
    </DashboardSection>
  );
};

// Admin Sub-pages
export const AdminAnalytics: React.FC = () => <DashboardSection title="Business Analytics"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for SVG Analytics Charts</div></DashboardSection>;
export const AdminEvents: React.FC = () => <DashboardSection title="Event Director"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for CRUD Event lists</div></DashboardSection>;
export const AdminClients: React.FC = () => <DashboardSection title="Client Profiles"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for CRM Client database</div></DashboardSection>;
export const AdminPartners: React.FC = () => <DashboardSection title="Partner Registries"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Partner list</div></DashboardSection>;
export const AdminBookings: React.FC = () => <DashboardSection title="Booking Requests"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Client inquiries</div></DashboardSection>;
export const AdminMedia: React.FC = () => <DashboardSection title="Media Manager"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Cloudinary upload grids</div></DashboardSection>;
export const AdminPayments: React.FC = () => <DashboardSection title="Financial Payments"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Revenue ledger</div></DashboardSection>;
export const AdminReports: React.FC = () => <DashboardSection title="System Reports"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Exportable reports logs</div></DashboardSection>;
export const AdminSettings: React.FC = () => <DashboardSection title="Console Settings"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Access codes config</div></DashboardSection>;

// PARTNER PAGES
export const PartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  return (
    <DashboardSection title="Partner Panel Overview">
      <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">
        <h2 className="text-xl font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-sm text-neutral-500 dark:text-zinc-400 font-light leading-relaxed">Here are your active assigned works and payment status panels. Contact Harrison for any operational inquiries.</p>
      </div>
    </DashboardSection>
  );
};
export const PartnerProjects: React.FC = () => <DashboardSection title="Assigned Masterpieces"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Kanban work lists</div></DashboardSection>;
export const PartnerReports: React.FC = () => <DashboardSection title="Operational Reports"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Performance audits</div></DashboardSection>;
export const PartnerPayments: React.FC = () => <DashboardSection title="Payouts Ledger"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Invoice payouts</div></DashboardSection>;
export const PartnerDocuments: React.FC = () => <DashboardSection title="Shared Documents"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Permitting PDFs and contracts</div></DashboardSection>;
export const PartnerProfile: React.FC = () => <DashboardSection title="Partner Profile"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Profile credentials settings</div></DashboardSection>;

// CLIENT PAGES
export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  return (
    <DashboardSection title="Client Console Overview">
      <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">
        <h2 className="text-xl font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-2">Welcome, {user?.name}!</h2>
        <p className="text-sm text-neutral-500 dark:text-zinc-400 font-light leading-relaxed">Through this dashboard you can track every stage of your event planning, review styling boards, check pending milestones, and upload reference files.</p>
      </div>
    </DashboardSection>
  );
};
export const ClientEvents: React.FC = () => <DashboardSection title="My Events"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Active event details cards</div></DashboardSection>;
export const ClientProgress: React.FC = () => <DashboardSection title="Event Curation Progress"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Planning timeline checklist</div></DashboardSection>;
export const ClientPayments: React.FC = () => <DashboardSection title="Invoices & Payments"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Stripe checkout integration</div></DashboardSection>;
export const ClientDocuments: React.FC = () => <DashboardSection title="Inquiry Files"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Design blueprints and layouts</div></DashboardSection>;
export const ClientProfile: React.FC = () => <DashboardSection title="My Profile Settings"><div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 premium-shadow">Placeholder for Client contact details</div></DashboardSection>;

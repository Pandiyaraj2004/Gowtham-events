import React, { useEffect, useState } from 'react';
import { mockDatabase, UserProfile } from '../../auth/services/mockDatabase';
import { toast } from 'react-hot-toast';
import { FiUserX, FiUserCheck, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<UserProfile[]>([]);

  const refreshClients = () => {
    const allUsers = mockDatabase.getAllUsers();
    setClients(allUsers.filter((u) => u.role === 'client'));
  };

  useEffect(() => {
    refreshClients();
  }, []);

  const handleToggleStatus = (uid: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      mockDatabase.updatePartnerStatus(uid, nextStatus); // updates user profile status
      toast.success(`Client profile status updated to ${nextStatus.toUpperCase()}`);
      refreshClients();
    } catch (err: any) {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-905 dark:text-zinc-50">
          Client Directory
        </h1>
        <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
          Audit client profile settings, monitor portal activity, and suspend or activate permissions.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.length === 0 ? (
          <div className="col-span-full text-center text-zinc-500 py-12 italic">No clients registered.</div>
        ) : (
          clients.map((c) => (
            <div
              key={c.uid}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    c.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {c.status}
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-zinc-650 font-mono">ID: {c.uid.slice(0, 8)}</span>
                </div>

                <h3 className="text-base font-heading font-bold text-neutral-900 dark:text-zinc-100">{c.name}</h3>
                
                <div className="mt-4 space-y-2 text-xs text-neutral-550 dark:text-zinc-400">
                  <div className="flex items-center gap-2"><FiMail className="text-neutral-400" /> {c.email}</div>
                  {c.phone && <div className="flex items-center gap-2"><FiPhone className="text-neutral-400" /> {c.phone}</div>}
                  <div className="flex items-center gap-2"><FiCalendar className="text-neutral-400" /> Created: {new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 mt-6 border-t border-neutral-150 dark:border-zinc-850 pt-4">
                <button
                  onClick={() => handleToggleStatus(c.uid, c.status)}
                  className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer border ${
                    c.status === 'active' 
                      ? 'border-red-500/20 text-red-500 hover:bg-red-500/10'
                      : 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
                  }`}
                >
                  {c.status === 'active' ? (
                    <><FiUserX /> Suspend Account</>
                  ) : (
                    <><FiUserCheck /> Activate Account</>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Clients;

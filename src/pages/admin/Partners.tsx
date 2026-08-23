import React, { useEffect, useState } from 'react';
import { mockDatabase, UserProfile } from '../../auth/services/mockDatabase';
import { toast } from 'react-hot-toast';
import { FiUserCheck, FiUserX, FiMail, FiCalendar, FiStar, FiFileText } from 'react-icons/fi';

export const Partners: React.FC = () => {
  const [partners, setPartners] = useState<UserProfile[]>([]);

  const refreshPartners = () => {
    setPartners(mockDatabase.getPartners());
  };

  useEffect(() => {
    refreshPartners();
  }, []);

  const handleToggleStatus = (uid: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      mockDatabase.updatePartnerStatus(uid, nextStatus);
      toast.success(`Partner status updated to ${nextStatus.toUpperCase()}`);
      refreshPartners();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
          Partner Registry
        </h1>
        <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
          Audit operational service contracts, performance ratings, and portal dashboard access states.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.length === 0 ? (
          <div className="col-span-full text-center text-zinc-500 py-12 italic">No partners registered. Use the Overview Console to create one.</div>
        ) : (
          partners.map((p) => (
            <div
              key={p.uid}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    p.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {p.status}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <FiStar /> 4.8
                  </div>
                </div>

                <h3 className="text-base font-heading font-bold text-neutral-900 dark:text-zinc-100">{p.name}</h3>

                <div className="mt-4 space-y-2 text-xs text-neutral-550 dark:text-zinc-400">
                  <div className="flex items-center gap-2"><FiMail className="text-neutral-400" /> {p.email}</div>
                  <div className="flex items-center gap-2"><FiCalendar className="text-neutral-400" /> Member since: {new Date(p.createdAt).toLocaleDateString()}</div>
                </div>

                {/* Document attachments preview */}
                <div className="mt-5 p-3 rounded-xl bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-100 dark:border-zinc-850/60 flex items-center gap-2 text-xs text-neutral-600 dark:text-zinc-450">
                  <FiFileText className="text-amber-500" />
                  <span className="font-medium">Operational_Permit_2026.pdf</span>
                </div>
              </div>

              {/* Status toggles */}
              <div className="flex gap-2.5 mt-6 border-t border-neutral-150 dark:border-zinc-850 pt-4">
                <button
                  onClick={() => handleToggleStatus(p.uid, p.status)}
                  className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer border ${
                    p.status === 'active' 
                      ? 'border-red-500/20 text-red-500 hover:bg-red-500/10'
                      : 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
                  }`}
                >
                  {p.status === 'active' ? (
                    <><FiUserX /> Suspend Access</>
                  ) : (
                    <><FiUserCheck /> Activate Access</>
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
export default Partners;

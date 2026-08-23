import React, { useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiSave, FiLock, FiUser, FiPhone } from 'react-icons/fi';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Contact credentials updated successfully.');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    toast.success('Security password updated.');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
          Profile Settings
        </h1>
        <p className="text-xs text-neutral-550 dark:text-zinc-500 mt-1 font-light">
          Manage contact metrics and sign-in credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contact details */}
        <form onSubmit={handleUpdateContact} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-5">
          <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-2 flex items-center gap-2">
            <FiUser className="text-amber-500" /> Account Settings
          </h2>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-500 dark:text-zinc-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-808 dark:text-zinc-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-505 flex items-center gap-1">
              <FiPhone className="text-amber-500" /> Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-808 dark:text-zinc-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <FiSave /> Save Contact Settings
          </button>
        </form>

        {/* Change password */}
        <form onSubmit={handleUpdatePassword} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow space-y-5">
          <h2 className="text-base font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-2 flex items-center gap-2">
            <FiLock className="text-amber-500" /> Reset Password
          </h2>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Current Password</label>
            <input
              type="password"
              required
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">New Password</label>
            <input
              type="password"
              required
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-zinc-500">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-zinc-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-zinc-950 hover:bg-neutral-200 text-neutral-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider cursor-pointer border border-neutral-200 dark:border-zinc-850"
          >
            Update Password
          </button>
        </form>

      </div>
    </div>
  );
};
export default Profile;

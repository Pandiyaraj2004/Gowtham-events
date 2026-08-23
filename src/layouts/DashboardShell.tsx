import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiSun, 
  FiMoon, 
  FiBell, 
  FiUser 
} from 'react-icons/fi';
import { useAuth } from '../auth/context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { Logo } from '../components/Logo';

interface SidebarLink {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  end?: boolean;
}

interface DashboardShellProps {
  portalName: string;
  links: SidebarLink[];
  roleBadge: string;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ portalName, links, roleBadge }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
      navigate('/login', { replace: true });
    } catch (err: any) {
      toast.error('Failed to log out.');
    }
  };

  const sidebarVariants = {
    expanded: { width: '260px' },
    collapsed: { width: '76px' },
  };

  return (
    <div className="min-h-screen flex bg-zinc-55/10 dark:bg-zinc-950 text-neutral-800 dark:text-zinc-200 transition-colors duration-300">
      
      {/* 1. Desktop Sidebar */}
      <motion.aside
        initial="expanded"
        animate={sidebarOpen ? 'expanded' : 'collapsed'}
        variants={sidebarVariants}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col border-r border-neutral-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 overflow-hidden shrink-0 z-20"
      >
        {/* Header/Logo section */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-neutral-100 dark:border-zinc-850">
          <div className="flex items-center gap-3 select-none">
            <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 shadow-md">
              <Logo size={22} className="text-neutral-950" />
            </span>
            {sidebarOpen && (
              <span className="font-heading font-bold text-sm tracking-wider text-neutral-900 dark:text-zinc-50 uppercase">
                {portalName}
              </span>
            )}
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-grow py-6 px-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-3.5 rounded-xl font-heading text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-905 dark:hover:text-zinc-200 hover:bg-neutral-50 dark:hover:bg-zinc-950/40 border border-transparent'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span>{link.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User profile / Logout */}
        <div className="p-4 border-t border-neutral-100 dark:border-zinc-850 flex flex-col gap-3">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <FiUser size={16} />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-neutral-900 dark:text-zinc-150 truncate">{user?.name}</div>
                <div className="text-[9px] uppercase font-bold tracking-widest text-amber-500 mt-0.5">{roleBadge}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 py-2.5 px-3.5 rounded-xl font-heading text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-wider w-full text-left cursor-pointer"
          >
            <FiLogOut size={18} className="shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* 2. Mobile Nav Slide-in Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-full bg-white dark:bg-zinc-900 border-r border-neutral-200 dark:border-zinc-850 flex flex-col justify-between py-6 px-4"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-neutral-150 dark:border-zinc-850 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 shadow-md">
                      <Logo size={20} className="text-neutral-950" />
                    </span>
                    <span className="font-heading font-bold text-xs tracking-wider text-neutral-900 dark:text-zinc-50 uppercase">
                      {portalName}
                    </span>
                  </div>
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <FiX size={18} />
                  </button>
                </div>
                <nav className="space-y-1">
                  {links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.end}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-4 py-3 px-3.5 rounded-xl font-heading text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                            isActive
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : 'text-neutral-500 dark:text-zinc-400 border border-transparent'
                          }`
                        }
                      >
                        <Icon size={18} />
                        <span>{link.name}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 border-t border-neutral-150 dark:border-zinc-850 pt-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <FiUser size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-zinc-200 truncate">{user?.name}</div>
                    <div className="text-[9px] uppercase font-bold tracking-widest text-amber-500">{roleBadge}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 py-2.5 px-3.5 rounded-xl font-heading text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-wider w-full text-left"
                >
                  <FiLogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Dashboard Wrapper */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 border-b border-neutral-200 dark:border-zinc-900 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md flex items-center justify-between px-6 md:px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Collapse Sidebar Button (Desktop) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex p-2 text-neutral-500 hover:text-neutral-800 dark:text-zinc-450 dark:hover:text-zinc-200 bg-neutral-55/10 dark:bg-zinc-950/20 rounded-xl border border-neutral-200/40 dark:border-zinc-850 cursor-pointer"
            >
              <FiMenu size={18} />
            </button>
            {/* Collapse Sidebar Button (Mobile) */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex md:hidden p-2 text-neutral-500 hover:text-neutral-800 dark:text-zinc-450 dark:hover:text-zinc-200 bg-neutral-55/10 dark:bg-zinc-950/20 rounded-xl border border-neutral-200/40 dark:border-zinc-850 cursor-pointer"
            >
              <FiMenu size={18} />
            </button>
            <span className="font-heading font-semibold text-sm text-neutral-600 dark:text-zinc-400 capitalize hidden sm:inline">
              Event Management &bull; {portalName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-zinc-850 text-neutral-500 dark:text-zinc-450 hover:text-amber-500 dark:hover:text-amber-500 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {/* Notification placeholder */}
            <button className="p-2.5 rounded-xl border border-neutral-200 dark:border-zinc-850 text-neutral-500 dark:text-zinc-450 hover:text-amber-500 dark:hover:text-amber-500 cursor-pointer relative">
              <FiBell size={16} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-zinc-900" />
            </button>

            {/* Simple User Pill */}
            <div className="flex items-center gap-3 border border-neutral-250 dark:border-zinc-850 rounded-full py-1 px-1 pl-3 bg-neutral-50 dark:bg-zinc-950/40">
              <span className="text-xs font-semibold text-neutral-800 dark:text-zinc-350 max-w-[100px] truncate hidden md:inline">{user?.name}</span>
              <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-sm">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* outlet body */}
        <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

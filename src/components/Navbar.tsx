import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Upcoming', path: '/upcoming-events' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'py-3.5 bg-transparent' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo & Monogram */}
          <NavLink to="/" className="flex items-center gap-3 group select-none">
            <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <Logo size={24} className="text-neutral-950" />
            </span>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg md:text-xl tracking-wider text-neutral-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors duration-300">
                GOWTHAM
              </span>
              <span className="text-[9px] font-heading font-bold tracking-[0.25em] uppercase text-amber-500/90 -mt-1">
                EVENTS
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative font-heading text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
                    isActive
                      ? 'text-amber-500'
                      : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavLink"
                        className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-amber-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-900 text-neutral-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-all duration-300 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
            <NavLink
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-heading font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Inquire Now
            </NavLink>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex lg:hidden items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-neutral-200 dark:border-zinc-800 text-neutral-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full border border-neutral-200 dark:border-zinc-800 text-neutral-600 dark:text-zinc-400 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 pt-28 pb-10 px-6 bg-zinc-950/98 backdrop-blur-2xl flex flex-col justify-between lg:hidden"
          >
            <nav className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `font-heading text-base font-bold tracking-widest uppercase transition-colors duration-300 ${
                      isActive ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="flex flex-col items-center gap-4">
              <NavLink
                to="/contact"
                className="w-full text-center py-3.5 rounded-full text-xs font-heading font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-lg"
              >
                Inquire Now
              </NavLink>
              <div className="text-zinc-500 text-xs tracking-wider font-light">
                concierge@gowthamevents.com
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiLinkedin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { companyInfo } from '../data/mockData';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-neutral-100/50 dark:bg-zinc-950 border-t border-neutral-200 dark:border-zinc-900 pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Company Column */}
        <div className="flex flex-col gap-6">
          <NavLink to="/" className="flex items-center gap-3 group select-none">
            <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 shadow-md">
              <Logo size={22} className="text-neutral-950" />
            </span>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg tracking-wider text-neutral-900 dark:text-zinc-50">
                GOWTHAM
              </span>
              <span className="text-[8px] font-heading font-bold tracking-[0.25em] uppercase text-amber-500/90 -mt-1">
                EVENTS
              </span>
            </div>
          </NavLink>
          <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed font-light">
            {companyInfo.tagline}
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3.5 mt-2">
            <a
              href={companyInfo.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2.5 rounded-full bg-neutral-200/60 dark:bg-zinc-900 text-neutral-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-300"
            >
              <FiInstagram size={15} />
            </a>
            <a
              href={companyInfo.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 rounded-full bg-neutral-200/60 dark:bg-zinc-900 text-neutral-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-300"
            >
              <FiLinkedin size={15} />
            </a>
            <a
              href={companyInfo.socials.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="p-2.5 rounded-full bg-neutral-200/60 dark:bg-zinc-900 text-neutral-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-300"
            >
              <FiTwitter size={15} />
            </a>
            <a
              href={companyInfo.socials.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="p-2.5 rounded-full bg-neutral-200/60 dark:bg-zinc-900 text-neutral-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-300"
            >
              <FiFacebook size={15} />
            </a>
          </div>
        </div>

        {/* Quick Navigation Column */}
        <div>
          <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-neutral-800 dark:text-zinc-200 mb-6">
            Navigation
          </h3>
          <ul className="space-y-3.5">
            <li>
              <NavLink to="/about" className="text-sm text-neutral-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors font-light">
                Company Legacy
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className="text-sm text-neutral-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors font-light">
                Curated Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/portfolio" className="text-sm text-neutral-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors font-light">
                Masterpiece Showcase
              </NavLink>
            </li>
            <li>
              <NavLink to="/gallery" className="text-sm text-neutral-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors font-light">
                Visual Gallery
              </NavLink>
            </li>
            <li>
              <NavLink to="/upcoming-events" className="text-sm text-neutral-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors font-light">
                Experiential Calendar
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Key Disciplines Column */}
        <div>
          <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-neutral-800 dark:text-zinc-200 mb-6">
            Key Disciplines
          </h3>
          <ul className="space-y-3.5">
            <li>
              <NavLink to="/services" className="text-sm text-neutral-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors font-light">
                Luxury Wedding Planning
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className="text-sm text-neutral-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors font-light">
                Corporate Galas & Summits
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className="text-sm text-neutral-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors font-light">
                Product Launches
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className="text-sm text-neutral-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors font-light">
                Artisan Gastronomy & Catering
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className="text-sm text-neutral-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-colors font-light">
                Creative Set Fabrication
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-neutral-800 dark:text-zinc-200 mb-6">
            Gowtham Journal
          </h3>
          <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed mb-5 font-light">
            Receive private exhibition invitations, architectural layouts, and luxury design essays.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-semibold">
              <FiCheckCircle size={16} /> Subscribed to Gowtham Journal
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex relative">
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-200/50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-full px-5 py-2.5 text-xs focus:outline-none focus:border-amber-500/50 text-neutral-800 dark:text-zinc-200 placeholder:text-neutral-400 dark:placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-9 flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-full cursor-pointer transition-colors duration-200"
                aria-label="Subscribe"
              >
                <FiSend size={13} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-neutral-200 dark:border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-450 dark:text-zinc-500 font-light">
        <div>
          &copy; {currentYear} Gowtham Events. All rights reserved. Designed with precision & elegance.
        </div>
        <div className="flex gap-6">
          <NavLink to="/contact" className="hover:text-amber-500 transition-colors">
            Privacy Policy
          </NavLink>
          <NavLink to="/contact" className="hover:text-amber-500 transition-colors">
            Terms of Service
          </NavLink>
          <NavLink to="/login" className="hover:text-amber-500 transition-colors">
            Portal Access
          </NavLink>
        </div>
      </div>
    </footer>
  );
};

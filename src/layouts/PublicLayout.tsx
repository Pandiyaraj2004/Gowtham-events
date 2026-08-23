import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ScrollProgress } from '../components/ScrollProgress';
import { BackToTop } from '../components/BackToTop';

export const PublicLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-neutral-800 dark:text-zinc-200 transition-colors duration-300">
      {/* Scroll Reading Line */}
      <ScrollProgress />

      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Page Content Wrapper */}
      <main className="flex-grow pt-24">
        <Outlet />
      </main>

      {/* Footer Links & Info */}
      <Footer />

      {/* Quick Scroll To Top Button */}
      <BackToTop />
    </div>
  );
};

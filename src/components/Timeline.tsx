import React from 'react';
import { motion } from 'framer-motion';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className={`relative ${className}`}>
      {/* Central Line */}
      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-neutral-200 dark:bg-zinc-800" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="space-y-12"
      >
        {items.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`flex flex-col md:flex-row relative items-start ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Left Spacer / Right Panel */}
              <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                <div className={`p-6 rounded-2xl glow-card premium-shadow ${
                  isEven ? 'md:text-left' : 'md:text-right'
                }`}>
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest text-amber-500 bg-amber-500/10 rounded-full font-heading">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Central Point */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 top-6 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-amber-500 border-4 border-white dark:border-zinc-950 shadow-md ring-4 ring-amber-500/20" />
              </div>

              {/* Empty Space for alignment on Desktop */}
              <div className="hidden md:block w-1/2" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

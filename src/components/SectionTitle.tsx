import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}
    >
      {subtitle && (
        <span className="text-amber-500 font-heading text-xs font-bold uppercase tracking-[0.2em] block mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-heading font-bold text-neutral-900 dark:text-zinc-50 tracking-tight relative inline-block">
        {title}
        <span
          className={`absolute bottom-[-10px] h-[2.5px] bg-gradient-to-r from-amber-500 to-amber-600 rounded-full w-12 ${
            align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
          }`}
        />
      </h2>
    </motion.div>
  );
};

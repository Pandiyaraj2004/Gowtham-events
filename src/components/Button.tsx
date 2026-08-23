import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass';
  onClick?: () => void;
  to?: string;
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  to,
  href,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center px-7 py-3.5 rounded-full text-xs font-heading font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 shadow-md shadow-amber-500/15 hover:shadow-amber-500/25 active:scale-95 border border-amber-400/30',
    secondary:
      'border border-neutral-300 dark:border-zinc-800 bg-neutral-100/50 dark:bg-zinc-900/60 hover:bg-neutral-200/60 dark:hover:bg-zinc-800 text-neutral-900 dark:text-zinc-100 active:scale-95',
    glass:
      'glassmorphism hover:border-amber-500/40 text-neutral-900 dark:text-zinc-100 active:scale-95 shadow-sm',
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${className}`;

  const InnerContent = () => (
    <motion.span
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        <InnerContent />
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClasses}>
        <InnerContent />
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={buttonClasses} disabled={disabled}>
      <InnerContent />
    </button>
  );
};

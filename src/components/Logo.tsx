import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 28, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className}
    aria-label="Gowtham Events Monogram"
  >
    <path
      d="M22 8a8 8 0 1 0 0 16h-5v-6M10 24a8 8 0 1 0 0-16h5v6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

import React, { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, animate } from 'framer-motion';

interface StatCounterProps {
  target: number;
  suffix?: string;
  label: string;
  className?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  target,
  suffix = '',
  label,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, {
        duration: 2.2,
        ease: 'easeOut',
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        }
      });
      return () => controls.stop();
    }
  }, [inView, target, count]);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center p-6 text-center rounded-2xl glow-card premium-shadow ${className}`}
    >
      <span className="text-4xl md:text-5xl font-heading font-bold text-amber-500 mb-2">
        {displayValue}
        {suffix}
      </span>
      <span className="text-sm font-semibold tracking-wider text-neutral-500 dark:text-zinc-400 uppercase">
        {label}
      </span>
    </div>
  );
};

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <FiX size={24} />
          </button>

          {/* Left Arrow */}
          {onPrev && images.length > 1 && (
            <button
              onClick={onPrev}
              className="absolute left-6 p-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 rounded-full transition-all duration-200 cursor-pointer"
              aria-label="Previous Image"
            >
              <FiChevronLeft size={28} />
            </button>
          )}

          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="max-w-[90vw] max-h-[80vh] relative select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`Event Gallery ${currentIndex + 1}`}
              className="object-contain max-w-full max-h-[80vh] rounded-lg shadow-2xl border border-white/5"
            />
            {/* Image Counter */}
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tracking-widest font-heading">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>

          {/* Right Arrow */}
          {onNext && images.length > 1 && (
            <button
              onClick={onNext}
              className="absolute right-6 p-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 rounded-full transition-all duration-200 cursor-pointer"
              aria-label="Next Image"
            >
              <FiChevronRight size={28} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

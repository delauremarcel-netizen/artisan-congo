import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const PortfolioGallery = ({ images = [], initialIndex = 0, onClose }) => {
  const [[page, direction], setPage] = useState([initialIndex, 0]);

  // We only have 1 active image index
  const imageIndex = Math.abs(page % images.length);

  const paginate = useCallback((newDirection) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'Escape') onClose();
    };
    
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [paginate, onClose]);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm touch-none">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 z-50 absolute top-0 w-full bg-gradient-to-b from-black/60 to-transparent">
        <span className="text-white/80 font-medium font-mono">
          {imageIndex + 1} / {images.length}
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={images[imageIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) paginate(1);
              else if (swipe > swipeConfidenceThreshold) paginate(-1);
            }}
            className="absolute max-w-full max-h-full object-contain select-none cursor-grab active:cursor-grabbing px-4"
            alt={`Gallery image ${imageIndex + 1}`}
            draggable={false}
          />
        </AnimatePresence>

        {/* Navigation Arrows (Desktop) */}
        <div className="hidden md:flex absolute inset-y-0 left-4 items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            className="w-12 h-12 rounded-full bg-black/20 text-white hover:bg-black/50 backdrop-blur-md"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
        </div>
        <div className="hidden md:flex absolute inset-y-0 right-4 items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            className="w-12 h-12 rounded-full bg-black/20 text-white hover:bg-black/50 backdrop-blur-md"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="h-24 md:h-32 bg-black/60 flex items-center justify-center px-4 overflow-x-auto shrink-0 gap-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setPage([idx, idx > imageIndex ? 1 : -1])}
            className={`relative shrink-0 transition-all rounded-lg overflow-hidden h-16 md:h-20 aspect-video ${
              imageIndex === idx ? 'ring-2 ring-white opacity-100 scale-105' : 'opacity-50 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PortfolioGallery;
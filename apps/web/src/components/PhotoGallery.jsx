import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PhotoGallery = ({ photos = [], onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[80vh] p-0 bg-black/95 border-none flex flex-col justify-center overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="relative w-full h-full flex items-center justify-center p-4">
          {photos.length > 1 && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-4 text-white hover:bg-white/20 z-50"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}

          <img 
            src={photos[currentIndex]} 
            alt={`Photo ${currentIndex + 1}`} 
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />

          {photos.length > 1 && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 text-white hover:bg-white/20 z-50"
              onClick={handleNext}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}
        </div>
        
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoGallery;
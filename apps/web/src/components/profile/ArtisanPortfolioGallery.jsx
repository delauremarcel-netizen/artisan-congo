import React, { useState } from 'react';
import { Maximize2, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

export const ArtisanPortfolioGallery = ({ items = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
        <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Aucune réalisation</h3>
        <p className="text-muted-foreground text-sm max-w-sm mt-1">
          Cet artisan n'a pas encore ajouté de photos à son portfolio.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-muted cursor-pointer"
            onClick={() => setSelectedImage(item)}
          >
            <img 
              src={pb.files.getUrl(item, item.photo)} 
              alt={item.titre || 'Réalisation artisan'} 
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full mb-2">
                  {item.categorie_service}
                </span>
                <h4 className="text-white font-bold text-lg leading-tight">{item.titre}</h4>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-5xl w-full relative" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-white/70 hover:text-white font-medium text-sm"
              onClick={() => setSelectedImage(null)}
            >
              Fermer
            </button>
            <img 
              src={pb.files.getUrl(selectedImage, selectedImage.photo)} 
              alt={selectedImage.titre} 
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-white">
              <h3 className="text-xl font-bold">{selectedImage.titre}</h3>
              {selectedImage.description && (
                <p className="text-white/70 mt-2 text-sm max-w-3xl">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
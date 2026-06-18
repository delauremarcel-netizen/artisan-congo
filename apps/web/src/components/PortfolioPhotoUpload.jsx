import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle2 } from 'lucide-react';

const PortfolioPhotoUpload = ({ photos = [], onPhotosChange, onRemove, maxPhotos = 5, maxFileSize = 20971520 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onPhotosChange(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onPhotosChange(Array.from(e.target.files));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isFull = photos.length >= maxPhotos;

  return (
    <div className="w-full space-y-4">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ease-in-out cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
          ${isFull ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isFull && fileInputRef.current?.click()}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/jpeg, image/png, image/webp, image/gif"
          className="hidden"
          disabled={isFull}
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-foreground font-medium">
              Glissez-déposez vos photos ici ou <span className="text-primary hover:underline">parcourez</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              JPG, PNG, WEBP, GIF (Max 20MB par fichier)
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <span className={`text-sm font-medium ${isFull ? 'text-destructive' : 'text-muted-foreground'}`}>
          {isFull ? `Limite atteinte (${maxPhotos}/${maxPhotos})` : `${photos.length}/${maxPhotos} photos`}
        </span>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {photos.map((file, index) => {
            const objectUrl = URL.createObjectURL(file);
            return (
              <div key={`${file.name}-${index}`} className="relative flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm group">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={objectUrl} 
                    alt={file.name} 
                    className="w-full h-full object-cover"
                    onLoad={() => URL.revokeObjectURL(objectUrl)}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(index);
                      }}
                      className="p-2 bg-destructive text-destructive-foreground rounded-full hover:scale-110 transition-transform shadow-md"
                      aria-label="Supprimer la photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <p className="text-sm font-medium text-foreground truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Prêt
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortfolioPhotoUpload;
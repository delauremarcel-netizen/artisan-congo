import React, { useState, useCallback, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { validatePortfolioPhotos } from '@/lib/validatePortfolioPhotos.js';
import { Progress } from '@/components/ui/progress';

const MultiPhotoUpload = ({ files, onChange, maxFiles = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const simulateProgress = (file) => {
    setUploadingFiles(prev => ({ ...prev, [file.name]: 0 }));
    
    const interval = setInterval(() => {
      setUploadingFiles(prev => {
        const currentProgress = prev[file.name] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [file.name]: currentProgress + 10 };
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setUploadingFiles(prev => {
        const newObj = { ...prev };
        delete newObj[file.name];
        return newObj;
      });
    }, 1200);
  };

  const processFiles = (newFiles) => {
    const allFiles = [...files, ...newFiles];
    const { valid, errors } = validatePortfolioPhotos(allFiles);

    if (!valid) {
      errors.forEach(err => toast.error(err));
      // Only keep the valid slice up to maxFiles if we exceeded
      if (files.length < maxFiles) {
         const allowedNewFiles = newFiles.slice(0, maxFiles - files.length);
         if (allowedNewFiles.length > 0) {
            allowedNewFiles.forEach(simulateProgress);
            onChange([...files, ...allowedNewFiles]);
         }
      }
      return;
    }

    newFiles.forEach(simulateProgress);
    onChange(allFiles);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [files, onChange, maxFiles]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (indexToRemove) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    onChange(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ease-in-out cursor-pointer
          ${isDragging 
            ? 'border-[#1B7A6B] bg-[#1B7A6B]/5 scale-[1.02]' 
            : 'border-border hover:border-[#1B7A6B]/50 hover:bg-muted/50'
          }
          ${files.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => files.length < maxFiles && fileInputRef.current?.click()}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/jpeg, image/jpg, image/png, image/webp, image/gif"
          className="hidden"
          disabled={files.length >= maxFiles}
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-primary/10 rounded-full text-[#1B7A6B]">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-foreground font-medium">
              Glissez-déposez vos photos ici ou <span className="text-[#1B7A6B]">parcourez</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              JPG, PNG, WEBP, GIF (Max 20MB par fichier)
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <span className="text-sm font-medium text-muted-foreground">
          {files.length}/{maxFiles} photos
        </span>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {files.map((file, index) => {
            const isUploading = uploadingFiles[file.name] !== undefined;
            const progress = uploadingFiles[file.name] || 0;
            const objectUrl = URL.createObjectURL(file);

            return (
              <div 
                key={`${file.name}-${index}`} 
                className="relative flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm group"
              >
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
                        removeFile(index);
                      }}
                      className="p-2 bg-destructive text-destructive-foreground rounded-full hover:scale-110 transition-transform"
                      aria-label="Supprimer la photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {isUploading ? (
                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#1B7A6B] flex items-center gap-1 font-medium">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                        </span>
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-muted [&>div]:bg-[#1B7A6B]" />
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Prêt
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiPhotoUpload;
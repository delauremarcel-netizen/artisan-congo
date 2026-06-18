import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const PhotoUploadSection = ({ files, setFiles, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef(null);

  const handleFiles = (newFiles) => {
    setLocalError('');
    const validFiles = [];
    let hasError = false;

    Array.from(newFiles).forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setLocalError('Format non supporté. Utilisez JPG, PNG ou WEBP.');
        hasError = true;
      } else if (file.size > MAX_FILE_SIZE) {
        setLocalError('Un fichier dépasse la limite de 5MB.');
        hasError = true;
      } else {
        validFiles.push(file);
      }
    });

    if (!hasError) {
      if (files.length + validFiles.length > MAX_FILES) {
        setLocalError(`Vous ne pouvez pas ajouter plus de ${MAX_FILES} photos.`);
        const remainingSlots = MAX_FILES - files.length;
        setFiles([...files, ...validFiles.slice(0, remainingSlots)]);
      } else {
        setFiles([...files, ...validFiles]);
      }
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
          (error || localError) && "border-destructive bg-destructive/5"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          onChange={onChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-3 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Cliquez ou glissez vos photos ici
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG, WEBP jusqu'à 5MB (Max {MAX_FILES} photos)
            </p>
          </div>
        </div>
      </div>

      {(error || localError) && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>{localError || error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
          {files.map((file, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              <img 
                src={URL.createObjectURL(file)} 
                alt={`Preview ${index}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="w-8 h-8 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUploadSection;
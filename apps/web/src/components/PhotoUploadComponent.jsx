import React, { useRef, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

export default function PhotoUploadComponent({ maxFiles = 5, onFilesChange }) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const valid = selected.filter(f => f.type.startsWith('image/'));
    const combined = [...files, ...valid].slice(0, maxFiles);
    setFiles(combined);
    if (onFilesChange) onFilesChange(combined);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFilesChange) onFilesChange(newFiles);
  };

  return (
    <div className="w-full space-y-4">
      <div 
        className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="w-10 h-10 text-primary mb-3" />
        <p className="text-sm font-medium text-foreground">Cliquez ou glissez-déposez pour uploader</p>
        <p className="text-xs text-muted-foreground mt-1">Images JPG/PNG uniquement (Max {maxFiles})</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          multiple 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {files.map((file, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center group">
              <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
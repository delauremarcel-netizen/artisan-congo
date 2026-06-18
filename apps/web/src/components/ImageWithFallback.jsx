import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { logImageError } from '@/lib/imageLoadingMonitor';

/**
 * Image wrapper with built-in error handling, loading skeleton, and performance defaults.
 */
const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+Non+Disponible',
  className = '',
  containerClassName = '',
  loading = 'lazy',
  decoding = 'async',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setStatus('loading');
    } else {
      handleError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const handleError = () => {
    if (status === 'error') return; // Prevent infinite loop if fallback fails
    if (src) logImageError(src, alt);
    
    setImgSrc(fallbackSrc);
    setStatus('error');
  };

  const handleLoad = () => {
    if (status !== 'error') {
      setStatus('loaded');
    }
  };

  return (
    <div className={`relative overflow-hidden bg-muted ${containerClassName}`}>
      {status === 'loading' && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}
      
      <img
        src={imgSrc || fallbackSrc}
        alt={alt || 'Image'}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
        decoding={decoding}
        className={`w-full h-full transition-opacity duration-300 ${
          status === 'loading' ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
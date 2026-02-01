import React, { useState, useEffect } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

/**
 * Enhanced LazyImage component with Intersection Observer
 * Supports responsive images, WebP format, and progressive loading
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = '16/9',
  sizes,
  srcSet,
  style = {},
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: '100px',
    freezeOnceVisible: true,
  });

  const paddingBottom = aspectRatio === '16/9' ? '56.25%' : 
                        aspectRatio === '4/3' ? '75%' : 
                        aspectRatio === '1/1' ? '100%' : 
                        aspectRatio === '3/2' ? '66.67%' : '56.25%';

  // Load image when it enters viewport
  useEffect(() => {
    if (isIntersecting && src && !imageSrc) {
      setImageSrc(src);
    }
  }, [isIntersecting, src, imageSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    if (onError) onError();
  };

  // Check if browser supports WebP
  const supportsWebP = () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Generate WebP source if supported
  const getWebPSource = (originalSrc) => {
    if (!originalSrc || !supportsWebP()) return null;
    // If src ends with jpg/jpeg/png, try replacing with webp
    if (/\.(jpe?g|png)$/i.test(originalSrc)) {
      return originalSrc.replace(/\.(jpe?g|png)$/i, '.webp');
    }
    return null;
  };

  const webpSrc = getWebPSource(src);

  return (
    <div 
      ref={imageRef}
      className={`lazy-image-container ${className}`} 
      style={{ paddingBottom, position: 'relative', overflow: 'hidden', ...style }}
    >
      {/* Loading placeholder with shimmer effect */}
      {!isLoaded && !error && (
        <div 
          className="lazy-image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}
      
      {/* Error state */}
      {error && (
        <div 
          className="lazy-image-error bg-light d-flex align-items-center justify-content-center text-muted"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <span className="small">Image unavailable</span>
        </div>
      )}
      
      {/* Actual image - only rendered when in viewport */}
      {imageSrc && !error && (
        <picture>
          {/* WebP source if available */}
          {webpSrc && (
            <source 
              srcSet={webpSrc} 
              type="image/webp"
            />
          )}
          
          {/* Fallback to original format */}
          <img
            src={imageSrc}
            srcSet={srcSet}
            sizes={sizes || '100vw'}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />
        </picture>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LazyImage;

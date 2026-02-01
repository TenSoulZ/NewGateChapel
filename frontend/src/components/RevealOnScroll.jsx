import React, { useEffect, useRef } from 'react';

const RevealOnScroll = ({
  children,
  threshold = 0.1,
  direction = 'up',
  delay = 0,
  className = ''
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          elementRef.current.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold]);

  const getRevealClass = () => {
    switch (direction) {
      case 'left':
        return 'reveal-left';
      case 'right':
        return 'reveal-right';
      default:
        return 'reveal-up';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`reveal ${getRevealClass()} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;

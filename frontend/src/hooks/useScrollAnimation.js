import { useEffect, useState } from 'react';

const useScrollAnimation = (ref, options = {}) => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementVisible = entry.isIntersecting;
        setIsVisible(isElementVisible);
        
        if (isElementVisible && freezeOnceVisible) {
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    );

    const currentRef = ref.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, threshold, root, rootMargin, freezeOnceVisible]);

  return isVisible;
};

export default useScrollAnimation;

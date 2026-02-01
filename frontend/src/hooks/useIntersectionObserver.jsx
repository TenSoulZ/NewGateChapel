import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for efficient intersection observation
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.root - Root element for observation
 * @param {string} options.rootMargin - Margin around root
 * @returns {[React.RefObject, boolean]} - [ref to attach to element, isIntersecting]
 */
const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '50px',
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If already visible and frozen, don't observe
    if (freezeOnceVisible && isIntersecting) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        // If we should freeze and is now visible, unobserve
        if (freezeOnceVisible && isElementIntersecting && element) {
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible, isIntersecting]);

  return [elementRef, isIntersecting];
};

export default useIntersectionObserver;

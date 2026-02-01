import { useState, useEffect, useRef } from 'react'

export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef()

  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    ...otherOptions
  } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
          if (triggerOnce) {
            observer.disconnect()
          }
        }
      },
      {
        threshold,
        rootMargin,
        ...otherOptions
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce, hasIntersected, otherOptions])

  return {
    elementRef,
    isIntersecting,
    hasIntersected
  }
}

export const useLazyLoading = (options = {}) => {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    triggerOnce: true,
    ...options
  })

  return {
    ref: elementRef,
    shouldLoad: hasIntersected
  }
}

export default useIntersectionObserver

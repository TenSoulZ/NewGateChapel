import React, { useState, useRef, useEffect } from 'react'

const LazySection = ({ 
  children, 
  className = '', 
  threshold = 0.1, 
  rootMargin = '50px',
  fallback = null,
  ...props 
}) => {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={sectionRef} className={className} {...props}>
      {isInView ? children : fallback}
    </div>
  )
}

export default LazySection

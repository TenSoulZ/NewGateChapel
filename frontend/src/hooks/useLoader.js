import { useState, useEffect } from 'react'

export const useLoader = (initialLoading = true, minLoadTime = 1000) => {
  const [isLoading, setIsLoading] = useState(initialLoading)
  const [loadingMessage, setLoadingMessage] = useState('Loading...')

  const startLoading = (message = 'Loading...') => {
    setLoadingMessage(message)
    setIsLoading(true)
  }

  const stopLoading = () => {
    // Ensure minimum loading time for better UX
    setTimeout(() => {
      setIsLoading(false)
    }, minLoadTime)
  }

  // Auto-stop loading after initial mount
  useEffect(() => {
    if (initialLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, minLoadTime)

      return () => clearTimeout(timer)
    }
  }, [initialLoading, minLoadTime])

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    setLoadingMessage
  }
}

export default useLoader

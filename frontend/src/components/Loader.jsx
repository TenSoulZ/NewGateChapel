import React from 'react'
import { Spinner } from 'react-bootstrap'
import { FaChurch } from 'react-icons/fa'

const Loader = ({ 
  show = true, 
  fullScreen = true, 
  message = "Loading...",
  variant = "primary" 
}) => {
  if (!show) return null

  const loaderContent = (
    <div className={`loader-content ${fullScreen ? 'loader-fullscreen' : 'loader-inline'}`}>
      <div className="loader-inner">
        {/* Church Icon with Pulse Animation */}
        <div className="loader-icon mb-3">
          <FaChurch className="text-primary" />
        </div>
        
        {/* Spinning Loader */}
        <Spinner 
          animation="border" 
          variant={variant} 
          className="mb-3"
          style={{ width: '3rem', height: '3rem' }}
        />
        
        {/* Loading Message */}
        <p className="loader-message">{message}</p>
        
        {/* Progress Dots */}
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )

  return loaderContent
}

export default Loader

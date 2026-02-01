import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ size = 'medium', light = false }) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  return (
    <div className={`loading-spinner ${sizeClass} ${light ? 'spinner-light' : ''}`}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;

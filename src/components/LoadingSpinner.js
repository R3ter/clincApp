import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message, size = 'medium', variant = 'default' }) => {
  return (
    <div className={`loading-container loading-${variant}`}>
      <div className={`spinner spinner-${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;

import React from 'react';
import companyLogo from '../assets/logo.png';
import './CompanyHeader.css';

const CompanyHeader = () => {
  return (
    <div className="company-header">
      <div className="company-header-container">
        <img 
          src={companyLogo} 
          alt="The Jerusalem Princess Basma Centre" 
          className="company-logo-image"
        />
      </div>
    </div>
  );
};

export default CompanyHeader;
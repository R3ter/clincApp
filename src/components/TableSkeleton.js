import React from 'react';
import './LoadingSpinner.css';

const TableSkeleton = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="table-skeleton">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`skeleton-cell ${
                colIndex === 0 ? 'skeleton-title' : 'skeleton-text'
              }`}
              style={{
                maxWidth: colIndex === 0 ? '200px' : 
                         colIndex === columns - 1 ? '100px' : '150px',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;

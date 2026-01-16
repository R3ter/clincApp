import React from 'react';
import './DraftRestoreDialog.css';

const DraftRestoreDialog = ({ onRestore, onDiscard }) => {
  return (
    <div className="draft-restore-overlay">
      <div className="draft-restore-dialog">
        <h3>Restore Draft?</h3>
        <p>You have unsaved changes. Would you like to restore them?</p>
        <div className="draft-restore-actions">
          <button className="btn btn-secondary" onClick={onDiscard}>
            Discard
          </button>
          <button className="btn btn-primary" onClick={onRestore}>
            Restore
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftRestoreDialog;

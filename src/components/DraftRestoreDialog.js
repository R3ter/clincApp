import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import './DraftRestoreDialog.css';

const DraftRestoreDialog = ({ onRestore, onDiscard }) => {
  const { t } = useLanguage();
  
  return (
    <div className="draft-restore-overlay">
      <div className="draft-restore-dialog">
        <h3>{t('draft.restoreDraft')}</h3>
        <p>{t('draft.unsavedChanges')}</p>
        <div className="draft-restore-actions">
          <button className="btn btn-secondary" onClick={onDiscard}>
            {t('draft.discard')}
          </button>
          <button className="btn btn-primary" onClick={onRestore}>
            {t('draft.restore')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftRestoreDialog;

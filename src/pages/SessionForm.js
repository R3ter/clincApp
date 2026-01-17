import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createSession, updateSession, getSession } from '../services/realtimeDbService';
import { formatDateForInput } from '../utils/dateUtils';
import { useDraft } from '../hooks/useDraft';
import { DraftKeys } from '../utils/draftManager';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import { DEFAULT_SESSION_TYPES } from '../config/sessionTypes';
import { getSessionTypeObject, getSessionTypeKeyFromObject } from '../utils/sessionTypesUtils';
import EditableSelect from '../components/EditableSelect';
import DraftRestoreDialog from '../components/DraftRestoreDialog';
import ToastContainer from '../components/ToastContainer';
import LoadingSpinner from '../components/LoadingSpinner';
import './SessionForm.css';

const SessionForm = () => {
  const { patientId, sessionId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!sessionId;
  const { t } = useLanguage();
  const { toasts, removeToast, success, error: showError } = useToast();
  
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  
  // Only use draft for creating new sessions, not editing
  const draftKey = isEdit ? null : DraftKeys.SESSION_CREATE(patientId);
  
  const draftHook = useDraft(draftKey || '', {
    sessionType: '',
    sessionDate: '',
    notes: '',
  });
  
  // Use draft only when creating, use regular state when editing
  const [dataState, setDataState] = useState({
    sessionType: '',
    sessionDate: '',
    notes: '',
  });
  
  const data = isEdit ? dataState : draftHook.data;
  const setData = isEdit ? setDataState : draftHook.setData;
  const hasDraft = isEdit ? false : draftHook.hasDraft;
  const showRestoreDialog = isEdit ? false : draftHook.showRestoreDialog;
  const restoreDraftHook = isEdit ? () => {} : draftHook.restoreDraft;
  const discardDraftHook = isEdit ? () => {} : draftHook.discardDraft;
  const clearDraftData = isEdit ? () => {} : draftHook.clearDraftData;

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      const session = await getSession(patientId, sessionId);
      setInitialData(session);
    } catch (err) {
      showError(t('session.failedLoad'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [patientId, sessionId, showError, t]);

  useEffect(() => {
    if (isEdit) {
      loadSession();
    }
  }, [isEdit, loadSession]);

  const loadInitialData = useCallback(() => {
    if (initialData && isEdit) {
      // Convert sessionType object to display text for the form
      const sessionTypeDisplay = getSessionTypeKeyFromObject(initialData.sessionType, t);
      setData({
        sessionType: sessionTypeDisplay || '',
        sessionDate: formatDateForInput(initialData.sessionDate),
        notes: initialData.notes || '',
      });
    }
  }, [initialData, isEdit, setData, t]);

  useEffect(() => {
    // Load initial data when editing and form is empty
    if (initialData && isEdit) {
      const hasData = data.sessionType || data.sessionDate;
      if (!hasData) {
        loadInitialData();
      }
    }
  }, [initialData, isEdit, data.sessionType, data.sessionDate, loadInitialData]);

  const restoreDraft = () => {
    restoreDraftHook();
  };

  const discardDraft = () => {
    discardDraftHook();
  };

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!data.sessionType?.trim()) {
      newErrors.sessionType = t('patient.sessionTypeRequired');
    }

    if (!data.sessionDate) {
      newErrors.sessionDate = t('patient.sessionDateRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      // Convert sessionType to object {en, ar}
      const sessionTypeObj = getSessionTypeObject(data.sessionType.trim());
      
      const sessionData = {
        sessionType: sessionTypeObj,
        sessionDate: data.sessionDate,
        notes: data.notes?.trim() || '',
      };

      if (isEdit) {
        await updateSession(patientId, sessionId, sessionData);
        success(t('session.sessionUpdated'));
      } else {
        await createSession(patientId, sessionData);
        success(t('session.sessionCreated'));
        // Clear draft on success only when creating
        clearDraftData();
      }
      
      setTimeout(() => {
        navigate(`/clinic/patients/${patientId}`);
      }, 500);
    } catch (err) {
      showError(isEdit ? t('session.failedUpdate') : t('session.failedCreate'));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Only check for draft when creating, not editing
    if (!isEdit && hasDraft) {
      if (window.confirm(t('patient.unsavedChanges'))) {
        clearDraftData();
        navigate(`/clinic/patients/${patientId}`);
      }
    } else {
      navigate(`/clinic/patients/${patientId}`);
    }
  };

  if (loading) {
    return (
      <div className="session-form-container">
        <LoadingSpinner message={t('session.loadingSession')} size="large" />
      </div>
    );
  }

  return (
    <div className="session-form-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {!isEdit && showRestoreDialog && (
        <DraftRestoreDialog
          onRestore={restoreDraft}
          onDiscard={discardDraft}
        />
      )}

      <div className="session-form-header">
        <h1>{isEdit ? t('session.editSession') : t('session.addSession')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="session-form">
        <div className="form-group">
          <label htmlFor="sessionType">
            {t('patient.sessionType')} <span className="required">{t('common.required')}</span>
          </label>
          <EditableSelect
            value={data.sessionType}
            onChange={(value) => handleChange('sessionType', value)}
            options={DEFAULT_SESSION_TYPES.map(type => t(`sessionTypes.${type}`, type))}
            placeholder={t('patient.selectOrTypeSessionType')}
            className={errors.sessionType ? 'error' : ''}
          />
          {errors.sessionType && <span className="error-message">{errors.sessionType}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="sessionDate">
            {t('patient.sessionDate')} <span className="required">{t('common.required')}</span>
          </label>
          <input
            type="date"
            id="sessionDate"
            value={data.sessionDate || ''}
            onChange={(e) => handleChange('sessionDate', e.target.value)}
            className={errors.sessionDate ? 'error' : ''}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.sessionDate && <span className="error-message">{errors.sessionDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="notes">{t('patient.notes')}</label>
          <textarea
            id="notes"
            value={data.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows="5"
            placeholder={t('session.optionalSessionNotes')}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={submitting}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? t('patient.saving') : isEdit ? t('patient.saveChanges') : t('session.createSession')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionForm;

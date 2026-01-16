import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createSession, updateSession, getSession } from '../services/realtimeDbService';
import { formatDateForInput } from '../utils/dateUtils';
import { useDraft } from '../hooks/useDraft';
import { DraftKeys } from '../utils/draftManager';
import { useToast } from '../hooks/useToast';
import { DEFAULT_SESSION_TYPES } from '../config/sessionTypes';
import EditableSelect from '../components/EditableSelect';
import DraftRestoreDialog from '../components/DraftRestoreDialog';
import ToastContainer from '../components/ToastContainer';
import './SessionForm.css';

const SessionForm = () => {
  const { patientId, sessionId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!sessionId;
  const { toasts, removeToast, success, error: showError } = useToast();
  
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  
  const draftKey = isEdit
    ? DraftKeys.SESSION_EDIT(patientId, sessionId)
    : DraftKeys.SESSION_CREATE(patientId);
  
  const {
    data,
    setData,
    hasDraft,
    showRestoreDialog,
    restoreDraft: restoreDraftHook,
    discardDraft: discardDraftHook,
    clearDraftData,
  } = useDraft(draftKey, {
    sessionType: '',
    sessionDate: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      const session = await getSession(patientId, sessionId);
      setInitialData(session);
    } catch (err) {
      showError('Failed to load session. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [patientId, sessionId, showError]);

  useEffect(() => {
    if (isEdit) {
      loadSession();
    }
  }, [isEdit, loadSession]);

  const loadInitialData = useCallback(() => {
    if (initialData && isEdit) {
      setData({
        sessionType: initialData.sessionType || '',
        sessionDate: formatDateForInput(initialData.sessionDate),
        notes: initialData.notes || '',
      });
    }
  }, [initialData, isEdit, setData]);

  useEffect(() => {
    // Only load initial data if:
    // 1. We have initial data
    // 2. No draft exists (or draft was just discarded)
    // 3. Form data is empty
    if (initialData && !hasDraft && isEdit) {
      const hasData = data.sessionType || data.sessionDate;
      if (!hasData) {
        loadInitialData();
      }
    }
  }, [initialData, hasDraft, isEdit, data.sessionType, data.sessionDate, loadInitialData]);

  const restoreDraft = () => {
    restoreDraftHook();
  };

  const discardDraft = () => {
    discardDraftHook();
    // Load initial data after discarding
    setTimeout(() => {
      loadInitialData();
    }, 100);
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
      newErrors.sessionType = 'Session type is required';
    }

    if (!data.sessionDate) {
      newErrors.sessionDate = 'Session date is required';
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
      const sessionData = {
        sessionType: data.sessionType.trim(),
        sessionDate: data.sessionDate,
        notes: data.notes?.trim() || '',
      };

      if (isEdit) {
        await updateSession(patientId, sessionId, sessionData);
        success('Session updated successfully');
      } else {
        await createSession(patientId, sessionData);
        success('Session created successfully');
      }
      
      // Clear draft on success
      clearDraftData();
      
      setTimeout(() => {
        navigate(`/clinic/patients/${patientId}`);
      }, 500);
    } catch (err) {
      showError(`Failed to ${isEdit ? 'update' : 'create'} session. Please try again.`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasDraft) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
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
        <div className="loading-spinner">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="session-form-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {showRestoreDialog && (
        <DraftRestoreDialog
          onRestore={restoreDraft}
          onDiscard={discardDraft}
        />
      )}

      <div className="session-form-header">
        <h1>{isEdit ? 'Edit Session' : 'Add Session'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="session-form">
        <div className="form-group">
          <label htmlFor="sessionType">
            Session Type <span className="required">*</span>
          </label>
          <EditableSelect
            value={data.sessionType}
            onChange={(value) => handleChange('sessionType', value)}
            options={DEFAULT_SESSION_TYPES}
            placeholder="Select or type session type..."
            className={errors.sessionType ? 'error' : ''}
          />
          {errors.sessionType && <span className="error-message">{errors.sessionType}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="sessionDate">
            Session Date <span className="required">*</span>
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
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={data.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows="5"
            placeholder="Optional session notes..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Session'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionForm;

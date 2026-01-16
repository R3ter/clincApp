import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatient, updatePatient } from '../services/realtimeDbService';
import { validateIsraeliId, formatIsraeliId, cleanIsraeliId } from '../utils/israeliIdValidation';
import { calculateAge, formatDateForInput } from '../utils/dateUtils';
import { useDraft } from '../hooks/useDraft';
import { DraftKeys } from '../utils/draftManager';
import { useToast } from '../hooks/useToast';
import DraftRestoreDialog from '../components/DraftRestoreDialog';
import ToastContainer from '../components/ToastContainer';
import './PatientForm.css';

const PatientEdit = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toasts, removeToast, success, error: showError } = useToast();
  
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const {
    data,
    setData,
    hasDraft,
    showRestoreDialog,
    restoreDraft: restoreDraftHook,
    discardDraft: discardDraftHook,
    clearDraftData,
  } = useDraft(DraftKeys.PATIENT_EDIT(patientId), {});

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const loadInitialData = useCallback(() => {
    if (initialData) {
      setData({
        fullName: initialData.fullName || '',
        israelId: initialData.israelId || '',
        birthDate: formatDateForInput(initialData.birthDate),
        gender: initialData.gender || '',
        diagnosis: initialData.diagnosis || '',
        therapyName: initialData.therapyName || '',
        totalSessionsPlanned: initialData.totalSessionsPlanned || '',
      });
    }
  }, [initialData, setData]);

  useEffect(() => {
    // Only load initial data if:
    // 1. We have initial data
    // 2. No draft exists (or draft was just discarded)
    // 3. Form data is empty
    if (initialData && !hasDraft) {
      const hasData = data.fullName || data.israelId || data.birthDate;
      if (!hasData) {
        loadInitialData();
      }
    }
  }, [initialData, hasDraft, data.fullName, data.israelId, data.birthDate, loadInitialData]);

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

  const loadPatient = async () => {
    try {
      setLoading(true);
      const patient = await getPatient(patientId);
      setInitialData(patient);
    } catch (err) {
      showError('Failed to load patient. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleIsraeliIdChange = (value) => {
    // Allow free typing - just clean non-digits and limit to 9
    const cleaned = cleanIsraeliId(value);
    handleChange('israelId', cleaned);
    // Clear error when user starts typing again
    if (errors.israelId) {
      setErrors(prev => ({ ...prev, israelId: null }));
    }
  };

  const handleIsraeliIdBlur = () => {
    // Format to 9 digits with padding on blur
    if (data.israelId) {
      const formatted = formatIsraeliId(data.israelId);
      handleChange('israelId', formatted);
      
      // Validate after formatting
      if (formatted.length === 9) {
        if (!validateIsraeliId(formatted)) {
          setErrors(prev => ({ ...prev, israelId: 'Invalid ID number' }));
        }
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!data.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!data.israelId?.trim()) {
      newErrors.israelId = 'ID is required';
    } else {
      const formatted = formatIsraeliId(data.israelId);
      if (formatted.length !== 9) {
        newErrors.israelId = 'ID must be 9 digits';
      } else if (!validateIsraeliId(formatted)) {
        newErrors.israelId = 'Invalid ID number';
      }
    }

    if (!data.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    }

    if (!data.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!data.therapyName?.trim()) {
      newErrors.therapyName = 'Therapy name is required';
    }

    if (!data.totalSessionsPlanned || data.totalSessionsPlanned < 1) {
      newErrors.totalSessionsPlanned = 'Total sessions planned must be at least 1';
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
      // Format Israeli ID before saving
      const formattedId = formatIsraeliId(data.israelId);
      
      const updateData = {
        fullName: data.fullName.trim(),
        israelId: formattedId,
        birthDate: data.birthDate,
        gender: data.gender,
        diagnosis: data.diagnosis?.trim() || '',
        therapyName: data.therapyName.trim(),
        totalSessionsPlanned: parseInt(data.totalSessionsPlanned, 10),
      };

      await updatePatient(patientId, updateData);
      
      // Clear draft on success
      clearDraftData();
      
      success('Patient updated successfully');
      setTimeout(() => {
        navigate(`/clinic/patients/${patientId}`);
      }, 500);
    } catch (err) {
      showError('Failed to update patient. Please try again.');
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
      <div className="patient-form-container">
        <div className="loading-spinner">Loading patient...</div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="patient-form-container">
        <div className="error-state">Patient not found</div>
      </div>
    );
  }

  const age = data.birthDate ? calculateAge(data.birthDate) : null;

  return (
    <div className="patient-form-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {showRestoreDialog && (
        <DraftRestoreDialog
          onRestore={restoreDraft}
          onDiscard={discardDraft}
        />
      )}

      <div className="patient-form-header">
        <h1>Edit Patient</h1>
      </div>

      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-section">
          <h2>Patient Information</h2>
          
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={data.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="israelId">
              ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="israelId"
              value={data.israelId || ''}
              onChange={(e) => handleIsraeliIdChange(e.target.value)}
              onBlur={handleIsraeliIdBlur}
              className={errors.israelId ? 'error' : ''}
              placeholder="123456789"
            />
            {errors.israelId && <span className="error-message">{errors.israelId}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birthDate">
                Birth Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="birthDate"
                value={data.birthDate || ''}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                className={errors.birthDate ? 'error' : ''}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="text"
                value={age !== null ? `${age} years` : ''}
                disabled
                className="disabled-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gender">
              Gender <span className="required">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={data.gender === 'male'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                />
                <span>Male</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={data.gender === 'female'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                />
                <span>Female</span>
              </label>
            </div>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="diagnosis">Diagnosis</label>
            <textarea
              id="diagnosis"
              value={data.diagnosis || ''}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="therapyName">
              Therapy Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="therapyName"
              value={data.therapyName || ''}
              onChange={(e) => handleChange('therapyName', e.target.value)}
              className={errors.therapyName ? 'error' : ''}
            />
            {errors.therapyName && <span className="error-message">{errors.therapyName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="totalSessionsPlanned">
              Total Sessions Planned <span className="required">*</span>
            </label>
            <input
              type="number"
              id="totalSessionsPlanned"
              value={data.totalSessionsPlanned || ''}
              onChange={(e) => handleChange('totalSessionsPlanned', e.target.value)}
              min="1"
              className={errors.totalSessionsPlanned ? 'error' : ''}
            />
            {errors.totalSessionsPlanned && (
              <span className="error-message">{errors.totalSessionsPlanned}</span>
            )}
          </div>
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
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientEdit;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatient, updatePatient } from '../services/realtimeDbService';
import { validateIsraeliId, formatIsraeliId, cleanIsraeliId } from '../utils/israeliIdValidation';
import { calculateAge, formatDateForInput } from '../utils/dateUtils';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import { DIAGNOSIS_TYPES } from '../config/diagnosisTypes';
import { INSURANCE_TYPES } from '../config/insuranceTypes';
import { getDiagnosisObject, getDiagnosisKeyFromValue, getDiagnosisKeyFromObject } from '../utils/diagnosisUtils';
import { getInsuranceObject, getInsuranceKeyFromObject } from '../utils/insuranceUtils';
import EditableSelect from '../components/EditableSelect';
import ToastContainer from '../components/ToastContainer';
import LoadingSpinner from '../components/LoadingSpinner';
import './PatientForm.css';

const PatientEdit = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toasts, removeToast, success, error: showError } = useToast();
  
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [data, setData] = useState({
    fullName: '',
    israelId: '',
    birthDate: '',
    gender: '',
    diagnosis: '',
    diagnosisOther: '',
    insurance: '',
    therapyName: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const loadInitialData = useCallback(() => {
    if (initialData) {
      // Handle diagnosis - could be object {en, ar} or string (for backward compatibility)
      const { key, customText } = getDiagnosisKeyFromObject(initialData.diagnosis, t);
      
      setData({
        fullName: initialData.fullName || '',
        israelId: initialData.israelId || '',
        birthDate: formatDateForInput(initialData.birthDate),
        gender: initialData.gender || '',
        diagnosis: key,
        diagnosisOther: customText,
        insurance: getInsuranceKeyFromObject(initialData.insurance, t) || '',
        therapyName: initialData.therapyName || '',
      });
    }
  }, [initialData, setData, t]);

  useEffect(() => {
    // Load initial data when it's available and form is empty
    if (initialData) {
      const hasData = data.fullName || data.israelId || data.birthDate;
      if (!hasData) {
        loadInitialData();
      }
    }
  }, [initialData, data.fullName, data.israelId, data.birthDate, loadInitialData]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const patient = await getPatient(patientId);
      setInitialData(patient);
    } catch (err) {
      showError(t('patient.failedLoad'));
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
          setErrors(prev => ({ ...prev, israelId: t('patient.invalidIdNumber') }));
        }
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!data.fullName?.trim()) {
      newErrors.fullName = t('patient.fullNameRequired');
    }

    if (!data.israelId?.trim()) {
      newErrors.israelId = t('patient.idRequired');
    } else {
      const formatted = formatIsraeliId(data.israelId);
      if (formatted.length !== 9) {
        newErrors.israelId = t('patient.idMustBe9Digits');
      } else if (!validateIsraeliId(formatted)) {
        newErrors.israelId = t('patient.invalidIdNumber');
      }
    }

    if (!data.birthDate) {
      newErrors.birthDate = t('patient.birthDateRequired');
    }

    if (!data.gender) {
      newErrors.gender = t('patient.genderRequired');
    }

    if (!data.insurance?.trim()) {
      newErrors.insurance = t('patient.insuranceRequired');
    }

    if (!data.therapyName?.trim()) {
      newErrors.therapyName = t('patient.therapyNameRequired');
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
      
      // Convert diagnosis to object with en/ar translations
      const diagnosisKey = getDiagnosisKeyFromValue(data.diagnosis, t) || data.diagnosis;
      const otherTranslation = t('diagnosisTypes.Other', 'Other');
      const isOther = (data.diagnosis === 'Other' || data.diagnosis === otherTranslation);
      const diagnosisObject = getDiagnosisObject(diagnosisKey, isOther ? data.diagnosisOther?.trim() : '');

      // Convert insurance to object with en/ar translations
      const insuranceObject = getInsuranceObject(data.insurance?.trim() || '');

      const updateData = {
        fullName: data.fullName.trim(),
        israelId: formattedId,
        birthDate: data.birthDate,
        gender: data.gender,
        diagnosis: diagnosisObject,
        insurance: insuranceObject,
        therapyName: data.therapyName.trim(),
      };

      await updatePatient(patientId, updateData);
      
      success(t('patient.patientUpdated'));
      setTimeout(() => {
        navigate(`/clinic/patients/${patientId}`);
      }, 500);
    } catch (err) {
      showError(t('patient.failedUpdate'));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/clinic/patients/${patientId}`);
  };

  if (loading) {
    return (
      <div className="patient-form-container">
        <LoadingSpinner message={t('patient.loadingPatient')} size="large" />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="patient-form-container">
        <div className="error-state">{t('patient.patientNotFound')}</div>
      </div>
    );
  }

  const age = data.birthDate ? calculateAge(data.birthDate) : null;

  return (
    <div className="patient-form-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="patient-form-header">
        <h1>{t('patient.editPatient')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-section">
          <h2>{t('patient.patientInformation')}</h2>
          
          <div className="form-group">
            <label htmlFor="fullName">
              {t('patient.fullName')} <span className="required">{t('common.required')}</span>
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
              {t('patient.id')} <span className="required">{t('common.required')}</span>
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
                {t('patient.birthDate')} <span className="required">{t('common.required')}</span>
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
              <label>{t('patient.age')}</label>
              <input
                type="text"
                value={age !== null 
                  ? `${age.years} ${t('common.years')} ${age.months > 0 ? `${age.months} ${t('common.months')}` : ''}`.trim()
                  : ''}
                disabled
                className="disabled-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gender">
              {t('patient.gender')} <span className="required">{t('common.required')}</span>
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
                <span>{t('patient.male')}</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={data.gender === 'female'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                />
                <span>{t('patient.female')}</span>
              </label>
            </div>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="diagnosis">
              {t('patient.diagnosis')} <span className="required">{t('common.required')}</span>
            </label>
            <EditableSelect
              value={data.diagnosis}
              onChange={(value) => handleChange('diagnosis', value)}
              options={DIAGNOSIS_TYPES.map(type => t(`diagnosisTypes.${type}`, type))}
              placeholder={t('patient.diagnosis')}
              className={errors.diagnosis ? 'error' : ''}
            />
            {(data.diagnosis === 'Other' || data.diagnosis === t('diagnosisTypes.Other', 'Other')) && (
              <div style={{ marginTop: '12px' }}>
                <input
                  type="text"
                  id="diagnosisOther"
                  value={data.diagnosisOther || ''}
                  onChange={(e) => handleChange('diagnosisOther', e.target.value)}
                  placeholder={t('patient.diagnosisOther')}
                  className={errors.diagnosisOther ? 'error' : ''}
                  style={{ width: '100%', padding: '12px 16px', border: errors.diagnosisOther ? '2px solid var(--error)' : '2px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'inherit', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                />
                {errors.diagnosisOther && <span className="error-message" style={{ display: 'block', marginTop: '6px' }}>{errors.diagnosisOther}</span>}
              </div>
            )}
            {errors.diagnosis && <span className="error-message">{errors.diagnosis}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="insurance">
              {t('patient.insurance')} <span className="required">{t('common.required')}</span>
            </label>
            <EditableSelect
              value={data.insurance}
              onChange={(value) => handleChange('insurance', value)}
              options={INSURANCE_TYPES.map(type => t(`insuranceTypes.${type}`, type))}
              placeholder={t('patient.insurance')}
              className={errors.insurance ? 'error' : ''}
            />
            {errors.insurance && <span className="error-message">{errors.insurance}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="therapyName">
              {t('patient.therapyName')} <span className="required">{t('common.required')}</span>
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
            {submitting ? t('patient.saving') : t('patient.saveChanges')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientEdit;

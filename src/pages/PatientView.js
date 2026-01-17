import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatient, subscribeSessions, deletePatient, deleteSession } from '../services/realtimeDbService';
import { formatDate, calculateAge } from '../utils/dateUtils';
import { getDiagnosisDisplayText } from '../utils/diagnosisUtils';
import { getSessionTypeDisplayText } from '../utils/sessionTypesUtils';
import { getInsuranceDisplayText } from '../utils/insuranceUtils';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import ToastContainer from '../components/ToastContainer';
import LoadingSpinner from '../components/LoadingSpinner';
import './PatientView.css';

const PatientView = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [patient, setPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, removeToast, success, error: showError } = useToast();

  // Load patient data (one-time)
  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        const patientData = await getPatient(patientId);
        setPatient(patientData);
      } catch (err) {
        showError(t('patientView.failedLoadData'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPatient();
  }, [patientId, showError, t]);

  // Subscribe to real-time session updates
  useEffect(() => {
    if (!patientId) return;
    
    const unsubscribe = subscribeSessions(patientId, (sessionsData) => {
      setSessions(sessionsData);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [patientId]);

  const handleEditPatient = () => {
    navigate(`/clinic/patients/${patientId}/edit`);
  };

  const handleAddSession = () => {
    navigate(`/clinic/patients/${patientId}/sessions/new`);
  };

  const handleEditSession = (sessionId) => {
    navigate(`/clinic/patients/${patientId}/sessions/${sessionId}/edit`);
  };

  const handleDeletePatient = async () => {
    const confirmMessage = `${t('patientView.confirmDeletePatient')}\n${t('common.thisActionCannotBeUndone')}`;
    if (window.confirm(confirmMessage)) {
      try {
        await deletePatient(patientId);
        success(t('patient.patientDeleted'));
        setTimeout(() => {
          navigate('/clinic/patients');
        }, 500);
      } catch (err) {
        showError(t('patient.failedDelete'));
        console.error(err);
      }
    }
  };

  const handleDeleteSession = async (sessionId) => {
    const confirmMessage = `${t('patientView.confirmDeleteSession')}\n${t('common.thisActionCannotBeUndone')}`;
    if (window.confirm(confirmMessage)) {
      try {
        await deleteSession(patientId, sessionId);
        success(t('session.sessionDeleted'));
        // No need to reload - real-time listener will update automatically
      } catch (err) {
        showError(t('session.failedDelete'));
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="patient-view-container">
        <LoadingSpinner message={t('patientView.loadingPatientData')} size="large" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="patient-view-container">
        <div className="error-state">{t('patient.patientNotFound')}</div>
      </div>
    );
  }

  const age = calculateAge(patient.birthDate);

  return (
    <div className="patient-view-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="patient-view-header">
        <div>
          <button
            className="btn btn-link"
            onClick={() => navigate('/clinic/patients')}
          >
            {t('patientView.backToPatients')}
          </button>
          <h1>{patient.fullName}</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn btn-primary"
            onClick={handleEditPatient}
          >
            {t('patientView.editPatient')}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleDeletePatient}
            style={{ backgroundColor: 'var(--error)', color: 'white', border: 'none' }}
          >
            {t('common.delete')}
          </button>
        </div>
      </div>

      <div className="patient-summary-card">
        <h2>{t('patient.patientInformation')}</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <label>{t('patient.fullName')}</label>
            <div>{patient.fullName}</div>
          </div>
          <div className="summary-item">
            <label>{t('patient.id')}</label>
            <div>{patient.israelId}</div>
          </div>
          <div className="summary-item">
            <label>{t('patient.gender')}</label>
            <div>{patient.gender === 'male' ? t('patient.male') : patient.gender === 'female' ? t('patient.female') : '-'}</div>
          </div>
          <div className="summary-item">
            <label>{t('patient.age')}</label>
            <div>{age !== null 
              ? `${age.years} ${t('common.years')} ${age.months > 0 ? `${age.months} ${t('common.months')}` : ''}`.trim()
              : '-'}</div>
          </div>
          <div className="summary-item">
            <label>{t('patient.birthDate')}</label>
            <div>{formatDate(patient.birthDate)}</div>
          </div>
          <div className="summary-item">
            <label>{t('patient.diagnosis')}</label>
            <div>{getDiagnosisDisplayText(patient.diagnosis, language) || '-'}</div>
          </div>
          <div className="summary-item">
            <label>{t('patient.insurance')}</label>
            <div>{getInsuranceDisplayText(patient.insurance, language) || '-'}</div>
          </div>
          <div className="summary-item">
            <label>{t('patient.therapyName')}</label>
            <div>{patient.therapyName || '-'}</div>
          </div>
        </div>
      </div>

      <div className="sessions-section">
        <div className="sessions-header">
          <h2>{t('patientView.sessions')}</h2>
          <button
            className="btn btn-primary"
            onClick={handleAddSession}
          >
            {t('patientView.addSession')}
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="empty-state">
            <p>{t('patientView.noSessions')}</p>
            <button
              className="btn btn-primary"
              onClick={handleAddSession}
            >
              {t('patientView.addSession')}
            </button>
          </div>
        ) : (
          <div className="sessions-table-container">
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>{t('patientView.date')}</th>
                  <th>{t('patientView.type')}</th>
                  <th>{t('patient.notes')}</th>
                  <th>{t('patientView.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session.id}>
                    <td>{formatDate(session.sessionDate)}</td>
                    <td>{getSessionTypeDisplayText(session.sessionType, language) || '-'}</td>
                    <td className="notes-cell">
                      {session.notes ? (
                        session.notes.length > 50
                          ? `${session.notes.substring(0, 50)}...`
                          : session.notes
                      ) : '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-link"
                          onClick={() => handleEditSession(session.id)}
                        >
                          {t('common.edit')}
                        </button>
                        <button
                          className="btn btn-link"
                          onClick={() => handleDeleteSession(session.id)}
                          style={{ color: 'var(--error)' }}
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientView;

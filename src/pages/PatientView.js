import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatient, listSessions } from '../services/realtimeDbService';
import { formatDate, calculateAge } from '../utils/dateUtils';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import ToastContainer from '../components/ToastContainer';
import './PatientView.css';

const PatientView = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [patient, setPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, removeToast, error: showError } = useToast();

  const loadPatientData = useCallback(async () => {
    try {
      setLoading(true);
      const [patientData, sessionsData] = await Promise.all([
        getPatient(patientId),
        listSessions(patientId),
      ]);
      setPatient(patientData);
      setSessions(sessionsData);
    } catch (err) {
      showError(t('patientView.failedLoadData'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [patientId, showError, t]);

  useEffect(() => {
    loadPatientData();
  }, [loadPatientData]);

  const handleEditPatient = () => {
    navigate(`/clinic/patients/${patientId}/edit`);
  };

  const handleAddSession = () => {
    navigate(`/clinic/patients/${patientId}/sessions/new`);
  };

  const handleEditSession = (sessionId) => {
    navigate(`/clinic/patients/${patientId}/sessions/${sessionId}/edit`);
  };

  if (loading) {
    return (
      <div className="patient-view-container">
        <div className="loading-spinner">{t('patientView.loadingPatientData')}</div>
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
        <button
          className="btn btn-primary"
          onClick={handleEditPatient}
        >
          {t('patientView.editPatient')}
        </button>
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
            <div>{patient.diagnosis || '-'}</div>
          </div>
          <div className="summary-item">
            <label>{t('patient.insurance')}</label>
            <div>{patient.insurance || '-'}</div>
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
                    <td>{session.sessionType || '-'}</td>
                    <td className="notes-cell">
                      {session.notes ? (
                        session.notes.length > 50
                          ? `${session.notes.substring(0, 50)}...`
                          : session.notes
                      ) : '-'}
                    </td>
                    <td>
                      <button
                        className="btn btn-link"
                        onClick={() => handleEditSession(session.id)}
                      >
                        {t('common.edit')}
                      </button>
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

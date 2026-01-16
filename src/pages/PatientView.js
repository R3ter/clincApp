import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatient, listSessions } from '../services/realtimeDbService';
import { formatDate, calculateAge } from '../utils/dateUtils';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import './PatientView.css';

const PatientView = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
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
      showError('Failed to load patient data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [patientId, showError]);

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
        <div className="loading-spinner">Loading patient data...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="patient-view-container">
        <div className="error-state">Patient not found</div>
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
            ← Back to Patients
          </button>
          <h1>{patient.fullName}</h1>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleEditPatient}
        >
          Edit Patient
        </button>
      </div>

      <div className="patient-summary-card">
        <h2>Patient Information</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <label>Full Name</label>
            <div>{patient.fullName}</div>
          </div>
          <div className="summary-item">
            <label>ID</label>
            <div>{patient.israelId}</div>
          </div>
          <div className="summary-item">
            <label>Gender</label>
            <div>{patient.gender || '-'}</div>
          </div>
          <div className="summary-item">
            <label>Age</label>
            <div>{age !== null ? `${age} years` : '-'}</div>
          </div>
          <div className="summary-item">
            <label>Birth Date</label>
            <div>{formatDate(patient.birthDate)}</div>
          </div>
          <div className="summary-item">
            <label>Diagnosis</label>
            <div>{patient.diagnosis || '-'}</div>
          </div>
          <div className="summary-item">
            <label>Therapy Name</label>
            <div>{patient.therapyName || '-'}</div>
          </div>
          <div className="summary-item">
            <label>Total Sessions Planned</label>
            <div>{patient.totalSessionsPlanned || 0}</div>
          </div>
        </div>
      </div>

      <div className="sessions-section">
        <div className="sessions-header">
          <h2>Sessions</h2>
          <button
            className="btn btn-primary"
            onClick={handleAddSession}
          >
            Add Session
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="empty-state">
            <p>No sessions yet.</p>
            <button
              className="btn btn-primary"
              onClick={handleAddSession}
            >
              Add Session
            </button>
          </div>
        ) : (
          <div className="sessions-table-container">
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Notes</th>
                  <th>Actions</th>
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
                        Edit
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

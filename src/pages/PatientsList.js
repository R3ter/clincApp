import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPatients } from '../services/realtimeDbService';
import { formatDate, calculateAge } from '../utils/dateUtils';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import './PatientsList.css';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const navigate = useNavigate();
  const { toasts, removeToast, error: showError } = useToast();

  const loadPatients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listPatients({ searchTerm: '', limitCount: 100 });
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      showError('Failed to load patients. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredPatients(
        patients.filter(patient => {
          const name = (patient.fullName || '').toLowerCase();
          const id = (patient.israelId || '').toLowerCase();
          return name.includes(term) || id.includes(term);
        })
      );
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients]);

  const handleView = (patientId) => {
    navigate(`/clinic/patients/${patientId}`);
  };

  const handleEdit = (patientId) => {
    navigate(`/clinic/patients/${patientId}/edit`);
  };

  if (loading) {
    return (
      <div className="patients-list-container">
        <div className="loading-spinner">Loading patients...</div>
      </div>
    );
  }

  return (
    <div className="patients-list-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="patients-list-header">
        <h1>Patients</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/clinic/patients/new')}
        >
          Add Patient
        </button>
      </div>

      <div className="patients-list-search">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? 'No patients found matching your search.' : 'No patients yet.'}</p>
          {!searchTerm && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/clinic/patients/new')}
            >
              Add Patient
            </button>
          )}
        </div>
      ) : (
        <div className="patients-table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Birth Date</th>
                <th>Diagnosis</th>
                <th>Therapy</th>
                <th>Sessions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => {
                const age = calculateAge(patient.birthDate);
                return (
                  <tr key={patient.id}>
                    <td>{patient.fullName}</td>
                    <td>{patient.israelId}</td>
                    <td>{patient.gender || '-'}</td>
                    <td>{age !== null ? `${age} years` : '-'}</td>
                    <td>{formatDate(patient.birthDate)}</td>
                    <td className="diagnosis-cell">
                      {patient.diagnosis ? (
                        patient.diagnosis.length > 30
                          ? `${patient.diagnosis.substring(0, 30)}...`
                          : patient.diagnosis
                      ) : '-'}
                    </td>
                    <td>{patient.therapyName || '-'}</td>
                    <td>{patient.totalSessionsPlanned || 0}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-link"
                          onClick={() => handleView(patient.id)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-link"
                          onClick={() => handleEdit(patient.id)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientsList;

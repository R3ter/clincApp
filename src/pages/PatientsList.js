import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPatients, listSessions } from '../services/realtimeDbService';
import { formatDate, calculateAge } from '../utils/dateUtils';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import ToastContainer from '../components/ToastContainer';
import './PatientsList.css';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [patientsWithSessionCounts, setPatientsWithSessionCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toasts, removeToast, error: showError } = useToast();

  const loadPatients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listPatients({ searchTerm: '', limitCount: 100 });
      setPatients(data);
      
      // Fetch session counts for all patients
      const patientsWithCounts = await Promise.all(
        data.map(async (patient) => {
          try {
            const sessions = await listSessions(patient.id);
            return {
              ...patient,
              sessionCount: sessions.length,
            };
          } catch (err) {
            console.error(`Error loading sessions for patient ${patient.id}:`, err);
            return {
              ...patient,
              sessionCount: 0,
            };
          }
        })
      );
      
      setPatientsWithSessionCounts(patientsWithCounts);
      setFilteredPatients(patientsWithCounts);
    } catch (err) {
      showError(t('patientsList.failedLoad'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [showError, t]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredPatients(
        patientsWithSessionCounts.filter(patient => {
          const name = (patient.fullName || '').toLowerCase();
          const id = (patient.israelId || '').toLowerCase();
          return name.includes(term) || id.includes(term);
        })
      );
    } else {
      setFilteredPatients(patientsWithSessionCounts);
    }
  }, [searchTerm, patientsWithSessionCounts]);

  const handleView = (patientId) => {
    navigate(`/clinic/patients/${patientId}`);
  };

  const handleEdit = (patientId) => {
    navigate(`/clinic/patients/${patientId}/edit`);
  };

  if (loading) {
    return (
      <div className="patients-list-container">
        <div className="loading-spinner">{t('patientsList.loadingPatients')}</div>
      </div>
    );
  }

  return (
    <div className="patients-list-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="patients-list-header">
        <h1>{t('patientsList.patients')}</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/clinic/patients/new')}
        >
          {t('patientsList.addPatient')}
        </button>
      </div>

      <div className="patients-list-search">
        <input
          type="text"
          placeholder={t('patientsList.searchByNameOrId')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? t('patientsList.noPatientsFound') : t('patientsList.noPatientsYet')}</p>
          {!searchTerm && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/clinic/patients/new')}
            >
              {t('patientsList.addPatient')}
            </button>
          )}
        </div>
      ) : (
        <div className="patients-table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>{t('patientsList.name')}</th>
                <th>{t('patient.id')}</th>
                <th>{t('patientsList.gender')}</th>
                <th>{t('patient.age')}</th>
                <th>{t('patientsList.birthDate')}</th>
                <th>{t('patient.diagnosis')}</th>
                <th>{t('patientsList.therapy')}</th>
                <th>{t('patientsList.sessions')}</th>
                <th>{t('patientView.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => {
                const age = calculateAge(patient.birthDate);
                return (
                  <tr key={patient.id}>
                    <td>{patient.fullName}</td>
                    <td>{patient.israelId}</td>
                    <td>{patient.gender === 'male' ? t('patient.male') : patient.gender === 'female' ? t('patient.female') : '-'}</td>
                    <td>{age !== null 
                      ? `${age.years} ${t('common.years')} ${age.months > 0 ? `${age.months} ${t('common.months')}` : ''}`.trim()
                      : '-'}</td>
                    <td>{formatDate(patient.birthDate)}</td>
                    <td className="diagnosis-cell">
                      {patient.diagnosis ? (
                        patient.diagnosis.length > 30
                          ? `${patient.diagnosis.substring(0, 30)}...`
                          : patient.diagnosis
                      ) : '-'}
                    </td>
                    <td>{patient.therapyName || '-'}</td>
                    <td>{patient.sessionCount || 0}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-link"
                          onClick={() => handleView(patient.id)}
                        >
                          {t('common.view')}
                        </button>
                        <button
                          className="btn btn-link"
                          onClick={() => handleEdit(patient.id)}
                        >
                          {t('common.edit')}
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribePatients, deletePatient } from '../services/realtimeDbService';
import { formatDate, calculateAge } from '../utils/dateUtils';
import { getDiagnosisDisplayText } from '../utils/diagnosisUtils';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import ToastContainer from '../components/ToastContainer';
import TableSkeleton from '../components/TableSkeleton';
import './PatientsList.css';

const PatientsList = () => {
  const [patientsWithSessionCounts, setPatientsWithSessionCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toasts, removeToast, success, error: showError } = useToast();

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to real-time patient updates
    const unsubscribe = subscribePatients(
      (patients) => {
        setPatientsWithSessionCounts(patients);
        setFilteredPatients(patients);
        setLoading(false);
      },
      { searchTerm: '', limitCount: 100 }
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

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

  const handleDelete = async (patientId, patientName) => {
    const confirmMessage = `${t('patientView.confirmDeletePatient')}\n${t('common.thisActionCannotBeUndone')}`;
    if (window.confirm(confirmMessage)) {
      try {
        await deletePatient(patientId);
        success(t('patient.patientDeleted'));
        // No need to reload - real-time listener will update automatically
      } catch (err) {
        showError(t('patient.failedDelete'));
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="patients-list-container">
        <div className="patients-list-header">
          <h1>{t('patientsList.patients')}</h1>
        </div>
        <TableSkeleton rows={8} columns={9} />
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
                      {(() => {
                        const diagnosisText = getDiagnosisDisplayText(patient.diagnosis, language);
                        return diagnosisText ? (
                          diagnosisText.length > 30
                            ? `${diagnosisText.substring(0, 30)}...`
                            : diagnosisText
                        ) : '-';
                      })()}
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
                        <button
                          className="btn btn-link"
                          onClick={() => handleDelete(patient.id, patient.fullName)}
                          style={{ color: 'var(--error)' }}
                        >
                          {t('common.delete')}
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

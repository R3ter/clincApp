import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeAllSessions, deleteSession } from '../services/realtimeDbService';
import { formatDate } from '../utils/dateUtils';
import { getSessionTypeDisplayText } from '../utils/sessionTypesUtils';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import ToastContainer from '../components/ToastContainer';
import TableSkeleton from '../components/TableSkeleton';
import './SessionsList.css';

const SessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toasts, removeToast, success, error: showError } = useToast();

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to real-time session updates
    const unsubscribe = subscribeAllSessions((data) => {
      setSessions(data);
      setFilteredSessions(data);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredSessions(
        sessions.filter(session => {
          const patientName = (session.patientName || '').toLowerCase();
          const sessionType = getSessionTypeDisplayText(session.sessionType, language).toLowerCase();
          const notes = (session.notes || '').toLowerCase();
          const patientId = (session.patientIsraelId || '').toLowerCase();
          
          return (
            patientName.includes(term) ||
            sessionType.includes(term) ||
            notes.includes(term) ||
            patientId.includes(term)
          );
        })
      );
    } else {
      setFilteredSessions(sessions);
    }
  }, [searchTerm, sessions, language]);

  const handleViewPatient = (patientId) => {
    navigate(`/clinic/patients/${patientId}`);
  };

  const handleEditSession = (patientId, sessionId) => {
    navigate(`/clinic/patients/${patientId}/sessions/${sessionId}/edit`);
  };

  const handleDeleteSession = async (patientId, sessionId) => {
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
      <div className="sessions-list-container">
        <div className="sessions-list-header">
          <h1>{t('sessionsList.sessions')}</h1>
        </div>
        <TableSkeleton rows={8} columns={5} />
      </div>
    );
  }

  return (
    <div className="sessions-list-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="sessions-list-header">
        <h1>{t('sessionsList.sessions')}</h1>
      </div>

      <div className="sessions-list-search">
        <input
          type="text"
          className="search-input"
          placeholder={t('sessionsList.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredSessions.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? t('sessionsList.noSessionsFound') : t('sessionsList.noSessionsYet')}</p>
        </div>
      ) : (
        <div className="sessions-table-container">
          <table className="sessions-table">
            <thead>
              <tr>
                <th>{t('sessionsList.date')}</th>
                <th>{t('sessionsList.patient')}</th>
                <th>{t('sessionsList.type')}</th>
                <th>{t('sessionsList.notes')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map(session => (
                <tr key={`${session.patientId}-${session.id}`}>
                  <td>{formatDate(session.sessionDate)}</td>
                  <td>
                    <div className="patient-cell">
                      <div className="patient-name">{session.patientName || '-'}</div>
                      {session.patientIsraelId && (
                        <div className="patient-id">{session.patientIsraelId}</div>
                      )}
                    </div>
                  </td>
                  <td>{getSessionTypeDisplayText(session.sessionType, language) || '-'}</td>
                  <td className="notes-cell">
                    {session.notes ? (
                      session.notes.length > 50
                        ? `${session.notes.substring(0, 50)}...`
                        : session.notes
                    ) : '-'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewPatient(session.patientId)}
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                      >
                        {t('sessionsList.viewPatient')}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEditSession(session.patientId, session.id)}
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleDeleteSession(session.patientId, session.id)}
                        style={{ 
                          padding: '8px 16px', 
                          fontSize: '13px',
                          background: 'var(--error)',
                          color: 'white'
                        }}
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
  );
};

export default SessionsList;

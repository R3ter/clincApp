import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const PATIENTS_COLLECTION = 'patients';
const SESSIONS_SUBCOLLECTION = 'sessions';

/**
 * List all patients with optional search
 * @param {object} options - Query options
 * @param {string} options.searchTerm - Search term for name or ID
 * @param {number} options.limitCount - Limit number of results
 * @returns {Promise<Array>} - Array of patient documents
 */
export const listPatients = async ({ searchTerm = '', limitCount = 100 } = {}) => {
  try {
    const patientsRef = collection(db, PATIENTS_COLLECTION);
    let q = query(patientsRef, orderBy('createdAt', 'desc'), limit(limitCount));
    
    const snapshot = await getDocs(q);
    let patients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Client-side filtering for search (Firestore doesn't support full-text search easily)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      patients = patients.filter(patient => {
        const name = (patient.fullName || '').toLowerCase();
        const id = (patient.israelId || '').toLowerCase();
        return name.includes(term) || id.includes(term);
      });
    }
    
    return patients;
  } catch (error) {
    console.error('Error listing patients:', error);
    throw error;
  }
};

/**
 * Get a single patient by ID
 * @param {string} patientId - Patient document ID
 * @returns {Promise<object>} - Patient document
 */
export const getPatient = async (patientId) => {
  try {
    const patientRef = doc(db, PATIENTS_COLLECTION, patientId);
    const patientSnap = await getDoc(patientRef);
    
    if (!patientSnap.exists()) {
      throw new Error('Patient not found');
    }
    
    return {
      id: patientSnap.id,
      ...patientSnap.data(),
    };
  } catch (error) {
    console.error('Error getting patient:', error);
    throw error;
  }
};

/**
 * Create a new patient with first session
 * @param {object} patientData - Patient data
 * @param {object} sessionData - First session data
 * @returns {Promise<object>} - Created patient with ID
 */
export const createPatientWithFirstSession = async (patientData, sessionData) => {
  try {
    // Create patient document
    const patientsRef = collection(db, PATIENTS_COLLECTION);
    const patientDoc = await addDoc(patientsRef, {
      ...patientData,
      birthDate: Timestamp.fromDate(new Date(patientData.birthDate)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Create first session
    if (sessionData) {
      const sessionsRef = collection(db, PATIENTS_COLLECTION, patientDoc.id, SESSIONS_SUBCOLLECTION);
      await addDoc(sessionsRef, {
        ...sessionData,
        sessionDate: Timestamp.fromDate(new Date(sessionData.sessionDate)),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    
    return {
      id: patientDoc.id,
      ...patientData,
    };
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

/**
 * Update patient document
 * @param {string} patientId - Patient document ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updatePatient = async (patientId, updates) => {
  try {
    const patientRef = doc(db, PATIENTS_COLLECTION, patientId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    
    // Convert birthDate if present
    if (updates.birthDate) {
      updateData.birthDate = Timestamp.fromDate(new Date(updates.birthDate));
    }
    
    await updateDoc(patientRef, updateData);
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

/**
 * List sessions for a patient
 * @param {string} patientId - Patient document ID
 * @returns {Promise<Array>} - Array of session documents
 */
export const listSessions = async (patientId) => {
  try {
    const sessionsRef = collection(db, PATIENTS_COLLECTION, patientId, SESSIONS_SUBCOLLECTION);
    const q = query(sessionsRef, orderBy('sessionDate', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error listing sessions:', error);
    throw error;
  }
};

/**
 * Create a new session for a patient
 * @param {string} patientId - Patient document ID
 * @param {object} sessionData - Session data
 * @returns {Promise<object>} - Created session with ID
 */
export const createSession = async (patientId, sessionData) => {
  try {
    const sessionsRef = collection(db, PATIENTS_COLLECTION, patientId, SESSIONS_SUBCOLLECTION);
    const sessionDoc = await addDoc(sessionsRef, {
      ...sessionData,
      sessionDate: Timestamp.fromDate(new Date(sessionData.sessionDate)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return {
      id: sessionDoc.id,
      ...sessionData,
    };
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

/**
 * Update a session
 * @param {string} patientId - Patient document ID
 * @param {string} sessionId - Session document ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateSession = async (patientId, sessionId, updates) => {
  try {
    const sessionRef = doc(db, PATIENTS_COLLECTION, patientId, SESSIONS_SUBCOLLECTION, sessionId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    
    // Convert sessionDate if present
    if (updates.sessionDate) {
      updateData.sessionDate = Timestamp.fromDate(new Date(updates.sessionDate));
    }
    
    await updateDoc(sessionRef, updateData);
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

/**
 * Get a single session
 * @param {string} patientId - Patient document ID
 * @param {string} sessionId - Session document ID
 * @returns {Promise<object>} - Session document
 */
export const getSession = async (patientId, sessionId) => {
  try {
    const sessionRef = doc(db, PATIENTS_COLLECTION, patientId, SESSIONS_SUBCOLLECTION, sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      throw new Error('Session not found');
    }
    
    return {
      id: sessionSnap.id,
      ...sessionSnap.data(),
    };
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
};

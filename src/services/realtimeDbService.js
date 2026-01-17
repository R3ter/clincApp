import { ref, get, set, update, push, remove, onValue } from "firebase/database";
import { db } from "../config/firebase";

const PATIENTS_PATH = "patients";
const SESSIONS_PATH = "sessions";
const ALL_SESSIONS_PATH = "allSessions"; // Flat index for all sessions across all patients

/**
 * List all patients with optional search
 * @param {object} options - Query options
 * @param {string} options.searchTerm - Search term for name or ID
 * @param {number} options.limitCount - Limit number of results
 * @returns {Promise<Array>} - Array of patient objects
 */
export const listPatients = async ({ searchTerm = "", limitCount = 100 } = {}) => {
  try {
    const patientsRef = ref(db, PATIENTS_PATH);
    const snapshot = await get(patientsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const patientsData = snapshot.val();
    let patients = Object.keys(patientsData).map((id) => ({
      id,
      ...patientsData[id],
    }));

    // Sort by createdAt (descending)
    patients.sort((a, b) => {
      const aTime = a.createdAt || 0;
      const bTime = b.createdAt || 0;
      return bTime - aTime;
    });

    // Client-side filtering for search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      patients = patients.filter((patient) => {
        const name = (patient.fullName || "").toLowerCase();
        const id = (patient.israelId || "").toLowerCase();
        return name.includes(term) || id.includes(term);
      });
    }

    // Limit results
    return patients.slice(0, limitCount);
  } catch (error) {
    console.error("Error listing patients:", error);
    throw error;
  }
};

/**
 * Get a single patient by ID
 * @param {string} patientId - Patient ID
 * @returns {Promise<object>} - Patient object
 */
export const getPatient = async (patientId) => {
  try {
    const patientRef = ref(db, `${PATIENTS_PATH}/${patientId}`);
    const snapshot = await get(patientRef);

    if (!snapshot.exists()) {
      throw new Error("Patient not found");
    }

    return {
      id: patientId,
      ...snapshot.val(),
    };
  } catch (error) {
    console.error("Error getting patient:", error);
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
    const patientsRef = ref(db, PATIENTS_PATH);
    const newPatientRef = push(patientsRef);
    const patientId = newPatientRef.key;

    const now = Date.now();
    const patientRecord = {
      ...patientData,
      birthDate: new Date(patientData.birthDate).getTime(),
      sessionCount: sessionData ? 1 : 0, // Initialize session count
      createdAt: now,
      updatedAt: now,
    };

    // Create patient
    await set(newPatientRef, patientRecord);

    // Create first session and add to flat index
    if (sessionData) {
      const sessionsRef = ref(db, `${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}`);
      const newSessionRef = push(sessionsRef);
      const sessionId = newSessionRef.key;

      const sessionRecord = {
        ...sessionData,
        sessionDate: new Date(sessionData.sessionDate).getTime(),
        createdAt: now,
        updatedAt: now,
      };

      // Create session in patient's sessions
      await set(newSessionRef, sessionRecord);

      // Also add to flat allSessions index with patient info
      const allSessionsRef = ref(db, `${ALL_SESSIONS_PATH}/${sessionId}`);
      await set(allSessionsRef, {
        ...sessionRecord,
        patientId,
        patientName: patientData.fullName || '',
        patientIsraelId: patientData.israelId || '',
      });
    }

    return {
      id: patientId,
      ...patientData,
    };
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
};

/**
 * Update patient
 * @param {string} patientId - Patient ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updatePatient = async (patientId, updates) => {
  try {
    const now = Date.now();
    const updateData = {
      ...updates,
      updatedAt: now,
    };

    // Convert birthDate if present
    if (updates.birthDate) {
      updateData.birthDate = new Date(updates.birthDate).getTime();
    }

    // Update patient
    const patientRef = ref(db, `${PATIENTS_PATH}/${patientId}`);
    await update(patientRef, updateData);

    // If patient name or ID changed, update allSessions index to keep denormalized data in sync
    if (updates.fullName || updates.israelId) {
      // Get all sessions for this patient to update the flat index
      const sessions = await listSessions(patientId);
      
      if (sessions.length > 0) {
        // Get current patient data to get the full updated info
        const patient = await getPatient(patientId);
        
        // Update all sessions in the flat index
        const sessionUpdates = {};
        sessions.forEach((session) => {
          if (updates.fullName) {
            sessionUpdates[`${ALL_SESSIONS_PATH}/${session.id}/patientName`] = patient.fullName || '';
          }
          if (updates.israelId) {
            sessionUpdates[`${ALL_SESSIONS_PATH}/${session.id}/patientIsraelId`] = patient.israelId || '';
          }
        });

        if (Object.keys(sessionUpdates).length > 0) {
          const rootRef = ref(db);
          await update(rootRef, sessionUpdates);
        }
      }
    }
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
};

/**
 * List sessions for a patient
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} - Array of session objects
 */
export const listSessions = async (patientId) => {
  try {
    const sessionsRef = ref(db, `${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}`);
    const snapshot = await get(sessionsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const sessionsData = snapshot.val();
    const sessions = Object.keys(sessionsData).map((id) => ({
      id,
      ...sessionsData[id],
    }));

    // Sort by sessionDate (descending)
    sessions.sort((a, b) => {
      const aTime = a.sessionDate || 0;
      const bTime = b.sessionDate || 0;
      return bTime - aTime;
    });

    return sessions;
  } catch (error) {
    console.error("Error listing sessions:", error);
    throw error;
  }
};

/**
 * List all sessions across all patients (using flat allSessions index)
 * @returns {Promise<Array>} - Array of session objects with patientId and patient info
 */
export const listAllSessions = async () => {
  try {
    const allSessionsRef = ref(db, ALL_SESSIONS_PATH);
    const snapshot = await get(allSessionsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const sessionsData = snapshot.val();
    const allSessions = Object.keys(sessionsData).map((id) => ({
      id,
      ...sessionsData[id],
    }));

    // Sort by sessionDate (descending)
    allSessions.sort((a, b) => {
      const aTime = a.sessionDate || 0;
      const bTime = b.sessionDate || 0;
      return bTime - aTime;
    });

    return allSessions;
  } catch (error) {
    console.error("Error listing all sessions:", error);
    throw error;
  }
};

/**
 * Create a new session for a patient
 * @param {string} patientId - Patient ID
 * @param {object} sessionData - Session data
 * @returns {Promise<object>} - Created session with ID
 */
export const createSession = async (patientId, sessionData) => {
  try {
    // First get patient data to include in flat index
    const patient = await getPatient(patientId);
    
    const sessionsRef = ref(db, `${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}`);
    const newSessionRef = push(sessionsRef);
    const sessionId = newSessionRef.key;

    const now = Date.now();
    const sessionRecord = {
      ...sessionData,
      sessionDate: new Date(sessionData.sessionDate).getTime(),
      createdAt: now,
      updatedAt: now,
    };

    // Create session in patient's sessions
    await set(newSessionRef, sessionRecord);

    // Add to flat allSessions index with patient info
    const allSessionsRef = ref(db, `${ALL_SESSIONS_PATH}/${sessionId}`);
    await set(allSessionsRef, {
      ...sessionRecord,
      patientId,
      patientName: patient.fullName || '',
      patientIsraelId: patient.israelId || '',
    });

    // Update patient's sessionCount
    const patientRef = ref(db, `${PATIENTS_PATH}/${patientId}`);
    const currentSessionCount = patient.sessionCount || 0;
    await update(patientRef, {
      sessionCount: currentSessionCount + 1,
      updatedAt: now,
    });

    return {
      id: sessionId,
      ...sessionData,
    };
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

/**
 * Update a session
 * @param {string} patientId - Patient ID
 * @param {string} sessionId - Session ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateSession = async (patientId, sessionId, updates) => {
  try {
    const now = Date.now();
    const updateData = {
      ...updates,
      updatedAt: now,
    };

    // Convert sessionDate if present
    if (updates.sessionDate) {
      updateData.sessionDate = new Date(updates.sessionDate).getTime();
    }

    // Update session in patient's sessions
    const sessionRef = ref(db, `${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}/${sessionId}`);
    await update(sessionRef, updateData);

    // Also update in flat allSessions index
    const allSessionsRef = ref(db, `${ALL_SESSIONS_PATH}/${sessionId}`);
    await update(allSessionsRef, updateData);
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
};

/**
 * Get a single session
 * @param {string} patientId - Patient ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<object>} - Session object
 */
export const getSession = async (patientId, sessionId) => {
  try {
    const sessionRef = ref(db, `${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}/${sessionId}`);
    const snapshot = await get(sessionRef);

    if (!snapshot.exists()) {
      throw new Error("Session not found");
    }

    return {
      id: sessionId,
      ...snapshot.val(),
    };
  } catch (error) {
    console.error("Error getting session:", error);
    throw error;
  }
};

/**
 * Delete a patient (and all their sessions)
 * @param {string} patientId - Patient ID
 * @returns {Promise<void>}
 */
export const deletePatient = async (patientId) => {
  try {
    // First get all sessions to remove from flat index
    const sessions = await listSessions(patientId);
    
    // Remove all sessions from flat index
    const updates = {};
    sessions.forEach(session => {
      updates[`${ALL_SESSIONS_PATH}/${session.id}`] = null;
    });

    // Remove patient (this will cascade delete sessions in patient's sessions path)
    const patientRef = ref(db, `${PATIENTS_PATH}/${patientId}`);
    
    // Perform updates atomically if there are sessions to remove
    if (sessions.length > 0) {
      updates[`${PATIENTS_PATH}/${patientId}`] = null;
      const rootRef = ref(db);
      await update(rootRef, updates);
    } else {
      await remove(patientRef);
    }
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
};

/**
 * Delete a session
 * @param {string} patientId - Patient ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<void>}
 */
export const deleteSession = async (patientId, sessionId) => {
  try {
    const now = Date.now();
    
    // Get patient to get current sessionCount
    const patient = await getPatient(patientId);
    const currentSessionCount = Math.max(0, (patient.sessionCount || 1) - 1);
    
    // Remove session from patient's sessions and flat index atomically
    const updates = {
      [`${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}/${sessionId}`]: null,
      [`${ALL_SESSIONS_PATH}/${sessionId}`]: null,
      [`${PATIENTS_PATH}/${patientId}/sessionCount`]: currentSessionCount,
      [`${PATIENTS_PATH}/${patientId}/updatedAt`]: now,
    };
    
    const rootRef = ref(db);
    await update(rootRef, updates);
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
};

/**
 * Subscribe to patients list changes (real-time)
 * @param {function} callback - Callback function that receives array of patients
 * @param {object} options - Query options
 * @param {string} options.searchTerm - Search term for name or ID
 * @param {number} options.limitCount - Limit number of results
 * @returns {function} - Unsubscribe function
 */
export const subscribePatients = (callback, { searchTerm = "", limitCount = 100 } = {}) => {
  const patientsRef = ref(db, PATIENTS_PATH);
  
  const unsubscribe = onValue(patientsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const patientsData = snapshot.val();
    let patients = Object.keys(patientsData).map((id) => ({
      id,
      ...patientsData[id],
    }));

    // Sort by createdAt (descending)
    patients.sort((a, b) => {
      const aTime = a.createdAt || 0;
      const bTime = b.createdAt || 0;
      return bTime - aTime;
    });

    // Client-side filtering for search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      patients = patients.filter((patient) => {
        const name = (patient.fullName || "").toLowerCase();
        const id = (patient.israelId || "").toLowerCase();
        return name.includes(term) || id.includes(term);
      });
    }

    // Limit results
    patients = patients.slice(0, limitCount);
    
    // Map to include sessionCount
    const patientsWithCounts = patients.map((patient) => ({
      ...patient,
      sessionCount: patient.sessionCount || 0,
    }));

    callback(patientsWithCounts);
  }, (error) => {
    console.error("Error in patients subscription:", error);
    callback([]);
  });

  return unsubscribe;
};

/**
 * Subscribe to all sessions list changes (real-time)
 * @param {function} callback - Callback function that receives array of sessions
 * @returns {function} - Unsubscribe function
 */
export const subscribeAllSessions = (callback) => {
  const allSessionsRef = ref(db, ALL_SESSIONS_PATH);
  
  const unsubscribe = onValue(allSessionsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const sessionsData = snapshot.val();
    const allSessions = Object.keys(sessionsData).map((id) => ({
      id,
      ...sessionsData[id],
    }));

    // Sort by sessionDate (descending)
    allSessions.sort((a, b) => {
      const aTime = a.sessionDate || 0;
      const bTime = b.sessionDate || 0;
      return bTime - aTime;
    });

    callback(allSessions);
  }, (error) => {
    console.error("Error in sessions subscription:", error);
    callback([]);
  });

  return unsubscribe;
};

/**
 * Subscribe to sessions for a specific patient (real-time)
 * @param {string} patientId - Patient ID
 * @param {function} callback - Callback function that receives array of sessions
 * @returns {function} - Unsubscribe function
 */
export const subscribeSessions = (patientId, callback) => {
  const sessionsRef = ref(db, `${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}`);
  
  const unsubscribe = onValue(sessionsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const sessionsData = snapshot.val();
    const sessions = Object.keys(sessionsData).map((id) => ({
      id,
      ...sessionsData[id],
    }));

    // Sort by sessionDate (descending)
    sessions.sort((a, b) => {
      const aTime = a.sessionDate || 0;
      const bTime = b.sessionDate || 0;
      return bTime - aTime;
    });

    callback(sessions);
  }, (error) => {
    console.error("Error in patient sessions subscription:", error);
    callback([]);
  });

  return unsubscribe;
};

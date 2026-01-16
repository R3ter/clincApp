import { ref, get, set, update, push, remove } from "firebase/database";
import { db } from "../config/firebase";

const PATIENTS_PATH = "patients";
const SESSIONS_PATH = "sessions";

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
      createdAt: now,
      updatedAt: now,
    };

    // Create patient
    await set(newPatientRef, patientRecord);

    // Create first session
    if (sessionData) {
      const sessionsRef = ref(db, `${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}`);
      const newSessionRef = push(sessionsRef);

      await set(newSessionRef, {
        ...sessionData,
        sessionDate: new Date(sessionData.sessionDate).getTime(),
        createdAt: now,
        updatedAt: now,
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
    const patientRef = ref(db, `${PATIENTS_PATH}/${patientId}`);
    const updateData = {
      ...updates,
      updatedAt: Date.now(),
    };

    // Convert birthDate if present
    if (updates.birthDate) {
      updateData.birthDate = new Date(updates.birthDate).getTime();
    }

    await update(patientRef, updateData);
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
 * List all sessions across all patients
 * @returns {Promise<Array>} - Array of session objects with patientId and patient info
 */
export const listAllSessions = async () => {
  try {
    const patientsRef = ref(db, PATIENTS_PATH);
    const snapshot = await get(patientsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const patientsData = snapshot.val();
    const allSessions = [];

    // Loop through all patients and get their sessions
    for (const patientId of Object.keys(patientsData)) {
      try {
        const patient = patientsData[patientId];
        const sessionsRef = ref(db, `${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}`);
        const sessionsSnapshot = await get(sessionsRef);

        if (sessionsSnapshot.exists()) {
          const sessionsData = sessionsSnapshot.val();
          Object.keys(sessionsData).forEach((sessionId) => {
            allSessions.push({
              id: sessionId,
              patientId,
              patientName: patient.fullName || '',
              patientIsraelId: patient.israelId || '',
              ...sessionsData[sessionId],
            });
          });
        }
      } catch (error) {
        console.error(`Error loading sessions for patient ${patientId}:`, error);
        // Continue with other patients
      }
    }

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
    const sessionsRef = ref(db, `${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}`);
    const newSessionRef = push(sessionsRef);
    const sessionId = newSessionRef.key;

    const now = Date.now();
    await set(newSessionRef, {
      ...sessionData,
      sessionDate: new Date(sessionData.sessionDate).getTime(),
      createdAt: now,
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
    const sessionRef = ref(db, `${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}/${sessionId}`);
    const updateData = {
      ...updates,
      updatedAt: Date.now(),
    };

    // Convert sessionDate if present
    if (updates.sessionDate) {
      updateData.sessionDate = new Date(updates.sessionDate).getTime();
    }

    await update(sessionRef, updateData);
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
    const patientRef = ref(db, `${PATIENTS_PATH}/${patientId}`);
    await remove(patientRef);
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
    const sessionRef = ref(db, `${PATIENTS_PATH}/${patientId}/${SESSIONS_PATH}/${sessionId}`);
    await remove(sessionRef);
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
};

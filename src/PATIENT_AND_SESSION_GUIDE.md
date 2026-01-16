# Patient and Session Management Guide

This comprehensive guide explains how patient edit, patient remove, and session management work in your clinic application.

## Table of Contents
1. [Patient Edit Functionality](#patient-edit-functionality)
2. [Patient Remove Functionality](#patient-remove-functionality)
3. [Session Section in Add Patient](#session-section-in-add-patient)
4. [Session Section in View Patient](#session-section-in-view-patient)
5. [Sessions Page](#sessions-page)
6. [How to Customize](#how-to-customize)

---

## Patient Edit Functionality

### Overview
The patient edit functionality allows you to modify existing patient information. It's already fully implemented in `PatientEdit.js`.

### How It Works

**Location**: `pages/PatientEdit.js`

**Route**: `/clinic/patients/:patientId/edit`

### Features:
1. **Loads existing patient data** when the page loads
2. **Validates all fields** before saving (same validation as creating a patient)
3. **Updates patient information** in Firebase Realtime Database
4. **Preserves sessions** - only patient info is updated, sessions remain unchanged

### Key Code Sections:

```javascript
// Load patient data on mount
useEffect(() => {
  loadPatient();
}, [patientId]);

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  
  const updateData = {
    fullName: data.fullName.trim(),
    israelId: formattedId,
    birthDate: data.birthDate,
    gender: data.gender,
    diagnosis: diagnosisObject,
    insurance: insuranceObject,
    therapyName: data.therapyName.trim(),
  };
  
  await updatePatient(patientId, updateData);
  success(t('patient.patientUpdated'));
  navigate(`/clinic/patients/${patientId}`);
};
```

### How to Access:
1. From **Patient View** page: Click the "Edit Patient" button
2. From **Patients List** page: Click the "Edit" button next to any patient
3. Direct URL: `/clinic/patients/{patientId}/edit`

### Service Method Used:
```javascript
// From realtimeDbService.js
export const updatePatient = async (patientId, updates) => {
  // Updates patient in Firebase
  // Preserves all existing sessions
}
```

---

## Patient Remove Functionality

### Overview
The patient remove (delete) functionality allows you to permanently delete a patient and all their associated sessions.

### How It Works

**Locations**: 
- `pages/PatientView.js` - Delete button on patient detail page
- `pages/PatientsList.js` - Delete button in patients list

### Features:
1. **Confirmation dialog** - Prevents accidental deletion
2. **Cascading delete** - Automatically deletes all sessions when patient is deleted
3. **Navigation** - Redirects to patients list after successful deletion

### Key Code Sections:

```javascript
// In PatientView.js
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
    }
  }
};

// In PatientsList.js
const handleDelete = async (patientId, patientName) => {
  const confirmMessage = `${t('patientView.confirmDeletePatient')}\n${t('common.thisActionCannotBeUndone')}`;
  if (window.confirm(confirmMessage)) {
    try {
      await deletePatient(patientId);
      success(t('patient.patientDeleted'));
      loadPatients(); // Reload the list
    } catch (err) {
      showError(t('patient.failedDelete'));
    }
  }
};
```

### Service Method Used:
```javascript
// From realtimeDbService.js
export const deletePatient = async (patientId) => {
  const patientRef = ref(db, `${PATIENTS_PATH}/${patientId}`);
  await remove(patientRef); // This removes patient AND all sessions (cascading delete)
}
```

### Important Notes:
- ⚠️ **This action is permanent** - All patient data and sessions are deleted
- ⚠️ **Cannot be undone** - Make sure to confirm before deleting
- ⚠️ **Cascading delete** - All sessions under the patient are automatically deleted

---

## Session Section in Add Patient

### Overview
When creating a new patient, you can simultaneously create their first session. This is a streamlined workflow that saves time.

### How It Works

**Location**: `pages/PatientCreate.js`

**Route**: `/clinic/patients/new`

### Features:
1. **Two-part form**:
   - Part 1: Patient Information (name, ID, birth date, gender, diagnosis, insurance, therapy name)
   - Part 2: First Session (session type, session date)
2. **Single submission** - Both patient and first session are created together
3. **Draft saving** - Form data is saved to localStorage as draft if you navigate away

### Key Code Sections:

```javascript
// Form has two sections
<div className="form-section">
  <h2>{t("patient.patientInformation")}</h2>
  {/* Patient fields */}
</div>

<div className="form-section">
  <h2>{t("patient.firstSession")}</h2>
  {/* Session type and date fields */}
</div>

// Submission creates both at once
const patient = await createPatientWithFirstSession(patientData, sessionData);
```

### First Session Section Fields:
1. **Session Type** (Required)
   - Dropdown with predefined session types
   - Can type custom values (EditableSelect component)
   - Options: Individual, Group, Family, Assessment, etc.

2. **Session Date** (Required)
   - Date picker
   - Cannot be in the future
   - Stored as timestamp

### Service Method Used:
```javascript
// From realtimeDbService.js
export const createPatientWithFirstSession = async (patientData, sessionData) => {
  // 1. Creates patient record
  // 2. Creates first session under that patient
  // Returns the created patient with ID
}
```

### Important Notes:
- ✅ Creating the first session is **optional but recommended** during patient creation
- ✅ After creation, you can add more sessions from the Patient View page
- ✅ If you skip the first session, you can add it later

---

## Session Section in View Patient

### Overview
The Patient View page displays all sessions for a specific patient in a table format with full CRUD capabilities.

### How It Works

**Location**: `pages/PatientView.js`

**Route**: `/clinic/patients/:patientId`

### Features:
1. **Sessions table** - Shows all patient sessions sorted by date (newest first)
2. **Add session button** - Creates new sessions for this patient
3. **Edit session** - Modify existing session details
4. **Delete session** - Remove individual sessions
5. **Notes preview** - Shows truncated notes in table (full notes visible when editing)

### Key Code Sections:

```javascript
// Load sessions when page loads
const loadPatientData = useCallback(async () => {
  const [patientData, sessionsData] = await Promise.all([
    getPatient(patientId),
    listSessions(patientId),
  ]);
  setPatient(patientData);
  setSessions(sessionsData);
}, [patientId]);

// Sessions table structure
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
        <td>{getSessionTypeDisplayText(session.sessionType)}</td>
        <td>{session.notes?.substring(0, 50)}...</td>
        <td>
          <button onClick={() => handleEditSession(session.id)}>Edit</button>
          <button onClick={() => handleDeleteSession(session.id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

### Session Actions:

#### 1. Add Session
```javascript
const handleAddSession = () => {
  navigate(`/clinic/patients/${patientId}/sessions/new`);
};
```
- Routes to: `/clinic/patients/:patientId/sessions/new`
- Opens `SessionForm.js` in create mode

#### 2. Edit Session
```javascript
const handleEditSession = (sessionId) => {
  navigate(`/clinic/patients/${patientId}/sessions/${sessionId}/edit`);
};
```
- Routes to: `/clinic/patients/:patientId/sessions/:sessionId/edit`
- Opens `SessionForm.js` in edit mode
- Pre-fills form with existing session data

#### 3. Delete Session
```javascript
const handleDeleteSession = async (sessionId) => {
  if (window.confirm(confirmMessage)) {
    await deleteSession(patientId, sessionId);
    // Reload sessions list
    const updatedSessions = await listSessions(patientId);
    setSessions(updatedSessions);
  }
};
```

### Session Data Structure:
```javascript
{
  id: "sessionId123",
  sessionType: { en: "Individual", ar: "فردي" },
  sessionDate: 1704067200000, // timestamp
  notes: "Patient showed improvement...",
  createdAt: 1704067200000,
  updatedAt: 1704067200000
}
```

### Display Features:
- **Date formatting** - Human-readable dates using `formatDate()`
- **Session type display** - Shows in current language (English/Arabic)
- **Notes truncation** - Shows first 50 characters, full text in edit mode
- **Empty state** - Shows helpful message if no sessions exist

---

## Sessions Page

### Overview
The Sessions List page (`SessionsList.js`) displays **all sessions across all patients** in a single view. This is useful for clinic-wide overview and management.

### How It Works

**Location**: `pages/SessionsList.js`

**Route**: `/clinic/sessions`

**Navigation**: Click "Sessions" in the main navigation menu

### Features:
1. **Global view** - Shows all sessions from all patients
2. **Search functionality** - Filter by patient name, ID, session type, or notes
3. **Patient information** - Each session shows which patient it belongs to
4. **Quick actions** - View patient, edit session, or delete session
5. **Sorted by date** - Newest sessions appear first

### Key Code Sections:

```javascript
// Load all sessions from all patients
const loadSessions = useCallback(async () => {
  const data = await listAllSessions(); // Gets sessions from ALL patients
  setSessions(data);
  setFilteredSessions(data);
}, []);

// Search filter
useEffect(() => {
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    setFilteredSessions(
      sessions.filter(session => {
        const patientName = (session.patientName || '').toLowerCase();
        const sessionType = getSessionTypeDisplayText(session.sessionType, language).toLowerCase();
        const notes = (session.notes || '').toLowerCase();
        const patientId = (session.patientIsraelId || '').toLowerCase();
        return patientName.includes(term) || sessionType.includes(term) || 
               notes.includes(term) || patientId.includes(term);
      })
    );
  } else {
    setFilteredSessions(sessions);
  }
}, [searchTerm, sessions, language]);
```

### Table Columns:
1. **Date** - Session date
2. **Patient** - Patient name and ID
3. **Type** - Session type (Individual, Group, etc.)
4. **Notes** - Session notes (truncated to 50 chars)
5. **Actions** - View Patient, Edit, Delete buttons

### Actions Available:

#### 1. View Patient
```javascript
const handleViewPatient = (patientId) => {
  navigate(`/clinic/patients/${patientId}`);
};
```
- Takes you to the patient's detail page
- Shows all their information and sessions

#### 2. Edit Session
```javascript
const handleEditSession = (patientId, sessionId) => {
  navigate(`/clinic/patients/${patientId}/sessions/${sessionId}/edit`);
};
```
- Opens session edit form
- Pre-filled with existing session data

#### 3. Delete Session
```javascript
const handleDeleteSession = async (patientId, sessionId) => {
  if (window.confirm(confirmMessage)) {
    await deleteSession(patientId, sessionId);
    loadSessions(); // Reload the list
  }
};
```
- Removes session from database
- Updates the table automatically

### Service Method Used:
```javascript
// From realtimeDbService.js
export const listAllSessions = async () => {
  // Loops through ALL patients
  // Collects all sessions from all patients
  // Adds patient info to each session (patientId, patientName, patientIsraelId)
  // Returns sorted array (newest first)
}
```

### Use Cases:
- 📊 **Clinic overview** - See all sessions across all patients
- 🔍 **Quick search** - Find sessions by patient name, type, or notes
- 📅 **Date tracking** - Monitor session dates across the clinic
- 🎯 **Bulk management** - Edit or delete sessions from a central location

---

## How to Customize

### 1. Add New Session Fields

To add new fields to sessions (e.g., duration, therapist name):

**Step 1**: Update `SessionForm.js`
```javascript
// Add field to state
const [data, setData] = useState({
  sessionType: '',
  sessionDate: '',
  notes: '',
  duration: '', // NEW FIELD
});

// Add form input
<div className="form-group">
  <label htmlFor="duration">Duration (minutes)</label>
  <input
    type="number"
    id="duration"
    value={data.duration}
    onChange={(e) => handleChange('duration', e.target.value)}
  />
</div>
```

**Step 2**: Update display in `PatientView.js` and `SessionsList.js`
```javascript
// Add column header
<th>Duration</th>

// Add cell
<td>{session.duration ? `${session.duration} min` : '-'}</td>
```

### 2. Change Session Sorting

Currently sorted by date (descending). To change:

**In `realtimeDbService.js`**:
```javascript
// Change sort order
sessions.sort((a, b) => {
  return a.sessionDate - b.sessionDate; // Ascending (oldest first)
});
```

### 3. Add Session Validation Rules

**In `SessionForm.js`**:
```javascript
const validate = () => {
  const newErrors = {};
  
  // Existing validations...
  
  // Add custom validation
  if (data.duration && (data.duration < 15 || data.duration > 180)) {
    newErrors.duration = 'Duration must be between 15 and 180 minutes';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 4. Customize Session Types

**Update `config/sessionTypes.js`**:
```javascript
export const DEFAULT_SESSION_TYPES = [
  'Individual',
  'Group',
  'Family',
  'Assessment',
  'YourCustomType', // Add new type
];
```

**Add translations in `config/i18n.js`**:
```javascript
sessionTypes: {
  YourCustomType: {
    en: 'Custom Type',
    ar: 'النوع المخصص'
  }
}
```

### 5. Modify Delete Confirmation

**Current**: Simple `window.confirm()` dialog

**Customize with a modal**:
1. Create `components/DeleteConfirmModal.js`
2. Replace `window.confirm()` with modal component
3. Add to `PatientView.js` and `SessionsList.js`

### 6. Add Session Filters/Grouping

**In `SessionsList.js`**, add filter state:
```javascript
const [filterType, setFilterType] = useState('all');
const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });

// Add filter logic in useEffect
useEffect(() => {
  let filtered = sessions;
  
  if (filterType !== 'all') {
    filtered = filtered.filter(s => 
      getSessionTypeDisplayText(s.sessionType, language) === filterType
    );
  }
  
  if (filterDateRange.start) {
    filtered = filtered.filter(s => s.sessionDate >= filterDateRange.start);
  }
  
  setFilteredSessions(filtered);
}, [filterType, filterDateRange, sessions]);
```

---

## File Structure Summary

```
src/
├── pages/
│   ├── PatientCreate.js      # Create patient + first session
│   ├── PatientEdit.js        # Edit patient information
│   ├── PatientView.js        # View patient + manage sessions
│   ├── PatientsList.js       # List all patients (with delete)
│   ├── SessionForm.js        # Create/edit individual sessions
│   └── SessionsList.js       # View all sessions (clinic-wide)
│
├── services/
│   └── realtimeDbService.js  # All Firebase operations
│       ├── createPatientWithFirstSession()
│       ├── updatePatient()
│       ├── deletePatient()
│       ├── createSession()
│       ├── updateSession()
│       ├── deleteSession()
│       ├── listSessions()
│       └── listAllSessions()
│
└── config/
    ├── sessionTypes.js       # Session type definitions
    └── i18n.js              # Translations
```

---

## Quick Reference

### Routes:
- Create Patient: `/clinic/patients/new`
- View Patient: `/clinic/patients/:patientId`
- Edit Patient: `/clinic/patients/:patientId/edit`
- Add Session: `/clinic/patients/:patientId/sessions/new`
- Edit Session: `/clinic/patients/:patientId/sessions/:sessionId/edit`
- All Sessions: `/clinic/sessions`

### Key Functions:
- `createPatientWithFirstSession()` - Create patient + first session
- `updatePatient()` - Update patient info
- `deletePatient()` - Delete patient (and all sessions)
- `createSession()` - Add new session
- `updateSession()` - Edit session
- `deleteSession()` - Remove session
- `listSessions()` - Get sessions for one patient
- `listAllSessions()` - Get all sessions (all patients)

---

## Troubleshooting

### Issue: Sessions not showing after creation
**Solution**: Check `listSessions()` is called after creating session. It should automatically reload.

### Issue: Patient delete not removing sessions
**Solution**: Firebase cascading delete should handle this. Check Firebase Realtime Database rules.

### Issue: Session date showing incorrectly
**Solution**: Ensure dates are converted to timestamps when saving and formatted when displaying.

### Issue: Draft data not clearing
**Solution**: `clearDraftData()` should be called after successful submission. Check `SessionForm.js` and `PatientCreate.js`.

---

This guide covers all aspects of patient and session management in your clinic application. For more specific customization needs, refer to the individual file comments and the React/Firebase documentation.
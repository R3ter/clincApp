# Clinic Management System - User Guide

Welcome to the Clinic Management System! This guide will help you understand how to manage patients and sessions in your clinic.

---

## Table of Contents

1. [Understanding Patients and Sessions](#understanding-patients-and-sessions)
2. [Patient Information Fields](#patient-information-fields)
3. [How to Add a New Patient](#how-to-add-a-new-patient)
4. [How to View a Patient](#how-to-view-a-patient)
5. [How to Edit a Patient](#how-to-edit-a-patient)
6. [How to Delete a Patient](#how-to-delete-a-patient)
7. [Session Information Fields](#session-information-fields)
8. [How to Add a Session](#how-to-add-a-session)
9. [How to Edit a Session](#how-to-edit-a-session)
10. [How to Delete a Session](#how-to-delete-a-session)
11. [Viewing All Sessions](#viewing-all-sessions)
12. [Frequently Asked Questions](#frequently-asked-questions)

---

## Understanding Patients and Sessions

### What is a Patient?

A **Patient** is a person receiving therapy at your clinic. Each patient has personal information, medical details, and insurance information. Once you create a patient, you can add multiple therapy sessions for them.

### What is a Session?

A **Session** is a therapy session that belongs to a specific patient. Each session records:
- The type of therapy (e.g., Individual, Group, Family)
- The date when the session occurred
- Any notes about the session

### The Connection Between Patients and Sessions

**Important**: Every session must belong to a patient. You cannot create a session without a patient.

- **One Patient** can have **Many Sessions**
- **One Session** belongs to **One Patient**
- When you delete a patient, **all their sessions are also deleted**

Think of it like this:
- A patient is like a file folder
- Sessions are like documents inside that folder
- If you delete the folder, all documents inside are deleted too

---

## Patient Information Fields

When you add or edit a patient, you'll fill in these fields:

### 1. Full Name *
- **What it is**: The patient's complete name (first name and last name)
- **Required**: Yes
- **Example**: "Ahmed Mohammed" or "Sarah Cohen"
- **How to fill**: Type the full name in the text box

### 2. ID *
- **What it is**: The patient's Israeli ID number
- **Required**: Yes
- **Format**: Must be exactly 9 digits (numbers only)
- **Example**: "123456789"
- **Special feature**: The system automatically validates the ID number and formats it to 9 digits
- **Note**: The system will check if the ID number is valid

### 3. Birth Date *
- **What it is**: The date the patient was born
- **Required**: Yes
- **Format**: Select from calendar picker (MM/DD/YYYY)
- **Restriction**: Cannot be a future date
- **Special feature**: Once you select the birth date, the system automatically calculates and displays the patient's age

### 4. Age
- **What it is**: Automatically calculated from the birth date
- **Required**: No (auto-filled)
- **Display**: Shows years and months (e.g., "25 years 3 months")
- **Note**: This field is read-only - you cannot type in it

### 5. Gender *
- **What it is**: The patient's gender
- **Required**: Yes
- **Options**: 
  - Male
  - Female
- **How to select**: Click on the radio button (circle) next to your choice

### 6. Diagnosis *
- **What it is**: The medical diagnosis or condition
- **Required**: Yes
- **Options**: 
  - Cerebral palsy
  - Developmental Delay Milestone
  - ASD (Autism Spectrum Disorder)
  - ADHD (Attention Deficit Hyperactivity Disorder)
  - Syndromes
  - Other (if you select "Other", you'll need to specify it)
- **Special feature**: You can select from the dropdown list or type your own custom diagnosis
- **If you select "Other"**: An additional text field appears where you must type the specific diagnosis

### 7. Insurance *
- **What it is**: The patient's health insurance provider
- **Required**: Yes
- **Options**:
  - Private
  - Maccabi
  - Clalit
  - Meuhedet
  - Leumit
  - Palestinian Authority
- **Special feature**: You can select from the list or type a custom insurance name

### 8. Therapy Name *
- **What it is**: The name of the specific therapy or treatment being provided
- **Required**: Yes
- **Example**: "Physical Therapy", "Occupational Therapy", "Speech Therapy"
- **How to fill**: Type the therapy name in the text box

---

## How to Add a New Patient

### Step-by-Step Instructions

1. **Navigate to Patients Page**
   - Click on "Patients" in the main navigation menu at the top
   - You'll see a list of all existing patients

2. **Click "Add New Patient" Button**
   - Look for the "Add New Patient" button (usually at the top right or center of the page)
   - Click it to open the patient creation form

3. **Fill in Patient Information Section**
   - Fill in all required fields marked with an asterisk (*)
   - Start with **Full Name**: Type the patient's complete name
   - Enter **ID**: Type the 9-digit Israeli ID number
   - Select **Birth Date**: Click on the date picker and choose the date
   - Select **Gender**: Click the radio button for Male or Female
   - Choose **Diagnosis**: Select from dropdown or type a custom diagnosis
     - If you select "Other", type the specific diagnosis in the new field that appears
   - Choose **Insurance**: Select from dropdown or type a custom insurance name
   - Enter **Therapy Name**: Type the name of the therapy

4. **Fill in First Session Section** (Optional but Recommended)
   - This section creates the patient's first therapy session at the same time
   - **Session Type**: Select from dropdown (Individual, Group, Family, Assessment, etc.) or type a custom type
   - **Session Date**: Select the date when the first session occurred
     - **Note**: The date cannot be in the future

5. **Review Your Information**
   - Make sure all required fields are filled
   - Check that the ID number is correct (9 digits)
   - Verify the birth date is correct (the age should calculate automatically)

6. **Save the Patient**
   - Click the **"Save Patient"** button at the bottom of the form
   - If there are any errors, they will be shown in red text below the fields
   - Fix any errors and try again

7. **Confirmation**
   - You'll see a success message at the top of the screen
   - You'll be automatically redirected to the patient's detail page

### Important Notes When Adding a Patient

- ✅ All fields marked with * (asterisk) are required
- ✅ The ID number must be exactly 9 digits and valid
- ✅ Birth date cannot be in the future
- ✅ You can create the patient without adding the first session, but it's recommended to add it
- ✅ If you navigate away without saving, the system will ask if you want to save your progress as a draft

---

## How to View a Patient

### Step-by-Step Instructions

1. **Go to Patients List**
   - Click "Patients" in the navigation menu
   - You'll see a list of all patients in a table

2. **Find the Patient**
   - Use the search box at the top to search by name or ID number
   - Or scroll through the list

3. **Click "View" Button**
   - Find the patient in the table
   - Click the "View" button in the Actions column
   - You'll be taken to the patient's detail page

### What You'll See on the Patient View Page

#### Patient Information Card
- All patient information displayed in an easy-to-read format:
  - Full Name
  - ID Number
  - Gender
  - Age (automatically calculated)
  - Birth Date
  - Diagnosis
  - Insurance
  - Therapy Name

#### Sessions Section
- A table showing all sessions for this patient
- Each session shows:
  - **Date**: When the session occurred
  - **Type**: What type of session it was (Individual, Group, etc.)
  - **Notes**: A preview of any notes (if notes are long, only first 50 characters are shown)
  - **Actions**: Buttons to Edit or Delete the session

#### Action Buttons at the Top
- **Edit Patient**: Click to edit patient information
- **Delete**: Click to delete the patient (careful - this deletes all sessions too!)
- **Back to Patients**: Returns to the patients list

#### Add Session Button
- If the patient has no sessions: A message says "No sessions yet" with an "Add Session" button
- If the patient has sessions: An "Add Session" button appears at the top of the sessions table

---

## How to Edit a Patient

### When to Edit a Patient

You might need to edit patient information when:
- The patient's information changes (e.g., new insurance, diagnosis update)
- You made a mistake when creating the patient
- Patient details need correction

### Step-by-Step Instructions

#### Method 1: From Patient View Page

1. **Open the Patient**
   - Go to the patient's detail page (see "How to View a Patient" above)

2. **Click "Edit Patient" Button**
   - Look at the top right of the patient view page
   - Click the "Edit Patient" button

3. **Make Your Changes**
   - All fields will be pre-filled with existing information
   - Change any fields you need to update
   - You can change any information except the patient's sessions (sessions are managed separately)

4. **Save Changes**
   - Click the **"Save Changes"** button at the bottom
   - Or click **"Cancel"** to discard changes and return to patient view

#### Method 2: From Patients List

1. **Go to Patients List**
   - Click "Patients" in the navigation menu

2. **Click "Edit" Button**
   - Find the patient in the table
   - Click the "Edit" button in the Actions column

3. **Make and Save Changes**
   - Follow steps 3-4 from Method 1 above

### Important Notes When Editing

- ✅ You can change any patient information
- ✅ Sessions are NOT affected when you edit patient information
- ✅ All validation rules still apply (e.g., ID must be 9 digits)
- ✅ After saving, you'll be redirected back to the patient view page

---

## How to Delete a Patient

### Warning: This Action Cannot Be Undone!

**When you delete a patient, ALL of their sessions are also deleted permanently.** Make absolutely sure you want to delete the patient before proceeding.

### Step-by-Step Instructions

#### Method 1: From Patient View Page

1. **Open the Patient**
   - Go to the patient's detail page

2. **Click "Delete" Button**
   - Look at the top right, next to the "Edit Patient" button
   - Click the red "Delete" button

3. **Confirm Deletion**
   - A confirmation dialog will appear asking: "Are you sure you want to delete this patient? This action cannot be undone."
   - Click **"OK"** to confirm deletion
   - Click **"Cancel"** to keep the patient

4. **Result**
   - The patient and all their sessions are permanently deleted
   - You'll be redirected back to the patients list

#### Method 2: From Patients List

1. **Go to Patients List**
   - Click "Patients" in the navigation menu

2. **Click "Delete" Button**
   - Find the patient in the table
   - Click the "Delete" button in the Actions column

3. **Confirm and Complete**
   - Follow steps 3-4 from Method 1 above

### Important Notes About Deleting

- ⚠️ **Permanent**: Once deleted, the patient and all sessions cannot be recovered
- ⚠️ **All Sessions Deleted**: All therapy sessions for this patient are also deleted
- ⚠️ **Confirmation Required**: The system will always ask you to confirm before deleting

---

## Session Information Fields

When you add or edit a session, you'll fill in these fields:

### 1. Session Type *
- **What it is**: The type of therapy session
- **Required**: Yes
- **Common Options**:
  - Individual Therapy
  - Group Therapy
  - Family Therapy
  - Assessment
  - CBT (Cognitive Behavioral Therapy)
  - DBT (Dialectical Behavior Therapy)
  - Psychodynamic Therapy
  - Follow-up
  - Consultation
- **Special feature**: You can select from the dropdown list or type your own custom session type
- **Example**: "Initial Assessment", "Progress Review", "Family Consultation"

### 2. Session Date *
- **What it is**: The date when the therapy session occurred
- **Required**: Yes
- **Format**: Select from calendar picker (MM/DD/YYYY)
- **Restriction**: Cannot be a future date (you can only record sessions that have already happened)
- **Example**: If today is March 15, you can record sessions up to March 15, but not March 16 or later

### 3. Notes (Optional)
- **What it is**: Any additional information about the session
- **Required**: No
- **What to include**:
  - Patient progress
  - Issues discussed
  - Treatment plan updates
  - Observations
  - Next steps
  - Any other relevant information
- **Format**: Free text area - you can write as much as you need
- **Display**: On the patient view page, long notes are truncated to show first 50 characters (full text is visible when editing)

---

## How to Add a Session

### When to Add a Session

Add a new session whenever a patient has a therapy session. You can add sessions at any time.

### Step-by-Step Instructions

#### Method 1: From Patient View Page

1. **Open the Patient**
   - Go to the patient's detail page
   - You can see all existing sessions in a table

2. **Click "Add Session" Button**
   - Look at the top of the Sessions section
   - Click the "Add Session" button

3. **Fill in Session Information**
   - **Session Type**: Select from dropdown or type a custom type
   - **Session Date**: Select the date when the session occurred
     - **Remember**: Date cannot be in the future
   - **Notes**: (Optional) Write any notes about the session

4. **Review and Save**
   - Check that required fields are filled
   - Click the **"Create Session"** button
   - Or click **"Cancel"** to go back without saving

5. **Confirmation**
   - You'll see a success message
   - You'll be redirected back to the patient view page
   - The new session will appear in the sessions table

#### Method 2: When Creating a New Patient

If you're creating a new patient, you can add their first session at the same time:

1. **Fill in Patient Information** (see "How to Add a New Patient")

2. **Fill in First Session Section**
   - At the bottom of the patient form, you'll see a "First Session" section
   - Fill in the Session Type and Session Date
   - Notes can be added later when editing

3. **Save Everything Together**
   - When you click "Save Patient", both the patient and first session are created

### Important Notes About Adding Sessions

- ✅ Every session must belong to a patient (you can't create a session without a patient)
- ✅ Session date cannot be in the future
- ✅ You can add multiple sessions for the same patient
- ✅ Sessions are sorted by date (newest first)
- ✅ Notes are optional but helpful for tracking patient progress

---

## How to Edit a Session

### When to Edit a Session

You might need to edit a session when:
- You made a mistake entering the session date or type
- You want to add or update notes
- You need to correct session information

### Step-by-Step Instructions

#### Method 1: From Patient View Page

1. **Open the Patient**
   - Go to the patient's detail page
   - Find the session you want to edit in the sessions table

2. **Click "Edit" Button**
   - Find the session in the table
   - Click the "Edit" button in the Actions column for that session

3. **Make Your Changes**
   - The form will be pre-filled with existing session information
   - Change any fields you need:
     - Session Type
     - Session Date
     - Notes

4. **Save Changes**
   - Click the **"Save Changes"** button at the bottom
   - Or click **"Cancel"** to discard changes and return to patient view

5. **Confirmation**
   - You'll see a success message
   - You'll be redirected back to the patient view page
   - The updated session information will be visible

#### Method 2: From Sessions Page

1. **Go to Sessions Page**
   - Click "Sessions" in the navigation menu
   - You'll see all sessions from all patients

2. **Find the Session**
   - Use the search box to find a specific session
   - Or scroll through the list

3. **Click "Edit" Button**
   - Find the session you want to edit
   - Click the "Edit" button in the Actions column

4. **Make and Save Changes**
   - Follow steps 3-4 from Method 1 above

### Important Notes About Editing Sessions

- ✅ You can change session type, date, and notes
- ✅ Session date still cannot be in the future
- ✅ The session remains linked to the same patient
- ✅ All validation rules apply (same as when creating)

---

## How to Delete a Session

### Warning: This Action Cannot Be Undone!

**When you delete a session, it is permanently removed and cannot be recovered.**

### Step-by-Step Instructions

#### Method 1: From Patient View Page

1. **Open the Patient**
   - Go to the patient's detail page
   - Find the session you want to delete in the sessions table

2. **Click "Delete" Button**
   - Find the session in the table
   - Click the red "Delete" button in the Actions column for that session

3. **Confirm Deletion**
   - A confirmation dialog will appear asking: "Are you sure you want to delete this session? This action cannot be undone."
   - Click **"OK"** to confirm deletion
   - Click **"Cancel"** to keep the session

4. **Result**
   - The session is permanently deleted
   - The sessions table automatically updates to show remaining sessions

#### Method 2: From Sessions Page

1. **Go to Sessions Page**
   - Click "Sessions" in the navigation menu

2. **Find and Delete Session**
   - Find the session you want to delete
   - Click the red "Delete" button
   - Confirm the deletion

### Important Notes About Deleting Sessions

- ⚠️ **Permanent**: Deleted sessions cannot be recovered
- ⚠️ **Patient Not Affected**: Deleting a session does NOT delete the patient
- ⚠️ **Confirmation Required**: The system will always ask you to confirm before deleting

---

## Viewing All Sessions

### What is the Sessions Page?

The Sessions page shows **all therapy sessions from all patients** in one place. This is useful for:
- Getting an overview of all clinic activity
- Finding a specific session when you don't know which patient it belongs to
- Searching across all sessions

### How to Access

1. **Click "Sessions" in Navigation**
   - Look at the top navigation menu
   - Click on "Sessions"

### What You'll See

#### Search Box
- At the top of the page
- You can search by:
  - Patient name
  - Patient ID number
  - Session type
  - Session notes

#### Sessions Table
- Each row shows one session with:
  - **Date**: Session date
  - **Patient**: Patient name and ID number
  - **Type**: Session type (Individual, Group, etc.)
  - **Notes**: Preview of session notes (first 50 characters)
  - **Actions**: Buttons to manage the session

#### Actions Available for Each Session

1. **View Patient**
   - Click to go to that patient's detail page
   - Useful when you want to see all sessions for that patient

2. **Edit**
   - Click to edit the session information

3. **Delete**
   - Click to delete the session (with confirmation)

### How to Use the Sessions Page

1. **View All Sessions**: Simply open the page - all sessions are shown, sorted by date (newest first)

2. **Search for a Session**:
   - Type in the search box (patient name, ID, type, or notes)
   - Results filter automatically as you type

3. **Edit a Session**:
   - Click "Edit" button next to any session
   - Make changes and save

4. **Delete a Session**:
   - Click "Delete" button
   - Confirm the deletion

5. **Go to Patient**:
   - Click "View Patient" to see all information about that patient

### Important Notes About the Sessions Page

- ✅ Shows sessions from **all patients** in one place
- ✅ Search works across patient names, IDs, session types, and notes
- ✅ Sessions are sorted by date (most recent first)
- ✅ You can manage sessions directly from this page without going to the patient page

---

## Frequently Asked Questions

### General Questions

**Q: Can I create a session without a patient?**  
A: No. Every session must belong to a patient. First create the patient, then add sessions for that patient.

**Q: What happens if I delete a patient?**  
A: The patient and ALL their sessions are permanently deleted. This cannot be undone.

**Q: Can I recover a deleted patient or session?**  
A: No. Deleted information is permanently removed and cannot be recovered.

**Q: Can I change a session to belong to a different patient?**  
A: No. Sessions are permanently linked to the patient they were created for. If you need to move a session, you would need to:
1. Create a new session for the correct patient
2. Copy the information from the old session
3. Delete the old session

### Patient Questions

**Q: What if I make a mistake when creating a patient?**  
A: You can edit the patient information at any time. Just go to the patient view page and click "Edit Patient".

**Q: Can I change a patient's ID number?**  
A: Yes, but make sure the new ID number is valid (9 digits). The system will validate it.

**Q: What if I don't know the patient's exact birth date?**  
A: You need a birth date to create a patient. If you don't have it, use an approximate date (but note this will affect the calculated age).

**Q: Can I have two patients with the same ID number?**  
A: Technically the system allows it, but in practice each patient should have a unique ID number.

### Session Questions

**Q: Can I record a session for a future date?**  
A: No. You can only record sessions that have already occurred. The system prevents selecting future dates.

**Q: How many sessions can I add for one patient?**  
A: There is no limit. You can add as many sessions as needed.

**Q: Can I add notes to a session later?**  
A: Yes. You can edit any session to add or update notes at any time.

**Q: What should I write in session notes?**  
A: Include any relevant information such as:
- What was discussed or worked on
- Patient progress or changes
- Concerns or observations
- Next steps or treatment plan updates
- Any other important information about the session

### Technical Questions

**Q: What if the page doesn't save my changes?**  
A: Check for error messages (shown in red). Make sure all required fields are filled and valid. Try refreshing the page and try again.

**Q: What if I see "Patient not found"?**  
A: The patient may have been deleted, or there's an issue with the link. Go back to the Patients list and try again.

**Q: Why can't I type in the Age field?**  
A: The Age field is automatically calculated from the birth date. You cannot edit it directly.

**Q: What does the red asterisk (*) mean?**  
A: The asterisk indicates that the field is **required**. You must fill it in before you can save.

---

## Quick Reference: Common Tasks

### To Add a New Patient with First Session:
1. Patients → Add New Patient
2. Fill patient information
3. Fill first session information
4. Click "Save Patient"

### To Add Another Session to Existing Patient:
1. Patients → View patient
2. Click "Add Session"
3. Fill session information
4. Click "Create Session"

### To Edit Patient Information:
1. Patients → View patient
2. Click "Edit Patient"
3. Make changes
4. Click "Save Changes"

### To Edit a Session:
1. Patients → View patient
2. Find session in table
3. Click "Edit"
4. Make changes
5. Click "Save Changes"

### To Delete a Patient (and all sessions):
1. Patients → View patient
2. Click "Delete" button
3. Confirm deletion

### To Delete a Session:
1. Patients → View patient
2. Find session in table
3. Click "Delete"
4. Confirm deletion

### To View All Sessions:
1. Click "Sessions" in navigation
2. Use search box to find specific sessions
3. Click "View Patient" to see patient details

---

## Need Help?

If you encounter any issues or have questions not covered in this guide:

1. Check error messages on the screen (shown in red)
2. Make sure all required fields (*) are filled
3. Verify that dates are not in the future
4. Ensure ID numbers are exactly 9 digits
5. Try refreshing the page and trying again

Remember: When in doubt, you can always edit information later if you make a mistake!
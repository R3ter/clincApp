// Translation keys for the application
export const translations = {
  en: {
    // Navigation
    nav: {
      clinicManagement: 'Basma Clinic',
      patients: 'Patients',
      sessions: 'Sessions',
    },
    // Session Types
    sessionTypes: {
      CBT: 'CBT',
      DBT: 'DBT',
      'Psychodynamic Therapy': 'Psychodynamic Therapy',
      'Family Therapy': 'Family Therapy',
      'Group Therapy': 'Group Therapy',
      'Individual Therapy': 'Individual Therapy',
      Assessment: 'Assessment',
      'Follow-up': 'Follow-up',
      Consultation: 'Consultation',
    },
    // Diagnosis Types
    diagnosisTypes: {
      'Cerebral palsy': 'Cerebral palsy',
      'Developmental Delay Milestone': 'Developmental Delay Milestone',
      'ASD': 'ASD',
      'ADHD': 'ADHD',
      'Syndromes': 'Syndromes',
      'Other': 'Other',
    },
    // Insurance Types
    insuranceTypes: {
      'Private': 'Private',
      'Maccabi': 'Maccabi',
      'Clalit': 'Clalit',
      'Meuhedet': 'Meuhedet',
      'Leumit': 'Leumit',
      'Palestinian Authority': 'Palestinian Authority',
    },
    // Common
    common: {
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      view: 'View',
      delete: 'Delete',
      actions: 'Actions',
      loading: 'Loading...',
      required: '*',
      years: 'years',
      months: 'months',
      optional: 'Optional',
      confirm: 'Confirm',
      areYouSure: 'Are you sure?',
      thisActionCannotBeUndone: 'This action cannot be undone.',
    },
    // Patient Form
    patient: {
      addNewPatient: 'Add New Patient',
      editPatient: 'Edit Patient',
      patientInformation: 'Patient Information',
      fullName: 'Full Name',
      id: 'ID',
      birthDate: 'Birth Date',
      age: 'Age',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      diagnosis: 'Diagnosis',
      diagnosisOther: 'Other Diagnosis (specify)',
      insurance: 'Insurance',
      therapyName: 'Therapy Name',
      totalSessionsPlanned: 'Total Sessions Planned',
      firstSession: 'First Session',
      sessionType: 'Session Type',
      sessionDate: 'Session Date',
      notes: 'Notes',
      savePatient: 'Save Patient',
      saving: 'Saving...',
      saveChanges: 'Save Changes',
      patientCreated: 'Patient created successfully',
      patientUpdated: 'Patient updated successfully',
      failedCreate: 'Failed to create patient. Please try again.',
      failedUpdate: 'Failed to update patient. Please try again.',
      failedLoad: 'Failed to load patient. Please try again.',
      loadingPatient: 'Loading patient...',
      patientNotFound: 'Patient not found',
      selectOrTypeSessionType: 'Select or type session type...',
      // Validation
      fullNameRequired: 'Full name is required',
      idRequired: 'ID is required',
      idMustBe9Digits: 'ID must be 9 digits',
      invalidIdNumber: 'Invalid ID number',
      birthDateRequired: 'Birth date is required',
      genderRequired: 'Gender is required',
      diagnosisRequired: 'Diagnosis is required',
      diagnosisOtherRequired: 'Please specify the other diagnosis',
      therapyNameRequired: 'Therapy name is required',
      insuranceRequired: 'Insurance is required',
      totalSessionsMustBeAtLeast1: 'Total sessions planned must be at least 1',
      sessionTypeRequired: 'Session type is required',
      sessionDateRequired: 'Session date is required',
      unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?',
    },
    // Patient View
    patientView: {
      backToPatients: '← Back to Patients',
      editPatient: 'Edit Patient',
      deletePatient: 'Delete Patient',
      confirmDeletePatient: 'Are you sure you want to delete this patient? All sessions will also be deleted.',
      sessions: 'Sessions',
      addSession: 'Add Session',
      noSessions: 'No sessions yet.',
      date: 'Date',
      type: 'Type',
      actions: 'Actions',
      deleteSession: 'Delete Session',
      confirmDeleteSession: 'Are you sure you want to delete this session?',
      failedLoadData: 'Failed to load patient data. Please try again.',
      loadingPatientData: 'Loading patient data...',
    },
    // Patients List
    patientsList: {
      patients: 'Patients',
      addPatient: 'Add Patient',
      searchByNameOrId: 'Search by name or ID...',
      noPatientsFound: 'No patients found matching your search.',
      noPatientsYet: 'No patients yet.',
      name: 'Name',
      gender: 'Gender',
      birthDate: 'Birth Date',
      therapy: 'Therapy',
      sessions: 'Sessions',
      failedLoad: 'Failed to load patients. Please try again.',
      loadingPatients: 'Loading patients...',
    },
    // Sessions List
    sessionsList: {
      sessions: 'All Sessions',
      searchPlaceholder: 'Search by patient name, session type, or notes...',
      noSessionsFound: 'No sessions found matching your search.',
      noSessionsYet: 'No sessions yet.',
      patient: 'Patient',
      date: 'Date',
      type: 'Type',
      notes: 'Notes',
      viewPatient: 'View Patient',
      loadingSessions: 'Loading sessions...',
      failedLoad: 'Failed to load sessions. Please try again.',
    },
    // Session Form
    session: {
      addSession: 'Add Session',
      editSession: 'Edit Session',
      sessionCreated: 'Session created successfully',
      sessionUpdated: 'Session updated successfully',
      failedCreate: 'Failed to create session. Please try again.',
      failedUpdate: 'Failed to update session. Please try again.',
      failedLoad: 'Failed to load session. Please try again.',
      loadingSession: 'Loading session...',
      optionalSessionNotes: 'Optional session notes...',
      createSession: 'Create Session',
    },
    // Draft Restore Dialog
    draft: {
      restoreDraft: 'Restore Draft?',
      unsavedChanges: 'You have unsaved changes. Would you like to restore them?',
      discard: 'Discard',
      restore: 'Restore',
    },
  },
  ar: {
    // Navigation
    nav: {
      clinicManagement: 'عيادة بسمة',
      patients: 'المرضى',
      sessions: 'الجلسات',
    },
    // Session Types
    sessionTypes: {
      CBT: 'العلاج المعرفي السلوكي',
      DBT: 'العلاج السلوكي الجدلي',
      'Psychodynamic Therapy': 'العلاج النفسي الديناميكي',
      'Family Therapy': 'العلاج الأسري',
      'Group Therapy': 'العلاج الجماعي',
      'Individual Therapy': 'العلاج الفردي',
      Assessment: 'التقييم',
      'Follow-up': 'المتابعة',
      Consultation: 'استشارة',
    },
    // Diagnosis Types
    diagnosisTypes: {
      'Cerebral palsy': 'شلل دماغي',
      'Developmental Delay Milestone': 'تأخر النمو والتطور',
      'ASD': 'طيف التوحد',
      'ADHD': 'اضطراب فرط الحركة ونقص الانتباه',
      'Syndromes': 'متلازمات',
      'Other': 'أخرى',
    },
    // Insurance Types
    insuranceTypes: {
      'Private': 'خاص',
      'Maccabi': 'مكابي',
      'Clalit': 'كلاليت',
      'Meuhedet': 'مئوحيدت',
      'Leumit': 'ليئوميت',
      'Palestinian Authority': 'سلطة فلسطينية',
    },
    // Common
    common: {
      cancel: 'إلغاء',
      save: 'حفظ',
      edit: 'تعديل',
      view: 'عرض',
      delete: 'حذف',
      actions: 'الإجراءات',
      loading: 'جاري التحميل...',
      required: '*',
      years: 'سنوات',
      months: 'أشهر',
      optional: 'اختياري',
      confirm: 'تأكيد',
      areYouSure: 'هل أنت متأكد؟',
      thisActionCannotBeUndone: 'لا يمكن التراجع عن هذا الإجراء.',
    },
    // Patient Form
    patient: {
      addNewPatient: 'إضافة مريض جديد',
      editPatient: 'تعديل المريض',
      patientInformation: 'معلومات المريض',
      fullName: 'الاسم الكامل',
      id: 'رقم الهوية',
      birthDate: 'تاريخ الميلاد',
      age: 'العمر',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      diagnosis: 'التشخيص',
      diagnosisOther: 'تشخيص آخر (اذكر)',
      insurance: 'التأمين',
      therapyName: 'اسم المعالج',
      totalSessionsPlanned: 'إجمالي الجلسات المخططة',
      firstSession: 'الجلسة الأولى',
      sessionType: 'نوع الجلسة',
      sessionDate: 'تاريخ الجلسة',
      notes: 'ملاحظات',
      savePatient: 'حفظ المريض',
      saving: 'جاري الحفظ...',
      saveChanges: 'حفظ التغييرات',
      patientCreated: 'تم إنشاء المريض بنجاح',
      patientUpdated: 'تم تحديث المريض بنجاح',
      patientDeleted: 'تم حذف المريض بنجاح',
      failedCreate: 'فشل إنشاء المريض. يرجى المحاولة مرة أخرى.',
      failedUpdate: 'فشل تحديث المريض. يرجى المحاولة مرة أخرى.',
      failedLoad: 'فشل تحميل المريض. يرجى المحاولة مرة أخرى.',
      failedDelete: 'فشل حذف المريض. يرجى المحاولة مرة أخرى.',
      loadingPatient: 'جاري تحميل المريض...',
      patientNotFound: 'المريض غير موجود',
      selectOrTypeSessionType: 'اختر أو اكتب نوع الجلسة...',
      // Validation
      fullNameRequired: 'الاسم الكامل مطلوب',
      idRequired: 'رقم الهوية مطلوب',
      idMustBe9Digits: 'رقم الهوية يجب أن يكون 9 أرقام',
      invalidIdNumber: 'رقم الهوية غير صحيح',
      birthDateRequired: 'تاريخ الميلاد مطلوب',
      genderRequired: 'الجنس مطلوب',
      diagnosisRequired: 'التشخيص مطلوب',
      diagnosisOtherRequired: 'يرجى تحديد التشخيص الآخر',
      insuranceRequired: 'التأمين مطلوب',
      therapyNameRequired: 'اسم المعالج مطلوب',
      totalSessionsMustBeAtLeast1: 'إجمالي الجلسات المخططة يجب أن يكون 1 على الأقل',
      sessionTypeRequired: 'نوع الجلسة مطلوب',
      sessionDateRequired: 'تاريخ الجلسة مطلوب',
      unsavedChanges: 'لديك تغييرات غير محفوظة. هل أنت متأكد أنك تريد المغادرة؟',
    },
    // Patient View
    patientView: {
      backToPatients: '← العودة إلى المرضى',
      editPatient: 'تعديل المريض',
      deletePatient: 'حذف المريض',
      confirmDeletePatient: 'هل أنت متأكد أنك تريد حذف هذا المريض؟ سيتم حذف جميع الجلسات أيضاً.',
      sessions: 'الجلسات',
      addSession: 'إضافة جلسة',
      noSessions: 'لا توجد جلسات بعد.',
      date: 'التاريخ',
      type: 'النوع',
      actions: 'الإجراءات',
      deleteSession: 'حذف الجلسة',
      confirmDeleteSession: 'هل أنت متأكد أنك تريد حذف هذه الجلسة؟',
      failedLoadData: 'فشل تحميل بيانات المريض. يرجى المحاولة مرة أخرى.',
      loadingPatientData: 'جاري تحميل بيانات المريض...',
    },
    // Patients List
    patientsList: {
      patients: 'المرضى',
      addPatient: 'إضافة مريض',
      searchByNameOrId: 'البحث بالاسم أو رقم الهوية...',
      noPatientsFound: 'لم يتم العثور على مرضى يطابقون البحث.',
      noPatientsYet: 'لا يوجد مرضى بعد.',
      name: 'الاسم',
      gender: 'الجنس',
      birthDate: 'تاريخ الميلاد',
      therapy: 'المعالج',
      sessions: 'الجلسات',
      failedLoad: 'فشل تحميل المرضى. يرجى المحاولة مرة أخرى.',
      loadingPatients: 'جاري تحميل المرضى...',
    },
    // Sessions List
    sessionsList: {
      sessions: 'جميع الجلسات',
      searchPlaceholder: 'البحث باسم المريض أو نوع الجلسة أو الملاحظات...',
      noSessionsFound: 'لم يتم العثور على جلسات تطابق البحث.',
      noSessionsYet: 'لا توجد جلسات بعد.',
      patient: 'المريض',
      date: 'التاريخ',
      type: 'النوع',
      notes: 'ملاحظات',
      viewPatient: 'عرض المريض',
      loadingSessions: 'جاري تحميل الجلسات...',
      failedLoad: 'فشل تحميل الجلسات. يرجى المحاولة مرة أخرى.',
    },
    // Session Form
    session: {
      addSession: 'إضافة جلسة',
      editSession: 'تعديل الجلسة',
      sessionCreated: 'تم إنشاء الجلسة بنجاح',
      sessionUpdated: 'تم تحديث الجلسة بنجاح',
      sessionDeleted: 'تم حذف الجلسة بنجاح',
      failedCreate: 'فشل إنشاء الجلسة. يرجى المحاولة مرة أخرى.',
      failedUpdate: 'فشل تحديث الجلسة. يرجى المحاولة مرة أخرى.',
      failedLoad: 'فشل تحميل الجلسة. يرجى المحاولة مرة أخرى.',
      failedDelete: 'فشل حذف الجلسة. يرجى المحاولة مرة أخرى.',
      loadingSession: 'جاري تحميل الجلسة...',
      optionalSessionNotes: 'ملاحظات الجلسة (اختياري)...',
      createSession: 'إنشاء الجلسة',
    },
    // Draft Restore Dialog
    draft: {
      restoreDraft: 'استعادة المسودة؟',
      unsavedChanges: 'لديك تغييرات غير محفوظة. هل ترغب في استعادتها؟',
      discard: 'تجاهل',
      restore: 'استعادة',
    },
  },
};

// Default language
export const defaultLanguage = 'en';

// Get language from localStorage or default
export const getStoredLanguage = () => {
  try {
    const stored = localStorage.getItem('app_language');
    return stored && (stored === 'en' || stored === 'ar') ? stored : defaultLanguage;
  } catch {
    return defaultLanguage;
  }
};

// Set language to localStorage
export const setStoredLanguage = (lang) => {
  try {
    localStorage.setItem('app_language', lang);
  } catch {
    // Ignore if localStorage is not available
  }
};

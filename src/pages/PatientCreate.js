import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatientWithFirstSession } from "../services/realtimeDbService";
import { validateIsraeliId, formatIsraeliId, cleanIsraeliId } from "../utils/israeliIdValidation";
import { calculateAge } from "../utils/dateUtils";
import { useDraft } from "../hooks/useDraft";
import { DraftKeys } from "../utils/draftManager";
import { useToast } from "../hooks/useToast";
import { DEFAULT_SESSION_TYPES } from "../config/sessionTypes";
import EditableSelect from "../components/EditableSelect";
import DraftRestoreDialog from "../components/DraftRestoreDialog";
import ToastContainer from "../components/ToastContainer";
import "./PatientForm.css";

const PatientCreate = () => {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error: showError } = useToast();

  const { data, setData, hasDraft, showRestoreDialog, restoreDraft, discardDraft, clearDraftData } =
    useDraft(DraftKeys.PATIENT_CREATE, {
      fullName: "",
      israelId: "",
      birthDate: "",
      gender: "",
      diagnosis: "",
      therapyName: "",
      totalSessionsPlanned: "",
      sessionType: "",
      sessionDate: "",
    });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleIsraeliIdChange = (value) => {
    // Allow free typing - just clean non-digits and limit to 9
    const cleaned = cleanIsraeliId(value);
    handleChange("israelId", cleaned);
    // Clear error when user starts typing again
    if (errors.israelId) {
      setErrors((prev) => ({ ...prev, israelId: null }));
    }
  };

  const handleIsraeliIdBlur = () => {
    // Format to 9 digits with padding on blur
    if (data.israelId) {
      const formatted = formatIsraeliId(data.israelId);
      handleChange("israelId", formatted);

      // Validate after formatting
      if (formatted.length === 9) {
        if (!validateIsraeliId(formatted)) {
          setErrors((prev) => ({ ...prev, israelId: "Invalid ID number" }));
        }
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!data.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!data.israelId?.trim()) {
      newErrors.israelId = "ID is required";
    } else {
      const formatted = formatIsraeliId(data.israelId);
      if (formatted.length !== 9) {
        newErrors.israelId = "ID must be 9 digits";
      } else if (!validateIsraeliId(formatted)) {
        newErrors.israelId = "Invalid ID number";
      }
    }

    if (!data.birthDate) {
      newErrors.birthDate = "Birth date is required";
    }

    if (!data.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!data.therapyName?.trim()) {
      newErrors.therapyName = "Therapy name is required";
    }

    if (!data.totalSessionsPlanned || data.totalSessionsPlanned < 1) {
      newErrors.totalSessionsPlanned = "Total sessions planned must be at least 1";
    }

    if (!data.sessionType?.trim()) {
      newErrors.sessionType = "Session type is required";
    }

    if (!data.sessionDate) {
      newErrors.sessionDate = "Session date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      // Format Israeli ID before saving
      const formattedId = formatIsraeliId(data.israelId);

      const patientData = {
        fullName: data.fullName.trim(),
        israelId: formattedId,
        birthDate: data.birthDate,
        gender: data.gender,
        diagnosis: data.diagnosis?.trim() || "",
        therapyName: data.therapyName.trim(),
        totalSessionsPlanned: parseInt(data.totalSessionsPlanned, 10),
      };

      const sessionData = {
        sessionType: data.sessionType.trim(),
        sessionDate: data.sessionDate,
        notes: "",
      };

      const patient = await createPatientWithFirstSession(patientData, sessionData);

      // Clear draft on success
      clearDraftData();

      success("Patient created successfully");
      setTimeout(() => {
        navigate(`/clinic/patients/${patient.id}`);
      }, 500);
    } catch (err) {
      showError("Failed to create patient. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasDraft) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        clearDraftData();
        navigate("/clinic/patients");
      }
    } else {
      navigate("/clinic/patients");
    }
  };

  const age = data.birthDate ? calculateAge(data.birthDate) : null;

  return (
    <div className="patient-form-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {showRestoreDialog && (
        <DraftRestoreDialog onRestore={restoreDraft} onDiscard={discardDraft} />
      )}

      <div className="patient-form-header">
        <h1>Add New Patient</h1>
      </div>

      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-section">
          <h2>Patient Information</h2>

          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={data.fullName || ""}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className={errors.fullName ? "error" : ""}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="israelId">
              ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="israelId"
              value={data.israelId}
              onChange={(e) => handleIsraeliIdChange(e.target.value)}
              onBlur={handleIsraeliIdBlur}
              className={errors.israelId ? "error" : ""}
              placeholder="123456789"
            />
            {errors.israelId && <span className="error-message">{errors.israelId}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birthDate">
                Birth Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="birthDate"
                value={data.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className={errors.birthDate ? "error" : ""}
                max={new Date().toISOString().split("T")[0]}
              />
              {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="text"
                value={age !== null ? `${age} years` : ""}
                disabled
                className="disabled-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gender">
              Gender <span className="required">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={data.gender === "male"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                />
                <span>Male</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={data.gender === "female"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                />
                <span>Female</span>
              </label>
            </div>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="diagnosis">Diagnosis</label>
            <textarea
              id="diagnosis"
              value={data.diagnosis}
              onChange={(e) => handleChange("diagnosis", e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="therapyName">
              Therapy Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="therapyName"
              value={data.therapyName}
              onChange={(e) => handleChange("therapyName", e.target.value)}
              className={errors.therapyName ? "error" : ""}
            />
            {errors.therapyName && <span className="error-message">{errors.therapyName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="totalSessionsPlanned">
              Total Sessions Planned <span className="required">*</span>
            </label>
            <input
              type="number"
              id="totalSessionsPlanned"
              value={data.totalSessionsPlanned}
              onChange={(e) => handleChange("totalSessionsPlanned", e.target.value)}
              min="1"
              className={errors.totalSessionsPlanned ? "error" : ""}
            />
            {errors.totalSessionsPlanned && (
              <span className="error-message">{errors.totalSessionsPlanned}</span>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>First Session</h2>

          <div className="form-group">
            <label htmlFor="sessionType">
              Session Type <span className="required">*</span>
            </label>
            <EditableSelect
              value={data.sessionType}
              onChange={(value) => handleChange("sessionType", value)}
              options={DEFAULT_SESSION_TYPES}
              placeholder="Select or type session type..."
              className={errors.sessionType ? "error" : ""}
            />
            {errors.sessionType && <span className="error-message">{errors.sessionType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="sessionDate">
              Session Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="sessionDate"
              value={data.sessionDate}
              onChange={(e) => handleChange("sessionDate", e.target.value)}
              className={errors.sessionDate ? "error" : ""}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.sessionDate && <span className="error-message">{errors.sessionDate}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Patient"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientCreate;

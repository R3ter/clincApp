import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import Navigation from "./components/Navigation";
import CompanyHeader from "./components/CompanyHeader";
import PatientsList from "./pages/PatientsList";
import SessionsList from "./pages/SessionsList";
import PatientCreate from "./pages/PatientCreate";
import PatientView from "./pages/PatientView";
import PatientEdit from "./pages/PatientEdit";
import SessionForm from "./pages/SessionForm";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navigation />
        <CompanyHeader />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/clinic/patients" replace />} />
            <Route path="/clinic/patients" element={<PatientsList />} />
            <Route path="/clinic/sessions" element={<SessionsList />} />
            <Route path="/clinic/patients/new" element={<PatientCreate />} />
            <Route path="/clinic/patients/:patientId" element={<PatientView />} />
            <Route path="/clinic/patients/:patientId/edit" element={<PatientEdit />} />
            <Route path="/clinic/patients/:patientId/sessions/new" element={<SessionForm />} />
            <Route
              path="/clinic/patients/:patientId/sessions/:sessionId/edit"
              element={<SessionForm />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

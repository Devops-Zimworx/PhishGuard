import React, { useState, useEffect } from "react";
import "./App.css";
import "./styles/variants.css";
import { LandingPage } from "./components/LandingPage";
import { SecurityAwarenessSuccess } from "./components/SecurityAwarenessSuccess";

type AppState = 'landing' | 'awareness';

interface SubmissionData {
  fullName: string;
  companyEmail: string;
  purpose: string;
  device: string;
  acceptPolicy: boolean;
  stayInformed: boolean;
  submittedAt: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);

  // I'm logging the current build env details before and after migrating to Vite.
  useEffect(() => {
    const isViteRuntime =
      typeof import.meta !== "undefined" && Boolean(import.meta.env);
    if (isViteRuntime) {
      const diagnosticPayload = {
        runtime: "vite",
        mode: import.meta.env.MODE,
        baseUrl: import.meta.env.BASE_URL,
        customEnvKeys: Object.keys(import.meta.env).filter((key) =>
          key.startsWith("VITE_")
        ),
      };
      console.info("[diagnostic] environment snapshot", diagnosticPayload);
    }
  }, []);

  const handleSubmit = (data: SubmissionData) => {
    console.info("[app] received submission", data);
    setSubmissionData(data);
    
    // Transition to awareness page after a short delay
    setTimeout(() => {
      setAppState('awareness');
    }, 800);
    
    // Future: Wire this up to Supabase or other backend
  };

  const handleAwarenessClose = () => {
    // Reset to landing page
    setAppState('landing');
    setSubmissionData(null);
  };

  if (appState === 'awareness' && submissionData) {
    return (
      <SecurityAwarenessSuccess
        variant="variant_a"
        submittedEmail={submissionData.companyEmail}
        submittedName={submissionData.fullName}
        onClose={handleAwarenessClose}
      />
    );
  }

  return <LandingPage onSubmit={handleSubmit} />;
}

export default App;

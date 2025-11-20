import React, { useEffect } from "react";
import "./App.css";
import "./styles/variants.css";
import { LandingPage } from "./components/LandingPage";

function App() {
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

  const handleSubmit = (data: any) => {
    console.info("[app] received submission", data);
    // Future: Wire this up to Supabase or other backend
  };

  return <LandingPage onSubmit={handleSubmit} />;
}

export default App;

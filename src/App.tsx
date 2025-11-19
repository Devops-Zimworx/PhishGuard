import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import "./styles/variants.css";

const DEVICE_OPTIONS = [
  { label: "Laptop / MacBook", value: "laptop" },
  { label: "Tablet", value: "tablet" },
  { label: "Mobile phone", value: "phone" },
  { label: "Other smart device", value: "other" },
];

const PURPOSE_OPTIONS = [
  "Guest access",
  "Contractor work session",
  "Logistics / deliveries",
  "Security team verification",
];

function App() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyEmail: "",
    purpose: PURPOSE_OPTIONS[0],
    device: DEVICE_OPTIONS[0].value,
    acceptPolicy: false,
    stayInformed: true,
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  );

  // I'm logging the current build env details before and after migrating to Vite.
  useEffect(() => {
    const isViteRuntime =
      typeof import.meta !== "undefined" && Boolean(import.meta.env);
    const diagnosticPayload = isViteRuntime
      ? {
          runtime: "vite",
          mode: import.meta.env.MODE,
          baseUrl: import.meta.env.BASE_URL,
          customEnvKeys: Object.keys(import.meta.env).filter((key) =>
            key.startsWith("VITE_")
          ),
        }
      : {
          runtime: "cra",
          nodeEnv: process.env.NODE_ENV,
          publicUrl: process.env.PUBLIC_URL,
          customEnvKeys: Object.keys(process.env || {}).filter((key) =>
            key.startsWith("REACT_APP_")
          ),
        };

    console.info("[diagnostic] environment snapshot", diagnosticPayload);
  }, []);

  const isFormValid = useMemo(() => {
    return (
      Boolean(formData.fullName.trim()) &&
      Boolean(formData.companyEmail.trim()) &&
      formData.acceptPolicy
    );
  }, [formData]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    const isCheckbox =
      target instanceof HTMLInputElement && target.type === "checkbox";
    const nextValue = isCheckbox ? target.checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || status === "submitting") {
      return;
    }

    setStatus("submitting");
    const submissionPayload = {
      ...formData,
      submittedAt: new Date().toISOString(),
    };
    console.info("[portal] wifi access request", submissionPayload);

    window.setTimeout(() => {
      setStatus("success");
    }, 800);
  };

  return (
    <div className="portal-shell">
      <header className="portal-hero">
        <div>
          <p className="eyebrow">Team Members Secure Portal</p>
          <h1>Connect to Zimworx Team Members Network</h1>
          <p className="lede">
            Request short-term access to our monitored team members network. We
            verify every session to keep the SOC informed and your data
            protected.
          </p>
          <div className="hero-pills">
            <span>24/7 SOC visibility</span>
            <span>Device fingerprinting</span>
            <span>Automatic session expiry</span>
          </div>
        </div>
        <div className="network-card">
          <p className="network-label">Active SSID</p>
          <p className="ssid">Zimworx-Guest-5G</p>
          <dl>
            <div>
              <dt>Bandwidth</dt>
              <dd>Up to 250 Mbps</dd>
            </div>
            <div>
              <dt>Session length</dt>
              <dd>4 hours (auto-renew)</dd>
            </div>
            <div>
              <dt>Last security sweep</dt>
              <dd>5 minutes ago</dd>
            </div>
          </dl>
        </div>
      </header>

      <main className="portal-grid">
        <section className="card">
          <form className="portal-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <h2>Request access</h2>
              <p>We will email you a one-time passphrase.</p>
            </div>

            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                name="fullName"
                placeholder="Ada Lovelace"
                value={formData.fullName}
                onChange={handleInputChange}
                autoComplete="name"
              />
            </label>

            <label className="field">
              <span>Company email</span>
              <input
                type="email"
                name="companyEmail"
                placeholder="ada@guestcompany.com"
                value={formData.companyEmail}
                onChange={handleInputChange}
                autoComplete="email"
              />
            </label>

            <label className="field">
              <span>Visit purpose</span>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
              >
                {PURPOSE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Primary device</span>
              <select
                name="device"
                value={formData.device}
                onChange={handleInputChange}
              >
                {DEVICE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                name="acceptPolicy"
                checked={formData.acceptPolicy}
                onChange={handleInputChange}
              />
              <span>
                I understand this network is monitored and agree to the
                acceptable use policy.
              </span>
            </label>

            <label className="checkbox optional">
              <input
                type="checkbox"
                name="stayInformed"
                checked={formData.stayInformed}
                onChange={handleInputChange}
              />
              <span>Keep me informed about future security drills.</span>
            </label>

            <button
              type="submit"
              disabled={!isFormValid || status === "submitting"}
            >
              {status === "success"
                ? "Passphrase sent"
                : status === "submitting"
                ? "Securing channel…"
                : "Generate access token"}
            </button>

            <p className="terms">
              All guest traffic is segmented and inspected. Reach out to the SOC
              desk on extension 777 if your session is flagged.
            </p>
          </form>
        </section>

        <section className="card info-card">
          <h2>What we monitor</h2>
          <ul>
            <li>Real-time packet inspection with anomaly scoring.</li>
            <li>Per-device session ledger for compliance reviews.</li>
            <li>Automatic QR source tagging to detect malicious swaps.</li>
            <li>Time-boxed credentials that expire after your visit.</li>
            <li>Instant revocation if the SOC sees suspicious activity.</li>
          </ul>

          <div className="alert">
            <p>
              Need a longer session? Submit a ticket or swing by the SOC window
              with your device ID ready.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

import React, { useState, useMemo } from 'react';
import '../styles/landing-page.css';

const DEVICE_OPTIONS = [
  { label: 'Laptop / MacBook', value: 'laptop' },
  { label: 'Tablet', value: 'tablet' },
  { label: 'Mobile phone', value: 'phone' },
  { label: 'Other smart device', value: 'other' },
];

const PURPOSE_OPTIONS = [
  'Guest access',
  'Contractor work session',
  'Logistics / deliveries',
  'Security team verification',
];

export interface LandingPageProps {
  onSubmit?: (data: any) => void;
}

export function LandingPage({ onSubmit }: LandingPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    companyEmail: '',
    purpose: PURPOSE_OPTIONS[0],
    device: DEVICE_OPTIONS[0].value,
    acceptPolicy: false,
    stayInformed: true,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

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
      target instanceof HTMLInputElement && target.type === 'checkbox';
    const nextValue = isCheckbox ? target.checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || status === 'submitting') {
      return;
    }

    setStatus('submitting');
    const submissionPayload = {
      ...formData,
      submittedAt: new Date().toISOString(),
    };
    
    console.info('[portal] wifi access request', submissionPayload);

    if (onSubmit) {
      onSubmit(submissionPayload);
    }

    window.setTimeout(() => {
      setStatus('success');
    }, 800);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-eyebrow">Zimworx Secure Portal</span>
          <h1 className="landing-title">Connect to Zimworx Guest Network</h1>
          <p className="landing-subtitle">
            Request secure access to our monitored guest network. We verify every 
            session to keep the SOC informed and your data protected.
          </p>
          <div className="landing-features">
            <div className="feature-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>24/7 SOC Monitoring</span>
            </div>
            <div className="feature-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span>Encrypted Connection</span>
            </div>
            <div className="feature-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Auto-Expiry Sessions</span>
            </div>
          </div>
        </div>

        <div className="network-info-card">
          <div className="network-status">
            <div className="status-indicator active"></div>
            <span>Network Active</span>
          </div>
          <h2 className="network-ssid">Zimworx-Guest-5G</h2>
          <div className="network-specs">
            <div className="spec-item">
              <span className="spec-label">Bandwidth</span>
              <span className="spec-value">Up to 250 Mbps</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Session Length</span>
              <span className="spec-value">4 hours (auto-renew)</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Security Sweep</span>
              <span className="spec-value">5 minutes ago</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        {/* Request Form */}
        <section className="landing-card landing-form-card">
          <div className="card-header">
            <h2>Request Access</h2>
            <p>We'll email you a one-time passphrase to connect</p>
          </div>

          <form className="access-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Ada Lovelace"
                value={formData.fullName}
                onChange={handleInputChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyEmail">Company Email</label>
              <input
                type="email"
                id="companyEmail"
                name="companyEmail"
                placeholder="ada@guestcompany.com"
                value={formData.companyEmail}
                onChange={handleInputChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="purpose">Visit Purpose</label>
              <select
                id="purpose"
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
            </div>

            <div className="form-group">
              <label htmlFor="device">Primary Device</label>
              <select
                id="device"
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
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                id="acceptPolicy"
                name="acceptPolicy"
                checked={formData.acceptPolicy}
                onChange={handleInputChange}
              />
              <label htmlFor="acceptPolicy">
                I understand this network is monitored and agree to the acceptable use policy.
              </label>
            </div>

            <div className="form-checkbox optional">
              <input
                type="checkbox"
                id="stayInformed"
                name="stayInformed"
                checked={formData.stayInformed}
                onChange={handleInputChange}
              />
              <label htmlFor="stayInformed">
                Keep me informed about future security updates.
              </label>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={!isFormValid || status === 'submitting'}
            >
              {status === 'success'
                ? '✓ Passphrase Sent'
                : status === 'submitting'
                ? 'Securing Channel...'
                : 'Generate Access Token'}
            </button>

            <p className="form-terms">
              All guest traffic is segmented and inspected. Contact SOC at ext. 777 
              if your session is flagged.
            </p>
          </form>
        </section>

        {/* Security Info */}
        <section className="landing-card landing-info-card">
          <div className="card-header">
            <h2>Security & Monitoring</h2>
            <p>How we protect your session</p>
          </div>

          <div className="info-content">
            <div className="info-item">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3>Real-time Inspection</h3>
                <p>Packet inspection with anomaly scoring for threat detection.</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <h3>Session Ledger</h3>
                <p>Per-device tracking for compliance and audit reviews.</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <rect x="7" y="7" width="10" height="10" />
                </svg>
              </div>
              <div>
                <h3>QR Source Tagging</h3>
                <p>Automatic detection of malicious QR code swaps.</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <h3>Time-boxed Access</h3>
                <p>Credentials expire automatically after your session.</p>
              </div>
            </div>

            <div className="alert-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <strong>Need Extended Access?</strong>
                <p>Submit a ticket or visit the SOC window with your device ID for longer sessions.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2025 Zimworx. All guest sessions are monitored for security compliance.</p>
      </footer>
    </div>
  );
}

export default LandingPage;

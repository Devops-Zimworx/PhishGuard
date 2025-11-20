import React, { useState, useEffect } from 'react';
import '../styles/security-awareness.css';
import type { Variant } from '../types';

export interface SecurityAwarenessSuccessProps {
  variant: Variant;
  submittedEmail?: string;
  submittedName?: string;
  onClose?: () => void;
}

export function SecurityAwarenessSuccess({ 
  variant, 
  submittedEmail,
  submittedName,
  onClose 
}: SecurityAwarenessSuccessProps) {
  const [revealed, setRevealed] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Automatically reveal after 2 seconds
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (revealed) {
      // Progress through education steps
      const stepTimer = setTimeout(() => {
        if (step < 3) {
          setStep(prev => prev + 1);
        }
      }, 800);

      return () => clearTimeout(stepTimer);
    }
  }, [revealed, step]);

  const warningSignsByVariant: Record<Variant, string[]> = {
    variant_a: [
      'Unsolicited request for company credentials',
      'Sense of urgency ("Connect immediately")',
      'Generic greeting instead of personalized message',
      'Unusual WiFi access request method',
      'No IT department verification process'
    ],
    variant_b: [
      'Appeal to privilege ("Executive WiFi")',
      'Promise of exclusive benefits (faster speed)',
      'Pressure to act quickly before verification',
      'Request for corporate email on untrusted form',
      'No official company branding or security markers'
    ]
  };

  if (!revealed) {
    return (
      <div className="awareness-success">
        <div className="loading-reveal">
          <div className="loading-spinner"></div>
          <h2>Processing your request...</h2>
          <p>Establishing secure connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="awareness-success revealed">
      <div className="reveal-container">
        {/* Alert Header */}
        <header className={`alert-header ${step >= 0 ? 'visible' : ''}`}>
          <div className="alert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="alert-content">
            <h1>⚠️ This Was a Security Awareness Simulation</h1>
            <p className="alert-subtitle">
              You just interacted with a simulated phishing attack designed by your security team.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="awareness-main">
          {/* What Happened */}
          <section className={`awareness-card ${step >= 1 ? 'visible' : ''}`}>
            <div className="card-icon success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <div className="card-content">
              <h2>What Just Happened?</h2>
              <p>
                {submittedName && <strong>Hi {submittedName}, </strong>}
                You submitted your information ({submittedEmail}) to what appeared to be a 
                legitimate WiFi access portal. However, this was actually a <strong>controlled 
                phishing simulation</strong> conducted by Zimworx's Security Operations Center (SOC).
              </p>
              <div className="info-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div>
                  <strong>Your data is safe!</strong>
                  <p>No actual phishing occurred. This was a training exercise to help you recognize threats.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Warning Signs */}
          <section className={`awareness-card ${step >= 2 ? 'visible' : ''}`}>
            <div className="card-icon warning-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="card-content">
              <h2>Warning Signs You Might Have Missed</h2>
              <p>Here are the red flags that indicated this was a phishing attempt:</p>
              <ul className="warning-list">
                {warningSignsByVariant[variant].map((sign, index) => (
                  <li key={index}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Best Practices */}
          <section className={`awareness-card ${step >= 3 ? 'visible' : ''}`}>
            <div className="card-icon tips-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="card-content">
              <h2>How to Protect Yourself</h2>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-number">1</div>
                  <h3>Verify the Source</h3>
                  <p>Always confirm the sender's identity through official channels before submitting credentials.</p>
                </div>
                <div className="tip-card">
                  <div className="tip-number">2</div>
                  <h3>Check URLs Carefully</h3>
                  <p>Inspect website URLs for misspellings, unusual domains, or missing security certificates.</p>
                </div>
                <div className="tip-card">
                  <div className="tip-number">3</div>
                  <h3>Be Skeptical of Urgency</h3>
                  <p>Phishers create false urgency. Take time to verify before acting on urgent requests.</p>
                </div>
                <div className="tip-card">
                  <div className="tip-number">4</div>
                  <h3>Use Official Channels</h3>
                  <p>Access company services through bookmarked links or official apps, not QR codes or emails.</p>
                </div>
                <div className="tip-card">
                  <div className="tip-number">5</div>
                  <h3>Report Suspicious Activity</h3>
                  <p>When in doubt, contact IT Security (ext. 777) before submitting any information.</p>
                </div>
                <div className="tip-card">
                  <div className="tip-number">6</div>
                  <h3>Enable MFA</h3>
                  <p>Multi-factor authentication adds an extra layer of protection even if credentials are compromised.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className={`awareness-card stats-card ${step >= 3 ? 'visible' : ''}`}>
            <div className="stats-header">
              <h2>Why This Matters</h2>
              <p>Real-world phishing statistics</p>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">91%</div>
                <div className="stat-label">of cyber attacks start with phishing emails</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">$4.91M</div>
                <div className="stat-label">average cost of a data breach in 2024</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">3.4B</div>
                <div className="stat-label">phishing emails sent every day globally</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">83%</div>
                <div className="stat-label">of organizations experienced phishing attacks in 2024</div>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section className={`awareness-card action-card ${step >= 3 ? 'visible' : ''}`}>
            <div className="action-content">
              <h2>📚 Next Steps</h2>
              <div className="action-list">
                <div className="action-item">
                  <div className="action-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3>Complete Security Training</h3>
                    <p>Review the full security awareness course in the Learning Portal</p>
                    <a href="#" className="action-link">Go to Training →</a>
                  </div>
                </div>
                <div className="action-item">
                  <div className="action-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div>
                    <h3>Review Security Policies</h3>
                    <p>Familiarize yourself with company security guidelines</p>
                    <a href="#" className="action-link">View Policies →</a>
                  </div>
                </div>
                <div className="action-item">
                  <div className="action-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3>Contact Security Team</h3>
                    <p>Questions about this simulation? Reach out to SOC</p>
                    <a href="#" className="action-link">Email Security →</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer Actions */}
        <footer className="awareness-footer">
          <div className="footer-message">
            <p>
              <strong>Thank you for participating!</strong> This exercise helps us build a more 
              security-conscious culture. Your awareness is our first line of defense.
            </p>
          </div>
          <div className="footer-actions">
            <button className="btn-secondary" onClick={onClose}>
              Return to Dashboard
            </button>
            <button className="btn-primary" onClick={() => window.print()}>
              Download Certificate
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SecurityAwarenessSuccess;

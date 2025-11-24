import { FormEvent } from "react";
import type { SubmissionPayload, Variant } from "../types";

export type WifiPortalProps = {
  variant: Variant;
  defaultLocationTag?: string;
  onSubmit?: (payload: SubmissionPayload) => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

const variantCopy: Record<
  Variant,
  { headline: string; body: string; buttonText: string }
> = {
  variant_a: {
    headline: "Free Guest WiFi - Scan to Connect",
    body: "Enjoy secure guest connectivity with standard speeds approved by IT.",
    buttonText: "Request Access",
  },
  variant_b: {
    headline: "Executive WiFi - Faster Speed - Scan Here",
    body: "Unlock priority bandwidth that keeps your critical projects moving.",
    buttonText: "Get Access Now",
  },
};

export function WifiPortal({
  variant,
  defaultLocationTag,
  onSubmit,
  isSubmitting = false,
  errorMessage,
}: WifiPortalProps) {
  const copy = variantCopy[variant];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return; // Prevent double submission

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const locationTag =
      String(formData.get("locationTag") ?? "").trim() || defaultLocationTag;

    if (onSubmit) {
      onSubmit({ email, locationTag, variant });
    }
  };

  return (
    <div className="portal-shell">
      <div className="portal-container">
        <section className={`wifi-portal wifi-portal--${variant}`}>
          {/* Header with Branding */}
          <header className="portal-header">
            <div className="brand-mark">
              <div className="wifi-icon">📶</div>
              <div className="brand-text">ZIMWORX</div>
            </div>
            <h1 className="portal-headline">{copy.headline}</h1>
            <p className="portal-body">{copy.body}</p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="portal-form-wifi">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Company Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@zimworx.org"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Location field - hidden but will capture from URL or user can optionally fill */}
            {!defaultLocationTag && (
              <div className="form-group">
                <label htmlFor="locationTag" className="form-label-optional">
                  Location (optional)
                </label>
                <select
                  id="locationTag"
                  name="locationTag"
                  className="form-input"
                  disabled={isSubmitting}
                >
                  <option value="">Select a location</option>
                  <option value="The Grind">The Grind</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="7th Floor">7th Floor</option>
                  <option value="8th Floor">8th Floor</option>
                  <option value="9th Floor">9th Floor</option>
                  <option value="11th Floor">11th Floor</option>
                  <option value="13th Floor">13th Floor</option>
                  <option value="14th Floor">14th Floor</option>
                  <option value="Basement">Basement</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            {/* Error Message - styled to look like a network issue, not a security alert */}
            {errorMessage && !isSubmitting && (
              <div className="portal-error" role="alert">
                <span className="error-icon">⚠️</span>
                <span className="error-text">
                  Connection issue. Please try again.
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`portal-button portal-button--${variant}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Connecting...
                </>
              ) : (
                copy.buttonText
              )}
            </button>

            {/* Footer Info */}
            <p className="portal-footer-text">
              By connecting, you agree to Zimworx's network usage policy.
            </p>
          </form>
        </section>

        {/* Additional Trust Indicators */}
        <div className="trust-badges">
          <div className="trust-badge">
            <span className="badge-icon">🔒</span>
            <span className="badge-text">Secure Connection</span>
          </div>
          <div className="trust-badge">
            <span className="badge-icon">✓</span>
            <span className="badge-text">IT Approved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WifiPortal;

import { FormEvent } from 'react';
import type { SubmissionPayload, Variant } from '../types';

export type WifiPortalProps = {
  variant: Variant;
  defaultLocationTag?: string;
  onSubmit?: (payload: SubmissionPayload) => void;
};

const variantCopy: Record<Variant, { headline: string; body: string }> = {
  variant_a: {
    headline: 'Free Guest WiFi - Scan to Connect',
    body: 'Enjoy secure guest connectivity with standard speeds approved by IT.',
  },
  variant_b: {
    headline: 'Executive WiFi - Faster Speed - Scan Here',
    body: 'Unlock priority bandwidth that keeps your critical projects moving.',
  },
};

export function WifiPortal({ variant, defaultLocationTag, onSubmit }: WifiPortalProps) {
  const copy = variantCopy[variant];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const locationTag = String(formData.get('locationTag') ?? '').trim() || defaultLocationTag;

    if (onSubmit) {
      // TODO: I intend to wire this form up to useSubmission once the hook is ready.
      onSubmit({ email, locationTag, variant });
    }
  };

  return (
    <section className={`wifi-portal wifi-portal--${variant}`}>
      <header>
        <h1>{copy.headline}</h1>
        <p>{copy.body}</p>
      </header>

      <form onSubmit={handleSubmit}>
        <label>
          Company Email
          <input name="email" type="email" placeholder="you@zimworx.com" required />
        </label>

        <label>
          Location Tag (optional)
          <input name="locationTag" type="text" placeholder={defaultLocationTag ?? 'breakroom'} />
        </label>

        <button type="submit">Request Access</button>
      </form>
    </section>
  );
}

export default WifiPortal;

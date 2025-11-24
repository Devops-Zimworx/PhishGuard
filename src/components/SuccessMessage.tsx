import type { Variant } from '../types';

export type SuccessMessageProps = {
  variant: Variant;
  submittedEmail?: string;
};

const variantSuccessCopy: Record<Variant, { title: string; subtitle: string }> = {
  variant_a: {
    title: 'Connected! Check your inbox.',
    subtitle: 'Access details arrive shortly. Keep this page open for confirmation.',
  },
  variant_b: {
    title: 'Access granted! Enjoy high-speed executive bandwidth.',
    subtitle: 'We just sent the secure credentials to your inbox.',
  },
};

export function SuccessMessage({ variant, submittedEmail }: SuccessMessageProps) {
  const copy = variantSuccessCopy[variant];

  return (
    <section className={`success-message success-message--${variant}`}>
      <h2>{copy.title}</h2>
      <p>{copy.subtitle}</p>
      {submittedEmail && <p className="success-message__email">Sent to: {submittedEmail}</p>}
    </section>
  );
}

export default SuccessMessage;

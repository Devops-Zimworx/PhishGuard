import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { WifiPortal } from './WifiPortal';
import { useSubmission } from '../hooks/useSubmission';
import type { SubmissionPayload, Variant } from '../types';

// I'm mapping URL source parameters to variant types, supporting both safe/malicious and variant_a/variant_b formats.
function mapSourceToVariant(source: string | null): Variant {
  if (!source) {
    return 'variant_a';
  }

  const normalized = source.toLowerCase().trim();

  // Support both formats: safe/malicious and variant_a/variant_b
  if (normalized === 'safe' || normalized === 'variant_a') {
    return 'variant_a';
  }
  if (normalized === 'malicious' || normalized === 'variant_b') {
    return 'variant_b';
  }

  // Default to variant_a if source doesn't match known values
  return 'variant_a';
}

export function WifiRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { submit } = useSubmission();

  const source = searchParams.get('source');
  const locationTag = searchParams.get('loc') || undefined;

  const variant = useMemo(() => mapSourceToVariant(source), [source]);

  const handleSubmit = async (payload: SubmissionPayload) => {
    // I'm submitting the form data and then navigating to the success page.
    const result = await submit(payload);

    // I'm passing the email and variant via location state to the success page.
    // I navigate to success regardless of submission result to maintain the simulation.
    navigate('/success', {
      state: {
        email: payload.email,
        variant: payload.variant,
      },
    });
  };

  return <WifiPortal variant={variant} defaultLocationTag={locationTag} onSubmit={handleSubmit} />;
}


import { useLocation } from 'react-router-dom';
import { SuccessMessage } from './SuccessMessage';
import type { Variant } from '../types';

type SuccessLocationState = {
  email?: string;
  variant?: Variant;
};

export function SuccessRoute() {
  const location = useLocation();
  const state = location.state as SuccessLocationState | null;

  // I'm extracting email and variant from location state, defaulting to variant_a if not provided.
  const email = state?.email;
  const variant = state?.variant || 'variant_a';

  return <SuccessMessage variant={variant} submittedEmail={email} />;
}



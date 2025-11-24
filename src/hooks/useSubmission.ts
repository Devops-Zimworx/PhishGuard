import { useCallback, useState } from 'react';
import type { SubmissionPayload, SubmissionRecord } from '../types';
import { useSupabaseClient } from './useSupabaseClient';

export type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export function useSubmission() {
  const supabase = useSupabaseClient();
  const [state, setState] = useState<SubmissionState>('idle');
  const [lastSubmission, setLastSubmission] = useState<SubmissionRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = useCallback(
    async (payload: SubmissionPayload) => {
      if (!supabase) {
        setErrorMessage('Supabase client unavailable.');
        return null;
      }

      try {
        setState('submitting');
        setErrorMessage(null);

        // Capture user agent from browser
        const userAgent = navigator.userAgent;

        // Note: IP address capture requires server-side implementation or third-party service
        // For now, we'll let Supabase RLS or edge functions handle IP on the backend
        // Map camelCase payload to snake_case database columns
        const dbPayload = {
          email: payload.email,
          variant: payload.variant,
          location_tag: payload.locationTag || null,
          user_agent: userAgent,
          ip_address: null, // To be captured server-side
        };

        const { data, error } = await supabase
          .from('phishing_submissions')
          .insert(dbPayload)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setLastSubmission(data as SubmissionRecord);
        setState('success');
        return data as SubmissionRecord;
      } catch (error) {
        console.error('Failed to submit payload', error);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        setState('error');
        return null;
      }
    },
    [supabase],
  );

  return { submit, state, lastSubmission, errorMessage } as const;
}

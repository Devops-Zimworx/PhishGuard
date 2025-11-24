import { useCallback, useState } from 'react';
import type { SubmissionPayload, SubmissionRecord } from '../types';
import { useSupabaseClient } from './useSupabaseClient';
import { fetchClientIp } from '../utils/ip';
import { mapSubmissionFromDb } from '../utils/submissionMapper';

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

        // I capture the client IP best-effort via ipify before persisting.
        const ipAddress = await fetchClientIp();

        // I map camelCase payload to the snake_case columns Supabase expects.
        const dbPayload = {
          email: payload.email,
          variant: payload.variant,
          location_tag: payload.locationTag || null,
          user_agent: userAgent,
          ip_address: ipAddress,
        };

        console.debug('[useSubmission] inserting payload', dbPayload);

        const { data, error } = await supabase
          .from('phishing_submissions')
          .insert(dbPayload)
          .select()
          .single();

        console.debug('[useSubmission] raw Supabase response', {
          id: data?.id,
          location_tag: data?.location_tag,
          ip_address: data?.ip_address,
        });

        if (error) {
          throw error;
        }

        const normalizedRecord = mapSubmissionFromDb(data as any);
        setLastSubmission(normalizedRecord);
        setState('success');
        return normalizedRecord;
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

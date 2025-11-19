import { useCallback, useState } from 'react';
import type { SubmissionPayload, SubmissionRecord } from '../types';
import { useSupabase } from './useSupabase';

export type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export function useSubmission() {
  const supabase = useSupabase();
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
        // TODO: I want to extend this to capture IP/user agent server-side later.
        const { data, error } = await supabase
          .from('phishing_submissions')
          .insert(payload)
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

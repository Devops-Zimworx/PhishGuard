import { useState, useCallback, useEffect } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getSupabaseClient } from '../utils/supabase';
import { fetchClientIp } from '../utils/ip';
import { mapSubmissionArray, mapSubmissionFromDb } from '../utils/submissionMapper';
import type {
  SubmissionFormData,
  SubmissionRecord,
  SubmissionFilters,
  QRSource,
} from '../types';

// Default page size for pagination when limit is not specified
const DEFAULT_PAGE_SIZE = 20;

// Loading states for each operation to prevent race conditions
export interface LoadingStates {
  adding: boolean;
  fetching: boolean;
  subscribing: boolean;
}

export interface UseSupabaseReturn {
  addSubmission: (
    data: SubmissionFormData,
    source: QRSource
  ) => Promise<SubmissionRecord | null>;
  getSubmissions: (filters?: SubmissionFilters) => Promise<SubmissionRecord[]>;
  subscribeToSubmissions: (
    callback: (payload: SubmissionRecord) => void
  ) => () => void;
  loading: LoadingStates;
  error: string | null;
}

export function useSupabase(): UseSupabaseReturn {
  const [loading, setLoading] = useState<LoadingStates>({
    adding: false,
    fetching: false,
    subscribing: false,
  });
  const [error, setError] = useState<string | null>(null);

  const addSubmission = useCallback(
    async (
      data: SubmissionFormData,
      source: QRSource
    ): Promise<SubmissionRecord | null> => {
      setLoading((prev) => ({ ...prev, adding: true }));
      setError(null);

      try {
        const supabase = getSupabaseClient();

        // Capture user agent from browser
        const userAgent = navigator.userAgent;

        // Map QRSource to database variant
        // 'safe' QR codes are variant_a, 'malicious' are variant_b
        const variant = source === 'safe' ? 'variant_a' : 'variant_b';

        const ipAddress = await fetchClientIp();

        // I map the QR submission payload into the snake_case schema Supabase expects.
        const dbPayload = {
          email: data.email,
          variant,
          user_agent: userAgent,
          ip_address: ipAddress,
          location_tag: data.locationTag || null,
        };

        console.debug('[useSupabase.addSubmission] inserting payload', dbPayload);

        const { data: insertedData, error: insertError } = await supabase
          .from('phishing_submissions')
          .insert(dbPayload)
          .select()
          .single();

        console.debug('[useSupabase.addSubmission] raw Supabase response', {
          id: insertedData?.id,
          location_tag: insertedData?.location_tag,
          ip_address: insertedData?.ip_address,
        });

        if (insertError) {
          throw insertError;
        }

        setLoading((prev) => ({ ...prev, adding: false }));
        return mapSubmissionFromDb(insertedData as any);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to add submission';
        setError(errorMessage);
        setLoading((prev) => ({ ...prev, adding: false }));
        console.error('Error adding submission:', err);
        return null;
      }
    },
    []
  );

  const getSubmissions = useCallback(
    async (filters?: SubmissionFilters): Promise<SubmissionRecord[]> => {
      setLoading((prev) => ({ ...prev, fetching: true }));
      setError(null);

      try {
        const supabase = getSupabaseClient();

        let query = supabase
          .from('phishing_submissions')
          .select('*')
          .order('timestamp', { ascending: false });

        // Apply filters
        if (filters) {
          if (filters.variant) {
            query = query.eq('variant', filters.variant);
          }

          if (filters.startDate) {
            query = query.gte('timestamp', filters.startDate);
          }

          if (filters.endDate) {
            query = query.lte('timestamp', filters.endDate);
          }

          if (filters.locationTag) {
            query = query.eq('location_tag', filters.locationTag);
          }

          if (filters.limit) {
            query = query.limit(filters.limit);
          }

          if (filters.offset) {
            query = query.range(
              filters.offset,
              filters.offset + (filters.limit || DEFAULT_PAGE_SIZE) - 1
            );
          }
        }

        const { data, error: queryError } = await query;

        console.debug('[useSupabase.getSubmissions] raw Supabase rows preview', (data || []).slice(0, 3).map((row) => ({
          id: row.id,
          location_tag: row.location_tag,
          ip_address: row.ip_address,
        })));

        if (queryError) {
          throw queryError;
        }

        setLoading((prev) => ({ ...prev, fetching: false }));
        return mapSubmissionArray(data as any);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch submissions';
        setError(errorMessage);
        setLoading((prev) => ({ ...prev, fetching: false }));
        console.error('Error fetching submissions:', err);
        return [];
      }
    },
    []
  );

  const subscribeToSubmissions = useCallback(
    (callback: (payload: SubmissionRecord) => void): (() => void) => {
      const supabase = getSupabaseClient();
      let channel: RealtimeChannel | null = null;

      try {
        setLoading((prev) => ({ ...prev, subscribing: true }));

        channel = supabase
          .channel('phishing_submissions_changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'phishing_submissions',
            },
            (payload) => {
              console.debug('[useSupabase.subscribe] realtime insert payload', {
                id: (payload.new as any)?.id,
                location_tag: (payload.new as any)?.location_tag,
                ip_address: (payload.new as any)?.ip_address,
              });
              callback(mapSubmissionFromDb(payload.new as any));
            }
          )
          .subscribe();

        setLoading((prev) => ({ ...prev, subscribing: false }));
      } catch (err) {
        console.error('Error subscribing to submissions:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to subscribe to real-time updates'
        );
        setLoading((prev) => ({ ...prev, subscribing: false }));
      }

      // Always return cleanup function, even if subscription failed
      // This prevents memory leaks in all cases
      return () => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    },
    []
  );

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    addSubmission,
    getSubmissions,
    subscribeToSubmissions,
    loading,
    error,
  };
}

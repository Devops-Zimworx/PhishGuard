import { useState, useEffect } from 'react';
import { AdminDashboard } from './AdminDashboard';
import { useSupabaseClient } from '../hooks/useSupabaseClient';
import type { SubmissionRecord } from '../types';

export function AdminRoute() {
  const supabase = useSupabaseClient();
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // I'm fetching submissions from Supabase when the component mounts.
  useEffect(() => {
    async function fetchSubmissions() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('phishing_submissions')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) {
          console.error('Failed to fetch submissions', error);
        } else {
          setSubmissions((data as SubmissionRecord[]) || []);
        }
      } catch (error) {
        console.error('Error fetching submissions', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [supabase]);

  const handleRevealToggle = async (submissionId: string, nextState: boolean) => {
    if (!supabase) {
      return;
    }

    try {
      const { error } = await supabase
        .from('phishing_submissions')
        .update({ revealed: nextState })
        .eq('id', submissionId);

      if (error) {
        console.error('Failed to update reveal status', error);
      } else {
        // I'm updating the local state to reflect the change immediately.
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === submissionId ? { ...sub, revealed: nextState } : sub))
        );
      }
    } catch (error) {
      console.error('Error updating reveal status', error);
    }
  };

  if (loading) {
    return (
      <section className="admin-dashboard">
        <p>Loading submissions...</p>
      </section>
    );
  }

  return <AdminDashboard submissions={submissions} onRevealToggle={handleRevealToggle} />;
}



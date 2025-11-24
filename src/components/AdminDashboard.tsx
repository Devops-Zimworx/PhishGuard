import { useMemo } from 'react';
import type { SubmissionRecord } from '../types';

export type AdminDashboardProps = {
  submissions?: SubmissionRecord[];
  onRevealToggle?: (submissionId: string, nextState: boolean) => void;
  onLogout?: () => void;
};

export function AdminDashboard({ submissions = [], onRevealToggle, onLogout }: AdminDashboardProps) {
  const totals = useMemo(() => {
    const base = { variant_a: 0, variant_b: 0 };
    for (const submission of submissions) {
      base[submission.variant] += 1;
    }
    return base;
  }, [submissions]);

  return (
    <section className="admin-dashboard">
      <header>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Real-time monitoring for QR phishing simulation.</p>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="admin-dashboard__logout">
            Logout
          </button>
        )}
      </header>

      <div className="admin-dashboard__stats">
        <article>
          <h2>Variant A</h2>
          <strong>{totals.variant_a}</strong>
        </article>
        <article>
          <h2>Variant B</h2>
          <strong>{totals.variant_b}</strong>
        </article>
      </div>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Variant</th>
            <th>Location</th>
            <th>Timestamp</th>
            <th>Revealed</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.email}</td>
              <td>{submission.variant}</td>
              <td>{submission.locationTag ?? '—'}</td>
              <td>{new Date(submission.timestamp).toLocaleString()}</td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={submission.revealed}
                    onChange={(event) => onRevealToggle?.(submission.id, event.target.checked)}
                  />
                  <span>{submission.revealed ? 'Notified' : 'Pending'}</span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </section>
  );
}

export default AdminDashboard;

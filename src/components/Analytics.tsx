import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import type { TimelinePoint, LocationStat } from '../types';

export type AnalyticsProps = {
  timeline?: TimelinePoint[];
  locationTotals?: LocationStat[];
};

const emptyTimeline: TimelinePoint[] = [{ timestamp: new Date().toISOString(), variant_a: 0, variant_b: 0 }];
const emptyLocations: LocationStat[] = [{ location: 'breakroom', count: 0 }];

export function Analytics({ timeline = emptyTimeline, locationTotals = emptyLocations }: AnalyticsProps) {
  return (
    <section className="analytics-panel">
      <header>
        <h1>Analytics Overview</h1>
        <p>Compare variant performance and monitor hotspots.</p>
      </header>

      <div className="analytics-panel__charts">
        <article>
          <h2>Submissions Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeline}>
              <XAxis dataKey="timestamp" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="variant_a" stroke="#1d4ed8" />
              <Line type="monotone" dataKey="variant_b" stroke="#dc2626" />
            </LineChart>
          </ResponsiveContainer>
        </article>

        <article>
          <h2>Location Hotspots</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationTotals}>
              <XAxis dataKey="location" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f172a" />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </div>

      {/* TODO: I will replace mocked data with Supabase subscriptions later. */}
    </section>
  );
}

export default Analytics;

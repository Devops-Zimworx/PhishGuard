import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SubmissionRecord } from '../types';

export type AdminAnalyticsProps = {
  submissions: SubmissionRecord[];
};

const COLORS = {
  variant_a: '#3b82f6', // Blue
  variant_b: '#ec4899', // Pink
};

export function AdminAnalytics({ submissions }: AdminAnalyticsProps) {
  // Variant distribution data for pie chart
  const variantData = useMemo(() => {
    const variantA = submissions.filter((s) => s.variant === 'variant_a').length;
    const variantB = submissions.filter((s) => s.variant === 'variant_b').length;

    return [
      { name: 'Variant A', value: variantA, color: COLORS.variant_a },
      { name: 'Variant B', value: variantB, color: COLORS.variant_b },
    ];
  }, [submissions]);

  // Daily submissions data for bar chart (last 7 days)
  const dailyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return last7Days.map((date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const daySubmissions = submissions.filter((s) => {
        const subDate = new Date(s.timestamp);
        return subDate >= date && subDate < nextDay;
      });

      const variantA = daySubmissions.filter((s) => s.variant === 'variant_a').length;
      const variantB = daySubmissions.filter((s) => s.variant === 'variant_b').length;

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'Variant A': variantA,
        'Variant B': variantB,
        total: variantA + variantB,
      };
    });
  }, [submissions]);

  // Cumulative submissions over time for line chart (last 14 days)
  const timelineData = useMemo(() => {
    if (submissions.length === 0) return [];

    // Get date range
    const now = new Date();
    const last14Days = new Date();
    last14Days.setDate(last14Days.getDate() - 13);
    last14Days.setHours(0, 0, 0, 0);

    // Sort submissions by date
    const sorted = [...submissions].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Get submissions in the last 14 days
    const recentSubmissions = sorted.filter(
      (s) => new Date(s.timestamp) >= last14Days
    );

    if (recentSubmissions.length === 0) return [];

    // Create daily data points
    const days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(last14Days);
      date.setDate(date.getDate() + i);
      return date;
    });

    let cumulativeA = 0;
    let cumulativeB = 0;

    return days.map((date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const daySubmissions = recentSubmissions.filter((s) => {
        const subDate = new Date(s.timestamp);
        return subDate >= date && subDate < nextDay;
      });

      cumulativeA += daySubmissions.filter((s) => s.variant === 'variant_a').length;
      cumulativeB += daySubmissions.filter((s) => s.variant === 'variant_b').length;

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'Variant A': cumulativeA,
        'Variant B': cumulativeB,
      };
    });
  }, [submissions]);

  // Location distribution data for bar chart
  const locationData = useMemo(() => {
    const locationCounts: { [key: string]: { variantA: number; variantB: number } } = {};

    submissions.forEach((s) => {
      const location = s.locationTag || 'Unknown';
      if (!locationCounts[location]) {
        locationCounts[location] = { variantA: 0, variantB: 0 };
      }

      if (s.variant === 'variant_a') {
        locationCounts[location].variantA++;
      } else {
        locationCounts[location].variantB++;
      }
    });

    // Convert to array and sort by total count (descending)
    return Object.entries(locationCounts)
      .map(([location, counts]) => ({
        location,
        'Variant A': counts.variantA,
        'Variant B': counts.variantB,
        total: counts.variantA + counts.variantB,
      }))
      .sort((a, b) => b.total - a.total);
  }, [submissions]);

  // Summary stats
  const stats = useMemo(() => {
    const total = submissions.length;
    const variantA = submissions.filter((s) => s.variant === 'variant_a').length;
    const variantB = submissions.filter((s) => s.variant === 'variant_b').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = submissions.filter(
      (s) => new Date(s.timestamp) >= today
    ).length;

    // Get top location
    const topLocation = locationData.length > 0 ? locationData[0].location : 'N/A';
    const uniqueLocations = locationData.length;

    return {
      total,
      variantA,
      variantB,
      variantAPercent: total > 0 ? ((variantA / total) * 100).toFixed(1) : '0',
      variantBPercent: total > 0 ? ((variantB / total) * 100).toFixed(1) : '0',
      todayCount,
      topLocation,
      uniqueLocations,
    };
  }, [submissions, locationData]);

  if (submissions.length === 0) {
    return (
      <div className="admin-analytics">
        <div className="analytics-empty">
          <p>No data available for visualization</p>
          <p className="analytics-empty-hint">
            Charts will appear once submissions are received
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-analytics">
      <header className="analytics-header">
        <h2>Analytics & Insights</h2>
        <p>Visual breakdown of phishing simulation data</p>
      </header>

      {/* Summary Cards */}
      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Submissions</h3>
          <p className="summary-value">{stats.total}</p>
        </div>
        <div className="summary-card">
          <h3>Variant A</h3>
          <p className="summary-value">
            {stats.variantA}
            <span className="summary-percent">({stats.variantAPercent}%)</span>
          </p>
        </div>
        <div className="summary-card">
          <h3>Variant B</h3>
          <p className="summary-value">
            {stats.variantB}
            <span className="summary-percent">({stats.variantBPercent}%)</span>
          </p>
        </div>
        <div className="summary-card">
          <h3>Today</h3>
          <p className="summary-value">{stats.todayCount}</p>
        </div>
        <div className="summary-card">
          <h3>Top Location</h3>
          <p className="summary-value summary-value-small">{stats.topLocation}</p>
        </div>
        <div className="summary-card">
          <h3>Unique Locations</h3>
          <p className="summary-value">{stats.uniqueLocations}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts">
        {/* Pie Chart - Variant Distribution */}
        <div className="chart-card">
          <h3 className="chart-title">Variant Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={variantData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {variantData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Submissions Over Time */}
        <div className="chart-card chart-card-wide">
          <h3 className="chart-title">Cumulative Submissions (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Variant A"
                stroke={COLORS.variant_a}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Variant B"
                stroke={COLORS.variant_b}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Daily Breakdown */}
        <div className="chart-card chart-card-wide">
          <h3 className="chart-title">Daily Submissions (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Variant A" fill={COLORS.variant_a} />
              <Bar dataKey="Variant B" fill={COLORS.variant_b} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Location Distribution */}
        <div className="chart-card chart-card-wide">
          <h3 className="chart-title">Submissions by Location</h3>
          <ResponsiveContainer width="100%" height={Math.max(300, locationData.length * 40)}>
            <BarChart data={locationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="location" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Variant A" fill={COLORS.variant_a} stackId="a" />
              <Bar dataKey="Variant B" fill={COLORS.variant_b} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;

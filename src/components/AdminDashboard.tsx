import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminAnalytics } from './AdminAnalytics';
import { ExportControls } from './ExportControls';
import type { SubmissionRecord } from '../types';

export type AdminDashboardProps = {
  submissions?: SubmissionRecord[];
  onRevealToggle?: (submissionId: string, nextState: boolean) => void;
  onBulkReveal?: (submissionIds: string[]) => void;
  onLogout?: () => void;
};

type SortColumn = 'email' | 'variant' | 'locationTag' | 'timestamp' | 'revealed';
type SortDirection = 'asc' | 'desc';

export function AdminDashboard({
  submissions = [],
  onRevealToggle,
  onBulkReveal,
  onLogout,
}: AdminDashboardProps) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [variantFilter, setVariantFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [revealedFilter, setRevealedFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting states
  const [sortColumn, setSortColumn] = useState<SortColumn>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Selection states
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locations = new Set(
      submissions
        .map((s) => s.locationTag)
        .filter((loc): loc is string => loc != null && loc !== '')
    );
    return Array.from(locations).sort();
  }, [submissions]);

  // Statistics
  const stats = useMemo(() => {
    const total = submissions.length;
    const variantA = submissions.filter((s) => s.variant === 'variant_a').length;
    const variantB = submissions.filter((s) => s.variant === 'variant_b').length;
    const revealed = submissions.filter((s) => s.revealed).length;
    const unrevealed = total - revealed;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = submissions.filter(
      (s) => new Date(s.timestamp) >= today
    ).length;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const weekCount = submissions.filter(
      (s) => new Date(s.timestamp) >= weekAgo
    ).length;

    return {
      total,
      variantA,
      variantB,
      variantAPercent: total > 0 ? ((variantA / total) * 100).toFixed(1) : '0',
      variantBPercent: total > 0 ? ((variantB / total) * 100).toFixed(1) : '0',
      revealed,
      unrevealed,
      todayCount,
      weekCount,
    };
  }, [submissions]);

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...submissions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((s) => s.email.toLowerCase().includes(query));
    }

    // Apply variant filter
    if (variantFilter !== 'all') {
      filtered = filtered.filter((s) => s.variant === variantFilter);
    }

    // Apply location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter((s) => s.locationTag === locationFilter);
    }

    // Apply revealed filter
    if (revealedFilter !== 'all') {
      const isRevealed = revealedFilter === 'revealed';
      filtered = filtered.filter((s) => s.revealed === isRevealed);
    }

    // Apply date range filter
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((s) => new Date(s.timestamp) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((s) => new Date(s.timestamp) <= end);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortColumn) {
        case 'email':
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case 'variant':
          aVal = a.variant;
          bVal = b.variant;
          break;
        case 'locationTag':
          aVal = a.locationTag || '';
          bVal = b.locationTag || '';
          break;
        case 'timestamp':
          aVal = new Date(a.timestamp).getTime();
          bVal = new Date(b.timestamp).getTime();
          break;
        case 'revealed':
          aVal = a.revealed ? 1 : 0;
          bVal = b.revealed ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    submissions,
    searchQuery,
    variantFilter,
    locationFilter,
    revealedFilter,
    startDate,
    endDate,
    sortColumn,
    sortDirection,
  ]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  // Handle sort column click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((s) => s.id)));
    }
  };

  // Handle individual selection
  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Handle bulk reveal
  const handleBulkRevealClick = () => {
    if (selectedIds.size > 0 && onBulkReveal) {
      onBulkReveal(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, variantFilter, locationFilter, revealedFilter, startDate, endDate]);

  const isAllSelected = paginatedData.length > 0 && selectedIds.size === paginatedData.length;

  return (
    <section className="admin-dashboard">
      {/* Header */}
      <header className="admin-dashboard__header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Real-time monitoring for phishing simulation</p>
        </div>
        <div className="admin-dashboard__header-actions">
          <Link to="/generate" className="admin-dashboard__qr-link">
            Generate QR Codes
          </Link>
          {onLogout && (
            <button onClick={onLogout} className="admin-dashboard__logout">
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Statistics Panel */}
      <div className="admin-dashboard__stats">
        <div className="stat-card">
          <h3>Total Submissions</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Variant A</h3>
          <p className="stat-value">
            {stats.variantA} <span className="stat-percent">({stats.variantAPercent}%)</span>
          </p>
        </div>
        <div className="stat-card">
          <h3>Variant B</h3>
          <p className="stat-value">
            {stats.variantB} <span className="stat-percent">({stats.variantBPercent}%)</span>
          </p>
        </div>
        <div className="stat-card">
          <h3>Revealed</h3>
          <p className="stat-value">{stats.revealed}</p>
        </div>
        <div className="stat-card">
          <h3>Unrevealed</h3>
          <p className="stat-value">{stats.unrevealed}</p>
        </div>
        <div className="stat-card">
          <h3>This Week</h3>
          <p className="stat-value">{stats.weekCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-dashboard__filters">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-search"
        />

        <ExportControls data={submissions} filteredData={filteredAndSortedData} />

        <select value={variantFilter} onChange={(e) => setVariantFilter(e.target.value)}>
          <option value="all">All Variants</option>
          <option value="variant_a">Variant A</option>
          <option value="variant_b">Variant B</option>
        </select>

        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          <option value="all">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select value={revealedFilter} onChange={(e) => setRevealedFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="revealed">Revealed</option>
          <option value="unrevealed">Unrevealed</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="admin-dashboard__bulk-actions">
          <span>{selectedIds.size} selected</span>
          <button onClick={handleBulkRevealClick} className="btn-bulk-reveal">
            Mark Selected as Revealed
          </button>
        </div>
      )}

      {/* Analytics Section */}
      <AdminAnalytics submissions={submissions} />

      {/* Results Count */}
      <div className="admin-dashboard__results">
        Showing {paginatedData.length} of {filteredAndSortedData.length} submissions
      </div>

      {/* Data Table */}
      <div className="admin-dashboard__table-container">
        <table className="admin-dashboard__table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  title="Select all on this page"
                />
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('variant')} className="sortable">
                Variant {sortColumn === 'variant' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('locationTag')} className="sortable">
                Location {sortColumn === 'locationTag' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('timestamp')} className="sortable">
                Timestamp {sortColumn === 'timestamp' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('revealed')} className="sortable">
                Status {sortColumn === 'revealed' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No submissions found
                </td>
              </tr>
            ) : (
              paginatedData.map((submission) => (
                <tr key={submission.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(submission.id)}
                      onChange={() => handleSelectOne(submission.id)}
                    />
                  </td>
                  <td>{submission.email}</td>
                  <td>
                    <span className={`badge badge-${submission.variant}`}>
                      {submission.variant === 'variant_a' ? 'A' : 'B'}
                    </span>
                  </td>
                  <td>{submission.locationTag || '—'}</td>
                  <td>{new Date(submission.timestamp).toLocaleString()}</td>
                  <td>
                    <label className="revealed-toggle">
                      <input
                        type="checkbox"
                        checked={submission.revealed}
                        onChange={(e) => onRevealToggle?.(submission.id, e.target.checked)}
                      />
                      <span className={submission.revealed ? 'revealed' : 'unrevealed'}>
                        {submission.revealed ? '✓ Revealed' : 'Pending'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-dashboard__pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;

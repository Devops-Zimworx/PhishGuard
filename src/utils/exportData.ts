import type { SubmissionRecord } from '../types';

/**
 * Escape special characters in CSV fields
 */
function escapeCSV(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If the value contains comma, quote, or newline, wrap it in quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Escape quotes by doubling them
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Generate timestamp for filenames
 */
function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}-${hours}${minutes}`;
}

/**
 * Download a file to the user's computer
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export submissions as CSV file
 */
export function exportToCSV(data: SubmissionRecord[]): void {
  const headers = [
    'Email',
    'Variant',
    'Location',
    'Timestamp',
    'IP Address',
    'User Agent',
    'Revealed',
  ];

  const rows = data.map((row) => [
    row.email,
    row.variant,
    row.locationTag || '',
    row.timestamp,
    row.ipAddress || '',
    row.userAgent || '',
    row.revealed ? 'Yes' : 'No',
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(','))
    .join('\n');

  const filename = `phishguard-submissions-${getTimestamp()}.csv`;
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export submissions as JSON file
 */
export function exportToJSON(data: SubmissionRecord[]): void {
  const json = JSON.stringify(data, null, 2);
  const filename = `phishguard-data-${getTimestamp()}.json`;
  downloadFile(json, filename, 'application/json');
}

/**
 * Export email list (comma-separated)
 */
export function exportEmailList(
  data: SubmissionRecord[],
  onlyUnrevealed: boolean = true
): void {
  const filtered = onlyUnrevealed ? data.filter((d) => !d.revealed) : data;
  const emails = filtered.map((d) => d.email).join(', ');

  const suffix = onlyUnrevealed ? 'unrevealed' : 'all';
  const filename = `phishguard-emails-${suffix}-${getTimestamp()}.txt`;

  downloadFile(emails, filename, 'text/plain');
}

/**
 * Copy email list to clipboard
 */
export async function copyEmailListToClipboard(
  data: SubmissionRecord[],
  onlyUnrevealed: boolean = true
): Promise<boolean> {
  try {
    const filtered = onlyUnrevealed ? data.filter((d) => !d.revealed) : data;
    const emails = filtered.map((d) => d.email).join(', ');

    await navigator.clipboard.writeText(emails);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Get export preview info (record count, file size estimate)
 */
export function getExportInfo(data: SubmissionRecord[], format: 'csv' | 'json' | 'email'): {
  recordCount: number;
  estimatedSize: string;
} {
  const recordCount = data.length;
  let estimatedBytes = 0;

  switch (format) {
    case 'csv':
      // Rough estimate: ~200 bytes per row
      estimatedBytes = recordCount * 200;
      break;
    case 'json':
      // Rough estimate: ~400 bytes per record
      estimatedBytes = recordCount * 400;
      break;
    case 'email':
      // Rough estimate: ~30 bytes per email
      estimatedBytes = recordCount * 30;
      break;
  }

  const estimatedSize = formatBytes(estimatedBytes);

  return { recordCount, estimatedSize };
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`;
}

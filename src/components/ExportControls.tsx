import { useState } from 'react';
import type { SubmissionRecord } from '../types';
import {
  exportToCSV,
  exportToJSON,
  exportEmailList,
  copyEmailListToClipboard,
  getExportInfo,
} from '../utils/exportData';

export type ExportControlsProps = {
  data: SubmissionRecord[];
  filteredData: SubmissionRecord[];
};

export function ExportControls({ data, filteredData }: ExportControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredData);
    showNotification(`Exported ${filteredData.length} records to CSV`);
    setIsOpen(false);
  };

  const handleExportJSON = () => {
    exportToJSON(filteredData);
    showNotification(`Exported ${filteredData.length} records to JSON`);
    setIsOpen(false);
  };

  const handleExportEmailList = (onlyUnrevealed: boolean) => {
    const filtered = onlyUnrevealed
      ? filteredData.filter((d) => !d.revealed)
      : filteredData;
    exportEmailList(filteredData, onlyUnrevealed);
    showNotification(
      `Exported ${filtered.length} email${filtered.length !== 1 ? 's' : ''}`
    );
    setIsOpen(false);
  };

  const handleCopyEmails = async (onlyUnrevealed: boolean) => {
    const filtered = onlyUnrevealed
      ? filteredData.filter((d) => !d.revealed)
      : filteredData;
    const success = await copyEmailListToClipboard(filteredData, onlyUnrevealed);
    if (success) {
      showNotification(
        `Copied ${filtered.length} email${filtered.length !== 1 ? 's' : ''} to clipboard`
      );
    } else {
      showNotification('Failed to copy to clipboard');
    }
    setIsOpen(false);
  };

  const csvInfo = getExportInfo(filteredData, 'csv');
  const jsonInfo = getExportInfo(filteredData, 'json');
  const emailInfo = getExportInfo(
    filteredData.filter((d) => !d.revealed),
    'email'
  );

  return (
    <div className="export-controls">
      <button
        className="export-button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        📥 Export Data
        <span className="export-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="export-dropdown">
          <div className="export-section">
            <h4>Export Formats</h4>

            <button className="export-option" onClick={handleExportCSV}>
              <div className="export-option-main">
                <span className="export-icon">📊</span>
                <div>
                  <div className="export-option-title">CSV Export</div>
                  <div className="export-option-desc">
                    Excel/Sheets compatible • {csvInfo.recordCount} records •{' '}
                    {csvInfo.estimatedSize}
                  </div>
                </div>
              </div>
            </button>

            <button className="export-option" onClick={handleExportJSON}>
              <div className="export-option-main">
                <span className="export-icon">📄</span>
                <div>
                  <div className="export-option-title">JSON Export</div>
                  <div className="export-option-desc">
                    Programmatic analysis • {jsonInfo.recordCount} records •{' '}
                    {jsonInfo.estimatedSize}
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="export-section">
            <h4>Email Lists</h4>

            <button className="export-option" onClick={() => handleExportEmailList(true)}>
              <div className="export-option-main">
                <span className="export-icon">📧</span>
                <div>
                  <div className="export-option-title">Unrevealed Emails</div>
                  <div className="export-option-desc">
                    {filteredData.filter((d) => !d.revealed).length} emails for reveal
                    campaign
                  </div>
                </div>
              </div>
            </button>

            <button className="export-option" onClick={() => handleCopyEmails(true)}>
              <div className="export-option-main">
                <span className="export-icon">📋</span>
                <div>
                  <div className="export-option-title">Copy to Clipboard</div>
                  <div className="export-option-desc">
                    Ready for BCC field • {filteredData.filter((d) => !d.revealed).length}{' '}
                    emails
                  </div>
                </div>
              </div>
            </button>

            <button className="export-option" onClick={() => handleExportEmailList(false)}>
              <div className="export-option-main">
                <span className="export-icon">📧</span>
                <div>
                  <div className="export-option-title">All Emails</div>
                  <div className="export-option-desc">
                    Complete list • {filteredData.length} emails
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="export-info">
            💡 Exports respect current filters • {filteredData.length} of {data.length}{' '}
            records
          </div>
        </div>
      )}

      {showToast && <div className="export-toast">{toastMessage}</div>}
    </div>
  );
}

export default ExportControls;

import { useState, useMemo, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Variant } from '../types';

export type QRGeneratorProps = {
  baseUrl?: string;
};

// Zimworx office locations
const ZIMWORX_LOCATIONS = [
  'The Grind',
  '2nd Floor',
  '7th Floor',
  '8th Floor',
  '9th Floor',
  '11th Floor',
  '13th Floor',
  '14th Floor',
  'Basement',
];

const VARIANT_INFO: Record<Variant, { name: string; description: string; color: string }> = {
  variant_a: {
    name: 'Variant A: Team Member WiFi',
    description: 'Professional, polished design - "Free Team Member WiFi"',
    color: '#6366f1',
  },
  variant_b: {
    name: 'Variant B: Executive WiFi',
    description: 'Bold, tempting design - "Executive WiFi - Faster Speed"',
    color: '#06b6d4',
  },
};

export function QRGenerator({ baseUrl: initialBaseUrl }: QRGeneratorProps) {
  const [baseUrl, setBaseUrl] = useState(
    initialBaseUrl || window.location.origin + '/wifi'
  );
  const [selectedVariant, setSelectedVariant] = useState<Variant>('variant_a');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    'The Grind',
    '2nd Floor',
  ]);
  const [customLocation, setCustomLocation] = useState('');

  const qrRefs = useRef<{ [key: string]: SVGSVGElement | null }>({});

  const qrPayloads = useMemo(() => {
    return selectedLocations.map((location) => {
      const url = new URL(baseUrl);
      url.searchParams.set('source', selectedVariant);
      url.searchParams.set('loc', location);
      return {
        location,
        url: url.toString(),
        variant: selectedVariant,
      };
    });
  }, [baseUrl, selectedVariant, selectedLocations]);

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const addCustomLocation = () => {
    if (customLocation.trim() && !selectedLocations.includes(customLocation.trim())) {
      setSelectedLocations((prev) => [...prev, customLocation.trim()]);
      setCustomLocation('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const downloadQR = (location: string, format: 'svg' | 'png') => {
    const svgElement = qrRefs.current[location];
    if (!svgElement) return;

    if (format === 'svg') {
      // Download as SVG
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-${selectedVariant}-${location.replace(/\s+/g, '-').toLowerCase()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Download as PNG
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        canvas.width = 512;
        canvas.height = 512;
        ctx?.drawImage(img, 0, 0, 512, 512);
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            const pngUrl = URL.createObjectURL(pngBlob);
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `qr-${selectedVariant}-${location.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.click();
            URL.revokeObjectURL(pngUrl);
          }
        });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="portal-shell">
      <div className="qr-generator-container">
        {/* Controls Section - Hidden when printing */}
        <section className="qr-controls no-print">
          <header className="qr-header">
            <h1>QR Code Generator</h1>
            <p>Generate trackable QR codes for the PhishGuard security awareness exercise</p>
          </header>

          {/* Base URL Configuration */}
          <div className="control-group">
            <label htmlFor="baseUrl" className="control-label">
              Base URL
            </label>
            <input
              id="baseUrl"
              type="url"
              className="control-input"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://yourdomain.com/wifi"
            />
            <p className="control-hint">
              The base URL for your PhishGuard WiFi portal
            </p>
          </div>

          {/* Variant Selection */}
          <div className="control-group">
            <label className="control-label">Select Variant</label>
            <div className="variant-selector">
              {(['variant_a', 'variant_b'] as Variant[]).map((variant) => (
                <button
                  key={variant}
                  className={`variant-button ${selectedVariant === variant ? 'active' : ''}`}
                  onClick={() => setSelectedVariant(variant)}
                  style={{
                    borderColor: selectedVariant === variant ? VARIANT_INFO[variant].color : '#cbd5e1',
                  }}
                >
                  <div className="variant-button-header">
                    <span className="variant-radio">
                      {selectedVariant === variant ? '●' : '○'}
                    </span>
                    <span className="variant-name">{VARIANT_INFO[variant].name}</span>
                  </div>
                  <span className="variant-description">
                    {VARIANT_INFO[variant].description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Selection */}
          <div className="control-group">
            <label className="control-label">Select Locations</label>
            <div className="location-grid">
              {ZIMWORX_LOCATIONS.map((location) => (
                <label key={location} className="location-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location)}
                    onChange={() => toggleLocation(location)}
                  />
                  <span>{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Location */}
          <div className="control-group">
            <label htmlFor="customLocation" className="control-label">
              Add Custom Location
            </label>
            <div className="custom-location-input">
              <input
                id="customLocation"
                type="text"
                className="control-input"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomLocation()}
                placeholder="e.g., Trust Towers"
              />
              <button
                className="add-button"
                onClick={addCustomLocation}
                disabled={!customLocation.trim()}
              >
                Add
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="print-button" onClick={handlePrint}>
              Print All QR Codes
            </button>
            <p className="action-hint">
              Selected: {selectedLocations.length} location(s) · Variant: {VARIANT_INFO[selectedVariant].name}
            </p>
          </div>
        </section>

        {/* QR Code Grid */}
        <section className="qr-grid">
          {qrPayloads.length === 0 ? (
            <div className="empty-state no-print">
              <p>No locations selected. Please select at least one location above.</p>
            </div>
          ) : (
            qrPayloads.map((payload) => (
              <div key={payload.location} className="qr-card">
                {/* QR Code */}
                <div className="qr-code-wrapper">
                  <QRCodeSVG
                    value={payload.url}
                    size={256}
                    level="H"
                    includeMargin={true}
                    ref={(el) => {
                      qrRefs.current[payload.location] = el;
                    }}
                  />
                </div>

                {/* Card Info */}
                <div className="qr-card-info">
                  <h3 className="qr-location">{payload.location}</h3>
                  <div
                    className="qr-variant-badge"
                    style={{ backgroundColor: VARIANT_INFO[payload.variant].color }}
                  >
                    {VARIANT_INFO[payload.variant].name}
                  </div>
                  <p className="qr-url">{payload.url}</p>

                  {/* Action Buttons - Hidden when printing */}
                  <div className="qr-actions no-print">
                    <button
                      className="action-btn"
                      onClick={() => copyToClipboard(payload.url)}
                      title="Copy URL"
                    >
                      Copy URL
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => downloadQR(payload.location, 'svg')}
                      title="Download SVG"
                    >
                      SVG
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => downloadQR(payload.location, 'png')}
                      title="Download PNG"
                    >
                      PNG
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Print Instructions */}
        <div className="print-only print-instructions">
          <h2>PhishGuard QR Codes</h2>
          <p>Variant: {VARIANT_INFO[selectedVariant].name}</p>
          <p>Generated: {new Date().toLocaleDateString()}</p>
          <p>Instructions: Place QR codes in designated locations. Do not reveal the security exercise.</p>
        </div>
      </div>
    </div>
  );
}

export default QRGenerator;

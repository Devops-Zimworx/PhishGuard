import { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Variant } from '../types';

export type QRGeneratorProps = {
  baseUrl?: string;
  defaultVariant?: Variant;
  locations?: string[];
};

const DEFAULT_LOCATIONS = ['breakroom', 'lobby', 'parking'];

export function QRGenerator({ baseUrl = 'https://yourdomain.com/wifi', defaultVariant = 'variant_a', locations = DEFAULT_LOCATIONS }: QRGeneratorProps) {
  const qrPayloads = useMemo(() => {
    return locations.map((location) => {
      const url = new URL(baseUrl);
      url.searchParams.set('source', defaultVariant);
      url.searchParams.set('loc', location);
      return { location, url: url.toString() };
    });
  }, [baseUrl, defaultVariant, locations]);

  return (
    <section className="qr-generator">
      <header>
        <h1>QR Generator</h1>
        <p>Generate printable QR codes tied to locations.</p>
      </header>

      <div className="qr-generator__grid">
        {qrPayloads.map((payload) => (
          <figure key={payload.location}>
            <QRCodeSVG value={payload.url} size={192} includeMargin />
            <figcaption>
              <strong>{payload.location}</strong>
              <p>{payload.url}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* TODO: I will expose variant toggles and PDF export buttons once requirements land. */}
    </section>
  );
}

export default QRGenerator;

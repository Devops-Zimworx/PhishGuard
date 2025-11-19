# PhishGuard - Security Awareness Platform

**Internal Zimworx Security Training Tool**

## Overview
PhishGuard is a covert security awareness exercise that quietly measures how often employees fall for QR-based social engineering. When a teammate scans one of our planted QR codes, they land on a realistic WiFi registration portal, submit their email, and immediately see a convincing success state. I only reveal the exercise days later through a coordinated email campaign so we can study authentic behavior without tipping our hand.

## Strategy
- Silent simulation with zero real-time education on the landing page
- Variant testing (polished Guest WiFi vs. tempting Executive WiFi)
- Location + timing tracking to spot behavioral patterns
- Data stored in Supabase with admin-only visibility and later "reveal" tracking

## User Flow
1. Employee scans QR code (variant + optional location tag embedded in URL)
2. Employee submits company email on the landing page
3. Fake success message reassures them that credentials are inbound
4. Submission is silently logged in Supabase (`phishing_submissions` table)
5. Security team monitors analytics dashboard and later emails the reveal notice

## Project Structure
```
phishguard/
├── src/
│   ├── components/
│   │   ├── WifiPortal.tsx         # Landing page shell for both variants
│   │   ├── SuccessMessage.tsx     # Fake "connected" screen
│   │   ├── AdminDashboard.tsx     # Protected results view
│   │   ├── QRGenerator.tsx        # Printable QR payloads
│   │   └── Analytics.tsx          # Charts for variant/location insights
│   ├── hooks/
│   │   ├── useSubmission.ts       # Handles Supabase inserts + state
│   │   └── useSupabase.ts         # Memoized Supabase client
│   ├── types/
│   │   └── index.ts               # Variants, payloads, analytics types
│   ├── utils/
│   │   ├── supabase.ts            # Supabase client factory
│   │   └── validation.ts          # Email validation helpers
│   ├── styles/
│   │   └── variants.css           # Variant-specific look & feel
│   └── App.tsx                    # Current prototype portal
├── public/
│   └── assets/
│       └── logos/README.md        # Branding guidance
├── .env.local                     # Local-only env vars (ignored by git)
├── package.json
├── vite.config.ts
└── README.md
```

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind (soon) + custom CSS
- **Data**: Supabase (Auth, DB, real-time)
- **Visualization**: Recharts
- **QR Codes**: `qrcode.react`
- **Date Utilities**: `date-fns`
- **Deployment Targets**: Vercel or Netlify

## Database Schema (Supabase)
```sql
create table phishing_submissions (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  variant text not null check (variant in ('variant_a', 'variant_b')),
  location_tag text,
  timestamp timestamptz default now(),
  ip_address text,
  user_agent text,
  revealed boolean default false
);

create index idx_submissions_variant on phishing_submissions(variant);
create index idx_submissions_timestamp on phishing_submissions(timestamp);
create index idx_submissions_revealed on phishing_submissions(revealed);

alter table phishing_submissions enable row level security;

create policy "Admin read access"
  on phishing_submissions for select
  using (auth.jwt() ->> 'role' = 'admin');
```

## Setup Instructions
### Prerequisites
- Node.js 18+ (Node 20+ recommended to silence Supabase + SWC warnings)
- npm 10+
- Supabase project + anon key
- Optional: Vercel or Netlify account for hosting

### Installation
```bash
npm install
npm run dev
```

### Environment Variables
`src/utils/supabase.ts` and `src/hooks/useSupabase.ts` read Vite-style variables. Copy `.env.local` and set:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_PASSWORD=your_secure_admin_password
```
Never commit production credentials.

### Available Scripts
```bash
npm run dev      # Start Vite dev server
npm run test     # Run Vitest + Testing Library
npm run build    # Type-check + bundle for production
npm run preview  # Preview build locally
```

## Variant Playbook
- **Variant A (Guest WiFi)**: Polished, high-trust visuals, message "Free Guest WiFi - Scan to Connect"
- **Variant B (Executive WiFi)**: Scarcity-driven copy, bolder palette, message "Executive WiFi - Faster Speed"
- URLs embed both `source` and `loc` params (e.g., `https://yourdomain.com/wifi?source=variant_a&loc=breakroom`).
- Use `src/components/QRGenerator.tsx` to render printable QR sheets for each location.

## Features Roadmap
- Silent submission logging with `useSubmission`
- Success screen that never reveals the simulation
- Admin dashboard + analytics (variant comparison, location hotspots, time-series trends)
- CSV export + reveal tracking
- Future enhancements: SMS/smishing drills, LMS integration, automated reporting, multilingual portals

## Security & Compliance Notes
- Protect admin routes with Supabase Auth + JWT role checks (no shared passwords in production)
- Enforce HTTPS and rate-limiting on submission endpoints
- Limit PII to what is essential (email + metadata) and define a 90-day retention policy
- Obtain written approval from IT Security, HR, Legal, and Executive Leadership before launch
- Communicate empathetically during the reveal; the goal is education, not punishment

## Support
- **Technical issues**: it-security@zimworx.com
- **Policy questions**: compliance@zimworx.com
- **Training coordination**: training@zimworx.com

_Last updated: November 2025_

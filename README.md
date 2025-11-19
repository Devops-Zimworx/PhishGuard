# PhishGuard - Security Awareness Platform

**Internal Zimworx Security Training Tool**

## Overview
PhishGuard is a security awareness training tool designed to test employee vigilance against social engineering attacks. The system uses QR codes placed around the office that redirect to simulated phishing pages to assess security awareness.

## Purpose
- Test employee susceptibility to QR code phishing attacks
- Collect data on security awareness levels
- Identify teams/individuals requiring additional security training
- Track improvement over time

## Tech Stack
- **Frontend**: React 18+ with TypeScript
- **Backend/Database**: Supabase (Auth, Database, Real-time)
- **Styling**: Tailwind CSS
- **QR Generation**: qrcode.react
- **Deployment**: Vercel/Netlify

## Features
- Two QR code variants (safe vs malicious simulation)
- Landing page that collects email addresses
- Real-time data collection in Supabase
- Admin dashboard for viewing submissions
- Timestamps and QR code source tracking
- Export capabilities for security team analysis

## Project Structure
```
phishguard/
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx       # WiFi connection form
│   │   ├── AdminDashboard.tsx    # Results viewer
│   │   └── QRGenerator.tsx       # Generate QR codes
│   ├── hooks/
│   │   └── useSupabase.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── supabase.ts
│   └── App.tsx
├── public/
└── README.md
```

## Database Schema (Supabase)
```sql
create table submissions (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  qr_source text not null,  -- 'safe' or 'malicious'
  timestamp timestamptz default now(),
  ip_address text,
  user_agent text
);
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation
1. Clone the repository
```bash
git clone <repo-url>
cd phishguard
npm install
```

2. Configure Supabase
- Create a new Supabase project
- Run the database schema (see above)
- Copy your project URL and anon key

3. Environment Variables
Create `.env.local`:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

4. Run Development Server
```bash
npm run dev
```

## QR Code Setup
- Generate two QR codes pointing to:
  - Safe: `https://somedomain.com/wifi?source=safe`
  - Malicious: `https://somedomain.com/wifi?source=malicious`
- Print and place strategically around office

## Security Considerations
- This is a training tool - all data collected will be handled responsibly
- Probably Team Experience should be looped in on this
- We will provide immediate feedback to users after submission
- We will follow up with security awareness training
- All data will be deleted after training cycle is completed

## Admin Access
Access dashboard at: `https://cybertest.intraworx.cloud/admin`

## Next Steps
- [ ] Implement admin authentication
- [ ] Add data visualization dashboard
- [ ] Create automated reporting
- [ ] Add SMS/email notifications to security team
- [ ] Implement data retention policies

---
**Maintainer**: Zimworx BI Team  
**Last Updated**: November 2025

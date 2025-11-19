<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
=======
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
>>>>>>> 19a802bfd62f81a885d7e33f0195468084197d0b

import React, { useState } from 'react';
import App from './App';
import AwarenessDemo from './AwarenessDemo';
import './styles/demo-switcher.css';

type Page = 'landing' | 'awareness';

function DemoRouter() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  return (
    <>
      {/* Demo Switcher Controls */}
      <div className="demo-switcher">
        <div className="demo-switcher-content">
          <span className="demo-label">PhishGuard Demo:</span>
          <button
            className={currentPage === 'landing' ? 'active' : ''}
            onClick={() => setCurrentPage('landing')}
          >
            Landing Page
          </button>
          <button
            className={currentPage === 'awareness' ? 'active' : ''}
            onClick={() => setCurrentPage('awareness')}
          >
            Success/Awareness Page
          </button>
        </div>
      </div>

      {/* Render Current Page */}
      {currentPage === 'landing' && <App />}
      {currentPage === 'awareness' && <AwarenessDemo />}
    </>
  );
}

export default DemoRouter;

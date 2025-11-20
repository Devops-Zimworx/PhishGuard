import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DemoRouter from './DemoRouter';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DemoRouter />
  </React.StrictMode>
);

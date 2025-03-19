import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create root element for React 18
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render the app with StrictMode for development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

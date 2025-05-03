import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import { validateMsalConfig } from './configValidator';

// Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css';

// Validate MSAL configuration
const configResult = validateMsalConfig();
if (!configResult.isValid) {
  // Log error to console in development
  console.error(configResult.message);
  
  // In production environment, you might want to show a user-friendly message
  // or redirect to an error page
}

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * We recommend wrapping most or all of your components in the MsalProvider component. It's best to render the MsalProvider as close to the root as possible.
 */
 root.render(
  <React.StrictMode>
      <MsalProvider instance={msalInstance}>
          <App />
      </MsalProvider>
  </React.StrictMode>
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to mount React application:", error);
  // Optional: Render a fallback UI directly to the DOM in case of critical failure
  rootElement.innerHTML = `<div style="color: #ff5555; padding: 20px; font-family: sans-serif;">
    <h2>System Failure</h2>
    <p>The application failed to initialize. Check console for details.</p>
    <pre>${error instanceof Error ? error.message : 'Unknown Error'}</pre>
  </div>`;
}
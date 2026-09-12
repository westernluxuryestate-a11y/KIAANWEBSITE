import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { offlineAndPwaService } from './services/offlineAndPwaService';
import { ErrorBoundary } from './components/ErrorBoundary';

// Initialize PWA service worker for low-network and offline resilience (Items 141-142)
offlineAndPwaService.registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

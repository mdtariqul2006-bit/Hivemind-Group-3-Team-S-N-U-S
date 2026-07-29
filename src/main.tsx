import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app';
import { OnboardingProvider } from '@/state/onboarding-context';
import { ToastProvider } from '@/state/toast-context';
import { AuthProvider } from '@/state/auth-context';
import '@/styles/index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <OnboardingProvider>
          <App />
        </OnboardingProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
);

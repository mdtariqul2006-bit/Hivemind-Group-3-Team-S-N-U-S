import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app';
import { AssistantProvider } from '@/state/assistant-context';
import { AuthProvider } from '@/state/auth-context';
import { MemberProvider } from '@/state/member-context';
import { OnboardingProvider } from '@/state/onboarding-context';
import { ToastProvider } from '@/state/toast-context';
import '@/styles/index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <MemberProvider>
          <OnboardingProvider>
            {/* Reads onboarding state (role, completed tasks), must nest inside it. */}
            <AssistantProvider>
              <App />
            </AssistantProvider>
          </OnboardingProvider>
        </MemberProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
);

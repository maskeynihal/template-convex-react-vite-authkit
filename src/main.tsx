import './index.css';

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ConvexReactClient } from 'convex/react';
import { AuthKitProvider, useAuth } from '@workos-inc/authkit-react';

import App from './App.tsx';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import { ConvexProviderWithAuthKit } from './ConvexProviderWithAuthKit';

import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

import { AuthUserProvider } from './AuthUserContext/AuthUserProvider.tsx';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function Main() {
  const [userCreationSchedulerId, setUserCreationSchedulerId] = useState<Id<'_scheduled_functions'> | null>(null);

  return (
    <StrictMode>
      <ErrorBoundary>
        <AuthKitProvider
          clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}
          redirectUri={import.meta.env.VITE_WORKOS_REDIRECT_URI}
          onRedirectCallback={(response) => {
            convex
              .action(api.auth.createUser, {
                accessToken: response.accessToken,
                providerAccountId: response.user.id,
              })
              .then(async (schedulerJobId) => {
                setUserCreationSchedulerId(schedulerJobId);
              })
              .catch((error) => {
                console.error('Error creating user:', error);
              });
          }}
        >
          <ConvexProviderWithAuthKit client={convex} useAuth={useAuth}>
            <AuthUserProvider userCreationSchedulerId={userCreationSchedulerId}>
              <App />
            </AuthUserProvider>
          </ConvexProviderWithAuthKit>
        </AuthKitProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Main />);

'use client';

import { SessionProvider } from '@inrupt/solid-ui-react';
import dynamic from 'next/dynamic';
import { PropsWithChildren, memo } from 'react';

import UserUpdater from './UserUpdater';

const LoginModal = dynamic(() => import('./LoginModal'), {
  ssr: false,
});

const SolidProvider = memo(({ children }: PropsWithChildren) => {
  return (
    <SessionProvider
      onError={(error) => console.error('SessionProviderError', error)}
      restorePreviousSession={true}
      skipLoadingProfile={false}
    >
      <LoginModal />
      {children}
      <UserUpdater />
    </SessionProvider>
  );
});

export default SolidProvider;

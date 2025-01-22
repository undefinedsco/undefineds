'use client';

import { SessionProvider } from '@inrupt/solid-ui-react';
import dynamic from 'next/dynamic';
import { PropsWithChildren, memo } from 'react';

const LoginModal = dynamic(() => import('./LoginModal'), {
  ssr: false,
});
const UserUpdater = dynamic(() => import('./UserUpdater'), {
  ssr: false,
});

const SolidProvider = memo(({ children }: PropsWithChildren) => {
  console.log('SolidProvider Init ...');
  return (
    <SessionProvider
      onError={(error) => console.error('SessionProviderError', error)}
      onSessionRestore={(previousUrl) => {
        console.info('SessionProvider onSessionRestore', previousUrl);
      }}
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

'use client';

import '@inrupt/solid-ui-react';
import { memo, useEffect } from 'react';
// import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { createStoreUpdater } from 'zustand-utils';

// import SolidHydration from '@/components/SolidHydration';
import { useSolidSession } from '@/hooks/useSolidSession';
import { useUserStore } from '@/store/user';
import type { LobeUser } from '@/types/user';

// import { useSolidStore } from '@/store/solid';
// import { getUser } from '@/helpers/solid';
// import LoginModal from './login';

const UserUpdater = memo(() => {
  const { isLoggedIn, user } = useSolidSession();
  const useStoreUpdater = createStoreUpdater(useUserStore);

  useEffect(() => {
    console.info(`UserUpdater ${isLoggedIn}`, JSON.stringify(user));
  }, [user, isLoggedIn]);

  const lobeUser: LobeUser = {
    avatar: user?.image || '',
    fullName: user?.name || '',
    id: user?.id || '',
    username: user?.name || '',
  };

  useStoreUpdater('isSignedIn', isLoggedIn, [isLoggedIn]);
  useStoreUpdater('user', lobeUser, [user]);
  useStoreUpdater('isLoaded', isLoggedIn, [isLoggedIn]);

  console.log('Set User', isLoggedIn, JSON.stringify(user));

  return null;
});

export default UserUpdater;

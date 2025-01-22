'use client';

import { SessionContext, useSession } from '@inrupt/solid-ui-react';
import { useContext, useEffect } from 'react';
import { createStoreUpdater } from 'zustand-utils';

import { getUser } from '@/helpers/solid';
import { useSolidStore } from '@/store/solid';
import { useUserStore } from '@/store/user';
import type { LobeUser } from '@/types/user';

const UserUpdater = () => {
  const { session } = useSession();
  const { profile } = useContext(SessionContext);
  const [user, setUser] = useSolidStore((state) => [state.user, state.setUser]);
  const useStoreUpdater = createStoreUpdater(useUserStore);

  const isLoggedIn = session.info?.isLoggedIn || false;

  // type Profile = ProfileAll<SolidDataset & WithServerResourceInfo>;

  const handleLogin = async () => {
    console.info(`login ${session.info.sessionId} ${profile}`);
    if (profile) {
      const newUser = await getUser(session, profile.webIdProfile);
      if (newUser) {
        setUser(newUser);
      }
    }
  };

  const handleSessionRestore = async () => {
    console.info(`restore ${session.info.sessionId} ${profile}`);
    if (profile) {
      const newUser = await getUser(session, profile.webIdProfile);
      if (newUser) {
        setUser(newUser);
      }
    }
  };

  const handleLogout = () => {
    console.info(`logout ${session.info.sessionId}`);
    setUser(null);
  };

  useEffect(() => {
    console.info(`Session Change To [${session.info.sessionId}]`);
    session.events.on('login', handleLogin);
    session.events.on('sessionRestore', handleSessionRestore);
    session.events.on('logout', handleLogout);
    return () => {
      session.events.off('login', handleLogin);
      session.events.off('sessionRestore', handleSessionRestore);
      session.events.off('logout', handleLogout);
    };
  }, [session]);

  /*
  useEffect(() => {
    console.info(`UserUpdater ${isLoggedIn}`, JSON.stringify(user));
  }, [user, isLoggedIn]);
  */

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
};

export default UserUpdater;

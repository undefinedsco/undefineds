'use client';

import { User } from '@auth/core/types';
import { getProfileAll } from '@inrupt/solid-client';
import type { ProfileAll, SolidDataset, WithServerResourceInfo } from '@inrupt/solid-client';
import { SessionContext, useSession } from '@inrupt/solid-ui-react';
import { useContext, useEffect, useMemo, useState } from 'react';

import { getUser } from '@/helpers/solid';

interface SolidSession {
  isLoggedIn: boolean;
  refresh: () => void;
  user?: User | null;
}

export const useSolidSession = () => {
  type Profile = ProfileAll<SolidDataset & WithServerResourceInfo>;
  const { session, sessionRequestInProgress } = useSession();
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { profile: ctxProfile } = useContext(SessionContext);
  const [profile, setProfile] = useState<Profile | undefined>(ctxProfile);
  const isLoggedIn = session.info?.isLoggedIn || false;

  const fetchProfile = async () => {
    if (session.info.webId) {
      const profile = await getProfileAll(session.info.webId, {
        fetch: session.fetch,
      });
      setProfile(profile);
      console.info(`fetchProfile ${session.info.sessionId}`);
    }
  };

  const handleLogin = () => {
    console.info(`login ${session.info.sessionId} ${ctxProfile}`);
    setProfile(ctxProfile);
  };

  const handleSessionRestore = () => {
    console.info(`restore ${session.info.sessionId} ${ctxProfile}`);
    setProfile(ctxProfile);
  };

  const handleLogout = () => {
    console.info(`logout ${session.info.sessionId}`);
    setProfile(undefined);
  };

  useEffect(() => {
    console.info(
      `client side init component[${session.info.sessionId}]`,
      `isLoggedIn[${session.info.isLoggedIn}]`,
      `InProgress[${sessionRequestInProgress}]`,
    );
  }, []);

  useEffect(() => {
    session.events.on('login', handleLogin);
    session.events.on('sessionRestore', handleSessionRestore);
    session.events.on('logout', handleLogout);
    return () => {
      session.events.off('login', handleLogin);
      session.events.off('sessionRestore', handleSessionRestore);
      session.events.off('logout', handleLogout);
    };
  }, [session]);

  useEffect(() => {
    fetchProfile();
  }, [refreshFlag]);

  useEffect(() => {
    const fetchUser = async () => {
      if (session.info?.webId && profile) {
        const fetchedUser = await getUser(session, profile.webIdProfile);
        console.info(`fetchUser ${session.info.webId}`, fetchedUser);
        setUser(fetchedUser);
      }
    };
    fetchUser();
  }, [profile]);

  return useMemo<SolidSession>(() => {
    console.log(`[${session.info.sessionId}]useMemo[${isLoggedIn}]`, user);
    return {
      isLoggedIn,
      refresh: () => setRefreshFlag((refreshFlag) => !refreshFlag),
      user,
    };
  }, [user]);
};

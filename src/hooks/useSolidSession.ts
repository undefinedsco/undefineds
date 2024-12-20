'use client';

import { User } from '@auth/core/types';
import { SessionContext, useSession } from '@inrupt/solid-ui-react';
import { useContext, useEffect, useMemo, useState } from 'react';

import { getUser } from '@/helpers/solid';

interface SolidSession {
  isLoggedIn: boolean;
  user?: User | null;
}

export const useSolidSession = () => {
  const { profile } = useContext(SessionContext);
  const { session } = useSession();
  const [, setRefresh] = useState(false);

  const isLoggedIn = session.info?.isLoggedIn || false;
  let user: User | null = null;
  if (session.info?.webId && profile) {
    user = getUser(session.info.webId, profile.webIdProfile);
  }

  const handleLogin = () => {
    console.info(`login ${session.info.sessionId}`);
    setRefresh((prev) => !prev);
  };

  const handleSessionRestore = () => {
    console.info(`restore ${session.info.sessionId}`);
    setRefresh((prev) => !prev);
  };

  const handleLogout = () => {
    console.info(`logout ${session.info.sessionId}`);
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    if (window === undefined) {
      console.info(
        `server side init component[${session.info.sessionId}] isLoggedIn[${session.info.isLoggedIn}].`,
      );
    } else {
      console.info(
        `client side init component[${session.info.sessionId}] isLoggedIn[${session.info.isLoggedIn}].`,
      );
    }
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

  return useMemo<SolidSession>(() => {
    console.log(`[${session.info.sessionId}]useMemo[${isLoggedIn}]`, user);
    return { isLoggedIn, user };
  }, [profile]);
};

'use client';

import '@inrupt/solid-ui-react';
import {
  memo, //useState,
  //useEffect,
  //useContext
} from 'react';
// import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { createStoreUpdater } from 'zustand-utils';

// import SolidHydration from '@/components/SolidHydration';
import { useSolidSession } from '@/hooks/useSolidSession';
import { useUserStore } from '@/store/user';

// import { useSolidStore } from '@/store/solid';
// import { getUser } from '@/helpers/solid';
// import LoginModal from './login';

const UserUpdater = memo(() => {
  const { isLoggedIn, user } = useSolidSession();
  //const { session } = useSession();
  // const { profile } = useContext(SessionContext);
  // const [isLoggedIn, setLoggedIn] = useState(session.info.isLoggedIn)
  // const [setSessionInfo, setProfile] = useSolidStore(
  //     (state) => [state.setSessionInfo, state.setProfile]
  // );
  const useStoreUpdater = createStoreUpdater(useUserStore);
  // console.log('Solid -> sessionState');

  useStoreUpdater('isSignedIn', isLoggedIn);
  useStoreUpdater('user', user);
  useStoreUpdater('isLoaded', isLoggedIn);

  return null;
});

export default UserUpdater;

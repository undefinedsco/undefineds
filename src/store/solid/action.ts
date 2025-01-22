import type { Profile, User } from '@auth/core/types';
import type { StateCreator } from 'zustand/vanilla';

import type { SolidStore } from '@/store/solid/index';
import { setNamespace } from '@/utils/storeDebug';

const n = setNamespace('s');

export interface SolidStoreAction {
  setCurrentUrl: (currentUrl: string) => void;
  setOidcIssuer: (oidcIssuer: string) => void;
  setProfile: (profile: Profile | null) => void;
  setUser: (user: User | null) => void;
}

export const solidStoreAction: StateCreator<
  SolidStore,
  [['zustand/devtools', never]],
  [],
  SolidStoreAction
> = (set) => ({
  setCurrentUrl: (currentUrl: string) => {
    set({ currentUrl }, false, n('setCurrentUrl'));
  },
  setOidcIssuer: (oidcIssuer: string) => {
    set({ oidcIssuer }, false, n('setOidcIssuer'));
  },
  setProfile: (profile: Profile | null) => {
    set({ profile }, false, n('setProfile'));
  },
  setUser: (user: User | null) => {
    set({ user }, false, n('setUser'));
  },
});

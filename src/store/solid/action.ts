import { type User } from '@auth/core/types';
import type { StateCreator } from 'zustand/vanilla';

import type { SolidStore } from '@/store/solid/index';
import { setNamespace } from '@/utils/storeDebug';

const n = setNamespace('s');

export interface SolidStoreAction {
  setCurrentUrl: (currentUrl: string) => void;
  setOidcIssuer: (oidcIssuer: string) => void;
  setProfile: (profile: User | null) => void;
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
  setProfile: (profile: User | null) => {
    set({ profile }, false, n('setProfile'));
  },
});

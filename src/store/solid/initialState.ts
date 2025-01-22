import type { Profile, User } from '@auth/core/types';

export interface SolidState {
  currentUrl: string | null;
  oidcIssuer: string | null;
  profile: Profile | null;
  user: User | null;
}

export const initialState: SolidState = {
  currentUrl: null,
  oidcIssuer: null,
  profile: null,
  user: null,
} satisfies SolidState;

import { type User } from '@auth/core/types';

export interface SolidState {
  currentUrl: string | null;
  oidcIssuer: string | null;
  profile: User | null;
}

export const initialState: SolidState = {
  currentUrl: null,
  oidcIssuer: null,
  profile: null,
} satisfies SolidState;

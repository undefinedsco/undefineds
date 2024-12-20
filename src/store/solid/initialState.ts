import { type User } from '@auth/core/types';

export interface SolidState {
  oidcIssuer: string | null;
  profile: User | null;
}

export const initialState: SolidState = {
  oidcIssuer: null,
  profile: null,
} satisfies SolidState;

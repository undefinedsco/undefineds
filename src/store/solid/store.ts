import {
  type PersistOptions,
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { type SolidStoreAction, solidStoreAction } from './action';
import { type SolidState, initialState } from './initialState';

export type SolidStore = SolidState & SolidStoreAction;

const createStore: StateCreator<SolidStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...solidStoreAction(...parameters),
});

const persistOption: PersistOptions<SolidStore> = {
  name: 'SOLID_STORE',
  storage: createJSONStorage(() => localStorage),
};

const devtools = createDevtools('solid');

export const useSolidStore = createWithEqualityFn<SolidStore>()(
  persist(subscribeWithSelector(devtools(createStore)), persistOption),
  shallow,
);

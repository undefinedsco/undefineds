import { PropsWithChildren } from 'react';

import Solid from './Solid';

const AuthProvider = ({ children }: PropsWithChildren) => {
  return <Solid>{children}</Solid>;
};

export default AuthProvider;

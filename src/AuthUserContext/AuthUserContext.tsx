import { createContext } from 'react';

import { Doc } from '../../convex/_generated/dataModel';

export interface AuthUserContextType {
  isLoading: boolean;
  user: Doc<'users'> | null | undefined;
}

export const AuthUserContext = createContext<AuthUserContextType | undefined>(undefined);

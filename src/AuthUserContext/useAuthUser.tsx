import { useContext } from 'react';
import { AuthUserContext } from './AuthUserContext';

export const useAuthUser = () => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error('useAuthUser must be used within an AuthUserProvider');
  }

  return context;
};

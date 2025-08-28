import { useConvexAuth, useQuery } from 'convex/react';
import { useState, ReactNode, useEffect } from 'react';
import useConvexQueriesWithStatus from '@/hooks/useConvexQueriesWithStatus';

import { AuthUserContext } from './AuthUserContext';

import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export const AuthUserProvider = ({
  children,
  userCreationSchedulerId,
}: {
  children: ReactNode;
  userCreationSchedulerId?: Id<'_scheduled_functions'> | null | undefined;
}) => {
  const [userCreationSchedulerIdState, setUserCreationSchedulerIdState] =
    useState<ReturnType<typeof useQuery<typeof api.scheduler.getSchedulerJobStatusById>>>(undefined);

  const { isLoading, isAuthenticated } = useConvexAuth();

  const authUserCreationSchedulerStatus = useQuery(
    api.scheduler.getSchedulerJobStatusById,
    userCreationSchedulerId && userCreationSchedulerIdState !== 'success' ? { id: userCreationSchedulerId } : 'skip',
  );

  const shouldCallGetLoggedInUser =
    isAuthenticated && !isLoading && (!userCreationSchedulerId || userCreationSchedulerIdState === 'success');

  const { isPending: isLoadingLoggedInUser, data: loggedInUser } = useConvexQueriesWithStatus(
    api.user.getLoggedInUser,
    shouldCallGetLoggedInUser ? {} : 'skip',
  );

  useEffect(() => {
    if (!authUserCreationSchedulerStatus || userCreationSchedulerIdState === 'success') {
      return;
    }

    setUserCreationSchedulerIdState(authUserCreationSchedulerStatus);
  }, [authUserCreationSchedulerStatus, userCreationSchedulerIdState]);

  return (
    <AuthUserContext.Provider value={{ isLoading: isLoadingLoggedInUser, user: loggedInUser }}>
      {children}
    </AuthUserContext.Provider>
  );
};

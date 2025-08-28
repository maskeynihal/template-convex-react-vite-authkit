import { makeUseQueryWithStatus } from 'convex-helpers/react';
import { useQueries } from 'convex/react';

const useConvexQueriesWithStatus = makeUseQueryWithStatus(useQueries);

export default useConvexQueriesWithStatus;

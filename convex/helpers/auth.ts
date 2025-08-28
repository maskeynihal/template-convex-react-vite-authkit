import { Auth } from 'convex/server';
import { DatabaseReader } from '../_generated/server';

export async function getAuthUser(ctx: { auth: Auth; db: DatabaseReader }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }

  // Get the logged in user's information from the `users` table
  const authAccount = await ctx.db
    .query('authAccounts')
    .withIndex('providerAndAccountId', (q) => q.eq('provider', 'workos').eq('providerAccountId', identity.subject))
    .first();

  if (!authAccount) {
    throw new Error('No auth account found for the logged in user');
  }

  const user = await ctx.db.get(authAccount?.userId);

  if (!user) {
    throw new Error('No user found for the logged in user');
  }

  return user;
}

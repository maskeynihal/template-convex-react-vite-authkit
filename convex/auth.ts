import { v } from 'convex/values';

import { internal } from './_generated/api';
import { action } from './_generated/server';
import { Id } from './_generated/dataModel';

export const createUser = action({
  args: {
    providerAccountId: v.string(),
    accessToken: v.string(),
  },
  handler: async (ctx, args): Promise<Id<'_scheduled_functions'>> => {
    const identity = ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }
    const schedulerJobId = await ctx.scheduler.runAfter(0, internal.workos.createUserUsingAccessToken, {
      accessToken: args.accessToken as string,
      providerAccountId: args.providerAccountId,
    });

    await ctx.runMutation(internal.authUserCreators.create, {
      provider: 'workos',
      providerAccountId: args.providerAccountId,
      schedulerJobId: schedulerJobId,
    });

    return schedulerJobId;
  },
});

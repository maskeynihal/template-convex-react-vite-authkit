import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

export const create = internalMutation({
  args: {
    provider: v.string(),
    providerAccountId: v.string(),
    userId: v.optional(v.id('users')),
    schedulerJobId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('authUserCreators', {
      provider: args.provider,
      providerAccountId: args.providerAccountId,
      userId: args.userId,
      schedulerJobId: args.schedulerJobId,
    });

    return id;
  },
});

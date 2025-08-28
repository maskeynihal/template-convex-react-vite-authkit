import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';

export const create = internalMutation({
  args: {
    userId: v.id('users'),
    provider: v.string(),
    providerAccountId: v.string(),
    emailVerified: v.optional(v.string()),
    phoneVerified: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('authAccounts', {
      userId: args.userId,
      provider: args.provider,
      providerAccountId: args.providerAccountId,
      emailVerified: args.emailVerified,
      phoneVerified: args.phoneVerified,
    });

    return id;
  },
});

export const getByProviderAndAccountId = internalQuery({
  args: {
    provider: v.string(),
    providerAccountId: v.string(),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query('authAccounts')
      .withIndex('providerAndAccountId', (q) =>
        q.eq('provider', args.provider).eq('providerAccountId', args.providerAccountId),
      )
      .first();

    return account;
  },
});

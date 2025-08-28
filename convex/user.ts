import { v } from 'convex/values';

import { internal } from './_generated/api';
import { Doc } from './_generated/dataModel';
import { internalMutation, internalQuery, query } from './_generated/server';

export const create = internalMutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('users', {
      firstName: args.firstName,
      lastName: args.lastName,
      image: args.image,
      email: args.email,
      emailVerificationTime: args.emailVerificationTime,
      phone: args.phone,
      phoneVerificationTime: args.phoneVerificationTime,
      isAnonymous: args.isAnonymous,
    });

    return id;
  },
});

export const get = internalQuery({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);

    return user;
  },
});

export const getByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email))
      .first();

    return user;
  },
});

export const getLoggedInUser = query({
  handler: async (ctx): Promise<Doc<'users'> | null> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.runQuery(internal.authAccounts.getByProviderAndAccountId, {
      providerAccountId: identity.subject,
      provider: 'workos',
    });

    return user ? await ctx.db.get(user.userId) : null;
  },
});

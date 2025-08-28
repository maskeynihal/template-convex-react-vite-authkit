import { v } from 'convex/values';
import { query, mutation, action } from './_generated/server';
import { api } from './_generated/api';
import { getAuthUser } from './helpers/auth';

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:
export const get = query({
  // Validators for arguments.
  args: {
    count: v.number(),
  },

  // Query implementation.
  handler: async (ctx, args) => {
    const viewer = await getAuthUser(ctx);

    //// Read the database as many times as you need here.
    //// See https://docs.convex.dev/database/reading-data.
    const randomNumbers = await ctx.db
      .query('randomNumbers')
      // Ordered by _creationTime, return most recent
      .order('desc')
      .take(args.count);

    return {
      viewer: viewer ?? null,
      randomNumbers: randomNumbers,
    };
  },
});

// You can write data to the database via a mutation:
export const create = mutation({
  // Validators for arguments.
  args: {
    value: v.number(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    //// Insert or modify documents in the database here.
    //// Mutations can also read from the database like queries.
    //// See https://docs.convex.dev/database/writing-data.
    const id = await ctx.db.insert('randomNumbers', { value: args.value, userId: user._id });

    // Optionally, return a value from your mutation.
    return id;
  },
});

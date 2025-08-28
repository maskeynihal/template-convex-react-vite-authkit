import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
const applicationTables = {
  randomNumbers: defineTable({
    value: v.number(),
    userId: v.id('users'),
  }),
};

const authTables = {
  /**
   * Accounts. An account corresponds to
   * a single authentication provider.
   * A single user can have multiple accounts linked.
   */
  authAccounts: defineTable({
    userId: v.id('users'),
    provider: v.string(),
    providerAccountId: v.string(),
    emailVerified: v.optional(v.string()),
    phoneVerified: v.optional(v.string()),
  })
    .index('userIdAndProvider', ['userId', 'provider'])
    .index('providerAndAccountId', ['provider', 'providerAccountId']),

  authUserCreators: defineTable({
    provider: v.string(),
    providerAccountId: v.string(),
    userId: v.optional(v.id('users')),
    schedulerJobId: v.optional(v.string()),
  }),
  /**
   * Users.
   */
  users: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index('email', ['email'])
    .index('phone', ['phone']),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});

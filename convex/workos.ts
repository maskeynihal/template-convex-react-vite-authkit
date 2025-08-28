'use node';

import jwt from 'jsonwebtoken';
import { v } from 'convex/values';
import jwksClient from 'jwks-rsa';
import { WorkOS } from '@workos-inc/node';

import { internal } from './_generated/api';
import { Id } from './_generated/dataModel';
import { internalAction } from './_generated/server';

export const createUserUsingAccessToken = internalAction({
  args: {
    accessToken: v.string(),
    providerAccountId: v.string(),
  },
  handler: async (ctx, args) => {
    const workos = new WorkOS(process.env.WORKOS_API_KEY!);

    const jwksUrl = workos.userManagement.getJwksUrl(process.env.WORKOS_CLIENT_ID!);

    const client = jwksClient({
      jwksUri: jwksUrl,
    });

    function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
      client.getSigningKey(header.kid!, function (err, key) {
        if (err) {
          callback(err, undefined);
        } else {
          const signingKey = key?.getPublicKey();
          callback(null, signingKey);
        }
      });
    }

    let decoded: { sub?: string } | null;
    try {
      decoded = await new Promise<{ sub?: string }>((resolve, reject) => {
        jwt.verify(args.accessToken, getKey, {}, (err, decodedToken) => {
          if (err) {
            reject(err);
          } else {
            resolve(decodedToken as { sub?: string });
          }
        });
      });
      console.log('JWT verified:', decoded);
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new Error('Invalid access token');
    }

    if (!decoded || !decoded.sub) {
      throw new Error('Decoded token is missing property');
    }

    const user = await workos.userManagement.getUser(decoded.sub);

    if (user.id !== args.providerAccountId) {
      throw new Error('Provider Account ID does not match token subject');
    }

    const existingAuthAccount = await ctx.runQuery(internal.authAccounts.getByProviderAndAccountId, {
      provider: 'workos',
      providerAccountId: args.providerAccountId,
    });

    if (!existingAuthAccount) {
      let userId: Id<'users'>;

      const currentUserByEmail = await ctx.runQuery(internal.user.getByEmail, {
        email: user.email,
      });

      if (currentUserByEmail) {
        console.log('User already exists with this email, linking accounts');

        userId = currentUserByEmail._id;
      } else {
        console.log('Creating new user');
        const newCreatedUserId = await ctx.runMutation(internal.user.create, {
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          image: user.profilePictureUrl || undefined,
          email: user.email,
          emailVerificationTime: user.emailVerified ? Date.now() : undefined,
          isAnonymous: false,
        });

        userId = newCreatedUserId;
      }

      await ctx.runMutation(internal.authAccounts.create, {
        userId,
        provider: 'workos',
        providerAccountId: args.providerAccountId,
        emailVerified: user.emailVerified ? new Date().toISOString() : undefined,
      });

      return userId;
    }
  },
});

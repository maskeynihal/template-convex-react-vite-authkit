/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as authAccounts from "../authAccounts.js";
import type * as authUserCreators from "../authUserCreators.js";
import type * as helpers_auth from "../helpers/auth.js";
import type * as http from "../http.js";
import type * as randomNumbers from "../randomNumbers.js";
import type * as scheduler from "../scheduler.js";
import type * as user from "../user.js";
import type * as workos from "../workos.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  authAccounts: typeof authAccounts;
  authUserCreators: typeof authUserCreators;
  "helpers/auth": typeof helpers_auth;
  http: typeof http;
  randomNumbers: typeof randomNumbers;
  scheduler: typeof scheduler;
  user: typeof user;
  workos: typeof workos;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

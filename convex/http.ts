import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api, internal } from './_generated/api';

const http = httpRouter();

// HTTP actions can be defined inline...
// http.route({
//   path: '/auth/callback',
//   method: 'GET',
//   handler: httpAction(async ({ runAction }, request) => {
//     console.log({ request });
//     const code = new URL(request.url)?.searchParams.get('code')!;

//     console.log({ code });

//     const data = await runAction(internal.auth.createUser, { code });

//     console.log({ data });

//     return Response.redirect(`http://localhost:5173/callback/code=${code}`);
//   }),
// });

export default http;

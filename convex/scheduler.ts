import { v } from 'convex/values';
import { query } from './_generated/server';

export const getSchedulerJobStatusById = query({
  args: {
    id: v.id('_scheduled_functions'),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.system.get(args.id);

    if (!job) {
      throw new Error('Job not found');
    }

    return job.state.kind ?? 'unknown';
  },
});

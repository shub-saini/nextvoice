import { mutation, query } from './_generated/server';

export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const users = ctx.db.query('users').collect();

    return users;
  },
});

export const add = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('Not authenticated');
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new Error('Missing organization');
    }

    throw new Error('Test Error');

    const userId = await ctx.db.insert('users', {
      name: 'Shubham',
    });

    return userId;
  },
});

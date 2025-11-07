import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';

export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id('contactSessions'),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);

    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid session',
      });
    }

    const threadId = '123';

    const conversationId = await ctx.db.insert('conversations', {
      threadId: '',
      contactSessionId: session._id,
      status: 'unresolved',
      organizationId: args.organizationId,
    });
  },
});

import { ConvexError, v } from 'convex/values';
import { action, query } from '../_generated/server';
import { internal } from '../_generated/api';
import { supportAgent } from '../system/ai/agent/supportAgent';
import { paginationOptsValidator } from 'convex/server';
import { resolveConversationTool } from '../system/ai/tools/resolveConversationTool';
import { escalateConversationTool } from '../system/ai/tools/escalateConversationTool';
import { searchTool } from '../system/ai/tools/searchTool';

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id('contactSessions'),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      {
        contactSessionId: args.contactSessionId,
      }
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid session',
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: args.threadId,
      }
    );

    if (!conversation) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Conversation not found',
      });
    }

    if (conversation.status === 'resolved') {
      throw new ConvexError({
        code: 'BAD_REQUEST',
        message: 'Coversation resolved',
      });
    }

    const shouldTriggerAgent = conversation.status === 'unresolved';

    if (shouldTriggerAgent) {
      const assistantResponse = await supportAgent.generateText(
        ctx,
        { threadId: args.threadId },
        {
          prompt: args.prompt,
          tools: {
            resolveConversationTool,
            escalateConversationTool,
            searchTool,
          },
        }
      );

      // if (
      //   assistantResponse.toolCalls &&
      //   assistantResponse.toolCalls.length > 0
      // ) {
      //   for (const toolCall of assistantResponse.toolCalls) {
      //     if (toolCall.toolName === 'escalateConversation') {
      //       await supportAgent.saveMessage(ctx, {
      //         threadId: args.threadId,
      //         message: {
      //           role: 'assistant',
      //           content: 'Conversation Escalated to a human operator',
      //         },
      //       });
      //     }

      //     if (toolCall.toolName === 'resolveConversation') {
      //       await supportAgent.saveMessage(ctx, {
      //         threadId: args.threadId,
      //         message: {
      //           role: 'assistant',
      //           content: 'Conversation resoved.',
      //         },
      //       });
      //     }

      //     if (toolCall.toolName === 'search') {
      //       await supportAgent.saveMessage(ctx, {
      //         threadId: args.threadId,
      //         message: {
      //           role: 'assistant',
      //           content: 'Refer to the information above',
      //         },
      //       });
      //     }
      //   }
      // }
    } else {
      await supportAgent.saveMessage(ctx, {
        threadId: args.threadId,
        prompt: args.prompt,
      });
    }
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id('contactSessions'),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid session',
      });
    }

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    return paginated;
  },
});

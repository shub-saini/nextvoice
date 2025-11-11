'use client';

import { api } from '@workspace/backend/_generated/api';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { useMutation, useQuery } from 'convex/react';
import { MoreHorizontalIcon, Wand2Icon } from 'lucide-react';
import React from 'react';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@workspace/ui/components/shadcn-io/ai/prompt-input';
import {
  Conversation,
  ConversationContent,
} from '@workspace/ui/components/shadcn-io/ai/conversation';
import {
  Message,
  MessageContent,
} from '@workspace/ui/components/shadcn-io/ai/message';
import { Form, FormField } from '@workspace/ui/components/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toUIMessages, useThreadMessages } from '@convex-dev/agent/react';
import { DicebearAvatar } from '@workspace/ui/components/dicebear-avatar';

const formSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<'conversations'>;
}) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : 'skip',
    { initialNumItems: 10 }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const createMessage = useMutation(api.private.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        conversationId,
        prompt: values.message,
      });

      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex h-full flex-col bg-muted'>
      <header className='flex items-center justify-center border-b bg-background p-2.5'>
        <Button size={'sm'} variant={'ghost'}>
          <MoreHorizontalIcon />
        </Button>
      </header>
      <Conversation className='max-h-[calc(100vh-180px)]'>
        <ConversationContent>
          {toUIMessages(messages.results ?? [])?.map((message) => (
            <Message
              from={message.role === 'user' ? 'assistant' : 'user'}
              key={message.id}
            >
              <MessageContent>{message.text}</MessageContent>
              {message.role === 'user' && (
                <DicebearAvatar
                  seed={conversation?.contactSession._id ?? 'user'}
                  size={32}
                />
              )}
            </Message>
          ))}
        </ConversationContent>
      </Conversation>

      <div className='p-2'>
        <Form {...form}>
          <PromptInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === 'resolved'}
              name='message'
              render={({ field }) => (
                <PromptInputTextarea
                  disabled={
                    conversation?.status === 'resolved' ||
                    form.formState.isSubmitting
                    // can keep enhancing
                  }
                  onChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === 'resolved'
                      ? 'This conversation has been resolved.'
                      : 'Type your response as an operator...'
                  }
                  value={field.value}
                />
              )}
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputButton>
                  <Wand2Icon />
                  Enhance
                </PromptInputButton>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={
                  conversation?.status === 'resolved' ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting
                }
                status='ready'
                type='submit'
              />
            </PromptInputToolbar>
          </PromptInput>
        </Form>
      </div>
    </div>
  );
};

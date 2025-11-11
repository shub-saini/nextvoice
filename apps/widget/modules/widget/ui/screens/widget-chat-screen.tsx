import { useAtomValue, useSetAtom } from 'jotai';
import React from 'react';
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  organizationAtom,
  screenAtom,
} from '../../atoms/widget-atoms';
import { WidgetHeader } from '../components/widget-header';
import { ArrowLeftIcon, MenuIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { useAction, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { toUIMessages, useThreadMessages } from '@convex-dev/agent/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Conversation,
  ConversationContent,
} from '@workspace/ui/components/shadcn-io/ai/conversation';
import {
  Message,
  MessageContent,
} from '@workspace/ui/components/shadcn-io/ai/message';
import { Form, FormField } from '@workspace/ui/components/form';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@workspace/ui/components/shadcn-io/ai/prompt-input';
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import { InfiniteScrollTrigger } from '@workspace/ui/components/infinite-scroll-trigger';
import { DicebearAvatar } from '@workspace/ui/components/dicebear-avatar';

const formSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || '')
  );

  const conversation = useQuery(
    api.public.conversations.getOne,
    contactSessionId && conversationId
      ? {
          conversationId,
          contactSessionId,
        }
      : 'skip'
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId,
        }
      : 'skip',
    { initialNumItems: 10 }
  );

  const { topElementRef, handleLoadMore, canloadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
      // observerEnabled: false,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const createMessage = useAction(api.public.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }

    form.reset();

    await createMessage({
      threadId: conversation.threadId,
      prompt: values.message,
      contactSessionId,
    });
  };

  const onBack = () => {
    setConversationId(null);
    setScreen('selection');
  };

  return (
    <>
      <WidgetHeader className='flex justify-between items-center'>
        <div className='flex items-center gap-x-2'>
          <Button variant={'transparent'} size={'icon'} onClick={onBack}>
            <ArrowLeftIcon />
          </Button>
          <p>Chat</p>
        </div>
        <Button size={'icon'} variant={'transparent'}>
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <Conversation>
        <ConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canloadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => {
            return (
              <Message
                from={message.role === 'user' ? 'user' : 'assistant'}
                key={message.id}
                className='flex items-center'
              >
                <MessageContent>
                  {message.text}
                  {/* <Response>
                  </Response> */}
                </MessageContent>
                {message.role === 'assistant' && (
                  <DicebearAvatar
                    imageUrl='/logo.svg'
                    seed='assistant'
                    size={32}
                    // badgeImageUrl='/logo.svg'
                    // badgeClassName='w-8 h-8'
                  />
                )}
              </Message>
            );
          })}
        </ConversationContent>
      </Conversation>
      <Form {...form}>
        <PromptInput
          className='rounded-none border-x-0 border-b-0'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            disabled={conversation?.status === 'resolved'}
            name='message'
            render={({ field }) => (
              <PromptInputTextarea
                disabled={
                  conversation?.status === 'resolved' ||
                  form.formState.isSubmitting
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
                    : 'Type your message...'
                }
                value={field.value}
              />
            )}
          />
          <PromptInputToolbar>
            <PromptInputTools />
            <PromptInputSubmit
              disabled={
                conversation?.status === 'resolved' || !form.formState.isValid
              }
              status='ready'
              type='submit'
            />
          </PromptInputToolbar>
        </PromptInput>
      </Form>
    </>
  );
};

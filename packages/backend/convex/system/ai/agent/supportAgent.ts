import { openai } from '@ai-sdk/openai';
import { Agent } from '@convex-dev/agent';

import { components } from '../../../_generated/api';

export const supportAgent = new Agent(components.agent, {
  name: 'Support Agent',
  languageModel: openai.chat('gpt-5-mini'),
  instructions: 'You are a Customer support agent',
});

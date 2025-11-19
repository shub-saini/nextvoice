import { z } from 'zod';
import {} from '@workspace/ui/components/card';

import React from 'react';
import { Doc } from '@workspace/backend/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Loader2Icon } from 'lucide-react';

export const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, 'Greeting message is required'),
  defaultSuggestions: z.object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
  }),
  vapiSettings: z.object({
    assistantId: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});

type WidgetSettings = Doc<'widgetSettings'>;

interface CustomizationFormProps {
  initialData?: WidgetSettings | null;
}

export const CustomizationForm = ({ initialData }: CustomizationFormProps) => {
  return <div>Form!!</div>;
};

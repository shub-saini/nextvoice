'use client';
import React from 'react';
import { useVapiAssistants, useVapiPhoneNumbers } from '../../hooks/use-vapi';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { BotIcon } from 'lucide-react';

export const VapiAssistantsTab = () => {
  const { data: assistants, isLoading, error } = useVapiAssistants();
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className='border-t bg-background'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='px-6 py-4'>Assistant</TableHead>
            <TableHead className='px-6 py-4'>Model</TableHead>
            <TableHead className='px-6 py-4'>First Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className='px-6 py-8 text-center text-muted-foreground'
                  >
                    Loading Assistants...
                  </TableCell>
                </TableRow>
              );
            }

            if (assistants.length === 0) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className='px-6 py-8 text-center text-muted-foreground'
                  >
                    No assistants configured
                  </TableCell>
                </TableRow>
              );
            }

            return assistants.map((assistant) => (
              <TableRow className='hover:bg-muted/50' key={assistant.id}>
                <TableCell className='px-6 py-4 flex gap-2'>
                  <div className='flex items-center gap-3'>
                    <BotIcon className='size-4 text-muted-foreground' />
                  </div>
                  <span>{assistant.name || 'Unnamed Assistant'}</span>
                </TableCell>
                <TableCell className='px-6 py-4'>
                  <span className='text-sm'>
                    {assistant.model?.model || 'Not configured'}
                  </span>
                </TableCell>
                <TableCell className='max-w-xs px-6 py-4'>
                  <span className='block max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground text-sm'>
                    {assistant.firstMessage || 'No greeting configured'}
                  </span>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
};

'use client';
import React from 'react';
import { useVapiPhoneNumbers } from '../../hooks/use-vapi';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { CheckCircleIcon, PhoneIcon, XCircleIcon } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';

export const VapiPhoneNumbersTab = () => {
  const { data: phoneNumbers, isLoading, error } = useVapiPhoneNumbers();
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
            <TableHead className='px-6 py-4'>Phone Number</TableHead>
            <TableHead className='px-6 py-4'>Name</TableHead>
            <TableHead className='px-6 py-4'>Status</TableHead>
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
                    Loading Phone Numbers...
                  </TableCell>
                </TableRow>
              );
            }

            if (phoneNumbers.length === 0) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className='px-6 py-8 text-center text-muted-foreground'
                  >
                    No phone numbers configured
                  </TableCell>
                </TableRow>
              );
            }

            return phoneNumbers.map((phone) => (
              <TableRow className='hover:bg-muted/50' key={phone.id}>
                <TableCell className='px-6 py-4 flex gap-2'>
                  <div className='flex items-center gap-3'>
                    <PhoneIcon className='size-4 text-muted-foreground' />
                  </div>
                  <span>{phone.number || 'Not configured'}</span>
                </TableCell>
                <TableCell className='px-6 py-4'>
                  <span>{phone.name || 'Unnamed'}</span>
                </TableCell>
                <TableCell className='px-6 py-4'>
                  <Badge
                    className='capitalize'
                    variant={
                      phone.status === 'active' ? 'default' : 'destructive'
                    }
                  >
                    {phone.status === 'active' && (
                      <div className='flex gap-1 items-center'>
                        <CheckCircleIcon className='mr-1 size-3' />
                        Active
                      </div>
                    )}
                    {phone.status !== 'active' && (
                      <div className='flex gap-1 items-center'>
                        <XCircleIcon className='mr-1 size-3' />
                        Unactive
                      </div>
                    )}
                  </Badge>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
};

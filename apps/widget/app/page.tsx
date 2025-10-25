'use client';

import { Button } from '@workspace/ui/components/button';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);

  return (
    <div className='flex flex-col items-center justify-center min-h-svh'>
      <Button
        onClick={() => {
          addUser();
        }}
      >
        Add User
      </Button>
      <p>apps/widget</p>
      <p>{JSON.stringify(users, null, 2)}</p>
    </div>
  );
}

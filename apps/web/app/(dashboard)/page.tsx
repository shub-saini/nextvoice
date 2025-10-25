'use client';

import { Button } from '@workspace/ui/components/button';
import {
  useQuery,
  useMutation,
  Authenticated,
  Unauthenticated,
} from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { OrganizationSwitcher, SignInButton, UserButton } from '@clerk/nextjs';

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);

  return (
    <>
      <Authenticated>
        <div className='flex flex-col items-center justify-center min-h-svh'>
          <Button
            onClick={() => {
              addUser();
            }}
          >
            Add User
          </Button>
          <p>apps/web</p>
          <UserButton />
          <OrganizationSwitcher hidePersonal />
          <p>{JSON.stringify(users, null, 2)}</p>
        </div>
      </Authenticated>
      <Unauthenticated>
        Must be signed in
        <SignInButton />
      </Unauthenticated>
    </>
  );
}

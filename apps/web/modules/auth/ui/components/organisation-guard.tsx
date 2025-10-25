'use client';

import { useOrganization } from '@clerk/nextjs';
import { AuthLayout } from '@/modules/auth/ui/layouts/auth-layout';
import { OrgSelectView } from '@/modules/auth/ui/view/org-select-view';

export const OrganizationGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { organization } = useOrganization();
  const id = organization?.id;
  if (!id) {
    return (
      <AuthLayout>
        <OrgSelectView />
      </AuthLayout>
    );
  }

  return <div>{children}</div>;
};

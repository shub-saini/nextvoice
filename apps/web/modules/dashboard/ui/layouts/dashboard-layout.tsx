import { AuthGuard } from '@/modules/auth/ui/components/auth-guard';
import { OrganizationGuard } from '@/modules/auth/ui/components/organisation-guard';
import { SidebarProvider } from '@workspace/ui/components/sidebar';
import { cookies } from 'next/headers';
import React from 'react';
import { DashboardSidebar } from '../components/dashboard-sidebar';
import { Provider } from 'jotai';

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get('sidebar_state')?.value;
  const defaultOpen = sidebarState === 'false' ? false : true;

  return (
    <AuthGuard>
      <OrganizationGuard>
        <Provider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <DashboardSidebar />
            <main className='flex flex-1 flex-col'>{children}</main>
          </SidebarProvider>
        </Provider>
      </OrganizationGuard>
    </AuthGuard>
  );
};

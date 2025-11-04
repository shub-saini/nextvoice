import { AuthGuard } from '@/modules/auth/ui/components/auth-guard';
import { OrganizationGuard } from '@/modules/auth/ui/components/organisation-guard';
import { DashboardLayout } from '@/modules/dashboard/ui/layouts/dashboard-layout';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;

'use client';

// import { Widgetfooter } from '../components/widget-footer';
import { WidgetAuthScreen } from '../screens/widget-auth-screen';

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  return (
    <main className='min-h-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted'>
      <WidgetAuthScreen />
      {/* <Widgetfooter /> */}
    </main>
  );
};

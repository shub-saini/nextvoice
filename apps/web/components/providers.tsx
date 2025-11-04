'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file');
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function ClerkAndConvexProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);
  console.log('theme', theme);

  React.useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  const clerkTheme = theme === 'dark' ? dark : undefined;

  return (
    <ClerkProvider
      appearance={{
        theme: clerkTheme,
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ClerkAndConvexProvider>{children}</ClerkAndConvexProvider>
    </NextThemesProvider>
  );
}

// components/providers/session-provider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// This component ensures NextAuth session data is available to client components
export default function NextAuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

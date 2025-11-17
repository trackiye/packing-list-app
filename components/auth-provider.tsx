// components/auth-provider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// NOTE: This component wraps the application with NextAuth's SessionProvider.
// The failure (reading 'call') often means this wrapper was missing or malformed.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}

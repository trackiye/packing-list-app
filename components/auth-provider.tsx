// components/auth-provider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// This component MUST be a client component because it uses next-auth/react
export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}

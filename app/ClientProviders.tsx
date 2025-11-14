// app/ClientProviders.tsx
"use client";

import { AuthProvider } from "./providers";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}

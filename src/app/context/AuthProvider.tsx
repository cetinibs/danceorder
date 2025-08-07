'use client'

import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Login ve public sayfalar için session kontrolü yapma
  if (pathname === '/login' || pathname === '/') {
    return <>{children}</>
  }

  return <SessionProvider>{children}</SessionProvider>
} 
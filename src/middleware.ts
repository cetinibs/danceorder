import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Login sayfasına erişimi kontrol et
    if (path === '/login' && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Öğretmen erişim kısıtlamaları
    if (token?.role === 'teacher') {
      const restrictedPaths = [
        '/dashboard/teachers',
        '/dashboard/rooms',
        '/dashboard/services',
        '/dashboard/packages',
        '/dashboard/settings'
      ]

      if (restrictedPaths.some(restricted => path.startsWith(restricted))) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Login sayfası için auth kontrolü yapma
        if (req.nextUrl.pathname === '/login') {
          return true
        }
        // Diğer sayfalar için token kontrolü
        return !!token
      }
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/login']
} 
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isOnAdmin = nextUrl.pathname.startsWith('/admin');
  const isOnLogin = nextUrl.pathname === '/admin/login';
  const isApiAuth = nextUrl.pathname.startsWith('/api/auth');

  // Allow API auth routes
  if (isApiAuth) {
    return NextResponse.next();
  }

  // Protect /admin routes (except /admin/login)
  if (isOnAdmin && !isOnLogin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', nextUrl));
    }
  }

  // Redirect logged in users away from login page
  if (isLoggedIn && isOnLogin) {
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*'],
};

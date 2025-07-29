import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/auth-edge';

// Define protected routes and their requirements
const protectedRoutes = [
  { path: '/profile', requiredRole: null }, // Any authenticated user
  { path: '/admin', requiredRole: 'admin' },
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/',
  '/profile/index', // Profile index is public
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and most API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if route is protected
  const protectedRoute = protectedRoutes.find(route => 
    pathname.startsWith(route.path)
  );

  if (!protectedRoute) {
    // Route is neither public nor explicitly protected, allow access
    return NextResponse.next();
  }

  // Extract token from cookies or authorization header
  let token: string | undefined;
  
  // Try to get from cookies first
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    token = cookies.accessToken;
  }
  
  // If no token in cookies, try authorization header
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // No token found, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify token using Edge Runtime compatible function
    const payload = await verifyTokenEdge(token);
    
    if (!payload) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role requirements
    if (protectedRoute.requiredRole) {
      const hasRequiredRole = payload.role === protectedRoute.requiredRole;
      const isAdmin = payload.role === 'admin';
      
      if (!hasRequiredRole && !isAdmin) {
        // Redirect to unauthorized page or home
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Add user info to response headers for use in pages/API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId);
    response.headers.set('x-user-email', payload.email);
    response.headers.set('x-user-role', payload.role);

    return response;

  } catch (error) {
    console.error('Middleware auth error:', error);
    
    // Token verification failed, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}; 
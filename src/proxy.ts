import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isAdminRoute = path.startsWith('/admin') && !path.startsWith('/admin/login');
  
  // Protect all API routes except GET and Auth routes
  const isProtectedApiRoute = path.startsWith('/api/') && !path.startsWith('/api/auth');
  
  if (isAdminRoute) {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (isProtectedApiRoute && request.method !== 'GET') {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ],
};

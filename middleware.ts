import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const limitMap = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string, max: number): boolean {
  const now = Date.now();
  const key = ip;
  const record = limitMap.get(key);
  
  if (!record || now > record.reset) {
    limitMap.set(key, { count: 1, reset: now + 60000 });
    return true;
  }
  
  if (record.count >= max) return false;
  
  record.count++;
  return true;
}

export function middleware(req: NextRequest) {
  const ip = req.ip || 'unknown';
  
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const max = req.nextUrl.pathname.includes('/chat') ? 10 : 100;
    
    if (!rateLimit(ip, max)) {
      return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Retry-After': '60',
        }
      });
    }
  }
  
  const res = NextResponse.next();
  
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  if (req.nextUrl.pathname.startsWith('/_next/static/') || 
      req.nextUrl.pathname.startsWith('/images/')) {
    res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  return res;
}

export const config = { 
  matcher: [
    '/api/:path*',
    '/_next/static/:path*',
    '/images/:path*',
  ] 
};

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
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  return res;
}

export const config = { matcher: ['/api/:path*'] };

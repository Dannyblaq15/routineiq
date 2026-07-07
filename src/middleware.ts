import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting (per-instance)
// Keys: IP addresses, Values: { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Config
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute per IP

export function middleware(request: NextRequest) {
  // Only apply rate limiting to /api/* routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Get IP address, fallback to a default if not found
    const ip = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown-ip';
    const now = Date.now();

    const requestData = rateLimitMap.get(ip);

    if (!requestData) {
      // First request from this IP
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    } else {
      if (now > requestData.resetTime) {
        // Window expired, reset
        rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
      } else {
        // Increment count
        requestData.count++;
        if (requestData.count > MAX_REQUESTS) {
          // Rate limit exceeded
          return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
              'Retry-After': Math.ceil((requestData.resetTime - now) / 1000).toString(),
              'X-RateLimit-Limit': MAX_REQUESTS.toString(),
              'X-RateLimit-Remaining': '0',
            },
          });
        }
      }
    }

    // Periodically clean up old entries to prevent memory leaks in long-running instances
    // Doing this randomly (~1% of requests) keeps overhead low
    if (Math.random() < 0.01) {
      for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetTime) {
          rateLimitMap.delete(key);
        }
      }
    }
    
    // Add rate limit headers to successful responses
    const res = NextResponse.next();
    const currentData = rateLimitMap.get(ip);
    if (currentData) {
      res.headers.set('X-RateLimit-Limit', MAX_REQUESTS.toString());
      res.headers.set('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - currentData.count).toString());
    }
    return res;
  }

  return NextResponse.next();
}

// Configure middleware to run only on API routes to save execution time
export const config = {
  matcher: '/api/:path*',
};

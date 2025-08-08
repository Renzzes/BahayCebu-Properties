import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers)
    }
  })

  response.headers.set('Accept', '*/*')
  response.headers.set('Access-Control-Allow-Origin', 'https://bahaycebu-properties.com')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

export const config = {
  matcher: '/api/:path*'
}
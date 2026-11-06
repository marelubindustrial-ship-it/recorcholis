import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware de protección del CRM.
 * Solo roles ADMIN y EDITOR pueden entrar a /admin (salvo la API de auth).
 */
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');
  if (isAuthRoute) return NextResponse.next();

  // Sin sesión se permite ver la pantalla de login del CRM (el cliente
  // renderiza el formulario); la API de leads exige token por separado.
  if (!token) return NextResponse.next();

  if (token.role !== 'ADMIN' && token.role !== 'EDITOR') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

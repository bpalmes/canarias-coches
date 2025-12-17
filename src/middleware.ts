import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from '@/lib/config';

interface DecodedToken {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware ejecutándose para:', request.nextUrl.pathname);
  
  // Solo proteger rutas admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('🔒 Protegiendo ruta admin:', request.nextUrl.pathname);
    
    const token = request.cookies.get('authToken')?.value;
    console.log('🍪 Token encontrado:', token ? 'SÍ' : 'NO');
    
    if (!token) {
      console.log('❌ Middleware - No hay token, redirigiendo a login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const decoded = payload as unknown as DecodedToken;
      console.log('✅ Token válido para:', decoded.email, 'Role:', decoded.role);
      
      if (!decoded || decoded.role !== 'ADMIN') {
        console.log('❌ Middleware - Usuario no es admin, redirigiendo a login');
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // Token válido, continuar
      console.log('✅ Middleware - Acceso permitido a admin');
      return NextResponse.next();
      
    } catch (error) {
      // Token inválido o expirado
      console.log('❌ Middleware - Error verificando token:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    console.log('✅ Ruta no admin, continuando...');
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

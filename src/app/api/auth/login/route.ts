import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, COOKIE_CONFIG } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: identifier },
    });

    if (!user) {
      return NextResponse.json({ error: { message: 'Invalid credentials' } }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: { message: 'Invalid credentials' } }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Preparar respuesta JSON

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    
    const response = NextResponse.json({ 
      jwt: token,
      user: userWithoutPassword 
    });

    // Establecer cookies por separado usando la API de NextResponse (evita combinar Set-Cookie)
    // Cookie httpOnly para middleware/servidor
    response.cookies.set({
      name: COOKIE_CONFIG.name,
      value: token,
      httpOnly: true,
      secure: COOKIE_CONFIG.secure,
      sameSite: COOKIE_CONFIG.sameSite,
      maxAge: COOKIE_CONFIG.maxAge,
      path: COOKIE_CONFIG.path,
    });
    // Cookie accesible para el cliente (nombre distinto)
    response.cookies.set({
      name: `${COOKIE_CONFIG.name}Client`,
      value: token,
      httpOnly: false,
      secure: COOKIE_CONFIG.secure,
      sameSite: COOKIE_CONFIG.sameSite,
      maxAge: COOKIE_CONFIG.maxAge,
      path: COOKIE_CONFIG.path,
    });
    
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: { message: 'An internal server error occurred.' } }, { status: 500 });
  }
} 
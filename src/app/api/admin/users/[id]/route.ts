import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from 'bcryptjs';

async function verifyAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;
  return ['ADMIN', 'SUPER_ADMIN'].includes(session.user.role);
}

// PUT - Actualizar usuario
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);
    const { email, password, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email y role son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el email ya existe en otro usuario
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
        id: { not: userId },
      },
    });

    if (emailExists) {
      return NextResponse.json(
        { error: 'El email ya está registrado por otro usuario' },
        { status: 400 }
      );
    }

    // Preparar datos de actualización
    const updateData: {
      email: string;
      role: 'USER' | 'ADMIN';
      password?: string;
    } = {
      email,
      role: role as 'USER' | 'ADMIN',
    };

    // Solo actualizar contraseña si se proporciona
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // No permitir eliminar el último admin
    if (existingUser.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'No se puede eliminar el último administrador' },
          { status: 400 }
        );
      }
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('User deletion error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - Actualizar lead
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        walcuStatus: body.walcuStatus,
        walcuLeadId: body.walcuLeadId,
        walcuError: body.walcuError,
        ...body
      }
    });
    
    return NextResponse.json({
      success: true,
      data: lead
    });
    
  } catch (error) {
    console.error('Error actualizando lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.lead.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Lead eliminado correctamente'
    });
    
  } catch (error) {
    console.error('Error eliminando lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

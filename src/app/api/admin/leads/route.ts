import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener todos los leads con paginación y filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // Construir filtros
    const where: {
      walcuStatus?: string;
      OR?: Array<{
        firstName?: { contains: string; mode: 'insensitive' };
        lastName?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
        carMake?: { contains: string; mode: 'insensitive' };
        carModel?: { contains: string; mode: 'insensitive' };
        carLicensePlate?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};
    
    if (status && status !== 'all') {
      where.walcuStatus = status;
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { carMake: { contains: search, mode: 'insensitive' } },
        { carModel: { contains: search, mode: 'insensitive' } },
        { carLicensePlate: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Obtener leads con información del coche
    const leads = await prisma.lead.findMany({
      where,
      include: {
        car: {
          select: {
            id: true,
            make: true,
            model: true,
            version: true,
            year: true,
            numberplate: true,
            sku: true,
            regularPrice: true,
            images: {
              where: { isPrimary: true },
              select: { url: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
    
    // Contar total para paginación
    const total = await prisma.lead.count({ where });
    
    // Contar por estado
    const statusCounts = await prisma.lead.groupBy({
      by: ['walcuStatus'],
      _count: { walcuStatus: true }
    });
    
    const statusSummary = statusCounts.reduce((acc, item) => {
      acc[item.walcuStatus] = item._count.walcuStatus;
      return acc;
    }, {} as Record<string, number>);
    
    return NextResponse.json({
      success: true,
      data: {
        leads,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        statusSummary
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo leads:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const lead = await prisma.lead.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        message: body.message,
        carId: body.carId,
        carMake: body.carMake,
        carModel: body.carModel,
        carYear: body.carYear,
        carLicensePlate: body.carLicensePlate,
        carStockNumber: body.carStockNumber,
        source: body.source,
        medium: body.medium,
        campaign: body.campaign,
        leadType: 'sales', // Leads del formulario web son de ventas (clientes que quieren comprar)
        walcuStatus: 'pending'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: lead
    });
    
  } catch (error) {
    console.error('Error creando lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

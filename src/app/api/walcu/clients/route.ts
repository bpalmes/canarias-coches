import { NextRequest, NextResponse } from 'next/server';
import { WalcuClientService } from '@/services/walcu-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const walcuService = new WalcuClientService();
    
    const client = await walcuService.createClient(body);
    
    return NextResponse.json({
      success: true,
      data: client,
      message: 'Cliente creado exitosamente en Walcu CRM'
    });
  } catch (error) {
    console.error('Error creating client in Walcu:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error creating client in Walcu CRM',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    
    if (!email && !phone) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Se requiere email o teléfono para buscar clientes'
        },
        { status: 400 }
      );
    }

    const walcuService = new WalcuClientService();
    let client = null;

    if (email) {
      client = await walcuService.findClientByEmail(email);
    } else if (phone) {
      client = await walcuService.findClientByPhone(phone);
    }

    if (client) {
      return NextResponse.json({
        success: true,
        data: client,
        message: 'Cliente encontrado'
      });
    } else {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Cliente no encontrado'
      });
    }
  } catch (error) {
    console.error('Error searching client in Walcu:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error searching client in Walcu CRM',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { WalcuService } from '@/services/walcu-service';

export async function POST(request: NextRequest) {
  console.log('🚀 API Route: POST /api/walcu/forms iniciado');
  
  try {
    const body = await request.json();
    const { formType, ...formData } = body;
    
    console.log('📋 API Route: Request body recibido:', body);
    console.log('🏷️ API Route: Tipo de formulario:', formType);
    console.log('📊 API Route: Datos del formulario:', formData);
    
    if (!formType) {
      console.error('❌ API Route: Tipo de formulario no especificado');
      return NextResponse.json(
        { 
          success: false,
          error: 'Se requiere especificar el tipo de formulario'
        },
        { status: 400 }
      );
    }

    console.log('🔧 API Route: Creando instancia de WalcuService...');
    const walcuService = new WalcuService();
    let result;

    console.log('🔄 API Route: Procesando formulario tipo:', formType);
    
    switch (formType) {
      case 'contact':
        console.log('📞 API Route: Procesando formulario de contacto...');
        result = await walcuService.processContactForm(formData);
        break;
      case 'car_interest':
        console.log('🚗 API Route: Procesando formulario de interés en vehículo...');
        result = await walcuService.processCarInterestForm(formData);
        break;
      case 'appraisal':
        console.log('💰 API Route: Procesando formulario de tasación...');
        result = await walcuService.processAppraisalForm(formData);
        break;
      default:
        console.error('❌ API Route: Tipo de formulario no válido:', formType);
        return NextResponse.json(
          { 
            success: false,
            error: 'Tipo de formulario no válido. Debe ser: contact, car_interest o appraisal'
          },
          { status: 400 }
        );
    }

    console.log('📥 API Route: Resultado del procesamiento:', result);

    if (result.success) {
      console.log('✅ API Route: Formulario procesado exitosamente');
      return NextResponse.json({
        success: true,
        data: result,
        message: `Formulario de ${formType} procesado exitosamente en Walcu CRM`
      });
    } else {
      console.error('❌ API Route: Error en el procesamiento del formulario:', result.error);
      return NextResponse.json({
        success: false,
        error: 'Error procesando formulario en Walcu CRM',
        message: result.error || 'Error desconocido'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('💥 API Route: Error inesperado durante el procesamiento:', error);
    console.error('🔍 API Route: Tipo de error:', typeof error);
    console.error('📝 API Route: Mensaje de error:', error instanceof Error ? error.message : 'Error desconocido');
    console.error('📚 API Route: Stack trace:', error instanceof Error ? error.stack : 'No disponible');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error processing form in Walcu CRM',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (!action) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Se requiere especificar la acción (connection, stats)'
        },
        { status: 400 }
      );
    }

    const walcuService = new WalcuService();
    let result;

    switch (action) {
      case 'connection':
        result = await walcuService.checkConnection();
        break;
      case 'stats':
        result = await walcuService.getIntegrationStats();
        break;
      default:
        return NextResponse.json(
          { 
            success: false,
            error: 'Acción no válida. Debe ser: connection o stats'
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Acción ${action} ejecutada exitosamente`
    });
  } catch (error) {
    console.error('Error executing action in Walcu:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error executing action in Walcu CRM',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

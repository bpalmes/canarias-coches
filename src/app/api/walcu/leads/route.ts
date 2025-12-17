import { NextRequest, NextResponse } from 'next/server';
import { WalcuLeadService } from '@/services/walcu-lead';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...leadData } = body;
    
    if (!type) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Se requiere especificar el tipo de lead (sale, aftersale, appraisal)'
        },
        { status: 400 }
      );
    }

    const walcuService = new WalcuLeadService();
    let lead;

    switch (type) {
      case 'sale':
        lead = await walcuService.createSaleLead(leadData);
        break;
      case 'aftersale':
        lead = await walcuService.createAftersaleLead(leadData);
        break;
      case 'appraisal':
        lead = await walcuService.createAppraisalLead(leadData);
        break;
      default:
        return NextResponse.json(
          { 
            success: false,
            error: 'Tipo de lead no válido. Debe ser: sale, aftersale o appraisal'
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: lead,
      message: `Lead de ${type} creado exitosamente en Walcu CRM`
    });
  } catch (error) {
    console.error('Error creating lead in Walcu:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error creating lead in Walcu CRM',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');
    const type = searchParams.get('type');
    
    if (!leadId || !type) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Se requiere ID y tipo del lead para buscarlo'
        },
        { status: 400 }
      );
    }

    const walcuService = new WalcuLeadService();
    const lead = await walcuService.getLeadById(leadId, type as 'sale' | 'aftersale' | 'appraisal');

    if (lead) {
      return NextResponse.json({
        success: true,
        data: lead,
        message: 'Lead encontrado'
      });
    } else {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Lead no encontrado'
      });
    }
  } catch (error) {
    console.error('Error searching lead in Walcu:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error searching lead in Walcu CRM',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

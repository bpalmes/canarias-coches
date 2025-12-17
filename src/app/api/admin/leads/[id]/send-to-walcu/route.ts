import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await params;
    
    console.log(`[WALCU SEND] Enviando lead ${leadId} a Walcu`);
    
    // Buscar el lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { car: true }
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya fue enviado exitosamente (permitir reenvío manual pero con advertencia)
    const isReenvio = lead.walcuStatus === 'sent' && lead.walcuLeadId;
    
    if (isReenvio) {
      console.log(`[WALCU SEND] REENVÍO MANUAL: Lead ${leadId} ya fue enviado anteriormente (ID: ${lead.walcuLeadId}), pero se procederá con el reenvío manual`);
    }

    console.log(`[WALCU SEND] Preparando datos del lead:`, {
      id: lead.id,
      firstName: lead.firstName,
      email: lead.email,
      walcuStatus: lead.walcuStatus
    });

    // Preparar datos del vehículo del cliente (que quiere vender)
    const carData = {
      make: lead.carMake || '',
      model: lead.carModel || '',
      year: lead.carYear || new Date().getFullYear(),
      license_plate: lead.carLicensePlate || '',
      stock_number: lead.carStockNumber || '',
      category: 'car' as const,
      type: 'used' as const
    };

    // Preparar mensaje completo
    let fullMessage = lead.message || 'Cliente interesado en vender su vehículo';
    
    // Añadir información adicional si existe
    const additionalInfo = [];
    if (lead.source) additionalInfo.push(`Fuente: ${lead.source}`);
    if (lead.medium) additionalInfo.push(`Medio: ${lead.medium}`);
    if (lead.campaign) additionalInfo.push(`Campaña: ${lead.campaign}`);
    
    if (additionalInfo.length > 0) {
      fullMessage += ` | ${additionalInfo.join(', ')}`;
    }

    console.log(`[WALCU SEND] Enviando a Walcu API:`, {
      type: 'appraisal',
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      carData
    });

    // Enviar a Walcu directamente usando el servicio
    try {
      console.log(`[WALCU SEND] Enviando lead ${leadId} a Walcu directamente`);
      
      const { WalcuCRMService } = await import('@/services/walcu-crm');
      const walcuService = new WalcuCRMService();
      
      // Importar el servicio de construcción de payloads
      const { buildWalcuPayload, determineLeadType, formatLeadMessage } = await import('@/lib/walcu-payload-builder');
      
      // Determinar el tipo de lead basado en el origen
      const leadType = determineLeadType(lead.source || undefined, lead.sheetName || undefined);
      
      // Preparar datos del cliente
      const clientData = {
        foreign_id: `@${Date.now()}`,
        first_name: lead.firstName,
        last_name: lead.lastName || '',
        email: lead.email,
        phone: lead.phone || undefined
      };
      
      // Preparar datos del lead
      const leadInfo = {
        foreign_id: `lead_${Date.now()}`,
        inquiry: formatLeadMessage(leadType, fullMessage),
        source: lead.source || 'Web Ofertas Marketing',
        medium: lead.medium || 'https://ofertas.miguelleon.es/',
        campaign: lead.campaign || (leadType === 'appraisal' ? 'car_appraisal' : 'car_interest'),
        car: {
          make: carData.make,
          model: carData.model,
          year: carData.year,
          license_plate: carData.license_plate,
          stock_number: carData.stock_number
        }
      };
      
      // Crear payload según el tipo de lead
      const leadPayload = buildWalcuPayload(leadType, clientData, leadInfo);
      
      console.log(`[WALCU SEND] Enviando como ${leadType} lead (origen: ${lead.source || 'manual'}, hoja: ${lead.sheetName || 'N/A'})`);
      
      console.log(`[WALCU SEND] Payload para Walcu:`, leadPayload);
      
      const walcuResponse = await walcuService.api.post("/leadimporttasks", leadPayload);
      
      console.log(`[WALCU SEND] Lead enviado exitosamente:`, walcuResponse.data._id);
      
      // Actualizar el lead con el ID de Walcu
      await prisma.lead.update({
        where: { id: leadId },
        data: { 
          walcuLeadId: walcuResponse.data._id || undefined,
          walcuStatus: 'sent',
          walcuError: undefined // Limpiar errores previos
        }
      });

      return NextResponse.json({
        success: true,
        message: isReenvio 
          ? 'Lead reenviado exitosamente a Walcu como tasación (reenvío manual)'
          : 'Lead enviado exitosamente a Walcu como tasación',
        data: {
          walcuLeadId: walcuResponse.data._id,
          leadId: leadId,
          isReenvio: isReenvio
        }
      });
    } catch (walcuDirectError) {
      console.error(`[WALCU SEND] Error enviando a Walcu directamente:`, walcuDirectError);
      
      // Actualizar el lead con el error
      await prisma.lead.update({
        where: { id: leadId },
        data: { 
          walcuStatus: 'failed',
          walcuError: walcuDirectError instanceof Error ? walcuDirectError.message : 'Error desconocido'
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: `Error enviando a Walcu: ${walcuDirectError instanceof Error ? walcuDirectError.message : 'Error desconocido'}`
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[WALCU SEND] Error:', error);
    
    // Actualizar el lead con el error
    try {
      const { id: leadId } = await params;
      await prisma.lead.update({
        where: { id: leadId },
        data: { 
          walcuStatus: 'failed',
          walcuError: error instanceof Error ? error.message : 'Error desconocido'
        }
      });
    } catch (updateError) {
      console.error('[WALCU SEND] Error actualizando lead:', updateError);
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

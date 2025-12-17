// Servicio para construir payloads de Walcu según el tipo de lead

export type LeadType = 'sales' | 'appraisal';

export interface WalcuClientData {
  foreign_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface WalcuCarData {
  make: string;
  model: string;
  year: number;
  license_plate?: string;
  stock_number?: string;
}

export interface WalcuLeadData {
  foreign_id: string;
  inquiry: string;
  source?: string;
  medium?: string;
  campaign?: string;
  car?: WalcuCarData;
}

/**
 * Construye el payload para Walcu según el tipo de lead
 * @param leadType - Tipo de lead: 'sales' (ventas) o 'appraisal' (tasaciones)
 * @param client - Datos del cliente
 * @param leadData - Datos del lead
 * @returns Payload formateado para Walcu API
 */
export function buildWalcuPayload(
  leadType: LeadType,
  client: WalcuClientData,
  leadData: WalcuLeadData
) {
  const basePayload = {
    payload: {
      client,
      version: "1.0.0"
    }
  };

  if (leadType === 'sales') {
    // Lead de ventas - cliente interesado en comprar
    return {
      ...basePayload,
      payload: {
        ...basePayload.payload,
        sales_lead: {
          ...leadData,
          source: leadData.source || 'Web Ofertas Marketing',
          medium: leadData.medium || 'https://ofertas.miguelleon.es/',
          campaign: leadData.campaign || 'car_interest'
        }
      }
    };
  } else {
    // Lead de tasación - cliente quiere vender su coche
    return {
      ...basePayload,
      payload: {
        ...basePayload.payload,
        appraisal_lead: {
          ...leadData,
          source: leadData.source || 'Web Ofertas Marketing',
          medium: leadData.medium || 'https://ofertas.miguelleon.es/',
          campaign: leadData.campaign || 'car_appraisal'
        }
      }
    };
  }
}

/**
 * Determina el tipo de lead basado en el origen
 * @param source - Fuente del lead
 * @param sheetName - Nombre de la hoja (si viene de Google Sheets)
 * @returns Tipo de lead correspondiente
 */
export function determineLeadType(source?: string, sheetName?: string): LeadType {
  // Si viene de Google Sheets, es una tasación
  if (sheetName || source === 'google_sheets_auto' || source === 'google_sheets') {
    return 'appraisal';
  }
  
  // Si viene de formularios web u otras fuentes, es una venta
  return 'sales';
}

/**
 * Genera un mensaje apropiado según el tipo de lead
 * @param leadType - Tipo de lead
 * @param originalMessage - Mensaje original del lead
 * @returns Mensaje formateado
 */
export function formatLeadMessage(leadType: LeadType, originalMessage?: string): string {
  const baseMessage = leadType === 'appraisal' 
    ? 'Cliente interesado en vender/tasar su vehículo'
    : 'Cliente interesado en comprar un vehículo';
    
  return originalMessage ? `${originalMessage}` : baseMessage;
}

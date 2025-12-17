import { WalcuClientService } from './walcu-client';
import { WalcuLeadService } from './walcu-lead';
import { 
  WalcuClient, 
  WalcuSaleLead, 
  WalcuAftersaleLead,
  WalcuCar,
  WalcuAddress,
  WalcuBusinessDetails,
  WalcuFinance
} from '@/types/walcu-crm';

export class WalcuService {
  private clientService: WalcuClientService;
  private leadService: WalcuLeadService;

  constructor() {
    this.clientService = new WalcuClientService();
    this.leadService = new WalcuLeadService();
  }

  /**
   * Procesa un formulario de contacto y crea el lead correspondiente
   */
  async processContactForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
    address?: Partial<WalcuAddress>;
    businessDetails?: Partial<WalcuBusinessDetails>;
    source?: string;
    medium?: string;
    campaign?: string;
  }): Promise<{
    client: WalcuClient;
    lead: WalcuSaleLead;
    success: boolean;
    error?: string;
  }> {
    try {
      console.log('Procesando formulario de contacto para Walcu CRM...');

      // 1. Crear o encontrar cliente
      const client = await this.clientService.createOrFindClient({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        businessDetails: data.businessDetails
      });

      // 2. Crear lead de contacto
      const lead = await this.leadService.createContactLead({
        clientId: client._id,
        inquiry: data.message,
        source: data.source || 'website',
        medium: data.medium || 'contact_form',
        campaign: data.campaign || 'general_inquiry'
      });

      console.log('Formulario de contacto procesado exitosamente en Walcu CRM');
      
      return {
        client,
        lead,
        success: true
      };
    } catch (error) {
      console.error('Error procesando formulario de contacto en Walcu CRM:', error);
      
      return {
        client: {} as WalcuClient,
        lead: {} as WalcuSaleLead,
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Procesa un formulario de interés en un vehículo
   */
  async processCarInterestForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
    car: WalcuCar;
    address?: Partial<WalcuAddress>;
    businessDetails?: Partial<WalcuBusinessDetails>;
    source?: string;
    medium?: string;
    campaign?: string;
    finance?: WalcuFinance;
  }): Promise<{
    lead: WalcuAftersaleLead;
    success: boolean;
    error?: string;
  }> {
    console.log('🚗 WalcuService: Iniciando processCarInterestForm...');
    console.log('📋 WalcuService: Datos recibidos:', data);
    
    try {
      console.log('🔄 WalcuService: Procesando formulario de interés en vehículo para Walcu CRM...');

      // Crear lead de interés en vehículo directamente
      console.log('🎯 WalcuService: Creando lead de interés en vehículo...');
      const lead = await this.leadService.createCarInterestLeadMinimal({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        car: data.car,
        source: data.source || 'website',
        medium: data.medium || 'car_page',
        campaign: data.campaign || 'car_interest'
      });
      console.log('✅ WalcuService: Lead creado exitosamente:', lead._id);

      console.log('🎉 WalcuService: Formulario de interés en vehículo procesado exitosamente en Walcu CRM');
      
      return {
        lead,
        success: true
      };
    } catch (error) {
      console.error('💥 WalcuService: Error procesando formulario de interés en vehículo en Walcu CRM:', error);
      console.error('🔍 WalcuService: Tipo de error:', typeof error);
      console.error('📝 WalcuService: Mensaje de error:', error instanceof Error ? error.message : 'Error desconocido');
      console.error('📚 WalcuService: Stack trace:', error instanceof Error ? error.stack : 'No disponible');
      
      return {
        lead: {} as WalcuAftersaleLead,
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Procesa un formulario de tasación de vehículo
   */
  async processAppraisalForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
    car: WalcuCar;
    address?: Partial<WalcuAddress>;
    businessDetails?: Partial<WalcuBusinessDetails>;
    source?: string;
    medium?: string;
    campaign?: string;
  }): Promise<{
    client: WalcuClient;
    lead: WalcuAftersaleLead;
    success: boolean;
    error?: string;
  }> {
    try {
      console.log('Procesando formulario de tasación para Walcu CRM...');

      // 1. Crear o encontrar cliente
      const client = await this.clientService.createOrFindClient({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        businessDetails: data.businessDetails
      });

      // 2. Crear lead de tasación
      const lead = await this.leadService.createAppraisalRequestLead({
        clientId: client._id,
        car: data.car,
        inquiry: data.message,
        source: data.source || 'website',
        medium: data.medium || 'appraisal_form',
        campaign: data.campaign || 'car_appraisal'
      });

      console.log('Formulario de tasación procesado exitosamente en Walcu CRM');
      
      return {
        client,
        lead,
        success: true
      };
    } catch (error) {
      console.error('Error procesando formulario de tasación en Walcu CRM:', error);
      
      return {
        client: {} as WalcuClient,
        lead: {} as WalcuAftersaleLead,
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Verifica la conectividad con Walcu CRM
   */
  async checkConnection(): Promise<{
    connected: boolean;
    error?: string;
  }> {
    try {
      // Intentar hacer una petición simple para verificar la conectividad
      await this.clientService.findClientByEmail('test@example.com');
      
      return {
        connected: true
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Obtiene estadísticas básicas de la integración
   */
  async getIntegrationStats(): Promise<{
    clientsCreated: number;
    leadsCreated: number;
    lastSync: string;
    status: 'healthy' | 'warning' | 'error';
  }> {
    try {
      // Esta es una implementación básica
      // En una implementación real, podrías consultar métricas específicas
      
      return {
        clientsCreated: 0, // TODO: Implementar contador real
        leadsCreated: 0,   // TODO: Implementar contador real
        lastSync: new Date().toISOString(),
        status: 'healthy'
      };
    } catch {
      return {
        clientsCreated: 0,
        leadsCreated: 0,
        lastSync: new Date().toISOString(),
        status: 'error'
      };
    }
  }
}

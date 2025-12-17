import { useState, useCallback } from 'react';
import { 
  WalcuSaleLead, 
  WalcuCar,
  WalcuClient, 
  WalcuAddress,
  WalcuBusinessDetails,
  WalcuAftersaleLead
} from '../types/walcu-crm';

interface WalcuCRMResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface ContactFormData {
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
}



interface AppraisalFormData {
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
}

export const useWalcuCRM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processContactForm = useCallback(async (formData: ContactFormData): Promise<WalcuCRMResponse<{ client: WalcuClient; lead: WalcuSaleLead }>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/walcu/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'contact',
          ...formData
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Error procesando formulario de contacto');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return {
        success: false,
        data: { client: {} as WalcuClient, lead: {} as WalcuSaleLead },
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const processCarInterestForm = useCallback(async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
    car: WalcuCar;
    source?: string;
    medium?: string;
    campaign?: string;
  }): Promise<{
    success: boolean;
    leadId?: string;
    error?: string;
  }> => {
    console.log('🎣 useWalcuCRM: Iniciando processCarInterestForm con endpoint oficial...');
    console.log('📋 Datos recibidos en el hook:', data);
    console.log('🌐 Endpoint que se va a llamar: /api/walcu/leadimport');
    
    setLoading(true);
    setError(null);

    try {
      console.log('📤 useWalcuCRM: Enviando request a /api/walcu/leadimport...');
      
      // Usar el nuevo endpoint oficial de Walcu
      const response = await fetch('/api/walcu/leadimport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('📡 useWalcuCRM: Response status:', response.status);
      console.log('📡 useWalcuCRM: Response headers:', response.headers);

      const result = await response.json();
      console.log('📡 useWalcuCRM: Respuesta del endpoint oficial:', result);

      if (result.success) {
        console.log('✅ useWalcuCRM: Lead creado exitosamente. Lead ID:', result.leadId);
        setError(null);
        return {
          success: true,
          leadId: result.leadId
        };
      } else {
        const errorMessage = result.error || 'Error desconocido al procesar el formulario';
        console.error('❌ useWalcuCRM: Error en la respuesta:', errorMessage);
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      console.error('💥 useWalcuCRM: Error de excepción:', err);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      console.log('🏁 useWalcuCRM: Finalizando processCarInterestForm');
      setLoading(false);
    }
  }, []);

  const processAppraisalForm = useCallback(async (formData: AppraisalFormData): Promise<WalcuCRMResponse<{ client: WalcuClient; lead: WalcuAftersaleLead }>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/walcu/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'appraisal',
          ...formData
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Error procesando formulario de tasación');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return {
        success: false,
        data: { client: {} as WalcuClient, lead: {} as WalcuAftersaleLead },
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkConnection = useCallback(async (): Promise<WalcuCRMResponse<{ connected: boolean; error?: string }>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/walcu/forms?action=connection');
      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Error verificando conexión con Walcu CRM');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return {
        success: false,
        data: { connected: false, error: errorMessage },
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const getStats = useCallback(async (): Promise<WalcuCRMResponse<{ clientsCreated: number; leadsCreated: number; lastSync: string; status: string }>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/walcu/forms?action=stats');
      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Error obteniendo estadísticas de Walcu CRM');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return {
        success: false,
        data: { clientsCreated: 0, leadsCreated: 0, lastSync: '', status: 'error' },
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    processContactForm,
    processCarInterestForm,
    processAppraisalForm,
    checkConnection,
    getStats,
    clearError
  };
};

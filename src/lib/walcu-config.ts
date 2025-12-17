// Configuración pública de Walcu CRM (solo variables no sensibles)
export const WALCU_CONFIG = {
  // Información pública que se puede mostrar en el frontend
  APP_NAME: process.env.NEXT_PUBLIC_WALCU_APP_NAME || 'Walcu CRM',
  
  // URLs públicas (sin credenciales)
  BASE_URL: process.env.NEXT_PUBLIC_WALCU_BASE_URL || 'https://api.crm.walcu.com',
  
  // IDs públicos
  DEALER_ID: process.env.NEXT_PUBLIC_WALCU_DEALER_ID || '',
  
  // Configuración de la aplicación
  TIMEOUT: 10000, // 10 segundos
  MAX_RETRIES: 3,
  
  // Tipos de formularios soportados
  SUPPORTED_FORM_TYPES: [
    'contact',
    'car_interest', 
    'appraisal',
    'aftersale'
  ] as const,
  
  // Orígenes de leads predefinidos
  LEAD_SOURCES: {
    WEBSITE: 'website',
    CONTACT_FORM: 'contact_form',
    CAR_PAGE: 'car_page',
    APPRAISAL_FORM: 'appraisal_form',
    TEST: 'test'
  },
  
  // Medios de captura predefinidos
  LEAD_MEDIUMS: {
    FORM: 'form',
    CONTACT_FORM: 'contact_form',
    CAR_PAGE: 'car_page',
    APPRAISAL_FORM: 'appraisal_form',
    TEST: 'test_component'
  },
  
  // Campañas predefinidas
  LEAD_CAMPAIGNS: {
    GENERAL_INQUIRY: 'general_inquiry',
    CAR_INTEREST: 'car_interest',
    CAR_APPRAISAL: 'car_appraisal',
    INTEGRATION_TEST: 'integration_test'
  },
  
  // Estados de la integración
  INTEGRATION_STATUS: {
    HEALTHY: 'healthy',
    WARNING: 'warning',
    ERROR: 'error',
    DISCONNECTED: 'disconnected'
  } as const,
  
  // Mensajes de error predefinidos
  ERROR_MESSAGES: {
    MISSING_CREDENTIALS: 'Credenciales de Walcu CRM no configuradas',
    CONNECTION_FAILED: 'Error de conexión con Walcu CRM',
    INVALID_FORM_DATA: 'Datos del formulario inválidos',
    CLIENT_CREATION_FAILED: 'Error creando cliente en Walcu CRM',
    LEAD_CREATION_FAILED: 'Error creando lead en Walcu CRM',
    UNKNOWN_ERROR: 'Error desconocido en la integración con Walcu CRM'
  },
  
  // Mensajes de éxito predefinidos
  SUCCESS_MESSAGES: {
    CLIENT_CREATED: 'Cliente creado exitosamente en Walcu CRM',
    CLIENT_FOUND: 'Cliente encontrado en Walcu CRM',
    LEAD_CREATED: 'Lead creado exitosamente en Walcu CRM',
    CONNECTION_SUCCESS: 'Conexión con Walcu CRM establecida correctamente'
  }
};

// Tipos derivados de la configuración
export type WalcuFormType = typeof WALCU_CONFIG.SUPPORTED_FORM_TYPES[number];
export type WalcuIntegrationStatus = typeof WALCU_CONFIG.INTEGRATION_STATUS[keyof typeof WALCU_CONFIG.INTEGRATION_STATUS];

// Función para validar la configuración
export function validateWalcuConfig(): {
  isValid: boolean;
  missingVars: string[];
  warnings: string[];
} {
  const missingVars: string[] = [];
  const warnings: string[] = [];
  
  // Verificar variables críticas del servidor
  if (!process.env.WALCU_BASE_URL) {
    missingVars.push('WALCU_BASE_URL');
  }
  
  if (!process.env.WALCU_DEALER_ID) {
    missingVars.push('WALCU_DEALER_ID');
  }
  
  if (!process.env.WALCU_APP_ID) {
    missingVars.push('WALCU_APP_ID');
  }
  
  if (!process.env.WALCU_SECRET_KEY) {
    missingVars.push('WALCU_SECRET_KEY');
  }
  
  // Verificar variables públicas opcionales
  if (!process.env.NEXT_PUBLIC_WALCU_DEALER_ID) {
    warnings.push('NEXT_PUBLIC_WALCU_DEALER_ID no configurado (solo para display)');
  }
  
  if (!process.env.NEXT_PUBLIC_WALCU_APP_NAME) {
    warnings.push('NEXT_PUBLIC_WALCU_APP_NAME no configurado (usando valor por defecto)');
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
    warnings
  };
}

// Función para obtener información de configuración segura
export function getWalcuConfigInfo(): {
  appName: string;
  baseUrl: string;
  dealerId: string;
  isConfigured: boolean;
  configStatus: 'complete' | 'partial' | 'missing';
} {
  const serverConfig = validateWalcuConfig();
  
  return {
    appName: WALCU_CONFIG.APP_NAME,
    baseUrl: WALCU_CONFIG.BASE_URL,
    dealerId: WALCU_CONFIG.DEALER_ID || 'No configurado',
    isConfigured: serverConfig.isValid,
    configStatus: serverConfig.isValid ? 'complete' : 
                  serverConfig.missingVars.length < 4 ? 'partial' : 'missing'
  };
}

import axios, { AxiosInstance, AxiosError } from 'axios';

export class WalcuCRMService {
  public api: AxiosInstance;
  protected dealerId: string;
  protected baseUrl: string;
  protected appId: string;
  protected secretKey: string;

  constructor() {
    console.log('🔧 WalcuCRMService: Constructor iniciado');
    console.log('📋 WalcuCRMService: Verificando variables de entorno...');
    
    this.dealerId = process.env.WALCU_DEALER_ID!;
    this.baseUrl = process.env.WALCU_BASE_URL!;
    this.appId = process.env.WALCU_APP_ID!;
    this.secretKey = process.env.WALCU_SECRET_KEY!;

    console.log('🔑 WalcuCRMService: Variables de entorno cargadas:', {
      dealerId: this.dealerId ? `${this.dealerId.substring(0, 8)}...` : 'NO DEFINIDA',
      baseUrl: this.baseUrl || 'NO DEFINIDA',
      appId: this.appId ? `${this.appId.substring(0, 8)}...` : 'NO DEFINIDA',
      secretKey: this.secretKey ? `${this.secretKey.substring(0, 8)}...` : 'NO DEFINIDA'
    });

    if (!this.dealerId || !this.baseUrl || !this.appId || !this.secretKey) {
      console.error('❌ WalcuCRMService: Variables de entorno faltantes:', {
        dealerId: !!this.dealerId,
        baseUrl: !!this.baseUrl,
        appId: !!this.appId,
        secretKey: !!this.secretKey
      });
      throw new Error('Missing required Walcu CRM environment variables');
    }

    console.log('✅ WalcuCRMService: Todas las variables de entorno están configuradas');
    
    // Construir la URL base correctamente
    const baseURL = this.baseUrl.includes('/dealers') 
      ? `${this.baseUrl}/${this.dealerId}`
      : `${this.baseUrl}/dealers/${this.dealerId}`;
    
    console.log('🌐 WalcuCRMService: Construcción de URL base:', {
      baseUrl: this.baseUrl,
      dealerId: this.dealerId,
      includesDealers: this.baseUrl.includes('/dealers'),
      finalBaseURL: baseURL
    });
    console.log('🌐 WalcuCRMService: URL base configurada:', baseURL);

    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      auth: {
        username: this.appId,
        password: this.secretKey
      },
      timeout: 10000, // 10 segundos de timeout
    });

    console.log('🔧 WalcuCRMService: Instancia de Axios creada con headers:', {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Basic Auth': `${this.appId.substring(0, 8)}...:${this.secretKey.substring(0, 8)}...`
    });

    // Request interceptor para logging
    this.api.interceptors.request.use(
      (config) => {
        console.log('🌐 WalcuCRMService: Request enviado:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          fullUrl: `${config.baseURL}${config.url}`,
          headers: {
            'Content-Type': config.headers['Content-Type'],
            'Accept': config.headers['Accept'],
            'Basic Auth': config.auth ? `${config.auth.username?.substring(0, 8)}...:${config.auth.password?.substring(0, 8)}...` : 'NO ENVIADO'
          },
          data: config.data,
          timestamp: new Date().toISOString()
        });
        
        // Verificar que los headers de autenticación estén presentes
        if (!config.auth) {
          console.error('🚨 WalcuCRMService: AUTENTICACIÓN BASIC AUTH FALTANTE:', {
            hasAuth: !!config.auth,
            headersCompletos: config.headers
          });
        } else {
          console.log('✅ WalcuCRMService: Autenticación Basic Auth verificada correctamente');
        }
        
        return config;
      },
      (error) => {
        console.error('❌ WalcuCRMService: Error en request interceptor:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor para logging
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ WalcuCRMService: Response recibido:', {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
          method: response.config.method?.toUpperCase(),
          data: response.data,
          timestamp: new Date().toISOString()
        });
        return response;
      },
      (error) => {
        console.error('❌ WalcuCRMService: Error en response interceptor:', error);
        console.error('🔍 WalcuCRMService: Detalles del error:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          timestamp: new Date().toISOString()
        });
        return Promise.reject(error);
      }
    );
  }

  protected handleError(operation: string, error: AxiosError | Error): never {
    console.error('💥 WalcuCRMService: handleError llamado para operación:', operation);
    console.error('🔍 WalcuCRMService: Tipo de error:', typeof error);
    console.error('📝 WalcuCRMService: Mensaje de error:', error.message);
    
    if (error instanceof AxiosError) {
      console.error('🌐 WalcuCRMService: Error de Axios detectado:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        responseData: error.response?.data,
        requestData: error.config?.data,
        headers: error.config?.headers
      });
    } else {
      console.error('⚠️ WalcuCRMService: Error estándar (no Axios):', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    const errorMessage = `Walcu CRM Error - ${operation}: ${error instanceof AxiosError ? error.response?.data?.message || error.message : error.message}`;
    console.error('🚨 WalcuCRMService: Error final formateado:', errorMessage);
    
    console.error('📊 WalcuCRMService: Resumen del error:', {
      operation,
      timestamp: new Date().toISOString(),
      errorType: error instanceof AxiosError ? 'AxiosError' : 'Error',
      hasResponse: error instanceof AxiosError ? !!error.response : false,
      hasRequest: error instanceof AxiosError ? !!error.config : false
    });
    
    throw new Error(errorMessage);
  }
}

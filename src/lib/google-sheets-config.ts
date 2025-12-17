// Configuración centralizada para Google Sheets
export const GOOGLE_SHEETS_CONFIG = {
  // Hoja de cálculo por defecto (configurable via variables de entorno)
  DEFAULT_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_DEFAULT_SPREADSHEET_ID || '',
  DEFAULT_SHEET_NAME: process.env.GOOGLE_SHEETS_DEFAULT_SHEET_NAME || 'Leads',
  DEFAULT_RANGE: process.env.GOOGLE_SHEETS_DEFAULT_RANGE || '', // Si está vacío, lee todo
  
  // Configuración de importación automática
  AUTO_IMPORT_ENABLED: process.env.GOOGLE_SHEETS_AUTO_IMPORT === 'true',
  AUTO_IMPORT_INTERVAL: parseInt(process.env.GOOGLE_SHEETS_AUTO_IMPORT_INTERVAL || '300000'), // 5 minutos por defecto
  
  // Mapeo flexible de columnas - acepta cualquier variación
  COLUMN_MAPPINGS: {
    // ID único de Facebook Lead
    leadId: [
      'id', 'lead_id', 'facebook_lead_id', 'fb_lead_id', 'lead_identifier'
    ],
    // Información personal
    firstName: [
      'nombre', 'first_name', 'firstname', 'first name',
      'cliente', 'contacto', 'persona', 'usuario'
    ],
    lastName: [
      'apellido', 'apellidos', 'last_name', 'lastname', 'last name',
      'surname', 'family_name'
    ],
    fullName: [
      'full_name', 'nombre_completo', 'nombre completo', 'fullname',
      'complete_name', 'nombre_apellido', 'name_full'
    ],
    email: [
      'email', 'correo', 'correo_electronico', 'correo electronico',
      'e-mail', 'mail', 'email_address', 'correo_contacto'
    ],
    phone: [
      'telefono', 'teléfono', 'phone', 'movil', 'móvil', 'celular',
      'tel', 'telephone', 'mobile', 'contacto_telefono', 'numero'
    ],
    message: [
      'mensaje', 'message', 'comentario', 'comentarios', 'observaciones',
      'notas', 'descripcion', 'descripción', 'consulta', 'solicitud'
    ],
    
    // Información del vehículo
    carMake: [
      'marca', 'make', 'car_make', 'fabricante', 'brand',
      'marca_vehiculo', 'marca_coche', 'auto_marca'
    ],
    carModel: [
      'modelo', 'model', 'car_model', 'modelo_vehiculo',
      'modelo_coche', 'auto_modelo', 'version_corta'
    ],
    carYear: [
      'año', 'year', 'car_year', 'anio', 'fecha', 'modelo_año',
      'año_fabricacion', 'year_model'
    ],
    carLicensePlate: [
      'matricula', 'matrícula', 'license_plate', 'numberplate',
      'placa', 'patente', 'registro', 'plate'
    ],
    carStockNumber: [
      'stock', 'stock_number', 'sku', 'codigo', 'código',
      'referencia', 'id_vehiculo', 'numero_stock', 'inventory'
    ],
    
    // Metadatos de marketing
    source: [
      'fuente', 'source', 'origen', 'procedencia', 'canal',
      'medio_origen', 'source_medium', 'traffic_source'
    ],
    platform: [
      'platform', 'plataforma', 'red_social', 'social_network',
      'canal_social', 'medio_social', 'fb', 'ig', 'facebook', 'instagram'
    ],
    medium: [
      'medio', 'medium', 'canal_marketing', 'tipo_trafico',
      'marketing_medium', 'acquisition_medium'
    ],
    campaign: [
      'campaña', 'campaign', 'campana', 'promocion', 'promoción',
      'oferta', 'marketing_campaign', 'utm_campaign'
    ],
    
    // Campos adicionales comunes
    city: [
      'ciudad', 'city', 'localidad', 'municipio', 'poblacion',
      'población', 'location', 'lugar'
    ],
    province: [
      'provincia', 'province', 'estado', 'region', 'región',
      'state', 'area'
    ],
    postalCode: [
      'codigo_postal', 'código_postal', 'postal_code', 'zip',
      'cp', 'zipcode', 'postal'
    ],
    budget: [
      'presupuesto', 'budget', 'precio_maximo', 'precio_max',
      'limite_precio', 'max_price', 'budget_max'
    ],
    financing: [
      'financiacion', 'financiación', 'financing', 'credito',
      'crédito', 'loan', 'payment_method'
    ],
    urgency: [
      'urgencia', 'urgency', 'prioridad', 'priority', 'cuando',
      'timeframe', 'plazo', 'necesidad'
    ],
    leadScore: [
      'puntuacion', 'puntuación', 'score', 'rating', 'calificacion',
      'calificación', 'lead_score', 'quality'
    ],
    
    // Campos de fecha y tiempo
    createdTime: [
      'created_time', 'created_at', 'fecha_creacion', 'fecha_registro',
      'timestamp', 'date_created', 'creation_date', 'date', 'fecha'
    ],
    
    // Campos específicos de Facebook/Instagram Leads
    adId: [
      'ad_id', 'anuncio_id', 'advertisement_id'
    ],
    adName: [
      'ad_name', 'nombre_anuncio', 'advertisement_name'
    ],
    adsetId: [
      'adset_id', 'conjunto_anuncios_id', 'adset'
    ],
    adsetName: [
      'adset_name', 'nombre_conjunto_anuncios', 'adset'
    ],
    campaignId: [
      'campaign_id', 'campana_id', 'id_campana'
    ],
    campaignName: [
      'campaign_name', 'nombre_campana', 'nombre_campaign'
    ],
    formId: [
      'form_id', 'formulario_id', 'id_formulario'
    ],
    formName: [
      'form_name', 'nombre_formulario', 'formulario'
    ],
    isOrganic: [
      'is_organic', 'organico', 'es_organico', 'organic'
    ],
    leadStatus: [
      'lead_status', 'estado_lead', 'status', 'estado'
    ],
    phoneNumber: [
      'phone_number', 'numero_telefono', 'telefono', 'phone', 'movil', 'móvil'
    ],
    makeModel: [
      'marca_y_modelo', 'make_model', 'marca_modelo', 'vehiculo'
    ]
  }
};

// Función para encontrar el nombre de columna correcto
export function findColumnMapping(headers: string[], fieldMappings: string[]): string | null {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  
  for (const mapping of fieldMappings) {
    const normalizedMapping = mapping.toLowerCase().trim();
    const index = normalizedHeaders.findIndex(h => 
      h === normalizedMapping || 
      h.includes(normalizedMapping) || 
      normalizedMapping.includes(h)
    );
    
    if (index !== -1) {
      return headers[index]; // Devolver el header original
    }
  }
  
  return null;
}

// Función para mapear automáticamente todas las columnas
export function autoMapColumns(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  
  Object.entries(GOOGLE_SHEETS_CONFIG.COLUMN_MAPPINGS).forEach(([field, mappings]) => {
    const foundColumn = findColumnMapping(headers, mappings);
    if (foundColumn) {
      mapping[field] = foundColumn;
    }
  });
  
  return mapping;
}

// Función para obtener columnas no mapeadas (campos adicionales)
export function getUnmappedColumns(headers: string[], mappedColumns: Record<string, string>): string[] {
  const mappedHeaders = Object.values(mappedColumns);
  return headers.filter(header => !mappedHeaders.includes(header));
}



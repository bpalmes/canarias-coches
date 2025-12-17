# Módulo de Gestión de Leads

Este módulo permite gestionar leads de manera integral, incluyendo la importación automática desde Google Sheets, visualización, edición y seguimiento del estado de envío a Walcu CRM.

## 🚀 Características Principales

### 1. **Importación desde Google Sheets**
- Conexión segura mediante cuenta de servicio de Google
- Mapeo automático de columnas comunes
- Vista previa antes de importar
- Validación de datos en tiempo real
- Manejo de errores detallado
- Actualización de leads existentes

### 2. **Gestión Completa de Leads**
- Vista de tabla con paginación
- Búsqueda en tiempo real
- Filtros por estado de Walcu
- Estadísticas en tiempo real
- Vista de detalles completa
- Edición inline de leads

### 3. **Integración con Walcu CRM**
- Seguimiento del estado de envío
- Manejo de errores de sincronización
- Reintento manual de envíos
- Historial de estados

### 4. **Interfaz Moderna**
- Diseño responsive
- Animaciones fluidas con Framer Motion
- Modales interactivos
- Feedback visual inmediato
- Tema consistente con el sistema

## 📁 Estructura de Archivos

```
src/
├── app/
│   ├── admin/
│   │   └── leads/
│   │       └── page.tsx                    # Página principal de gestión
│   └── api/
│       └── admin/
│           └── leads/
│               ├── route.ts                # API principal de leads
│               ├── [id]/
│               │   └── route.ts           # API individual de leads
│               └── import-sheets/
│                   └── route.ts           # API de importación de Sheets
├── components/
│   └── admin/
│       ├── GoogleSheetsImporter.tsx       # Modal de importación
│       └── LeadDetailsModal.tsx           # Modal de detalles/edición
└── prisma/
    └── schema.prisma                      # Modelo de datos Lead
```

## 🔧 Configuración Inicial

### 1. Variables de Entorno
Configura las siguientes variables en tu archivo `.env.local`:

```bash
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL="tu-cuenta@proyecto.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu clave privada aquí\n-----END PRIVATE KEY-----\n"
```

### 2. Base de Datos
El modelo `Lead` ya está definido en Prisma. Si necesitas ejecutar migraciones:

```bash
npx prisma db push
```

### 3. Permisos de Google Sheets
- Comparte tu hoja de cálculo con la cuenta de servicio
- Asigna permisos de "Lector" únicamente
- Verifica que la API de Google Sheets esté habilitada

## 📊 Modelo de Datos

### Lead
```typescript
interface Lead {
  id: string;                    // ID único del lead
  firstName: string;             // Nombre (requerido)
  lastName: string;              // Apellido (requerido)
  email: string;                 // Email (requerido, único)
  phone?: string;                // Teléfono (opcional)
  message?: string;              // Mensaje del lead (opcional)
  
  // Información del vehículo
  carId?: number;                // ID del coche en BD (opcional)
  carMake?: string;              // Marca del coche
  carModel?: string;             // Modelo del coche
  carYear?: number;              // Año del coche
  carLicensePlate?: string;      // Matrícula
  carStockNumber?: string;       // Número de stock/SKU
  
  // Metadatos de tracking
  source?: string;               // Fuente del lead
  medium?: string;               // Medio de adquisición
  campaign?: string;             // Campaña asociada
  
  // Estado de Walcu CRM
  walcuLeadId?: string;          // ID en Walcu CRM
  walcuStatus: string;           // 'pending' | 'sent' | 'failed'
  walcuError?: string;           // Mensaje de error si falló
  
  // Timestamps
  createdAt: DateTime;           // Fecha de creación
  updatedAt: DateTime;           // Última actualización
}
```

## 🔄 Flujo de Importación

### 1. Configuración
- Usuario hace clic en "Importar desde Sheets"
- Ingresa URL o ID de la hoja de cálculo
- Especifica hoja y rango (opcional)

### 2. Vista Previa
- Sistema se conecta a Google Sheets API
- Obtiene headers y muestra de datos
- Valida estructura y permisos

### 3. Importación
- Mapea columnas automáticamente
- Valida datos fila por fila
- Crea nuevos leads o actualiza existentes
- Reporta errores y estadísticas

### 4. Resultado
- Muestra resumen de importación
- Lista errores encontrados
- Actualiza vista principal automáticamente

## 📋 Mapeo de Columnas

El sistema reconoce automáticamente estas columnas:

| Campo del Lead | Columnas Reconocidas |
|----------------|---------------------|
| firstName | nombre, first_name, firstname |
| lastName | apellido, apellidos, last_name, lastname |
| email | email, correo, correo_electronico |
| phone | telefono, teléfono, phone, movil, móvil |
| message | mensaje, message, comentario, comentarios |
| carMake | marca, make, car_make |
| carModel | modelo, model, car_model |
| carYear | año, year, car_year |
| carLicensePlate | matricula, matrícula, license_plate, numberplate |
| carStockNumber | stock, stock_number, sku |
| source | fuente, source |
| medium | medio, medium |
| campaign | campaña, campaign |

## 🎯 Funcionalidades de la Interfaz

### Página Principal
- **Estadísticas**: Contadores en tiempo real por estado
- **Filtros**: Por estado de Walcu, búsqueda de texto
- **Tabla**: Vista paginada con información clave
- **Acciones**: Importar, actualizar, cambiar estados

### Modal de Importación
- **Paso 1**: Configuración de conexión
- **Paso 2**: Vista previa de datos
- **Paso 3**: Proceso de importación
- **Paso 4**: Resultados y errores

### Modal de Detalles
- **Vista**: Información completa del lead
- **Edición**: Modificación inline de campos
- **Acciones**: Eliminar, cambiar estados
- **Historial**: Fechas de creación y actualización

## 🔒 Seguridad

### Autenticación
- Usa cuenta de servicio de Google (no OAuth)
- Credenciales almacenadas en variables de entorno
- Sin exposición de claves al frontend

### Permisos
- Cuenta de servicio solo con permisos de lectura
- Hojas de cálculo privadas (no públicas)
- Validación de datos en servidor

### Validaciones
- Email obligatorio y formato válido
- Sanitización de datos de entrada
- Manejo seguro de errores

## 🚨 Solución de Problemas

### Error: "Sin permisos para acceder a la hoja"
- Verifica que la hoja esté compartida con la cuenta de servicio
- Confirma que el email de la cuenta sea correcto
- Asegúrate de que la hoja no esté eliminada

### Error: "Hoja de cálculo no encontrada"
- Verifica el ID de la hoja de cálculo
- Confirma que la URL sea correcta
- Asegúrate de que tengas acceso a la hoja

### Error: "Email inválido"
- Revisa el formato de los emails en la hoja
- Elimina espacios en blanco extra
- Verifica que la columna de email esté presente

### Importación lenta
- Las hojas muy grandes (>5000 filas) tardan más
- La API de Google tiene límites de velocidad
- Considera dividir importaciones grandes

## 📈 Métricas y Monitoreo

### Estadísticas Disponibles
- Total de leads
- Leads por estado de Walcu
- Leads creados vs actualizados en importación
- Errores de importación

### Logs
- Errores de API se registran en consola
- Detalles de importación en desarrollo
- Estados de Walcu trackados

## 🔄 Mantenimiento

### Actualizaciones Regulares
- Revisar logs de errores de Walcu
- Monitorear límites de API de Google
- Limpiar leads antiguos si es necesario

### Backup
- Los leads están en la base de datos principal
- Considera exportar datos periódicamente
- Mantén respaldos de las hojas de Google Sheets

## 🎨 Personalización

### Colores del Tema
El módulo usa el sistema de colores azul [[memory:4939321]] definido en el proyecto:
- Primario: Azul (blue-600, blue-700)
- Estados: Verde (enviado), Amarillo (pendiente), Rojo (error)
- Interfaz: Grises para elementos neutros

### Extensiones Futuras
- Exportación de leads a CSV/Excel
- Filtros avanzados por fecha
- Integración con otros CRMs
- Notificaciones automáticas
- Dashboard de analytics

## 📞 Soporte

Para problemas técnicos:
1. Revisa los logs de la consola del navegador
2. Verifica las variables de entorno
3. Confirma los permisos de Google Sheets
4. Consulta la documentación de la API de Google Sheets





# 🎯 Sistema de Gestión de Leads - Admin

## 📋 **Descripción General**

Sistema completo para gestionar y visualizar todos los leads recibidos a través de los formularios del sitio web, con seguimiento del estado de envío a Walcu CRM.

## 🏗️ **Arquitectura del Sistema**

### **Base de Datos**
- **Modelo `Lead`**: Almacena toda la información de los leads
- **Relación con `Car`**: Vincula leads con vehículos específicos
- **Estados de Walcu**: `pending`, `sent`, `failed`

### **API Routes**
- **`/api/admin/leads`**: CRUD completo de leads
- **`/api/admin/leads/[id]`**: Operaciones individuales por lead

### **Frontend Admin**
- **Página de gestión**: `/admin/leads`
- **Integración con formularios**: Guarda leads automáticamente

## 🗄️ **Estructura de la Base de Datos**

```sql
model Lead {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  email       String
  phone       String?
  message     String?
  
  // Información del coche
  carId       Int?     // Relacionado con Car.id
  carMake     String?
  carModel    String?
  carYear     Int?
  carLicensePlate String?
  carStockNumber  String?
  
  // Metadatos del lead
  source      String?  // website, phone, etc.
  medium      String?  // car_page, contact_form, etc.
  campaign    String?  // car_interest, general_contact, etc.
  
  // Estado de envío a Walcu
  walcuLeadId String?  // ID del lead en Walcu CRM
  walcuStatus String   @default("pending") // pending, sent, failed
  walcuError  String?  // Mensaje de error si falló
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relaciones
  car         Car?     @relation(fields: [carId], references: [id])
  
  @@index([email])
  @@index([walcuStatus])
  @@index([createdAt])
}
```

## 🚀 **Funcionalidades del Admin**

### **1. Dashboard de Estadísticas**
- **Pendientes**: Leads que aún no se han enviado a Walcu
- **Enviados**: Leads exitosamente enviados a Walcu
- **Fallidos**: Leads que fallaron al enviarse a Walcu
- **Total**: Número total de leads

### **2. Gestión de Leads**
- **Vista de tabla**: Información completa de cada lead
- **Filtros**: Por estado, búsqueda por texto
- **Paginación**: 20 leads por página
- **Acciones**: Marcar como enviado/fallido, eliminar

### **3. Información Detallada**
- **Cliente**: Nombre, email, teléfono
- **Vehículo**: Marca, modelo, año, matrícula, imagen
- **Mensaje**: Texto del lead
- **Estado Walcu**: Estado actual y errores
- **Fecha**: Cuándo se creó el lead

## 🔄 **Flujo de Integración**

### **Formulario de Interés en Coche**
```
1. Usuario llena formulario
2. Se guarda lead en BD local (pending)
3. Se envía a Walcu CRM
4. Se actualiza estado local:
   - ✅ Éxito → "sent" + walcuLeadId
   - ❌ Error → "failed" + walcuError
```

### **Formulario de Contacto General**
```
1. Usuario llena formulario
2. Se guarda lead en BD local (pending)
3. Se envía a Walcu CRM
4. Se actualiza estado local según respuesta
```

## 📱 **Interfaz de Usuario**

### **Características del Admin**
- **Responsive**: Funciona en móvil y desktop
- **Animaciones**: Transiciones suaves con Framer Motion
- **Iconos**: Lucide React para mejor UX
- **Colores**: Sistema de colores consistente

### **Componentes Principales**
- **Estadísticas**: Cards con contadores
- **Filtros**: Búsqueda y filtros de estado
- **Tabla**: Vista detallada de leads
- **Paginación**: Navegación entre páginas
- **Acciones**: Botones para gestionar leads

## 🛠️ **API Endpoints**

### **GET `/api/admin/leads`**
```typescript
// Parámetros de consulta
{
  page?: number,      // Página (default: 1)
  limit?: number,     // Límite por página (default: 20)
  status?: string,    // Filtro por estado
  search?: string     // Búsqueda por texto
}

// Respuesta
{
  success: boolean,
  data: {
    leads: Lead[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      pages: number
    },
    statusSummary: Record<string, number>
  }
}
```

### **POST `/api/admin/leads`**
```typescript
// Body
{
  firstName: string,
  lastName: string,
  email: string,
  phone?: string,
  message?: string,
  carId?: number,
  carMake?: string,
  carModel?: string,
  carYear?: number,
  carLicensePlate?: string,
  carStockNumber?: string,
  source?: string,
  medium?: string,
  campaign?: string
}
```

### **PUT `/api/admin/leads/[id]`**
```typescript
// Body
{
  walcuStatus?: 'pending' | 'sent' | 'failed',
  walcuLeadId?: string,
  walcuError?: string
}
```

### **DELETE `/api/admin/leads/[id]`**
```typescript
// Elimina el lead permanentemente
```

## 🔧 **Configuración y Uso**

### **1. Acceso al Admin**
- Navegar a `/admin/leads`
- Requiere autenticación de admin

### **2. Gestión de Leads**
- **Ver todos**: Lista paginada de leads
- **Filtrar**: Por estado o búsqueda de texto
- **Actualizar estado**: Marcar como enviado/fallido
- **Eliminar**: Eliminar leads innecesarios

### **3. Monitoreo**
- **Estadísticas en tiempo real**: Contadores actualizados
- **Seguimiento de errores**: Ver qué leads fallaron
- **Historial completo**: Todos los leads desde el inicio

## 📊 **Estados de Walcu CRM**

### **pending**
- Lead creado localmente
- Aún no enviado a Walcu
- Estado inicial por defecto

### **sent**
- Lead enviado exitosamente a Walcu
- Incluye `walcuLeadId` de Walcu
- Lead procesado correctamente

### **failed**
- Error al enviar a Walcu
- Incluye `walcuError` con detalles
- Requiere revisión manual

## 🚨 **Manejo de Errores**

### **Errores de Base de Datos**
- Validación de campos requeridos
- Relaciones con vehículos
- Índices para rendimiento

### **Errores de API**
- Respuestas HTTP apropiadas
- Mensajes de error descriptivos
- Logging para debugging

### **Errores de Frontend**
- Estados de carga y error
- Mensajes de usuario amigables
- Recuperación automática

## 🔍 **Debugging y Logging**

### **Logs del Frontend**
```typescript
console.log('💾 Guardando lead en base de datos local...');
console.log('✅ Lead guardado localmente:', localLead.data.id);
console.log('✅ Estado del lead actualizado a "sent"');
```

### **Logs del Backend**
```typescript
console.log('🚀 API Route: POST /api/admin/leads iniciado');
console.log('📥 Body completo recibido:', JSON.stringify(body, null, 2));
console.log('✅ Lead creado exitosamente');
```

## 📈 **Métricas y KPIs**

### **Indicadores de Rendimiento**
- **Tasa de éxito**: Leads enviados / Total
- **Tiempo de procesamiento**: Desde creación hasta envío
- **Errores por tipo**: Análisis de fallos

### **Reportes Disponibles**
- **Diarios**: Leads por día
- **Por fuente**: Website, teléfono, etc.
- **Por vehículo**: Leads por coche específico

## 🔮 **Futuras Mejoras**

### **Funcionalidades Planificadas**
- **Exportación**: CSV, Excel de leads
- **Notificaciones**: Email/SMS para nuevos leads
- **Integración**: Con otros CRMs
- **Analytics**: Métricas avanzadas

### **Optimizaciones Técnicas**
- **Caché**: Redis para consultas frecuentes
- **Webhooks**: Notificaciones en tiempo real
- **API Rate Limiting**: Protección contra spam
- **Backup automático**: Respaldo de leads

## 📚 **Recursos Adicionales**

### **Documentación Relacionada**
- [WALCU_INTEGRATION_README.md](./WALCU_INTEGRATION_README.md)
- [WALCU_ENV_EXAMPLE.md](./WALCU_ENV_EXAMPLE.md)
- [DEBUGGING_LOGS.md](./DEBUGGING_LOGS.md)

### **Archivos del Sistema**
- **Schema**: `prisma/schema.prisma`
- **API Routes**: `src/app/api/admin/leads/`
- **Admin Page**: `src/app/admin/leads/page.tsx`
- **Sidebar**: `src/components/admin/Sidebar.tsx`

---

## 🎉 **¡Sistema Listo!**

El sistema de gestión de leads está completamente implementado y funcional. Ahora puedes:

1. **Ver todos los leads** en `/admin/leads`
2. **Monitorear el estado** de envío a Walcu CRM
3. **Gestionar leads** manualmente si es necesario
4. **Tener un historial completo** de todos los contactos

¡Los formularios ahora guardan automáticamente los leads y actualizan su estado según la respuesta de Walcu CRM!

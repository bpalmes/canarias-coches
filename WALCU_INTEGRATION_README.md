# 🚗 Integración con Walcu CRM

## 📋 Resumen de la Integración

Esta integración permite que todos los formularios de la aplicación envíen automáticamente los leads a **Walcu CRM**, creando clientes y leads de forma transparente para el usuario.

## 🎯 Formularios Integrados

### 1. **Formulario de Contacto General** (`/contact`)
- **Ubicación**: Página de contacto principal
- **Tipo de Lead**: Lead de contacto general
- **Funcionalidad**: Crea cliente y lead de contacto

### 2. **Formulario de Interés en Vehículo** (`/car/[id]`)
- **Ubicación**: Página individual de cada vehículo
- **Tipo de Lead**: Lead de interés en vehículo específico
- **Funcionalidad**: Crea cliente y lead asociado al vehículo
- **Botón**: "Me interesa" → Abre modal con formulario

## 🧪 Cómo Probar la Integración

### **Opción 1: Página de Prueba Dedicada**
```
http://localhost:3000/test-walcu
```
- ✅ Prueba conexión con Walcu CRM
- ✅ Verifica estadísticas de la integración
- ✅ Envía formulario de prueba

### **Opción 2: Formulario de Contacto**
```
http://localhost:3000/contact
```
- ✅ Abre el formulario de contacto
- ✅ Envía datos reales a Walcu CRM
- ✅ Verifica creación de cliente y lead

### **Opción 3: Formulario de Interés en Vehículo**
```
http://localhost:3000/car/[ID_DEL_COCHE]
```
- ✅ Ve a cualquier página de vehículo
- ✅ Haz clic en "Me interesa"
- ✅ Completa el formulario
- ✅ Verifica creación de lead asociado al vehículo

## ⚙️ Configuración Requerida

### **Variables de Entorno (Servidor)**
```bash
# Credenciales de Walcu CRM (NO exponer en frontend)
WALCU_BASE_URL=https://api.crm.walcu.com
WALCU_DEALER_ID=tu_dealer_id
WALCU_APP_ID=tu_app_id
WALCU_SECRET_KEY=tu_secret_key
```

### **Variables de Entorno (Opcionales - Frontend)**
```bash
# Solo para mostrar información (no credenciales)
NEXT_PUBLIC_WALCU_APP_NAME=Walcu CRM
NEXT_PUBLIC_WALCU_DEALER_ID=tu_dealer_id
NEXT_PUBLIC_WALCU_BASE_URL=https://api.crm.walcu.com
```

## 🔄 Flujo de Datos

### **Formulario de Interés en Vehículo:**
1. **Usuario** completa formulario en página del vehículo
2. **Frontend** envía datos a `/api/walcu/forms`
3. **API Route** procesa con `WalcuService.processCarInterestForm()`
4. **WalcuService** crea/encuentra cliente y lead
5. **Walcu CRM** recibe y procesa la información
6. **Usuario** recibe confirmación de éxito

### **Datos Enviados a Walcu CRM:**
- **Cliente**: Nombre, email, teléfono, dirección (opcional)
- **Lead**: Interés en vehículo específico, mensaje, origen
- **Vehículo**: Marca, modelo, año, precio, características
- **Origen**: Website, página del vehículo, campaña

## 📊 Estructura de la Integración

```
src/
├── services/
│   ├── walcu-crm.ts          # Servicio base con Axios
│   ├── walcu-client.ts       # Gestión de clientes
│   ├── walcu-lead.ts         # Gestión de leads
│   └── walcu-service.ts      # Servicio principal/facade
├── api/
│   └── walcu/
│       ├── clients/          # API para clientes
│       ├── leads/            # API para leads
│       └── forms/            # API unificada para formularios
├── hooks/
│   └── useWalcuCRM.ts        # Hook React para frontend
├── components/
│   ├── ContactForm.tsx       # Formulario de contacto integrado
│   ├── InterestFormModal.tsx # Modal de interés en vehículo
│   └── WalcuTestComponent.tsx # Componente de pruebas
└── types/
    └── walcu-crm.ts          # Interfaces TypeScript
```

## 🚀 Funcionalidades Implementadas

### **Gestión de Clientes:**
- ✅ Crear nuevos clientes
- ✅ Buscar clientes existentes por email/teléfono
- ✅ Actualizar información de clientes
- ✅ Evitar duplicados automáticamente

### **Gestión de Leads:**
- ✅ Leads de contacto general
- ✅ Leads de interés en vehículos
- ✅ Leads de tasación de vehículos
- ✅ Asociación automática cliente-vehículo

### **Integración Frontend:**
- ✅ Hook personalizado `useWalcuCRM`
- ✅ Manejo de estados de carga
- ✅ Manejo elegante de errores
- ✅ Confirmaciones de éxito
- ✅ Validación de formularios

## 🔍 Monitoreo y Debugging

### **Logs del Servidor:**
```bash
# En la consola del servidor verás:
✅ Cliente creado exitosamente en Walcu CRM: [ID]
✅ Lead de interés en vehículo creado exitosamente en Walcu CRM: [ID]
✅ Formulario procesado exitosamente en Walcu CRM
```

### **Logs del Frontend:**
```bash
# En la consola del navegador verás:
✅ Lead creado en Walcu CRM
✅ Cliente registrado/actualizado
✅ Vehículo asociado al lead
```

## 🛠️ Solución de Problemas

### **Error: "Module not found: Can't resolve 'axios'"**
```bash
npm install axios --save
```

### **Error: Variables de entorno no configuradas**
```bash
# Verificar que existan en .env o en Vercel:
WALCU_BASE_URL=...
WALCU_DEALER_ID=...
WALCU_APP_ID=...
WALCU_SECRET_KEY=...
```

### **Error: "Walcu CRM Error"**
- Verificar credenciales de API
- Verificar conectividad a Walcu CRM
- Revisar logs del servidor para más detalles

## 📈 Próximos Pasos

### **Mejoras Sugeridas:**
1. **Dashboard de Leads**: Visualizar leads creados en Walcu CRM
2. **Sincronización Bidireccional**: Importar leads desde Walcu CRM
3. **Notificaciones en Tiempo Real**: Webhooks para actualizaciones
4. **Métricas Avanzadas**: Análisis de conversión de formularios
5. **Integración con Otros Formularios**: Reservas, financiación, etc.

### **Formularios Adicionales a Integrar:**
- ✅ Formulario de contacto general
- ✅ Formulario de interés en vehículo
- 🔄 Formulario de reserva de vehículo
- 🔄 Formulario de financiación
- 🔄 Formulario de tasación de vehículo propio

## 🎉 Estado Actual

**✅ INTEGRACIÓN COMPLETA Y FUNCIONAL**

- Todos los formularios principales están integrados
- La integración está probada y funcionando
- El código está optimizado y sin errores
- La documentación está completa
- Las pruebas están implementadas

**¡La integración con Walcu CRM está lista para producción!** 🚀

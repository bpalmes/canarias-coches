# 🔍 Guía de Debugging con Logs - Integración Walcu CRM

## 📋 Resumen

He agregado logs detallados en **todos los niveles** de la integración para que puedas ver exactamente qué está pasando en cada paso del proceso. Esto te permitirá identificar rápidamente dónde falla algo si hay problemas.

## 🎯 Niveles de Logging Implementados

### **1. Frontend (Componente del Formulario)**
- **Archivo**: `src/components/InterestFormModal.tsx`
- **Logs**: Datos del formulario, conversión del vehículo, llamadas al hook
- **Ubicación**: Consola del navegador

### **2. Hook React (useWalcuCRM)**
- **Archivo**: `src/hooks/useWalcuCRM.ts`
- **Logs**: Preparación de datos, llamadas a la API, respuestas
- **Ubicación**: Consola del navegador

### **3. API Route (Backend)**
- **Archivo**: `src/app/api/walcu/forms/route.ts`
- **Logs**: Recepción de requests, procesamiento, resultados
- **Ubicación**: Consola del servidor (terminal)

### **4. Servicio Principal (WalcuService)**
- **Archivo**: `src/services/walcu-service.ts`
- **Logs**: Flujo de procesamiento, creación de cliente y lead
- **Ubicación**: Consola del servidor (terminal)

### **5. Servicio Base (WalcuCRMService)**
- **Archivo**: `src/services/walcu-crm.ts`
- **Logs**: Requests HTTP, responses, errores de Axios
- **Ubicación**: Consola del servidor (terminal)

## 🚀 Cómo Usar los Logs para Debugging

### **Paso 1: Abrir las Consolas**

#### **Frontend (Navegador):**
1. Abre la página del vehículo (`/car/[id]`)
2. Haz clic en "Me interesa"
3. Abre las **DevTools** (F12)
4. Ve a la pestaña **Console**
5. Completa y envía el formulario

#### **Backend (Terminal):**
1. Ejecuta `npm run dev` en tu terminal
2. Los logs aparecerán en la consola del servidor

### **Paso 2: Identificar el Flujo de Logs**

Cuando envíes el formulario, verás esta secuencia de logs:

```
🚀 Iniciando envío del formulario de interés en vehículo...
📋 Datos del formulario: {firstName: "...", lastName: "...", ...}
🚗 Información del vehículo: {id: 1, make: "BMW", ...}

🎣 useWalcuCRM: Iniciando processCarInterestForm...
📋 Datos recibidos en el hook: {...}
🌐 useWalcuCRM: Preparando request a /api/walcu/forms...
📤 useWalcuCRM: Request body preparado: {...}
🔗 useWalcuCRM: URL de destino: /api/walcu/forms

🚀 API Route: POST /api/walcu/forms iniciado
📋 API Route: Request body recibido: {...}
🏷️ API Route: Tipo de formulario: car_interest
📊 API Route: Datos del formulario: {...}

🚗 WalcuService: Iniciando processCarInterestForm...
📋 WalcuService: Datos recibidos: {...}
👤 WalcuService: Paso 1 - Creando/buscando cliente...

🌐 WalcuCRMService: Request enviado: {method: "POST", url: "/clients", ...}
✅ WalcuCRMService: Response recibido: {status: 200, ...}

✅ WalcuService: Cliente procesado exitosamente: 12345
🎯 WalcuService: Paso 2 - Creando lead de interés en vehículo...

🌐 WalcuCRMService: Request enviado: {method: "POST", url: "/saleleads", ...}
✅ WalcuCRMService: Response recibido: {status: 200, ...}

✅ WalcuService: Lead creado exitosamente: 67890
🎉 WalcuService: Formulario procesado exitosamente en Walcu CRM

📥 API Route: Resultado del procesamiento: {...}
✅ API Route: Formulario procesado exitosamente

📥 useWalcuCRM: Response recibida: {...}
📊 useWalcuCRM: Status: 200
📄 useWalcuCRM: Response body parseado: {...}
✅ useWalcuCRM: Respuesta exitosa de la API

📥 Respuesta recibida de Walcu CRM: {...}
✅ Formulario procesado exitosamente en Walcu CRM
👤 Cliente creado/actualizado: {...}
🎯 Lead creado: {...}
```

## 🔍 Cómo Identificar Problemas

### **Problema 1: Error en el Frontend**
```
❌ Error en la respuesta de Walcu CRM: [mensaje de error]
📊 Datos de error completos: {...}
```

**Solución**: Revisar los logs del backend para ver qué falló

### **Problema 2: Error en la API Route**
```
❌ API Route: Error en el procesamiento del formulario: [mensaje]
```

**Solución**: Revisar los logs del WalcuService para ver el error específico

### **Problema 3: Error en Walcu CRM**
```
💥 WalcuCRMService: handleError llamado para operación: createClient
🌐 WalcuCRMService: Error de Axios detectado: {status: 401, ...}
```

**Solución**: Verificar credenciales, URL base, o conectividad

### **Problema 4: Error de Red**
```
💥 useWalcuCRM: Error durante la llamada a la API: [error]
```

**Solución**: Verificar que el servidor esté corriendo y la ruta sea correcta

## 🛠️ Comandos Útiles para Debugging

### **Ver Logs del Servidor en Tiempo Real:**
```bash
# Terminal 1: Ejecutar servidor
npm run dev

# Terminal 2: Ver logs en tiempo real (Windows)
Get-Content -Path "npm-debug.log" -Wait -Tail 100

# Terminal 2: Ver logs en tiempo real (Linux/Mac)
tail -f npm-debug.log
```

### **Filtrar Logs por Palabra Clave:**
```bash
# En la consola del navegador, usa el filtro:
WalcuCRMService

# En la consola del servidor, busca por:
API Route
```

### **Limpiar Consola del Navegador:**
```javascript
// En la consola del navegador
console.clear()
```

## 📊 Ejemplos de Logs de Error

### **Error de Credenciales:**
```
💥 WalcuCRMService: handleError llamado para operación: createClient
🌐 WalcuCRMService: Error de Axios detectado: {
  status: 401,
  statusText: "Unauthorized",
  responseData: {message: "Invalid API key"}
}
🚨 WalcuCRMService: Error final formateado: Walcu CRM Error - createClient: Invalid API key
```

### **Error de Conectividad:**
```
💥 useWalcuCRM: Error durante la llamada a la API: TypeError: Failed to fetch
🔍 useWalcuCRM: Tipo de error: object
📝 useWalcuCRM: Mensaje de error: Failed to fetch
```

### **Error de Validación:**
```
❌ API Route: Error en el procesamiento del formulario: El cliente debe tener al menos un contacto
📊 API Route: Resultado del procesamiento: {success: false, error: "..."}
```

## 🎯 Consejos para Debugging Efectivo

### **1. Sigue el Flujo de Logs**
- Los logs están numerados y emojis para facilitar el seguimiento
- Cada nivel agrega información específica
- Los errores se propagan hacia arriba con contexto

### **2. Usa Filtros en la Consola**
- Filtra por emojis específicos (🚀, ❌, ✅)
- Filtra por nivel de servicio (WalcuService, API Route, etc.)
- Busca por palabras clave específicas

### **3. Compara con el Flujo Normal**
- Si falta algún log, sabrás exactamente dónde se detuvo
- Los logs de éxito te muestran cómo debe verse todo
- Los logs de error te dan contexto completo del problema

### **4. Verifica Variables de Entorno**
- Los logs muestran si las credenciales están configuradas
- Verifica que `WALCU_BASE_URL` sea accesible
- Confirma que `WALCU_SECRET_KEY` sea válida

## 🚨 Logs de Emergencia

Si algo falla completamente, busca estos logs críticos:

```
💥 [NIVEL]: Error inesperado durante el proceso
🔍 [NIVEL]: Tipo de error: [tipo]
📝 [NIVEL]: Mensaje de error: [mensaje]
📚 [NIVEL]: Stack trace: [stack]
```

Estos logs te darán información completa sobre cualquier error no manejado.

---

**¡Con estos logs, podrás debuggear cualquier problema en la integración de Walcu CRM en minutos!** 🚀

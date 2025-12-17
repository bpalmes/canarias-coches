# 🔑 Variables de Entorno Requeridas - Walcu CRM

## ⚠️ **IMPORTANTE: Variables CRÍTICAS del Servidor**

Estas variables **DEBEN** estar configuradas en tu servidor (Vercel, etc.) y **NUNCA** en el frontend por seguridad:

```bash
# URL base de la API de Walcu CRM
WALCU_BASE_URL=https://api.crm.walcu.com

# ID del concesionario en Walcu CRM
WALCU_DEALER_ID=tu_dealer_id_aqui

# ID de la aplicación en Walcu CRM
WALCU_APP_ID=tu_app_id_aqui

# Clave secreta para autenticación
WALCU_SECRET_KEY=tu_secret_key_aqui
```

## 🔍 **Variables Opcionales (Frontend)**

Estas variables se pueden exponer en el frontend solo para mostrar información:

```bash
# Nombre de la aplicación para mostrar
NEXT_PUBLIC_WALCU_APP_NAME=Walcu CRM

# ID del concesionario para mostrar (sin credenciales)
NEXT_PUBLIC_WALCU_DEALER_ID=tu_dealer_id_aqui

# URL base para mostrar (sin credenciales)
NEXT_PUBLIC_WALCU_BASE_URL=https://api.crm.walcu.com
```

## 🚨 **Problema Actual Identificado**

Según los logs, el error es:
```
Walcu CRM Response Error: 401 { error: 'No login in the headers' }
```

**Esto significa que las variables de entorno no están configuradas o no se están cargando correctamente.**

## 🛠️ **Cómo Configurar en Vercel:**

1. **Ve a tu proyecto en Vercel**
2. **Settings → Environment Variables**
3. **Agrega estas variables:**
   - `WALCU_BASE_URL`
   - `WALCU_DEALER_ID`
   - `WALCU_APP_ID`
   - `WALCU_SECRET_KEY`
4. **Redeploy** tu aplicación

## 🧪 **Cómo Verificar la Configuración:**

Con los logs mejorados que agregué, ahora verás:

```
🔧 WalcuCRMService: Constructor iniciado
📋 WalcuCRMService: Verificando variables de entorno...
🔑 WalcuCRMService: Variables de entorno cargadas: {
  dealerId: "12345678...",
  baseUrl: "https://api.crm.walcu.com",
  appId: "abcdefgh...",
  secretKey: "xyz12345..."
}
✅ WalcuCRMService: Todas las variables de entorno están configuradas
🌐 WalcuCRMService: URL base configurada: https://api.crm.walcu.com/dealers/12345678
🔧 WalcuCRMService: Instancia de Axios creada con headers: {
  'Content-Type': 'application/json',
  'X-App-ID': 'abcdefgh...',
  'X-Secret-Key': 'xyz12345...'
}
```

## ❌ **Si las Variables NO Están Configuradas:**

Verás este error:
```
❌ WalcuCRMService: Variables de entorno faltantes: {
  dealerId: false,
  baseUrl: false,
  appId: false,
  secretKey: false
}
Error: Missing required Walcu CRM environment variables
```

## 🔧 **Solución Inmediata:**

1. **Configura las variables de entorno en tu servidor**
2. **Verifica que las credenciales sean correctas**
3. **Redeploy la aplicación**
4. **Prueba nuevamente el formulario**

---

**¡Una vez configuradas las variables de entorno, la integración funcionará perfectamente!** 🚀

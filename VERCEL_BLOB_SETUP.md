# 🗂️ Configuración de Vercel Blob para Subida de Imágenes

## 🚨 Problema Identificado

El error 500 al subir fotos de oferta indica que **Vercel Blob no está configurado correctamente**.

```
/api/cars/330/offer-image:1 Failed to load resource: the server responded with a status of 500 ()
Error: La subida de foto de oferta ha fallado
```

## 🔧 Solución: Configurar Vercel Blob

### Paso 1: Crear Blob Store en Vercel

1. **Ve a tu proyecto en Vercel Dashboard**
2. **Storage → Create Database → Blob**
3. **Nombre**: `car-images` (o el nombre que prefieras)
4. **Región**: Selecciona la más cercana a tus usuarios
5. **Haz clic en "Create"**

### Paso 2: Obtener el Token

Después de crear el Blob Store:

1. **Ve a la pestaña "Settings"** del Blob Store
2. **Copia el "Read Write Token"**
3. **Guarda este token** (lo necesitarás para el siguiente paso)

### Paso 3: Configurar Variables de Entorno

#### En Desarrollo Local (.env.local):
```bash
# Vercel Blob Configuration
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXXXX
```

#### En Producción (Vercel Dashboard):
1. **Ve a tu proyecto → Settings → Environment Variables**
2. **Agrega nueva variable:**
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: `vercel_blob_rw_XXXXXXXXXXXXXXXXXX`
   - **Environment**: Production, Preview, Development
3. **Guarda los cambios**
4. **Redeploy** tu aplicación

### Paso 4: Verificar la Configuración

Con los logs mejorados que agregué, ahora verás en la consola del servidor:

```
🔍 Verificando configuración de Vercel Blob...
🔑 BLOB_READ_WRITE_TOKEN: CONFIGURADO
✅ Coche encontrado: Nissan Qashqai DIG-T 103 kW (140 CV) E6D N-CONNECTA
📤 Subiendo imagen a Vercel Blob...
📁 Filename: car-330-offer-image.jpg
📋 Content-Type: image/jpeg
✅ Imagen subida exitosamente: https://xxxxx.public.blob.vercel-storage.com/offer-images/car-330-offer-image.jpg
✅ Base de datos actualizada para coche ID: 330
```

## 🎯 Funcionalidades que Requieren Vercel Blob

1. **Fotos de Oferta** (`/admin/manage-photos`)
2. **Banners Promocionales** (`/admin/manage-offers`)
3. **Galería de Entregas** (`/admin/gallery`)

## 🔍 Cómo Verificar si Está Funcionando

### Método 1: Logs del Servidor
Abre las **Developer Tools (F12) → Console** y busca:
- ✅ `🔑 BLOB_READ_WRITE_TOKEN: CONFIGURADO`
- ❌ `🔑 BLOB_READ_WRITE_TOKEN: NO CONFIGURADO`

### Método 2: Intentar Subir una Imagen
1. Ve a `/admin/manage-photos`
2. Selecciona un coche
3. Intenta subir una foto de oferta
4. Si funciona: ✅ Configurado correctamente
5. Si falla: ❌ Revisa la configuración

## 🚨 Errores Comunes

### Error: "Vercel Blob no está configurado"
**Causa**: Falta la variable `BLOB_READ_WRITE_TOKEN`
**Solución**: Sigue los pasos 2 y 3 arriba

### Error: "Error de conexión con el servicio de almacenamiento"
**Causa**: Token inválido o problemas de red
**Solución**: 
1. Verifica que el token sea correcto
2. Regenera el token en Vercel Dashboard
3. Actualiza la variable de entorno

### Error: "Error de base de datos al actualizar el coche"
**Causa**: Problema con el campo `offerImageUrl` en la base de datos
**Solución**: 
```bash
npx prisma db push
```

## 💰 Costos de Vercel Blob

- **Plan Hobby**: 1GB gratis, luego $0.15/GB
- **Plan Pro**: 100GB incluidos, luego $0.15/GB
- **Plan Enterprise**: Personalizado

Para un concesionario típico, el plan gratuito debería ser suficiente inicialmente.

## 🔄 Migración de Imágenes Existentes

Si ya tienes imágenes en otro servicio, puedes migrarlas:

1. **Descarga las imágenes actuales**
2. **Súbelas manualmente** a través del admin
3. **O crea un script de migración** (contacta para ayuda)

## 📞 Soporte

Si sigues teniendo problemas:

1. **Verifica los logs** en la consola del navegador
2. **Revisa las variables de entorno** en Vercel Dashboard
3. **Comprueba que el Blob Store** esté activo
4. **Intenta regenerar** el token de acceso

Una vez configurado correctamente, podrás subir fotos de oferta sin problemas.









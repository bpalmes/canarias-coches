# Configuración de Google Sheets para Importación de Leads

Este documento explica cómo configurar la integración con Google Sheets para importar leads automáticamente.

## 1. Configuración de Google Cloud Console

### Paso 1: Crear/Seleccionar Proyecto
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Selecciona tu proyecto existente o crea uno nuevo

### Paso 2: Habilitar Google Sheets API
1. En el menú de navegación, ve a **APIs y servicios > Biblioteca**
2. Busca "Google Sheets API"
3. Haz clic en "Habilitar"

### Paso 3: Crear Cuenta de Servicio
1. Ve a **IAM y administración > Cuentas de servicio**
2. Haz clic en "Crear cuenta de servicio"
3. Completa los datos:
   - **Nombre**: `genesis-documentos` (o el nombre que prefieras)
   - **Descripción**: "Cuenta para importar leads desde Google Sheets"
4. Haz clic en "Crear y continuar"
5. Omite los permisos opcionales y haz clic en "Listo"

### Paso 4: Generar Credenciales
1. En la lista de cuentas de servicio, haz clic en la cuenta que acabas de crear
2. Ve a la pestaña **"CLAVES"**
3. Haz clic en **"AÑADIR CLAVE" > "Crear nueva clave"**
4. Selecciona **JSON** y haz clic en **"CREAR"**
5. Se descargará automáticamente un archivo JSON con las credenciales

## 2. Configuración de Variables de Entorno

### Paso 1: Extraer Datos del JSON
Abre el archivo JSON descargado y busca estos campos:
- `client_email`: La dirección de correo de la cuenta de servicio
- `private_key`: La clave privada (texto largo que empieza con "-----BEGIN PRIVATE KEY-----")

### Paso 2: Configurar .env.local
Crea o edita el archivo `.env.local` en la raíz de tu proyecto:

```bash
# Google Sheets API Configuration (Requerido)
GOOGLE_SERVICE_ACCOUNT_EMAIL="genesis-documentos@hallowed-cortex-468010-b4.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Configuración de Importación Automática (Opcional pero Recomendado)
GOOGLE_SHEETS_DEFAULT_SPREADSHEET_ID="1ABC123DEF456GHI789JKL"
GOOGLE_SHEETS_DEFAULT_SHEET_NAME="Leads"
GOOGLE_SHEETS_DEFAULT_RANGE=""
GOOGLE_SHEETS_AUTO_IMPORT="true"
GOOGLE_SHEETS_AUTO_IMPORT_INTERVAL="300000"
```

**⚠️ Importante**: 
- Reemplaza `\n` en la clave privada por saltos de línea literales `\n`
- Mantén las comillas dobles alrededor de toda la clave
- Nunca subas este archivo a control de versiones

## 3. Configuración de Google Sheets

### Paso 1: Compartir la Hoja de Cálculo
1. Abre tu Google Sheet
2. Haz clic en **"Compartir"** (botón azul en la esquina superior derecha)
3. En "Añadir personas y grupos", pega el email de la cuenta de servicio:
   ```
   genesis-documentos@hallowed-cortex-468010-b4.iam.gserviceaccount.com
   ```
4. Cambia el permiso a **"Lector"** (Viewer)
5. Desmarca "Notificar a los usuarios" si quieres
6. Haz clic en **"Compartir"**

### Paso 2: Formato de la Hoja de Cálculo
La primera fila debe contener los headers. El sistema reconoce automáticamente múltiples variaciones:

#### Campos Principales
| Campo | Variaciones Reconocidas |
|-------|------------------------|
| **Nombre** | nombre, first_name, firstname, first name, name, cliente, contacto |
| **Apellido** | apellido, apellidos, last_name, lastname, surname, family_name |
| **Email** | email, correo, correo_electronico, e-mail, mail, email_address |
| **Teléfono** | telefono, teléfono, phone, movil, móvil, celular, tel, mobile |
| **Mensaje** | mensaje, message, comentario, observaciones, notas, consulta |

#### Información del Vehículo
| Campo | Variaciones Reconocidas |
|-------|------------------------|
| **Marca** | marca, make, car_make, fabricante, brand |
| **Modelo** | modelo, model, car_model, version_corta |
| **Año** | año, year, car_year, anio, año_fabricacion |
| **Matrícula** | matricula, matrícula, license_plate, numberplate, placa |
| **Stock/SKU** | stock, stock_number, sku, codigo, referencia |

#### Campos Adicionales (Automáticos)
El sistema también detecta automáticamente:
- **Ubicación**: ciudad, provincia, codigo_postal
- **Comerciales**: presupuesto, financiacion, urgencia
- **Marketing**: fuente, medio, campaña
- **Calificación**: puntuacion, lead_score

**💡 Ventaja**: Cualquier columna no reconocida se incluye automáticamente en el campo "mensaje" del lead.

**Ejemplo de estructura:**
```
nombre | apellido | email | telefono | mensaje | marca | modelo | año
Juan | Pérez | juan@email.com | 123456789 | Interesado en el coche | Toyota | Corolla | 2020
```

## 4. Uso del Sistema

### Importación Automática (Recomendado)
Si configuraste las variables de entorno para importación automática:

1. Ve a **Admin > Gestión de Leads**
2. Haz clic en **"Importar Automático"** (botón azul con rayo ⚡)
3. El sistema importará automáticamente desde la hoja configurada
4. Verás un resumen completo con:
   - Estadísticas de importación
   - Mapeo automático de columnas
   - Campos adicionales detectados
   - Errores si los hay

### Importación Manual
Si necesitas importar desde una hoja diferente:

1. Ve a **Admin > Gestión de Leads**
2. Haz clic en **"Configurar Importación"**
3. Pega la URL completa de tu Google Sheet o solo el ID
4. Especifica el nombre de la hoja si no es "Hoja1"
5. Opcionalmente, especifica un rango (ej: A1:H100)
6. Haz clic en **"Vista Previa"** para verificar los datos
7. Si todo se ve correcto, haz clic en **"Importar Leads"**

### Obtener el ID de la Hoja
El ID está en la URL de tu Google Sheet:
```
https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit
                                    ↑ Este es el ID ↑
```

## 5. Solución de Problemas

### Error: "Sin permisos para acceder a la hoja de cálculo"
- Verifica que hayas compartido la hoja con la cuenta de servicio
- Asegúrate de que el email de la cuenta de servicio sea correcto

### Error: "Hoja de cálculo no encontrada"
- Verifica que el ID de la hoja sea correcto
- Asegúrate de que la hoja no esté eliminada

### Error: "Email inválido"
- Verifica que la columna de email contenga direcciones válidas
- Asegúrate de que no haya espacios en blanco extra

### Error: "Faltan datos requeridos"
- Verifica que las columnas de nombre y email estén presentes
- Asegúrate de que los headers estén en la primera fila

## 6. Seguridad

- **Nunca** hagas pública tu hoja de Google Sheets
- **Nunca** compartas las credenciales de la cuenta de servicio
- Mantén el archivo `.env.local` fuera del control de versiones
- Usa permisos de "Lector" únicamente para la cuenta de servicio
- Revisa periódicamente los accesos a tu hoja de cálculo

## 7. Verificación de la Configuración

### Script de Prueba
Puedes usar el script de prueba incluido para verificar tu configuración:

```bash
# Prueba básica de conexión
node scripts/test-google-sheets.mjs

# Prueba con una hoja específica
node scripts/test-google-sheets.mjs 1ABC123DEF456GHI789JKL
```

Este script verificará:
- Variables de entorno configuradas correctamente
- Autenticación con Google Sheets API
- Permisos de acceso a la hoja
- Lectura de headers y datos de muestra

## 8. Limitaciones

- La API de Google Sheets tiene límites de uso (100 requests por 100 segundos por usuario)
- Las hojas muy grandes (>10,000 filas) pueden tardar más en procesarse
- Solo se pueden importar leads, no se pueden exportar desde el sistema
- Los años deben estar entre 1900 y el año actual + 2 para ser válidos

#!/usr/bin/env node

/**
 * Script de prueba para verificar la conexión con Google Sheets API
 * 
 * Uso:
 * 1. Configura las variables de entorno en .env.local
 * 2. Ejecuta: node scripts/test-google-sheets.mjs
 */

import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

// Colores para la consola
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testGoogleSheetsConnection() {
  log('🧪 Iniciando prueba de conexión con Google Sheets API...', 'blue');
  
  try {
    // 1. Verificar variables de entorno
    log('\n📋 Verificando variables de entorno...', 'yellow');
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('❌ Falta GOOGLE_SERVICE_ACCOUNT_EMAIL en las variables de entorno');
    }
    log(`✅ GOOGLE_SERVICE_ACCOUNT_EMAIL: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`, 'green');
    
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('❌ Falta GOOGLE_PRIVATE_KEY en las variables de entorno');
    }
    log('✅ GOOGLE_PRIVATE_KEY: [CONFIGURADA]', 'green');
    
    // 2. Configurar autenticación
    log('\n🔐 Configurando autenticación...', 'yellow');
    
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
    
    // 3. Autorizar conexión
    log('🔑 Autorizando conexión...', 'yellow');
    await auth.authorize();
    log('✅ Autorización exitosa', 'green');
    
    // 4. Crear cliente de Sheets
    const sheets = google.sheets({ version: 'v4', auth });
    log('✅ Cliente de Google Sheets creado', 'green');
    
    // 5. Solicitar ID de hoja para prueba
    const spreadsheetId = process.argv[2];
    
    if (!spreadsheetId) {
      log('\n📝 Para probar con una hoja específica, ejecuta:', 'blue');
      log('node scripts/test-google-sheets.mjs [ID_DE_LA_HOJA]', 'blue');
      log('\nEjemplo:', 'blue');
      log('node scripts/test-google-sheets.mjs 1ABC123DEF456GHI789JKL', 'blue');
      log('\n✅ Configuración de API correcta. Listo para usar.', 'green');
      return;
    }
    
    // 6. Probar lectura de hoja específica
    log(`\n📊 Probando lectura de hoja: ${spreadsheetId}`, 'yellow');
    
    try {
      // Obtener información básica de la hoja
      const spreadsheetInfo = await sheets.spreadsheets.get({
        spreadsheetId,
      });
      
      log(`✅ Hoja encontrada: "${spreadsheetInfo.data.properties?.title}"`, 'green');
      
      // Listar hojas disponibles
      if (spreadsheetInfo.data.sheets) {
        log('\n📋 Hojas disponibles:', 'blue');
        spreadsheetInfo.data.sheets.forEach((sheet, index) => {
          const title = sheet.properties?.title || `Hoja ${index + 1}`;
          const rows = sheet.properties?.gridProperties?.rowCount || 0;
          const cols = sheet.properties?.gridProperties?.columnCount || 0;
          log(`  ${index + 1}. ${title} (${rows} filas, ${cols} columnas)`, 'blue');
        });
      }
      
      // Intentar leer la primera hoja
      const firstSheetName = spreadsheetInfo.data.sheets?.[0]?.properties?.title || 'Hoja1';
      
      log(`\n📖 Leyendo datos de "${firstSheetName}"...`, 'yellow');
      
      // Leer headers
      const headersResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${firstSheetName}!1:1`,
        valueRenderOption: 'UNFORMATTED_VALUE'
      });
      
      const headers = headersResponse.data.values?.[0] || [];
      
      if (headers.length > 0) {
        log(`✅ Headers encontrados (${headers.length}):`, 'green');
        headers.forEach((header, index) => {
          log(`  ${String.fromCharCode(65 + index)}: ${header}`, 'green');
        });
      } else {
        log('⚠️  No se encontraron headers en la primera fila', 'yellow');
      }
      
      // Leer muestra de datos
      const sampleResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${firstSheetName}!2:6`,
        valueRenderOption: 'UNFORMATTED_VALUE'
      });
      
      const sampleData = sampleResponse.data.values || [];
      
      if (sampleData.length > 0) {
        log(`\n📋 Muestra de datos (${sampleData.length} filas):`, 'blue');
        sampleData.forEach((row, index) => {
          log(`  Fila ${index + 2}: [${row.join(', ')}]`, 'blue');
        });
      } else {
        log('\n⚠️  No se encontraron datos en las filas 2-6', 'yellow');
      }
      
      log('\n🎉 ¡Prueba completada exitosamente!', 'green');
      log('✅ La API está configurada correctamente y puede leer la hoja.', 'green');
      
    } catch (sheetError) {
      if (sheetError.response?.status === 403) {
        log('❌ Error de permisos: La hoja no está compartida con la cuenta de servicio', 'red');
        log(`📧 Comparte la hoja con: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`, 'yellow');
        log('🔒 Asigna permisos de "Lector" únicamente', 'yellow');
      } else if (sheetError.response?.status === 404) {
        log('❌ Error: Hoja de cálculo no encontrada', 'red');
        log('🔍 Verifica que el ID de la hoja sea correcto', 'yellow');
      } else {
        log(`❌ Error leyendo la hoja: ${sheetError.message}`, 'red');
      }
    }
    
  } catch (error) {
    log(`\n❌ Error en la prueba: ${error.message}`, 'red');
    
    if (error.message.includes('private_key')) {
      log('\n💡 Consejos para GOOGLE_PRIVATE_KEY:', 'yellow');
      log('1. Debe empezar con "-----BEGIN PRIVATE KEY-----"', 'yellow');
      log('2. Debe terminar con "-----END PRIVATE KEY-----"', 'yellow');
      log('3. Los saltos de línea deben ser \\n literales', 'yellow');
      log('4. Debe estar entre comillas dobles', 'yellow');
    }
    
    if (error.message.includes('client_email')) {
      log('\n💡 Consejos para GOOGLE_SERVICE_ACCOUNT_EMAIL:', 'yellow');
      log('1. Debe terminar con .iam.gserviceaccount.com', 'yellow');
      log('2. Debe ser exactamente como aparece en el archivo JSON', 'yellow');
    }
    
    process.exit(1);
  }
}

// Ejecutar prueba
testGoogleSheetsConnection().catch(error => {
  log(`❌ Error fatal: ${error.message}`, 'red');
  process.exit(1);
});





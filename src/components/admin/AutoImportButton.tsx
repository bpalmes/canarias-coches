"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Settings,
  FileSpreadsheet,
  Zap
} from 'lucide-react';

interface AutoImportResult {
  success: boolean;
  message?: string;
  data?: {
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    errors: string[];
    totalLeads: number;
    spreadsheetId: string;
    totalSheets: number;
    sheetsProcessed: string[];
    sheetsWithData: number;
  };
  error?: string;
  requiresManualConfig?: boolean;
}

interface AutoImportButtonProps {
  onImportComplete: () => void;
  onLog?: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export default function AutoImportButton({ onImportComplete, onLog }: AutoImportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AutoImportResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAutoImport = async () => {
    setLoading(true);
    setResult(null);
    setShowResult(false);

    onLog?.('🚀 Iniciando importación automática desde Google Sheets...', 'info');

    try {
      const response = await fetch('/api/admin/leads/auto-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
      setShowResult(true);

      if (data.success && data.data) {
        const { created, updated, skipped, totalLeads, sentToWalcu, walcuErrors } = data.data;
        
        onLog?.(`✅ Importación completada: ${totalLeads} leads procesados`, 'success');
        onLog?.(`📊 Resultados: ${created} creados, ${updated} actualizados, ${skipped} saltados`, 'info');
        
        if (sentToWalcu > 0) {
          onLog?.(`🎯 Enviados a Walcu: ${sentToWalcu} leads nuevos (solo los que no existían)`, 'success');
        }
        
        if (walcuErrors > 0) {
          onLog?.(`⚠️ Errores en Walcu: ${walcuErrors} leads fallaron al enviar`, 'warning');
        }

        if (data.data.errors && data.data.errors.length > 0) {
          data.data.errors.forEach((error: string) => {
            onLog?.(`❌ Error: ${error}`, 'error');
          });
        }

        onImportComplete();
      } else {
        onLog?.(`❌ Error en auto-import: ${data.error}`, 'error');
      }
    } catch {
      const errorMessage = 'Error de conexión durante la importación automática';
      onLog?.(`❌ ${errorMessage}`, 'error');
      setResult({
        success: false,
        error: errorMessage
      });
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAutoImport}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
        title="Importación automática desde la hoja configurada"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Zap className="w-4 h-4" />
        )}
        Importar Automático
      </button>

      {/* Modal de Resultados */}
      {showResult && result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Importación Automática
                  </h2>
                  <p className="text-sm text-gray-500">
                    {result.success ? 'Completada exitosamente' : 'Error en la importación'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResult(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              {result.success && result.data ? (
                <div className="space-y-6">
                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.data.processed}
                      </div>
                      <div className="text-sm text-blue-700">Procesados</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {result.data.created}
                      </div>
                      <div className="text-sm text-green-700">Creados</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {result.data.updated}
                      </div>
                      <div className="text-sm text-yellow-700">Actualizados</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">
                        {result.data.skipped}
                      </div>
                      <div className="text-sm text-gray-700">Omitidos</div>
                    </div>
                  </div>

                  {/* Información de la fuente */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Fuente de datos</h4>
                    </div>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p><strong>Spreadsheet ID:</strong> {result.data.spreadsheetId}</p>
                      <p><strong>Hojas procesadas:</strong> {result.data.sheetsWithData} de {result.data.totalSheets}</p>
                      
                      {/* Lista de hojas procesadas */}
                      <div>
                        <p className="font-medium mb-1">Hojas con datos:</p>
                        <div className="flex flex-wrap gap-1">
                          {result.data.sheetsProcessed.map((sheetName, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                            >
                              {sheetName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Procesamiento automático</h4>
                    <div className="text-sm text-green-800 space-y-1">
                      <p>✅ Mapeo automático de columnas por hoja</p>
                      <p>✅ Campos adicionales incluidos en mensajes</p>
                      <p>✅ Leads marcados con hoja de origen</p>
                      <p>✅ Envío automático a Walcu CRM</p>
                    </div>
                  </div>

                  {/* Errores */}
                  {result.data.errors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-900 mb-3">
                        Errores encontrados ({result.data.errors.length}):
                      </h4>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                        {result.data.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-700 mb-1">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-green-800 font-medium">{result.message}</p>
                  </div>
                </div>
              ) : result.requiresManualConfig ? (
                <div className="text-center py-8">
                  <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Configuración requerida
                  </h3>
                  <p className="text-gray-600 mb-4">
                    No hay una hoja de cálculo configurada por defecto. 
                    Necesitas configurar las variables de entorno para la importación automática.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                    <h4 className="font-medium text-yellow-900 mb-2">Variables requeridas:</h4>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <p><code>GOOGLE_SHEETS_DEFAULT_SPREADSHEET_ID</code></p>
                      <p><code>GOOGLE_SHEETS_DEFAULT_SHEET_NAME</code> (opcional, por defecto &quot;Leads&quot;)</p>
                      <p><code>GOOGLE_SHEETS_DEFAULT_RANGE</code> (opcional, lee todo si no se especifica)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                  <h3 className="text-lg font-medium text-red-900 mb-2">
                    Error en la importación
                  </h3>
                  <p className="text-red-700">{result.error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowResult(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

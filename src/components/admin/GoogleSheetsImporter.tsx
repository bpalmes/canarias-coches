"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Eye
} from 'lucide-react';
import { ImportResult, SheetInfo } from '@/types/lead';

interface GoogleSheetsImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export default function GoogleSheetsImporter({ 
  isOpen, 
  onClose, 
  onImportComplete 
}: GoogleSheetsImporterProps) {
  const [step, setStep] = useState<'config' | 'preview' | 'importing' | 'results'>('config');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [selectedSheet, setSelectedSheet] = useState('');
  const [range, setRange] = useState('');
  const [sheetInfo, setSheetInfo] = useState<SheetInfo | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extraer ID de la URL de Google Sheets
  const extractSpreadsheetId = (url: string) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  // Obtener información de la hoja
  const fetchSheetInfo = async () => {
    if (!spreadsheetId) {
      setError('Por favor, ingresa el ID o URL de la hoja de cálculo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const id = extractSpreadsheetId(spreadsheetId);
      const response = await fetch(
        `/api/admin/leads/import-sheets?spreadsheetId=${encodeURIComponent(id)}&sheetName=${encodeURIComponent(selectedSheet || 'Hoja1')}`
      );
      
      const result = await response.json();

      if (result.success) {
        setSheetInfo(result.data);
        setStep('preview');
      } else {
        setError(result.error || 'Error obteniendo información de la hoja');
      }
    } catch {
      setError('Error de conexión. Verifica que la hoja sea accesible.');
    } finally {
      setLoading(false);
    }
  };

  // Realizar importación
  const performImport = async () => {
    if (!sheetInfo) return;

    setStep('importing');
    setError(null);

    try {
      const id = extractSpreadsheetId(spreadsheetId);
      const response = await fetch('/api/admin/leads/import-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: id,
          sheetName: selectedSheet || sheetInfo.sheets[0]?.title || 'Hoja1',
          range: range || undefined
        }),
      });

      const result = await response.json();
      setImportResult(result);
      setStep('results');

      if (result.success) {
        onImportComplete();
      }
    } catch {
      setImportResult({
        success: false,
        error: 'Error durante la importación'
      });
      setStep('results');
    }
  };

  // Resetear estado
  const resetState = () => {
    setStep('config');
    setSpreadsheetId('');
    setSelectedSheet('');
    setRange('');
    setSheetInfo(null);
    setImportResult(null);
    setError(null);
    setLoading(false);
  };

  // Cerrar modal
  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Importar Leads desde Google Sheets
                </h2>
                <p className="text-sm text-gray-500">
                  {step === 'config' && 'Configura la conexión con tu hoja de cálculo'}
                  {step === 'preview' && 'Revisa los datos antes de importar'}
                  {step === 'importing' && 'Importando datos...'}
                  {step === 'results' && 'Resultados de la importación'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Step 1: Configuration */}
            {step === 'config' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL o ID de Google Sheets *
                  </label>
                  <input
                    type="text"
                    value={spreadsheetId}
                    onChange={(e) => setSpreadsheetId(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1ABC... o solo el ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puedes pegar la URL completa o solo el ID de la hoja de cálculo
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la hoja (opcional)
                  </label>
                  <input
                    type="text"
                    value={selectedSheet}
                    onChange={(e) => setSelectedSheet(e.target.value)}
                    placeholder="Hoja1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Si no se especifica, se usará la primera hoja
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango específico (opcional)
                  </label>
                  <input
                    type="text"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    placeholder="A1:H100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ejemplo: A1:H100. Si no se especifica, se leerán todas las columnas
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Formato esperado:</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• La primera fila debe contener los headers/títulos</p>
                    <p>• Columnas reconocidas: nombre, apellido, email, teléfono, mensaje, marca, modelo, año, etc.</p>
                    <p>• El email es obligatorio para cada lead</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Preview */}
            {step === 'preview' && sheetInfo && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium text-green-900">Conexión exitosa</h4>
                  </div>
                  <div className="text-sm text-green-800">
                    <p><strong>Hoja:</strong> {sheetInfo.title}</p>
                    <p><strong>Filas totales:</strong> {sheetInfo.totalRows}</p>
                    <p><strong>Columnas:</strong> {sheetInfo.headers.length}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Headers detectados:</h4>
                  <div className="flex flex-wrap gap-2">
                    {sheetInfo.headers.map((header, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                      >
                        {header}
                      </span>
                    ))}
                  </div>
                </div>

                {sheetInfo.sampleData.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Vista previa de datos:</h4>
                    <div className="overflow-x-auto border border-gray-200 rounded-md">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {sheetInfo.headers.map((header, index) => (
                              <th
                                key={index}
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sheetInfo.sampleData.slice(0, 3).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                                >
                                  {cell || '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Mostrando las primeras 3 filas como ejemplo
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Importing */}
            {step === 'importing' && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Importando datos...
                </h3>
                <p className="text-gray-500">
                  Por favor espera mientras procesamos los leads
                </p>
              </div>
            )}

            {/* Step 4: Results */}
            {step === 'results' && importResult && (
              <div className="space-y-6">
                {importResult.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <h3 className="text-lg font-medium text-green-900">
                        ¡Importación completada!
                      </h3>
                    </div>
                    
                    {importResult.data && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {importResult.data.processed}
                          </div>
                          <div className="text-sm text-green-700">Procesados</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {importResult.data.created}
                          </div>
                          <div className="text-sm text-blue-700">Creados</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {importResult.data.updated}
                          </div>
                          <div className="text-sm text-yellow-700">Actualizados</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {importResult.data.errors.length}
                          </div>
                          <div className="text-sm text-red-700">Errores</div>
                        </div>
                      </div>
                    )}

                    <p className="text-green-800">{importResult.message}</p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <h3 className="font-medium text-red-900">Error en la importación</h3>
                    </div>
                    <p className="text-red-800">{importResult.error}</p>
                  </div>
                )}

                {importResult.data?.errors && importResult.data.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Errores encontrados ({importResult.data.errors.length}):
                    </h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 max-h-40 overflow-y-auto">
                      {importResult.data.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-600 mb-1">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              {step !== 'config' && step !== 'results' && (
                <button
                  onClick={() => setStep('config')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Volver
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {step === 'config' && (
                <button
                  onClick={fetchSheetInfo}
                  disabled={loading || !spreadsheetId}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  Vista Previa
                </button>
              )}

              {step === 'preview' && (
                <button
                  onClick={performImport}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Importar Leads
                </button>
              )}

              {step === 'results' && (
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

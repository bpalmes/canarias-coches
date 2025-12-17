"use client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, CheckCircle, AlertTriangle, Trash2, Database, Info, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import DatabaseViewer from "@/components/DatabaseViewer";

interface SyncResult {
  successful: Array<{ sku: string; name: string; action: 'created' | 'updated'; details: string }>;
  skipped: Array<{ sku: string; name: string; reason: string }>;
  errors: Array<{ sku: string; name: string; error: string }>;
}

interface BatchResult {
  offset: number;
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
  results: SyncResult;
  batchDetails: {
    startIndex: number;
    endIndex: number;
    totalInBatch: number;
  };
}

export default function SyncPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingSource, setIsUpdatingSource] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [viewerKey, setViewerKey] = useState(0);
  const [cleanupMode, setCleanupMode] = useState(true);
  const [soldCount, setSoldCount] = useState<number | null>(null);
  const [syncProgress, setSyncProgress] = useState<{
    current: number;
    total: number;
    isRunning: boolean;
  } | null>(null);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [showBatchDetails, setShowBatchDetails] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    setFeedback(null);
    setSyncProgress({ current: 0, total: 0, isRunning: true });
    setBatchResults([]);
    
    try {
      let offset = 0;
      let total = 0;
      let totalCreated = 0;
      let totalUpdated = 0;
      let totalMarkedAsSold = 0;
      let totalSkipped = 0;
      let totalErrors = 0;
      
      // Primer lote para obtener el total y hacer limpieza
      const firstResponse = await fetch('/api/cars/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offset: 0,
          limit: 50,
          cleanupMode: cleanupMode
        }),
      });
      
      if (!firstResponse.ok) {
        throw new Error('Error en el primer lote de sincronización');
      }
      
      const firstResult = await firstResponse.json();
      total = firstResult.total;
      totalCreated += firstResult.createdCount || 0;
      totalUpdated += firstResult.updatedCount || 0;
      totalMarkedAsSold += firstResult.markedAsSold || 0;
      totalSkipped += firstResult.skippedCount || 0;
      totalErrors += firstResult.errorCount || 0;
      
      // Guardar resultado del primer lote
      setBatchResults(prev => [...prev, {
        offset: 0,
        createdCount: firstResult.createdCount || 0,
        updatedCount: firstResult.updatedCount || 0,
        skippedCount: firstResult.skippedCount || 0,
        errorCount: firstResult.errorCount || 0,
        results: firstResult.results,
        batchDetails: firstResult.batchDetails
      }]);
      
      setSyncProgress({ current: 50, total, isRunning: true });
      
      // Procesar lotes restantes automáticamente
      offset = 50;
      while (offset < total) {
        const response = await fetch('/api/cars/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offset,
            limit: 50,
            cleanupMode: false // Solo limpieza en el primer lote
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Error en lote ${Math.floor(offset / 50) + 1}`);
        }
        
        const result = await response.json();
        totalCreated += result.createdCount || 0;
        totalUpdated += result.updatedCount || 0;
        totalSkipped += result.skippedCount || 0;
        totalErrors += result.errorCount || 0;
        
        // Guardar resultado del lote
        setBatchResults(prev => [...prev, {
          offset,
          createdCount: result.createdCount || 0,
          updatedCount: result.updatedCount || 0,
          skippedCount: result.skippedCount || 0,
          errorCount: result.errorCount || 0,
          results: result.results,
          batchDetails: result.batchDetails
        }]);
        
        offset += 50;
        setSyncProgress({ current: Math.min(offset, total), total, isRunning: true });
        
        // Pequeña pausa para no sobrecargar el servidor
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setSyncProgress({ current: total, total, isRunning: false });
      
      let finalMessage = `Sincronización completada. Total: ${total} coches. ` +
                        `Creados: ${totalCreated}, Actualizados: ${totalUpdated}`;
      
      if (totalSkipped > 0) {
        finalMessage += `, Omitidos: ${totalSkipped}`;
      }
      
      if (totalErrors > 0) {
        finalMessage += `, Errores: ${totalErrors}`;
      }
      
      if (totalMarkedAsSold > 0) {
        finalMessage += `, Marcados como vendidos: ${totalMarkedAsSold}`;
      }
      
      setFeedback({ message: finalMessage, type: 'success' });
      setViewerKey(prevKey => prevKey + 1); // Refresh the viewer
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
      setFeedback({ message: errorMessage, type: 'error' });
      setSyncProgress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSource = async () => {
    setIsUpdatingSource(true);
    setFeedback(null);
    try {
      const response = await fetch('/api/cars/update-source', {
        method: 'POST',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Ocurrió un error durante la actualización.');
      setFeedback({ message: result.message, type: 'success' });
      setViewerKey(prevKey => prevKey + 1); // Refresh the viewer
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
      setFeedback({ message: errorMessage, type: 'error' });
    } finally {
      setIsUpdatingSource(false);
    }
  };

  const handleCountSold = async () => {
    try {
      const response = await fetch('/api/cars/cleanup-sold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'count_sold',
          source: 'feed'
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al contar coches vendidos.');
      setSoldCount(result.soldCount);
      setFeedback({ message: result.message, type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
      setFeedback({ message: errorMessage, type: 'error' });
    }
  };

  const handleCleanupSold = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar ${soldCount} coches vendidos? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsCleaningUp(true);
    setFeedback(null);
    try {
      const response = await fetch('/api/cars/cleanup-sold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_sold',
          source: 'feed'
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al eliminar coches vendidos.');
      setFeedback({ message: result.message, type: 'success' });
      setSoldCount(null);
      setViewerKey(prevKey => prevKey + 1); // Refresh the viewer
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
      setFeedback({ message: errorMessage, type: 'error' });
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Preparar Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Antes de sincronizar, es necesario actualizar los coches existentes para marcarlos correctamente según su origen.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Este paso solo es necesario la primera vez después de la actualización. Marca todos los coches existentes como provenientes del feed.
            </p>
          </div>
          
          <Button onClick={handleUpdateSource} disabled={isUpdatingSource} variant="outline">
            <Database className={`mr-2 h-4 w-4 ${isUpdatingSource ? 'animate-spin' : ''}`} />
            {isUpdatingSource ? 'Actualizando...' : 'Actualizar Origen de Coches Existentes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Sincronizar Coches desde el Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Haz clic en el botón para iniciar el proceso de sincronización. El sistema se conectará al feed de datos, leerá todos los coches y actualizará la base de datos local. Este proceso puede tardar varios minutos.
          </p>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cleanupMode" 
              checked={cleanupMode} 
              onCheckedChange={(checked) => setCleanupMode(checked as boolean)}
            />
            <label htmlFor="cleanupMode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Limpieza automática (marcar como vendidos los coches que ya no están en el feed)
            </label>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Limpieza automática:</strong> Cuando está activada, el sistema automáticamente marca como vendidos todos los coches que ya no aparecen en el feed. Esto mantiene tu inventario sincronizado con la realidad del feed.
            </p>
          </div>

          {/* Barra de progreso de sincronización */}
          {syncProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progreso de sincronización</span>
                <span>{syncProgress.current} de {syncProgress.total} coches</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {syncProgress.isRunning ? 'Procesando lotes automáticamente...' : 'Sincronización completada'}
              </p>
            </div>
          )}

          {/* Detalles de lotes procesados */}
          {batchResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Resultados por Lotes</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBatchDetails(!showBatchDetails)}
                >
                  {showBatchDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showBatchDetails ? 'Ocultar Detalles' : 'Ver Detalles'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {batchResults.map((batch, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">
                        Lote {index + 1} (Coches {batch.batchDetails.startIndex}-{batch.batchDetails.endIndex})
                      </h4>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>✅ Creados:</span>
                          <span className="font-medium">{batch.createdCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🔄 Actualizados:</span>
                          <span className="font-medium">{batch.updatedCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>⏭️ Omitidos:</span>
                          <span className="font-medium">{batch.skippedCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>❌ Errores:</span>
                          <span className="font-medium">{batch.errorCount}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Detalles expandidos de cada lote */}
              {showBatchDetails && (
                <div className="space-y-4">
                  {batchResults.map((batch, index) => (
                    <Card key={`details-${index}`} className="p-4">
                      <h4 className="font-medium mb-3">
                        Detalles del Lote {index + 1} (Coches {batch.batchDetails.startIndex}-{batch.batchDetails.endIndex})
                      </h4>
                      
                      {/* Coches procesados exitosamente */}
                      {batch.results.successful.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-green-700 mb-2">✅ Coches Procesados Exitosamente</h5>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {batch.results.successful.map((item, idx) => (
                              <div key={idx} className="text-xs bg-green-50 p-2 rounded">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-gray-600">SKU: {item.sku}</div>
                                <div className="text-gray-600">{item.details}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Coches omitidos */}
                      {batch.results.skipped.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-yellow-700 mb-2">⏭️ Coches Omitidos</h5>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {batch.results.skipped.map((item, idx) => (
                              <div key={idx} className="text-xs bg-yellow-50 p-2 rounded">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-gray-600">SKU: {item.sku}</div>
                                <div className="text-gray-600">{item.reason}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Coches con errores */}
                      {batch.results.errors.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-red-700 mb-2">❌ Coches con Errores</h5>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {batch.results.errors.map((item, idx) => (
                              <div key={idx} className="text-xs bg-red-50 p-2 rounded">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-gray-600">SKU: {item.sku}</div>
                                <div className="text-red-600">{item.error}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <Button onClick={handleSync} disabled={isLoading} size="lg">
            <RefreshCw className={`mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Sincronizando...' : 'Iniciar Sincronización Completa'}
          </Button>
        </CardContent>
        {feedback && (
          <CardFooter>
            <div className={`w-full p-3 rounded-md text-sm flex items-start space-x-2 ${feedback.type === 'success' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
              {feedback.type === 'success' ? <CheckCircle className="h-4 w-4 mt-0.5" /> : <AlertTriangle className="h-4 w-4 mt-0.5" />}
              <span>{feedback.message}</span>
            </div>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Gestión de Coches Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Los coches marcados como vendidos durante la sincronización se pueden gestionar desde aquí. Puedes eliminarlos manualmente si es necesario o mantenerlos para historial.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Los coches vendidos no aparecen en las búsquedas normales pero se mantienen en la base de datos para auditoría y posibles recuperaciones.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handleCountSold} variant="outline">
              <Info className="mr-2 h-4 w-4" />
              Contar Coches Vendidos
            </Button>
            
            {soldCount !== null && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Coches vendidos: {soldCount}</span>
                <Button 
                  onClick={handleCleanupSold} 
                  disabled={isCleaningUp || soldCount === 0}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isCleaningUp ? 'Eliminando...' : 'Eliminar Todos'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <DatabaseViewer refreshKey={viewerKey} />
    </div>
  );
} 
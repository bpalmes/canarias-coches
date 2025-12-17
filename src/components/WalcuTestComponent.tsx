"use client";

import { useState } from 'react';
import { useWalcuCRM } from '@/hooks/useWalcuCRM';
import { WalcuCar } from '@/types/walcu-crm';

interface TestResult {
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
}

interface CarsResponse {
  success: boolean;
  cars?: WalcuCar[];
  total?: number;
  message?: string;
  error?: string;
}

export default function WalcuTestComponent() {
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [carsResults, setCarsResults] = useState<CarsResponse | null>(null);
  const [loadingCars, setLoadingCars] = useState(false);
  const { 
    loading, 
    error, 
    checkConnection, 
    getStats, 
    processContactForm,
    clearError 
  } = useWalcuCRM();

  const handleTestConnection = async () => {
    const result = await checkConnection();
    setTestResults(result);
  };

  const handleTestStats = async () => {
    const result = await getStats();
    setTestResults(result);
  };

  const handleTestContactForm = async () => {
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+34600000000',
      message: 'Este es un mensaje de prueba para verificar la integración con Walcu CRM',
      source: 'test',
      medium: 'test_component',
      campaign: 'integration_test'
    };

    const result = await processContactForm(testData);
    setTestResults(result);
  };

  const handleTestCars = async () => {
    setLoadingCars(true);
    try {
      const response = await fetch('/api/walcu/cars?limit=10');
      const result = await response.json();
      setCarsResults(result);
      console.log('🚗 Resultado de coches:', result);
    } catch (err) {
      console.error('Error obteniendo coches:', err);
      setCarsResults({ success: false, error: 'Error de conexión' } as CarsResponse);
    } finally {
      setLoadingCars(false);
    }
  };



  const handleTestOfficialEndpoint = async () => {
    setLoadingCars(true);
    setTestResults(null);
    
    try {
      console.log('🧪 Probando endpoint oficial /api/walcu/leadimport...');
      
      const testData = {
        firstName: "Test",
        lastName: "Usuario",
        email: "test@example.com",
        phone: "123456789",
        message: "Prueba del endpoint oficial de leadimport",
        car: {
          make: "Test",
          model: "Modelo",
          year: 2024,
          license_plate: "TEST123",
          stock_number: "TEST001"
        }
      };

      console.log('📤 Datos de prueba enviados:', testData);

      const response = await fetch('/api/walcu/leadimport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      const result = await response.json();
      console.log('📡 Resultado del endpoint oficial:', result);

      if (result.success) {
        setTestResults({
          success: true,
          message: `✅ Endpoint oficial funcionando correctamente. Lead ID: ${result.leadId}`,
          data: result
        });
      } else {
        setTestResults({
          success: false,
          message: `❌ Error en endpoint oficial: ${result.error}`,
          data: result
        });
      }
    } catch (error) {
      console.error('💥 Error probando endpoint oficial:', error);
      setTestResults({
        success: false,
        message: `💥 Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        data: null
      });
    } finally {
      setLoadingCars(false);
    }
  };

  const handleTestMatchingReal = async () => {
    setLoadingCars(true);
    try {
      console.log('🧪 Probando matching real con coches existentes...');
      
      const response = await fetch('/api/walcu/test-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testType: 'test_matching_real' })
      });
      
      const result = await response.json();
      console.log('🧪 Resultado del test de matching real:', result);
      
      if (result.success) {
        setCarsResults({
          success: true,
          cars: result.result?.carUsed ? [result.result.carUsed] : [],
          total: 1,
          message: result.result?.message || 'Matching real exitoso'
        });
      } else {
        setCarsResults({
          success: false,
          error: `❌ Test de matching real falló: ${result.error}`
        });
      }
    } catch (err) {
      console.error('Error en test de matching real:', err);
      setCarsResults({ 
        success: false, 
        error: 'Error de conexión en test de matching real' 
      } as CarsResponse);
    } finally {
      setLoadingCars(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Pruebas de Integración con Walcu CRM
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
          <button 
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700 underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <button
          onClick={handleTestConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Probando...' : 'Probar Conexión'}
        </button>

        <button
          onClick={handleTestStats}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Obteniendo...' : 'Obtener Estadísticas'}
        </button>

        <button
          onClick={handleTestContactForm}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enviando...' : 'Probar Formulario'}
        </button>

        <button
          onClick={handleTestOfficialEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Probando...' : '🧪 Endpoint Oficial'}
        </button>

        <button
          onClick={handleTestCars}
          disabled={loadingCars}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingCars ? 'Obteniendo...' : '🚗 Ver Coches'}
        </button>

        <button
          onClick={handleTestMatchingReal}
          disabled={loadingCars}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingCars ? 'Probando...' : '🧪 Test Matching Real'}
        </button>
      </div>

      {testResults && (
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Resultados de la Prueba:
          </h3>
          
          <div className="mb-2">
            <strong>Estado:</strong>{' '}
            <span className={`px-2 py-1 rounded text-sm ${
              testResults.success 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {testResults.success ? 'Éxito' : 'Error'}
            </span>
          </div>

          {testResults.message && (
            <div className="mb-2">
              <strong>Mensaje:</strong> {testResults.message}
            </div>
          )}

          {testResults.error && (
            <div className="mb-2">
              <strong>Error:</strong> {testResults.error}
            </div>
          )}

          {testResults.data && (
            <div className="mb-2">
              <strong>Datos:</strong>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(testResults.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Resultados de coches */}
      {carsResults && (
        <div className="bg-gray-50 p-4 rounded border mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            🚗 Coches de Walcu CRM:
          </h3>
          
          {carsResults.success ? (
            <div>
              <p className="text-green-600 mb-4">
                ✅ {carsResults.message} - Total: {carsResults.total}
              </p>
              
              {carsResults.cars && carsResults.cars.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-600">Campos disponibles en cada coche:</h4>
                  <div className="bg-white p-3 rounded border text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(Object.keys(carsResults.cars[0]), null, 2)}
                    </pre>
                  </div>
                  
                  <h4 className="font-semibold text-gray-600">Primer coche (ejemplo):</h4>
                  <div className="bg-white p-3 rounded border text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(carsResults.cars[0], null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No se encontraron coches</p>
              )}
            </div>
          ) : (
            <div className="text-red-600">
              ❌ Error: {carsResults.error || carsResults.message}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Información de la Integración:
        </h3>
        <ul className="text-blue-700 space-y-1">
          <li>• <strong>Base URL:</strong> {process.env.NEXT_PUBLIC_WALCU_BASE_URL || 'No configurado'}</li>
          <li>• <strong>Dealer ID:</strong> {process.env.NEXT_PUBLIC_WALCU_DEALER_ID || 'No configurado'}</li>
          <li>• <strong>App ID:</strong> {process.env.NEXT_PUBLIC_WALCU_APP_ID || 'No configurado'}</li>
          <li>• <strong>Estado:</strong> {loading ? 'Procesando...' : 'Listo'}</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Notas Importantes:
        </h3>
        <ul className="text-yellow-700 space-y-1 text-sm">
          <li>• Las variables de entorno deben estar configuradas en el servidor</li>
          <li>• Las credenciales no se exponen en el frontend por seguridad</li>
          <li>• Los errores se manejan de forma elegante sin interrumpir la funcionalidad</li>
          <li>• Todas las operaciones son asíncronas y muestran estado de carga</li>
        </ul>
      </div>
    </div>
  );
}

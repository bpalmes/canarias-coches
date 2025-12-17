"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Shield } from 'lucide-react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function CookieManager() {
  const [showSettings, setShowSettings] = useState(false);
  const { preferences, updatePreferences, clearConsent } = useCookieConsent();

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    if (key === 'necessary') return; // No se puede cambiar
    updatePreferences({ [key]: value });
  };

  const handleClearConsent = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todas las preferencias de cookies? Esto hará que aparezca nuevamente el banner de cookies.')) {
      clearConsent();
      setShowSettings(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowSettings(true)}
        className="text-gray-600 hover:text-gray-900"
      >
        <Shield className="h-4 w-4 mr-2" />
        Gestionar Cookies
      </Button>

      {/* Modal de configuración */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="h-6 w-6 text-blue-600" />
                  Gestionar Preferencias de Cookies
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Cookies necesarias */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">Cookies Necesarias</h3>
                      <p className="text-sm text-gray-600">
                        Estas cookies son esenciales para el funcionamiento del sitio web
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-500">Siempre activas</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Incluyen cookies de sesión, autenticación y seguridad. No se pueden desactivar.
                  </p>
                </div>

                {/* Cookies analíticas */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">Cookies Analíticas</h3>
                      <p className="text-sm text-gray-600">
                        Nos ayudan a entender cómo interactúas con el sitio web
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Recopilan información sobre el uso del sitio para mejorar la experiencia del usuario.
                  </p>
                </div>

                {/* Cookies de marketing */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">Cookies de Marketing</h3>
                      <p className="text-sm text-gray-600">
                        Utilizadas para mostrar publicidad relevante
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Permiten mostrar anuncios personalizados basados en tus intereses.
                  </p>
                </div>

                {/* Cookies de preferencias */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">Cookies de Preferencias</h3>
                      <p className="text-sm text-gray-600">
                        Almacenan tus configuraciones y preferencias
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.preferences}
                        onChange={(e) => handlePreferenceChange('preferences', e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Guardan información como idioma, región y configuraciones personalizadas.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleClearConsent}
                  className="flex-1"
                >
                  Eliminar Preferencias
                </Button>
                <Button
                  onClick={() => setShowSettings(false)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Los cambios se guardan automáticamente. Puedes modificar estas preferencias en cualquier momento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Settings, Shield, Info } from 'lucide-react';
import Link from 'next/link';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { preferences, hasConsented, isInitialized, updatePreferences, acceptAll, rejectAll } = useCookieConsent();

  useEffect(() => {
    // Solo mostrar el banner si se ha inicializado y no se ha dado consentimiento
    if (isInitialized && !hasConsented) {
      setShowBanner(true);
    }
  }, [hasConsented, isInitialized]);

  const handleAcceptAll = () => {
    acceptAll();
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    // Las preferencias ya se actualizan automáticamente en el hook
    setShowBanner(false);
    setShowSettings(false);
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    if (key === 'necessary') return; // No se puede cambiar
    updatePreferences({ [key]: value });
  };

  // No mostrar nada hasta que se haya inicializado
  if (!isInitialized) return null;
  
  // No mostrar nada si se ha dado consentimiento
  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Banner principal de cookies */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Política de Cookies
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. 
                  Al hacer clic en &quot;Aceptar todas&quot;, consientes el uso de todas las cookies. 
                  Puedes personalizar tus preferencias haciendo clic en &quot;Configurar&quot;.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Info className="h-4 w-4" />
                  <span>
                    Para más información, consulta nuestra{' '}
                    <Link href="/politica-privacidad" className="text-blue-600 hover:underline">
                      Política de Privacidad
                    </Link>
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="w-full sm:w-auto"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  className="w-full sm:w-auto"
                >
                  Rechazar todas
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto"
                >
                  Aceptar todas
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de configuración de cookies */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="h-6 w-6 text-blue-600" />
                  Configuración de Cookies
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-5 w-5" />
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
                  onClick={handleRejectAll}
                  className="flex-1"
                >
                  Rechazar todas
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1"
                >
                  Guardar preferencias
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Para más información sobre cómo utilizamos las cookies, consulta nuestra{' '}
                  <Link href="/politica-privacidad" className="text-blue-600 hover:underline">
                    Política de Privacidad
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

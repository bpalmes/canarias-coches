import { useState, useEffect, useMemo, useCallback } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const [hasConsented, setHasConsented] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Solo cargar una vez al inicializar
    if (isInitialized) return;

    // Cargar preferencias guardadas del localStorage
    const savedPreferences = localStorage.getItem('cookieConsent');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
        setHasConsented(true);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
    setIsInitialized(true);
  }, [isInitialized]);

  const updatePreferences = useCallback((newPreferences: Partial<CookiePreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('cookieConsent', JSON.stringify(updated));
    setHasConsented(true);
  }, [preferences]);

  const acceptAll = useCallback(() => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setHasConsented(true);
  }, []);

  const rejectAll = useCallback(() => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    setHasConsented(true);
  }, []);

  const clearConsent = useCallback(() => {
    localStorage.removeItem('cookieConsent');
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
    setHasConsented(false);
  }, []);

  // Verificar si se pueden usar cookies específicas
  const canUseAnalytics = useMemo(() => preferences.analytics && hasConsented, [preferences.analytics, hasConsented]);
  const canUseMarketing = useMemo(() => preferences.marketing && hasConsented, [preferences.marketing, hasConsented]);
  const canUsePreferences = useMemo(() => preferences.preferences && hasConsented, [preferences.preferences, hasConsented]);

  return {
    preferences,
    hasConsented,
    isInitialized,
    updatePreferences,
    acceptAll,
    rejectAll,
    clearConsent,
    canUseAnalytics,
    canUseMarketing,
    canUsePreferences,
  };
}

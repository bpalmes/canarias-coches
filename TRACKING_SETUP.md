# Configuración de Pixels de Tracking

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
# Tracking Pixels Configuration
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=1112511714254326
NEXT_PUBLIC_CLARITY_ID=sjw5c027i4
NEXT_PUBLIC_GTM_ID=GTM-KFMJQSCW
```

## IDs de Tracking Configurados

- **Meta Pixel (Facebook)**: 1112511714254326
- **Microsoft Clarity**: sjw5c027i4
- **Google Tag Manager**: GTM-KFMJQSCW

## Funcionalidades Implementadas

### Meta Pixel
- Rastrea PageView automáticamente
- Inicializa el pixel de Facebook
- Fallback para usuarios sin JavaScript

### Microsoft Clarity
- Analiza comportamiento del usuario
- Graba sesiones para análisis de UX

### Google Tag Manager
- Gestiona todos los tags de marketing
- Fallback para usuarios sin JavaScript

## Uso

El componente `TrackingPixels` se carga automáticamente en todas las páginas a través del layout principal.

## Eventos Personalizados

Para rastrear eventos específicos (como conversiones), puedes usar:

```typescript
// Rastrear evento de conversión
if (typeof window !== 'undefined' && (window as any).fbq) {
  (window as any).fbq('track', 'Purchase', {
    value: 100.00,
    currency: 'EUR'
  });
}
```

## Notas Importantes

- Los pixels solo se cargan en el cliente (navegador)
- Se respeta la configuración de cookies del usuario
- Los IDs están hardcodeados como fallback si no hay variables de entorno

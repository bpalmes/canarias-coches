'use client';

import { useEffect } from 'react';
import { trackingConfig } from '@/lib/tracking-config';

export default function TrackingPixels() {
  const { facebook: { pixelId: facebookPixelId }, clarity: { id: clarityId }, gtm: { id: gtmId } } = trackingConfig;
  
  useEffect(() => {
    // Meta Pixel (Facebook) - Código simplificado
    if (facebookPixelId && typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fbq = (window as any).fbq || function(...args: unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).fbq.callMethod ? (window as any).fbq.callMethod(...args) : (window as any).fbq.queue.push(args);
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fbq.push = (window as any).fbq;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fbq.loaded = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fbq.version = '2.0';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fbq.queue = [];
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fbq('init', facebookPixelId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fbq('track', 'PageView');
    }

    // Microsoft Clarity - Código simplificado
    if (clarityId && typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clarity = (window as any).clarity || function(...args: unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).clarity.q.push(args);
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clarity.q = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clarity('start');
    }

    // Google Tag Manager - Código simplificado
    if (gtmId && typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).dataLayer = (window as any).dataLayer || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
    }
  }, [facebookPixelId, clarityId, gtmId]);

  return (
    <>
      {/* Meta Pixel noscript fallback */}
      {facebookPixelId && (
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}

      {/* Google Tag Manager noscript fallback */}
      {gtmId && (
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
      )}
    </>
  );
}

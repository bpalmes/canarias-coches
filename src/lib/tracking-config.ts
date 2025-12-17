export const trackingConfig = {
  facebook: {
    pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1112511714254326',
  },
  clarity: {
    id: process.env.NEXT_PUBLIC_CLARITY_ID || 'sjw5c027i4',
  },
  gtm: {
    id: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-KFMJQSCW',
  },
} as const;

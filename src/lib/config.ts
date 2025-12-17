// Configuración compartida para el sistema de autenticación
export const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'miguel-leon-secret-key-2025-super-seguro';

// Configuración de cookies
export const COOKIE_CONFIG = {
  name: 'authToken',
  maxAge: 3600, // 1 hora
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

// Configuración de JWT
export const JWT_CONFIG = {
  expiresIn: '1h',
  algorithm: 'HS256' as const,
};

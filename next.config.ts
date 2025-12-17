/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Desactivar completamente la optimización de imágenes
    unoptimized: true,
    // Configuración más permisiva para imágenes externas
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'fotos.inventario.pro',
    ],
  },
};

export default nextConfig;

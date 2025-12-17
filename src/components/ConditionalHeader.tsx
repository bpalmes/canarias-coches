"use client";
import { usePathname } from 'next/navigation';
import Header from './Header';
import HeaderHome from './HeaderHome';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // No mostrar header en el área de admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // En la página de inicio usar HeaderHome (transparente que se vuelve sólido al hacer scroll)
  if (pathname === '/') {
    return <HeaderHome />;
  }

  // En el resto de páginas usar Header normal (azul)
  return <Header />;
}

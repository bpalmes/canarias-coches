"use client";
import Link from 'next/link';
import { Search, Globe, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function HeaderLanding() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 text-white p-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center h-12">
            <Image src="/logo_canariascoches_neg-01.svg" alt="CanariasCoches.com Logo" width={140} height={35} priority />
          </div>
        </Link>

        {/* Navigation (desktop) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/" className="hover:text-gray-300">Inicio</Link>
          <Link href="/buscador" className="hover:text-gray-300">Coches</Link>
          <Link href="/ofertas" className="hover:text-gray-300">Ofertas</Link>
          <Link href="/contact" className="hover:text-gray-300">Contacto</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-white/10">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 flex items-center gap-2 border border-white/20 px-3">
            <Globe className="h-5 w-5" />
            <span className="text-sm">EN</span>
          </button>
          {/* Mobile menu toggle */}
          <button className="p-2 rounded-full hover:bg-white/10 md:hidden" aria-label="Abrir menú" onClick={() => setIsOpen(v => !v)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          {/* Optional desktop icon */}
          <button className="hidden md:block p-2 rounded-full hover:bg-white/10">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden container mx-auto">
          <div className="mt-4 rounded-lg bg-white/90 text-black backdrop-blur shadow-lg overflow-hidden">
            <nav className="flex flex-col divide-y divide-gray-200">
              <Link href="/" className="px-5 py-4 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Inicio</Link>
              <Link href="/buscador" className="px-5 py-4 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Coches</Link>
              <Link href="/ofertas" className="px-5 py-4 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Ofertas</Link>
              <Link href="/contact" className="px-5 py-4 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Contacto</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

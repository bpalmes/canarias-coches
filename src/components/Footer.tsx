"use client"; // This directive marks the component as a Client Component

import { ChevronUp, Mail, Phone } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import CookieManager from './CookieManager';

const Footer = () => {
  return (
    <footer className="bg-[#0f286a] text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8 rounded-t-3xl">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Section: Logo & Contact Info */}
          <div className="md:col-span-4">
            <div className="mb-6">
              <Image src="/logo-200x50.png" alt="Avada Car Dealer Logo" width={200} height={50} />
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-bold text-white mb-1">Gran Canaria</h4>
                <p className="text-gray-400">Las Palmas, Telde, Carrizal y Vecindario</p>
                <p className="text-gray-400 flex items-center"><Phone size={12} className="mr-2"/> +34 928 22 23 24</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Tenerife</h4>
                <p className="text-gray-400">Sta Cruz de Tenerife y La Laguna</p>
                <p className="text-gray-400 flex items-center"><Phone size={12} className="mr-2"/> +34 822 22 23 33</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Lanzarote</h4>
                <p className="text-gray-400">Arrecife</p>
                <p className="text-gray-400 flex items-center"><Phone size={12} className="mr-2"/> +34 928 90 89 86</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Correo Electrónico</h4>
                <a href="mailto:info@miguelleon.es" className="text-gray-400 hover:text-white flex items-center">
                  <Mail size={12} className="mr-2"/> info@miguelleon.es
                </a>
              </div>
            </div>
          </div>

          {/* Middle Section: Links */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8 text-sm">
            <div>
              <h5 className="text-blue-300 font-bold text-xs mb-3 tracking-wider">OFERTAS</h5>
              <ul className="space-y-2">
                <li><Link href="/ofertas" className="hover:text-white">Ver Todas</Link></li>
                <li><Link href="/ofertas?tipo=nuevos" className="hover:text-white">Coches Nuevos</Link></li>
                <li><Link href="/ofertas?tipo=km0" className="hover:text-white">KM 0</Link></li>
                <li><Link href="/ofertas?tipo=segundamano" className="hover:text-white">Segunda Mano</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-blue-300 font-bold text-xs mb-3 tracking-wider">EMPRESA</h5>
              <ul className="space-y-2">
                <li><Link href="/condiciones-financiacion" className="hover:text-white">Financiación</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contacto</Link></li>
                <li><Link href="/buscador" className="hover:text-white">Buscador</Link></li>
                <li><Link href="/delegaciones" className="hover:text-white">Delegaciones</Link></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="text-gray-500 mb-4 sm:mb-0">&copy; {new Date().getFullYear()} Miguel Leon Automoción. Todos los derechos reservados.</p>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-400">
            <Link href="/politica-privacidad" className="hover:text-white">Política de Privacidad</Link>
            <Link href="/terminos-uso" className="hover:text-white">Términos de Uso</Link>
            <Link href="/aviso-legal" className="hover:text-white">Aviso Legal</Link>
            <CookieManager />
          </div>
        </div>

      </div>
      <div className="absolute right-8 -mt-16">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-blue-600 hover:bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <ChevronUp size={20} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, List, RefreshCw, Images, Users, Camera } from 'lucide-react';

const navLinks = [
  { href: '/admin', label: 'Panel de control', icon: LayoutDashboard },
  { href: '/admin/sync', label: 'Sincronizar Feed', icon: RefreshCw },
  { href: '/admin/manage-offers', label: 'Gestionar Ofertas', icon: List },
  { href: '/admin/manage-photos', label: 'Gestionar Fotos', icon: Images },
  { href: '/admin/leads', label: 'Gestión de Leads', icon: Users },
  { href: '/admin/gallery', label: 'Galería de Entregas', icon: Camera },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 bg-gray-900">
        <Image src="/logo-200x50.png" alt="MiguelLeón Logo" width={140} height={35} />
      </div>
      <nav className="flex-grow px-2 py-4">
        <ul>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 
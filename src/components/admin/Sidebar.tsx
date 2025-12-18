"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, List, RefreshCw, Images, Users, Camera, BadgeEuro, Briefcase, CarFront } from 'lucide-react';

const menuGroups = [
  {
    title: 'General',
    items: [
      { href: '/admin', label: 'Panel de control', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Inventario',
    items: [
      { href: '/admin/inventory', label: 'Gestor de Inventario', icon: CarFront },
      { href: '/admin/sync', label: 'Sincronizar Feed', icon: RefreshCw },
      { href: '/admin/manage-offers', label: 'Gestionar Ofertas', icon: List },
      { href: '/admin/manage-photos', label: 'Gestionar Fotos', icon: Images },
      { href: '/admin/gallery', label: 'Galería de Entregas', icon: Camera },
    ]
  },
  {
    title: 'Gestión',
    items: [
      { href: '/admin/leads', label: 'Gestión de Leads', icon: Users },
      { href: '/admin/financing', label: 'Financiación', icon: BadgeEuro },
      { href: '/admin/b2b/market', label: 'Mercado B2B', icon: Briefcase },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col h-screen overflow-y-auto">
      <div className="h-16 flex items-center justify-center px-4 bg-gray-900 border-b border-gray-700">
        <Image src="/logo_canariascoches_neg-01.svg" alt="CanariasCoches.com Logo" width={140} height={35} />
      </div>
      <nav className="flex-grow px-2 py-4">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map(({ href, label, icon: Icon }) => (
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
          </div>
        ))}
      </nav>
    </aside>
  );
}

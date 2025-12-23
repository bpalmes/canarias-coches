"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  List,
  RefreshCw,
  Images,
  Users,
  Camera,
  BadgeEuro,
  Briefcase,
  CarFront,
  Calculator,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isSuperAdmin?: boolean
  isImpersonating?: boolean
}

export default function Sidebar({ isSuperAdmin, isImpersonating }: SidebarProps) {
  const pathname = usePathname();

  // Show Super Admin tools ONLY if we are truly acting as Super Admin (not simulated)
  const showSuperAdminTools = isSuperAdmin && !isImpersonating;

  const menuGroups = [
    {
      title: '',
      items: [
        { href: '/admin', label: 'Panel de control', icon: LayoutDashboard },
      ]
    },
    ...(showSuperAdminTools ? [{
      title: 'Gestión de Compraventas',
      items: [
        { href: '/admin/financing-management', label: 'Gestionar Financiación', icon: BadgeEuro },
        { href: '/admin/products-management', label: 'Gestionar Productos', icon: Briefcase },
      ]
    }] : []),
    {
      title: 'Inventario',
      items: [
        { href: '/admin/inventory', label: 'Gestor de Inventario', icon: CarFront },
        // Conditionally add Calculator
        ...(showSuperAdminTools ? [{ href: '/admin/calculator', label: 'Calculadora Financiera', icon: Calculator }] : []),
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

  return (
    <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
        <Image
          src="/logo_canariascoches-01.svg"
          alt="CanariasCoches.com Logo"
          width={150}
          height={40}
          className="w-auto h-8"
        />
      </div>

      {/* Scrollable Nav */}
      <nav className="flex-1 flex flex-col overflow-y-auto px-4 py-6 gap-y-8">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            {group.title && (
              <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
            )}
            <ul className="space-y-1">
              {group.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      className={cn(
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <Icon
                        className={cn(
                          'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150',
                          isActive
                            ? 'text-indigo-600'
                            : 'text-gray-400 group-hover:text-gray-500'
                        )}
                        aria-hidden="true"
                      />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / Settings */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <Link
          href="/admin/settings"
          className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Configuración
        </Link>
        {/* Placeholder for User Profile if needed, matching the image "Tom Cook" style */}
        {/* 
        <div className="mt-4 flex items-center px-2">
          <div className="flex-shrink-0">
             <img className="h-8 w-8 rounded-full" src="..." alt="" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Usuario Admin</p>
            <p className="text-xs font-medium text-gray-500">View Profile</p>
          </div>
        </div> 
       */}
      </div>
    </aside>
  );
}

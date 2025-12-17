"use client";
import withAuth from '@/components/withAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Users, 
  Car, 
  FileText, 
  Settings, 
  BarChart3, 
  Upload,
  Eye,
  UserPlus,
  Megaphone,
  Images
} from 'lucide-react';

function AdminDashboard() {
  const modules = [
    {
      title: 'Gestión de Usuarios',
      description: 'Crear, editar y administrar usuarios del sistema',
      href: '/admin/manage-users',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Gestión de Ofertas',
      description: 'Crear y administrar ofertas promocionales',
      href: '/admin/manage-offers',
      icon: Megaphone,
      color: 'bg-green-500',
    },
    {
      title: 'Gestión de Coches',
      description: 'Administrar el inventario de vehículos',
      href: '/admin/manage-photos',
      icon: Car,
      color: 'bg-purple-500',
    },
    {
      title: 'Leads y Contactos',
      description: 'Gestionar leads y consultas de clientes',
      href: '/admin/leads',
      icon: FileText,
      color: 'bg-orange-500',
    },
    {
      title: 'Galería de Entregas',
      description: 'Gestionar imágenes del carrusel "Entregas que Apasionan"',
      href: '/admin/gallery',
      icon: Images,
      color: 'bg-pink-500',
    },
    {
      title: 'Importar Datos',
      description: 'Importar coches desde CSV o URLs',
      href: '/admin/upload-csv',
      icon: Upload,
      color: 'bg-indigo-500',
    },
    {
      title: 'Sincronización',
      description: 'Sincronizar datos con sistemas externos',
      href: '/admin/sync',
      icon: Settings,
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona todos los aspectos del sistema desde aquí</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const IconComponent = module.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${module.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                <Link href={module.href}>
                  <Button className="w-full" variant="outline">
                    Acceder
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Estadísticas rápidas */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Car className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Coches</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Megaphone className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ofertas</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Leads</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminDashboard);




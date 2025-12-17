import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Car, Phone, Mail, FileText, Info, Building } from 'lucide-react';

export default function ProcesoCompraTasacionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Car className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Proceso de Compra-Tasación
          </h1>
          <p className="text-lg text-gray-600">
            Cómo vendemos tu vehículo en Grupo Miguel León S.L.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Proceso transparente y profesional para la tasación de tu coche
          </p>
        </div>

        {/* Introducción */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Introducción al Proceso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              A continuación pasamos a detallar cómo es el proceso de compra-tasación de un vehículo por parte del Grupo Miguel León S.L.
            </p>
            <p className="text-gray-700">
              Hay dos formas de que el cliente se pueda poner en contacto con el Grupo Miguel León S.L para que procedamos a la compra-tasación 
              de los coches que los clientes estén interesados en que nuestro grupo le compre su vehículo.
            </p>
          </CardContent>
        </Card>

        {/* Opción 1: A través de la web */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              1. A través de nuestra web
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Enlace de contacto:</h4>
                <p className="text-blue-800 text-sm mb-2">
                  Dentro del siguiente link{' '}
                  <a href="https://miguelleon.es/compramos-tu-coche.php" className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    https://miguelleon.es/compramos-tu-coche.php
                  </a>, nos puedes enviar los datos del coche, sus fotos y documentación para proceder a comenzar el proceso.
                </p>
                <p className="text-blue-800 text-sm">
                  Aquí deberás de adjuntar las fotos y documentación que se te requiere.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Proceso de contacto:</h4>
                <p className="text-green-800 text-sm mb-2">
                  Ese email lo recibirá nuestro responsable de compras. El emplazará al cliente vía teléfono, WhatsApp o llamada 
                  a una visita a uno de nuestros puntos de ventas en Canarias.
                </p>
                <p className="text-green-800 text-sm">
                  Tenemos 6 concesionarios: 4 en Gran Canaria (Las Palmas-Miller / Telde / Carrizal y Vecindario), 
                  1 en Tenerife (Los Majuelos) y en Lanzararte (Arrecife).
                </p>
                <div className="mt-2">
                  <a href="https://miguelleon.es/ubicaciones.html" className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    Ver ubicaciones →
                  </a>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Revisión y tasación:</h4>
                <p className="text-yellow-800 text-sm mb-2">
                  En esa visita nuestros profesionales revisarán el coche de mecánica, chapa y pintura. 
                  Este proceso lo podemos realizar en menos de <strong>29 minutos</strong> y en el plazo de <strong>24-48 horas</strong>.
                </p>
                <p className="text-yellow-800 text-sm">
                  Le darán una tasación al cliente o una desestimación de la compra por escrito (vía email o WhatsApp) 
                  o por llamada de teléfono, o incluso en innumerable ocasiones directamente en persona.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Finalización del proceso:</h4>
                <p className="text-purple-800 text-sm">
                  Una vez aceptada la tasación, habrá un proceso documental y de firma de documentos para proceder 
                  a la transferencia del dinero acordado con el cliente en el caso de aceptar la tasación.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opción 2: En tiendas físicas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" />
              2. Proceso tasación – compra en las tiendas físicas de Miguel León
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Nuestros concesionarios:</h4>
                <p className="text-green-800 text-sm mb-2">
                  Tenemos 6 concesionarios: 4 en Gran Canaria (Las Palmas-Miller / Telde / Carrizal y Vecindario), 
                  1 en Tenerife (Los Majuelos) y en Lanzararte (Arrecife).
                </p>
                <p className="text-green-800 text-sm">
                  El cliente puede acudir con su vehículo y con la documentación (ficha técnica y permiso de circulación) 
                  a cualquiera de nuestras tiendas.
                </p>
                <div className="mt-2">
                  <a href="https://miguelleon.es/ubicaciones.html" className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    Ver ubicaciones →
                  </a>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Mismo proceso de revisión:</h4>
                <p className="text-blue-800 text-sm">
                  En esa visita nuestros profesionales revisarán el coche de mecánica, chapa y pintura. 
                  Este proceso lo podemos realizar en menos de <strong>29 minutos</strong> y en el plazo de <strong>24-48 horas</strong>.
                </p>
                <p className="text-blue-800 text-sm">
                  Le darán una tasación al cliente o una desestimación de la compra por escrito (vía email o WhatsApp) 
                  o por llamada de teléfono, o incluso en innumerable ocasiones directamente en persona.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600" />
              Contacto y Responsable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Siempre nuestro personal estará a su disposición en los siguientes datos de contacto:
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Santiago Casanova</p>
                    <p className="text-sm text-gray-600">Persona responsable</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">638 909 878</p>
                    <p className="text-sm text-gray-600">Teléfono de contacto</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">santiagocasanova@miguelleon.es</p>
                    <p className="text-sm text-gray-600">Email de contacto</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enlaces a otras secciones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Más información sobre nuestros servicios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Reserva de Vehículo</h4>
                <p className="text-green-800 text-sm mb-3">
                  Información sobre nuestro servicio de reserva de vehículos y condiciones.
                </p>
                <a href="/reserva-vehiculo" className="text-blue-600 hover:underline font-medium">
                  Ver detalles →
                </a>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Condiciones de Financiación</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Ofertas y condiciones de financiación para la compra de vehículos.
                </p>
                <a href="/condiciones-financiacion" className="text-blue-600 hover:underline font-medium">
                  Ver detalles →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Para más información sobre el proceso de compra-tasación, 
            contacta con Santiago Casanova en santiagocasanova@miguelleon.es
          </p>
          <p className="mt-2">
            También puedes visitar cualquiera de nuestros 6 concesionarios en Canarias.
          </p>
        </div>
      </div>
    </div>
  );
}

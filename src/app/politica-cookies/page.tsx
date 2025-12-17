import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Cookie, Info, Settings, AlertTriangle, Building, Mail, Phone } from 'lucide-react';

export default function PoliticaCookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Cookie className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política de Cookies
          </h1>
          <p className="text-lg text-gray-600">
            Información detallada sobre el uso de cookies en nuestro sitio web
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Última actualización: Diciembre 2023
          </p>
        </div>

        {/* Información de la empresa */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Información de la Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Grupo Miguel León S.L.</p>
                  <p className="text-sm text-gray-600">Denominación Social</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">info@miguelleon.es</p>
                  <p className="text-sm text-gray-600">Email principal</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">928 222 324</p>
                  <p className="text-sm text-gray-600">Teléfono de contacto</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ¿Qué son las cookies? */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              ¿Qué son las Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tablet, smartphone) 
              cuando visita un sitio web. Estas cookies permiten que el sitio web recuerde sus acciones y preferencias 
              durante un período de tiempo, para que no tenga que volver a introducirlos cada vez que visite el sitio.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Funciones principales de las cookies:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Recordar sus preferencias y configuraciones</li>
                <li>• Analizar cómo utiliza nuestro sitio web</li>
                <li>• Mejorar la funcionalidad y experiencia del usuario</li>
                <li>• Proporcionar contenido personalizado</li>
                <li>• Garantizar la seguridad del sitio web</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de cookies que utilizamos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Tipos de Cookies que Utilizamos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cookies necesarias */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">🍪 Cookies Necesarias</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Siempre activas</span>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                Estas cookies son esenciales para el funcionamiento del sitio web y no se pueden desactivar.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-green-800 mb-2">Incluyen:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Cookies de sesión para mantener su sesión activa</li>
                  <li>• Cookies de seguridad para proteger contra ataques</li>
                  <li>• Cookies de autenticación para áreas restringidas</li>
                  <li>• Cookies de funcionalidad básica del sitio</li>
                </ul>
              </div>
            </div>

            {/* Cookies analíticas */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">📊 Cookies Analíticas</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Opcionales</span>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                Nos ayudan a entender cómo interactúa con nuestro sitio web para mejorar la experiencia del usuario.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">Recopilan información sobre:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Páginas visitadas y tiempo de permanencia</li>
                  <li>• Enlaces en los que hace clic</li>
                  <li>• Dispositivo y navegador utilizado</li>
                  <li>• Rendimiento del sitio web</li>
                </ul>
              </div>
            </div>

            {/* Cookies de marketing */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">🎯 Cookies de Marketing</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Opcionales</span>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                Utilizadas para mostrar publicidad relevante y personalizada basada en sus intereses.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">Funciones:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Anuncios personalizados</li>
                  <li>• Seguimiento de campañas publicitarias</li>
                  <li>• Análisis de efectividad del marketing</li>
                  <li>• Remarketing y retargeting</li>
                </ul>
              </div>
            </div>

            {/* Cookies de preferencias */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">⚙️ Cookies de Preferencias</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Opcionales</span>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                Almacenan sus configuraciones y preferencias para personalizar su experiencia.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">Almacenan:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Idioma preferido</li>
                  <li>• Región o ubicación</li>
                  <li>• Configuraciones de accesibilidad</li>
                  <li>• Preferencias de visualización</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies de terceros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Cookies de Terceros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Nuestro sitio web puede utilizar servicios de terceros que también instalan cookies. 
              Estas cookies son gestionadas por los proveedores de servicios externos.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Servicios de terceros que utilizamos:</h4>
              <ul className="text-orange-700 text-sm space-y-2">
                <li>
                  <strong>Google Analytics:</strong> Para análisis del tráfico web y comportamiento de usuarios
                </li>
                <li>
                  <strong>Google Ads:</strong> Para publicidad personalizada y seguimiento de campañas
                </li>
                <li>
                  <strong>Facebook Pixel:</strong> Para publicidad dirigida en redes sociales
                </li>
                <li>
                  <strong>YouTube:</strong> Para la reproducción de videos embebidos
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Importante:</h4>
              <p className="text-blue-800 text-sm">
                Las cookies de terceros solo se instalarán si usted ha dado su consentimiento explícito. 
                Puede gestionar estas preferencias en cualquier momento a través de nuestro gestor de cookies.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Duración de las cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Duración de las Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Cookies de Sesión</h4>
                <p className="text-green-700 text-sm">
                  Se eliminan automáticamente cuando cierra el navegador
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Cookies Persistentes</h4>
                <p className="text-yellow-700 text-sm">
                  Permanecen en su dispositivo hasta que expiran o las elimina manualmente
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Cookies de Terceros</h4>
                <p className="text-blue-700 text-sm">
                  La duración la determina cada proveedor de servicio externo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gestión de cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Cómo Gestionar las Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Usted tiene control total sobre las cookies que se instalan en su dispositivo. 
              Puede gestionarlas de varias maneras:
            </p>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">1. A través de nuestro sitio web:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Utilice nuestro gestor de cookies en el footer</li>
                  <li>• Configure sus preferencias en el banner de cookies</li>
                  <li>• Modifique sus opciones en cualquier momento</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">2. Configuración del navegador:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Chrome: Configuración → Privacidad y seguridad → Cookies</li>
                  <li>• Firefox: Opciones → Privacidad y seguridad → Cookies</li>
                  <li>• Safari: Preferencias → Privacidad → Cookies</li>
                  <li>• Edge: Configuración → Cookies y permisos del sitio</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">3. Herramientas de terceros:</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Extensiones del navegador para gestión de cookies</li>
                  <li>• Software de limpieza de cookies</li>
                  <li>• Herramientas de privacidad online</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consecuencias de desactivar cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Consecuencias de Desactivar Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Cookies Necesarias (No se pueden desactivar):</h4>
                <p className="text-red-800 text-sm">
                  Si intenta desactivar las cookies necesarias, el sitio web no funcionará correctamente. 
                  No podrá acceder a áreas restringidas, mantener su sesión activa o utilizar funciones básicas.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Cookies Opcionales:</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• <strong>Analíticas:</strong> No podremos mejorar la experiencia del usuario</li>
                  <li>• <strong>Marketing:</strong> Verá anuncios menos relevantes</li>
                  <li>• <strong>Preferencias:</strong> El sitio no recordará sus configuraciones</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Recomendación:</h4>
                <p className="text-green-800 text-sm">
                  Le recomendamos mantener activas las cookies necesarias y analíticas para disfrutar de la mejor experiencia posible. 
                  Las cookies de marketing y preferencias son completamente opcionales.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actualizaciones de la política */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Actualizaciones de esta Política
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Esta política de cookies puede ser actualizada periódicamente para reflejar cambios en nuestras prácticas 
              o por otras razones operativas, legales o reglamentarias.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Notificación de cambios:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Los cambios se publicarán en esta página</li>
                <li>• La fecha de &quot;Última actualización&quot; se modificará</li>
                <li>• Se le notificará a través del banner de cookies si es necesario</li>
                <li>• Su uso continuado del sitio constituye aceptación de los cambios</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Contacto y Consultas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Si tiene alguna pregunta sobre nuestra política de cookies o desea ejercer sus derechos, 
              puede contactar con nosotros:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Información General:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">info@miguelleon.es</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">928 222 324</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Protección de Datos:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-600" />
                    <span className="text-green-800">atencionalcliente@miguelleon.es</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="text-green-800">928 222 324 ext. 2000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Autoridad de Control:</h4>
              <p className="text-yellow-800 text-sm">
                También puede presentar una reclamación ante la 
                <a href="https://www.agpd.es" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  Agencia Española de Protección de Datos (AEPD)
                </a> si considera que el tratamiento de sus datos no se ajusta a la normativa vigente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Para cualquier consulta sobre nuestra política de cookies, 
            contacta con nosotros en info@miguelleon.es
          </p>
          <p className="mt-2">
            Recuerde que puede gestionar sus preferencias de cookies en cualquier momento 
            utilizando nuestro gestor de cookies disponible en el footer del sitio web.
          </p>
        </div>
      </div>
    </div>
  );
}

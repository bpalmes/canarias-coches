import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Shield, Copyright, Building, Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';

export default function TerminosUsoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Términos de Uso
          </h1>
          <p className="text-lg text-gray-600">
            Condiciones y términos legales para el uso de nuestro sitio web
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
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">C/ Alfredo Martín Reyes, 7</p>
                  <p className="text-sm text-gray-600">Las Palmas de Gran Canaria</p>
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

        {/* Propiedad intelectual */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copyright className="h-5 w-5 text-blue-600" />
              DERECHOS DE PROPIEDAD INTELECTUAL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
                             Grupo Miguel Leon S.L es titular de todos los derechos de autor, propiedad intelectual, industrial, &quot;know how&quot; y cuantos otros 
              derechos guardan relación con los contenidos del sitio web 
              <a href="https://www.miguelleon.es" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                https://www.miguelleon.es
              </a> y los servicios ofertados en el mismo, así como de los programas necesarios para su implementación y la información relacionada.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Restricciones de Uso:</h4>
              <p className="text-red-800 text-sm">
                No se permite la reproducción, copia, publicación y/o uso no estrictamente privado de los contenidos, totales o parciales, 
                del sitio web https://www.miguelleon.es sin el consentimiento previo y por escrito.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Contenidos Protegidos:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Textos y contenido editorial</li>
                <li>• Imágenes y fotografías</li>
                <li>• Logotipos y marcas comerciales</li>
                <li>• Diseño y estructura del sitio web</li>
                <li>• Código fuente y programas</li>
                <li>• Base de datos y contenido multimedia</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Condiciones de uso */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Condiciones de Uso del Sitio Web
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Al acceder y utilizar este sitio web, usted acepta estar sujeto a los siguientes términos y condiciones de uso. 
              Si no está de acuerdo con alguna parte de estos términos, le recomendamos que no utilice nuestro sitio web.
            </p>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Uso Permitido:</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Navegar y consultar información del sitio web</li>
                  <li>• Utilizar los servicios ofrecidos de manera legítima</li>
                  <li>• Contactar con nosotros a través de los formularios disponibles</li>
                  <li>• Acceder a información sobre nuestros productos y servicios</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Uso Prohibido:</h4>
                <ul className="text-red-800 text-sm space-y-1">
                  <li>• Copiar, reproducir o distribuir contenido sin autorización</li>
                  <li>• Modificar o alterar el contenido del sitio web</li>
                  <li>• Utilizar el sitio para fines ilegales o fraudulentos</li>
                  <li>• Intentar acceder a áreas restringidas del sistema</li>
                  <li>• Transmitir virus o código malicioso</li>
                  <li>• Realizar ataques de denegación de servicio</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsabilidades */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Responsabilidades y Limitaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Responsabilidad del Usuario:</h4>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• Utilizar el sitio web de manera responsable y legal</li>
                  <li>• Proporcionar información veraz en los formularios</li>
                  <li>• Respetar los derechos de propiedad intelectual</li>
                  <li>• No interferir en el funcionamiento del sitio</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Limitación de Responsabilidad:</h4>
                <p className="text-blue-800 text-sm">
                  Grupo Miguel León S.L. no se hace responsable de los daños directos, indirectos, incidentales o consecuentes 
                  que puedan derivarse del uso o la imposibilidad de usar el sitio web, incluyendo pero no limitándose a pérdida 
                  de datos, interrupciones del servicio o errores técnicos.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Disponibilidad del Servicio:</h4>
                <p className="text-green-800 text-sm">
                  Nos esforzamos por mantener el sitio web disponible 24/7, pero no garantizamos la disponibilidad ininterrumpida. 
                  Nos reservamos el derecho de realizar mantenimiento, actualizaciones o modificaciones que puedan afectar temporalmente 
                  la accesibilidad del sitio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enlaces externos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Enlaces Externos y Terceros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Nuestro sitio web puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan únicamente 
              para su conveniencia y no implican nuestra aprobación o respaldo del contenido de esos sitios.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Advertencia:</h4>
              <p className="text-orange-800 text-sm">
                No somos responsables del contenido, políticas de privacidad o prácticas de sitios web de terceros. 
                Le recomendamos revisar los términos y condiciones de cualquier sitio web al que acceda desde nuestro sitio.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Modificaciones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Modificaciones de los Términos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Nos reservamos el derecho de modificar estos términos de uso en cualquier momento. Los cambios entrarán en vigor 
              inmediatamente después de su publicación en el sitio web.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Notificación de Cambios:</h4>
              <p className="text-blue-800 text-sm">
                Le recomendamos revisar periódicamente esta página para estar al tanto de cualquier cambio en los términos de uso. 
                Su uso continuado del sitio web después de la publicación de cambios constituye su aceptación de los nuevos términos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ley aplicable */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Ley Aplicable y Jurisdicción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Estos términos de uso se rigen e interpretan de acuerdo con las leyes españolas. Cualquier disputa que pueda 
              surgir en relación con estos términos o el uso del sitio web estará sujeta a la jurisdicción exclusiva de 
              los tribunales españoles.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Resolución de Disputas:</h4>
              <p className="text-green-800 text-sm">
                En caso de cualquier controversia, nos comprometemos a intentar resolverla de manera amistosa. 
                Si no es posible llegar a un acuerdo, la disputa será resuelta por los tribunales competentes 
                en Las Palmas de Gran Canaria, España.
              </p>
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
              Si tiene alguna pregunta o consulta sobre estos términos de uso, puede contactar con nosotros a través de los siguientes medios:
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
                <h4 className="font-semibold text-green-800 mb-2">Atención al Cliente:</h4>
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
              <h4 className="font-semibold text-yellow-800 mb-2">Dirección Postal:</h4>
              <p className="text-yellow-800 text-sm">
                C/ Alfredo Martín Reyes, 7<br />
                Las Palmas de Gran Canaria<br />
                Las Palmas, España
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Para cualquier consulta sobre estos términos de uso, 
            contacta con nosotros en info@miguelleon.es
          </p>
          <p className="mt-2">
            Estos términos están sujetos a cambios. Consulte esta página regularmente para mantenerse informado.
          </p>
        </div>
      </div>
    </div>
  );
}

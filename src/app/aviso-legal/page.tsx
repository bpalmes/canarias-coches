import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Shield, Copyright, Building, Mail, Phone, MapPin, Info, ShoppingCart, Database } from 'lucide-react';

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Aviso Legal
          </h1>
          <p className="text-lg text-gray-600">
            Información legal y condiciones de uso del sitio web
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Última actualización: Diciembre 2023
          </p>
        </div>

        {/* Introducción */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Introducción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              <strong>Grupo Miguel León SL</strong>, responsable del sitio web, en adelante RESPONSABLE, pone a disposición de los usuarios el presente documento, 
              con el que pretende dar cumplimiento a las obligaciones dispuestas en la 
              <strong>Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE)</strong>, 
              BOE Nº 166, así como informar a todos los usuarios del sitio web respecto a cuáles son las condiciones de uso.
            </p>
            
            <p className="text-gray-700">
              Toda persona que acceda a este sitio web asume el papel de usuario, comprometiéndose a la observancia y cumplimiento riguroso 
              de las disposiciones aquí dispuestas, así como a cualquier otra disposición legal que fuera de aplicación.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Reserva de Derechos:</h4>
              <p className="text-yellow-800 text-sm">
                Grupo Miguel León SL se reserva el derecho de modificar cualquier tipo de información que pudiera aparecer en el sitio web, 
                sin que exista obligación de preavisar o poner en conocimiento de los usuarios dichas obligaciones, entendiéndose como suficiente 
                con la publicación en el sitio web de Grupo Miguel León SL.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Datos identificativos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              DATOS IDENTIFICATIVOS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">http://miguelleon.es</p>
                    <p className="text-sm text-gray-600">Nombre de dominio</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Miguel León</p>
                    <p className="text-sm text-gray-600">Nombre comercial</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Grupo Miguel León SL</p>
                    <p className="text-sm text-gray-600">Denominación social</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">B76233865</p>
                    <p className="text-sm text-gray-600">NIF</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">C/ Callejón del Castillo, 215</p>
                    <p className="text-sm text-gray-600">Calero Alto, Telde</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">928222324</p>
                    <p className="text-sm text-gray-600">Teléfono</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">info@miguelleon.es</p>
                    <p className="text-sm text-gray-600">Email</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Registro Mercantil:</h4>
              <p className="text-blue-800 text-sm mb-2">
                De acuerdo con el código de comercio 6 y del reglamento del Registro Mercantil, se ha procedido a la inscripción 
                con fecha de 9 de Octubre de 2015, en la presente nota en el Registro Mercantil de Las Palmas de Gran Canaria:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                <div>
                  <span className="font-medium">Tomo:</span> 2121
                </div>
                <div>
                  <span className="font-medium">Libro:</span> 0
                </div>
                <div>
                  <span className="font-medium">Folio:</span> 174
                </div>
                <div>
                  <span className="font-medium">Hoja:</span> GC-50196
                </div>
                <div>
                  <span className="font-medium">Inscripción:</span> 1º
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Derechos de propiedad intelectual */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copyright className="h-5 w-5 text-blue-600" />
              DERECHOS DE PROPIEDAD INTELECTUAL E INDUSTRIAL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              El sitio web, incluyendo a título enunciativo pero no limitativo su programación, edición, compilación y demás elementos 
              necesarios para su funcionamiento, los diseños, logotipos, texto y/o gráficos, son propiedad del RESPONSABLE o, 
              si es el caso, dispone de licencia o autorización expresa por parte de los autores.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Protección Legal:</h4>
              <p className="text-green-800 text-sm">
                Todos los contenidos del sitio web se encuentran debidamente protegidos por la normativa de propiedad intelectual e industrial, 
                así como inscritos en los registros públicos correspondientes.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Restricciones de Uso:</h4>
              <p className="text-red-800 text-sm">
                Independientemente de la finalidad para la que fueran destinados, la reproducción total o parcial, uso, explotación, 
                distribución y comercialización, requiere en todo caso de la autorización escrita previa por parte del RESPONSABLE. 
                Cualquier uso no autorizado previamente se considera un incumplimiento grave de los derechos de propiedad intelectual 
                o industrial del autor.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Contenidos de Terceros:</h4>
              <p className="text-blue-800 text-sm">
                Los diseños, logotipos, texto y/o gráficos ajenos al RESPONSABLE y que pudieran aparecer en el sitio web, 
                pertenecen a sus respectivos propietarios, siendo ellos mismos responsables de cualquier posible controversia 
                que pudiera suscitarse respecto a los mismos.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Reconocimiento de Derechos:</h4>
              <p className="text-yellow-800 text-sm">
                El RESPONSABLE reconoce a favor de sus titulares los correspondientes derechos de propiedad intelectual e industrial, 
                no implicando su sola mención o aparición en el sitio web la existencia de derechos o responsabilidad alguna sobre los mismos, 
                como tampoco respaldo, patrocinio o recomendación por parte del mismo.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Reporte de Incumplimientos:</h4>
              <p className="text-orange-800 text-sm">
                Para realizar cualquier tipo de observación respecto a posibles incumplimientos de los derechos de propiedad intelectual 
                o industrial, así como sobre cualquiera de los contenidos del sitio web, puede hacerlo a través del correo electrónico{' '}
                <a href="mailto:info@miguelleon.es" className="text-blue-600 hover:underline">info@miguelleon.es</a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Exención de responsabilidades */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              EXENCIÓN DE RESPONSABILIDADES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                El RESPONSABLE se exime de cualquier tipo de responsabilidad derivada de la información publicada en su sitio web 
                siempre que esta información haya sido manipulada o introducida por un tercero ajeno al mismo.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contenido de la web y enlaces */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              CONTENIDO DE LA WEB Y ENLACES (LINKS)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Derechos de Modificación:</h4>
                <p className="text-yellow-800 text-sm">
                  Grupo Miguel León SL se reserva el derecho a actualizar, modificar o eliminar la información contenida en sus páginas web 
                  pudiendo incluso limitar o no permitir el acceso a dicha información a ciertos usuarios.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Responsabilidad de Enlaces Externos:</h4>
                <p className="text-red-800 text-sm">
                  Grupo Miguel León SL no asume responsabilidad alguna por la información contenida en páginas web de terceros a las que 
                  se pueda acceder por &quot;links&quot; o enlaces desde cualquier página web propiedad de Grupo Miguel León SL
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Finalidad de los Enlaces:</h4>
                <p className="text-blue-800 text-sm">
                  La presencia de &quot;links&quot; o enlaces en las páginas web de Grupo Miguel León SL tiene finalidad meramente informativa 
                  y en ningún caso supone sugerencia, invitación o recomendación sobre los mismos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ventas online */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              VENTAS ONLINE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Derecho de Desistimiento:</h4>
                <p className="text-green-800 text-sm">
                  En relación a las ventas digitales, a diferencia de las compras presenciales, cuando la compra se realiza a distancia 
                  (compras por teléfono, compras por internet, etc.) el comprador tiene derecho de desistir de la compra en el plazo de 
                  <strong>14 días naturales</strong> (o más si lo establece el vendedor) desde que recibió el producto comprado, 
                  sin penalización alguna (salvo el coste de la devolución de la mercancía comprada y su preparación) y sin tener que alegar causa.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Condiciones de Devolución:</h4>
                <p className="text-blue-800 text-sm">
                  En la devolución del producto la obligación del cliente es devolverlo en perfectas condiciones de Chapa, Pintura, 
                  Limpieza y Mecánica como se le hizo en la entrega (aportar papel de recogida firmado por parte del cliente). 
                  En el caso de que hubiera cualquier desperfecto al respecto, el cliente deberá de abonar dicha factura a la concesionaria.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Garantía para Profesionales:</h4>
                <p className="text-yellow-800 text-sm">
                  Con respecto a la garantía, todo aquellos vehículos vendidos para profesionales o autónomos, tendrán una garantía oficial de{' '}
                  <strong>6 Meses</strong>.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Horario de Llamadas Comerciales:</h4>
                <p className="text-orange-800 text-sm">
                  De acuerdo con la Ley General de Telecomunicaciones, la Ley establece que las llamadas comerciales serán de lunes a viernes 
                  en horario de <strong>9.00 A.M a 21.00 P.M.</strong>, y que los fines de semana solo se podrán poner en contacto con el cliente 
                  salvo autorización de este o consulta comercial por parte del cliente hacia el establecimiento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RGPD específico */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              RGPD ESPECÍFICO PARA TRATAMIENTO DE DATOS DIGITALES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              RGPD especifica para el tratamiento de los datos que obtenemos digitalmente a través de nuestra web miguelleon.es directamente 
              o derivados de diferentes market place como coches.net - coches.com - Sumauto, etc.
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">1. Información Usuarios</h4>
                <p className="text-blue-800 text-sm">
                  En Miguel León S.L. estamos especialmente sensibilizados con la protección de datos de los USUARIOS de los servicios 
                  a los que pueden acceder a través de nuestra página web. Según lo dispuesto en el Reglamento (UE) 2016/679, de 27 de abril (RGPD) 
                  y en la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos y Garantía de Derechos Digitales (LOPDGDD), 
                  mediante la presente Política de Privacidad (en adelante Política), Miguel León S.L. informa a los USUARIOS del sitio web: 
                  miguelleon.es es la responsable del tratamiento y usos que a los que se someten los datos de carácter personal que se recaban 
                  en la web, con la finalidad de comercializar sus coches e intercambiar Datos con los clientes interesados a través de nuestra 
                  plataforma de contacto vía email, llamada o WhatsApp y que al aceptar la presente Política, el USUARIO acepta el tratamiento 
                  de sus datos en los términos definidos en ella.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">2. Contacto</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Denominación Social:</strong> Grupo Miguel León S.L.</div>
                  <div><strong>Nombre comercial:</strong> Miguel León</div>
                  <div><strong>Domicilio:</strong> Calle Alfredo Martín Reyes, 7</div>
                  <div><strong>Email:</strong> info@miguelleon.es</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">3. Finalidades del Tratamiento</h4>
                <p className="text-yellow-800 text-sm mb-2">
                  Le informamos que los datos que nos facilite por la página web serán incorporados a un fichero titularidad de Grupo Miguel Leon S.L. 
                  Tratará la información que nos proporcione con las siguientes finalidades:
                </p>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• Gestionar solicitudes, sugerencias, comentarios o peticiones sobre nuestros servicios profesionales.</li>
                  <li>• Comunicaciones comerciales para facilitar información sobre actividades, artículos de interés e información general sobre nuestros servicios vía correo electrónico.</li>
                  <li>• Remisión de newsletters que puedan resultar de interés al usuario.</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">4. Legitimación</h4>
                <p className="text-blue-800 text-sm">
                  La base legal para el tratamiento de los datos es el consentimiento de los USUARIOS para la tramitación y gestión de cualquier 
                  solicitud de información o consulta sobre nuestros servicios, así como para el envío de comunicaciones comerciales llevadas 
                  a cabo por Grupo Miguel León S.L.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">5. Cómo Obtenemos Sus Datos</h4>
                <p className="text-purple-800 text-sm mb-2">
                  Grupo Miguel León S.L. obtiene sus datos por las siguientes fuentes:
                </p>
                <ul className="text-purple-800 text-sm space-y-1">
                  <li>• Información facilitada por los USUARIOS.</li>
                  <li>• Los datos que tratamos incluyen las siguientes categorías: datos de carácter identificativo.</li>
                  <li>• También recogemos de forma automática datos sobre su visita a nuestro sitio web según se describe en la política de cookies.</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">6. Tiempo de Conservación de los Datos</h4>
                <p className="text-orange-800 text-sm mb-2">
                  Trataremos sus datos personales mientras sean necesarios para la finalidad para la cual fueron recabados. Si cancela todos los contratos, usted podrá:
                </p>
                <ul className="text-orange-800 text-sm space-y-1">
                  <li>• <strong>Mantener el consentimiento</strong> para desarrollar acciones comerciales: trataremos sus datos para las acciones comerciales que haya consentido.</li>
                  <li>• <strong>Revocar el consentimiento</strong> para desarrollar acciones comerciales: cancelaremos sus datos mediante el bloqueo de los mismos.</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">7. Destinatarios</h4>
                <p className="text-red-800 text-sm mb-2">
                  No se ceden datos de carácter personal a terceros, salvo disposición legal. Tampoco se realizan transferencias internacionales 
                  de datos a terceros países.
                </p>
                <p className="text-red-800 text-sm">
                  Como encargados del tratamiento, Grupo Miguel León S.L. tiene contratados a los siguientes proveedores de servicios:
                </p>
                <ul className="text-red-800 text-sm space-y-1 mt-2">
                  <li>• Web Las Palmas</li>
                  <li>• Abaco System</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">8. Derechos</h4>
                <p className="text-green-800 text-sm mb-2">
                  En relación al tratamiento de sus datos personales, puede ponerse en contacto con Grupo Miguel León S.L. en cualquier momento para:
                </p>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Ejercer sus derechos de acceso, rectificación y supresión.</li>
                  <li>• Ejercer sus derechos de limitación del tratamiento.</li>
                  <li>• Oponerse al tratamiento de sus datos personales.</li>
                  <li>• Retirar el consentimiento otorgado en cualquier momento.</li>
                </ul>
                <p className="text-green-800 text-sm mt-2">
                  Puede ejercer estos derechos enviando comunicación a{' '}
                  <a href="mailto:atenciondelcliente@miguelleon.es" className="text-blue-600 hover:underline">
                    atenciondelcliente@miguelleon.es
                  </a>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">9. Actualizaciones y Modificaciones</h4>
                <p className="text-blue-800 text-sm">
                  Grupo Miguel León S.L. se reserva el derecho de modificar y/o actualizar la información sobre protección de datos cuando sea necesario 
                  para el correcto cumplimiento del Reglamento de Protección de Datos. Si se produjera alguna modificación, el nuevo texto será publicado 
                  en esta página, donde podrá tener acceso a la política actual.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurador Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              CONFIGURADOR COOKIES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Esta página web usa cookies. Las cookies de este sitio web se usan para personalizar el contenido y los anuncios, 
              ofrecer funciones de redes sociales y analizar el tráfico. Además, compartimos información sobre el uso que haga del sitio web 
              con nuestros partners de redes sociales, publicidad y análisis web, quienes pueden combinarla con otra información que les haya 
              proporcionado o que hayan recopilado a partir del uso que haya hecho de sus servicios.
            </p>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Cookies Necesarias (2)</h4>
                <p className="text-green-800 text-sm mb-2">
                  Las cookies necesarias ayudan a hacer una página web utilizable activando funciones básicas como la navegación en la página 
                  y el acceso a áreas seguras de la página web. La página web no puede funcionar adecuadamente sin estas cookies.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-2 rounded border">
                    <div className="font-medium">PHPSESSID</div>
                    <div className="text-gray-600">Proveedor: miguelleon.es</div>
                    <div className="text-gray-600">Propósito: Cookie de sesión PHP para guardar datos serializados de estado</div>
                    <div className="text-gray-600">Caducidad: No tiene caducidad establecida</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="font-medium">CookiesWLP</div>
                    <div className="text-gray-600">Proveedor: miguelleon.es</div>
                    <div className="text-gray-600">Propósito: Guarda la preferencia de las cookies escogidas</div>
                    <div className="text-gray-600">Caducidad: Al año</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Cookies de Preferencias (0)</h4>
                <p className="text-blue-800 text-sm">
                  Las cookies de preferencias permiten a la página web recordar información que cambia la forma en que la página se comporta 
                  o el aspecto que tiene, como su idioma preferido o la región en la que usted se encuentra.
                </p>
                <p className="text-blue-800 text-sm mt-2">
                  <em>Nosotros no usamos cookies de este tipo.</em>
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Cookies Estadísticas (0)</h4>
                <p className="text-yellow-800 text-sm">
                  Las cookies estadísticas ayudan a los propietarios de páginas web a comprender cómo interactúan los visitantes con las páginas web 
                  reuniendo y proporcionando información de forma anónima.
                </p>
                <p className="text-yellow-800 text-sm mt-2">
                  <em>Nosotros no usamos cookies de este tipo.</em>
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Cookies de Marketing (0)</h4>
                <p className="text-purple-800 text-sm">
                  Las cookies de marketing se utilizan para rastrear a los visitantes en las páginas web. La intención es mostrar anuncios relevantes 
                  y atractivos para el usuario individual, y por lo tanto, más valiosos para los editores y terceros anunciantes.
                </p>
                <p className="text-purple-800 text-sm mt-2">
                  <em>Nosotros no usamos cookies de este tipo.</em>
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Cookies No Clasificadas (0)</h4>
                <p className="text-gray-800 text-sm">
                  Las cookies no clasificadas son cookies para las que todavía estamos en proceso de clasificar, junto con los proveedores de cookies individuales.
                </p>
                <p className="text-gray-800 text-sm mt-2">
                  <em>Nosotros no usamos cookies de este tipo.</em>
                </p>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Información Adicional:</h4>
              <p className="text-orange-800 text-sm">
                En cualquier momento puede cambiar o retirar su consentimiento desde la Declaración de cookies en nuestro sitio web.
              </p>
              <p className="text-orange-800 text-sm mt-2">
                <strong>Declaración de cookies actualizada por última vez el 03/08/2025 por Web Las Palmas</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Para cualquier consulta sobre este aviso legal, 
            contacta con nosotros en info@miguelleon.es
          </p>
          <p className="mt-2">
            Este aviso legal está sujeto a cambios. Consulte esta página regularmente para mantenerse informado.
          </p>
        </div>
      </div>
    </div>
  );
}

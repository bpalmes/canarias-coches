import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Mail, MapPin, FileText, Users, AlertTriangle, Info } from 'lucide-react';

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-600">
            Protegemos tu privacidad y tus datos personales
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Última actualización: Diciembre 2023
          </p>
        </div>

        {/* Información al usuario */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              INFORMACIÓN AL USUARIO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              <strong>Miguel León SL</strong>, en adelante RESPONSABLE, es el Responsable del tratamiento de los datos personales del Usuario 
              y le informa que estos datos serán tratados de conformidad con lo dispuesto en el 
              <strong> Reglamento (UE) 2016/679 de 27 de abril de 2016 (GDPR)</strong> relativo a la 
              protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Fin del tratamiento:</h4>
              <p className="text-blue-800 text-sm mb-2">
                Mantener una relación comercial con el Usuario. Las operaciones previstas para realizar el tratamiento son:
              </p>
              <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                <li>Tramitar encargos, solicitudes o cualquier tipo de petición que sea realizada por el usuario a través de cualquiera de las formas de contacto que se ponen a su disposición.</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Criterios de conservación de los datos:</h4>
              <p className="text-yellow-800 text-sm">
                Se conservarán mientras exista un interés mutuo para mantener el fin del tratamiento y cuando ya no sea necesario para tal fin, 
                se suprimirán con medidas de seguridad adecuadas para garantizar la seudonimización de los datos o la destrucción total de los mismos.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <h4 className="font-semibold text-green-900 mb-2">Comunicación de los datos:</h4>
              <p className="text-green-800 text-sm">
                No se comunicarán los datos a terceros salvo obligación legal.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Derechos del usuario */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Derechos que asisten al Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Derecho a retirar el consentimiento en cualquier momento.</li>
              <li>Derecho de acceso, rectificación, portabilidad y supresión de sus datos y a la limitación u oposición al su tratamiento.</li>
              <li>Derecho a presentar una reclamación ante la autoridad de control (agpd.es) si considera que el tratamiento no se ajusta a la normativa vigente.</li>
            </ul>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Datos de contacto para ejercer sus derechos:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">C/ Diego Vega Sarmiento, 52 - 35014 Las Palmas de Gran Canaria</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">atenciondelcliente@miguelleon.es</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carácter obligatorio o facultativo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              CARÁCTER OBLIGATORIO O FACULTATIVO DE LA INFORMACIÓN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Los Usuarios, mediante la marcación de las casillas correspondientes y entrada de datos en los campos, marcados con un asterisco (*) 
              en los formularios de contactos, aceptan expresamente y de forma libre e inequívoca, que sus datos son necesarios para atender su petición, 
              por parte del prestador, siendo voluntaria la inclusión de datos en los campos restantes.
            </p>
            
            <p className="text-gray-700">
              El Usuario garantiza que los datos personales facilitados al RESPONSABLE son veraces y se hace responsable de comunicar cualquier 
              modificación de los mismos.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Garantía del RESPONSABLE:</h4>
              <p className="text-orange-800 text-sm">
                El RESPONSABLE informa y garantiza expresamente a los usuarios que sus datos personales no serán cedidos en ningún caso a terceros, 
                y que siempre que realizara algún tipo de cesión de datos personales, se pedirá previamente el consentimiento expreso, 
                informado e inequívoco por parte los Usuarios.
              </p>
            </div>

            <p className="text-gray-700">
              Todos los datos solicitados a través del sitio web son obligatorios, ya que son necesarios para la prestación de un servicio óptimo al Usuario. 
              En caso de que no sean facilitados todos los datos, no se garantiza que la información y servicios facilitados sean completamente ajustados a sus necesidades.
            </p>
          </CardContent>
        </Card>

        {/* Finalidad del tratamiento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Finalidad del tratamiento de los datos personales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold text-gray-900">¿Con qué finalidad trataremos tus datos personales?</h4>
            <p className="text-gray-700">
              En Grupo Miguel Leon S.L, trataremos tus datos personales recabados a través del Sitio Web: 
              <a href="https://www.miguelleon.es" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                https://www.miguelleon.es
              </a> con las siguientes finalidades:
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                1. Prestar sus servicios de acuerdo con las necesidades particulares de los clientes, con el fin de cumplir los contratos suscritos por la misma.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Oposición a comunicaciones comerciales:</h4>
              <p className="text-yellow-800 text-sm">
                Te recordamos que puedes oponerte al envío de comunicaciones comerciales por cualquier vía y en cualquier momento, 
                remitiendo un correo electrónico a la dirección anteriormente indicada.
              </p>
            </div>

            <p className="text-gray-700">
              Los campos de dichos registros son de cumplimentación obligatoria, siendo imposible realizar las finalidades expresadas 
              si no se aportan esos datos.
            </p>
          </CardContent>
        </Card>

        {/* Conservación de datos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              ¿Por cuánto tiempo se conservan los datos personales recabados?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Los datos personales proporcionados se conservarán mientras se mantenga la relación comercial o no solicites su supresión 
              y durante el plazo por el cuál pudieran derivarse responsabilidades legales por los servicios prestados.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Código Civil</h4>
                <p className="text-yellow-700 text-sm">
                  Según lo previsto en el artículo 1.964.2 del Código Civil, en el caso de obligaciones personales que no tengan señalado 
                  un plazo de prescripción especial, los datos personales permanecerán bloqueados durante un plazo máximo de 
                  <strong>5 años</strong> desde que pueda exigirse el cumplimiento de la obligación.
                </p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Sin Relación Comercial</h4>
                <p className="text-red-700 text-sm">
                  Si no hubiera relación comercial (compraventa) de ningún aspecto, se procederá a destruir los documentos 
                  (Documentación - Fotos) por parte del Grupo Miguel Leon S.L. en el plazo de <strong>15 días hábiles</strong>. 
                  Una vez transcurrido ese tiempo procederemos al borrado de dicha información de nuestros teléfonos y base de datos.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Tasaciones</h4>
                <p className="text-blue-700 text-sm">
                  La tasación estará vigente para el cliente durante un máximo de <strong>7 días hábiles</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destinatarios */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Destinatarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Los datos no se comunicarán a ningún tercero ajeno al Grupo Miguel Leon o proveedores externos de servicios salvo obligación legal.
            </p>
          </CardContent>
        </Card>

        {/* Medidas de seguridad */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              MEDIDAS DE SEGURIDAD
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Que de conformidad con lo dispuesto en las normativas vigentes en protección de datos personales, el RESPONSABLE está cumpliendo 
              con todas las disposiciones de las normativas GDPR para el tratamiento de los datos personales de su responsabilidad, y manifiestamente 
              con los principios descritos en el artículo 5 del GDPR, por los cuales son tratados de manera lícita, leal y transparente en relación 
              con el interesado y adecuados, pertinentes y limitados a lo necesario en relación con los fines para los que son tratados.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Garantía del RESPONSABLE:</h4>
              <p className="text-green-800 text-sm">
                El RESPONSABLE garantiza que ha implementado políticas técnicas y organizativas apropiadas para aplicar las medidas de seguridad 
                que establecen el GDPR con el fin de proteger los derechos y libertades de los Usuarios y les ha comunicado la información 
                adecuada para que puedan ejercerlos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Derechos propiedad intelectual */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              DERECHOS PROPIEDAD INTELECTUAL
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
              <h4 className="font-semibold text-red-800 mb-2">Restricciones:</h4>
              <p className="text-red-800 text-sm">
                No se permite la reproducción, copia, publicación y/o uso no estrictamente privado de los contenidos, totales o parciales, 
                del sitio web https://www.miguelleon.es sin el consentimiento previo y por escrito.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Área de Trabaja con Nosotros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Área de TRABAJA CON NOSOTROS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Responsable del tratamiento:</h4>
              <p className="text-blue-800 text-sm">
                Grupo Miguel León, S.L., con domicilio social en la calle Callejón del Castillo, 215, Calero Alto, Telde, y CIF: B76233865.
              </p>
            </div>

            <p className="text-gray-700">
              Esta política de privacidad establece las bases sobre las que Grupo Miguel León, S.L., trata la información obtenida 
              a través de la plataforma de empleo de Grupo Miguel León, S.L..
            </p>

            <p className="text-gray-700">
              Uno de los principales objetivos de la plataforma de empleo (accesible a través de la URL 
              <a href="https://miguelleon.es/trabaja-con-nosotros.html" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                https://miguelleon.es/trabaja-con-nosotros.html
              </a>), titularidad de Grupo Miguel León, S.L., es gestionar los procesos de selección de la empresa para la optimización 
              de búsqueda de empleo de todas las oportunidades que puedan tener los usuarios registrados.
            </p>

            <p className="text-gray-700">
              La utilización de la plataforma de empleo, se encuentra sujeta a la política de privacidad descrita en este documento, 
              siendo necesaria su revisión por parte del usuario para comprobar que se encuentra conforme con la misma.
            </p>
          </CardContent>
        </Card>

        {/* Recogida de datos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              a. RECOGIDA DE DATOS Y FINALIDADES DEL TRATAMIENTO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              El origen de los datos personales y profesionales será facilitado por el propio usuario, mediante su interacción directa 
              con la plataforma de empleo, a través del formulario de registro y de aquellos formularios específicos que desee adjuntar en formato PDF.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Datos recabados:</h4>
              <p className="text-blue-800 text-sm">
                Los datos que se recaban a través de la plataforma de empleo, son datos relativos a aspectos de carácter identificativo 
                como su nombre, apellidos, teléfono de contacto, correo electrónico y mensaje de presentación, así como la opción de 
                adjuntar un formulario PDF, de forma voluntaria, con la información que el candidato estime relevante para su candidatura.
              </p>
            </div>

            <p className="text-gray-700">
              El hecho de no facilitar cierta información señalada como obligatoria, puede conllevar que no sea posible gestionar su registro 
              como usuario o su candidatura a ofertas de empleo disponibles a través de la plataforma de empleo. Grupo Miguel León, S.L. 
              tratará sus datos para la siguiente finalidad:
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Finalidad:</h4>
              <p className="text-green-800 text-sm">
                Procesos de selección de Grupo Miguel León, S.L.
              </p>
            </div>

            <p className="text-gray-700">
              Los datos aportados en el formulario de registro de la plataforma de empleo, serán objeto de tratamiento para el desarrollo, 
              realización y gestión de los procesos de selección de Grupo Miguel León, S.L..
            </p>

            <p className="text-gray-700">
              Asimismo, podremos contactar con usted a través de correo electrónico, llamadas telefónicas o envío de SMS, para una adecuada 
              gestión de los procesos de selección en los que desee participar.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Garantía del usuario:</h4>
              <p className="text-yellow-800 text-sm">
                El usuario (usted) al aceptar la presente Política de Privacidad, garantiza que los datos proporcionados son ciertos y exactos 
                y se compromete a notificar cualquier cambio o modificación de los mismos.
              </p>
            </div>

            <p className="text-gray-700">
              Cualquier pérdida o daño causado a la plataforma de empleo, a Grupo Miguel León, S.L., o a cualquier tercero mediante la 
              comunicación de información errónea, inexacta o incompleta, será responsabilidad exclusiva del usuario.
            </p>

            <p className="text-gray-700">
              Grupo Miguel León, S.L., se encuentra legitimada para anonimizar o seudonimizar sus datos personales para la elaboración, 
              a efectos estadísticos, de reportes para la gestión de recursos humanos.
            </p>
          </CardContent>
        </Card>

        {/* Nota importante */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              NOTA IMPORTANTE ACERCA DEL CONTENIDO DE LA INFORMACIÓN ADICIONAL APORTADA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Es muy importante que la información que nos facilite a través de campos de texto libre, así como en los ficheros, enlaces o 
              documentos aportados, no contengan información confidencial o especialmente sensible, tales como:
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="list-disc list-inside text-red-800 text-sm space-y-1">
                <li>Su origen racial o étnico</li>
                <li>Su ideología o convicciones políticas, religiosas o filosóficas</li>
                <li>Su afiliación a partidos políticos o sindicatos</li>
                <li>Su salud física o mental</li>
                <li>Datos biométricos o configuración genética</li>
                <li>Su orientación sexual</li>
                <li>Antecedentes penales</li>
                <li>Número de la Seguridad Social o de identificación personal</li>
              </ul>
            </div>

            <p className="text-gray-700">
              Si nos aporta este tipo de información, acepta su propia responsabilidad sobre los posibles riesgos para su privacidad. 
              En caso de detectar este tipo de información, procederemos a borrarla de nuestros sistemas y en ningún caso se tendrá 
              en consideración para los procesos de selección.
            </p>
          </CardContent>
        </Card>

        {/* Visibilidad y comunicaciones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              b. VISIBILIDAD, COMUNICACIONES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Dado que uno de los principales objetivos de la plataforma de empleo es, gestionar los procesos de selección de Grupo Miguel León, S.L. 
              y maximizar las oportunidades de sus usuarios registrados, una vez registrado, sus datos serán visibles solo para las personas habilitadas 
              en funciones de reclutamiento en el departamento de Recursos Humanos de la empresa, en la medida en que lo permita la normativa aplicable, 
              con la finalidad de favorecer la búsqueda de candidatos que se adapten a los diferentes procesos de selección que estén en marcha dentro 
              de Grupo Miguel León, S.L.
            </p>

            <p className="text-gray-700">
              Por tanto, para cumplir con las finalidades indicadas en el apartado anterior, puede resultar necesario que comuniquemos o cedamos 
              la información que nos ha proporcionado a determinadas sociedades integrantes del Grupo de Empresas Miguel León, en la medida en que 
              necesiten acceder a sus datos, por estar directamente implicadas en los procesos de selección a los que haya presentado su candidatura 
              o porque los intereses que haya indicado el usuario pueda encajar en el perfil de candidato que están buscando, por lo que entendemos 
              que, al registrarse y proporcionarnos información a través de esta plataforma de empleo, nos autoriza expresamente para efectuar tales 
              comunicaciones y/o cesiones a las citadas sociedades.
            </p>

            <p className="text-gray-700">
              El acceso a los datos del usuario por parte del personal de la empresa Grupo Miguel León, S.L., se realizará respetando la normativa 
              que resulte en cada caso de aplicación, incluyendo las necesarias medidas de seguridad técnicas y organizativas para garantizar 
              la confidencialidad de los datos del candidato.
            </p>
          </CardContent>
        </Card>

        {/* Legitimación */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              c. LEGITIMACIÓN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              La aceptación y consentimiento del interesado: En aquellos casos donde para realizar una solicitud sea necesario cumplimentar un 
              formulario y hacer un «click» en el botón de enviar, la realización del mismo implicará necesariamente que ha sido informado y 
              ha otorgado expresamente su consentimiento al contenido de la cláusula anexada a dicho formulario o aceptación de la política de privacidad.
            </p>

            <p className="text-gray-700">
              Si no facilita esos campos, o no marca el checkbox de aceptación de la política de privacidad, no se permitirá el envío de la información. 
                             Normalmente tiene la siguiente fórmula: &quot;He leído y acepto la Política de privacidad.&quot;
            </p>
          </CardContent>
        </Card>

        {/* Conservación y almacenamiento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              d. CONSERVACIÓN, ALMACENAMIENTO DE LA INFORMACIÓN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Grupo Miguel León, S.L., conservará los datos personales introducidos para optar a los procesos de selección en curso, 
              así como para aquellos que pudieran llevarse a cabo en el futuro durante un plazo máximo de <strong>24 meses</strong>.
            </p>
          </CardContent>
        </Card>

        {/* Derechos de los usuarios */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              e. DERECHOS DE LOS USUARIOS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Grupo Miguel León, S.L., como responsable del fichero, se compromete a respetar la confidencialidad de su información de carácter 
              personal y a garantizar el ejercicio de sus derechos de acceso, rectificación, cancelación, oposición y limitación, mediante mail 
              dirigida a la siguiente dirección: recursoshumanos@miguelleon.es
            </p>

            <p className="text-gray-700">
              En el caso de que decidiese ejercitar dichos derechos, por favor, indíquenos la dirección de correo electrónico que ha utilizado 
              para identificarse o usar los servicios o funcionalidades de la plataforma de empleo, así como el derecho que ejerce. En caso necesario, 
              podremos solicitarle un documento acreditativo válido (DNI o Pasaporte).
            </p>

            <p className="text-gray-700">
              También puede presentar una reclamación ante la 
              <a href="https://www.agpd.es" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                Agencia Española de Protección de Datos
              </a>, especialmente cuando no esté satisfecho con el ejercicio de sus derechos, para más detalle consulte la web https://www.agpd.es
            </p>
          </CardContent>
        </Card>

        {/* Modificaciones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              f. MODIFICACIONES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Consulte periódicamente la política de privacidad ya que puede sufrir modificaciones. Puede consultar en todo momento la versión 
              vigente a través de la plataforma de empleo. Recuerde que es su responsabilidad leerla periódicamente, ya que la política de privacidad 
              vigente en el momento de uso de la plataforma de empleo será la que le resulte de aplicación.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Para cualquier consulta sobre esta política de privacidad, 
            contacta con nosotros en atencionalcliente@miguelleon.es
          </p>
          <p className="mt-2">
            También puedes presentar una reclamación ante la 
            <a 
              href="https://www.agpd.es" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Agencia Española de Protección de Datos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

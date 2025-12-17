import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Car, AlertCircle, Info, CheckCircle, XCircle, Calculator, MapPin } from 'lucide-react';

export default function ReservaVehiculoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Car className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Servicio de Reserva de Vehículo
          </h1>
          <p className="text-lg text-gray-600">
            Bloquea tu vehículo preferido por 3 días
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Servicio de reserva con garantía legal
          </p>
        </div>

        {/* Introducción */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              ¿Qué es el Servicio de Reserva?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Se pone a disposición de los usuarios la posibilidad de contratar nuestro Servicio de Reserva de Vehículo, 
              de conformidad con el artículo 1.454 del Código Civil, abonando un importe de <strong>500€</strong> (&quot;Reserva&quot;).
            </p>
            <p className="text-gray-700">
              Realizado el pago del Servicio de Reserva, el vehículo en el que esté interesado el usuario quedará bloqueado 
              durante un periodo de <strong>tres (3) días naturales</strong>, a contar desde el día de formalización del pago del Servicio de Reserva.
            </p>
          </CardContent>
        </Card>

        {/* Características del servicio */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Características del Servicio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Bloqueo del vehículo:</h4>
                <p className="text-green-800 text-sm">
                  Durante el Periodo de Servicio de Reserva indicado, el vehículo quedará bloqueado y por tanto no será transmitido 
                  a ningún tercero distinto al usuario que formalice el Servicio de Reserva.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Descuento en la compra:</h4>
                <p className="text-blue-800 text-sm">
                  Si el usuario finalmente decidiera adquirir el vehículo y formalizar la compraventa del vehículo con Grupo Miguel León 
                  durante el Periodo de Servicio de Reserva, el importe del Servicio de Reserva será descontado del precio final del vehículo.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Formas de pago:</h4>
                <p className="text-yellow-800 text-sm">
                  Dicho Servicio de Reserva podrá abonarse a través de nuestra página web, vía transferencia bancaria, 
                  o mediante datáfono en las instalaciones de Grupo Miguel León.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicaciones de pago */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Ubicaciones para Pago en Efectivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-2">Gran Canaria - Las Palmas</h4>
                  <p className="text-blue-800 text-sm">C/ Alfredo Martín Reyes, 7</p>
                  <p className="text-blue-800 text-sm">35014 Miller Bajo – Las Palmas de G.C.</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-2">Gran Canaria - Telde</h4>
                  <p className="text-green-800 text-sm">C/ Callejón del Castillo, 215</p>
                  <p className="text-green-800 text-sm">35200 Telde – Gran Canaria</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="font-semibold text-yellow-800 mb-2">Gran Canaria - Vecindario</h4>
                  <p className="text-yellow-800 text-sm">Avenida de Canarias, 460</p>
                  <p className="text-yellow-800 text-sm">35110 El Doctoral, Vecindario – Gran Canaria</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-800 mb-2">Lanzarote - Arrecife</h4>
                  <p className="text-purple-800 text-sm">Carr. de San Bartolomé, 52</p>
                  <p className="text-purple-800 text-sm">35500 Arrecife, Las Palmas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condiciones importantes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Condiciones Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">No es obligatorio:</h4>
                <p className="text-blue-800 text-sm">
                  El pago del Servicio de Reserva no será un requisito previo ni obligatorio para la adquisición del vehículo. 
                  El usuario podrá directamente comprar el vehículo, abonando la cantidad anunciada en el correspondiente coche.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Compra directa:</h4>
                <p className="text-green-800 text-sm">
                  Del mismo modo, el usuario podrá comprar el vehículo sin adquirir el Servicio de Reserva, 
                  una vez cuente con una financiación aprobada gestionada desde Grupo Miguel León.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* No reembolso */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Condiciones de No Reembolso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Renuncia a la adquisición:</h4>
              <p className="text-red-800 text-sm mb-3">
                Transcurrido el Periodo de Servicio de Reserva, sin que el usuario haya formalizado la compraventa del vehículo 
                reservado con Grupo Miguel León mediante el abono de la totalidad del precio y la formalización del Contrato de Compraventa, 
                se entenderá que renuncia a la adquisición del vehículo.
              </p>
              <p className="text-red-800 text-sm">
                La cantidad pagada en concepto de Servicio de Reserva no le será reembolsada, al haber sido el servicio íntegramente disfrutado, 
                compensado así los gastos asumidos por Grupo Miguel León derivados del transporte, revisión, reacondicionamiento preferente 
                e imposibilidad de venta del vehículo a terceros usuarios.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Excepciones de reembolso */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Excepciones de Reembolso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">1. Rechazo de financiación:</h4>
                <p className="text-green-800 text-sm">
                  Que la adquisición no se produzca por el rechazo de la financiación (siempre que el usuario haya proporcionado 
                  toda la documentación requerida al efecto), en cuyo caso, Grupo Miguel León devolverá el dinero abonado por el usuario 
                  en concepto de Servicio de Reserva, siempre y cuando la financiación haya sido gestionada directamente por Grupo Miguel León 
                  en nombre del cliente.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">2. Responsabilidad de Grupo Miguel León:</h4>
                <p className="text-blue-800 text-sm">
                  Que la adquisición no se produzca por un hecho directamente imputable a Grupo Miguel León, en cuyo caso 
                  Grupo Miguel León devolverá al usuario la cantidad abonada en concepto de Servicio de Reserva por duplicado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recuperación del importe */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              Recuperación del Importe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Condiciones especiales:</h4>
              <p className="text-yellow-800 text-sm">
                El usuario, no obstante lo establecido anteriormente, podrá recuperar el importe abonado por el Servicio de Reserva 
                si finalizado el Periodo de Servicio de Reserva procede, bien aportando toda la documentación requerida para la financiación, 
                demostrando así, inequívocamente, su intención de continuar con el proceso de compra del vehículo.
              </p>
              <p className="text-yellow-800 text-sm mt-2">
                En el entendido de que si no realiza estos pasos, transcurrido el Periodo del Servicio de Reserva, 
                Grupo Miguel León podrá disponer libremente del vehículo, ofertándolo a otros usuarios, con las consecuencias 
                de ello derivadas para el usuario.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enlaces relacionados */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Información Relacionada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Proceso de Compra-Tasación</h4>
                <p className="text-green-800 text-sm mb-3">
                  Información sobre cómo vendemos tu vehículo.
                </p>
                <a href="/proceso-compra-tasacion" className="text-blue-600 hover:underline font-medium">
                  Ver proceso →
                </a>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Condiciones de Financiación</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Ofertas y condiciones de financiación.
                </p>
                <a href="/condiciones-financiacion" className="text-blue-600 hover:underline font-medium">
                  Ver condiciones →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Para más información sobre el servicio de reserva, 
            contacta con nosotros en info@miguelleon.es
          </p>
          <p className="mt-2">
            El servicio de reserva está sujeto a las condiciones descritas en esta página.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function CondicionesFinanciacion() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-[#0f286a] mb-8 border-b pb-4">
          Condiciones de Financiación
        </h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p>
            Miguel León es un operador autorizado para ofrecer financiación por parte de las financieras con las que tenemos acuerdos actualizados para el ejercicio del 2025. Las financieras con las que tenemos acuerdos durante el año del 2025 son:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Santander Consumer Finance</li>
            <li>BBVA Consumer Finance</li>
            <li>Caixa Bank Consumer</li>
            <li>Sofinco</li>
            <li>Cetelem</li>
            <li>Confia</li>
          </ul>

          <p>
            Nosotros como operador procederemos a pasar las operaciones desde nuestro departamento financiero, con los condicionantes de cada financiera con la que operamos, y son los que trasladaremos a nuestros clientes.
          </p>

          <div className="bg-blue-50 border-l-4 border-[#0f286a] p-4 my-6">
            <p className="font-semibold text-[#0f286a]">
              Para poder acogerse a los descuentos por precio de financiación debe de financiar el 100% del precio financiado.
            </p>
          </div>

          <p>
            Los plazos mínimos estipulados con las financieras con las que operamos son de <strong>72 meses</strong>.
          </p>

          <div className="my-8">
            <h2 className="text-2xl font-bold text-[#0f286a] mb-4">
              Tipos de Interés 2025
            </h2>
            <p className="mb-4">
              Los tipos de interés ofertados en el año 2025 por parte de Miguel León en su Web{' '}
              <a href="https://miguelleon.es/encuentratucoche" className="text-blue-600 hover:underline">
                miguelleon.es/encuentratucoche
              </a>{' '}
              serán los siguientes:
            </p>

            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-lg text-[#0f286a] mb-3">Vehículos hasta 6 años:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Hasta 10.000€</p>
                  <p className="text-2xl font-bold text-[#0f286a]">8,99%</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">De 10.000€ a 20.000€</p>
                  <p className="text-2xl font-bold text-[#0f286a]">7,99%</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Más de 20.000€</p>
                  <p className="text-2xl font-bold text-[#0f286a]">6,99%</p>
                </div>
              </div>

              <h3 className="font-semibold text-lg text-[#0f286a] mb-3 mt-6">Vehículos de más de 6 años:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Hasta 10.000€</p>
                  <p className="text-2xl font-bold text-[#0f286a]">9,99%</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">De 10.000€ a 20.000€</p>
                  <p className="text-2xl font-bold text-[#0f286a]">8,99%</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Más de 20.000€</p>
                  <p className="text-2xl font-bold text-[#0f286a]">7,99%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
            <p className="text-sm">
              <strong>Nota importante:</strong> Las cuotas ofertadas en los anuncios en la Web de{' '}
              <a href="https://miguelleon.es/encuentratucoche" className="text-blue-600 hover:underline">
                miguelleon.es/encuentratucoche
              </a>{' '}
              son al plazo máximo permitido en función de la antigüedad del vehículo y con el seguro por parte de la financiera incluido en el precio de la cuota.
            </p>
          </div>

          <p>
            Cualquier cambio en el condicionante será evaluado por la financiera y por Miguel León S.L e informado al cliente en el transcurso de la oferta comercial.
          </p>

          <p>
            Las financieras imponen una serie de condicionantes a la firma que el cliente deberá de valorar y aceptar con respecto a tipos de interés, plazos, seguros, etc.
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">
              Para más información sobre nuestras condiciones de financiación, no dude en contactar con nosotros o visitarnos en cualquiera de nuestras delegaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function Delegaciones() {
  const delegaciones = [
    {
      nombre: "Miguel León Las Palmas",
      direccion: "C/ Alfredo Martín Reyes, 7 35014 Miller Bajo",
      telefono: "+34 928 22 23 24",
      horario: ["Lun-Vie: 09:00 - 20:00", "Sábado: 10:00 - 13:00"],
      tipo: "Exposición"
    },
    {
      nombre: "Taller Miguel León Clientes - Las Palmas",
      direccion: "C. Diego Vega Sarmiento, 52, 35014 Las Palmas de Gran Canaria, Las Palmas",
      telefono: "928 22 23 24",
      horario: ["Lun - Vie: 8:00 - 16:30"],
      tipo: "Taller"
    },
    {
      nombre: "Taller y Logística - Las Palmas",
      direccion: "C/ Rafaela de las Casas González, s/n 35014 Miller Alto",
      telefono: "+34 928 22 23 24",
      horario: ["Lun - Vie: 08:00 - 16:30"],
      tipo: "Taller y Logística"
    },
    {
      nombre: "Miguel León Telde",
      direccion: "C/ Callejón del Castillo, 215, 35200 Telde, Las Palmas",
      telefono: "+34 928 22 23 24",
      horario: ["Lun-Vie: 09:00 - 20:00", "Sábado: 10:00 - 13:00"],
      tipo: "Exposición"
    },
    {
      nombre: "Miguel León Vecindario",
      direccion: "Avenida de Canarias, 460 35110 El Doctoral, Vecindario",
      telefono: "+34 928 22 23 24",
      horario: ["Lun-Vie: 09:00 - 13:00 y 16:00 - 20:00", "Sábado: 10:00 a 13:00"],
      tipo: "Exposición"
    },
    {
      nombre: "Miguel León Carrizal",
      direccion: "Av. de Carlos V, 108, 35240 Carrizal, Las Palmas",
      telefono: "+34 928 22 23 24",
      horario: ["Lun-Vie: 09:00 - 13:00 y 16:00 - 20:00", "Sábado: Cerrado"],
      tipo: "Exposición"
    },
    {
      nombre: "Miguel León Tenerife",
      direccion: "Avenida La Libertad Nave A4 - Los Majuelos 38108 La Laguna - Sta. Cruz de Tenerife",
      telefono: "+34 822 22 23 33",
      horario: ["Lun-Vie: 09:00 - 20:00", "Sábado: 10:00 - 13:00"],
      tipo: "Exposición"
    },
    {
      nombre: "Miguel León Lanzarote",
      direccion: "Carr. de San Bartolomé, 52 35500 Arrecife, Las Palmas",
      telefono: "+34 928 908 986",
      horario: ["Lun-Vie: 09:00 - 20:00", "Sábado: 10:00 - 13:00"],
      tipo: "Exposición"
    },
    {
      nombre: "Taller Miguel León Clientes - Lanzarote",
      direccion: "C. de León Felipe, 4, 35500 Arrecife, Las Palmas",
      telefono: "928 96 43 79",
      horario: ["Lun - Vie: 8:00 - 16:00"],
      tipo: "Taller"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0f286a] mb-4">
            Nuestras Delegaciones
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Grupo Miguel León en su expansión tomó una decisión de un crecimiento sostenible. Empezamos en Gran Canaria donde fuimos consolidando el negocio entre la exposición de Las Palmas y de la Telde.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#0f286a] mb-6">Nuestra Historia</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>2020:</strong> Se dio el salto a la exposición de Miller, donde está la central y nuestra mayor exposición de Las Palmas. Se consolidó el negocio en Telde y Vecindario.
            </p>
            <p>
              <strong>2022:</strong> Empezamos nuestro proyecto en Lanzarote (Arrecife).
            </p>
            <p>
              <strong>2023:</strong> Llegaron las aperturas en Tenerife (Los Majuelos) y el Carrizal.
            </p>
            <p>
              <strong>2024:</strong> Hemos abierto Taller Oficial Miguel León Clientes (Miller Bajo) y Taller Oficial Miguel León Lanzarote Clientes (Arrecife).
            </p>
            <p className="text-[#0f286a] font-semibold">
              El proyecto del Grupo Miguel León continúa y habrá otras aperturas que iremos informando durante el ejercicio del 2024-25.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {delegaciones.map((delegacion, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="bg-[#0f286a] text-white p-4">
                <h3 className="text-xl font-bold">{delegacion.nombre}</h3>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs">
                  {delegacion.tipo}
                </span>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#0f286a] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-sm">{delegacion.direccion}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#0f286a] flex-shrink-0" />
                  <a
                    href={`tel:${delegacion.telefono.replace(/\s/g, '')}`}
                    className="text-gray-700 hover:text-[#0f286a] transition-colors text-sm"
                  >
                    {delegacion.telefono}
                  </a>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#0f286a] flex-shrink-0 mt-1" />
                  <div className="text-gray-700 text-sm">
                    {delegacion.horario.map((hora, idx) => (
                      <p key={idx}>{hora}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border-l-4 border-[#0f286a] p-6 rounded-lg">
          <p className="text-gray-700">
            <strong>¿Necesitas más información?</strong> No dudes en contactar con cualquiera de nuestras delegaciones. Nuestro equipo estará encantado de atenderte y resolver todas tus dudas.
          </p>
        </div>
      </div>
    </div>
  );
}








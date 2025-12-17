"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import CarCardCompact from './CarCardCompact'; 
import { Car } from '@prisma/client';
import { useWalcuCRM } from '@/hooks/useWalcuCRM';

interface CarWithImages extends Car {
  images: { url: string; isPrimary?: boolean }[];
}

interface InterestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: CarWithImages;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export default function InterestFormModal({ isOpen, onClose, car }: InterestFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { processCarInterestForm, loading, error, clearError } = useWalcuCRM();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    clearError();

    console.log('🚀 Iniciando envío del formulario de interés en vehículo...');
    console.log('📋 Datos del formulario:', formData);
    console.log('🚗 Información del vehículo:', car);

          try {
        // Convertir el coche de Prisma a formato Walcu CRM
        const walcuCar = {
          _id: car.id.toString(),
          make: car.make || '',
          model: car.model || '',
          year: car.year || new Date().getFullYear(),
          version: car.version || '',
          license_plate: car.numberplate || '',
          stock_number: car.sku || '',
          price: car.regularPrice || 0,
          mileage: car.kms || 0,
          fuel: car.fuel || '',
          transmission: car.transmission || '',
          power: car.power || 0,
          doors: car.doors || 0,
          seats: car.seats || 0,
          body_style: car.bodytype || '',
          color: car.color || '',
          vin: car.vin || '',
          category: 'car' as const,
          type: 'used' as const,
          images: car.images.map(img => img.url),
          ad_urls: [`/car/${car.id}`]
        };

        console.log('🔄 Vehículo convertido a formato Walcu CRM:', walcuCar);

        const requestData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message || `Me interesa el ${car.make} ${car.model} ${car.version}`,
          car: walcuCar,
          source: 'website',
          medium: 'car_page',
          campaign: 'car_interest'
        };

        console.log('📤 Enviando datos a Walcu CRM:', requestData);
        console.log('🌐 Llamando a processCarInterestForm...');

        // PRIMERO: Guardar lead en la base de datos local
        console.log('💾 Guardando lead en base de datos local...');
        const localLeadResponse = await fetch('/api/admin/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message || `Me interesa el ${car.make} ${car.model} ${car.version}`,
            carId: car.id,
            carMake: car.make,
            carModel: car.model,
            carYear: car.year,
            carLicensePlate: car.numberplate,
            carStockNumber: car.sku,
            source: 'website',
            medium: 'car_page',
            campaign: 'car_interest'
          })
        });

        if (!localLeadResponse.ok) {
          throw new Error('Error guardando lead en base de datos local');
        }

        const localLead = await localLeadResponse.json();
        console.log('✅ Lead guardado localmente:', localLead.data.id);

        // SEGUNDO: Enviar a Walcu CRM
        const result = await processCarInterestForm(requestData);

      console.log('📥 Respuesta recibida de Walcu CRM:', result);

              if (result.success) {
          console.log('✅ Formulario procesado exitosamente en Walcu CRM usando endpoint oficial');
          console.log('🎯 Lead ID creado:', result.leadId);
          console.log('📊 Respuesta completa:', result);
          
          // ACTUALIZAR: Estado del lead local con la respuesta de Walcu
          try {
            await fetch(`/api/admin/leads/${localLead.data.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                walcuStatus: 'sent',
                walcuLeadId: result.leadId
              })
            });
            console.log('✅ Estado del lead local actualizado a "sent"');
          } catch (updateErr) {
            console.error('⚠️ Error actualizando estado local:', updateErr);
          }
          
          setIsSubmitted(true);
          // Limpiar el formulario
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: ''
          });
        } else {
          console.error('❌ Error en la respuesta de Walcu CRM:', result.error);
          console.error('📊 Datos de error completos:', result);
          
          // ACTUALIZAR: Estado del lead local a "failed"
          try {
            await fetch(`/api/admin/leads/${localLead.data.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                walcuStatus: 'failed',
                walcuError: result.error || 'Error desconocido'
              })
            });
            console.log('✅ Estado del lead local actualizado a "failed"');
          } catch (updateErr) {
            console.error('⚠️ Error actualizando estado local:', updateErr);
          }
          
          setSubmitError(result.error || 'Error al enviar el formulario');
        }
    } catch (err) {
      console.error('💥 Error inesperado durante el proceso:', err);
      console.error('🔍 Tipo de error:', typeof err);
      console.error('📝 Mensaje de error:', err instanceof Error ? err.message : 'Error desconocido');
      console.error('📚 Stack trace:', err instanceof Error ? err.stack : 'No disponible');
      
      setSubmitError('Error inesperado al enviar el formulario');
    }
  };

  const handleClose = () => {
    onClose();
    setIsSubmitted(false);
    setSubmitError(null);
    clearError();
  };

  if (isSubmitted) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white z-50 p-4 md:p-8 overflow-y-auto"
          >
            <button onClick={handleClose} className="absolute top-4 md:top-8 right-4 md:right-8 text-gray-500 hover:text-gray-800 z-10">
              <X size={24} />
            </button>
            
            <div className="flex flex-col lg:flex-row h-full pt-16 md:pt-20">
              <div className="w-full lg:w-1/2 lg:pr-8 lg:border-r lg:border-gray-200 mb-8 lg:mb-0">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-800">¡Interés Registrado!</h2>
                  <p className="text-gray-600 mb-6">
                    Tu interés en el {car.make} {car.model} ha sido registrado exitosamente. 
                    Nuestro equipo te contactará pronto con más información.
                  </p>
                  <button
                    onClick={handleClose}
                    className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2 lg:pl-8 flex items-center justify-center">
                <div className="w-full max-w-lg">
                  <CarCardCompact car={car} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 bg-white z-50 p-4 md:p-8 overflow-y-auto"
        >
          <button onClick={handleClose} className="absolute top-4 md:top-8 right-4 md:right-8 text-gray-500 hover:text-gray-800 z-10">
            <X size={24} />
          </button>
          
          {/* Layout responsive: arriba-abajo en mobile, izquierda-derecha en desktop */}
          <div className="flex flex-col lg:flex-row h-full pt-16 md:pt-20">
            {/* Formulario - Arriba en mobile, izquierda en desktop */}
            <div className="w-full lg:w-1/2 lg:pr-8 lg:border-r lg:border-gray-200 mb-8 lg:mb-0">
              <div className="lg:hidden mb-4 p-2 bg-blue-50 text-blue-700 text-xs rounded text-center">
                📱 Layout Mobile: Formulario arriba
              </div>
              <div className="hidden lg:block mb-4 p-2 bg-green-50 text-green-700 text-xs rounded text-center">
                🖥️ Layout Desktop: Formulario izquierda
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">¿Interesado?</h2>
              <p className="text-gray-600 mb-6 md:mb-8">Déjanos tus datos y te contactaremos lo antes posible.</p>
              
              {/* Mostrar errores de Walcu CRM */}
              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>Error de Walcu CRM: {error}</span>
                  <button 
                    onClick={clearError}
                    className="ml-auto text-red-500 hover:text-red-700 underline text-sm"
                  >
                    Cerrar
                  </button>
                </div>
              )}

              {/* Mostrar errores del formulario */}
              {submitError && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                </div>
                <div className="mb-4 md:mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div className="mb-4 md:mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div className="mb-4 md:mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea 
                    id="message" 
                    name="message"
                    rows={4} 
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={`Me interesa el ${car.make} ${car.model} ${car.version}`}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <div className="text-center md:text-right">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full md:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center md:justify-end gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar mensaje'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Tarjeta del coche - Abajo en mobile, derecha en desktop */}
            <div className="w-full lg:w-1/2 lg:pl-8 flex items-center justify-center">
              <div className="w-full max-w-lg">
                <div className="lg:hidden mb-4 p-2 bg-blue-50 text-blue-700 text-xs rounded text-center">
                  📱 Layout Mobile: Coche abajo
                </div>
                <div className="hidden lg:block mb-4 p-2 bg-green-50 text-green-700 text-xs rounded text-center">
                  🖥️ Layout Desktop: Coche derecha
                </div>
                <CarCardCompact car={car} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


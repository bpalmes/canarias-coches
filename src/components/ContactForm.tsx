"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useWalcuCRM } from '@/hooks/useWalcuCRM';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { loading, clearError } = useWalcuCRM();

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

    try {
      // PRIMERO: Guardar lead en la base de datos local
      console.log('💾 Guardando lead de contacto en base de datos local...');
      const localLeadResponse = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          carMake: "Contacto",
          carModel: "General",
          carYear: new Date().getFullYear(),
          carLicensePlate: "CONTACT",
          carStockNumber: "CONTACT001",
          source: 'website',
          medium: 'contact_form',
          campaign: 'general_contact'
        })
      });

      if (!localLeadResponse.ok) {
        throw new Error('Error guardando lead en base de datos local');
      }

      const localLead = await localLeadResponse.json();
      console.log('✅ Lead de contacto guardado localmente:', localLead.data.id);
      
      // SEGUNDO: Enviar al endpoint oficial de Walcu
      const response = await fetch('/api/walcu/leadimport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          source: 'Web Ofertas Marketing',
          medium: 'https://ofertas.miguelleon.es/',
          campaign: 'contact_form',
          car: {
            make: "Contacto",
            model: "General",
            year: new Date().getFullYear(),
            license_plate: "CONTACT",
            stock_number: "CONTACT001"
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        // ACTUALIZAR: Estado del lead local a "sent"
        try {
          await fetch(`/api/admin/leads/${localLead.data.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              walcuStatus: 'sent',
              walcuLeadId: result.leadId
            })
          });
          console.log('✅ Estado del lead de contacto actualizado a "sent"');
        } catch (updateErr) {
          console.error('⚠️ Error actualizando estado local:', updateErr);
        }
        
        setIsSubmitted(true);
        console.log('✅ Formulario de contacto enviado exitosamente usando endpoint oficial:', result);
        // Limpiar el formulario
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
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
          console.log('✅ Estado del lead de contacto actualizado a "failed"');
        } catch (updateErr) {
          console.error('⚠️ Error actualizando estado local:', updateErr);
        }
        
        setSubmitError(result.error || 'Error al enviar el formulario');
      }
    } catch {
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-2xl z-50 p-8 overflow-y-auto"
          >
            <div className="flex justify-end">
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            <div className="mt-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-green-800">¡Mensaje Enviado!</h2>
              <p className="text-gray-600 mb-6">
                Tu mensaje ha sido enviado exitosamente a nuestro equipo. 
                Te contactaremos pronto.
              </p>
              <button
                onClick={handleClose}
                className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Cerrar
              </button>
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
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-2xl z-50 p-8 overflow-y-auto"
        >
          <div className="flex justify-end">
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            
                                      {/* Mostrar errores del formulario */}
             {submitError && (
               <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
                 <AlertCircle className="w-5 h-5 mr-2" />
                 <span>{submitError}</span>
               </div>
             )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center ml-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Send message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


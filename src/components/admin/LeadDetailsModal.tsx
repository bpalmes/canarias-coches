"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Car, 
  Calendar, 
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Edit3,
  Save,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (leadId: string, updates: Partial<Lead>) => void;
  onDelete: (leadId: string) => void;
}

export default function LeadDetailsModal({
  lead,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}: LeadDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setEditedLead({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        carMake: lead.carMake,
        carModel: lead.carModel,
        carYear: lead.carYear,
        carLicensePlate: lead.carLicensePlate,
        carStockNumber: lead.carStockNumber,
        source: lead.source,
        medium: lead.medium,
        campaign: lead.campaign,
        sheetName: lead.sheetName
      });
    }
  }, [lead]);

  if (!lead || !isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(lead.id, editedLead);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este lead? Esta acción no se puede deshacer.')) {
      await onDelete(lead.id);
      onClose();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Enviado a Walcu';
      case 'failed':
        return 'Error en envío';
      default:
        return 'Pendiente de envío';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {lead.firstName} {lead.lastName}
                </h2>
                <p className="text-sm text-gray-500">
                  Lead ID: {lead.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar lead"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar lead"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información Personal */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Información Personal
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedLead.firstName || ''}
                            onChange={(e) => setEditedLead({...editedLead, firstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                            {lead.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apellido
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedLead.lastName || ''}
                            onChange={(e) => setEditedLead({...editedLead, lastName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                            {lead.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedLead.email || ''}
                          onChange={(e) => setEditedLead({...editedLead, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900">{lead.email}</p>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:text-blue-800"
                            title="Enviar email"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>

                    {(lead.phone || isEditing) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedLead.phone || ''}
                            onChange={(e) => setEditedLead({...editedLead, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-900">{lead.phone}</p>
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-blue-600 hover:text-blue-800"
                              title="Llamar"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {(lead.message || isEditing) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mensaje
                        </label>
                        {isEditing ? (
                          <textarea
                            value={editedLead.message || ''}
                            onChange={(e) => setEditedLead({...editedLead, message: e.target.value})}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md w-full">
                              {lead.message}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Información del Vehículo */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Car className="w-5 h-5 text-green-600" />
                    Información del Vehículo
                  </h3>

                  {lead.car ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        {lead.car.images?.[0] && (
                          <img
                            src={lead.car.images[0].url}
                            alt={`${lead.car.make} ${lead.car.model}`}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {lead.car.make} {lead.car.model} {lead.car.version}
                          </h4>
                          <p className="text-gray-600">
                            {lead.car.year} • {lead.car.numberplate}
                          </p>
                          {lead.car.regularPrice && (
                            <p className="text-lg font-bold text-green-600">
                              €{lead.car.regularPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>SKU:</strong> {lead.car.sku}</p>
                        <p><strong>ID:</strong> {lead.car.id}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {['carMake', 'carModel', 'carYear', 'carLicensePlate', 'carStockNumber'].map((field) => {
                        const value = lead[field as keyof Lead];
                        const label = {
                          carMake: 'Marca',
                          carModel: 'Modelo', 
                          carYear: 'Año',
                          carLicensePlate: 'Matrícula',
                          carStockNumber: 'Número de Stock'
                        }[field];

                        if (!value && !isEditing) return null;

                        // Obtener el valor del campo editado de forma segura
                        const getEditedValue = () => {
                          const editedValue = editedLead[field as keyof typeof editedLead];
                          if (typeof editedValue === 'string' || typeof editedValue === 'number') {
                            return editedValue;
                          }
                          return '';
                        };

                        return (
                          <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {label}
                            </label>
                            {isEditing ? (
                              <input
                                type={field === 'carYear' ? 'number' : 'text'}
                                value={getEditedValue()}
                                onChange={(e) => setEditedLead({
                                  ...editedLead, 
                                  [field]: field === 'carYear' ? parseInt(e.target.value) || null : e.target.value
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              />
                            ) : (
                              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                {value}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Información de Seguimiento */}
              <div className="space-y-6">
                {/* Estado de Walcu */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    Estado de Walcu CRM
                  </h3>

                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor(lead.walcuStatus)}`}>
                      {getStatusIcon(lead.walcuStatus)}
                      <div>
                        <p className="font-medium">{getStatusText(lead.walcuStatus)}</p>
                        {lead.walcuLeadId && (
                          <p className="text-sm opacity-75">ID: {lead.walcuLeadId}</p>
                        )}
                      </div>
                    </div>

                    {lead.walcuError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-red-900">Error en el envío:</p>
                          <p className="text-sm text-red-700">{lead.walcuError}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadatos */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-orange-600" />
                    Metadatos del Lead
                  </h3>

                  <div className="space-y-3">
                    {['source', 'medium', 'campaign', 'sheetName'].map((field) => {
                      const value = lead[field as keyof Lead];
                      const label = {
                        source: 'Fuente',
                        medium: 'Medio',
                        campaign: 'Campaña',
                        sheetName: 'Hoja de Origen'
                      }[field];

                      if (!value && !isEditing) return null;

                      // Obtener el valor del campo editado de forma segura
                      const getEditedValue = () => {
                        const editedValue = editedLead[field as keyof typeof editedLead];
                        if (typeof editedValue === 'string' || typeof editedValue === 'number') {
                          return editedValue;
                        }
                        return '';
                      };

                      return (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {label}
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={getEditedValue()}
                              onChange={(e) => setEditedLead({...editedLead, [field]: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                              {value}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fechas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    Fechas
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de creación
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Última actualización
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formatDate(lead.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {isEditing && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedLead({
                    firstName: lead.firstName,
                    lastName: lead.lastName,
                    email: lead.email,
                    phone: lead.phone,
                    message: lead.message,
                    carMake: lead.carMake,
                    carModel: lead.carModel,
                    carYear: lead.carYear,
                    carLicensePlate: lead.carLicensePlate,
                    carStockNumber: lead.carStockNumber,
                    source: lead.source,
                    medium: lead.medium,
                    campaign: lead.campaign
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Save className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Guardar Cambios
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

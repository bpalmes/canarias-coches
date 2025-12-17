"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Car,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  FileSpreadsheet,
  Send,
  Sheet,
  FileText
} from 'lucide-react';
import GoogleSheetsImporter from '@/components/admin/GoogleSheetsImporter';
import LeadDetailsModal from '@/components/admin/LeadDetailsModal';
import AutoImportButton from '@/components/admin/AutoImportButton';
import { Lead, LeadsResponse } from '@/types/lead';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [statusSummary, setStatusSummary] = useState<Record<string, number>>({});
  const [showImporter, setShowImporter] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [sendingToWalcu, setSendingToWalcu] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [bulkSending, setBulkSending] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Cargar leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        status: statusFilter,
        ...(search && { search })
      });

      const response = await fetch(`/api/admin/leads?${params}`);
      const result: LeadsResponse = await response.json();

      if (result.success) {
        setLeads(result.data.leads);
        setPagination(result.data.pagination);
        setStatusSummary(result.data.statusSummary);
      } else {
        setError('Error cargando leads');
      }
    } catch {
      setError('Error de conexión');
          } finally {
        setLoading(false);
      }
    }, [currentPage, statusFilter, search]);

  // Cargar leads al cambiar filtros o página
  useEffect(() => {
    fetchLeads();
  }, [currentPage, statusFilter, search, fetchLeads]);


  // Eliminar lead
  const deleteLead = async (leadId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este lead?')) return;

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== leadId));
        fetchLeads(); // Recargar para actualizar contadores
      }
    } catch (err) {
      console.error('Error eliminando lead:', err);
    }
  };

  // Actualizar lead
  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === leadId ? { ...lead, ...updates } : lead
        ));
        fetchLeads(); // Recargar para actualizar contadores
      }
    } catch (err) {
      console.error('Error actualizando lead:', err);
    }
  };

  // Enviar lead a Walcu
  const sendToWalcu = async (leadId: string) => {
    setSendingToWalcu(leadId);
    
    try {
      const response = await fetch(`/api/admin/leads/${leadId}/send-to-walcu`, {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        // Actualizar el lead en la lista
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { 
                ...lead, 
                walcuStatus: 'sent' as const, 
                walcuLeadId: result.data.walcuLeadId,
                walcuError: undefined 
              }
            : lead
        ));
        
        alert('Lead enviado exitosamente a Walcu como tasación');
      } else {
        // Actualizar el lead con el error
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { 
                ...lead, 
                walcuStatus: 'failed' as const, 
                walcuError: result.error 
              }
            : lead
        ));
        
        alert(`Error enviando a Walcu: ${result.error}`);
      }
    } catch (error) {
      console.error('Error enviando lead a Walcu:', error);
      alert('Error de conexión al enviar a Walcu');
    } finally {
      setSendingToWalcu(null);
    }
  };

  // Abrir detalles del lead
  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  // Manejar selección de leads
  const toggleLeadSelection = (leadId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const selectAllLeads = () => {
    const eligibleLeads = leads.filter(lead => lead.walcuStatus !== 'sent');
    setSelectedLeads(new Set(eligibleLeads.map(lead => lead.id)));
  };

  const clearSelection = () => {
    setSelectedLeads(new Set());
  };

  // Envío masivo a Walcu
  const bulkSendToWalcu = async () => {
    if (selectedLeads.size === 0) {
      alert('Selecciona al menos un lead para enviar');
      return;
    }

    if (!confirm(`¿Enviar ${selectedLeads.size} leads a Walcu como tasaciones?`)) {
      return;
    }

    setBulkSending(true);
    
    try {
      const response = await fetch('/api/admin/leads/bulk-send-to-walcu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: Array.from(selectedLeads) })
      });

      const result = await response.json();

      if (result.success) {
        // Actualizar los leads en la lista
        setLeads(prev => prev.map(lead => {
          if (selectedLeads.has(lead.id)) {
            return { ...lead, walcuStatus: 'sent' as const, walcuError: undefined };
          }
          return lead;
        }));
        
        clearSelection();
        fetchLeads(); // Recargar para obtener los datos actualizados
        
        alert(`Proceso completado: ${result.data.sent} enviados, ${result.data.failed} fallidos`);
        
        if (result.data.errors.length > 0) {
          console.log('Errores en envío masivo:', result.data.errors);
        }
      } else {
        alert(`Error en envío masivo: ${result.error}`);
      }
    } catch (error) {
      console.error('Error en envío masivo:', error);
      alert('Error de conexión durante el envío masivo');
    } finally {
      setBulkSending(false);
    }
  };

  // Obtener icono de estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  // Obtener color de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return `Hoy ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para agregar logs
  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString('es-ES');
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    setLogs(prev => [logMessage, ...prev].slice(0, 100)); // Mantener solo los últimos 100 logs
  };

  // Limpiar logs
  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Leads
              </h1>
              <p className="text-gray-600">
                Administra todos los leads recibidos y su estado de envío a Walcu CRM
              </p>
            </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
              showLogs 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            {showLogs ? 'Ocultar Logs' : 'Ver Logs'}
            {logs.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                {logs.length}
              </span>
            )}
          </button>
          <AutoImportButton
            onImportComplete={() => {
              fetchLeads(); // Recargar leads después de importar
            }}
            onLog={addLog}
          />
          <button
            onClick={() => setShowImporter(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Configurar Importación
          </button>
          
          {/* Controles de selección masiva */}
          {selectedLeads.size > 0 && (
            <>
              <button
                onClick={bulkSendToWalcu}
                disabled={bulkSending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {bulkSending ? (
                  <>
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar {selectedLeads.size} a Walcu
                  </>
                )}
              </button>
              <button
                onClick={clearSelection}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center gap-2 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Limpiar Selección
              </button>
            </>
          )}
          
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
          </div>
        </div>

        {/* Sección de Logs */}
        {showLogs && (
          <div className="mb-6 bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold">Logs de Importación y Walcu</h3>
              <button
                onClick={clearLogs}
                className="text-gray-400 hover:text-white text-xs bg-gray-700 px-2 py-1 rounded"
              >
                Limpiar
              </button>
            </div>
            {logs.length === 0 ? (
              <div className="text-gray-500 italic">No hay logs disponibles</div>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`${
                      log.includes('ERROR') ? 'text-red-400' :
                      log.includes('SUCCESS') ? 'text-green-400' :
                      log.includes('WARNING') ? 'text-yellow-400' :
                      'text-gray-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statusSummary.pending || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enviados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statusSummary.sent || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fallidos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statusSummary.failed || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination.total}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email, coche..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="sent">Enviados</option>
                <option value="failed">Fallidos</option>
              </select>

              <button
                onClick={fetchLeads}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de leads */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Cargando leads...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <XCircle className="w-8 h-8 mx-auto text-red-400 mb-4" />
              <p className="text-red-500">{error}</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-8 h-8 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No se encontraron leads</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-44">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLeads.size > 0 && selectedLeads.size === leads.filter(l => l.walcuStatus !== 'sent').length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            selectAllLeads();
                          } else {
                            clearSelection();
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Cliente
                    </div>
                  </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Vehículo
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                        Mensaje
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Estado Walcu
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                        Origen
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                        Fecha
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => openLeadDetails(lead)}
                      >
                        {/* ID */}
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">
                          <div className="font-mono">
                            {lead.facebookLeadId ? (
                              <span className="text-blue-600" title={lead.facebookLeadId}>
                                {lead.facebookLeadId.replace('l:', '')}
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                #{lead.id.slice(-6)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Cliente */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 mr-3">
                              <input
                                type="checkbox"
                                checked={selectedLeads.has(lead.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleLeadSelection(lead.id);
                                }}
                                disabled={lead.walcuStatus === 'sent'}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                              />
                            </div>
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {lead.firstName} {lead.lastName}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {lead.email}
                              </div>
                              {lead.phone && (
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Vehículo */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          {lead.car ? (
                            <div className="flex items-center">
                              {lead.car.images?.[0] ? (
                                <img
                                  src={lead.car.images[0].url}
                                  alt={`${lead.car.make} ${lead.car.model}`}
                                  className="h-10 w-10 rounded object-cover mr-3"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3">
                                  <Car className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {lead.car.make} {lead.car.model}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {lead.car.year} • {lead.car.numberplate}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              {lead.carMake} {lead.carModel}
                              {lead.carYear && ` • ${lead.carYear}`}
                            </div>
                          )}
                        </td>

                        {/* Mensaje */}
                        <td className="px-3 py-3">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {lead.message ? (
                              <div className="flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="truncate">
                                  {lead.message.length > 50 
                                    ? `${lead.message.substring(0, 50)}...` 
                                    : lead.message
                                  }
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">Sin mensaje</span>
                            )}
                          </div>
                        </td>

                        {/* Estado Walcu */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(lead.walcuStatus)}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.walcuStatus)}`}>
                              {lead.walcuStatus === 'sent' ? 'Enviado' : 
                               lead.walcuStatus === 'failed' ? 'Fallido' : 'Pendiente'}
                            </span>
                          </div>
                          {lead.walcuLeadId && (
                            <div className="text-xs text-gray-500 mt-1">
                              ID: {lead.walcuLeadId}
                            </div>
                          )}
                          {lead.walcuError && (
                            <div className="text-xs text-red-500 mt-1 max-w-xs truncate">
                              {lead.walcuError}
                            </div>
                          )}
                        </td>

                        {/* Hoja de Origen */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          {lead.sheetName ? (
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-green-100 rounded">
                                <Sheet className="w-3 h-3 text-green-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {lead.sheetName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Google Sheets
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-gray-100 rounded">
                                <User className="w-3 h-3 text-gray-400" />
                              </div>
                              <div className="text-sm text-gray-500">
                                Manual
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Fecha */}
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(lead.createdAt)}
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {lead.walcuStatus !== 'sent' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sendToWalcu(lead.id);
                                }}
                                disabled={sendingToWalcu === lead.id}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Enviar a Walcu como tasación"
                              >
                                {sendingToWalcu === lead.id ? (
                                  <>
                                    <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    Enviando...
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-3 h-3" />
                                    Enviar a Walcu
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded">
                                <CheckCircle className="w-3 h-3" />
                                Enviado
                              </span>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLead(lead.id);
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {pagination.pages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                      disabled={currentPage === pagination.pages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span>
                        {' '}a{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * pagination.limit, pagination.total)}
                        </span>
                        {' '}de{' '}
                        <span className="font-medium">{pagination.total}</span>
                        {' '}resultados
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Google Sheets Importer Modal */}
        <GoogleSheetsImporter
          isOpen={showImporter}
          onClose={() => setShowImporter(false)}
          onImportComplete={() => {
            setShowImporter(false);
            fetchLeads(); // Recargar leads después de importar
          }}
        />

        {/* Lead Details Modal */}
        <LeadDetailsModal
          lead={selectedLead}
          isOpen={showLeadDetails}
          onClose={() => {
            setShowLeadDetails(false);
            setSelectedLead(null);
          }}
          onUpdate={updateLead}
          onDelete={deleteLead}
        />
      </div>
    </div>
  );
}

'use client'

import { useState, useEffect } from 'react'
import { getB2BRequests, updateB2BRequestStatus } from '@/app/actions/b2b'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react'

export function B2BLeadsTab() {
    const { data: session } = useSession()
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        loadLeads()
    }, [])

    const loadLeads = async () => {
        try {
            const data = await getB2BRequests()
            setLeads(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (requestId: string, status: string) => {
        setUpdating(requestId)
        try {
            await updateB2BRequestStatus(requestId, status)
            toast({
                title: "Estado actualizado",
                description: `Solicitud marcada como ${status}`,
            })
            // Update local state
            setLeads(leads.map(l => l.id === requestId ? { ...l, status } : l))
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo actualizar el estado",
                variant: "destructive"
            })
        } finally {
            setUpdating(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>
            case 'ACCEPTED': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Aceptada</Badge>
            case 'REJECTED': return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rechazada</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    if (loading) {
        return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-500" /></div>
    }

    if (leads.length === 0) {
        return <div className="text-center py-10 text-gray-500">No hay solicitudes B2B pendientes.</div>
    }

    return (
        <div className="space-y-4">
            {leads.map((lead) => {
                const isSeller = session?.user?.dealershipId === lead.sellerId
                const isBuyer = session?.user?.dealershipId === lead.buyerId

                return (
                    <div key={lead.id} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex gap-4 items-center">
                            {lead.car?.images?.[0]?.url && (
                                <img src={lead.car.images[0].url} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                            )}
                            <div>
                                <h3 className="font-bold text-sm">
                                    {lead.car?.make?.name} {lead.car?.model?.name} <span className="text-gray-400 font-normal">({lead.car?.year})</span>
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {isSeller ? `Interesado: ${lead.buyer?.name}` : `Vendedor: ${lead.seller?.name}`}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Solicitado el {new Date(lead.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {getStatusBadge(lead.status)}

                            {isSeller && lead.status === 'PENDING' && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                        onClick={() => handleUpdateStatus(lead.id, 'ACCEPTED')}
                                        disabled={!!updating}
                                    >
                                        Aceptar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => handleUpdateStatus(lead.id, 'REJECTED')}
                                        disabled={!!updating}
                                    >
                                        Rechazar
                                    </Button>
                                </div>
                            )}

                            {isBuyer && (
                                <p className="text-xs text-blue-600 font-medium">
                                    {lead.status === 'ACCEPTED' ? '¡Contacta al vendedor ahora!' : 'Esperando respuesta...'}
                                </p>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

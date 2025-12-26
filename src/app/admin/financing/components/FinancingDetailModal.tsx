'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Loader2, Save, Mail, Printer } from "lucide-react"
import { useState, useEffect } from "react"
import { getFinancingRequestDetails, updateFinancingFullData } from "@/actions/crm-financing-details-actions"
import { FinancingHolderData, FinancingVehicleData, BankStatusMap } from "../types-details"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FinancingDetailModalProps {
    requestId: string | null
    isOpen: boolean
    onClose: () => void
}

const BANK_OPTIONS = ["BBVA", "SANTANDER", "CAIXA", "CETELEM", "SOFINCO", "LENDROCK"]
const BANK_STATUSES = ["pendiente", "aprobada", "denegada", "condicionada", "firmada", "no_presentada"]

export function FinancingDetailModal({ requestId, isOpen, onClose }: FinancingDetailModalProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>(null)

    // Form States
    const [holder, setHolder] = useState<FinancingHolderData>({})
    const [coHolder, setCoHolder] = useState<FinancingHolderData>({})
    const [banks, setBanks] = useState<BankStatusMap>({})

    useEffect(() => {
        if (isOpen && requestId) {
            loadData(requestId)
        }
    }, [isOpen, requestId])

    async function loadData(id: string) {
        setLoading(true)
        const res = await getFinancingRequestDetails(id)
        if (res.success && res.data) {
            setData(res.data)
            setHolder((res.data as any).holderData as FinancingHolderData || {})
            setCoHolder((res.data as any).coHolderData as FinancingHolderData || {})
            setBanks((res.data as any).bankStatuses as BankStatusMap || {})
        } else {
            toast({ title: "Error", description: "No se pudieron cargar los datos", variant: "destructive" })
            onClose()
        }
        setLoading(false)
    }

    async function handleSave() {
        if (!requestId) return
        setLoading(true)

        const res = await updateFinancingFullData(requestId, {
            holderData: holder,
            coHolderData: coHolder,
            bankStatuses: banks
        })

        if (res.success) {
            toast({ title: "Guardado", description: "Datos actualizados correctamente" })
            // Optional: Reload data
        } else {
            toast({ title: "Error", description: "Fallo al guardar", variant: "destructive" })
        }
        setLoading(false)
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 rounded-t-lg">
                    <div>
                        <DialogTitle className="text-xl">Ficha de Financiación</DialogTitle>
                        <DialogDescription>
                            {loading ? "Cargando..." : `${data?.lead?.firstName} ${data?.lead?.lastName} - ${data?.car?.make?.name} ${data?.car?.model?.name}`}
                        </DialogDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Imprimir</Button>
                        <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-2" /> Enviar Email</Button>
                        <Button size="sm" onClick={handleSave} disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar
                        </Button>
                    </div>
                </div>

                {loading && !data ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <Tabs defaultValue="summary" className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-6 pt-2 border-b">
                            <TabsList>
                                <TabsTrigger value="summary">Resumen y Bancos</TabsTrigger>
                                <TabsTrigger value="holders">Titulares</TabsTrigger>
                                <TabsTrigger value="vehicle">Vehículo y Operación</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 p-6 bg-white overflow-y-auto">
                            <TabsContent value="summary" className="mt-0 space-y-6">
                                {/* Bank Matrix */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Estado por Entidad</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {BANK_OPTIONS.map(bank => {
                                            const status = banks[bank] || "no_presentada"
                                            return (
                                                <div key={bank} className="p-3 border rounded-lg bg-slate-50">
                                                    <Label className="font-bold text-gray-700">{bank}</Label>
                                                    <Select value={status} onValueChange={(val) => setBanks(prev => ({ ...prev, [bank]: val }))}>
                                                        <SelectTrigger className="mt-1 h-8 text-xs bg-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {BANK_STATUSES.map(s => (
                                                                <SelectItem key={s} value={s} className="text-xs">
                                                                    {s.replace('_', ' ').toUpperCase()}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="holders" className="mt-0">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Titular */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg border-b pb-2">Titular</h3>
                                        <HolderForm data={holder} onChange={setHolder} />
                                    </div>
                                    {/* Cotitular */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg border-b pb-2">Cotitular</h3>
                                        <HolderForm data={coHolder} onChange={setCoHolder} />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="vehicle" className="mt-0">
                                <div className="text-gray-500 text-sm">
                                    Datos del vehículo (Snapshot) y detalles económicos. (Pendiente de implementación completa)
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    )
}

// Sub-component for Holder Fields
function HolderForm({ data, onChange }: { data: FinancingHolderData, onChange: (d: FinancingHolderData) => void }) {
    const handleChange = (field: keyof FinancingHolderData, val: string) => {
        onChange({ ...data, [field]: val })
    }

    return (
        <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label>Nombre</Label>
                    <Input value={data.name || ''} onChange={e => handleChange('name', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <Label>Apellidos</Label>
                    <Input value={data.surname || ''} onChange={e => handleChange('surname', e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label>DNI/NIE</Label>
                    <Input value={data.dni || ''} onChange={e => handleChange('dni', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <Label>Móvil</Label>
                    <Input value={data.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
                </div>
            </div>
            <div className="space-y-1">
                <Label>Email</Label>
                <Input value={data.email || ''} onChange={e => handleChange('email', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label>Dirección</Label>
                <Input value={data.address || ''} onChange={e => handleChange('address', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label>Empresa</Label>
                    <Input value={data.employmentStatus || ''} placeholder="Nombre empresa" onChange={e => handleChange('employmentStatus', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <Label>Nómina (€)</Label>
                    <Input value={data.salary || ''} type="number" onChange={e => handleChange('salary', e.target.value)} />
                </div>
            </div>
        </div>
    )
}

'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, User, Phone, Mail, Car, History, Building2, Wallet, Users, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { getLeadDetails, updateLeadDetails } from "@/actions/crm-lead-actions"
import { useToast } from "@/components/ui/use-toast"
import { LeadStatus } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FinancingHolderData, FinancingFinancialData, BankStatusMap } from "../../financing/types-details"

interface CRMLeadDetailModalProps {
    leadId: string | null
    isOpen: boolean
    onClose: () => void
}

const STATUS_OPTIONS: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST']
const BANK_OPTIONS = ["BBVA", "SANTANDER", "CAIXA", "CETELEM", "SOFINCO", "LENDROCK", "CONFIA"]
const BANK_STATUSES = ["pendiente", "aprobada", "denegada", "condicionada", "firmada", "no_presentada", "aprobada_firmada"]

export function CRMLeadDetailModal({ leadId, isOpen, onClose }: CRMLeadDetailModalProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [lead, setLead] = useState<any>(null)

    // Basic Lead Data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: '',
        source: '',
        medium: '',
        campaign: '',
        message: ''
    })

    // Financing Data
    const [holder, setHolder] = useState<FinancingHolderData>({})
    const [coHolder, setCoHolder] = useState<FinancingHolderData>({})
    const [financial, setFinancial] = useState<FinancingFinancialData>({})
    const [banks, setBanks] = useState<BankStatusMap>({})

    useEffect(() => {
        if (isOpen && leadId) {
            loadData(leadId)
        }
    }, [isOpen, leadId])

    async function loadData(id: string) {
        setLoading(true)
        const res = await getLeadDetails(id)
        if (res.success && res.data) {
            setLead(res.data)
            const l = res.data
            setFormData({
                firstName: l.firstName || '',
                lastName: l.lastName || '',
                email: l.email || '',
                phone: l.phone || '',
                status: l.status,
                source: l.source || '',
                medium: l.medium || '',
                campaign: l.campaign || '',
                message: l.message || ''
            })

            // Load Financing Request Data if exists
            const fr = l.financingRequest
            if (fr) {
                setHolder(fr.holderData as FinancingHolderData || {})
                setCoHolder(fr.coHolderData as FinancingHolderData || {})
                setFinancial(fr.financialDetails as FinancingFinancialData || {})
                setBanks(fr.bankStatuses as BankStatusMap || {})
            } else {
                // Initialize Holder with Lead Data as default suggestion (optional, or stick to user request of highlighting)
                // User said "highlight those that came from form".
                // So maybe we PRE-FILL them for convenience?
                // Let's pre-fill Holder Name/Email/Phone from Lead if empty
                setHolder(prev => ({
                    ...prev,
                    name: l.firstName,
                    surname: l.lastName || undefined,
                    email: l.email,
                    phone: l.phone || undefined
                }))
            }
        } else {
            toast({ title: "Error", description: "No se pudo cargar el lead", variant: "destructive" })
            onClose()
        }
        setLoading(false)
    }

    async function handleSave() {
        if (!leadId) return
        setSaving(true)

        // Combine all data
        const payload = {
            ...formData,
            financing: {
                holderData: holder,
                coHolderData: coHolder,
                financialData: financial,
                bankStatuses: banks
            }
        }

        const res = await updateLeadDetails(leadId, payload)
        if (res.success) {
            toast({ title: "Guardado", description: "Datos actualizados correctamente" })
        } else {
            toast({ title: "Error", description: "Fallo al guardar", variant: "destructive" })
        }
        setSaving(false)
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 rounded-t-lg shrink-0">
                    <div>
                        <DialogTitle className="text-xl">Ficha del Cliente</DialogTitle>
                        <DialogDescription>
                            {loading ? "Cargando..." : `${formData.firstName} ${formData.lastName}`}
                        </DialogDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave} disabled={loading || saving}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar Cambios
                        </Button>
                    </div>
                </div>

                {loading && !lead ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-6 pt-2 border-b bg-white shrink-0">
                            <TabsList className="flex justify-start gap-1 w-fit h-auto p-1 bg-slate-100 rounded-md">
                                <TabsTrigger value="info" className="text-xs h-7 px-3 data-[state=active]:shadow-sm"><FileText className="w-3 h-3 mr-1.5" /> Info Lead</TabsTrigger>
                                <TabsTrigger value="titular" className="text-xs h-7 px-3 data-[state=active]:shadow-sm"><User className="w-3 h-3 mr-1.5" /> Titular</TabsTrigger>
                                <TabsTrigger value="cotitular" className="text-xs h-7 px-3 data-[state=active]:shadow-sm"><Users className="w-3 h-3 mr-1.5" /> Cotitular</TabsTrigger>
                                <TabsTrigger value="economic" className="text-xs h-7 px-3 data-[state=active]:shadow-sm"><Wallet className="w-3 h-3 mr-1.5" /> Económico</TabsTrigger>
                                <TabsTrigger value="banks" className="text-xs h-7 px-3 data-[state=active]:shadow-sm"><Building2 className="w-3 h-3 mr-1.5" /> Bancos</TabsTrigger>
                                <TabsTrigger value="car" className="text-xs h-7 px-3 data-[state=active]:shadow-sm"><Car className="w-3 h-3 mr-1.5" /> Vehículo</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-slate-50/50">
                            <div className="p-6">
                                <TabsContent value="titular" className="mt-0">
                                    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                                        <h3 className="font-semibold text-lg border-b pb-2 mb-4">Datos del Titular</h3>
                                        <ExtendedHolderForm
                                            data={holder}
                                            onChange={setHolder}
                                            leadData={{ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone }}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="cotitular" className="mt-0">
                                    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                                        <h3 className="font-semibold text-lg border-b pb-2 mb-4">Datos del Cotitular</h3>
                                        <ExtendedHolderForm
                                            data={coHolder}
                                            onChange={setCoHolder}
                                        // No highlighting for co-holder usually
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="economic" className="mt-0">
                                    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                                        <h3 className="font-semibold text-lg border-b pb-2 mb-4">Datos Económicos Operación</h3>
                                        <FinancialOperationForm
                                            data={financial}
                                            onChange={setFinancial}
                                            carPrice={lead?.car?.price}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="banks" className="mt-0">
                                    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                                        <h3 className="font-semibold text-lg border-b pb-2">Estado Solicitudes Bancarias</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {BANK_OPTIONS.map(bank => {
                                                const status = banks[bank] || "no_presentada"
                                                return (
                                                    <div key={bank} className="p-3 border rounded-lg bg-slate-50">
                                                        <Label className="font-bold text-gray-700 block mb-2">{bank}</Label>
                                                        <Select value={status} onValueChange={(val) => setBanks(prev => ({ ...prev, [bank]: val }))}>
                                                            <SelectTrigger className="h-8 text-xs bg-white w-full">
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

                                <TabsContent value="info" className="mt-0">
                                    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                                        <h3 className="font-semibold text-lg border-b pb-2">Información Básica del Lead</h3>
                                        {/* Basic Info Inputs */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Nombre</Label>
                                                <Input value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Apellidos</Label>
                                                <Input value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Teléfono</Label>
                                                <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Mensaje Original</Label>
                                            <Textarea value={formData.message} disabled className="bg-slate-50" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-semibold mt-4">Actividad</h3>
                                            {lead?.activities?.length > 0 ? (
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {lead.activities.map((act: any) => (
                                                        <div key={act.id} className="text-sm p-2 bg-slate-50 border rounded">
                                                            <span className="font-bold">{act.type}</span>: {act.summary}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <p className="text-sm text-gray-400">Sin historial.</p>}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="car" className="mt-0">
                                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                                        {lead?.car ? (
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {lead.car.images?.[0] && (
                                                    <img
                                                        src={lead.car.images[0].url}
                                                        className="w-full md:w-1/2 rounded-lg object-cover border"
                                                        alt="Car"
                                                    />
                                                )}
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="text-2xl font-bold">{lead.car.make.name} {lead.car.model.name}</h3>
                                                        <p className="text-gray-500 text-lg">{lead.car.version}</p>
                                                    </div>
                                                    <div className="text-3xl font-bold text-blue-600">
                                                        {lead.car.price?.toLocaleString()} €
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-10 text-gray-400">No hay vehículo vinculado</div>
                                        )}
                                    </div>
                                </TabsContent>
                            </div>
                        </div>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    )
}

// --- Subcomponents ---

function ExtendedHolderForm({ data, onChange, leadData }: { data: FinancingHolderData, onChange: (d: FinancingHolderData) => void, leadData?: any }) {
    const handleChange = (field: keyof FinancingHolderData, val: any) => {
        onChange({ ...data, [field]: val })
    }

    // Highlighting Logic: Green if matches source lead data (meaning it came from form)
    // Actually user said "Subraya con un verde suave los que ya venían del formulario"
    // So if data.value === leadData.value, style it.
    const getStyle = (val: string | undefined, leadVal: string | undefined) => {
        if (!val || !leadVal) return ""
        // Loose comparison and trimming
        if (typeof val === 'string' && typeof leadVal === 'string' && val.trim().toLowerCase() === leadVal.trim().toLowerCase()) {
            return "bg-green-50 border-green-300 ring-green-100" // Soft green highlight
        }
        return ""
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label>Nombre</Label>
                <Input
                    value={data.name || ''}
                    onChange={e => handleChange('name', e.target.value)}
                    className={leadData ? getStyle(data.name, leadData.firstName) : ""}
                />
            </div>
            <div className="space-y-1">
                <Label>Apellidos</Label>
                <Input
                    value={data.surname || ''}
                    onChange={e => handleChange('surname', e.target.value)}
                    className={leadData ? getStyle(data.surname, leadData.lastName) : ""}
                />
            </div>
            <div className="space-y-1">
                <Label>DNI/NIE</Label>
                <Input value={data.dni || ''} onChange={e => handleChange('dni', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label>V.T.O (Caducidad DNI)</Label>
                <Input value={data.vto || ''} onChange={e => handleChange('vto', e.target.value)} placeholder="DD/MM/AAAA" />
            </div>
            <div className="space-y-1">
                <Label>Movil</Label>
                <Input
                    value={data.phone || ''}
                    onChange={e => handleChange('phone', e.target.value)}
                    className={leadData ? getStyle(data.phone, leadData.phone) : ""}
                />
            </div>
            <div className="space-y-1">
                <Label>Fecha Nacimiento</Label>
                <Input value={data.birthDate || ''} onChange={e => handleChange('birthDate', e.target.value)} placeholder="DD/MM/AAAA" />
            </div>
            <div className="space-y-1">
                <Label>Nacionalidad</Label>
                <Input value={data.nationality || 'Esp'} onChange={e => handleChange('nationality', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label>País Nacimiento</Label>
                <Input value={data.country || 'España'} onChange={e => handleChange('country', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label>Email</Label>
                <Input
                    value={data.email || ''}
                    onChange={e => handleChange('email', e.target.value)}
                    className={leadData ? getStyle(data.email, leadData.email) : ""}
                />
            </div>
            <div className="space-y-1">
                <Label>Dirección</Label>
                <Input value={data.address || ''} onChange={e => handleChange('address', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label>C.P.</Label>
                <Input value={data.postalCode || ''} onChange={e => handleChange('postalCode', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label>Población</Label>
                <Input value={data.city || ''} onChange={e => handleChange('city', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label>Tipo Contrato</Label>
                <Input value={data.contractType || ''} onChange={e => handleChange('contractType', e.target.value)} placeholder="100, 200, Indefinido..." />
            </div>
            <div className="space-y-1">
                <Label>Empresa</Label>
                <Input value={data.company || ''} onChange={e => handleChange('company', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label>Antigüedad</Label>
                <Input value={data.seniority || ''} onChange={e => handleChange('seniority', e.target.value)} placeholder="DD/MM/AAAA" />
            </div>
            <div className="space-y-1">
                <Label>Imp. Nómina (€)</Label>
                <Input value={data.salary || ''} type="number" onChange={e => handleChange('salary', parseFloat(e.target.value))} />
            </div>
            <div className="space-y-1">
                <Label>Tipo Cliente</Label>
                <Input value={data.clientType || 'asalariado'} onChange={e => handleChange('clientType', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label>IBAN</Label>
                <Input value={data.iban || ''} onChange={e => handleChange('iban', e.target.value)} placeholder="ES..." />
            </div>
        </div>
    )
}

function FinancialOperationForm({ data, onChange, carPrice }: { data: FinancingFinancialData, onChange: (d: FinancingFinancialData) => void, carPrice?: number }) {
    const handleChange = (field: keyof FinancingFinancialData, val: any) => {
        onChange({ ...data, [field]: val })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label>PVP Vehículo</Label>
                <Input value={carPrice?.toString() || '0'} disabled className="bg-slate-100" />
            </div>
            <div className="space-y-1">
                <Label>Entrada (€)</Label>
                <Input value={data.entry || ''} type="number" onChange={e => handleChange('entry', parseFloat(e.target.value))} />
            </div>
            <div className="space-y-1">
                <Label>Importe a Financiar</Label>
                <Input value={data.amountToFinance || ''} type="number" onChange={e => handleChange('amountToFinance', parseFloat(e.target.value))} />
            </div>
            <div className="space-y-1">
                <Label>Plazo (Meses)</Label>
                <Input value={data.term || ''} type="number" onChange={e => handleChange('term', parseFloat(e.target.value))} />
            </div>
            <div className="space-y-1">
                <Label>Cuota Mensual (€)</Label>
                <Input value={data.monthlyFee || ''} type="number" onChange={e => handleChange('monthlyFee', parseFloat(e.target.value))} />
            </div>
            <div className="space-y-1">
                <Label>TIN / Interés (%)</Label>
                <Input value={data.tin || ''} type="number" onChange={e => handleChange('tin', parseFloat(e.target.value))} />
            </div>
            <div className="space-y-1">
                <Label>Comisión Total</Label>
                <Input value={data.commission || ''} type="number" onChange={e => handleChange('commission', parseFloat(e.target.value))} />
            </div>
        </div>
    )
}

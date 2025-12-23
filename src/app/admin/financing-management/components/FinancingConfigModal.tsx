'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { updateDealershipFinancing } from '@/actions/financing-management'

interface Entity {
    id: number
    name: string
    code: string
}

interface InterestRate {
    id: number
    name: string
    value: number
}

interface DealershipData {
    id: number
    name: string
    financingEnabled: boolean
    usePlatformFinancing: boolean
    enableWithInsurance: boolean
    enableWithoutInsurance: boolean
    enabledFinancialEntities: Entity[]
    enabledInterestRates: InterestRate[]
}

interface FinancingConfigModalProps {
    isOpen: boolean
    onClose: () => void
    dealership: DealershipData
    allEntities: Entity[]
    allInterestRates: InterestRate[]
    onUpdate: () => void
}

export default function FinancingConfigModal({ isOpen, onClose, dealership, allEntities, allInterestRates, onUpdate }: FinancingConfigModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [config, setConfig] = useState({
        financingEnabled: dealership.financingEnabled,
        usePlatformFinancing: dealership.usePlatformFinancing,
        enableWithInsurance: dealership.enableWithInsurance,
        enableWithoutInsurance: dealership.enableWithoutInsurance,
        enabledEntities: dealership.enabledFinancialEntities?.map(e => e.id) || [],
        enabledRates: dealership.enabledInterestRates?.map(r => r.id) || []
    })

    const handleSave = async () => {
        setIsLoading(true)
        try {
            await updateDealershipFinancing(dealership.id, {
                financingEnabled: config.financingEnabled,
                usePlatformFinancing: config.usePlatformFinancing,
                enableWithInsurance: config.enableWithInsurance,
                enableWithoutInsurance: config.enableWithoutInsurance,
                enabledEntities: config.enabledEntities,
                enabledRates: config.enabledRates
            })
            onUpdate()
            onClose()
        } catch (error) {
            console.error("Save failed", error)
            alert("Error al guardar la configuración")
        } finally {
            setIsLoading(false)
        }
    }

    const toggleEntity = (entityId: number) => {
        setConfig(prev => {
            const current = prev.enabledEntities
            if (current.includes(entityId)) {
                return { ...prev, enabledEntities: current.filter(id => id !== entityId) }
            } else {
                return { ...prev, enabledEntities: [...current, entityId] }
            }
        })
    }

    const toggleRate = (rateId: number) => {
        setConfig(prev => {
            const current = prev.enabledRates
            if (current.includes(rateId)) {
                return { ...prev, enabledRates: current.filter(id => id !== rateId) }
            } else {
                return { ...prev, enabledRates: [...current, rateId] }
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Configuración Financiación: {dealership.name}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Master Switches */}
                    <div className="space-y-4 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="master-enable" className="font-semibold text-base">Habilitar Módulo Financiación</Label>
                                <p className="text-sm text-gray-500">Activa la pestaña de financiación y herramientas para el concesionario.</p>
                            </div>
                            <Switch
                                id="master-enable"
                                checked={config.financingEnabled}
                                onCheckedChange={(c) => setConfig(prev => ({ ...prev, financingEnabled: c }))}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <Label htmlFor="platform-financing" className="font-semibold text-base">Modelo de Financiación</Label>
                                <p className="text-sm text-gray-500">
                                    {config.usePlatformFinancing ? 'Génesis (Plataforma)' : 'Privada (Propia del Dealer)'}
                                </p>
                            </div>
                            <Switch
                                id="platform-financing"
                                checked={config.usePlatformFinancing}
                                onCheckedChange={(c) => setConfig(prev => ({ ...prev, usePlatformFinancing: c }))}
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-4 border-b pb-4">
                        <Label className="text-base font-semibold">Opciones de Cálculo</Label>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="with-insurance">Permitir Cuota Con Seguro</Label>
                            <Switch
                                id="with-insurance"
                                checked={config.enableWithInsurance}
                                onCheckedChange={(c) => setConfig(prev => ({ ...prev, enableWithInsurance: c }))}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="without-insurance">Permitir Cuota Sin Seguro</Label>
                            <Switch
                                id="without-insurance"
                                checked={config.enableWithoutInsurance}
                                onCheckedChange={(c) => setConfig(prev => ({ ...prev, enableWithoutInsurance: c }))}
                            />
                        </div>
                    </div>

                    {/* Entities Selector */}
                    <div className="space-y-3 border-b pb-4">
                        <Label className="text-base font-semibold">Entidades Financieras Habilitadas</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {allEntities.map(entity => (
                                <div key={entity.id} className="flex items-center space-x-2 border p-2 rounded hover:bg-gray-50">
                                    <Switch
                                        id={`entity-${entity.id}`}
                                        checked={config.enabledEntities.includes(entity.id)}
                                        onCheckedChange={() => toggleEntity(entity.id)}
                                    />
                                    <Label htmlFor={`entity-${entity.id}`} className="cursor-pointer text-sm">
                                        {entity.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interest Rates Selector */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Tipos de Interés Habilitados</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {allInterestRates.map(rate => (
                                <div key={rate.id} className="flex items-center space-x-2 border p-2 rounded hover:bg-gray-50">
                                    <Switch
                                        id={`rate-${rate.id}`}
                                        checked={config.enabledRates.includes(rate.id)}
                                        onCheckedChange={() => toggleRate(rate.id)}
                                    />
                                    <Label htmlFor={`rate-${rate.id}`} className="cursor-pointer text-sm">
                                        {rate.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isLoading}>{isLoading ? 'Guardando...' : 'Guardar Cambios'}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

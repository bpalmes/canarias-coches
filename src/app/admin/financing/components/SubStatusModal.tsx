'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useEffect } from "react"
import { FinancingStatus } from "@prisma/client"
import { FINANCING_LABELS, SUB_STATUS_OPTIONS } from "../types"

interface SubStatusModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (subStatus: string) => void
    targetStatus: FinancingStatus | null
}

export function SubStatusModal({ isOpen, onClose, onConfirm, targetStatus }: SubStatusModalProps) {
    const [selected, setSelected] = useState<string>("")

    const options = targetStatus ? SUB_STATUS_OPTIONS[targetStatus] : []

    useEffect(() => {
        if (isOpen) setSelected("")
    }, [isOpen])

    if (!targetStatus || !options) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Detalle de {FINANCING_LABELS[targetStatus]}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Label className="text-sm text-gray-500">
                        Seleccione el estado específico de la operación:
                    </Label>
                    <RadioGroup value={selected} onValueChange={setSelected} className="gap-3">
                        {options.map((opt) => (
                            <div key={opt} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(opt)}>
                                <RadioGroupItem value={opt} id={opt} />
                                <Label htmlFor={opt} className="cursor-pointer font-medium">{opt}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={() => onConfirm(selected)} disabled={!selected}>Confirmar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

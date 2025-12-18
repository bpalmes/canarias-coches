"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllDealerships, setImpersonation } from "@/app/actions/testing"
import { Loader2 } from "lucide-react"

interface DealershipSwitcherProps {
    currentImpersonatedId?: number
}

export function DealershipSwitcher({ currentImpersonatedId }: DealershipSwitcherProps) {
    const [dealerships, setDealerships] = useState<{ id: number; name: string; slug: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [switching, setSwitching] = useState(false)

    useEffect(() => {
        getAllDealerships().then((data) => {
            setDealerships(data)
            setLoading(false)
        })
    }, [])

    const handleValueChange = async (value: string) => {
        setSwitching(true)
        try {
            if (value === "CLEAR") {
                await setImpersonation("CLEAR")
            } else {
                await setImpersonation(value)
            }
            // Page will reload due to revalidatePath in action, but we can also force reload if needed
            // Window reload is safer to reflect all state changes
            window.location.reload()
        } catch (error) {
            console.error(error)
            setSwitching(false)
        }
    }

    if (loading) {
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden lg:inline-block">Vista:</span>
            <Select
                disabled={switching}
                value={currentImpersonatedId?.toString() || "CLEAR"}
                onValueChange={handleValueChange}
            >
                <SelectTrigger className="w-[180px] h-8 text-xs bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Seleccionar vista" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="CLEAR">
                        <span className="font-semibold text-blue-600">Super Admin (Global)</span>
                    </SelectItem>
                    {dealerships.map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                            {d.name} {d.slug.startsWith('test') ? '(Test)' : ''}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

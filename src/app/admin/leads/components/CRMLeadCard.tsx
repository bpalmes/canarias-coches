'use client'

import { KanbanLead } from "../types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarClock, Star, Phone, Mail, User, Send, Loader2, Maximize2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { sendLeadToWalcuAction } from "@/actions/public-lead-actions"

interface CRMLeadCardProps {
    lead: KanbanLead
    isSuperAdmin?: boolean
    onExpand?: () => void
}

export function CRMLeadCard({ lead, isSuperAdmin, onExpand }: CRMLeadCardProps) {
    const { toast } = useToast()
    const [sendingWalcu, setSendingWalcu] = useState(false)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: lead.id,
        data: {
            lead,
            type: 'LEAD'
        }
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    // Activity Status Color Logic
    const nextActivity = lead.activities[0]
    let activityColor = "text-gray-400"
    if (nextActivity) {
        if (!nextActivity.dueDate) {
            activityColor = "text-gray-400"
        } else {
            const now = new Date()
            const due = new Date(nextActivity.dueDate)
            if (due < now) activityColor = "text-red-500" // Overdue
            else if (due.toDateString() === now.toDateString()) activityColor = "text-yellow-500" // Today
            else activityColor = "text-green-500" // Future
        }
    } else {
        // No activity scheduled - warning in Odoo philosophy
        activityColor = "text-gray-300"
    }

    const handleSendToWalcu = async (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault() // Safety

        if (sendingWalcu) return
        setSendingWalcu(true)

        try {
            const res = await sendLeadToWalcuAction(lead.id)
            if (res.success) {
                toast({
                    title: "Enviado a Walcu",
                    description: "El lead se ha sincronizado correctamente.",
                    className: "bg-green-600 text-white border-green-700"
                })
            } else {
                toast({
                    title: "Error de sincronización",
                    description: res.error || "No se pudo conectar con Walcu",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error inesperado",
                variant: "destructive"
            })
        } finally {
            setSendingWalcu(false)
        }
    }

    // Wrap onExpand to stop propagation
    const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation()
        onExpand?.()
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 touch-none">
            <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border-l-4"
                style={{ borderLeftColor: getActivityBorderColor(activityColor) }}>
                <CardContent className="p-3 pb-2 space-y-2">
                    {/* Header: Name & Priority */}
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm truncate pr-2 text-gray-900">
                            {lead.firstName} {lead.lastName}
                        </h4>
                        <div className="flex gap-0.5 shrink-0">
                            {[1, 2].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${s <= lead.priority ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Car Info */}
                    {lead.car && (
                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-md border border-slate-100">
                            {lead.car.images[0] ? (
                                <img src={lead.car.images[0].url} className="w-8 h-8 rounded object-cover" alt="Car" />
                            ) : (
                                <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                                    <span className="text-[8px] text-gray-500">N/A</span>
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-xs font-medium truncate text-gray-700">{lead.car.make.name} {lead.car.model.name}</p>
                                <p className="text-[10px] text-gray-500">{lead.car.price?.toLocaleString()} €</p>
                            </div>
                        </div>
                    )}

                    {/* Quick Tags */}
                    {lead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {lead.tags.map(tag => (
                                <div key={tag.id} className="h-1.5 w-6 rounded-full" style={{ backgroundColor: tag.color }} title={tag.name} />
                            ))}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="p-3 pt-0 flex justify-between items-center text-xs text-gray-500 relative">
                    <div className="flex items-center gap-2">
                        <CalendarClock className={`w-3.5 h-3.5 ${activityColor}`} />
                        {nextActivity ? (
                            <span className={activityColor === "text-red-500" ? "font-bold text-red-600" : ""}>
                                {nextActivity.type.slice(0, 3)}
                            </span>
                        ) : (
                            <span>-</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Expand Button */}
                        {onExpand && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-slate-100 rounded-full"
                                onClick={handleExpand}
                                title="Ver detalles"
                            >
                                <Maximize2 className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600" />
                            </Button>
                        )}

                        {isSuperAdmin && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-slate-100 rounded-full"
                                onClick={handleSendToWalcu}
                                disabled={sendingWalcu || lead.walcuStatus === 'sent'}
                                title={lead.walcuStatus === 'sent' ? "Sincronizado con Walcu" : "Enviar a Walcu"}
                            >
                                {sendingWalcu ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                                ) : (
                                    <Send className={`w-3.5 h-3.5 ${lead.walcuStatus === 'sent' ? 'text-green-500' : 'text-slate-400 hover:text-blue-600'}`} />
                                )}
                            </Button>
                        )}

                        {lead.assignedTo ? (
                            <Avatar className="w-5 h-5">
                                <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700">
                                    {lead.assignedTo.name?.[0] || lead.assignedTo.email[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <User className="w-4 h-4 text-gray-300" />
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

function getActivityBorderColor(textColorClass: string) {
    if (textColorClass.includes('red')) return '#ef4444'
    if (textColorClass.includes('yellow')) return '#eab308'
    if (textColorClass.includes('green')) return '#22c55e'
    return 'transparent'
}

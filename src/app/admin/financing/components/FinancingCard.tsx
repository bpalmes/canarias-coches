'use client'

import { KanbanFinancingReq } from "../types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Euro, User, Car } from "lucide-react"

interface FinancingCardProps {
    req: KanbanFinancingReq
}

export function FinancingCard({ req }: FinancingCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: req.id,
        data: {
            req,
            type: 'FINANCING'
        }
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2 touch-none">
            <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border-l-4 border-l-blue-500">
                <CardContent className="p-3 pb-2 space-y-2">
                    {/* Header: Name */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 truncate">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span>{req.lead.firstName} {req.lead.lastName}</span>
                        </div>
                    </div>

                    {/* Car */}
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-md border border-slate-100">
                        {req.car.images[0] ? (
                            <img src={req.car.images[0].url} className="w-8 h-8 rounded object-cover" alt="Car" />
                        ) : (
                            <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                                <Car className="w-4 h-4 text-gray-400" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-xs font-medium truncate text-gray-700">{req.car.make.name} {req.car.model.name}</p>
                        </div>
                    </div>

                    {/* Sub Status Badge */}
                    {req.subStatus && (
                        <div className="flex">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-yellow-50 text-yellow-700 border-yellow-200 font-normal">
                                {req.subStatus}
                            </Badge>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="p-2 bg-slate-50 border-t flex justify-between items-center text-xs text-gray-500">
                    <span className="flex items-center gap-1 font-medium text-gray-700">
                        <Euro className="w-3 h-3" />
                        {req.amount.toLocaleString()} €
                    </span>
                    <span className="text-[10px] text-gray-400">
                        {new Date(req.updatedAt).toLocaleDateString()}
                    </span>
                </CardFooter>
            </Card>
        </div>
    )
}

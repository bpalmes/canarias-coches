'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanFinancingReq } from '../types'
import { FinancingCard } from './FinancingCard'
import { FinancingStatus } from '@prisma/client'

interface FinancingKanbanColumnProps {
    id: FinancingStatus
    title: string
    reqs: KanbanFinancingReq[]
}

export function FinancingKanbanColumn({ id, title, reqs }: FinancingKanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id
    })

    const totalAmount = reqs.reduce((acc, r) => acc + r.amount, 0)

    return (
        <div ref={setNodeRef} className="flex-1 min-w-0 bg-slate-100/50 rounded-lg flex flex-col max-h-full border border-slate-200">
            {/* Header */}
            <div className="p-2 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-lg sticky top-0 z-10">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-semibold text-xs text-slate-700 truncate">{title}</span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0">
                        {reqs.length}
                    </span>
                </div>
            </div>

            {/* Sortable List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                <SortableContext items={reqs.map(r => r.id)} strategy={verticalListSortingStrategy}>
                    {reqs.map(req => (
                        <FinancingCard key={req.id} req={req} />
                    ))}
                    {reqs.length === 0 && (
                        <div className="h-16 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-[10px] text-slate-400">
                            Vacío
                        </div>
                    )}
                </SortableContext>
            </div>

            {/* Footer Summary */}
            {totalAmount > 0 && (
                <div className="p-1.5 text-[10px] text-center text-slate-400 border-t border-slate-200 bg-slate-50 rounded-b-lg">
                    {totalAmount.toLocaleString()} €
                </div>
            )}
        </div>
    )
}

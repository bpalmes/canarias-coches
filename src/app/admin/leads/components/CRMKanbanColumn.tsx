'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanLead } from '../types'
import { CRMLeadCard } from './CRMLeadCard'
import { Plus } from 'lucide-react'
import { LeadStatus } from '@prisma/client'

interface KanbanColumnProps {
    id: LeadStatus
    title: string
    leads: KanbanLead[]
    isSuperAdmin: boolean
    onLeadClick?: (id: string) => void
}

export function KanbanColumn({ id, title, leads, isSuperAdmin, onLeadClick }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id
    })

    // Compute total value (if available) - Just for nice UI
    const totalValue = leads.reduce((acc, l) => acc + (l.car?.price || 0), 0)

    return (
        <div ref={setNodeRef} className="flex-1 min-w-0 bg-slate-100/50 rounded-lg flex flex-col max-h-full border border-slate-200">
            {/* Header */}
            <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-lg sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-700">{title}</span>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        {leads.length}
                    </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded">
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Sortable List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {leads.map(lead => (
                        <CRMLeadCard
                            key={lead.id}
                            lead={lead}
                            isSuperAdmin={isSuperAdmin}
                            onExpand={() => onLeadClick?.(lead.id)}
                        />
                    ))}
                    {leads.length === 0 && (
                        <div className="h-20 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-xs text-slate-400">
                            Arrastra aquí
                        </div>
                    )}
                </SortableContext>
            </div>

            {/* Footer Summary */}
            {totalValue > 0 && (
                <div className="p-2 text-xs text-center text-slate-400 border-t border-slate-200 bg-slate-50 rounded-b-lg">
                    ~ {totalValue.toLocaleString()} € potenciales
                </div>
            )}
        </div>
    )
}

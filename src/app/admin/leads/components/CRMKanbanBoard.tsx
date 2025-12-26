'use client'

import { useState, useEffect } from 'react'
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanLead } from '../types'
import { CRMLeadCard } from './CRMLeadCard'
import { KanbanColumn } from './CRMKanbanColumn'
import { updateLeadStatus } from '@/actions/crm-lead-actions'
import { LeadStatus } from '@prisma/client'
import { useToast } from "@/components/ui/use-toast"
import { CRMLeadDetailModal } from './CRMLeadDetailModal'

interface CRMKanbanBoardProps {
    initialLeads: KanbanLead[]
    isSuperAdmin: boolean
}

const COLUMNS: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST']

const COLUMN_LABELS: Record<LeadStatus, string> = {
    NEW: 'Nuevo',
    CONTACTED: 'Contactado',
    QUALIFIED: 'Cualificado',
    PROPOSAL_SENT: 'Propuesta',
    NEGOTIATION: 'Negociación',
    WON: 'Ganado',
    LOST: 'Perdido'
}

export function CRMKanbanBoard({ initialLeads, isSuperAdmin }: CRMKanbanBoardProps) {
    const { toast } = useToast()
    const [leads, setLeads] = useState<KanbanLead[]>(initialLeads)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [detailId, setDetailId] = useState<string | null>(null)

    // Sensors for drag detection
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Prevent accidental drags
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Sort leads into columns
    // We compute this on render to act as "Selectors"
    // But for DnD performance, we maintain a flat list 'leads' and filter in columns

    function findContainer(id: string) {
        // If sorting container (Status)
        if (COLUMNS.includes(id as LeadStatus)) return id as LeadStatus

        // If it's an item, find its status
        const item = leads.find(l => l.id === id)
        return item?.status
    }

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        // Find parent containers
        const activeContainer = findContainer(activeId as string)
        const overContainer = findContainer(overId as string)

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return
        }

        // Optimistic Update during Drag Over (optional for smooth UX, but complex)
        // For simple Kanban, we usually just let it snap on drop or modify list temporarily
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeLead = leads.find(l => l.id === activeId)
        if (!activeLead) return

        let newStatus: LeadStatus | undefined

        // Dropped over a Column (Container)
        if (COLUMNS.includes(overId as LeadStatus)) {
            newStatus = overId as LeadStatus
        }
        // Dropped over another Item
        else {
            const overLead = leads.find(l => l.id === overId)
            if (overLead) {
                newStatus = overLead.status
            }
        }

        if (newStatus && newStatus !== activeLead.status) {
            // Optimistic UI Update
            const oldStatus = activeLead.status

            setLeads(prev => prev.map(l =>
                l.id === activeId ? { ...l, status: newStatus! } : l
            ))

            // Server Action
            try {
                const res = await updateLeadStatus(activeId, newStatus)
                if (!res.success) throw new Error(res.error)
            } catch (error) {
                // Revert on failure
                setLeads(prev => prev.map(l =>
                    l.id === activeId ? { ...l, status: oldStatus } : l
                ))
                toast({ title: "Error al mover", description: "No se pudo actualizar el estado", variant: "destructive" })
            }
        }
    }

    const activeLead = activeId ? leads.find(l => l.id === activeId) : null

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full w-full gap-2 p-2 items-start">
                {COLUMNS.map(status => (
                    <KanbanColumn
                        key={status}
                        id={status}
                        title={COLUMN_LABELS[status]}
                        leads={leads.filter(l => l.status === status)}
                        isSuperAdmin={isSuperAdmin}
                        onLeadClick={(id) => setDetailId(id)}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeLead ? <CRMLeadCard lead={activeLead} isSuperAdmin={isSuperAdmin} /> : null}
            </DragOverlay>

            <CRMLeadDetailModal
                isOpen={!!detailId}
                leadId={detailId}
                onClose={() => setDetailId(null)}
            />
        </DndContext>
    )
}

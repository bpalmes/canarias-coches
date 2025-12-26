'use client'

import { useState } from 'react'
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
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanFinancingReq, FINANCING_COLUMNS, FINANCING_LABELS, SUB_STATUS_OPTIONS } from '../types'
import { FinancingCard } from './FinancingCard'
import { FinancingKanbanColumn } from './FinancingKanbanColumn'
import { SubStatusModal } from './SubStatusModal'
import { FinancingDetailModal } from './FinancingDetailModal'
import { updateFinancingStatus } from '@/actions/crm-financing-actions'
import { FinancingStatus } from '@prisma/client'
import { useToast } from "@/components/ui/use-toast"

interface FinancingKanbanBoardProps {
    initialReqs: KanbanFinancingReq[]
}

export function FinancingKanbanBoard({ initialReqs }: FinancingKanbanBoardProps) {
    const { toast } = useToast()
    const [reqs, setReqs] = useState<KanbanFinancingReq[]>(initialReqs)
    const [activeId, setActiveId] = useState<string | null>(null)

    // View Details State
    const [detailId, setDetailId] = useState<string | null>(null)

    // Interception State
    const [pendingMove, setPendingMove] = useState<{ reqId: string, newStatus: FinancingStatus } | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        let newStatus: FinancingStatus | undefined
        if (FINANCING_COLUMNS.includes(overId as FinancingStatus)) {
            newStatus = overId as FinancingStatus
        } else {
            const overItem = reqs.find(r => r.id === overId)
            if (overItem) newStatus = overItem.status
        }

        const activeItem = reqs.find(r => r.id === activeId)
        if (!activeItem || !newStatus || newStatus === activeItem.status) return

        const options = SUB_STATUS_OPTIONS[newStatus]
        if (options && options.length > 0) {
            setPendingMove({ reqId: activeId, newStatus })
            setIsModalOpen(true)
        } else {
            performMove(activeId, newStatus, null)
        }
    }

    const performMove = async (reqId: string, status: FinancingStatus, subStatus: string | null) => {
        const originalReq = reqs.find(r => r.id === reqId)
        if (!originalReq) return

        setReqs(prev => prev.map(r =>
            r.id === reqId ? { ...r, status, subStatus: subStatus || null } : r
        ))

        try {
            const res = await updateFinancingStatus(reqId, status, subStatus)
            if (!res.success) throw new Error(res.error)
        } catch (error) {
            setReqs(prev => prev.map(r => r.id === reqId ? originalReq : r))
            toast({ title: "Error", description: "No se pudo actualizar el estado", variant: "destructive" })
        }
    }

    const handleModalConfirm = (subStatus: string) => {
        if (pendingMove) {
            performMove(pendingMove.reqId, pendingMove.newStatus, subStatus)
        }
        setIsModalOpen(false)
        setPendingMove(null)
    }

    const activeItem = activeId ? reqs.find(r => r.id === activeId) : null

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full w-full gap-2 p-2 items-start">
                {FINANCING_COLUMNS.map(status => (
                    <FinancingKanbanColumn
                        key={status}
                        id={status}
                        title={FINANCING_LABELS[status]}
                        reqs={reqs.filter(r => r.status === status)}
                        onReqClick={(id) => setDetailId(id)}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeItem ? <FinancingCard req={activeItem} /> : null}
            </DragOverlay>

            <SubStatusModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setPendingMove(null) }}
                onConfirm={handleModalConfirm}
                targetStatus={pendingMove?.newStatus || null}
            />

            <FinancingDetailModal
                isOpen={!!detailId}
                requestId={detailId}
                onClose={() => setDetailId(null)}
            />
        </DndContext>
    )
}

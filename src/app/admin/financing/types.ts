import { FinancingRequest, FinancingStatus } from "@prisma/client"

export type KanbanFinancingReq = FinancingRequest & {
    lead: {
        firstName: string
        lastName: string | null
    }
    car: {
        make: { name: string }
        model: { name: string }
        images: { url: string }[]
        price: number | null
    }
}

export const FINANCING_COLUMNS: FinancingStatus[] = [
    'NEW',
    'STUDY',
    'APPROVED',
    'PENDING_SIGNATURE',
    'PENDING_PAYMENT',
    'FORMALIZED',
    'RETHINK',
    'DENIED',
    'FAILED'
]

export const FINANCING_LABELS: Record<FinancingStatus, string> = {
    NEW: 'Sin Estado',
    STUDY: 'En Estudio',
    APPROVED: 'Aprobada',
    PENDING_SIGNATURE: 'Pdte. Firma',
    PENDING_PAYMENT: 'Pdte. Pago',
    FORMALIZED: 'Formalizada',
    RETHINK: 'Replanteada',
    DENIED: 'Denegada',
    FAILED: 'Incidencias'
}

export const SUB_STATUS_OPTIONS: Partial<Record<FinancingStatus, string[]>> = {
    STUDY: ['Estándar', 'Aportación Documentación', 'Aportación Aval'],
    APPROVED: ['No firmada', 'Pago de Contado'],
    PENDING_SIGNATURE: ['Frio', 'Caliente'],
    FORMALIZED: ['Estándar', 'Coche Devuelto'],
    RETHINK: ['Estándar', 'Formalizada', 'Denegada', 'Aceptada No firmada'],
    DENIED: ['Estándar', 'Pago de contado'],
    FAILED: ['Fraude', 'Duplicidad Operación']
}

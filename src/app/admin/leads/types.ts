import { Lead, LeadActivity, LeadTag, LeadStatus } from "@prisma/client"

export type KanbanLead = {
    id: string
    firstName: string
    lastName: string | null
    email: string | null
    phone: string | null
    source: string | null
    medium: string | null
    campaign: string | null
    status: LeadStatus
    priority: number
    createdAt: Date
    updatedAt: Date
    dealershipId: number | null
    walcuStatus: string | null
    car: {
        id: number
        make: { name: string }
        model: { name: string }
        price: number
        images: { url: string }[]
    } | null
    assignedTo: {
        name: string | null
        email: string
    } | null
    activities: {
        id: string
        type: string
        dueDate: Date
        isDone: boolean
    }[]
    tags: {
        id: string
        name: string
        color: string
    }[]
}

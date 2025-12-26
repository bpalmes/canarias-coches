import { Lead, LeadActivity, LeadTag, LeadStatus } from "@prisma/client"

export type KanbanLead = Lead & {
    car: {
        id: number
        make: { name: string }
        model: { name: string }
        version: string
        price: number | null
        images: { url: string }[]
    } | null
    assignedTo: {
        id: number
        name: string | null
        email: string
    } | null
    activities: LeadActivity[] // Usually restricted to 1 in fetch, but array structure
    tags: LeadTag[]
}

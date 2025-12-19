'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Papa from 'papaparse'

export type FinancialConfigRow = {
    id: number
    entityName: string
    campaign: string // 'VN' | 'VO'
    rate: number
    term: number
    type: string // 'COEFICIENTE' | 'RENTABILIDAD'
    value: number
    isActive: boolean
}

export type UploadResult = {
    success: boolean
    message: string
    stats?: {
        total: number
        created: number
        updated: number
        errors: number
    }
}

// ... imports

export async function getFinancialConfigurations(
    entityId?: number,
    campaignCode?: string,
    page: number = 1,
    limit: number = 20,
    sortField: string = 'id',
    sortOrder: 'asc' | 'desc' = 'desc',
    calculationType?: string
): Promise<{ data: FinancialConfigRow[], total: number }> {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized")
    }

    const where: any = { isActive: true }

    if (entityId) {
        where.configuration = { entityId: entityId }
    }

    if (campaignCode) {
        where.campaign = { code: campaignCode.toLowerCase() }
    }

    if (calculationType) {
        where.calculationType = calculationType
    }

    // Sorting logic for relational fields
    let orderBy: any = {}
    if (sortField === 'entity') {
        orderBy = { configuration: { entity: { name: sortOrder } } }
    } else if (sortField === 'campaign') {
        orderBy = { campaign: { code: sortOrder } }
    } else if (sortField === 'rate') {
        orderBy = { interestRate: { value: sortOrder } }
    } else if (sortField === 'term') {
        orderBy = { loanTerm: { durationMonths: sortOrder } }
    } else if (sortField === 'type') {
        orderBy = { calculationType: sortOrder }
    } else if (sortField === 'value') {
        orderBy = { value: sortOrder }
    } else {
        orderBy = { id: sortOrder }
    }

    const [details, total] = await Promise.all([
        prisma.financialConfigurationDetail.findMany({
            where,
            include: {
                configuration: { include: { entity: true } },
                campaign: true,
                interestRate: true,
                loanTerm: true
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: orderBy
        }),
        prisma.financialConfigurationDetail.count({ where })
    ])

    const data = details.map(d => ({
        id: d.id,
        entityName: d.configuration.entity.name,
        campaign: d.campaign.code.toUpperCase(),
        rate: Number(d.interestRate.value),
        term: d.loanTerm.durationMonths,
        type: d.calculationType.toUpperCase(),
        value: Number(d.value),
        isActive: d.isActive
    }))

    return { data, total }
}

export async function getAllFinancialEntities() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return []
    }
    return await prisma.financialEntity.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    })
}

export async function uploadFinancialConfiguration(formData: FormData): Promise<UploadResult> {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return { success: false, message: "Unauthorized" }
    }

    const file = formData.get('file') as File
    if (!file) {
        return { success: false, message: "No file provided" }
    }

    const text = await file.text()

    let createdCount = 0
    let updatedCount = 0
    let errorCount = 0

    const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
    })

    if (result.errors.length > 0) {
        return { success: false, message: `CSV Parsing Error: ${result.errors[0].message}` }
    }

    // Ensure Campaigns Exist (VN/VO)
    const campaignsList = ['vn', 'vo']
    for (const code of campaignsList) {
        await prisma.financialCampaign.upsert({
            where: { code },
            update: {},
            create: { name: code === 'vn' ? 'Vehículos Nuevos' : 'Vehículos de Ocasión', code, minVehiculoAgeMonths: code === 'vn' ? 0 : 12, isActive: true }
        })
    }

    // Optimization: Load Catalogs into memory
    // Refetch to ensure we have latest seeded entities
    const [entities, campaigns, rates, terms] = await Promise.all([
        prisma.financialEntity.findMany(),
        prisma.financialCampaign.findMany(),
        prisma.financialInterestRate.findMany(),
        prisma.financialLoanTerm.findMany()
    ])

    const data = result.data as any[]

    for (const row of data) {
        try {
            const entityId = row.entity_id || row.entityId
            if (!entityId) continue

            // Robust Entity Check
            // Use loose comparison (==) to handle string/number mismatch in CSV vs DB
            let entity = entities.find(e => e.id == entityId)

            // STRICT MODE: Do NOT create companies on the fly.
            if (!entity) {
                continue
            }

            if (!entity) {
                // Still failed to resolve entity
                errorCount++
                continue
            }

            let config = await prisma.financialEntityConfiguration.findFirst({
                where: { entityId: entity.id, isLive: true }
            })

            if (!config) {
                config = await prisma.financialEntityConfiguration.create({
                    data: {
                        entityId: entity.id,
                        name: `${entity.name} - Configuración Base`,
                        isLive: true,
                        version: 1
                    }
                })
            }

            // Resolve Campaign
            // 0 -> VN, 1 -> VO, 2 -> VN (legacy?), 'vn'/'vo'
            // Handle typo in CSV header: 'camapaña_tipo'
            const campType = row.campaña_tipo !== undefined ? row.campaña_tipo : row.camapaña_tipo

            let campaignCode = 'vn'
            // Robust loose check
            if (campType == 0 || campType === '0') campaignCode = 'vn'
            else if (campType == 1 || campType === '1') campaignCode = 'vo'
            else if (campType == 2 || campType === '2') campaignCode = 'vn'
            else if (typeof campType === 'string') campaignCode = campType.toLowerCase()

            const campaign = campaigns.find(c => c.code === campaignCode)
            if (!campaign) { errorCount++; continue }

            // Resolve Interest Rate
            const tinVal = parseFloat(row.tin)
            // Robust float comparison
            let rate = rates.find(r => Math.abs(Number(r.value) - tinVal) < 0.001)
            if (!rate) {
                rate = await prisma.financialInterestRate.create({
                    data: { name: `${tinVal}%`, value: tinVal, isActive: true }
                })
                rates.push(rate)
            }

            // Resolve Term
            const termVal = parseInt(row.plazo)
            let term = terms.find(t => t.durationMonths === termVal)
            if (!term) {
                term = await prisma.financialLoanTerm.create({
                    data: { name: `${termVal} meses`, durationMonths: termVal, isActive: true }
                })
                terms.push(term)
            }

            // Resolve Calculation Type
            // 0=coef, 1=rent, 2=rent_ss, 3=coef_ss
            let calcType = 'coeficiente'
            if (row.calculo_tipo == 1 || row.calculo_tipo === 'rentabilidad') calcType = 'rentabilidad'
            else if (row.calculo_tipo == 2) calcType = 'rentabilidad_sin_seguro'
            else if (row.calculo_tipo == 3) calcType = 'coeficiente_sin_seguro'
            else if (row.calculo_tipo == 0 || row.calculo_tipo === 'coeficiente') calcType = 'coeficiente'

            const value = parseFloat(row.valor)

            const existing = await prisma.financialConfigurationDetail.findFirst({
                where: {
                    configurationId: config.id,
                    campaignId: campaign.id,
                    interestRateId: rate.id,
                    loanTermId: term.id,
                    calculationType: calcType
                }
            })

            if (existing) {
                await prisma.financialConfigurationDetail.update({
                    where: { id: existing.id },
                    data: { value: value, isActive: true }
                })
                updatedCount++
            } else {
                await prisma.financialConfigurationDetail.create({
                    data: {
                        configurationId: config.id,
                        campaignId: campaign.id,
                        interestRateId: rate.id,
                        loanTermId: term.id,
                        calculationType: calcType,
                        value: value,
                        isActive: true
                    }
                })
                createdCount++
            }

        } catch (error) {
            console.error(error)
            errorCount++
        }
    }

    return {
        success: true,
        message: `Procesado: ${createdCount} creados, ${updatedCount} actualizados. Errores: ${errorCount} (probablemente entidades/campañas no mapeables).`,
        stats: { total: data.length, created: createdCount, updated: updatedCount, errors: errorCount }
    }
}

export async function resetFinancialSystem(): Promise<{ success: boolean; message: string }> {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized")
    }

    try {
        // 1. Delete all configuration details (The rules)
        const { count: detailsCount } = await prisma.financialConfigurationDetail.deleteMany({})

        // 2. Delete all entity configurations (The versions)
        await prisma.financialEntityConfiguration.deleteMany({})

        // 3. Cleanup Entities
        // The CSV contains IDs: 4, 6, 7, 8, 11, 12, 13.
        const keepers = [4, 6, 7, 8, 11, 12, 13]

        // Delete any entity NOT in the keeper list
        await prisma.financialEntity.deleteMany({
            where: {
                id: { notIn: keepers }
            }
        })

        // 4. Reset Names for Keepers (Remove "Legacy", "CSV-X" suffixes)
        // We set them to standard names. User specified 12 is Santander.
        const names: Record<number, string> = {
            4: 'Cetelem BNP Paribas',
            6: 'Sofinco',
            7: 'Lendrock',
            8: 'Confia Finance',
            11: 'BBVA Consumer Finance',
            12: 'Santander Consumer Finance',
            13: 'CaixaBank Payments & Consumer'
        }

        for (const id of keepers) {
            // Upsert ensures they exist if they were deleted or missing
            await prisma.financialEntity.upsert({
                where: { id },
                update: {
                    name: names[id],
                    // Ensure code is unique. ID 8 and 12 are both Santander.
                    code: id === 12 ? 'SANTANDER_CF_12' : (names[id].toUpperCase().replace(/[^A-Z0-9_]/g, '_').substring(0, 50)),
                    isActive: true
                },
                create: {
                    id, // Force ID
                    name: names[id],
                    code: id === 12 ? 'SANTANDER_CF_12' : (names[id].toUpperCase().replace(/[^A-Z0-9_]/g, '_').substring(0, 50)),
                    isActive: true
                }
            })
        }

        return { success: true, message: `Sistema reseteado. ${detailsCount} reglas eliminadas. Entidades limpiadas (solo quedan las 7 del CSV).` }
    } catch (error) {
        console.error("Reset failed:", error)
        return { success: false, message: "Error al resetear el sistema." }
    }
}

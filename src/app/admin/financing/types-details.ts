export interface FinancingHolderData {
    name?: string
    surname?: string
    dni?: string
    vto?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    postalCode?: string
    birthDate?: string
    nationality?: string
    country?: string
    employmentStatus?: string // 'asalariado', 'autonomo', etc
    contractType?: string
    seniority?: string
    salary?: number
    company?: string
    clientType?: string
    foreigner?: boolean
    iban?: string
}

export interface FinancingVehicleData {
    make?: string
    model?: string
    version?: string
    price?: number
    numberplate?: string
    vin?: string
    kms?: number
    registrationDate?: string
}

export interface FinancingFinancialData {
    priceContado?: number
    priceFinanced?: number
    entry?: number
    amountToFinance?: number
    term?: number
    monthlyFee?: number
    tin?: number
    commission?: number
}

export type BankStatusMap = Record<string, string> // "BBVA": "denied"

import { getDealershipsForFinancing } from "@/actions/financing-management"
import FinancingManagementTable from "./components/FinancingManagementTable"

export default async function FinancingManagementPage() {
    const { dealerships, allEntities, allInterestRates } = await getDealershipsForFinancing()

    return (
        <div className="py-10">
            <header>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Gestión de Financiación</h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-8">
                    <FinancingManagementTable
                        initialData={dealerships}
                        allEntities={allEntities}
                        allInterestRates={allInterestRates}
                    />
                </div>
            </main>
        </div>
    )
}

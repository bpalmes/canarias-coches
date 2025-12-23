'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function InventoryTabs({ showFinancing }: { showFinancing: boolean }) {
    const pathname = usePathname()
    const isFinancing = pathname === '/admin/inventory/financing'

    if (!showFinancing) return null

    return (
        <div className="flex bg-gray-100 p-1 rounded-lg mr-4">
            <Link
                href="/admin/inventory"
                className={`px-4 py-2 text-sm font-medium rounded-md ${!isFinancing ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
                Inventario
            </Link>
            <Link
                href="/admin/inventory/financing"
                className={`px-4 py-2 text-sm font-medium rounded-md ${isFinancing ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
                Financiación
            </Link>
        </div>
    )
}

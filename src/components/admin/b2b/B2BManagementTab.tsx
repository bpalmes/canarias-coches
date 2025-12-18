'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { searchMyInventory, setCarB2B, getMyActiveB2BCars } from '@/app/actions/b2b'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Search, CarFront } from "lucide-react"

export function B2BManagementTab() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [activeB2BCars, setActiveB2BCars] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedCar, setSelectedCar] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Modal state
    const [b2bPrice, setB2BPrice] = useState<string>('')
    const [isAvailable, setIsAvailable] = useState(false)
    const [saving, setSaving] = useState(false)

    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        loadActiveB2BCars()
    }, [])

    const loadActiveB2BCars = async () => {
        try {
            const cars = await getMyActiveB2BCars()
            setActiveB2BCars(cars)
        } catch (error) {
            console.error("Failed to load active B2B cars", error)
        }
    }

    const handleSearch = async () => {
        setLoading(true)
        try {
            const cars = await searchMyInventory(query)
            setResults(cars)
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudieron cargar los coches",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const openModal = (car: any) => {
        setSelectedCar(car)
        setB2BPrice(car.b2bPrice?.toString() || '')
        setIsAvailable(car.isB2BAvailable || false)
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        if (!selectedCar) return
        setSaving(true)

        const priceToSave = b2bPrice ? parseFloat(b2bPrice) : null
        console.log(`[Client] Saving B2B... Car: ${selectedCar.id}, PriceRaw: "${b2bPrice}", PriceParsed: ${priceToSave}, Available: ${isAvailable}`)

        try {
            await setCarB2B(selectedCar.id, priceToSave, isAvailable)
            toast({
                title: "Guardado",
                description: "El estado B2B del coche ha sido actualizado",
            })
            setIsModalOpen(false)
            router.refresh()

            // Refresh local lists
            loadActiveB2BCars()

            // Update search results if present
            setResults(results.map(c =>
                c.id === selectedCar.id
                    ? { ...c, b2bPrice: priceToSave, isB2BAvailable: isAvailable }
                    : c
            ))
        } catch (error) {
            toast({
                title: "Error",
                description: "Falló la actualización",
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    const CarCard = ({ car }: { car: any }) => (
        <div
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${car.isB2BAvailable ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
            onClick={() => openModal(car)}
        >
            <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    {car.images?.[0]?.url && (
                        <img src={car.images[0].url} alt={car.name} className="w-full h-full object-cover" />
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-sm">{car.make?.name} {car.model?.name}</h3>
                    <p className="text-xs text-gray-500">{car.version}</p>
                    <p className="text-xs text-gray-400 mt-1">{car.year} • {car.kms.toLocaleString()} km</p>
                    {car.isB2BAvailable && (
                        <div className="mt-2 text-xs font-bold text-green-700">
                            B2B: {car.b2bPrice?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-8">
            {/* Active B2B Section */}
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CarFront className="h-6 w-6 text-green-600" />
                    Mis Coches Publicados en B2B
                </h2>
                {activeB2BCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeB2BCars.map(car => <CarCard key={car.id} car={car} />)}
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-dashed rounded-lg p-8 text-center text-gray-500">
                        No tienes coches publicados para profesionales actualmente.
                    </div>
                )}
            </div>

            <hr className="border-gray-200" />

            {/* Search Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Añadir coches al mercado B2B</h2>
                <div className="flex gap-4">
                    <Input
                        placeholder="Buscar por matrícula, marca, modelo en tu inventario..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        Buscar
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map(car => <CarCard key={car.id} car={car} />)}
                </div>

                {results.length === 0 && !loading && query && (
                    <p className="text-center text-gray-500 py-10">No se encontraron coches.</p>
                )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gestionar B2B - {selectedCar?.name}</DialogTitle>
                        <DialogDescription>
                            Ajusta la visibilidad y el precio para profesionales.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="b2b-active">Disponible en B2B</Label>
                            <Switch
                                id="b2b-active"
                                checked={isAvailable}
                                onCheckedChange={setIsAvailable}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="b2b-price">Precio B2B (€)</Label>
                            <Input
                                id="b2b-price"
                                type="number"
                                value={b2bPrice}
                                onChange={(e) => setB2BPrice(e.target.value)}
                                placeholder="Ej: 15000"
                            />
                            <p className="text-xs text-gray-500">
                                Precio al Cliente (PVP): {selectedCar?.price?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

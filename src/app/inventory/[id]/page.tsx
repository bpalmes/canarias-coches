import { CarService } from '@/services/car-service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import FinancingCalculator from '../components/FinancingCalculator'
import LeadForm from '../components/LeadForm'

export default async function CarDetailPage({ params }: { params: { id: string } }) {
    const carService = new CarService()

    // Await params as required in Next.js 15+ (sometimes) or just safe practice
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

    if (isNaN(id)) return notFound()

    const car = await carService.getById(id)

    if (!car) return notFound()

    const mainImage = car.images[0]?.url || 'https://placehold.co/800x600?text=No+Image'

    return (
        <div className="bg-white">
            <div className="pt-6 pb-16 sm:pb-24">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ol role="list" className="flex items-center space-x-4">
                        <li><Link href="/inventory" className="text-sm font-medium text-gray-500 hover:text-gray-700">Inventario</Link></li>
                        <li><span className="text-gray-300">/</span></li>
                        <li className="text-sm font-medium text-gray-900">{car.make.name} {car.model.name}</li>
                    </ol>
                </nav>

                <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                        {/* Image Gallery */}
                        <div className="flex flex-col">
                            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                                <img
                                    src={mainImage}
                                    alt={car.name || 'Car Image'}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                        </div>

                        {/* Product info */}
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{car.name || `${car.make.name} ${car.model.name}`}</h1>

                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl tracking-tight text-gray-900">{car.price.toLocaleString('es-ES')} €</p>
                            </div>

                            <div className="mt-6">
                                <h3 className="sr-only">Description</h3>
                                <div className="space-y-6 text-base text-gray-700" dangerouslySetInnerHTML={{ __html: car.description || '' }} />
                            </div>

                            <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                <div className="border-t border-gray-200 pt-4">
                                    <dt className="font-medium text-gray-900">Año</dt>
                                    <dd className="mt-2 text-sm text-gray-500">{car.year}</dd>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <dt className="font-medium text-gray-900">Kms</dt>
                                    <dd className="mt-2 text-sm text-gray-500">{car.kms.toLocaleString()}</dd>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <dt className="font-medium text-gray-900">Versión</dt>
                                    <dd className="mt-2 text-sm text-gray-500">{car.version || '-'}</dd>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <dt className="font-medium text-gray-900">Combustible</dt>
                                    <dd className="mt-2 text-sm text-gray-500">{car.fuel || '-'}</dd>
                                </div>
                            </dl>

                            <div className="mt-10">
                                <FinancingCalculator
                                    price={car.price}
                                    dealershipId={car.dealershipId}
                                    year={car.year}
                                    month={car.month || 1}
                                />
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <LeadForm carId={car.id} dealershipId={car.dealershipId} />
                            </div>

                            <div className="mt-8">
                                <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    Contactar con el Concesionario
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

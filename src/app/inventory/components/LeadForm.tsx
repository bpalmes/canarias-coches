'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// import { useToast } from '@/components/ui/use-toast'

export default function LeadForm({ carId, dealershipId }: { carId: number, dealershipId: number }) {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            carId,
            dealershipId
        }

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!res.ok) throw new Error('Failed to send')

            setSent(true)
        } catch (error) {
            alert('Error al enviar la solicitud. Por favor inténtalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-green-900">¡Mensaje Enviado!</h3>
                <p className="mt-2 text-sm text-green-600">El concesionario se pondrá en contacto contigo pronto.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactar al Vendedor</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <Input name="firstName" required placeholder="Tu nombre" className="mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                        <Input name="lastName" placeholder="Tus apellidos" className="mt-1" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <Input name="email" type="email" required placeholder="tu@email.com" className="mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <Input name="phone" type="tel" placeholder="600 000 000" className="mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                    <Textarea name="message" required placeholder="Estoy interesado en este coche..." className="mt-1" />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
            </form>
        </div>
    )
}

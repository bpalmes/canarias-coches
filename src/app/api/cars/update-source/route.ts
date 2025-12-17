import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        // Actualizar todos los coches existentes para marcarlos como source: "feed"
        const updateResult = await prisma.car.updateMany({
            where: {
                OR: [
                    { source: '' },
                    { source: undefined }
                ]
            },
            data: {
                source: 'feed'
            }
        });

        // Obtener estadísticas actualizadas
        const stats = await prisma.car.groupBy({
            by: ['source'],
            _count: {
                source: true
            }
        });

        return NextResponse.json({
            message: `Actualización completada. ${updateResult.count} coches actualizados.`,
            updatedCount: updateResult.count,
            stats: stats
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        console.error('Update source failed:', errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

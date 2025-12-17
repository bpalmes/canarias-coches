import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { action, source } = await req.json();
        
        if (action === 'delete_sold') {
            // Eliminar coches vendidos
            const deleteResult = await prisma.car.deleteMany({
                where: {
                    isSold: true,
                    source: source || 'feed' // Por defecto solo los del feed
                }
            });
            
            return NextResponse.json({
                message: `${deleteResult.count} coches vendidos eliminados de la base de datos.`,
                deletedCount: deleteResult.count
            });
        } else if (action === 'count_sold') {
            // Contar coches vendidos
            const soldCount = await prisma.car.count({
                where: {
                    isSold: true,
                    source: source || 'feed'
                }
            });
            
            return NextResponse.json({
                soldCount,
                message: `Hay ${soldCount} coches vendidos en la base de datos.`
            });
        } else {
            return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        console.error('Cleanup sold cars failed:', errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

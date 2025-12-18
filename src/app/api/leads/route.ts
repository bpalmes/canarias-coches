import { NextResponse } from 'next/server';
import { LeadService } from '@/services/lead-service';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const leadService = new LeadService();

        // Basic validation
        if (!body.email || !body.firstName) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        const lead = await leadService.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone,
            message: body.message,
            source: 'website',
            dealership: body.dealershipId ? { connect: { id: body.dealershipId } } : undefined,
            car: body.carId ? { connect: { id: body.carId } } : undefined,
        });

        return NextResponse.json(lead, { status: 201 });
    } catch (error) {
        console.error('Error creating lead:', error);
        return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    }
}

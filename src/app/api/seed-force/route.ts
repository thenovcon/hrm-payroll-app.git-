
import { seedDemoData } from '@/lib/actions/seed-demo';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await seedDemoData();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

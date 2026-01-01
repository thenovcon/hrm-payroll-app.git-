
import { seedAdminUser } from '@/lib/actions/auth-actions';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await seedAdminUser();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

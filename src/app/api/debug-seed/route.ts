
import { seedAdminUser } from '@/lib/actions/auth-actions';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('DEBUG_SEED: Route hit');
    try {
        const result = await seedAdminUser();
        console.log('DEBUG_SEED: Result', result);
        return NextResponse.json(result);
    } catch (error) {
        console.error('DEBUG_SEED: Error', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

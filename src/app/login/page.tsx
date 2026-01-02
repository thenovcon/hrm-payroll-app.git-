import LoginForm from '@/components/auth/LoginForm';
import { seedGhanaianDemoData } from '@/lib/actions/seed-actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ seed?: string }> }) {
    const params = await searchParams;
    if (params?.seed === 'true') {
        const result = await seedGhanaianDemoData();
        console.log('Demo Data Seed Result:', result);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--slate-50)' }}>
            <LoginForm />


        </div>
    );
}

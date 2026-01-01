import LoginForm from '@/components/auth/LoginForm';
import { seedAdminUser } from '@/lib/actions/auth-actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ seed?: string }> }) {
    const params = await searchParams;
    if (params?.seed === 'true') {
        const result = await seedAdminUser();
        console.log('Seed result:', result); // Debug log
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--slate-50)' }}>
            <LoginForm />


        </div>
    );
}

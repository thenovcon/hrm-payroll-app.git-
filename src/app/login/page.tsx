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

            <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--slate-400)' }}>
                Dev: <a href="/login?seed=true" style={{ textDecoration: 'underline' }}>Seed Admin User (admin/admin123)</a>
            </p>
        </div>
    );
}

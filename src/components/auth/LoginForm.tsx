'use client';

import { authenticate } from '@/lib/actions/auth-actions';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={pending}>
            {pending ? 'Logging in...' : 'Log in'}
        </button>
    );
}

export default function LoginForm() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <form action={dispatch} className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Welcome Back</h1>
                <p className="text-gray-500">Sign in to HRM System</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '0.5rem' }}>
                    Username
                </label>
                <input
                    className="searchInput"
                    style={{ width: '100%' }}
                    type="text"
                    name="username"
                    placeholder="admin"
                    required
                />
            </div>
            <div style={{ marginBottom: '2rem' }}>
                <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '0.5rem' }}>
                    Password
                </label>
                <input
                    className="searchInput"
                    style={{ width: '100%' }}
                    type="password"
                    name="password"
                    placeholder="••••••"
                    required
                    minLength={6}
                />
                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                    <a href="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary-600)', textDecoration: 'none' }}>
                        Forgot Password?
                    </a>
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <LoginButton />
            </div>

            {errorMessage && (
                <div style={{ color: 'red', fontSize: '0.875rem', textAlign: 'center' }}>
                    {errorMessage}
                </div>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                <p>&copy; {new Date().getFullYear()} Novelty Concepts Ltd.</p>
                <p>All rights reserved.</p>
            </div>
        </form>
    );
}

import React, { useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/lib/actions/email-actions';

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = formData.get('email') as string;

        await requestPasswordReset(email);
        setSubmitted(true);
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center' }}>Reset Password</h1>

                {!submitted ? (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', textAlign: 'center' }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <div>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--slate-300)' }}
                                placeholder="you@company.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ padding: '0.75rem', borderRadius: '6px', fontWeight: 600, background: loading ? '#ccc' : 'var(--primary-600)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Sending...' : 'Reset Password'}
                        </button>

                        <Link href="/login" style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--primary-600)', textDecoration: 'none' }}>
                            Back to Login
                        </Link>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Check your email</h3>
                        <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            If an account exists for that email, we have sent password reset instructions.
                        </p>
                        <Link href="/login" style={{ fontSize: '0.9rem', color: 'var(--primary-600)', fontWeight: 500, textDecoration: 'none' }}>
                            Return to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

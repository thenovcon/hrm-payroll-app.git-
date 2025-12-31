'use client';

import React, { useState } from 'react';
import { submitApplication } from '@/lib/actions/ats-actions';

export default function ApplicationForm({ jobId }: { jobId: string }) {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const result = await submitApplication(formData);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Failed to submit application');
        }
        setSubmitting(false);
    };

    if (success) {
        return (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h4 style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>Application Sent!</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginTop: '0.5rem' }}>
                    Thank you for applying. We'll be in touch.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <input type="hidden" name="jobId" value={jobId} />

            <div className="form-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)' }}>Full Name</label>
                <input name="name" required className="searchInput" style={{ width: '100%' }} placeholder="John Doe" />
            </div>

            <div className="form-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)' }}>Email Address</label>
                <input name="email" type="email" required className="searchInput" style={{ width: '100%' }} placeholder="john@example.com" />
            </div>

            <div className="form-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)' }}>Phone Number</label>
                <input name="phone" className="searchInput" style={{ width: '100%' }} placeholder="+233 ..." />
            </div>

            {error && (
                <p style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.5rem' }}>{error}</p>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
            >
                {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
        </form>
    );
}

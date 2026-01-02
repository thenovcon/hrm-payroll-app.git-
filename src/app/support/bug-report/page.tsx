'use client';

import React, { useRef, useState } from 'react';
import { submitBugReport } from '@/lib/actions/support-actions';
import Link from 'next/link';

export default function BugReportPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(formData: FormData) {
        await submitBugReport(formData);
        formRef.current?.reset();
        setSubmitted(true);
        window.scrollTo(0, 0);
    }

    if (submitted) {
        return (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐞</div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>Report Submitted</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '2rem' }}>
                    Thank you for helping us improve. Your bug report has been logged and forwarded to our engineering team.
                </p>
                <Link href="/" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-600)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--red-600)' }}>Report a Bug</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--slate-600)' }}>
                    Found something broken? Please provide details so we can fix it.
                </p>
            </div>

            <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--slate-50)', padding: '2.5rem', borderRadius: '16px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={labelStyle} htmlFor="title">Bug Title</label>
                        <input type="text" id="title" name="title" required style={inputStyle} placeholder="Short summary of the issue" />
                    </div>

                    <div>
                        <label style={labelStyle} htmlFor="severity">Severity</label>
                        <select id="severity" name="severity" style={inputStyle}>
                            <option value="LOW">Low - Cosmetic</option>
                            <option value="MEDIUM">Medium - Functional</option>
                            <option value="HIGH">High - Major Issue</option>
                            <option value="CRITICAL">Critical - Crash</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={labelStyle} htmlFor="description">Description of Issue</label>
                    <textarea id="description" name="description" required rows={4} style={inputStyle} placeholder="What happened? describe the error..."></textarea>
                </div>

                <div>
                    <label style={labelStyle} htmlFor="steps">Steps to Reproduce</label>
                    <textarea id="steps" name="steps" required rows={4} style={{ ...inputStyle, background: 'var(--orange-50)', borderColor: 'var(--orange-200)' }} placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."></textarea>
                    <small style={{ color: 'var(--slate-500)', marginTop: '0.5rem', display: 'block' }}>Please be as specific as possible.</small>
                </div>

                <div>
                    <label style={labelStyle} htmlFor="expected">Expected Behavior</label>
                    <textarea id="expected" name="expected" rows={3} style={inputStyle} placeholder="What did you expect to happen instead?"></textarea>
                </div>

                <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                    <button type="submit" className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '8px', fontWeight: 600, background: 'var(--red-600)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        Submit Bug Report
                    </button>
                </div>
            </form>
        </div>
    );
}

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--slate-700)'
} as React.CSSProperties;

const inputStyle = {
    width: '100%',
    padding: '0.875rem',
    borderRadius: '8px',
    border: '1px solid var(--slate-300)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: 'white'
} as React.CSSProperties;

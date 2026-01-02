'use client';

import React, { useRef, useState } from 'react';
import { submitSupportTicket } from '@/lib/actions/support-actions';
import Link from 'next/link';

export default function ContactSupportPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(formData: FormData) {
        await submitSupportTicket(formData);
        formRef.current?.reset();
        setSubmitted(true);
        window.scrollTo(0, 0);
    }

    if (submitted) {
        return (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>Request Received</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '2rem' }}>
                    Thank you for contacting us. Your support ticket has been created successfully. <br />
                    Our team will review your request and get back to you shortly.
                </p>
                <Link href="/" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-600)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--slate-900)' }}>Contact Support</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--slate-600)' }}>
                    We're here to help. Tell us what you need assistance with.
                </p>
            </div>

            <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--slate-50)', padding: '2rem', borderRadius: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={labelStyle} htmlFor="category">Category</label>
                        <select id="category" name="category" style={inputStyle}>
                            <option value="General">General Inquiry</option>
                            <option value="Payroll">Payroll / Salary</option>
                            <option value="Leave">Leave & Attendance</option>
                            <option value="Account">Account Access</option>
                            <option value="Technical">Technical Problem</option>
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle} htmlFor="priority">Priority</label>
                        <select id="priority" name="priority" style={inputStyle}>
                            <option value="LOW">Low - General Question</option>
                            <option value="MEDIUM">Medium - Standard Request</option>
                            <option value="HIGH">High - Urgent Issue</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={labelStyle} htmlFor="subject">Subject</label>
                    <input type="text" id="subject" name="subject" required style={inputStyle} placeholder="Brief summary of the issue" />
                </div>

                <div>
                    <label style={labelStyle} htmlFor="message">Message</label>
                    <textarea id="message" name="message" required rows={8} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Please describe your issue in detail so we can assist you better..."></textarea>
                </div>

                <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                    <button type="submit" className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '8px', fontWeight: 600, background: 'var(--primary-600)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        Submit Request
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

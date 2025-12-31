'use client';

import React from 'react';

export default function FeedbackCenter() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-xl font-bold">360° Feedback Center</h3>
                <p className="text-sm text-gray-500">Request and provide anonymous peer reviews for professional growth.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem', background: 'var(--primary-50)' }}>
                    <h4 style={{ fontWeight: 700, color: 'var(--primary-900)' }}>Give Feedback</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', margin: '0.5rem 0 1.5rem 0' }}>
                        You have <strong>3</strong> pending feedback requests from your peers.
                    </p>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <button className="btn btn-primary" style={{ textAlign: 'left', padding: '0.75rem' }}>Review: Samuel Mensah (Peer)</button>
                        <button className="btn btn-primary" style={{ textAlign: 'left', padding: '0.75rem' }}>Review: Fatima Issah (Direct Report)</button>
                        <button className="btn" style={{ border: '1px solid var(--slate-200)', background: 'white' }}>+ Provide Unsolicited Feedback</button>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ fontWeight: 700 }}>Request Feedback</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', margin: '0.5rem 0 1.5rem 0' }}>
                        Invite colleagues to provide feedback on your recent performance.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select className="input" style={{ flex: 1 }}>
                            <option>Select Colleague...</option>
                            <option>Akua Addo</option>
                            <option>John Tetteh</option>
                        </select>
                        <button className="btn btn-primary">Send Request</button>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-400)' }}>ACTIVE REQUESTS</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                            <span>Review of Project X</span>
                            <span style={{ color: '#f59e0b' }}>Pending</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';

export default function Certifications() {
    const [showSignatureModal, setShowSignatureModal] = React.useState(false);

    const certs = [
        { id: 'CERT-001', name: 'John Doe', course: 'Occupational Health & Safety', issueDate: '2024-01-15', expiry: '2025-01-15', status: 'Active' },
        { id: 'CERT-042', name: 'Samuel Mensah', course: 'Advanced TypeScript', issueDate: '2024-02-10', expiry: 'None', status: 'Permanent' },
        { id: 'CERT-015', name: 'Jane Smith', course: 'Data Privacy Compliance', issueDate: '2023-03-20', expiry: '2024-03-20', status: 'Expired' },
    ];

    const handleSign = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Digital Signature Successfully Added!');
        setShowSignatureModal(false);
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Certifications & Compliance</h3>
                    <p className="text-sm text-gray-500">Track professional credentials and mandatory compliance records.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowSignatureModal(true)}
                >
                    Add Digital Signature
                </button>
            </div>

            {showSignatureModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
                }}>
                    <div className="card" style={{ padding: '2rem', width: '400px', background: 'var(--bg-card)' }}>
                        <h4 className="text-lg font-bold mb-4">New Digital Signature</h4>
                        <form onSubmit={handleSign}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="text-sm font-medium">Draw Signature (Type Name)</label>
                                <input
                                    className="searchInput"
                                    style={{ width: '100%', fontFamily: 'cursive', fontSize: '1.25rem' }}
                                    placeholder="Type to sign..."
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="text-sm font-medium">Provider</label>
                                <select className="searchInput" style={{ width: '100%' }}>
                                    <option>Internal e-Sign</option>
                                    <option>DocuSign Integration</option>
                                    <option>Adobe Sign</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn" onClick={() => setShowSignatureModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Signature</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {certs.map((c, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', borderLeft: `5px solid ${c.status === 'Active' ? 'var(--accent-teal)' : c.status === 'Permanent' ? 'var(--primary-500)' : '#ef4444'} ` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--slate-400)' }}>{c.id}</span>
                            <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                color: c.status === 'Active' ? 'var(--accent-teal)' : c.status === 'Permanent' ? 'var(--primary-500)' : '#ef4444'
                            }}>{c.status}</span>
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{c.course}</h4>
                        <p style={{ margin: '0.5rem 0 1rem 0', fontSize: '0.875rem', fontWeight: 600 }}>{c.name}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Issued:</span>
                                <span>{c.issueDate}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Expires:</span>
                                <span>{c.expiry}</span>
                            </div>
                        </div>

                        <button className="btn" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.75rem' }}>Download Certificate</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

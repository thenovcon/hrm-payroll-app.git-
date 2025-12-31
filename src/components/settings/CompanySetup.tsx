'use client';

import React from 'react';

export default function CompanySetup() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Company Profile & Structure</h3>
                    <p className="text-sm text-gray-500">Manage your organization's legal identity and physical locations.</p>
                </div>
                <button className="btn btn-primary">Save Changes</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h4 className="text-sm font-bold" style={{ marginBottom: '1.25rem' }}>General Information</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Legal Company Name</label>
                                <input type="text" className="input" defaultValue="Novcon Ghana Ltd." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Registration Number</label>
                                <input type="text" className="input" defaultValue="CS12345678" />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">HQ Address</label>
                                <input type="text" className="input" defaultValue="Accra Financial Centre, High Street, Accra" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contact Email</label>
                                <input type="email" className="input" defaultValue="hr@novcongh.com" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contact Phone</label>
                                <input type="text" className="input" defaultValue="+233 24 000 0000" />
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h4 className="text-sm font-bold" style={{ marginBottom: '1rem' }}>Branding</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ width: '80px', height: '80px', background: 'var(--slate-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '2rem' }}>🏢</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <button className="btn" style={{ marginBottom: '0.5rem' }}>Change Logo</button>
                                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>Recommended size: 512x512px. Max 2MB.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-sm font-bold" style={{ marginBottom: '1rem' }}>Branches & Locations</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { name: 'Accra HQ', location: 'Greater Accra', type: 'Main Office' },
                            { name: 'Kumasi Branch', location: 'Ashanti Region', type: 'Support Hub' },
                            { name: 'Takoradi Warehouse', location: 'Western Region', type: 'Logistics' },
                        ].map((b, i) => (
                            <div key={i} style={{ padding: '0.75rem', border: '1px solid var(--slate-100)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{b.name}</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-500)' }}>{b.location}</p>
                                </div>
                                <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', border: '1px solid var(--slate-200)', borderRadius: '4px' }}>{b.type}</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn" style={{ width: '100%', marginTop: '1.5rem' }}>+ Add New Branch</button>
                </div>
            </div>
        </div>
    );
}

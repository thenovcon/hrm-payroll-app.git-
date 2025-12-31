'use client';

import { createLeaveRequest } from '@/lib/actions/leave';
import { useState } from 'react';

export default function LeaveRequestForm({ leaveTypes, employees }: { leaveTypes: any[], employees: any[] }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        await createLeaveRequest(formData);
        setLoading(false);
    }

    return (
        <form action={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>New Leave Request</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Employee (Simulated Login)</label>
                    <select name="employeeId" required className="searchInput" style={{ width: '100%' }}>
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Leave Type</label>
                    <select name="leaveTypeId" required className="searchInput" style={{ width: '100%' }}>
                        <option value="">Select Type</option>
                        {leaveTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name} ({type.daysAllowed} days/yr)</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Start Date</label>
                        <input type="date" name="startDate" required className="searchInput" style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>End Date</label>
                        <input type="date" name="endDate" required className="searchInput" style={{ width: '100%' }} />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Reason</label>
                    <textarea name="reason" rows={3} className="searchInput" style={{ width: '100%', fontFamily: 'inherit' }}></textarea>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ border: '1px solid var(--slate-300)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                </button>
            </div>
        </form>
    );
}

'use client';

import React, { useEffect, useState } from 'react';

// This would typically have server actions to update salaries
export default function SalaryManagement() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data for demonstration
    useEffect(() => {
        setTimeout(() => {
            setEmployees([
                { id: '1', firstName: 'Samuel', lastName: 'Mensah', employeeId: 'EMP001', department: 'Engineering', basicSalary: 8500, status: 'ACTIVE' },
                { id: '2', firstName: 'Akua', lastName: 'Addo', employeeId: 'EMP002', department: 'HR', basicSalary: 6200, status: 'ACTIVE' },
                { id: '3', firstName: 'John', lastName: 'Tetteh', employeeId: 'EMP003', department: 'Operations', basicSalary: 4800, status: 'ACTIVE' },
                { id: '4', firstName: 'Fatima', lastName: 'Issah', employeeId: 'EMP004', department: 'Marketing', basicSalary: 5500, status: 'ACTIVE' },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading salary master...</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Employee Salary Master</h3>
                    <p className="text-sm text-gray-500">Manage base salaries, taxable allowances, and benefits.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn">Bulk Import</button>
                    <button className="btn btn-primary">Add Allowance Type</button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--slate-50)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Employee</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Department</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Base Salary (GHS)</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Allowances</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Last Review</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{emp.firstName} {emp.lastName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{emp.employeeId}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>{emp.department}</td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{emp.basicSalary.toLocaleString()}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--slate-100)', borderRadius: '4px' }}>
                                        +3 Comp.
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>June 12, 2024</td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Edit Structure</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

import { getUsers } from '@/lib/actions/users';
import { getEmployees } from '@/lib/actions/employee';
import UserForm from '@/components/admin/UserForm';
import { Suspense } from 'react';

export default async function UserManagementPage() {
    const usersResult = await getUsers();
    const employeesResult = await getEmployees();

    const users = (usersResult.success && usersResult.data) ? usersResult.data : [];
    const employees = (employeesResult.success && employeesResult.data) ? employeesResult.data : [];

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Platform Governance</h1>
                <p className="text-gray-500">Manage system access, define user roles, and monitor authentication health.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>
                {/* Control Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h2 className="text-lg font-bold mb-4">Provision New User</h2>
                        <UserForm employees={employees} />
                    </div>

                    <div className="card" style={{ padding: '1.5rem', background: 'var(--slate-50)', border: '1px dashed var(--slate-200)' }}>
                        <h4 className="text-sm font-bold text-gray-400" style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>User Statistics</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-100)' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-500)' }}>Active Admins</p>
                                <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{users.filter((u: any) => u.role === 'ADMIN').length}</p>
                            </div>
                            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-100)' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-500)' }}>Total Users</p>
                                <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{users.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Directory */}
                <div className="card" style={{ padding: 0, background: 'white' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="text-lg font-bold">System Identity Repository</h2>
                        <input type="text" placeholder="Search users..." className="input" style={{ width: '200px', height: '36px', fontSize: '0.875rem' }} />
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--slate-100)', background: 'var(--slate-50)' }}>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)' }}>Identity</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)' }}>Privileges</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)' }}>Status</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)' }}>Affiliation</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>No system users provisioned.</td></tr>
                                ) : (
                                    users.map((u: any) => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--slate-50)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                                                        {u.username[0].toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 600 }}>{u.username}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800,
                                                    background: u.role === 'ADMIN' ? '#fee2e2' : u.role === 'HR' ? '#e0e7ff' : '#f3f4f6',
                                                    color: u.role === 'ADMIN' ? '#991b1b' : u.role === 'HR' ? '#3730a3' : '#374151'
                                                }}>{u.role}</span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: u.status === 'ACTIVE' ? 'var(--accent-teal)' : '#ef4444' }}></div>
                                                    {u.status}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                                {u.employee ? (
                                                    <span style={{ color: 'var(--primary-600)', fontWeight: 500 }}>{u.employee.firstName} {u.employee.lastName}</span>
                                                ) : <span style={{ color: 'var(--slate-400)' }}>Unlinked</span>}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <button className="btn" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>Reset</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

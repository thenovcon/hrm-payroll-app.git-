'use client';

import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '@/lib/actions/user-management';
import { Loader2, Plus, Edit2, Trash2, X, Check, Search, Shield, UserX, UserCheck } from 'lucide-react';

export default function UserRoles() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'EMPLOYEE', email: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const res = await getAllUsers();
        if (res.success) setUsers(res.data || []);
        setLoading(false);
    };

    const handleOpenModal = (user?: any) => {
        if (user) {
            setEditingUser(user);
            setFormData({ username: user.username, password: '', role: user.role, email: user.email }); // Password empty on edit
        } else {
            setEditingUser(null);
            setFormData({ username: '', password: '', role: 'EMPLOYEE', email: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.username || (!editingUser && !formData.password)) {
            alert('Username and Password are required.');
            return;
        }

        setSaving(true);
        let res;
        if (editingUser) {
            // Update
            const payload: any = { role: formData.role };
            if (formData.password) payload.password = formData.password;
            // Optionally update email if logic allows, simplified here
            res = await updateUser(editingUser.id, payload);
        } else {
            // Create
            res = await createUser(formData);
        }

        setSaving(false);
        if (res.success) {
            setIsModalOpen(false);
            loadUsers();
        } else {
            alert(res.error);
        }
    };

    const handleStatusToggle = async (user: any) => {
        if (!confirm(`Are you sure you want to ${user.status === 'ACTIVE' ? 'deactivate' : 'activate'} this user?`)) return;
        const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        await updateUser(user.id, { status: newStatus });
        loadUsers();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this user account permanently? This logic is usually a soft delete (Deactivate). Proceeding with soft delete.')) return;
        await deleteUser(id);
        loadUsers();
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">User Management</h3>
                    <p className="text-sm text-slate-500">Provision accounts, assign roles, and manage access.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" /> Create User
                </button>
            </div>

            {/* List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Based On</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{u.username}</div>
                                        <div className="text-xs text-slate-400">{u.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-slate-700">{u.name}</div>
                                        <div className="text-xs text-slate-400">{u.department}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                                            ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'HR_MANAGER' ? 'bg-blue-100 text-blue-700' :
                                                    u.role === 'DEPT_HEAD' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}
                                        `}>
                                            <Shield className="w-3 h-3" />
                                            {u.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleOpenModal(u)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors" title="Edit">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleStatusToggle(u)} className={`p-1.5 hover:bg-slate-100 rounded transition-colors ${u.status === 'ACTIVE' ? 'text-amber-500' : 'text-green-500'}`} title={u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>
                                            {u.status === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h4 className="font-bold text-slate-800">{editingUser ? 'Edit User' : 'Create New User'}</h4>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Username</label>
                                <input
                                    type="text"
                                    className="w-full input input-bordered"
                                    value={formData.username}
                                    readOnly={!!editingUser} // Cannot change username on edit
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="jdoe"
                                />
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Email (Optional - Links to Employee)</label>
                                    <input
                                        type="email"
                                        className="w-full input input-bordered"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="user@novcon.com"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">If email matches an employee, they will be linked automatically.</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Role</label>
                                <select
                                    className="w-full input input-bordered"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="EMPLOYEE">Generic Employee</option>
                                    <option value="DEPT_HEAD">Line Manager (Dept Head)</option>
                                    <option value="HR_MANAGER">HR Manager</option>
                                    <option value="PAYROLL_OFFICER">Payroll Officer</option>
                                    <option value="ACCOUNTANT">Accountant</option>
                                    <option value="ADMIN">Super Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">{editingUser ? 'New Password (Leave blank to keep)' : 'Password'}</label>
                                <input
                                    type="password"
                                    className="w-full input input-bordered"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
                            <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost text-slate-500">Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {editingUser ? 'Save Changes' : 'Create User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

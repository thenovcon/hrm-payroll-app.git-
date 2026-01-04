'use client';

import React, { useState, useEffect } from 'react';
import { getRequisitions, createRequisition, updateRequisitionStatus } from '@/lib/actions/ats-actions';
import { ClipboardList, MapPin, Users, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export default function RequisitionManagement() {
    const [requisitions, setRequisitions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Mock Data for Demo if empty
    // Mock Data for Demo if empty
    const fetchRequisitions = async () => {
        setLoading(true);
        const result = await getRequisitions();
        if (result.success && result.data) {
            setRequisitions(result.data);
        } else {
            setRequisitions([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRequisitions();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        const result = await updateRequisitionStatus(id, status);
        if (result.success) {
            fetchRequisitions();
        } else {
            alert(result.error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await createRequisition(formData);
        if (result.success) {
            setShowForm(false);
            fetchRequisitions();
        } else {
            alert(result.error);
        }
    };

    const getPriorityBadge = (priority: string) => {
        const styles: any = {
            'URGENT': 'bg-rose-100 text-rose-700 border-rose-200',
            'HIGH': 'bg-orange-100 text-orange-700 border-orange-200',
            'MEDIUM': 'bg-blue-100 text-blue-700 border-blue-200',
            'LOW': 'bg-slate-100 text-slate-600 border-slate-200'
        };
        return styles[priority] || styles['LOW'];
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Job Requisitions</h3>
                    <p className="text-slate-500 text-sm">Manage open roles and hiring requests.</p>
                </div>
                <button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all"
                    onClick={() => setShowForm(!showForm)}
                >
                    <ClipboardList className="w-4 h-4" />
                    {showForm ? 'Cancel' : 'New Requisition'}
                </button>
            </div>

            {/* Stats Overview (Mocked for Visuals) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ClipboardList className="w-5 h-5" /></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Total Reqs</p><p className="text-lg font-bold text-slate-800">{requisitions.length}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Approved</p><p className="text-lg font-bold text-slate-800">{requisitions.filter(r => r.status === 'APPROVED').length}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Pending</p><p className="text-lg font-bold text-slate-800">{requisitions.filter(r => r.status === 'PENDING').length}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase">Fill Rate</p><p className="text-lg font-bold text-slate-800">24%</p></div>
                </div>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 animate-in slide-in-from-top-4">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">1</span>
                        Create New Requisition
                    </h4>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Job Title</label>
                            <input name="title" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors" required placeholder="e.g. Senior Software Engineer" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Department</label>
                            <select name="department" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" >
                                <option value="Engineering">Engineering</option>
                                <option value="Sales">Sales</option>
                                <option value="Marketing">Marketing</option>
                                <option value="HR">HR</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Location</label>
                            <input name="location" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors" required placeholder="e.g. Accra, Remote" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Employment Type</label>
                            <select name="type" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Priority</label>
                            <select name="priority" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Headcount</label>
                            <input name="headcount" type="number" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors" defaultValue="1" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Justification</label>
                            <textarea name="justification" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors min-h-[80px]" placeholder="Why is this position needed?" />
                        </div>
                        <div className="md:col-span-2 pt-2">
                            <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">Submit Requisition</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="p-4 font-semibold">Req #</th>
                            <th className="p-4 font-semibold">Role Detail</th>
                            <th className="p-4 font-semibold">Priority</th>
                            <th className="p-4 font-semibold">Stats</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading requisitions...</td></tr>
                        ) : requisitions.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-4 font-mono text-sm text-slate-500">{req.reqNumber}</td>
                                <td className="p-4">
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{req.title}</h4>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {req.department}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.location}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getPriorityBadge(req.priority)}`}>
                                        {req.priority}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs text-slate-600 font-medium">Headcount: {req.headcount}</div>
                                        <div className="text-[10px] text-slate-400">Filled: {req.filled || 0}</div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${req.status === 'APPROVED' ? 'bg-emerald-500' : req.status === 'PENDING' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
                                        <span className="text-sm font-medium text-slate-700 capitalize">{req.status.toLowerCase()}</span>
                                    </div>
                                    {req.daysOpen && <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {req.daysOpen} days open</div>}
                                </td>
                                <td className="p-4">
                                    {req.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleStatusUpdate(req.id, 'APPROVED')} className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100" title="Approve">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleStatusUpdate(req.id, 'REJECTED')} className="p-1.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100" title="Reject">
                                                <AlertCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

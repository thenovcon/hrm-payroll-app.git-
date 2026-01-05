'use client';

import React, { useState } from 'react';
import { createLeaveRequest } from '@/lib/actions/leave';
import { Calendar, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// Since I don't have shadcn Dialog in current context reliably working with all deps, 
// I'll build a custom Modal using standard Tailwind to be safe and dependency-free for this agent run.
// Wait, I can see 'card' class being used. I'll stick to a custom overlay for maximum reliability.

export default function LeaveRequestModal({
    children,
    employeeId,
    leaveTypes,
    onSuccess
}: {
    children: React.ReactNode,
    employeeId: string,
    leaveTypes: any[],
    onSuccess?: () => void
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const calculateDays = () => {
        if (!formData.startDate || !formData.endDate) return 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diff = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');

        const data = new FormData();
        data.append('employeeId', employeeId);
        data.append('leaveTypeId', formData.leaveTypeId);
        data.append('startDate', formData.startDate);
        data.append('endDate', formData.endDate);
        data.append('reason', formData.reason);

        const result = await createLeaveRequest(data);
        setIsSubmitting(false);

        if (result.success) {
            setIsOpen(false);
            setStep(1);
            setFormData({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
            if (onSuccess) onSuccess();
        } else {
            setError(result.error || 'Failed to submit request');
        }
    };

    if (!isOpen) {
        return <div onClick={() => setIsOpen(true)}>{children}</div>;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Request Leave</h2>
                        <p className="text-xs text-slate-500">Step {step} of 3</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                        ✕
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-1">
                    <div
                        className="bg-blue-600 h-1 transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Body */}
                <div className="p-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-700">Select Leave Type</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {leaveTypes.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setFormData({ ...formData, leaveTypeId: type.id })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group
                                            ${formData.leaveTypeId === type.id
                                                ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20'
                                                : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'}`}
                                    >
                                        <div>
                                            <span className={`font-bold block ${formData.leaveTypeId === type.id ? 'text-blue-700' : 'text-slate-700'}`}>
                                                {type.name}
                                            </span>
                                            <span className="text-xs text-slate-500">{type.daysAllowed} days allowed</span>
                                        </div>
                                        {formData.leaveTypeId === type.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-700">Dates & Duration</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            {calculateDays() > 0 && (
                                <div className="bg-indigo-50 text-indigo-700 p-4 rounded-xl flex items-center gap-3">
                                    <Calendar className="w-5 h-5" />
                                    <div>
                                        <p className="font-bold">{calculateDays()} Days Selected</p>
                                        <p className="text-xs opacity-80">This will be deducted from your balance.</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Reason (Optional)</label>
                                <textarea
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    rows={3}
                                    placeholder="Brief note about your leave..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Review Request</h3>
                            <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2 text-sm text-slate-600 mb-6">
                                <p><strong className="text-slate-800">Type:</strong> {leaveTypes.find(t => t.id === formData.leaveTypeId)?.name}</p>
                                <p><strong className="text-slate-800">Duration:</strong> {formData.startDate} to {formData.endDate} ({calculateDays()} days)</p>
                                <p><strong className="text-slate-800">Reason:</strong> {formData.reason || 'No reason provided'}</p>
                            </div>
                            <p className="text-xs text-slate-400">Your manager will be notified immediately.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-4 flex justify-between items-center border-t border-slate-100">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-4 py-2 text-slate-500 font-semibold hover:text-slate-700 text-sm"
                        >
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={
                                (step === 1 && !formData.leaveTypeId) ||
                                (step === 2 && (!formData.startDate || !formData.endDate))
                            }
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? 'Submitting...' : 'Confirm Request'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

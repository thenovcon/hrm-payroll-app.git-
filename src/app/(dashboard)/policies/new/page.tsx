
'use client';

import React, { useState } from 'react';
import { createPolicy } from '@/lib/actions/policy-actions';
import FileUpload from '@/components/shared/FileUpload';
import Link from 'next/link';

export default function NewPolicyPage() {
    const [fileUrl, setFileUrl] = useState('');

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-100 mt-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Add New HR Policy</h1>

            <form action={createPolicy} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Policy Title</label>
                    <input
                        name="title"
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        placeholder="e.g. Employee Code of Conduct"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                        name="category"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    >
                        <option value="GENERAL">General</option>
                        <option value="LEAVE">Leave & Time Off</option>
                        <option value="CONDUCT">Code of Conduct</option>
                        <option value="BENEFITS">Benefits & Comp</option>
                        <option value="HEALTH">Health & Safety</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Summary / AI Content</label>
                    <p className="text-xs text-slate-500 mb-2">Paste the text content here so the AI Assistant can read it.</p>
                    <textarea
                        name="content"
                        rows={6}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        placeholder="Paste full text of the policy here..."
                    ></textarea>
                </div>

                <div>
                    <FileUpload
                        label="Attach PDF Document (Optional)"
                        folder="policies"
                        onUploadComplete={(url) => setFileUrl(url)}
                    />
                    <input type="hidden" name="fileUrl" value={fileUrl} />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
                    >
                        Save Policy
                    </button>
                    <Link href="/policies" className="bg-slate-100 text-slate-600 px-6 py-2 rounded-lg font-medium hover:bg-slate-200 transition">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

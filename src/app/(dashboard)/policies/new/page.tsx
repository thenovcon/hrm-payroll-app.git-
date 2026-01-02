'use client';

import { createPolicy } from '@/lib/actions/policy-actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewPolicyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const content = formData.get('content') as string;

        try {
            await createPolicy(title, content, category);
            router.push('/policies');
        } catch (error) {
            console.error(error);
            alert('Failed to save policy');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Policy</h1>

            <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        name="title"
                        required
                        placeholder="e.g. Remote Work Policy"
                        className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        name="category"
                        className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white"
                    >
                        <option value="GENERAL">General</option>
                        <option value="LEAVE">Leave & Attendance</option>
                        <option value="BENEFITS">Benefits & Compensation</option>
                        <option value="CONDUCT">Code of Conduct</option>
                        <option value="IT">IT & Security</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Content</label>
                    <textarea
                        name="content"
                        required
                        rows={10}
                        placeholder="Paste the full policy text here. The AI will read this to answer employee questions."
                        className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Note: This content will be embedded into the vector database for RAG retrieval.
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving & Embedding...' : 'Save Policy'}
                    </button>
                </div>
            </form>
        </div>
    );
}

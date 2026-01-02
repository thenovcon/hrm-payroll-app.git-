'use client';

import { useState } from 'react';
import { createNewsletter } from '@/lib/actions/newsletter-actions';
import { useRouter } from 'next/navigation';

export default function NewNewsletterPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createNewsletter(title, content);
            router.push('/engagement');
        } catch (error) {
            alert('Failed to publish');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Post New Update</h1>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                        <textarea
                            required
                            rows={8}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write update here..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => router.back()} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                        >
                            {loading ? 'Publishing...' : 'Publish Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

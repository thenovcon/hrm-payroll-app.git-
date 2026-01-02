'use client';

export default function NewsletterFeed({ newsletters }: { newsletters: any[] }) {
    if (newsletters.length === 0) {
        return <p className="text-slate-500 italic p-4 text-center">No news updates yet.</p>;
    }

    return (
        <div className="space-y-6">
            {newsletters.map((news) => (
                <div key={news.id} className="border-b border-slate-100 pb-6 last:border-0">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{news.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <span>{new Date(news.publishedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                        <span>•</span>
                        <span>{news.createdBy?.username || 'Admin'}</span>
                    </div>
                    <div className="prose prose-sm max-w-none text-slate-600">
                        {/* We could use a markdown renderer here, for now plain text/whitespace */}
                        <p className="whitespace-pre-wrap">{news.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

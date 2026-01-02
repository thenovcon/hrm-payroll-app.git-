export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-200">
                <div className="prose max-w-none prose-slate prose-headings:text-slate-800 prose-a:text-blue-600">
                    {children}
                </div>
            </div>
        </div>
    );
}

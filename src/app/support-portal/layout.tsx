export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black">
            {children}
        </div>
    );
}

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            {children}
        </div>
    );
}

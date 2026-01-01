export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ padding: '20px', border: '5px solid green' }}>
            <p>DEBUG: Raw Portal Layout (No Sidebar)</p>
            {children}
        </div>
    );
}

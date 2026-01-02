import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminTicketsPage() {
    const session = await auth();
    // Basic role check (assuming user.role exists on session)
    if ((session?.user as any)?.role !== 'ADMIN') {
        redirect('/');
    }

    const tickets = await prisma.ticket.findMany({
        orderBy: { createdAt: 'desc' },
        include: { createdBy: true }
    });

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--slate-900)' }}>Support Tickets & Bug Reports</h1>

            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                        <tr>
                            <th style={thStyle}>Type</th>
                            <th style={thStyle}>Priority</th>
                            <th style={thStyle}>Subject/Title</th>
                            <th style={thStyle}>Submitted By</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)' }}>No tickets found.</td>
                            </tr>
                        ) : (
                            tickets.map(ticket => (
                                <tr key={ticket.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                            background: ticket.type === 'BUG_REPORT' ? 'var(--red-100)' : 'var(--blue-100)',
                                            color: ticket.type === 'BUG_REPORT' ? 'var(--red-700)' : 'var(--blue-700)'
                                        }}>
                                            {ticket.type === 'BUG_REPORT' ? 'Bug Report' : 'Support'}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            fontWeight: ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL' ? 700 : 400,
                                            color: ticket.priority === 'CRITICAL' ? 'var(--red-600)' : 'inherit'
                                        }}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 500 }}>{ticket.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {ticket.description}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        {ticket.createdBy?.username || 'Unknown'}
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                            background: ticket.status === 'OPEN' ? 'var(--green-100)' : 'var(--slate-100)',
                                            color: ticket.status === 'OPEN' ? 'var(--green-700)' : 'var(--slate-700)'
                                        }}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: 600,
    color: 'var(--slate-600)',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
} as React.CSSProperties;

const tdStyle = {
    padding: '1rem',
    color: 'var(--slate-700)'
} as React.CSSProperties;

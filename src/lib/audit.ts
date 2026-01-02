import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

type AuditAction =
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'VIEW_SENSITIVE'
    | 'APPROVE'
    | 'REJECT'
    | 'LOGIN'
    | 'LOGOUT';

export async function logAudit({
    action,
    resource,
    details,
    userId // Optional override if we want to log for a specific user (e.g. login flow)
}: {
    action: AuditAction | string;
    resource: string;
    details?: any;
    userId?: string;
}) {
    try {
        let actorId = userId;

        if (!actorId) {
            const session = await auth();
            actorId = session?.user?.id;
        }

        if (!actorId) {
            console.warn(`[Audit] automated system action or unauthenticated: ${action} on ${resource}`);
            return;
        }

        await prisma.auditLog.create({
            data: {
                userId: actorId,
                action,
                resource,
                details: details ? JSON.stringify(details) : undefined,
            },
        });
    } catch (error) {
        console.error('[Audit] Failed to create log entry:', error);
        // Don't crash the app if audit fails, but log it
    }
}

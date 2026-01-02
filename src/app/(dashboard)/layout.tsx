import { getNotifications } from '@/lib/actions/notification-actions';
import { auth } from '@/auth';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import FloatingChatWidget from '@/components/chat/FloatingChatWidget';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const notifications = await getNotifications();

    return (
        <>
            <MainLayout header={<Header notifications={notifications} />}>{children}</MainLayout>
            {/* DEBUG: Session Checker */}
            <div className="fixed bottom-0 left-0 bg-yellow-300 text-black text-xs px-2 z-[9999] opacity-75 pointer-events-none">
                {session?.user?.id ? `Session OK (${session.user.id.substring(0, 4)}...)` : 'NO SESSION - CHAT HIDDEN'}
            </div>
            {session?.user?.id && <FloatingChatWidget userId={session.user.id} />}
        </>
    );
}

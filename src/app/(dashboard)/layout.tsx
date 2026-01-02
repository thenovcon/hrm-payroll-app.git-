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
            {session?.user?.id && <FloatingChatWidget userId={session.user.id} />}
        </>
    );
}

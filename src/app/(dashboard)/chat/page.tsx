import { auth } from '@/auth';
import ChatInterface from '@/components/chat/ChatInterface';
import { redirect } from 'next/navigation';

export default async function ChatPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return <ChatInterface user={session.user as any} />;
}

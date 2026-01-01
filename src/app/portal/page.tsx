import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function MainPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-blue-600">Authenticated Success</h1>
      <p>You have passed the Auth Guard.</p>
      <p>User: {session.user.email}</p>
      <p>Role: {(session.user as any).role}</p>
      <p className="mt-4 text-gray-500">Next Step: Restore Database Connection.</p>
    </div>
  );
}

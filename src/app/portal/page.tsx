import { auth } from '@/auth';
import Link from 'next/link';

export default async function MainPage() {
  const session = await auth();

  if (!session?.user) {
    // Soft Fail - Do not redirect, just show status
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-600">Session Check Failed</h1>
        <p className="mb-4">You are hitting /portal, but the server sees no session.</p>

        <div className="bg-gray-100 p-4 rounded mb-4">
          <p><strong>Debug Info:</strong></p>
          <p>User: null</p>
        </div>

        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
          Try Login Again
        </Link>
      </div>
    );
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

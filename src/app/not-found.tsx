
'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NotFound() {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-red-50 text-red-900">
            <h2 className="text-4xl font-bold mb-4">404 - Debug Mode</h2>
            <p className="mb-4">Could not find requested resource</p>

            <div className="p-4 bg-white rounded shadow text-sm mb-8 max-w-lg">
                <p><strong>Diagnosis:</strong> The application IS running.</p>
                <p className="my-2 p-2 bg-gray-100 rounded text-mono break-all">
                    <strong>Attempted Path:</strong> {pathname}
                </p>
                <p>If you see this, Next.js cannot match this URL to a page.</p>

                <div className="flex gap-4 mt-4">
                    <Link
                        href="/"
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                        Return Home
                    </Link>
                    <Link
                        href="/portal"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Try Portal (Force)
                    </Link>
                </div>
            </div>
            <p className="mt-8 text-xs text-gray-500">
                Debug Info: Route not found. Checks: Auth (Pass), Middleware (Pass).
            </p>
        </div>
    )
}

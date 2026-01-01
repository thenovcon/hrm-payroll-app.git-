
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-red-50 text-red-900">
            <h2 className="text-4xl font-bold mb-4">404 - Debug Mode</h2>
            <p className="mb-4">Could not find requested resource</p>
            <div className="p-4 bg-white rounded shadow text-sm mb-8">
                <p><strong>Diagnosis:</strong> The application IS running.</p>
                <p>If you see this, Next.js is active but cannot match the URL path.</p>
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
            <p className="mt-8 text-xs text-gray-500">
                Debug Info: Route not found. Ensure you are logged in.
            </p>
        </div>
    )
}

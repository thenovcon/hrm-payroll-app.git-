
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-red-50 text-red-900">
            <h2 className="text-4xl font-bold mb-4">404 - Debug Mode</h2>
            <p className="mb-4">Could not find requested resource</p>
            <div className="p-4 bg-white rounded shadow text-sm mb-8">
                <p><strong>Diagnosis:</strong> The application IS running.</p>
                <p>If you see this, Next.js is active but cannot match the URL path.</p>
            </div>
            <Link href="/dashboard" className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700">
                Try Dashboard
            </Link>
            <Link href="/login" className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 ml-4">
                Try Login
            </Link>
        </div>
    )
}

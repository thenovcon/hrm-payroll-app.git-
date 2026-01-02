'use client';

import { useState } from 'react';
import { createNotification } from '@/lib/actions/notification-actions';

export default function NotificationSettings({ user_id }: { user_id?: string }) {
    const [loading, setLoading] = useState(false);

    const handleTestPush = async () => {
        if (!user_id) {
            alert("User ID missing.");
            return;
        }
        setLoading(true);
        try {
            await createNotification(
                user_id,
                "Test Notification",
                "This is a test push from your settings.",
                "INFO",
                "/settings"
            );
            alert("Sent! Check for a push notification.");
        } catch (e) {
            console.error(e);
            alert("Error sending test notification.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-medium text-slate-800">Notification Preferences</h3>
                <p className="text-sm text-slate-500">Manage how you receive updates.</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center">
                <div>
                    <h4 className="font-semibold text-blue-900">Push Notifications</h4>
                    <p className="text-sm text-blue-700">Receive real-time alerts on your device.</p>
                </div>
                <button
                    onClick={async () => {
                        // Request Permission
                        const permission = await Notification.requestPermission();
                        if (permission === 'granted') {
                            alert("Permission Granted! Now try the Test button.");
                        } else {
                            alert("Permission Denied. Please enable in browser settings.");
                        }
                    }}
                    className="text-sm px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded hover:bg-blue-100 transition"
                >
                    Request Permission
                </button>
            </div>

            <div className="pt-4">
                <button
                    onClick={handleTestPush}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Test Push Notification'}
                </button>
            </div>
        </div>
    );
}

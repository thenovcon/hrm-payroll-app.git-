'use client';

import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/lib/firebase'; // Ensure this exports 'messaging' (might need update)
import { saveFCMToken } from '@/lib/actions/save-fcm-token';

export default function FCMInitializer() {
    useEffect(() => {
        async function initFCM() {
            try {
                // Check if supported
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator && messaging) {
                    const permission = await Notification.requestPermission();

                    if (permission === 'granted') {
                        const token = await getToken(messaging, {
                            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY // Optional if using default config
                        });

                        if (token) {
                            console.log("FCM Token:", token);
                            await saveFCMToken(token);
                        }
                    }
                }
            } catch (error) {
                console.error("FCM Init Error:", error);
            }
        }

        initFCM();
    }, []);

    return null; // Invisible component
}

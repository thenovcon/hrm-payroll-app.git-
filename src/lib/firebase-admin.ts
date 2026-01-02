
import "server-only";
import admin from "firebase-admin";

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin Initialized");
    } catch (error) {
        console.error("Firebase Admin Init Error:", error);
    }
}

export const adminAuth = admin.auth();
export const adminMessaging = admin.messaging();
export const adminDb = admin.firestore();

export default admin;

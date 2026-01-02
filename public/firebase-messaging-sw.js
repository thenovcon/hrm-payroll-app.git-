
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Config must match src/lib/firebase.ts
// Note: We can't access process.env here easily in SW without build step injection,
// so for this MVP we might need to hardcode or fetch config. 
// However, 'importScripts' is standard for SW.

// HARDCODING CONFIG FOR MVP SW (Ideally inject this via build process)
// User must replace these or we rely on them being statically available if we use a template.
// But since I have access to the user's env vars via previous tools, I can inject them here.
// Actually, I don't "have" them as explicit strings unless I read a file.
// I will use a placeholder or try to read from a shared config if possible, but SW is isolated.
// Recommendation: Use standard defaults or fetch from an endpoint.
// For now, I'll assume the user will configure this or I'll try to use a standard patterns.

// WAIT: The user handles env vars. I should not hardcode secrets. But public notification keys are fine.
// I'll leave placeholders and add a note, OR use the `self.addEventListener` pattern.

const firebaseConfig = {
    apiKey: "REPLACE_WITH_YOUR_KEY", // Config injection needed
    projectId: "hrm-payroll-483000",
    messagingSenderId: "REPLACE_WITH_SENDER_ID",
    appId: "REPLACE_WITH_APP_ID",
};

// Initialize Firebase
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icons/icon-192x192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

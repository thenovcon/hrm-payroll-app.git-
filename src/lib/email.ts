
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
    to,
    subject,
    html,
    text
}: {
    to: string;
    subject: string;
    html: string;
    text?: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("⚠️ RESEND_API_KEY is missing. Email skipped:", { to, subject });
        return { success: false, error: "Missing API Key" };
    }

    try {
        const data = await resend.emails.send({
            from: 'NovCon HR <onboarding@resend.dev>', // Use resend.dev for testing if domain not verified
            to,
            subject,
            html,
            text
        });

        console.log(`📧 Email sent to ${to}: ${data.id}`);
        return { success: true, data };
    } catch (error) {
        console.error("❌ Email failed:", error);
        return { success: false, error };
    }
}

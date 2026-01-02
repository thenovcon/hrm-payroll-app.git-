'use server';

import { sendEmail } from '@/lib/email';

export async function sendWelcomeEmail(email: string, firstName: string, username: string, tempPass: string) {
    const subject = "Welcome to NovCon Solutions";
    const html = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">Welcome to the Team, ${firstName}!</h1>
        <p>Your employee profile has been created.</p>
        
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Portal URL:</strong> <a href="https://hrm-app-637238745168.us-central1.run.app">Login Here</a></p>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Temporary Password:</strong> ${tempPass}</p>
        </div>
        
        <p>Please login and change your password immediately.</p>
        <p>Regards,<br>HR Team</p>
    </div>
    `;

    return await sendEmail({ to: email, subject, html });
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
    const subject = "Reset Your Password";
    const html = `
    <div style="font-family: sans-serif; color: #333;">
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you didn't request this, ignore this email.</p>
    </div>
    `;
    return await sendEmail({ to: email, subject, html });
}

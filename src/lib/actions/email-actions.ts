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

export async function sendPasswordResetEmail(email: string, tempPass: string) {
    const subject = "Password Reset Successful";
    const html = `
    <div style="font-family: sans-serif; color: #333;">
        <h1>Your Password Has Been Reset</h1>
        <p>You requested a password reset. Here is your new temporary password:</p>
        <p style="font-size: 18px; font-weight: bold; background: #eee; padding: 10px; display: inline-block;">${tempPass}</p>
        <p>Please login and change it immediately.</p>
    </div>
    `;
    return await sendEmail({ to: email, subject, html });
}

import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

export async function requestPasswordReset(email: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { employee: { email: email } },
                    // Fallback if we stored email on user directly, but schema says user->employee->email
                ]
            },
            include: { employee: true }
        });

        if (!user) {
            // Return success even if not found to prevent enumeration
            return { success: true, message: 'If an account exists, an email has been sent.' };
        }

        const tempPassword = `Reset${Math.floor(1000 + Math.random() * 9000)}!`;
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        // Use the email found on employee relation
        const targetEmail = user.employee?.email;
        if (targetEmail) {
            await sendPasswordResetEmail(targetEmail, tempPassword);
        }

        return { success: true, message: 'Password reset email sent.' };

    } catch (error) {
        console.error("Reset error:", error);
        return { success: false, error: "Failed to process request" };
    }
}

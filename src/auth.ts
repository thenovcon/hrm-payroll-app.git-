import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET || 'E9F1A8C4-7C2B-4E3D-8F5A-0B1C2D3E4F5A', // Fallback for dev
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    console.log('Authorize called with:', credentials?.username); // Debug log
                    if (!credentials?.username || !credentials?.password) return null;

                    const username = credentials.username as string;
                    const password = credentials.password as string;

                    const user = await prisma.user.findUnique({ where: { username } });
                    console.log('User found:', user ? 'Yes' : 'No'); // Debug log

                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log('Password match:', passwordsMatch); // Debug log

                    if (passwordsMatch) {
                        return {
                            id: user.id,
                            name: user.username,
                            email: user.username,
                            role: user.role,
                        };
                    }
                    return null;
                } catch (e) {
                    console.error('Authorize Callback Error:', e);
                    throw e; // Let NextAuth handle it (resulting in CallbackRouteError), but now we have logs
                }
            },
        }),
    ],
});

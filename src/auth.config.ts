import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    secret: process.env.AUTH_SECRET || 'E9F1A8C4-7C2B-4E3D-8F5A-0B1C2D3E4F5A',
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const pathname = nextUrl.pathname;

            console.log('Middleware:', { pathname, isLoggedIn, user: auth?.user?.name });

            const isOnLogin = pathname.startsWith('/login');
            const isOnRoot = pathname === '/';
            const isOnPortal = pathname.startsWith('/portal');
            const isOnCareers = pathname.startsWith('/careers');
            const isOnHelp = pathname.startsWith('/help'); // Whitelist Help
            const isOnLegal = pathname.startsWith('/legal'); // Whitelist Legal

            if (isOnLogin || isOnRoot || isOnPortal || isOnCareers || isOnHelp || isOnLegal) {
                if (isLoggedIn && isOnLogin) {
                    console.log('Middleware: User is logged in, redirecting to /portal');
                    return Response.redirect(new URL('/portal', nextUrl));
                }
                return true;
            }

            if (!isLoggedIn) {
                console.log('Middleware: User NOT logged in, allowing NextAuth to redirect to login');
                return false;
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    providers: [],
} satisfies NextAuthConfig;

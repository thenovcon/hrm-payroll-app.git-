import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NovCon Ghana HRM+",
  description: "Comprehensive Human Resource Management System for Novcon Ghana",
};

import { auth } from '@/auth';
import ChatWidget from '@/components/chat/ChatWidget';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { ThemeProvider } = require("@/components/theme-provider");
  const session = await auth();
  const user = session?.user;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {user && (
            <ChatWidget user={{
              id: user.id || '',
              name: user.name,
              username: (user as any).username || user.name, // Handle potential type diffs
              role: (user as any).role
            }} />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}


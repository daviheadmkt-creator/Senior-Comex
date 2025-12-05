import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Senior Assessoria',
  description: 'Painel de Controle',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#4DB6AC',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <FirebaseClientProvider>
            {children}
          </FirebaseClientProvider>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Orbitron, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import CursorGlow from '@/components/CursorGlow';
import { Toaster } from 'sonner';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EMORA - AI-Powered Social Platform',
  description: 'Next-generation immersive social and entertainment platform powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <div className="animated-bg" />
        <div className="grid-bg fixed inset-0 -z-10 opacity-20" />
        
        <CursorGlow />
        <Navbar />
        
        <main className="min-h-screen pt-16">
          {children}
        </main>
        
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}

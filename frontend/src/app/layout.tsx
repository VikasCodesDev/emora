import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import CursorGlow from '@/components/CursorGlow';
import GlobalBackground from '@/components/GlobalBackground';
import { Toaster } from 'sonner';
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Emora',
  description: 'Next-generation immersive social and entertainment platform powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${plusJakarta.variable} font-body`}>
        <GlobalBackground />
        
        <CursorGlow />
        <Navbar />
        
        <main className="min-h-screen pt-16 relative z-10">
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
        <Footer />
      </body>
    </html>
  );
}

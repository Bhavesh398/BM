import type { Metadata } from 'next';
import { Inter, Playfair_Display, Tilt_Warp } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const tiltWarp = Tilt_Warp({ subsets: ['latin'], variable: '--font-tilt-warp' });

export const metadata: Metadata = {
  title: 'BlueMonitor Intelligence',
  description: 'Hybrid water intelligence platform for SDG-6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen bg-background font-sans antialiased text-white", inter.variable, playfair.variable, tiltWarp.variable)}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}

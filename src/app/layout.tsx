import { Inter } from 'next/font/google';
import { AgentProvider } from '@/contexts/AgentContext';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BahayCebu Properties',
  description: 'Find your dream property in Cebu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AgentProvider>
          {children}
        </AgentProvider>
      </body>
    </html>
  )
} 
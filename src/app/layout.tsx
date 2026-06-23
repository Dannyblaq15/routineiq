import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'RoutineIQ — Your AI Skincare Advisor',
  description: 'RoutineIQ is your personal AI skincare agent. It remembers your skin history, learns your preferences, and builds routines that work — powered by Qwen AI.',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

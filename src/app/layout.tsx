import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'RoutineIQ Clinical Systems',
  description: 'Secure clinical intelligence and inventory management workspace.',
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

import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'RoutineIQ — Your AI Skincare Advisor',
  description:
    'RoutineIQ is your personal AI skincare agent. It remembers your skin history, learns your preferences, and builds routines that work — powered by Qwen AI.',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
};

// Inline script string — kept outside the component so it's a static string
// and doesn't trigger hydration issues during SSR/prerendering.
const darkModeScript = `
(function(){try{var s=localStorage.getItem('routineiq-dark-mode');if(s==='true'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();
`.trim();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before first paint — applies saved dark/light class with zero flash */}
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

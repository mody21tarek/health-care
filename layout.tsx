import './globals.css';
import { LangProvider } from '@/context/LangContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata = {
  title: 'Trainify - SaaS Platform',
  description: 'Enterprise Multi-Tenant Online Fitness Coaching Ecosystem',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 min-h-screen">
        <ThemeProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

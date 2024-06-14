import type { Metadata } from 'next';
import StoreProvider from '@/components/hoc/StoreProvider';
import Layout from '@/components/hoc/layout/Layout';
import '@/styles/globals.css';
import RouteGuard from '@/components/hoc/RouteGuard';
import { NotificationProvider } from '@/components/hoc/NotificationProvider';

export const metadata: Metadata = {
  title: 'Generic Website',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <StoreProvider>
          <NotificationProvider>
            <RouteGuard> {children}</RouteGuard>
          </NotificationProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

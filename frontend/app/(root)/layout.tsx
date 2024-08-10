import type { Metadata } from 'next';
import StoreProvider from '@/components/hoc/store-provider';
import '@/styles/globals.css';
import RouteGuard from '@/components/hoc/route-guard';
import { NotificationProvider } from '@/components/hoc/notification-provider';
import AuthGuard from '@/components/hoc/auth-guard';

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
            <RouteGuard>
              <AuthGuard>{children}</AuthGuard>
            </RouteGuard>
          </NotificationProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

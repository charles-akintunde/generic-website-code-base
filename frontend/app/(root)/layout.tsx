import type { Metadata } from 'next';
import StoreProvider from '@/components/hoc/StoreProvider';
import Layout from '@/components/layout/Layout';
import '@/styles/globals.css';
import RouteGuard from '@/components/hoc/RouteGuard';

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
          <RouteGuard> {children}</RouteGuard>
        </StoreProvider>
      </body>
    </html>
  );
}

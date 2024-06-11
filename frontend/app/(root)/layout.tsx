import type { Metadata } from 'next';
import StoreProvider from '@/components/common/StoreProvider';
import Layout from '@/components/layout/Layout';
import '@/styles/globals.css';

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
          <Layout>{children}</Layout>
        </StoreProvider>
      </body>
    </html>
  );
}

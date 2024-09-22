import Layout from '@/components/hoc/layout/layout';

import dynamic from 'next/dynamic';

const CookieConsentBanner = dynamic(
  () => import('@/components/common/cookies-consent'),
  {
    ssr: false,
  }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
        <CookieConsentBanner />
      </body>
    </html>
  );
}

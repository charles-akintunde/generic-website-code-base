import Layout from '../../../components/hoc/layout/layout';
import dynamic from 'next/dynamic';
// import RouteGuard from '../../../components/hoc/route-guard';

const CookieConsentBanner = dynamic(
  () => import('../../../components/common/cookies-consent'),
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
        {/* <RouteGuard> */}
        <Layout>{children}</Layout>
        <CookieConsentBanner />
        {/* </RouteGuard> */}
      </body>
    </html>
  );
}

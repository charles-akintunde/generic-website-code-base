'use client';
import Layout from '../../../components/hoc/layout/layout';
import dynamic from 'next/dynamic';
import { useAppSelector } from '../../../hooks/redux-hooks';
import AppLoading from '../../../components/common/app-loading';
import useUserLogin from '../../../hooks/api-hooks/use-user-login';

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
  const { isActiveUserFetchLoading } = useUserLogin();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);

  return (
    <>
      {true ? (
        <html lang="en">
          <body>
            <Layout>{children}</Layout>
            <CookieConsentBanner />
          </body>
        </html>
      ) : (
        <AppLoading />
      )}
    </>
  );
}

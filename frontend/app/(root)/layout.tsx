import StoreProvider from '../../components/hoc/store-provider';
import '../../styles/globals.css';
import RouteGuard from '../../components/hoc/route-guard';
import { NotificationProvider } from '../../components/hoc/notification-provider';
import AuthGuard from '../../components/hoc/auth-guard';
import { ConfigProvider } from 'antd';
import { globalTheme } from '../../styles/globals';



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ConfigProvider theme={globalTheme}>
          <StoreProvider>
            <NotificationProvider>
              <RouteGuard>
                <AuthGuard>{children}</AuthGuard>
              </RouteGuard>
            </NotificationProvider>
          </StoreProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}

'use client';
import Layout from '../../../components/hoc/layout/layout';
import dynamic from 'next/dynamic';
import { useAppDispatch } from '../../../hooks/redux-hooks';
import { useGetActiveUserQuery } from '../../../api/authApi';
import { EUserRole } from '../../../types/enums';
import { transformToUserInfo } from '../../../utils/helper';
import { setUIActiveUser } from '../../../store/slice/userSlice';
import { IUserInfo } from '../../../types/componentInterfaces';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

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
  const dispatch = useAppDispatch();
  const {
    data: activeUserData,
    isError: hasActiveUserFetchError,
    isSuccess: isActiveUserFetchSuccess,
    isLoading: isActiveUserFetchLoading,
    refetch: activePageRefetch,
  } = useGetActiveUserQuery();
  const pathname = usePathname();
  useEffect(() => {
    const fetchUserData = async () => {
      if (activeUserData?.data) {
        const userProfile: IUserInfo = transformToUserInfo(
          activeUserData?.data
        );
        dispatch(
          setUIActiveUser({
            uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
            uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
            uiIsAdmin: userProfile.uiRole.includes(EUserRole.Admin),
            uiIsLoading: false,
            uiIsSuperAdmin: userProfile.uiRole.includes(EUserRole.SuperAdmin),
            uiId: userProfile.id,
            uiCanEdit:
              userProfile.uiRole.includes(EUserRole.Admin) ||
              userProfile.uiRole.includes(EUserRole.SuperAdmin),
            uiRole: userProfile.uiRole,
            uiPhotoURL: userProfile.uiPhoto,
          })
        );
      } else if (!isActiveUserFetchLoading && !hasActiveUserFetchError) {
        // dispatch(
        //   setUIActiveUser({
        //     uiId: null,
        //     uiFullName: '',
        //     uiInitials: '',
        //     uiIsAdmin: false,
        //     uiIsSuperAdmin: false,
        //     uiCanEdit: false,
        //     uiRole: [EUserRole.Public],
        //     uiPhotoURL: null,
        //   })
        // );
      }
    };

    fetchUserData();
  }, [activeUserData, dispatch, pathname]);
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
        <CookieConsentBanner />
      </body>
    </html>
  );
}

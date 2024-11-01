'use client';
import React, { useEffect } from 'react';
import Header from './header/header';
import Footer from './footer/footer';
import { useUserInfo } from '../../../hooks/api-hooks/use-user-info';
import { IUserInfo } from '../../../types/componentInterfaces';
import { setUIActiveUser } from '../../../store/slice/userSlice';
import { transformToUserInfo } from '../../../utils/helper';
import { EUserRole } from '../../../types/enums';
import { useGetActiveUserQuery } from '../../../api/authApi';
import { useAppDispatch } from '../../../hooks/redux-hooks';
import App from 'next/app';
import AppLoading from '../../common/app-loading';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const {
    data: activeUserData,
    isError: hasActiveUserFetchError,
    isSuccess: isActiveUserFetchSuccess,
    isLoading: isActiveUserFetchLoading,
    refetch: activePageRefetch,
  } = useGetActiveUserQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activeUserData?.data) {
      const userProfile: IUserInfo = transformToUserInfo(activeUserData?.data);

      dispatch(
        setUIActiveUser({
          uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
          uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
          uiIsAdmin: userProfile.uiRole.includes(EUserRole.Admin),
          uiIsSuperAdmin: userProfile.uiRole.includes(EUserRole.SuperAdmin),
          uiIsLoading: isActiveUserFetchLoading,
          uiId: userProfile.id,
          uiCanEdit:
            userProfile.uiRole.includes(EUserRole.Admin) ||
            userProfile.uiRole.includes(EUserRole.SuperAdmin),
          uiRole: userProfile.uiRole,
          uiPhotoURL: userProfile.uiPhoto,
        })
      );
    } else {
      dispatch(
        setUIActiveUser({
          uiId: null,
          uiFullName: '',
          uiInitials: '',
          uiIsAdmin: false,
          uiIsLoading: isActiveUserFetchLoading,
          uiIsSuperAdmin: false,
          uiCanEdit: false,
          uiRole: [EUserRole.Public],
          uiPhotoURL: null,
        })
      );
    }
  }, [activeUserData, isActiveUserFetchLoading]);
  // const {} = useUserInfo();

  if (isActiveUserFetchLoading) {
    <AppLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="">{children}</main>
    </div>
  );
};

export default Layout;

'use client';
import React, { useEffect } from 'react';
import { useGetActiveUserQuery, useRefreshTokenMutation } from '@/api/authApi';
import { useAppDispatch } from '@/hooks/redux-hooks';
import { setUIActiveUser } from '@/store/slice/userSlice';
import { IUserInfo } from '@/types/componentInterfaces';
import { EUserRole } from '@/types/enums';
import { transformToUserInfo } from '@/utils/helper';
import { usePathname } from 'next/navigation';
import { getCookies } from '@/utils/helper';

interface IAuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<IAuthGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const {
    data: activeUserData,
    isError: hasActiveUserFetchError,
    isSuccess: isActiveUserFetchSuccess,
    isLoading: isActiveUserFetchLoading,
    refetch: activePageRefetch,
  } = useGetActiveUserQuery();
  const [
    refreshToken,
    {
      isError: hasRefreshTokenError,
      isSuccess: isRefreshTokenSuccess,
      isLoading: isRefreshTokenLoading,
    },
  ] = useRefreshTokenMutation();

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
        //     uiRole: EUserRole.Public,
        //     uiPhotoURL: null,
        //   })
        // );
        await refreshToken();
      }
    };

    fetchUserData();
  }, [activeUserData, dispatch, pathname]);

  return children;
};

export default AuthGuard;

'use client';
import { useNotification } from '@/components/hoc/notification-provider';
import React, { useEffect, useState } from 'react';
import {
  useUserLoginMutation,
  useGetActiveUserQuery,
  useRefreshTokenMutation,
} from '@/api/authApi';
import { IUserInfo, IUserLogin } from '@/types/componentInterfaces';
import { IUserLoginRequest } from '@/types/requestInterfaces';
import { useRouter } from 'next/navigation';
import { decodeJwt, getTokens, transformToUserInfo } from '@/utils/helper';
import { EUserRole } from '@/types/enums';
import { setUIActiveUser } from '@/store/slice/userSlice';
import { useAppDispatch } from '../redux-hooks';

const useUserLogin = () => {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
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

  const router = useRouter();
  const [userLogin, { isSuccess, isError, isLoading }] = useUserLoginMutation();
  const [successMessage, setSuccessMessage] = useState<string>(
    'Your account has been created. Go to you mail to complete verification.'
  );
  const [errorMessage, setErrorMessage] = useState<string>('An error occurred');

  const sendLoginRequest = async (userLoginData: IUserLogin) => {
    try {
      const userLoginRequestData: IUserLoginRequest = {
        UI_Email: userLoginData.email,
        UI_Password: userLoginData.password,
      };
      const response = await userLogin(userLoginRequestData).unwrap();
      activePageRefetch();
      notify('Success', response.message || successMessage, 'success');
      router.replace('/');
    } catch (error: any) {
      notify('Error', error.data.message, 'error');
    }
  };

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
            uiIsSuperAdmin: userProfile.uiRole.includes(EUserRole.SuperAdmin),
            uiId: userProfile.id,
            uiCanEdit:
              userProfile.uiRole.includes(EUserRole.Admin) ||
              userProfile.uiRole.includes(EUserRole.SuperAdmin),
            uiRole: userProfile.uiRole,
            uiPhotoURL: userProfile.uiPhoto,
          })
        );
      } else {
        await refreshToken();
      }
    };

    fetchUserData();
  }, [activeUserData, dispatch]);

  return {
    isSuccess,
    isError,
    successMessage,
    errorMessage,
    isLoading,
    sendLoginRequest,
  };
};

export default useUserLogin;

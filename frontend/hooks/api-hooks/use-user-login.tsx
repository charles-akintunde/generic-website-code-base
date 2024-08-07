'use client';
import { useNotification } from '@/components/hoc/notification-provider';
import React, { useEffect, useState } from 'react';
import { useUserLoginMutation, useGetActiveUserQuery } from '@/api/authApi';
import {
  IUIActiveUser,
  IUserInfo,
  IUserLogin,
} from '@/types/componentInterfaces';
import { IUserLoginRequest } from '@/types/requestInterfaces';
import { useRouter } from 'next/navigation';
import { decodeJwt, getTokens, transformToUserInfo } from '@/utils/helper';
import { EUserRole } from '@/types/enums';
import { useAppSelector } from '../redux-hooks';
import useUserInfo from './use-user-info';
import { setUIActiveUser } from '@/store/slice/userSlice';

const useUserLogin = () => {
  const { notify } = useNotification();
  const {
    data: activeUserData,
    isError: hasActiveUserFetchError,
    isSuccess: isActiveUserFetchSuccess,
    isLoading: isActiveUserFetchLoading,
    refetch: activePageRefetch,
  } = useGetActiveUserQuery();

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
  const { accessToken, refreshToken } = getTokens();
  const currentUser = decodeJwt(accessToken ?? '');
  const currentUserRole = currentUser
    ? String(currentUser.role)
    : String(EUserRole.Public);
  const canEdit =
    currentUserRole == '0' || currentUserRole == '1' ? true : false;
  const isAdmin = currentUserRole == '0' ? true : false;

  useEffect(() => {
    if (activeUserData?.data) {
      const userProfile: IUserInfo = transformToUserInfo(activeUserData?.data);
      dispatch(
        setUIActiveUser({
          uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
          uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
          uiIsAdmin: userProfile.uiRole == EUserRole.Admin,
          uiIsSuperAdmin: userProfile.uiRole == EUserRole.SuperAdmin,
          uiId: userProfile.id,
          uiCanEdit:
            userProfile.uiRole == EUserRole.Admin ||
            userProfile.uiRole == EUserRole.SuperAdmin,
          uiRole: userProfile.uiRole,
          uiPhotoURL: userProfile.uiPhoto,
        })
      );
    }
  }, [activeUserData]);

  const firstName = currentUser && currentUser.firstname;
  const lastName = currentUser && currentUser.lastname;
  const fullName = firstName + ' ' + lastName;
  const initails = firstName && lastName && firstName[0] + lastName[0];

  return {
    isSuccess,
    isError,
    successMessage,
    errorMessage,
    isLoading,
    sendLoginRequest,
    currentUser,
    currentUserRole,
    canEdit,
    isAdmin,
    initails,
  };
};

export default useUserLogin;
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}

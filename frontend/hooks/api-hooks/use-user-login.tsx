'use client';
import { useNotification } from '@/components/hoc/notification-provider';
import React, { useState } from 'react';
import { useUserLoginMutation } from '@/api/authApi';
import { IUserLogin } from '@/types/componentInterfaces';
import { IUserLoginRequest } from '@/types/requestInterfaces';
import { useRouter } from 'next/navigation';
import { decodeJwt, getTokens } from '@/utils/helper';
import { EUserRole } from '@/types/enums';

const useUserLogin = () => {
  const { notify } = useNotification();
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
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.access_token);
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

  return {
    isSuccess,
    isError,
    successMessage,
    errorMessage,
    isLoading,
    sendLoginRequest,
    currentUser,
    currentUserRole,
  };
};

export default useUserLogin;
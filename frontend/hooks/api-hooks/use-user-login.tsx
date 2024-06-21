import { useNotification } from '@/components/hoc/NotificationProvider';
import React, { useState } from 'react';
import { useUserLoginMutation } from '@/api/authApi';
import { IUserLogin } from '@/types/componentInterfaces';
import { IUserLoginRequest } from '@/types/requestInterfaces';
import { useRouter } from 'next/navigation';

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

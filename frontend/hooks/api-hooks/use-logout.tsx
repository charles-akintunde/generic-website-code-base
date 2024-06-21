import { useUserLogoutMutation } from '@/api/authApi';
import { useNotification } from '@/components/hoc/notification-provider';
import React, { useState } from 'react';

const useLogout = () => {
  const { notify } = useNotification();
  const [useLogout, { isSuccess, isLoading }] = useUserLogoutMutation();
  const [successMessage, setSuccessMessage] = useState<string>(
    'Account verification successful'
  );
  const [errorMessage, setErrorMessage] = useState<string>(
    'Account verification failed'
  );

  const sendLogoutRequest = async (handleCloseDrawer: any) => {
    try {
      const response = await useLogout().unwrap();
      notify('Success', response.message || successMessage, 'success');
      handleCloseDrawer();
    } catch (error: any) {
      console.log(error);
      notify(
        'Error',
        error?.data?.message || error?.data?.detail || errorMessage,
        'error'
      );

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };
  return { sendLogoutRequest, isLoading, isSuccess };
};

export default useLogout;

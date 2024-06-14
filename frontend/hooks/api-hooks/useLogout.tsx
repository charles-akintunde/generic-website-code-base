import { useUserLogoutMutation } from '@/api/authApi';
import { useNotification } from '@/components/hoc/NotificationProvider';
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

  const sendLogoutRequest = async () => {
    try {
      const response = await useLogout().unwrap();
      notify('Success', response.message || successMessage, 'success');
    } catch (error: any) {
      notify('Error', error?.data.message || errorMessage, 'error');
    }
  };
  return { sendLogoutRequest, isLoading, isSuccess };
};

export default useLogout;

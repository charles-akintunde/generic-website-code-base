import React, { useState } from 'react';
import { useCreateAccountMutation } from '@/api/authApi';
import { useNotification } from '@/components/hoc/NotificationProvider';
import { ICreatAccountRequest } from '@/types/requestInterfaces';
import { ICreatAccount } from '@/types/componentInterfaces';
import { IGenericResponse } from '@/types/backendResponseInterfaces';

export const useCreateAccount = () => {
  const [createAccount, { isLoading, isError, error, isSuccess }] =
    useCreateAccountMutation();
  const { notify, notifyWithAction } = useNotification();

  const submitCreateAccount = async (data: ICreatAccount) => {
    try {
      const creatAccountRequest: ICreatAccountRequest = {
        UI_FirstName: data.firstname,
        UI_LastName: data.lastname,
        UI_Email: data.email,
        UI_Password: data.password,
      };
      const response = await createAccount(creatAccountRequest).unwrap();

      if (response.data) {
        notify(
          'Success',
          response.data.message ||
            'User verified successfully. Go to you mail to complete verification.',
          'success'
        );
      }
    } catch (err: any) {
      notify('Error', err.data.message || 'An error occurred', 'error');
    }
  };

  return { submitCreateAccount, isLoading, isError };
};

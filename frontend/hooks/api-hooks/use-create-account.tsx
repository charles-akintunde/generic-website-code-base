import React, { useState } from 'react';
import { useCreateAccountMutation } from '../../api/authApi';
import { useNotification } from '../../components/hoc/notification-provider';
import { ICreatAccount } from '../../types/componentInterfaces';
import { ICreatAccountRequest } from '../../types/requestInterfaces';

export const useCreateAccount = () => {
  const [createAccount, { isLoading, isError, error, isSuccess }] =
    useCreateAccountMutation();
  const { notify } = useNotification();
  const [successMessage, setSuccessMessage] = useState<string>(
    'Your account has been created. Go to you mail to complete verification.'
  );
  const [errorMessage, setErrorMessage] = useState<string>('An error occurred');

  const submitCreateAccount = async (data: ICreatAccount) => {
    try {
      const creatAccountRequest: ICreatAccountRequest = {
        UI_FirstName: data.firstname,
        UI_LastName: data.lastname,
        UI_Email: data.email,
        UI_Password: data.password,
      };
      const response = await createAccount(creatAccountRequest).unwrap();

      if (response) {
        setSuccessMessage(response.message);
      }
    } catch (err: any) {
      notify('Error', err.data.message || errorMessage, 'error');
    }
  };

  return { submitCreateAccount, isLoading, isError, isSuccess, successMessage };
};

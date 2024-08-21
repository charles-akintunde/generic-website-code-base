import React, { useState } from 'react';
import { useVerifyAccountMutation } from '@/api/authApi';
import { IToken } from '@/types/requestInterfaces';

const useVerifyAccount = () => {
  const [verifyAccount, { isLoading, isError, isSuccess, error }] =
    useVerifyAccountMutation();
  const [successMessage, setSuccessMessage] = useState<string>(
    'Account verification successful'
  );
  const [errorMessage, setErrorMessage] = useState<string>(
    'Account verification failed'
  );

  const sendAccountVerificationToken = async (token: string) => {
    const tokenRequestData: IToken = {
      token: token,
    };

    try {
      const response = await verifyAccount(tokenRequestData).unwrap();
      setSuccessMessage(response.message);
    } catch (error: any) {
      setErrorMessage(
        error.data?.message || error.data?.detail || errorMessage
      );
    }
  };
  return {
    sendAccountVerificationToken,
    isSuccess,
    isLoading,
    isError,
    error,
    successMessage,
    errorMessage,
  };
};

export default useVerifyAccount;

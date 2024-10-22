'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useVerifyAccount from '../../../../../../hooks/api-hooks/use-verify-account';
import AppRequestResult from '../../../../../../components/common/app-request-result';
import { ArrowRightIcon, ReloadIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Button } from '../../../../../../components/ui/button';

const VerifyUserAccount: React.FC = () => {
  const params = useParams();
  const { type, token } = params as { type: string; token: string };
  const {
    sendAccountVerificationToken,
    isLoading,
    isError,
    isSuccess,
    errorMessage,
    successMessage,
  } = useVerifyAccount();
  const requestStatus = isSuccess ? 'success' : 'error';

  useEffect(() => {
    sendAccountVerificationToken(token);
  }, [token]);

  return (
    <>
      {isSuccess ? (
        <AppRequestResult
          status={requestStatus}
          title="Success"
          subTitle={successMessage}
          extra={[
            <Button
              className="text-white bg-blue-500 flex items-center hover:bg-blue-600 hover:text-white"
              asChild
            >
              <Link href={'/sign-in'}>
                Go to Login Page <ArrowRightIcon className="ml-2" />
              </Link>
            </Button>,
          ]}
        />
      ) : (
        <AppRequestResult
          status={requestStatus}
          title="Error"
          subTitle={errorMessage}
          extra={
            <div className="flex flex-nowrap  justify-center space-x-4">
              <Button
                variant={'outline'}
                className="border border-blue-500 hover:bg-blue-500 text-blue-500 hover:text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center"
                asChild
              >
                <Link href={''}>
                  Retry <ReloadIcon className="ml-2" />
                </Link>
              </Button>
              <Button
                className="text-white text-sm bg-blue-500 hover:bg-blue-600 hover:text-white font-medium py-2 px-4  rounded-md transition duration-200 ease-in-out flex items-center"
                asChild
              >
                <Link href={'/sign-in'}>
                  Go to Login Page <ArrowRightIcon className="ml-2" />
                </Link>
              </Button>
            </div>
          }
        />
      )}
    </>
  );
};

export default VerifyUserAccount;

'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useVerifyAccount from '../../../../../../hooks/api-hooks/use-verify-account';
import AppRequestResult from '../../../../../../components/common/app-request-result';
import { ArrowRightIcon, ReloadIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Button } from '../../../../../../components/ui/button';
import AppLoading from '../../../../../../components/common/app-loading';

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

  if (isLoading || !isError) {
    return <AppLoading />;
  }

  return (
    <>
      {isSuccess ? (
        <AppRequestResult
          status={requestStatus}
          title="Success"
          subTitle={successMessage}
          extra={[
            <Button
              className="text-white bg-primary flex items-center hover:bg-primary hover:text-white"
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
                className="border border-primary hover:bg-primary text-primary hover:text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center"
                asChild
              >
                <Link href={''}>
                  Retry <ReloadIcon className="ml-2" />
                </Link>
              </Button>
              <Button
                className="text-white text-sm bg-primary hover:bg-primary hover:text-white font-medium py-2 px-4  rounded-md transition duration-200 ease-in-out flex items-center"
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

'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useVerifyAccount from '../../../../../../hooks/api-hooks/use-verify-account';
import AppRequestResult from '../../../../../../components/common/app-request-result';
import { ArrowRightIcon, ReloadIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Button } from '../../../../../../components/ui/button';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

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

  const [isTokenSent, setIsTokenSent] = useState(false);

  useEffect(() => {
    if (token && !isTokenSent) {
      sendAccountVerificationToken(token);
      setIsTokenSent(true);
    }
  }, [token, isTokenSent, sendAccountVerificationToken]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
      </div>
    );
  }

  return (
    <>
      {isSuccess ? (
        <AppRequestResult
          status="success"
          title="Success"
          subTitle={successMessage}
          extra={[
            <Button
              key="login"
              className="text-white bg-primary flex items-center hover:bg-primary hover:text-white"
              asChild
            >
              <Link href="/sign-in">
                Go to Login Page <ArrowRightIcon className="ml-2" />
              </Link>
            </Button>,
          ]}
        />
      ) : isError ? (
        <AppRequestResult
          status="error"
          title="Error"
          subTitle={errorMessage}
          extra={
            <div className="flex flex-nowrap justify-center space-x-4">
              <Button
                key="retry"
                variant="outline"
                className="border border-primary hover:bg-primary text-primary hover:text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center"
                onClick={() => window.location.reload()} // Reloads the page
              >
                Retry <ReloadIcon className="ml-2" />
              </Button>
              <Button
                key="login"
                className="text-white text-sm bg-primary hover:bg-primary hover:text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out flex items-center"
                asChild
              >
                <Link href="/sign-in">
                  Go to Login Page <ArrowRightIcon className="ml-2" />
                </Link>
              </Button>
            </div>
          }
        />
      ) : null}
    </>
  );
};

export default VerifyUserAccount;
